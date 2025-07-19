import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendGuardianEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  try {
    const res = await transporter.sendMail({
      from: `"GUARDIANCHAIN AI" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text: text || html.replace(/<[^>]*>/g, ""),
      html,
    });

    console.log("✉️ Email sent:", res.messageId);
    return res;
  } catch (err) {
    console.error("❌ Email send failed:", err);
    throw err;
  }
}