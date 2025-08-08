// server/services/emailService.ts
// Email service for password reset and notifications

import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function sendResetEmail(email: string, resetUrl: string) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@guardianchain.app',
      to: email,
      subject: '🔐 GuardianChain Password Reset',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background: linear-gradient(135deg, #1a1a2e, #16213e); color: #fff; border-radius: 12px; padding: 30px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #00ffe1; margin: 0;">🛡️ GuardianChain</h1>
            <p style="color: #b0b7c3; margin: 10px 0 0;">Secure Password Reset</p>
          </div>
          
          <div style="background: rgba(255,255,255,0.05); border-radius: 8px; padding: 25px; margin: 20px 0;">
            <h2 style="color: #00ffe1; margin-top: 0;">Password Reset Request</h2>
            <p style="color: #e2e8f0; line-height: 1.6;">
              We received a request to reset your password for your GuardianChain account. 
              Click the button below to create a new password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="display: inline-block; background: linear-gradient(135deg, #00ffe1, #7c3aed); 
                        color: #1a1a2e; text-decoration: none; padding: 15px 30px; 
                        border-radius: 8px; font-weight: bold; font-size: 16px;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #94a3b8; font-size: 14px; line-height: 1.5;">
              This link will expire in 1 hour for security reasons. If you didn't request this reset, 
              please ignore this email and your password will remain unchanged.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
            <p style="color: #64748b; font-size: 12px; margin: 0;">
              This email was sent from GuardianChain security system
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Password reset email sent to: ${email}`);
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Failed to send reset email');
  }
}

export async function sendWelcomeEmail(email: string, username: string) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@guardianchain.app',
      to: email,
      subject: '🎉 Welcome to GuardianChain!',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background: linear-gradient(135deg, #1a1a2e, #16213e); color: #fff; border-radius: 12px; padding: 30px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #00ffe1; margin: 0;">🛡️ GuardianChain</h1>
            <p style="color: #b0b7c3; margin: 10px 0 0;">Welcome to the Future of Truth</p>
          </div>
          
          <div style="background: rgba(255,255,255,0.05); border-radius: 8px; padding: 25px; margin: 20px 0;">
            <h2 style="color: #00ffe1; margin-top: 0;">Welcome, ${username}!</h2>
            <p style="color: #e2e8f0; line-height: 1.6;">
              You've successfully joined GuardianChain, the premier platform for decentralized truth verification 
              and blockchain-based memory storage. Your journey as a Guardian begins now!
            </p>
            
            <div style="margin: 25px 0;">
              <h3 style="color: #7c3aed; margin-bottom: 15px;">🎁 Your Welcome Rewards:</h3>
              <ul style="color: #cbd5e1; line-height: 1.8; padding-left: 20px;">
                <li>Exclusive Welcome NFT Capsule</li>
                <li>100 GTT Starter Tokens</li>
                <li>DAO Voting Privileges</li>
                <li>Full Platform Access</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/mint/register-reward" 
                 style="display: inline-block; background: linear-gradient(135deg, #00ffe1, #7c3aed); 
                        color: #1a1a2e; text-decoration: none; padding: 15px 30px; 
                        border-radius: 8px; font-weight: bold; font-size: 16px;">
                Claim Your Rewards
              </a>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
            <p style="color: #64748b; font-size: 12px; margin: 0;">
              Guardian since ${new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Welcome email sent to: ${email}`);
  } catch (error) {
    console.error('Welcome email failed:', error);
  }
}