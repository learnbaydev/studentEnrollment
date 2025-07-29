const db = require("../config/db");
const moment = require("moment-timezone");

const submitRegisterFrom = async (req, res) => {
  try {
    const { email, full_name, mobile, program } = req.body;
    const currentTime = moment()
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss");

    // Validate input
    if (!email || !full_name || !mobile || !program) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: email, full_name, mobile, program",
      });
    }
    // 2. TODO: Check if user already exists with this email
    const [existingUsers] = await db.query(
      "SELECT id FROM user WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        // 409 Conflict is appropriate for duplicate resource
        success: false,
        error: "User with this email already exists.",
      });
    }

    // 3. TODO: Write data to the user table
    const [result] = await db.query(
      "INSERT INTO user (email, name, mobile, program_name, application_time, user_creation_time, discount, status, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        email,
        full_name,
        mobile,
        program,
        currentTime,
        currentTime,
        0.0,
        "Active",
        "pass@123",
      ]
    );

    // Check if the insertion was successful
    if (result.affectedRows === 0) {
      throw new Error("Failed to insert user into database.");
      return res.status(500).json({ error: "Error in registering student" });
    }

    return res.status(201).json({
      message: "Register Successfully",
      success: true,
      userId: result.id,
    });
  } catch (error) {
    console.error("Error in registering student:", error);
    return res.status(500).json({ error: "Error in registering student" });
  }
};

module.exports = submitRegisterFrom;
