import type { Express } from "express";
import { contactConfig, smtpConfig } from "../config/contact";
import { notificationService } from "../services/notifications";

export function registerContactRoutes(app: Express) {
  // Get contact information
  app.get("/api/contact/info", (req, res) => {
    res.json({
      business: contactConfig.business,
      emergency: {
        email: contactConfig.emergency.contacts[0].email,
        escalationTime: contactConfig.emergency.escalationTimeMinutes,
      },
      legal: contactConfig.legal,
      technical: contactConfig.technical,
      resendConfig: {
        domain: contactConfig.resend.domain,
        branding: contactConfig.resend.branding,
      },
    });
  });

  // Send contact form message
  app.post("/api/contact/send", async (req, res) => {
    try {
      const { name, email, subject, message, priority = "normal" } = req.body;

      // Validate input
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Determine recipient based on subject/priority
      const recipient = determineRecipient(subject, priority);

      // Send notification
      await notificationService.sendUserNotification(
        "contact_form",
        "contact_form_submission",
        {
          from: { name, email },
          subject,
          message,
          priority,
          recipient,
          timestamp: new Date(),
        }
      );

      // Send confirmation to user
      await sendConfirmationEmail(email, name, subject);

      res.json({
        success: true,
        message: "Your message has been sent successfully",
        expectedResponse: getExpectedResponseTime(priority),
        contactEmail: recipient,
      });
    } catch (error) {
      console.error("Contact form error:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  // Emergency contact endpoint
  app.post("/api/contact/emergency", async (req, res) => {
    try {
      const { name, email, message, severity = "high" } = req.body;

      // Send immediate emergency notification
      await notificationService.sendSecurityAlert("Emergency Contact Request", {
        from: { name, email },
        message,
        severity,
        timestamp: new Date(),
        requiresImmediateAttention: true,
      });

      res.json({
        success: true,
        message: "Emergency contact sent to master admin",
        expectedResponse: "30 minutes",
        emergencyContact: contactConfig.masterAdmin.email,
      });
    } catch (error) {
      console.error("Emergency contact error:", error);
      res.status(500).json({ error: "Failed to send emergency message" });
    }
  });

  // Get ProtonMail setup status
  app.get("/api/contact/protonmail-status", (req, res) => {
    res.json({
      configured: !!process.env.PROTONMAIL_APP_PASSWORD,
      smtpServer: smtpConfig.host,
      masterAdmin: contactConfig.masterAdmin.email,
      encryption: "end-to-end",
      bridge: "ProtonMail Bridge required for SMTP",
    });
  });

  // Resend integration status
  app.get("/api/contact/resend-status", (req, res) => {
    res.json({
      configured: !!process.env.RESEND_API_KEY,
      domain: contactConfig.resend.domain,
      fromEmail: contactConfig.resend.fromEmail,
      branding: contactConfig.resend.branding,
      status: process.env.RESEND_API_KEY ? "active" : "needs_configuration",
    });
  });
}

function determineRecipient(subject: string, priority: string): string {
  const subjectLower = subject.toLowerCase();

  if (
    priority === "emergency" ||
    subjectLower.includes("security") ||
    subjectLower.includes("emergency")
  ) {
    return contactConfig.masterAdmin.email;
  }

  if (subjectLower.includes("legal") || subjectLower.includes("compliance")) {
    return contactConfig.business.legal;
  }

  if (
    subjectLower.includes("partnership") ||
    subjectLower.includes("business")
  ) {
    return contactConfig.business.partnerships;
  }

  if (subjectLower.includes("technical") || subjectLower.includes("bug")) {
    return contactConfig.business.support;
  }

  return contactConfig.business.general;
}

function getExpectedResponseTime(priority: string): string {
  switch (priority) {
    case "emergency":
      return "30 minutes";
    case "high":
      return "2 hours";
    case "normal":
      return "24 hours";
    case "low":
      return "48 hours";
    default:
      return "24 hours";
  }
}

async function sendConfirmationEmail(
  email: string,
  name: string,
  subject: string
) {
  // In production, send confirmation email using Resend
  console.log(
    `Confirmation email would be sent to ${email} for subject: ${subject}`
  );
}
