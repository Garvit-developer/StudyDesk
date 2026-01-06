require("dotenv").config();

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Send OTP Email
async function sendOTPEmail(to, otp) {
  const mailOptions = {
    from: `"Skilledu StudyAI" <${process.env.SMTP_USER}>`,
    to,
    subject: "Your OTP for Password Reset",
    text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.
Best regards,
Aditya Namdev`,
  };

  await transporter.sendMail(mailOptions);
}

// Send Password Changed Confirmation Email
async function sendPasswordChangedEmail(to) {
  const mailOptions = {
    from: `"Skilledu StudyAI" <${process.env.SMTP_USER}>`,
    to,
    subject: "Your Password Has Been Changed",
    text: `Hello,
Your password has been successfully changed. If you did not make this change, please contact our support team immediately.

Best regards,
Aditya Namdev`,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendOTPEmail, sendPasswordChangedEmail };
