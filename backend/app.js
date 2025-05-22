// server.js or app.js
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();
connectDB();
// Session setup if needed
app.use(session({
  secret: 'your_secret',
  resave: false,
  saveUninitialized: true,
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// ✅ Register passport strategies BEFORE routes
require("./config/passport"); // Make sure this file contains the GoogleStrategy registration

// ✅ Enable CORS
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// Body parser
app.use(express.json());

// Routes
app.use("/auth", require("./routes/authRoutes"));

// Start the server
app.listen(5000, () => {
  console.log("Server started on http://localhost:5000");
});
