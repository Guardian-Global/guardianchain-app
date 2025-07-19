import type { Express } from "express";
import { getEmailSystemStatus } from "../lib/emailStatus";

export function registerEmailStatusRoutes(app: Express) {
  // Email system status endpoint
  app.get('/api/email/status', (req, res) => {
    const status = getEmailSystemStatus();
    res.json(status);
  });
  
  // ProtonMail configuration guide
  app.get('/api/email/setup-guide', (req, res) => {
    res.json({
      title: "ProtonMail SMTP Setup for GUARDIANCHAIN",
      steps: [
        {
          step: 1,
          title: "Get ProtonMail Account",
          description: "Ensure you have a ProtonMail account (commander.guardian@protonmail.com recommended)"
        },
        {
          step: 2, 
          title: "Generate App Password",
          description: "Go to ProtonMail Settings > Security > Generate app-specific password for SMTP"
        },
        {
          step: 3,
          title: "Configure Environment Variables",
          description: "Set these secrets in your environment:",
          secrets: [
            "SMTP_HOST=smtp.protonmail.ch",
            "SMTP_PORT=587", 
            "SMTP_USER=commander.guardian@protonmail.com",
            "SMTP_PASS=your-generated-app-password"
          ]
        },
        {
          step: 4,
          title: "Test Email System",
          description: "Use the notification center to test email sending"
        }
      ],
      note: "All 8 notification types are ready: Memory saves, Capsule events, DAO votes, Weekly reports, Legacy alerts, Admin notifications, Opt-in/out confirmations"
    });
  });
}