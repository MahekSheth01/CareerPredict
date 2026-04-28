import axios from 'axios';
import nodemailer from 'nodemailer';

const FROM_NAME = 'AI Career Predictor';
const getFromEmail = () => (process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@careerpredict.com').trim();
const getBaseUrl = () => (process.env.FRONTEND_URL || 'http://localhost:5173').trim();

// ── Send via Brevo REST API ────────────────────────────────────────────────
const sendViaBrevo = async (to, subject, html) => {
    try {
        await axios.post(
            'https://api.brevo.com/v3/smtp/email',
            {
                sender: { name: FROM_NAME, email: getFromEmail() },
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
    } catch (err) {
        // Log the full Brevo error response for debugging
        const detail = err.response?.data;
        console.error('❌ Brevo API error detail:', JSON.stringify(detail));
        throw err;
    }
};

// ── Singleton nodemailer transporter (Resend or SMTP fallback) ────────────
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
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
            tls: { rejectUnauthorized: false },
        });
        console.warn('⚠️  Using SMTP fallback for email delivery');
    }

    _transporter.verify((error) => {
        if (error) { console.error('❌ SMTP connection failed:', error.message); _transporter = null; }
        else { console.log('✅ SMTP server is ready to send emails'); }
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
        await transporter.sendMail({ from: `"${FROM_NAME}" <${getFromEmail()}>`, to, subject, html });
    }
};

// ── Shared styles ──────────────────────────────────────────────────────────
const baseStyles = `
    *{margin:0;padding:0;box-sizing:border-box;}
    body{font-family:'Segoe UI',Arial,sans-serif;background:#f0f4ff;color:#333;padding:20px 0;}
    .wrap{max-width:560px;margin:0 auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 8px 32px rgba(102,126,234,0.18);}
    .hero{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:52px 32px 40px;text-align:center;}
    .hero-icon{font-size:52px;display:block;margin-bottom:16px;}
    .hero h1{color:#fff;font-size:24px;font-weight:700;letter-spacing:-0.3px;}
    .hero p{color:rgba(255,255,255,0.8);font-size:14px;margin-top:8px;}
    .body{padding:40px 36px;}
    .body h2{font-size:20px;font-weight:600;color:#222;margin-bottom:12px;}
    .body p{color:#666;font-size:15px;line-height:1.75;margin-bottom:16px;}
    .btn-wrap{text-align:center;margin:36px 0 28px;}
    .btn{display:inline-block;padding:16px 52px;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff !important;text-decoration:none;border-radius:100px;font-size:16px;font-weight:700;letter-spacing:0.3px;box-shadow:0 4px 16px rgba(102,126,234,0.4);}
    .note{background:#f5f7ff;border-left:4px solid #667eea;border-radius:8px;padding:14px 18px;font-size:13px;color:#888;margin-top:8px;}
    .footer{background:#fafbff;border-top:1px solid #eef0ff;padding:24px 32px;text-align:center;}
    .footer p{color:#bbb;font-size:12px;line-height:1.9;}
`;

// ── Verification email ─────────────────────────────────────────────────────
export const sendVerificationEmail = async (email, name, token) => {
    const verificationUrl = `${getBaseUrl()}/verify-email?token=${token}`;

    const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>
      <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
      <style>${baseStyles}</style></head>
      <body>
        <div class="wrap">
          <div class="hero">
            <span class="hero-icon">🚀</span>
            <h1>Welcome to AI Career Predictor!</h1>
            <p>Your journey to the perfect career starts here</p>
          </div>
          <div class="body">
            <h2>Hi ${name}! 👋</h2>
            <p>Thanks for signing up! You're one step away from unlocking AI-powered career predictions tailored just for you.</p>
            <p>Click the button below to verify your email and activate your account:</p>
            <div class="btn-wrap">
              <a href="${verificationUrl}" class="btn">✅ Verify My Email</a>
            </div>
            <div class="note">⏳ This link expires in <strong>24 hours</strong>. If you didn't create an account, you can safely ignore this email.</div>
          </div>
          <div class="footer">
            <p>© 2026 AI Career Predictor · Built with ❤️<br/>If the button doesn't work, contact support.</p>
          </div>
        </div>
      </body></html>`;

    try {
        await sendEmail(email, '🚀 Verify your email — AI Career Predictor', html);
        console.log(`✅ Verification email sent to ${email}`);
    } catch (error) {
        console.error(`❌ Error sending verification email: ${error.message}`);
        throw error;
    }
};

// ── Password reset email ───────────────────────────────────────────────────
export const sendPasswordResetEmail = async (email, name, token) => {
    const resetUrl = `${getBaseUrl()}/reset-password?token=${token}`;

    const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>
      <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
      <style>${baseStyles}</style></head>
      <body>
        <div class="wrap">
          <div class="hero">
            <span class="hero-icon">🔐</span>
            <h1>Password Reset Request</h1>
            <p>We got a request to reset your password</p>
          </div>
          <div class="body">
            <h2>Hi ${name}! 👋</h2>
            <p>No worries! Click the button below to create a new password. This link is only valid for <strong>1 hour</strong>.</p>
            <div class="btn-wrap">
              <a href="${resetUrl}" class="btn">🔑 Reset My Password</a>
            </div>
            <div class="note">🛡️ If you didn't request a password reset, you can safely ignore this email. Your password will not change.</div>
          </div>
          <div class="footer">
            <p>© 2026 AI Career Predictor · Built with ❤️<br/>If the button doesn't work, contact support.</p>
          </div>
        </div>
      </body></html>`;

    try {
        await sendEmail(email, '🔐 Reset your password — AI Career Predictor', html);
        console.log(`✅ Password reset email sent to ${email}`);
    } catch (error) {
        console.error(`❌ Error sending password reset email: ${error.message}`);
        throw error;
    }
};
