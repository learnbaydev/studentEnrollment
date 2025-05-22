const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../config/db');
const moment = require('moment-timezone'); // Changed to moment-timezone

// Schedule evaluation endpoint
router.post('/schedule-evaluation', async (req, res) => {
  try {
    const { dateTime, email } = req.body;
    
    // Validate input
    if (!dateTime || !email) {
      return res.status(400).json({ error: 'Missing dateTime or email' });
    }

    // Convert to IST timezone and validate
    const scheduledTime = moment.tz(dateTime, "Asia/Kolkata");
    
    if (!scheduledTime.isValid()) {
      return res.status(400).json({ error: 'Invalid date/time format' });
    }

    // Check if time is in future (IST)
    const nowIST = moment.tz("Asia/Kolkata");
    if (scheduledTime.isBefore(nowIST)) {
      return res.status(400).json({ error: 'Time must be in the future (IST)' });
    }

    // Store in database as ISO string with timezone info
    const dbTime = scheduledTime.format();
    
    // Update database with meeting_time and meeting_status
    const [result] = await db.execute(
      'UPDATE user SET meeting_time = ?, meeting_status = "scheduled" WHERE email = ?',
      [dbTime, email]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prepare webhook data
    const webhookData = {
      user_email: email,
      scheduled_time: dbTime
    };

    console.log('Attempting to call webhook with data:', webhookData);

    try {
      const webhookResponse = await axios.post(
        'https://lbayms.in/gauth/service_account_meeting.php',
        webhookData,
        {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      console.log('Webhook response:', webhookResponse.data);

      // If webhook returns meeting link, update database
      if (webhookResponse.data?.scheduled_meeting_link) {
        await db.execute(
          'UPDATE user SET scheduled_meeting_link = ? WHERE email = ?',
          [webhookResponse.data.scheduled_meeting_link, email]
        );
      } else {
        console.warn('Webhook succeeded but no meeting link returned');
      }

      return res.json({ 
        success: true, 
        scheduled: dbTime,
        meeting_status: "scheduled",
        scheduled_meeting_link: webhookResponse.data?.scheduled_meeting_link || null
      });

    } catch (webhookError) {
      console.error('Webhook failed:', webhookError);

      // Even if webhook fails, meeting is still marked as scheduled in DB
      return res.json({ 
        success: true, 
        scheduled: dbTime,
        meeting_status: "scheduled",
        warning: 'Scheduled but webhook may not have completed successfully'
      });
    }
    
  } catch (error) {
    console.error('Backend error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// Get meeting status endpoint remains the same
router.get('/get-meeting', async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const [userRows] = await db.query(
      `SELECT 
        meeting_time, 
        scheduled_meeting_link, 
        evaluation_completed 
       FROM user 
       WHERE email = ?`,
      [email]
    );

    if (userRows.length === 0) return res.status(404).json({ error: 'User not found' });

    const user = userRows[0];
    
    if (!user.meeting_time) {
      return res.json({ exists: false });
    }

    const scheduledAt = moment(user.meeting_time);
    if (!scheduledAt.isValid()) {
      return res.json({ exists: false });
    }

    return res.json({
      exists: true,
      meeting_time: scheduledAt.toISOString(),
      scheduled_meeting_link: user.scheduled_meeting_link || null,
      completed: user.evaluation_completed || false
    });

  } catch (error) {
    console.error('Error fetching meeting data:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Add this to your existing routes
router.get('/payment-status', async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check both payment status and enrollment step4 status
    const [results] = await db.query(
      `SELECT 
        u.payment_status,
        u.payment_date,
        e.step4_status,
        e.step4_updated_at
       FROM user u
       JOIN enrollment_details e ON u.email = e.user_email
       WHERE u.email = ?`,
      [email]
    );

    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const data = results[0];
    
    return res.json({
      paymentStatus: data.payment_status,
      paymentDate: data.payment_date,
      step4Status: data.step4_status,
      lastUpdated: data.step4_updated_at
    });

  } catch (error) {
    console.error('Error fetching payment status:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Add this endpoint to update payment status (called by webhook)
router.post('/update-payment', async (req, res) => {
  try {
    const { email, status } = req.body;
    
    if (!email || typeof status === 'undefined') {
      return res.status(400).json({ error: 'Email and status are required' });
    }

    // Start transaction
    await db.beginTransaction();

    try {
      // Update user payment status
      const [userUpdate] = await db.execute(
        `UPDATE user 
         SET payment_status = ?,
             payment_date = IF(? = 1, NOW(), NULL)
         WHERE email = ?`,
        [status, status, email]
      );

      // Update enrollment step4 status if payment successful
      if (status === 1) {
        await db.execute(
          `UPDATE enrollment_details 
           SET step4_status = 'approved',
               step4_updated_at = NOW(),
               progress = '100%'
           WHERE user_email = ?`,
          [email]
        );
      }

      await db.commit();

      return res.json({
        success: true,
        updated: userUpdate.affectedRows
      });

    } catch (transactionError) {
      await db.rollback();
      throw transactionError;
    }

  } catch (error) {
    console.error('Error updating payment status:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
// Add this new endpoint to your existing routes
router.post('/complete-evaluation', async (req, res) => {
    try {
      const { email } = req.body;
  
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }
  
      // Start a database transaction
      await db.beginTransaction();
  
      try {
        // 1. Mark evaluation as completed in user table
        const [updateUserResult] = await db.execute(
          `UPDATE user 
           SET evaluation_completed = 1,
               evaluation_completed_at = NOW()
           WHERE email = ?`,
          [email]
        );
  
        if (updateUserResult.affectedRows === 0) {
          await db.rollback();
          return res.status(404).json({ error: 'User not found' });
        }
  
        // 2. Update enrollment status for step2 (approved) and step3 (pending)
        const [updateEnrollmentResult] = await db.execute(
          `UPDATE enrollment_details 
           SET 
             step2_status = 'approved',
             step2_updated_at = NOW(),
             step3_status = 'pending',
             step3_updated_at = NOW(),
             progress = CASE 
               WHEN step1_status = 'approved' AND step2_status = 'approved' AND step3_status = 'pending' THEN '75%'
               ELSE progress
             END
           WHERE user_email = ?`,
          [email]
        );
  
        // Commit the transaction
        await db.commit();
  
        return res.json({ 
          success: true,
          message: 'Evaluation marked as completed and steps updated',
          updates: {
            user: updateUserResult.affectedRows,
            enrollment: updateEnrollmentResult.affectedRows
          }
        });
  
      } catch (transactionError) {
        await db.rollback();
        throw transactionError;
      }
  
    } catch (error) {
      console.error('Error completing evaluation:', {
        message: error.message,
        stack: error.stack
      });
      return res.status(500).json({ 
        error: 'Internal server error',
        details: error.message 
      });
    }
  });

module.exports = router;