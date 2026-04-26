import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

console.log('Testing email configuration...');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASSWORD length:', process.env.EMAIL_PASSWORD ? process.env.EMAIL_PASSWORD.length : 0);

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_PORT === '465',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: { rejectUnauthorized: false },
});

console.log('Verifying connection...');

transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Connection failed:', error);
    process.exit(1);
  } else {
    console.log('✅ Server is ready to take our messages');
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to self for testing
      subject: 'Test Email from AI Career Predictor',
      text: 'If you see this, email sending is working!',
    };

    console.log('Sending test email...');
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('❌ Error sending mail:', error);
        process.exit(1);
      } else {
        console.log('✅ Email sent: ' + info.response);
        process.exit(0);
      }
    });
  }
});
