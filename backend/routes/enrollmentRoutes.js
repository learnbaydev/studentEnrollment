const express = require("express");
const {
  submitEnrollmentForm,
  checkEnrollmentStatus,
  getEnrollmentSteps,
  getEnrollmentProgress,
  checkPaymentStatus,
  updateStepStatus,
  initiatePaymentStatus,
  markTokenReceived,
  // updatePaymentStatus, // ✅ Add this
} = require("../controllers/enrollmentController");

const router = express.Router();

router.post("/enroll", submitEnrollmentForm);
router.get("/enroll/check", checkEnrollmentStatus);
router.get("/enroll/status", getEnrollmentSteps);
router.get("/enrollment/progress", getEnrollmentProgress); // ✅ Fixed
router.get("/enrollment/check-payment", checkPaymentStatus)
router.post("/enrollment/update-step", updateStepStatus);
router.post("/enrollment/initiate-payment", initiatePaymentStatus);
router.post("/enrollment/token-received", markTokenReceived); // ✅ Add this route


module.exports = router;
