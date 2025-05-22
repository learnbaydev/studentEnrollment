// server.js or app.js
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
// const connectDB = require("./config/db");
const offerLetterRoutes = require('./routes/offerLetterRoutes');
const  enrollmentRoutes= require('./routes/enrollmentRoutes')
const db = require("./config/db"); 
const socketIO = require("socket.io"); 
const path = require('path');
const scheduleRoutes = require('./routes/scheduleRoutes'); 
const paymentStatusRouter = require('./routes/payment-status');

require("dotenv").config();
const http = require("http"); 

const app = express();
app.use(express.json()); 

(async () => {
    try {
      const [rows] = await db.query("SELECT 1"); // simple test query
      console.log("✅ MySQL connected");
    } catch (error) {
      console.error("❌ DB connection failed:", error);
      process.exit(1); // exit if connection fails
    }
  })();

app.use(session({
  secret: 'your_secret',
  resave: false,
  saveUninitialized: true,
}));

const server = http.createServer(app); 
const io = socketIO(server, {
  cors: {
    origin:process.env.CLIENT_URL, 
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cors({ origin:process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());
// Passport initialization
app.use(passport.initialize());
app.use(passport.session());
app.use('/api/offer', offerLetterRoutes);


require("./config/passport"); // Make sure this file contains the GoogleStrategy registration


app.use(cors({
  origin: "",
  credentials: true
}));





app.use('/pdfs', express.static(path.join(__dirname, 'public/pdfs')));
app.use('/api/offer', offerLetterRoutes);

// app.use('/api/meeting', meetingRoutes);

app.get("/api/check-auth", (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(200).json({
      authenticated: true,
      user: req.user,
    });
  } else {
    return res.status(401).json({
      authenticated: false,
    });
  }
});


app.use(express.json());

// Routes
app.use("/auth", require("./routes/authRoutes"));


app.use('/api/payment-status', paymentStatusRouter);

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/login"); 
  }
  

  app.get("/", isLoggedIn, (req, res) => {
    res.send(`Welcome ${req.user.name}`);
  });

  app.use("/api", enrollmentRoutes);
  

  
app.use('/api/schedule', scheduleRoutes);
app.listen(5000, () => {
  console.log("Server started on http://localhost:5000");
});
