 // controllers/offerLetterController.js
const db = require('../config/db');
const path = require('path');
const generateOfferLetterPDF = require('../utils/generateOfferLetterPDF');

exports.generatePDFByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    console.log(`[generatePDFByEmail] Request received for email: ${email}`);

    // Query user by email with all required fields
    const [results] = await db.query(
      `SELECT 
        id, email, name as full_name, 
        program_name, program_fee, 
        domain,
        scholarship_percentage, scholarship_fee, 
        validity, offer_letter_path, 
        signature_image_path as signatureImagePath
      FROM user WHERE email = ?`, 
      [email]
    );

    if (results.length === 0) {
      console.log(`[generatePDFByEmail] User not found for email: ${email}`);
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    const userData = results[0];
    console.log(`[generatePDFByEmail] Found user: ${userData.full_name}`);

    // Check if offer letter already exists
    if (userData.offer_letter_path) {
      console.log(`[generatePDFByEmail] Offer letter already exists for ${email}`);
      return res.json({
        success: true,
        downloadUrl: `/pdfs/${userData.offer_letter_path}`,
        message: 'Offer letter already generated',
      });
    }

    // Generate a new file name
    const fileName = `offer_${userData.id}_${Date.now()}.pdf`;
    const filePath = path.join(__dirname, '../public/pdfs', fileName);

    console.log(`[generatePDFByEmail] Generating PDF for ${email} at ${filePath}`);
    
    // Generate PDF
    await generateOfferLetterPDF(userData, filePath);

    // Update database with file path
    await db.query(
      'UPDATE user SET offer_letter_path = ? WHERE email = ?', 
      [fileName, email]
    );

    console.log(`[generatePDFByEmail] PDF generated successfully for ${email}`);
    
    res.json({
      success: true,
      downloadUrl: `/pdfs/${fileName}`,
      message: 'Offer letter generated successfully',
    });

  } catch (error) {
    console.error('[generatePDFByEmail] Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while generating PDF' 
    });
  }
};

exports.recordDownload = async (req, res) => {
  try {
    const email = req.params.email;
    console.log(`[recordDownload] Request received for email: ${email}`);

    // Check if user exists
    const [userRows] = await db.query(
      'SELECT id, offer_letter_downloaded FROM user WHERE email = ?', 
      [email]
    );

    if (userRows.length === 0) {
      console.log(`[recordDownload] User not found for email: ${email}`);
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // If already downloaded, respond success
    if (userRows[0].offer_letter_downloaded) {
      console.log(`[recordDownload] Download already recorded for ${email}`);
      return res.json({ 
        success: true, 
        message: 'Offer letter already recorded as downloaded' 
      });
    }

    // Update download status
    const [updateResult] = await db.query(
      'UPDATE user SET offer_letter_downloaded = 1, last_downloaded = NOW() WHERE email = ?',
      [email]
    );

    if (updateResult.affectedRows === 0) {
      console.log(`[recordDownload] Failed to update record for ${email}`);
      return res.status(500).json({ 
        success: false,
        message: 'Failed to update download status' 
      });
    }

    console.log(`[recordDownload] Download recorded successfully for ${email}`);
    res.json({ 
      success: true, 
      message: 'Download recorded successfully' 
    });

  } catch (error) {
    console.error('[recordDownload] Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while recording download' 
    });
  }
};

// Add this to your offerLetterController.js
exports.checkDownloadStatus = async (req, res) => {
    try {
      const email = req.params.email;
      const [results] = await db.query(
        'SELECT offer_letter_path, offer_letter_downloaded FROM user WHERE email = ?',
        [email]
      );
  
      if (results.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({
        downloaded: results[0].offer_letter_downloaded === 1,
        downloadUrl: results[0].offer_letter_path ? `/pdfs/${results[0].offer_letter_path}` : null
      });
    } catch (error) {
      console.error('Error checking download status:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  // In your backend controller
exports.checkStatus = async (req, res) => {
    try {
      const email = req.params.email;
      const [results] = await db.query(
        'SELECT offer_letter_path FROM user WHERE email = ?',
        [email]
      );
  
      if (results.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({
        exists: !!results[0].offer_letter_path,
        downloadUrl: results[0].offer_letter_path ? `/pdfs/${results[0].offer_letter_path}` : null
      });
    } catch (error) {
      console.error('Error checking offer letter status:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };


  // In your offerLetterController.js

// Direct download endpoint
// exports.download = async (req, res) => {
//     try {
//       const email = req.params.email;
//       const [results] = await db.query(
//         'SELECT offer_letter_path FROM user WHERE email = ?',
//         [email]
//       );
  
//       if (results.length === 0 || !results[0].offer_letter_path) {
//         return res.status(404).json({ message: 'Offer letter not found' });
//       }
  
//       const filePath = path.join(__dirname, '../public/pdfs', results[0].offer_letter_path);
//       res.download(filePath, 'Scholarship_Letter.pdf');
      
//     } catch (error) {
//       console.error('Download error:', error);
//       res.status(500).json({ message: 'Server error' });
//     }
//   };
  


exports.download = async (req, res) => {
  try {
    const email = req.params.email;
    const [results] = await db.query(
      'SELECT offer_letter_path FROM user WHERE email = ?',
      [email]
    );

    if (results.length === 0 || !results[0].offer_letter_path) {
      return res.status(404).json({ message: 'Offer letter not found' });
    }

    const s3Key = results[0].offer_letter_path;
    const signedUrl = await getSignedUrl(S3_BUCKET_NAME, s3Key);
    
    // Redirect to the signed URL
    res.redirect(signedUrl);
    
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
  // Generate and download endpoint
  exports.generateAndDownload = async (req, res) => {
    try {
      const email = req.params.email;
      
      // Generate the PDF (reuse your existing generation logic)
      const fileName = `offer_${Date.now()}.pdf`;
      const filePath = path.join(__dirname, '../public/pdfs', fileName);
      const userData = await getUserData(email); // Implement this function
      
      await generateOfferLetterPDF(userData, filePath);
      
      // Update database
      await db.query(
        'UPDATE user SET offer_letter_path = ? WHERE email = ?', 
        [fileName, email]
      );
  
      // Send the file
      res.download(filePath, 'Scholarship_Letter.pdf');
      
    } catch (error) {
      console.error('Generate and download error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };


  // controllers/enrollmentController.js

  exports.checkPaymentStatus = async (req, res) => {
    try {
      const email = req.params.email;
      
      // Query only the payment status without updating anything
      const [results] = await db.query(
        'SELECT payment_status FROM user WHERE email = ?',
        [email]
      );
  
      if (results.length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
      }
  
      res.json({
        success: true,
        paymentStatus: results[0].payment_status === 1
      });
  
    } catch (error) {
      console.error('Error checking payment status:', error);
      res.status(500).json({ 
        success: false,
        message: 'Server error while checking payment status' 
      });
    }
  };

  