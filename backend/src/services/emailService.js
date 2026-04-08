/**
 * Email Service
 * Handles sending OTP and other notification emails.
 */

const nodemailer = require('nodemailer');

// Configure the transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send an OTP to a user's email
 * @param {string} toEmail - The recipient's email address
 * @param {string} otp - The one-time password
 * @param {string} name - The user's name
 */
exports.sendOTPEmail = async (toEmail, otp, name = 'User') => {
  // If email configuration is missing, we log it but don't crash
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('EMAIL_USER or EMAIL_PASS not set. OTP to email failed. Use log for OTP: ', otp);
    return true; // Pretend it worked for dev if no creds are set, but log it
  }

  const mailOptions = {
    from: `"SarkariSetu Support" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Your SarkariSetu Sign In Verification Code',
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #f8fafc; border-radius: 20px;">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="color: #2563eb; font-size: 32px; font-weight: 800; margin: 0; letter-spacing: -0.025em;">SarkariSetu</h1>
          <p style="color: #64748b; font-size: 16px; margin-top: 8px;">Your gateway to public opportunities</p>
        </div>
        
        <div style="background-color: white; padding: 40px; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #1e293b; font-size: 20px; font-weight: 700; margin-top: 0;">Verification code</h2>
          <p style="color: #475569; line-height: 1.5; font-size: 16px;">
            Hello ${name},<br><br>
            Please use the following single-use code to sign in to your SarkariSetu account. This code will expire in 10 minutes.
          </p>
          
          <div style="background-color: #f1f5f9; padding: 24px; border-radius: 12px; text-align: center; margin: 32px 0;">
            <span style="font-family: monospace; font-size: 48px; font-weight: 800; letter-spacing: 0.1em; color: #2563eb;">${otp}</span>
          </div>
          
          <p style="color: #64748b; font-size: 14px; margin-bottom: 0;">
            If you didn't request this code, you can safely ignore this email.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 40px;">
          <p style="color: #94a3b8; font-size: 12px;">
            © 2026 SarkariSetu. All rights reserved.<br>
            Connecting citizens to government services effortlessly.
          </p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};
