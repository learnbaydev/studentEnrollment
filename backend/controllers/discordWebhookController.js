const axios = require("axios");
const fs = require("fs");
const path = require("path");
const db = require("../config/db");

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
    // Get webhook URL from DB
    const [configRows] = await db.query("SELECT webhook_discord FROM config LIMIT 1");
    const DISCORD_WEBHOOK_URL = configRows.length > 0 ? configRows[0].webhook_discord : null;

    if (!DISCORD_WEBHOOK_URL) {
      throw new Error("Discord webhook URL not found in DB.");
    }

    // Get ism_name from user table
    const [userRows] = await db.query("SELECT ism_name FROM user WHERE email = ?", [email]);
    const ism_name = userRows.length > 0 ? userRows[0].ism_name : "Team";

    // Compose Discord message
    const message = `
🎉 **Hey ${ism_name}, ${full_name} has successfully submitted the evaluation form!**
`;

    // Send message to Discord
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
