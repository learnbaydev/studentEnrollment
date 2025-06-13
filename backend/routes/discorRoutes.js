const express = require("express");
const router = express.Router();
const { notifyDiscord } = require("../controllers/discordWebhookController");

router.post("/notify-discord", notifyDiscord);

module.exports = router;
