const cron = require("node-cron");
const axios = require("axios");
const db = require("../config/db");

cron.schedule("0 * * * *", async () => {
  const time = new Date().toISOString();
  try {
    const [rows] = await db.query("SELECT webhook_discord FROM config LIMIT 1");
    const webhook = rows[0]?.webhook_discord;

    if (!webhook) {
      console.warn(`[${time}] ⚠️ No webhook found in DB.`);
      return;
    }

    await axios.post(webhook, {
      username: "Health Bot",
      content: `✅ Hourly check: Webhook is working fine at ${time}`,
    });

    console.log(`[${time}] ✅ Health check sent to Discord.`);
  } catch (err) {
    console.error(`[${time}] ❌ Health check failed:`, err.message);
  }
});
