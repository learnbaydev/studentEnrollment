const axios = require("axios");
const fs = require("fs");
const path = require("path");
const db = require("../config/db"); // ✅ assuming your DB config is here

const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1383016578299330560/F57zQ4AjkCUDR_bUztCfq9LwT4rzekL5DMd6KSfhQkqja45_5nujVEfxGMHGlz1sOL0v";
const logPath = path.join(__dirname, "../logs/discord_notify_log.txt");

exports.notifyDiscord = async (req, res) => {
  const time = new Date().toISOString();
  const body = req.body;

  const {
    email,
    full_name,
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
  } = body;

  const rawLog = `[${time}] ▶️ Incoming Discord Notification:\n${JSON.stringify(body, null, 2)}\n`;
  fs.appendFileSync(logPath, rawLog);

  try {
    // 🔍 Fetch ism_name from user table
    const [userRows] = await db.query("SELECT ism_name FROM user WHERE email = ?", [email]);

    const ism_name = userRows.length > 0 ? userRows[0].ism_name : "Team";

    // 📄 Compose message
    const message = `
🎉 **Hey ${ism_name}, ${full_name} has successfully submitted the evaluation form!**
`;

    // 🔗 Send to Discord
    const discordResponse = await axios.post(DISCORD_WEBHOOK_URL, {
      username: "Enrollment Bot",
      avatar_url: "https://cdn-icons-png.flaticon.com/512/455/455705.png",
      content: message,
    });

    fs.appendFileSync(logPath, `[${time}] ✅ Sent to Discord. Status: ${discordResponse.status}\n\n`);
    return res.status(200).json({ success: true, message: "Notification sent to Discord" });
  } catch (error) {
    fs.appendFileSync(logPath, `[${time}] ❌ Error: ${error.message}\n\n`);
    console.error("❌ Discord Error:", error.message);
    return res.status(500).json({ success: false, message: "Failed to send to Discord" });
  }
};
