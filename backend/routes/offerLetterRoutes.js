// routes/offerLetterRoutes.js
const express = require('express');
const router = express.Router();
const offerLetterController = require('../controllers/offerLetterController');

router.get('/generate/:email', offerLetterController.generatePDFByEmail);
router.post('/recordDownload/:email', offerLetterController.recordDownload);
router.get('/checkDownloadStatus/:email', offerLetterController.checkDownloadStatus);
router.get('/checkStatus/:email', offerLetterController.checkStatus);
router.get('/download/:email', offerLetterController.download);
router.get('/check-payment/:email', offerLetterController.checkPaymentStatus);


// Generate and download new letter
router.get('/generateAndDownload/:email', offerLetterController.generateAndDownload);

module.exports = router;