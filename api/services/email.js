const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendOTPEmail = async (email, otp) => {
  // Log OTP to console for local development
  console.log('==================================================');
  console.log(`🔐 DEVELOPMENT OTP for ${email}: ${otp}`);
  console.log('==================================================');

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('SMTP credentials missing, skipping actual email send.');
    return Promise.resolve();
  }

  const mailOptions = {
    from: `"UniteX" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Your UniteX Verification Code',
    html: `
      <div style="font-family: 'DM Sans', sans-serif; max-width: 500px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="color: #31303A; font-size: 28px; margin-bottom: 20px;">Welcome to UniteX!</h1>
        <p style="color: #666; font-size: 16px; margin-bottom: 30px;">
          Your verification code is:
        </p>
        <div style="background: linear-gradient(135deg, #F4511C 0%, #FF7F50 100%); color: white; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 20px 40px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
          ${otp}
        </div>
        <p style="color: #999; font-size: 14px;">
          This code expires in 10 minutes. If you didn't request this, please ignore this email.
        </p>
      </div>
    `
  };

  try {
    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Failed to send email:', error.message);
    // Don't throw error to allow dev flow to continue (OTP is logged)
    return Promise.resolve();
  }
};

module.exports = { sendOTPEmail };
