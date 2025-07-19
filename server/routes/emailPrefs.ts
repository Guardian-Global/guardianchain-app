import type { Express } from "express";
import { getUserPreferences, setUserPreferences } from "../utils/emailPrefs";
import { sendGuardianEmail } from "../lib/mailer";

export function registerEmailPrefsRoutes(app: Express) {
  // Get user email preferences
  app.get("/api/email-preferences/:email", async (req, res) => {
    try {
      const { email } = req.params;
      const preferences = await getUserPreferences(email);
      res.json(preferences);
    } catch (error) {
      console.error("Failed to get email preferences:", error);
      res.status(500).json({ error: "Failed to get preferences" });
    }
  });

  // Update user email preferences
  app.post("/api/email-preferences/:email", async (req, res) => {
    try {
      const { email } = req.params;
      const preferences = req.body;
      
      const success = await setUserPreferences(email, preferences);
      
      if (success) {
        // Send confirmation email
        await sendGuardianEmail({
          to: email,
          subject: "📧 Email Preferences Updated",
          notificationType: "preference_change",
          markdown: `
# 📧 Email Preferences Updated

Your GUARDIANCHAIN email notification preferences have been successfully updated.

## Current Settings
- **Email Notifications:** ${preferences.emailEnabled ? 'Enabled ✅' : 'Disabled ❌'}
- **Capsule Events:** ${preferences.capsuleEvents ? 'Enabled ✅' : 'Disabled ❌'}
- **AI Memory Saves:** ${preferences.aiMemorySaves ? 'Enabled ✅' : 'Disabled ❌'}
- **DAO Votes:** ${preferences.daoVotes ? 'Enabled ✅' : 'Disabled ❌'}
- **Weekly Digest:** ${preferences.weeklyDigest ? 'Enabled ✅' : 'Disabled ❌'}

## Important Notes
- Critical security alerts will always be delivered regardless of your preferences
- Changes take effect immediately
- You can update these settings anytime from your profile

---

**[Update Preferences](https://guardianchain.app/profile?tab=notifications)** | **[Privacy Policy](https://guardianchain.app/legal/privacy)**

*Your privacy and communication preferences are important to us.*
`,
        });
        
        res.json({ success: true, preferences });
      } else {
        res.status(500).json({ error: "Failed to update preferences" });
      }
    } catch (error) {
      console.error("Failed to update email preferences:", error);
      res.status(500).json({ error: "Failed to update preferences" });
    }
  });

  // Test email sending (for development/admin use)
  app.post("/api/test-email", async (req, res) => {
    try {
      const { to, type = "test" } = req.body;
      
      await sendGuardianEmail({
        to,
        subject: "🧪 GUARDIANCHAIN Email Test",
        notificationType: "test",
        markdown: `
# 🧪 Email System Test

This is a test email to verify that the GUARDIANCHAIN email system is working correctly.

## Test Details
- **Recipient:** ${to}
- **Test Time:** ${new Date().toLocaleString()}
- **Email Type:** ${type}
- **System Status:** ✅ Operational

If you received this email, the notification system is functioning properly.

---

**[GUARDIANCHAIN Platform](https://guardianchain.app)** | **[Contact Support](https://guardianchain.app/contact)**
`,
      });
      
      res.json({ success: true, message: "Test email sent successfully" });
    } catch (error) {
      console.error("Failed to send test email:", error);
      res.status(500).json({ error: "Failed to send test email" });
    }
  });

  // Opt-out unsubscribe endpoint
  app.post("/api/unsubscribe/:email", async (req, res) => {
    try {
      const { email } = req.params;
      
      const success = await setUserPreferences(email, { 
        emailEnabled: false,
        capsuleEvents: false,
        aiMemorySaves: false,
        daoVotes: false,
        weeklyDigest: false
      });
      
      if (success) {
        res.json({ 
          success: true, 
          message: "Successfully unsubscribed from all non-critical emails" 
        });
      } else {
        res.status(500).json({ error: "Failed to unsubscribe" });
      }
    } catch (error) {
      console.error("Failed to unsubscribe:", error);
      res.status(500).json({ error: "Failed to unsubscribe" });
    }
  });
}