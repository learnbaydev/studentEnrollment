const db = require("../config/db");
const moment = require("moment-timezone");
const cron = require("node-cron");

// Submit enrollment form
const submitEnrollmentForm = async (req, res) => {
  const {
    email,
    full_name,
    // domain,
    experience_years,
    graduation_year,
    current_company,
    current_job_title,
    aspiring_designation,
    current_ctc,
    expected_ctc,
    aspiring_companies,
    motivation,
    expectations,
    programming_rating,
    linkedin_profile,
    evaluator_rating,
    native_city,
  } = req.body;

  const requiredFields = {
    email,
    full_name,
    // domain,
    experience_years,
    graduation_year,
    current_company,
    current_job_title,
    current_ctc,
    expected_ctc,
    aspiring_companies,
    motivation,
    expectations
  };
  
  const missingFields = Object.entries(requiredFields).filter(
    ([_, value]) => !value || value.toString().trim() === ""
  );
  
  if (missingFields.length > 0) {
    return res.status(400).json({
      message: `Missing required fields: ${missingFields.map(([key]) => key).join(", ")}`
    });
  }
  
  try {
    const [userRows] = await db.query("SELECT id FROM user WHERE email = ?", [email]);

    if (userRows.length === 0) {
      return res.status(404).json({ message: "User with this email does not exist" });
    }

    const userId = userRows[0].id;

    const [enrollmentRows] = await db.query("SELECT id FROM enrollment_details WHERE user_id = ?", [userId]);

    if (enrollmentRows.length > 0) {
      return res.status(409).json({ message: "User already enrolled" });
    }

    const istTime = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

    const insertQuery = `
      INSERT INTO enrollment_details 
       (user_id, email, full_name, experience_years, graduation_year, 
 current_company, current_job_title, aspiring_designation, current_ctc, 
 expected_ctc, aspiring_companies, motivation, expectations, 
 enrollment_status, created_at, programming_rating, linkedin_profile, 
 evaluator_rating, native_city)

VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(insertQuery, [
      userId,
      email,
      full_name,
      // domain,
      experience_years,
      graduation_year,
      current_company,
      current_job_title,
      aspiring_designation || null,
      current_ctc,
      expected_ctc,
      aspiring_companies,
      motivation,
      expectations,
      "pending",
      istTime,
      programming_rating || null,
      linkedin_profile || null,
      evaluator_rating || null,
      native_city || null,
    ]);

    return res.status(201).json({
      message: "Enrollment successful. Status is pending for approval.",
      enrollmentId: result.insertId,
    });
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


// Check if user is already enrolled
const checkEnrollmentStatus = async (req, res) => {
  const { email } = req.query;

  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const [userRows] = await db.query("SELECT id FROM user WHERE email = ?", [email]);

    if (userRows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const userId = userRows[0].id;

    const [enrollmentRows] = await db.query("SELECT id FROM enrollment_details WHERE user_id = ?", [userId]);

    const alreadyEnrolled = enrollmentRows.length > 0;

    return res.status(200).json({ alreadyEnrolled });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get status of all enrollment steps
const getEnrollmentSteps = async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: "Email is required" });
  try {
    const [userRows] = await db.query("SELECT id FROM user WHERE email = ?", [email]);
    if (userRows.length === 0) return res.status(404).json({ message: "User not found" });

    const userId = userRows[0].id;
    const [rows] = await db.query(
      "SELECT enrollment_status AS step1, step2_status AS step2, step3_status AS step3, step4_status AS step4 FROM enrollment_details WHERE user_id = ?",
      [userId]
    );

    if (rows.length === 0)
      return res.status(200).json({ step1: "pending", step2: "pending", step3: "pending", step4: "pending" });

    return res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// // Cron job to auto-approve enrollments after 10 minutes
// cron.schedule("* * * * *", async () => {
//   try {
//     const [result] = await db.query(`
//       UPDATE enrollment_details
//       SET enrollment_status = 'approved'
//       WHERE enrollment_status = 'pending'
//         AND TIMESTAMPDIFF(MINUTE, created_at, NOW()) >= 10
//     `);

//     if (result.affectedRows > 0) {
//       console.log(`✅ Auto-approved ${result.affectedRows} enrollments`);
//     }
//   } catch (err) {
//     console.error("❌ Error in auto-approval cron job:", err);
//   }
// });

cron.schedule("* * * * *", async () => {
  try {
    const [result] = await db.query(`
      UPDATE enrollment_details
      SET enrollment_status = 'approved',
          step1_timestamp = NOW()
      WHERE enrollment_status = 'pending'
        AND TIMESTAMPDIFF(SECOND, created_at, NOW()) >= 120
    `);

    if (result.affectedRows > 0) {
      console.log(`✅ Auto-approved ${result.affectedRows} enrollments after 2 minutes`);
    }
  } catch (err) {
    console.error("❌ Error in auto-approval cron job:", err);
  }
});
// const getEnrollmentProgress = async (req, res) => {
//   const { email } = req.query;
//   if (!email) return res.status(400).json({ message: "Email is required" });

//   try {
//     const [userRows] = await db.query("SELECT id FROM user WHERE email = ?", [email]);
//     if (userRows.length === 0) return res.status(404).json({ message: "User not found" });

//     const userId = userRows[0].id;
//     const [rows] = await db.query(
//       "SELECT enrollment_status AS step1, step2_status AS step2, step3_status AS step3, step4_status AS step4, created_at FROM enrollment_details WHERE user_id = ?",
//       [userId]
//     );

//     if (rows.length === 0) {
//       return res.status(200).json({
//         step1: "pending",
//         step2: "pending",
//         step3: "pending",
//         step4: "pending",
//         progress: "0%",
//       });
//     }

//     const { step1, step2, step3, step4, created_at } = rows[0];

//     // Calculate time elapsed since creation
//     const createdAt = moment(created_at);
//     const now = moment();
//     const minutesElapsed = now.diff(createdAt, 'minutes');

//     // If status is pending and less than 10 minutes have passed, consider it in_progress
//     const adjustedStep1 = step1 === 'pending' && minutesElapsed < 10 ? 'in_progress' : step1;

//     // Calculate progress
//     let completedSteps = 0;
//     if (adjustedStep1 === "approved") completedSteps++;
//     if (step2 === "approved") completedSteps++;
//     if (step3 === "approved") completedSteps++;
//     if (step4 === "approved") completedSteps++;

//     const progress = `${(completedSteps / 4) * 100}%`;

//     return res.status(200).json({
//       step1: adjustedStep1,
//       step2,
//       step3,
//       step4,
//       progress,
//       created_at // Send this to frontend for timer calculation
//     });
//   } catch (err) {
//     console.error("Progress API error:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// };
const getEnrollmentProgress = async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const [userRows] = await db.query("SELECT id FROM user WHERE email = ?", [email]);
    if (userRows.length === 0) return res.status(404).json({ message: "User not found" });

    const userId = userRows[0].id;
    const [rows] = await db.query(
      "SELECT enrollment_status AS step1, step2_status AS step2, step3_status AS step3, step4_status AS step4, created_at, step1_timestamp FROM enrollment_details WHERE user_id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return res.status(200).json({
        step1: "pending",
        step2: "pending",
        step3: "pending",
        step4: "pending",
        progress: "0%",
      });
    }

    const { step1, step2, step3, step4, created_at, step1_timestamp } = rows[0];

    // Calculate time elapsed since creation
    const createdAt = moment(created_at);
    const now = moment();
    const secondsElapsed = now.diff(createdAt, 'seconds');

    // If status is pending and less than 2 minutes have passed, consider it in_progress
    const adjustedStep1 = step1 === 'pending' && secondsElapsed < 120 ? 'in_progress' : 
                         step1 === 'pending' && secondsElapsed >= 120 ? 'approved' : 
                         step1;

    // Calculate progress
    let completedSteps = 0;
    if (adjustedStep1 === "approved") completedSteps++;
    if (step2 === "approved") completedSteps++;
    if (step3 === "approved") completedSteps++;
    if (step4 === "approved") completedSteps++;

    const progress = `${(completedSteps / 4) * 100}%`;

    return res.status(200).json({
      step1: adjustedStep1,
      step2,
      step3,
      step4,
      progress,
      created_at, // Send this to frontend for timer calculation
      step1_timestamp: step1_timestamp || created_at // Use step1_timestamp if available, otherwise created_at
    });
  } catch (err) {
    console.error("Progress API error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


// In your enrollmentController.js
const updateStepStatus = async (req, res) => {
  const { email, step, status } = req.body;

  try {
    // Update the specific step in enrollment_details
    await db.query(
      `UPDATE enrollment_details 
       SET ${step} = ?, ${step}_timestamp = NOW() 
       WHERE email = ?`,
      [status, email]
    );

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error updating step status:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
const checkPaymentStatus = async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const [userRows] = await db.query("SELECT id FROM user WHERE email = ?", [email]);
    if (userRows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const [paymentRows] = await db.query(
      "SELECT payment_status FROM user WHERE email = ?",
      [email]
    );

    if (paymentRows.length === 0) {
      return res.status(200).json({ payment_status: null });
    }

    const statusRaw = paymentRows[0].payment_status;

    let paymentStatus;

    if (statusRaw === null) {
      paymentStatus = null;
    } else if (statusRaw === '') {
      paymentStatus = '';
    } else if (Number(statusRaw) === 0) {
      paymentStatus = 0;
    } else if (Number(statusRaw) === 1) {
      paymentStatus = 1;
    } else {
      paymentStatus = null; // fallback if unexpected
    }

    return res.status(200).json({ payment_status: paymentStatus });

  } catch (err) {
    console.error("Payment status check error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};



const initiatePaymentStatus = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const [result] = await db.query(
      `UPDATE user SET payment_status = '' WHERE email = ? AND payment_status IS NULL`,
      [email]
    );

    if (result.affectedRows > 0) {
      return res.status(200).json({ message: "Payment status set to processing ('')" });
    } else {
      return res.status(200).json({ message: "Payment already started or user not found" });
    }
  } catch (err) {
    console.error("Error updating payment_status to '':", err);
    return res.status(500).json({ message: "Server error" });
  }
};


const markTokenReceived = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const [result] = await db.query(
      `UPDATE user SET payment_status = 0 WHERE email = ? AND payment_status = ''`,
      [email]
    );

    if (result.affectedRows > 0) {
      return res.status(200).json({ message: "Payment status set to token received (0)" });
    } else {
      return res.status(200).json({ message: "User not in processing stage or not found" });
    }
  } catch (err) {
    console.error("Error updating payment_status to 0:", err);
    return res.status(500).json({ message: "Server error" });
  }
};





module.exports = {
  submitEnrollmentForm,
  checkEnrollmentStatus,
  getEnrollmentSteps,
  getEnrollmentProgress,
  checkPaymentStatus,
  
  updateStepStatus,
  initiatePaymentStatus,
  markTokenReceived 

};

