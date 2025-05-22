const express = require("express");
const {
  submitEnrollmentForm,
  checkEnrollmentStatus,
  getEnrollmentSteps,
  getEnrollmentProgress, // ✅ Add this
} = require("../controllers/enrollmentController");

const router = express.Router();

router.post("/enroll", submitEnrollmentForm);
router.get("/enroll/check", checkEnrollmentStatus);
router.get("/enroll/status", getEnrollmentSteps);
router.get("/enrollment/progress", getEnrollmentProgress); // ✅ Fixed

module.exports = router;
