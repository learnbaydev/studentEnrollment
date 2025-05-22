const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('../config/db');
const { googleCallback } = require('../controllers/authController');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    googleCallback
  )
);

// Serialize user (store user ID in session)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user (fetch full user from DB by ID)
passport.deserializeUser(async (id, done) => {
  try {
    const [rows] = await pool.query('SELECT * FROM user WHERE id = ?', [id]);
    if (rows.length === 0) return done(null, false);
    return done(null, rows[0]);
  } catch (err) {
    return done(err);
  }
});
