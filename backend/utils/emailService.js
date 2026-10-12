const nodemailer = require("nodemailer");

/**
 * Configure Nodemailer Transporter
 * Supports real SMTP credentials from .env as well as automated
 * Ethereal test account fallback with console preview URLs for local testing.
 */
let transporter = null;

const getTransporter = async () => {
  if (transporter) return transporter;

  const {
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_USER,
    EMAIL_PASS,
  } = process.env;

  // If real SMTP credentials provided in .env
  if (EMAIL_USER && EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      host: EMAIL_HOST || "smtp.gmail.com",
      port: Number(EMAIL_PORT) || 587,
      secure: Number(EMAIL_PORT) === 465,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });
    console.log("📧 Nodemailer initialized with configured SMTP:", EMAIL_HOST || "smtp.gmail.com");
    return transporter;
  }

  // Fallback: Create ephemeral Ethereal test account for development/testing
  try {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log("📧 Nodemailer initialized with Ethereal test account:", testAccount.user);
    return transporter;
  } catch (err) {
    console.warn("⚠️ Ethereal test account creation failed, using simulated mailer:", err.message);
    transporter = {
      sendMail: async (options) => {
        console.log("📨 [SIMULATED EMAIL SENT]");
        console.log("   To:", options.to);
        console.log("   Subject:", options.subject);
        return { messageId: "simulated-" + Date.now() };
      },
    };
    return transporter;
  }
};

/**
 * Send Password Reset Email with Nodemailer
 */
const sendPasswordResetEmail = async ({ to, resetUrl, resetToken }) => {
  const mailer = await getTransporter();
  const from = process.env.EMAIL_FROM || '"Portfolio Task Workspace" <no-reply@portfolio.com>';

  const mailOptions = {
    from,
    to,
    subject: "Password Reset Request — Portfolio Task Workspace",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 580px; margin: 0 auto; background-color: #0b0f19; color: #f8fafc; border-radius: 14px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
        <div style="background: linear-gradient(135deg, #6366f1, #06b6d4); padding: 24px; text-align: center;">
          <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 800; letter-spacing: 0.5px;">Portfolio Task Workspace</h1>
          <p style="margin: 6px 0 0; color: rgba(255,255,255,0.85); font-size: 13px;">Password Reset Verification</p>
        </div>
        <div style="padding: 28px 24px;">
          <p style="font-size: 15px; line-height: 1.6; color: #e2e8f0; margin-top: 0;">
            Hello,
          </p>
          <p style="font-size: 14px; line-height: 1.6; color: #94a3b8;">
            We received a request to reset the password for your account (<strong>${to}</strong>). Click the button below to choose a new password. This link is valid for <strong>15 minutes</strong>.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: linear-gradient(135deg, #4f46e5, #7c3aed); color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-size: 14px; font-weight: 700; display: inline-block; box-shadow: 0 4px 14px rgba(99,102,241,0.4);">
              Reset My Password
            </a>
          </div>
          <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 12px 14px; margin-bottom: 20px;">
            <span style="font-size: 11px; text-transform: uppercase; color: #818cf8; font-weight: 700; display: block; margin-bottom: 4px;">Manual Reset Token</span>
            <code style="font-family: monospace; font-size: 13px; color: #38bdf8; word-break: break-all;">${resetToken}</code>
          </div>
          <p style="font-size: 12px; color: #64748b; line-height: 1.5;">
            Or copy and paste this link into your browser:<br/>
            <a href="${resetUrl}" style="color: #818cf8; word-break: break-all;">${resetUrl}</a>
          </p>
          <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 24px 0;" />
          <p style="font-size: 12px; color: #64748b; margin-bottom: 0;">
            If you did not request a password reset, you can safely ignore this email. Your account remains completely secure.
          </p>
        </div>
      </div>
    `,
    text: `Password Reset Request: Use the following link to reset your password (valid for 15 minutes): ${resetUrl}\nToken: ${resetToken}`,
  };

  const info = await mailer.sendMail(mailOptions);
  console.log("✅ Password reset email dispatched to:", to, "MessageId:", info.messageId);

  // If Ethereal test account was used, log the preview URL for instant testing
  if (nodemailer.getTestMessageUrl && info) {
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log("🔗 [Ethereal Email Preview URL]:", previewUrl);
    }
  }

  return info;
};

module.exports = {
  getTransporter,
  sendPasswordResetEmail,
};
