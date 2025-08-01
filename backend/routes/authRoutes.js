const router = require("express").Router();
const passport = require("passport");
const { checkUserTimeValidity } = require("../controllers/authController");

// Initiate Google OAuth login
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

// Handle Google OAuth callback
router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", (err, user, info) => {
    if (err) {
      return res.redirect(
        `${
          process.env.FAILURE_REDIRECT_URL || "http://localhost:3000/invalid"
        }?error=server_error`
      );
    }

    if (!user) {
      console.log("Authentication failed ------>", { info, user, err });
      const errorMessage = encodeURIComponent(
        info?.message || "Authentication failed"
      );
      return res.redirect(
        `${
          process.env.FAILURE_REDIRECT_URL || "http://localhost:3000/invalid"
        }?error=${errorMessage}&email=${info?.email || "not-found"}`
      );
    }

    req.logIn(user, (err) => {
      if (err) {
        return res.redirect(
          `${
            process.env.FAILURE_REDIRECT_URL || "http://localhost:3000/invalid"
          }?error=login_error`
        );
      }
      return res.redirect(
        process.env.SUCCESS_REDIRECT_URL || "http://localhost:3000/dashboard"
      );
    });
  })(req, res, next);
});

// Check time validity for dashboard access
router.get("/check-time-validity", (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  checkUserTimeValidity(req, res);
});

// Check login status
router.get("/check-auth", (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(200).json({ isAuthenticated: true, user: req.user });
  } else {
    return res.status(200).json({ isAuthenticated: false });
  }
});

// Logout route
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    req.session.destroy(() => {
      res.clearCookie("connect.sid"); // default cookie name
      res.status(200).json({ message: "Logged out successfully" });
    });
  });
});

module.exports = router;
