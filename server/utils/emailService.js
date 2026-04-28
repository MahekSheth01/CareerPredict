import axios from 'axios';
import nodemailer from 'nodemailer';

// ── Email sender helper ────────────────────────────────────────────────────
// Priority: Brevo API → Resend SMTP → Gmail SMTP fallback

const FROM_NAME = 'AI Career Predictor';
const FROM_EMAIL = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@careerpredict.com';

// ── Send via Brevo REST API (most reliable, no SMTP needed) ───────────────
const sendViaBrevo = async (to, subject, html) => {
    await axios.post(
        'https://api.brevo.com/v3/smtp/email',
        {
            sender: { name: FROM_NAME, email: FROM_EMAIL },
            to: [{ email: to }],
            subject,
            htmlContent: html,
        },
        {
            headers: {
                'api-key': process.env.BREVO_API_KEY,
                'Content-Type': 'application/json',
            },
        }
    );
};

// ── Singleton nodemailer transporter (Resend or Gmail fallback) ───────────
let _transporter = null;
const getTransporter = () => {
    if (_transporter) return _transporter;

    if (process.env.RESEND_API_KEY) {
        _transporter = nodemailer.createTransport({
            host: 'smtp.resend.com',
            port: 465,
            secure: true,
            auth: { user: 'resend', pass: process.env.RESEND_API_KEY },
        });
        console.log('📧 Using Resend SMTP for email delivery');
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
        console.warn('⚠️  Using SMTP fallback for email delivery');
    }

    _transporter.verify((error) => {
        if (error) {
            console.error('❌ SMTP connection failed:', error.message);
            _transporter = null;
        } else {
            console.log('✅ SMTP server is ready to send emails');
        }
    });

    return _transporter;
};

// ── Core send function ─────────────────────────────────────────────────────
const sendEmail = async (to, subject, html) => {
    if (process.env.BREVO_API_KEY) {
        console.log('📧 Using Brevo API for email delivery');
        await sendViaBrevo(to, subject, html);
    } else {
        const transporter = getTransporter();
        await transporter.sendMail({
            from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
            to,
            subject,
            html,
        });
    }
};

// ── Verification email ─────────────────────────────────────────────────────
export const sendVerificationEmail = async (email, name, token) => {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    const html = `
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
            <div class="header"><h1>🚀 Welcome to AI Career Predictor!</h1></div>
            <div class="content">
              <h2>Hi ${name},</h2>
              <p>Thank you for signing up! Please verify your email by clicking below:</p>
              <center><a href="${verificationUrl}" class="button">Verify Email</a></center>
              <p>Or paste this link: <br/><span style="background:#e0e0e0;padding:8px;border-radius:4px;word-break:break-all;">${verificationUrl}</span></p>
              <p><strong>This link expires in 24 hours.</strong></p>
            </div>
            <div class="footer"><p>© 2026 AI Career Predictor</p></div>
          </div>
        </body>
      </html>
    `;

    try {
        await sendEmail(email, 'Verify Your Email - AI Career Predictor', html);
        console.log(`✅ Verification email sent to ${email}`);
    } catch (error) {
        console.error(`❌ Error sending verification email: ${error.message}`);
        throw error;
    }
};

// ── Password reset email ───────────────────────────────────────────────────
export const sendPasswordResetEmail = async (email, name, token) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    const html = `
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
            <div class="header"><h1>🔐 Password Reset Request</h1></div>
            <div class="content">
              <h2>Hi ${name},</h2>
              <p>Click below to reset your password:</p>
              <center><a href="${resetUrl}" class="button">Reset Password</a></center>
              <p>Or paste this link: <br/><span style="background:#e0e0e0;padding:8px;border-radius:4px;word-break:break-all;">${resetUrl}</span></p>
              <p><strong>This link expires in 1 hour.</strong></p>
              <p>If you didn't request this, ignore this email.</p>
            </div>
            <div class="footer"><p>© 2026 AI Career Predictor</p></div>
          </div>
        </body>
      </html>
    `;

    try {
        await sendEmail(email, 'Reset Your Password - AI Career Predictor', html);
        console.log(`✅ Password reset email sent to ${email}`);
    } catch (error) {
        console.error(`❌ Error sending password reset email: ${error.message}`);
        throw error;
    }
};
