const User = require('../models/User');

exports.scheduleEvaluation = async (req, res) => {
  try {
    const { dateTime } = req.body;
    const userEmail = req.user.email; // Or get from session/token

    if (!dateTime) {
      return res.status(400).json({ error: 'Date and time are required' });
    }

    // Validate date is in the future
    if (new Date(dateTime) < new Date()) {
      return res.status(400).json({ error: 'Schedule date must be in the future' });
    }

    await User.scheduleEvaluation(userEmail, dateTime);
    
    res.status(200).json({
      success: true,
      message: 'Evaluation scheduled successfully',
      scheduledDateTime: dateTime
    });
  } catch (error) {
    console.error('Error scheduling evaluation:', error);
    res.status(500).json({ error: 'Failed to schedule evaluation' });
  }
};

exports.getEvaluationSchedule = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const schedule = await User.getEvaluationSchedule(userEmail);
    
    res.status(200).json({
      success: true,
      schedule
    });
  } catch (error) {
    console.error('Error fetching schedule:', error);
    res.status(500).json({ error: 'Failed to fetch schedule' });
  }
};