const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const googleCallback = require("../services/googleCallback");

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, googleCallback));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const User = require("../models/User");
  const user = await User.findById(id);
  done(null, user);
});
