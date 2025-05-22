// In your backend route (Node.js example)

const router = require("express").Router();

router.post('/api/schedule-meeting', async (req, res) => {
    const { email, meetingDate, meetingTime } = req.body;
    
    try {
      // Update user record in MySQL
      const [result] = await pool.query(
        'UPDATE users SET meeting_date = ?, meeting_time = ?, step2_status = "approved" WHERE email = ?',
        [meetingDate, meetingTime, email]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.json({ success: true });
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });