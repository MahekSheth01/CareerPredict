import nodemailer from 'nodemailer';

// ── Singleton transporter (created once at startup, reused for every email) ──
// This avoids the ~1-2 second overhead of creating a new connection per send.
let _transporter = null;

const getTransporter = () => {
  if (_transporter) return _transporter;

  if (process.env.RESEND_API_KEY) {
    _transporter = nodemailer.createTransport({
      host: 'smtp.resend.com',
      port: 465,
      secure: true,
      auth: {
        user: 'resend',
        pass: process.env.RESEND_API_KEY,
      },
    });
    console.log('📧 Using Resend SMTP relay for email delivery');
  } else {
    const port = parseInt(process.env.EMAIL_PORT) || 587;
    _transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port,
      secure: port === 465,
      requireTLS: port === 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: { rejectUnauthorized: false },
    });
    console.warn('⚠️  RESEND_API_KEY not set — falling back to Gmail SMTP');
  }

  // Verify once at startup (fire-and-forget — does NOT block email sends)
  _transporter.verify((error) => {
    if (error) {
      console.error('❌ SMTP connection failed:', error.message);
      _transporter = null; // reset so next call retries
    } else {
      console.log('✅ SMTP server is ready to send emails');
    }
  });

  return _transporter;
};

// Sender address — use EMAIL_FROM if set, else EMAIL_USER, else resend default
const getSender = () => {
  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@resend.dev';
  return `"AI Career Predictor" <${from}>`;
};

// Send verification email
export const sendVerificationEmail = async (email, name, token) => {
  const transporter = getTransporter();
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: getSender(),
    to: email,
    subject: 'Verify Your Email - AI Career Predictor',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚀 Welcome to AI Career Predictor!</h1>
            </div>
            <div class="content">
              <h2>Hi ${name},</h2>
              <p>Thank you for signing up! We're excited to help you discover your ideal career path.</p>
              <p>Please verify your email address by clicking the button below:</p>
              <center>
                <a href="${verificationUrl}" class="button">Verify Email</a>
              </center>
              <p>Or copy and paste this link into your browser:</p>
              <p style="background: #e0e0e0; padding: 10px; border-radius: 5px; word-break: break-all;">${verificationUrl}</p>
              <p><strong>This link will expire in 24 hours.</strong></p>
              <p>If you didn't create an account, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>© 2026 AI Career Predictor. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent to ${email}`);
  } catch (error) {
    console.error(`❌ Error sending verification email: ${error.message}`);
    throw error;
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, name, token) => {
  const transporter = getTransporter();
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: getSender(),
    to: email,
    subject: 'Reset Your Password - AI Career Predictor',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Password Reset Request</h1>
            </div>
            <div class="content">
              <h2>Hi ${name},</h2>
              <p>We received a request to reset your password. Click the button below to create a new password:</p>
              <center>
                <a href="${resetUrl}" class="button">Reset Password</a>
              </center>
              <p>Or copy and paste this link into your browser:</p>
              <p style="background: #e0e0e0; padding: 10px; border-radius: 5px; word-break: break-all;">${resetUrl}</p>
              <p><strong>This link will expire in 1 hour.</strong></p>
              <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
            </div>
            <div class="footer">
              <p>© 2026 AI Career Predictor. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${email}`);
  } catch (error) {
    console.error(`❌ Error sending password reset email: ${error.message}`);
    throw error;
  }
};
