const express = require("express");
const submitRegisterFrom = require("../controllers/registerController");

const router = express.Router();

router.post("/", submitRegisterFrom);

module.exports = router;
