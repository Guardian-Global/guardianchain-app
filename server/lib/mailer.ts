import nodemailer from "nodemailer";
import { marked } from "marked";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Enhanced markdown to HTML renderer
export function renderMarkdown(markdown: string): string {
  return marked.parse(markdown);
}

// Advanced email preferences system
const emailPrefsDB = new Map();

export async function getUserPreferences(email: string) {
  return emailPrefsDB.get(email.toLowerCase()) || { emailEnabled: true };
}

export async function setUserEmailPreference(email: string, enabled: boolean) {
  emailPrefsDB.set(email.toLowerCase(), { emailEnabled: enabled });
}

import { getEmailSystemStatus, mockSendEmail } from './emailStatus';

export async function sendGuardianEmail({
  to,
  subject,
  markdown,
  html,
  text,
  forceSend = false,
}: {
  to: string;
  subject: string;
  markdown?: string;
  html?: string;
  text?: string;
  forceSend?: boolean;
}) {
  const emailStatus = getEmailSystemStatus();
  
  // Check if SMTP is configured
  if (!emailStatus.configured) {
    console.log(`📧 SMTP not configured. Mock sending email to ${to}`);
    return mockSendEmail(to, subject);
  }

  try {
    // Check user preferences (bypass for critical alerts)
    const prefs = await getUserPreferences(to);
    if (!prefs?.emailEnabled && !forceSend) {
      console.log(`📭 Email disabled for ${to}`);
      return;
    }

    // Advanced template processing
    const finalHtml = html || (markdown ? renderMarkdown(markdown) : '');
    const plain = text || (markdown || '').replace(/[#_*`]/g, '');

    // Add GUARDIANCHAIN branding and tracking
    const brandedHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #7F5AF0 0%, #2CB67D 100%); color: white; padding: 20px; border-radius: 10px;">
        ${finalHtml}
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.2); text-align: center;">
          <p style="color: #2CB67D; font-weight: bold; margin: 0;">GUARDIANCHAIN - Digital Sovereignty Secured</p>
        </div>
      </div>
      <img src="https://track.guardianchain.ai/pixel?email=${encodeURIComponent(to)}" width="1" height="1" style="display: none;"/>
    `;

    const res = await transporter.sendMail({
      from: `"GUARDIANCHAIN AI" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text: plain,
      html: brandedHtml,
    });

    console.log(`✉️ Sent to ${to}: ${subject} (${res.messageId})`);
    return res;
  } catch (err) {
    console.error("❌ Email send failed:", err);
    // Fallback to mock for development
    return mockSendEmail(to, subject);
  }
}