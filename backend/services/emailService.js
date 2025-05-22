const nodemailer = require('nodemailer');
const moment = require('moment-timezone');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendMeetingConfirmation = async (user, meeting) => {
  try {
    const formattedDate = moment(meeting.meeting_datetime)
      .tz(meeting.timezone)
      .format('LLLL');
    
    const mailOptions = {
      from: 'Learnbay <noreply@learnbay.com>',
      to: user.email,
      subject: 'Your Profile Evaluation Scheduled',
      html: `
        <h2>Meeting Confirmation</h2>
        <p>Hello ${user.name},</p>
        <p>Your profile evaluation has been scheduled for:</p>
        <p><strong>${formattedDate}</strong> (${meeting.timezone})</p>
        <p>Mode: ${meeting.meeting_mode === 'video' ? 'Video Call' : 'Phone Call'}</p>
        <p>Thank you,<br>The Learnbay Team</p>
      `
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
};