const router = require("express").Router();
const passport = require("passport");

// Initiate Google OAuth login
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Handle Google OAuth callback
router.get("/google/callback", passport.authenticate("google", {
  failureRedirect: process.env.FAILURE_REDIRECT_URL || "http://localhost:3000/invalid",
  session: true
}), (req, res) => {
  // Successful login
  res.redirect(process.env.SUCCESS_REDIRECT_URL || "http://localhost:3000/dashboard");
});

// Check login status
// router.get("/check-auth", (req, res) => {
//   if (req.isAuthenticated()) {
//     res.status(200).json({ isAuthenticated: true, user: req.user });
//   } else {
//     res.status(200).json({ isAuthenticated: false });
//   }
// });
// routes/authRoutes.js
router.get("/check-auth", (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(200).json({ isAuthenticated: true, user: req.user });
  } else {
    return res.status(200).json({ isAuthenticated: false });
  }
});

// routes/authRoutes.js
router.get("/logout", (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    req.session.destroy(() => {
      res.clearCookie("connect.sid"); // default cookie name
      res.status(200).json({ message: "Logged out successfully" });
    });
  });
});

module.exports = router;
