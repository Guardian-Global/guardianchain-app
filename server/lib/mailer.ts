import nodemailer from "nodemailer";
import { renderMarkdown } from "./renderMarkdown";
import { getUserPreferences, isEmailTypeEnabled } from "../utils/emailPrefs";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

import { getEmailSystemStatus, mockSendEmail } from './emailStatus';

// Primary founder email for oversight and compliance
const FOUNDER_EMAIL = "founder+guardian-admin@guardianchain.org";

export async function sendGuardianEmail({
  to,
  subject,
  markdown,
  html,
  text,
  forceSend = false,
  notificationType = "general",
}: {
  to: string;
  subject: string;
  markdown?: string;
  html?: string;
  text?: string;
  forceSend?: boolean;
  notificationType?: string;
}) {
  const emailStatus = getEmailSystemStatus();
  
  // Check if SMTP is configured
  if (!emailStatus.configured) {
    console.log(`📧 SMTP not configured. Mock sending email to ${to}`);
    return mockSendEmail(to, subject);
  }

  try {
    // Check user preferences (bypass for critical alerts)
    if (!forceSend) {
      const prefs = await getUserPreferences(to);
      if (!prefs?.emailEnabled) {
        console.log(`📭 Email disabled for ${to} - skipping: ${subject}`);
        return;
      }
    }

    // Generate HTML content
    const finalHtml = html || renderMarkdown(markdown || "");
    const plainText = text || (markdown || "").replace(/[#_*`]/g, "");

    // Add tracking pixel
    const htmlWithTracking = finalHtml + `<img src="https://track.guardianchain.app/pixel?email=${encodeURIComponent(to)}&type=${notificationType}" width="1" height="1" style="display:none;" />`;

    // Always CC founder for oversight and compliance
    const recipients = [to, FOUNDER_EMAIL];

    const res = await transporter.sendMail({
      from: `"GUARDIANCHAIN Protocol" <${process.env.SMTP_USER}>`,
      to: recipients,
      subject: `[GUARDIANCHAIN] ${subject}`,
      text: plainText,
      html: htmlWithTracking,
    });

    console.log(`✉️ GUARDIANCHAIN email sent to ${to} (CC: founder): ${subject} (type: ${notificationType})`);
    return res;
  } catch (err) {
    console.error("❌ GUARDIANCHAIN email send failed:", err);
    // Fallback to mock for development
    return mockSendEmail(to, subject);
  }
}

// Legacy function for backward compatibility
export async function sendNotificationEmail(params: any) {
  return sendGuardianEmail({
    ...params,
    markdown: params.message,
  });
}