 // controllers/offerLetterController.js
const db = require('../config/db');
const path = require('path');
const generateOfferLetterPDF = require('../utils/generateOfferLetterPDF');

const { uploadFile, getSignedUrl } = require('../utils/s3Storage');

exports.generatePDFByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    
    // Query user data
    const [results] = await db.query(
      `SELECT id, email, name as full_name, program_name, 
       program_fee, domain, offer_letter_path, remarks 
       FROM user WHERE email = ?`, 
      [email]
    );

    if (results.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    const userData = results[0];
    const currentYear = new Date().getFullYear();
    const userIdFormatted = 'LB' + currentYear + userData.id.toString().padStart(5, '0');
    
    
    // If offer letter exists, return a fresh signed URL
    if (userData.offer_letter_path) {
      // Generate a new signed URL with longer expiration
      const signedUrl = await getSignedUrl(userData.offer_letter_path, 3600); // 1 hour expiration
      return res.json({
        success: true,
        downloadUrl: signedUrl,
        message: 'Offer letter already generated',
      });
    }

    // Generate new PDF and upload to S3
    const { s3Key, s3Url } = await generateOfferLetterPDF(userData, userIdFormatted);

    // Update database with S3 key
    await db.query(
      'UPDATE user SET offer_letter_path = ? WHERE email = ?', 
      [s3Key, email]
    );
    
    // Return the S3 URL with longer expiration
    const signedUrl = await getSignedUrl(s3Key, 3600); // 1 hour expiration
    res.json({
      success: true,
      downloadUrl: signedUrl,
      message: 'Offer letter generated successfully',
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while generating PDF' 
    });
  }
};

// exports.checkStatus = async (req, res) => {
//   try {
//     const email = req.params.email;
//     const [results] = await db.query(
//       'SELECT offer_letter_path FROM user WHERE email = ?',
//       [email]
//     );

//     if (results.length === 0) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     if (!results[0].offer_letter_path) {
//       return res.json({
//         exists: false,
//         downloadUrl: null
//       });
//     }

//     // Generate a fresh signed URL for the check
//     const signedUrl = await getSignedUrl(results[0].offer_letter_path, 3600); // 1 hour expiration
    
//     res.json({
//       exists: true,
//       downloadUrl: signedUrl // Return the full signed URL
//     });
//   } catch (error) {
//     console.error('Error checking offer letter status:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// Unified download endpoint
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
    const signedUrl = await getSignedUrl(s3Key);
    
    res.json({
      success: true,
      downloadUrl: signedUrl
    });
    
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while generating download URL' 
    });
  }
};

// Status check endpoint
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

    const s3Key = results[0].offer_letter_path;
    const signedUrl = s3Key ? await getSignedUrl(s3Key) : null;
    
    res.json({
      exists: !!s3Key,
      downloadUrl: signedUrl
    });
  } catch (error) {
    console.error('Error checking offer letter status:', error);
    res.status(500).json({ message: 'Server error' });
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
// exports.checkStatus = async (req, res) => {
//     try {
//       const email = req.params.email;
//       const [results] = await db.query(
//         'SELECT offer_letter_path FROM user WHERE email = ?',
//         [email]
//       );
  
//       if (results.length === 0) {
//         return res.status(404).json({ message: 'User not found' });
//       }
  
//       res.json({
//         exists: !!results[0].offer_letter_path,
//         downloadUrl: results[0].offer_letter_path ? `/pdfs/${results[0].offer_letter_path}` : null
//       });
//     } catch (error) {
//       console.error('Error checking offer letter status:', error);
//       res.status(500).json({ message: 'Server error' });
//     }
//   };


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

// In your offerLetterController.js
exports.getSeatsLeft = async (req, res) => {
  try {
    const email = req.params.email;
    console.log(`Fetching seats for email: ${email}`); 

    const [results] = await db.query(
      'SELECT `seats-left` AS seatsLeft, program_name FROM user WHERE email = ?',
      [email]
    );

    if (results.length === 0) {
      console.log('No user found with email:', email);
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    const seatsLeft = results[0].seatsLeft;
    const programName = results[0].program_name;
    console.log('Seats left retrieved:', seatsLeft); 

    res.json({
      success: true,
      seatsLeft: seatsLeft,
      programName: programName
    });

  } catch (error) {
    console.error('Server error in getSeatsLeft:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message 
    });
  }
};
  

  