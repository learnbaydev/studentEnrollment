const pool = require("../config/db");

const googleCallback = async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    console.log('Attempting login for email:', email);

    // Check both email and status
    const [rows] = await pool.query(`
      SELECT *,
      ADDTIME(user_creation_time, application_time) as deadline
      FROM user 
      WHERE email = ?`, [email]);

    console.log('Database query result:', rows[0]);

    if (rows.length === 0) {
      console.log('No user found with email:', email);
      return done(null, false, { message: "Email not registered." });
    }

    const user = rows[0];
    
    // Log user details
    console.log('User details:', {
      email: user.email,
      status: user.status,
      user_creation_time: user.user_creation_time,
      application_time: user.application_time,
      first_login: user.first_login,
      deadline: user.deadline
    });

    // Check time validity first
    // const deadline = new Date(user.deadline);
    // const firstLogin = user.first_login ? new Date(user.first_login) : new Date();
    // const isTimeValid = deadline >= firstLogin;

    // console.log('Time validity check:', {
    //   deadline: deadline,
    //   firstLogin: firstLogin,
    //   isTimeValid: isTimeValid
    // });

    // Only check status if time is valid
    // if (!isTimeValid) {
    //   console.log('Time validation failed');
    //   return done(null, false, { message: "Time lapsed. Please contact support." });
    // }

    // Now check status
    console.log('Checking user status:', user.status);
    if (user.status !== 'Active') {
      console.log('User status is not active');
      return done(null, false, { message: "Account is inactive. Please contact support." });
    }

    console.log('Authentication successful');
    done(null, user);
  } catch (err) {
    console.error('Authentication error:', err);
    done(err);
  }
};

// const checkUserTimeValidity = async (req, res) => {
//   try {
//     const { email } = req.user;
//     console.log('Checking time validity for email:', email);

//     const [rows] = await pool.query(`
//       SELECT 
//         user_creation_time,
//         application_time,
//         first_login,
//         ADDTIME(user_creation_time, application_time) as deadline,
//         status
//       FROM user 
//       WHERE email = ?`,
//       [email]
//     );

   

//     if (rows.length === 0) {
//       console.log('No user found for time validity check');
//       return res.status(404).json({ message: "User not found" });
//     }

//     const user = rows[0];
//     console.log('User data for time check:', user);
//     // ✅ Update first_login only if not already set
//     await pool.query(
//       `UPDATE user 
//        SET first_login = CONVERT_TZ(NOW(), '+00:00', '+05:30')
//        WHERE id = ? AND (first_login IS NULL OR first_login = '' OR first_login = '0000-00-00 00:00:00')`,
//       [user.id]
//     );
    
//     const deadline = new Date(user.deadline);
//     const firstLogin = user.first_login ? new Date(user.first_login) : new Date();

//     const isValid = deadline >= firstLogin;

//     console.log('Time validity calculation:', {
//       userCreationTime: user.user_creation_time,
//       applicationTime: user.application_time,
//       firstLogin: user.first_login,
//       deadline: deadline.toISOString(),
//       isValid: isValid,
//       status: user.status
//     });

//     res.json({
//       isValid,
//       timeData: {
//         creationTime: user.user_creation_time,
//         applicationTime: user.application_time,
//         firstLogin: user.first_login,
//         deadline: user.deadline,
//         status: user.status
//       }
//     });

//   } catch (error) {
//     console.error('Error checking time validity:', error);
//     res.status(500).json({ message: "Error checking time validity" });
//   }
// };

const checkUserTimeValidity = async (req, res) => {
  try {
    const { email } = req.user;
    console.log('Checking time validity for email:', email);

    // Step 1: Update first_login if not already set
    await pool.query(
      `UPDATE user 
       SET first_login = CONVERT_TZ(NOW(), '+00:00', '+05:30')
       WHERE email = ? AND (first_login IS NULL OR first_login = '' OR first_login = '0000-00-00 00:00:00')`,
      [email]
    );

    // Step 2: Fetch updated user data
    const [rows] = await pool.query(`
      SELECT 
        id,
        user_creation_time,
        application_time,
        first_login,
        ADDTIME(user_creation_time, application_time) as deadline,
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
    const deadline = new Date(user.deadline);
    const firstLogin = new Date(user.first_login);

    const isValid = deadline >= firstLogin;

    console.log('Time validity calculation:', {
      userCreationTime: user.user_creation_time,
      applicationTime: user.application_time,
      firstLogin: user.first_login,
      deadline: deadline.toISOString(),
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


module.exports = { googleCallback, checkUserTimeValidity };
