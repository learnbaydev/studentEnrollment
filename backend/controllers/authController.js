const pool = require("../config/db");

// ========== GOOGLE CALLBACK FOR LOGIN ==========
const googleCallback = async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    console.log('Attempting login for email:', email);

    // Step 1: Check if user exists
    const [rows] = await pool.query(`
      SELECT 
        id,
        email,
        CONVERT_TZ(user_creation_time, '+00:00', '+05:30') as user_creation_time,
        application_time,
        first_login,
        CONVERT_TZ(ADDTIME(user_creation_time, application_time), '+00:00', '+05:30') as deadline,
        status
      FROM user 
      WHERE email = ?`,
      [email]
    );

    if (rows.length === 0) {
      console.log('No user found with email:', email);
      return done(null, false, { message: "Email not registered." });
    }

    const user = rows[0];

    // Step 2: Log user data
    console.log('User details:', {
      email: user.email,
      status: user.status,
      user_creation_time: user.user_creation_time,
      application_time: user.application_time,
      first_login: user.first_login,
      deadline: user.deadline
    });

    // Step 3: Check status
    if (user.status !== 'Active') {
      console.log('User status is not active');
      return done(null, false, { message: "Account is inactive. Please contact support." });
    }

    // Step 4: Update first_login if not already set (in IST)
    if (!user.first_login) {
      await pool.query(
        `UPDATE user 
         SET first_login = CONVERT_TZ(NOW(), '+00:00', '+05:30')
         WHERE email = ? AND first_login IS NULL`,
        [email]
      );
      user.first_login = new Date(); // Update local object for immediate use
    }

    // Step 5: Success
    console.log('Authentication successful');
    done(null, user);

  } catch (err) {
    console.error('Authentication error:', err);
    done(err);
  }
};

// ========== TIME VALIDITY CHECK ==========
const checkUserTimeValidity = async (req, res) => {
  try {
    const { email } = req.user;
    console.log('Checking time validity for email:', email);

    // Step 1: Fetch user data with IST timezone conversion
    const [rows] = await pool.query(`
      SELECT 
        id,
        email,
        CONVERT_TZ(user_creation_time, '+00:00', '+05:30') as user_creation_time,
        application_time,
        first_login,
        CONVERT_TZ(ADDTIME(user_creation_time, application_time), '+00:00', '+05:30') as deadline,
        status
      FROM user 
      WHERE email = ?`,
      [email]
    );

    if (rows.length === 0) {
      console.log('No user found for time validity check');
      return res.status(404).json({ message: "User not found" });
    }

    const user = rows[0];

    // Step 2: Update first_login if not already set (in IST)
    if (!user.first_login) {
      await pool.query(
        `UPDATE user 
         SET first_login = CONVERT_TZ(NOW(), '+00:00', '+05:30')
         WHERE email = ? AND first_login IS NULL`,
        [email]
      );
      // Fetch updated record
      const [updatedRows] = await pool.query(`
        SELECT 
          first_login,
          CONVERT_TZ(ADDTIME(user_creation_time, application_time), '+00:00', '+05:30') as deadline
        FROM user 
        WHERE email = ?`,
        [email]
      );
      user.first_login = updatedRows[0].first_login;
      user.deadline = updatedRows[0].deadline;
    }

    // Step 3: Check time validity
    const deadline = new Date(user.deadline);
    const firstLogin = new Date(user.first_login);
    const isValid = deadline >= firstLogin;

    console.log('Time validity calculation:', {
      userCreationTime: user.user_creation_time,
      applicationTime: user.application_time,
      firstLogin: user.first_login,
      deadline: user.deadline,
      isValid: isValid,
      status: user.status
    });

    res.json({
      isValid,
      timeData: {
        creationTime: user.user_creation_time,
        applicationTime: user.application_time,
        firstLogin: user.first_login,
        deadline: user.deadline,
        status: user.status
      }
    });

  } catch (error) {
    console.error('Error checking time validity:', error);
    res.status(500).json({ message: "Error checking time validity" });
  }
};

module.exports = {
  googleCallback,
  checkUserTimeValidity
};