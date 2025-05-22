const pool = require("../config/db");

const googleCallback = async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;

    const [rows] = await pool.query('SELECT * FROM user WHERE email = ?', [email]);

    if (rows.length === 0) {
      // Optional: Redirect to /invalid if user is not registered
      return done(null, false, { message: "Email not registered." });
    }

    const user = rows[0];
    done(null, user);
  } catch (err) {
    done(err);
  }
};

module.exports = { googleCallback };
