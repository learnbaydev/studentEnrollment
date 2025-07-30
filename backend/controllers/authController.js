const pool = require("../config/db");

// ========== GOOGLE CALLBACK FOR LOGIN ==========
const moment = require("moment-timezone");

const googleCallback = async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;

    const [rows] = await pool.query(
      `
      SELECT 
        id, email,
        user_creation_time,
        application_time,
        first_login,
        ADDTIME(user_creation_time, application_time) as deadline,
        status
      FROM user 
      WHERE email = ?`,
      [email]
    );

    if (rows.length === 0)
      return done(null, false, { message: "Email not registered.", email });

    const user = rows[0];

    // Subtract 5h 30m manually
    user.deadline = moment(user.deadline)
      .subtract(5, "hours")
      .subtract(30, "minutes")
      .toDate();
    if (user.first_login) {
      user.first_login = moment(user.first_login)
        .subtract(5, "hours")
        .subtract(30, "minutes")
        .toDate();
    }

    if (user.status !== "Active")
      return done(null, false, { message: "Account is inactive." });

    if (!user.first_login) {
      await pool.query(
        `UPDATE user SET first_login = NOW() WHERE email = ? AND first_login IS NULL`,
        [email]
      );
      user.first_login = new Date();
    }

    done(null, user);
  } catch (err) {
    console.error("Authentication error:", err);
    done(err);
  }
};

// ========== TIME VALIDITY CHECK ==========
const checkUserTimeValidity = async (req, res) => {
  try {
    const { email } = req.user;

    const [rows] = await pool.query(
      `
      SELECT 
        id, email,
        user_creation_time,
        application_time,
        first_login,
        ADDTIME(user_creation_time, application_time) as deadline,
        status
      FROM user 
      WHERE email = ?`,
      [email]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "User not found" });

    const user = rows[0];

    if (!user.first_login) {
      await pool.query(
        `
        UPDATE user SET first_login = NOW() WHERE email = ? AND first_login IS NULL`,
        [email]
      );

      const [updatedRows] = await pool.query(
        `
        SELECT first_login, ADDTIME(user_creation_time, application_time) as deadline
        FROM user WHERE email = ?`,
        [email]
      );

      user.first_login = updatedRows[0].first_login;
      user.deadline = updatedRows[0].deadline;
    }

    // Subtract 5:30 manually
    const deadline = moment(user.deadline)
      .subtract(5, "hours")
      .subtract(30, "minutes");
    const firstLogin = moment(user.first_login)
      .subtract(5, "hours")
      .subtract(30, "minutes");

    const isValid = deadline.isSameOrAfter(firstLogin);

    res.json({
      isValid,
      timeData: {
        creationTime: user.user_creation_time,
        applicationTime: user.application_time,
        firstLogin: firstLogin.format("YYYY-MM-DD HH:mm:ss"),
        deadline: deadline.format("YYYY-MM-DD HH:mm:ss"),
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Error checking time validity:", error);
    res.status(500).json({ message: "Error checking time validity" });
  }
};

module.exports = {
  googleCallback,
  checkUserTimeValidity,
};
