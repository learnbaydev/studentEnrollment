// routes/payment-status.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const [results] = await db.query(
      'SELECT payment_status FROM user WHERE email = ?',
      [email]
    );

    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      payment_status: results[0].payment_status === 1,
      completed: results[0].payment_status === 1
    });
    
  } catch (error) {
    console.error('Error checking payment status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/razorpay-webhook', async (req, res) => {
  try {
    const { payload } = req.body;
    const { payment_link } = payload;
    
    // Verify the payment link and get associated email
    const [user] = await db.query(
      'SELECT email FROM user WHERE payment_link_id = ?',
      [payment_link.id]
    );
    
    if (user.length > 0) {
      // Update payment status
      await db.query(
        'UPDATE user SET payment_status = 1 WHERE email = ?',
        [user[0].email]
      );
      
      // You might also want to update enrollment steps here
      await db.query(
        'UPDATE enrollment_progress SET step4 = "approved" WHERE email = ?',
        [user[0].email]
      );
    }
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('Error processing payment webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;