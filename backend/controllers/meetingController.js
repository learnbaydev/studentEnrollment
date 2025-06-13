const { User, Meeting } = require('../models');
const { Op } = require('sequelize');
const { sendMeetingConfirmation } = require('../services/emailService');
const moment = require('moment-timezone');

exports.scheduleMeeting = async (req, res) => {
  const { email, meeting_date, meeting_time, meeting_mode, timezone = 'UTC' } = req.body;

  // Validate input
  if (!email || !meeting_date || !meeting_time || !meeting_mode) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: email, meeting_date, meeting_time, meeting_mode'
    });
  }

  try {
    // Format meeting datetime with timezone
    const meetingDateTime = moment.tz(
      `${meeting_date} ${meeting_time}`,
      'YYYY-MM-DD HH:mm',
      timezone
    ).toDate();

    // Validate meeting is in the future
    if (meetingDateTime < new Date()) {
      return res.status(400).json({
        success: false,
        error: 'Meeting time must be in the future'
      });
    }

    // Validate business hours (9am-6pm in user's timezone)
    const meetingMoment = moment.tz(meetingDateTime, timezone);
    const hour = meetingMoment.hour();
    const minute = meetingMoment.minute();
    
    if (
      hour < 9 || 
      (hour === 17 && minute > 30) || 
      hour > 17
    ) {
      return res.status(400).json({
        success: false,
        error: 'Meetings must be scheduled between 9:00 AM and 5:30 PM in your timezone'
      });
    }
    

    // Check for existing meetings within 2 hours
    const existingMeeting = await Meeting.findOne({
      where: {
        meeting_datetime: {
          [Op.between]: [
            new Date(meetingDateTime.getTime() - 2 * 60 * 60 * 1000),
            new Date(meetingDateTime.getTime() + 2 * 60 * 60 * 1000)
          ]
        },
        status: 'scheduled'
      }
    });

    if (existingMeeting) {
      return res.status(409).json({
        success: false,
        error: 'Time slot unavailable. Please choose another time.'
      });
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Start transaction
    const transaction = await sequelize.transaction();

    try {
      // Update user status
      await User.update(
        {
          evaluation_status: 'scheduled',
          step2_status: 'in_progress',
          last_updated: new Date()
        },
        { where: { id: user.id }, transaction }
      );

      // Create meeting record
      const meeting = await Meeting.create({
        user_id: user.id,
        meeting_datetime: meetingDateTime,
        meeting_mode,
        timezone,
        status: 'scheduled'
      }, { transaction });

      // Commit transaction
      await transaction.commit();

      // Send confirmation email (async)
      sendMeetingConfirmation(user, meeting);

      return res.status(201).json({
        success: true,
        data: {
          meeting_id: meeting.id,
          meeting_datetime: meetingDateTime,
          meeting_mode,
          timezone,
          status: 'scheduled'
        }
      });

    } catch (error) {
      await transaction.rollback();
      throw error;
    }

  } catch (error) {
    console.error('Meeting scheduling error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to schedule meeting. Please try again.'
    });
  }
};