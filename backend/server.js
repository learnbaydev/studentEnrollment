// server.js
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const path = require("path");
const http = require("http");
const socketIO = require("socket.io");
const db = require("./config/db");

// Import routes
const offerLetterRoutes = require("./routes/offerLetterRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const paymentStatusRouter = require("./routes/payment-status");
const authRoutes = require("./routes/authRoutes");

// Initialize express app
const app = express();

// Ensure express understands JSON
app.use(express.json());

// Trust proxy (required for correct cookie behavior behind NGINX/HTTPS)
app.set("trust proxy", 1);

// ✅ Secure & domain-aware session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true, // only works with HTTPS
      sameSite: "lax",
      domain: "app.lbayms.in", // your production domain
    },
  })
);

// ✅ CORS (important for frontend-backend cookie communication)
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// ✅ Initialize Passport
require("./config/passport");
app.use(passport.initialize());
app.use(passport.session());

// ✅ MySQL test connection
(async () => {
  try {
    await db.query("SELECT 1");
    console.log("✅ MySQL connected");
  } catch (error) {
    console.error("❌ DB connection failed:", error);
    process.exit(1);
  }
})();

// ✅ Routes
app.use("/auth", authRoutes);
app.use("/api/offer", offerLetterRoutes);
app.use("/api", enrollmentRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/payment-status", paymentStatusRouter);
app.use("/pdfs", express.static(path.join(__dirname, "public/pdfs")));

// ✅ Check Auth Status API
app.get("/api/check-auth", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({
      authenticated: true,
      user: req.user,
    });
  } else {
    res.status(401).json({
      authenticated: false,
    });
  }
});

// ✅ Default route
app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`Welcome ${req.user.name}`);
  } else {
    res.redirect("/login");
  }
});

// ✅ Start HTTP server with Socket.IO
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ✅ Start app
server.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 Server started on ${process.env.SERVER_URL}`);
});
