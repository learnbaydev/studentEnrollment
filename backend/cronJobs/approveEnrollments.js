const db = require("../config/db");
const cron = require("node-cron");

cron.schedule("* * * * *", async () => {
  try {
    const [result] = await db.query(`
      UPDATE enrollment_details
      SET enrollment_status = 'approved'
      WHERE enrollment_status = 'pending'
        AND TIMESTAMPDIFF(MINUTE, created_at, NOW()) >= 10
    `);

    if (result.affectedRows > 0) {
      console.log(`✅ Auto-approved ${result.affectedRows} enrollments`);
    }
  } catch (err) {
    console.error("❌ Error in auto-approval cron job:", err);
  }
});
