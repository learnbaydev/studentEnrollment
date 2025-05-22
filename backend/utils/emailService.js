const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_SENDER_EMAIL,
    pass: process.env.MAIL_SENDER_PASSWORD,
  },
});

async function sendInviteEmail(to, subject, htmlContent) {
  await transporter.sendMail({
    from: `"Enrollment Team" <${process.env.MAIL_SENDER_EMAIL}>`,
    to,
    subject,
    html: htmlContent,
  });
}

module.exports = { sendInviteEmail };
