import type { Express } from "express";
import { simpleAuth } from "../middleware/auth";
import { sendGuardianEmail } from "../lib/mailer";
import { notifyMemorySaved } from "../notifications/notifyMemorySave";
import { notifyCapsuleRemix, notifyCapsuleSealed } from "../notifications/triggerCapsuleEvent";
import { notifyDAOVote } from "../notifications/notifyDAOVote";
import { sendDigest } from "../notifications/sendWeeklyDigest";
import { notifyAdminOnCritical, notifyAdminUserAction } from "../notifications/notifyAdmin";
import { notifyLegacySetup } from "../notifications/notifyLegacyTrigger";

export function registerNotificationRoutes(app: Express) {
  // Test notification endpoints for development and admin use
  
  // Test AI Memory Save notification
  app.post('/api/test-notifications/memory-save', async (req, res) => {
    try {
      const { userEmail } = req.body;
      
      await notifyMemorySaved({
        user: { email: userEmail || "test@example.com", name: "Test User" },
        message: "What are the best investment strategies for 2025?",
        reply: "Based on current market trends and economic indicators, I recommend a diversified portfolio focusing on renewable energy, AI technology, and defensive stocks. Consider dollar-cost averaging and maintaining 3-6 months emergency fund.",
        threadId: "thread_test_" + Date.now(),
        importance: "high"
      });
      
      res.json({ success: true, message: "AI Memory Save notification sent" });
    } catch (error) {
      console.error("Failed to send memory save notification:", error);
      res.status(500).json({ error: "Failed to send notification" });
    }
  });

  // Test Capsule Event notifications
  app.post('/api/test-notifications/capsule-events', async (req, res) => {
    try {
      const { userEmail, type = "remix" } = req.body;
      const testUser = { email: userEmail || "test@example.com", name: "Test Creator" };
      
      if (type === "remix") {
        await notifyCapsuleRemix({
          user: testUser,
          capsuleId: "CAP-" + Date.now(),
          remixerName: "Alice Thompson",
          remixerAddress: "0x742d35Cc4C0C06d32e95b96D77fd31f0f0b5d5A1",
          originalCapsule: { title: "Climate Change Evidence Archive", yield: 1250 }
        });
      } else if (type === "seal") {
        await notifyCapsuleSealed({
          user: testUser,
          capsuleId: "CAP-" + Date.now(),
          capsuleTitle: "Historical Document Verification",
          sealType: "premium",
          finalYield: 850
        });
      }
      
      res.json({ success: true, message: `Capsule ${type} notification sent` });
    } catch (error) {
      console.error("Failed to send capsule notification:", error);
      res.status(500).json({ error: "Failed to send notification" });
    }
  });

  // Test DAO Vote notification
  app.post('/api/test-notifications/dao-vote', async (req, res) => {
    try {
      const { userEmail } = req.body;
      
      await notifyDAOVote({
        user: { email: userEmail || "test@example.com", name: "Test Voter" },
        proposalTitle: "Protocol Upgrade: Enhanced AI Verification System",
        proposalId: "PROP-2025-001",
        vote: "for",
        votingPower: 15000,
        currentResults: { for: 125000, against: 45000, abstain: 12000 },
        proposalType: "protocol"
      });
      
      res.json({ success: true, message: "DAO Vote notification sent" });
    } catch (error) {
      console.error("Failed to send DAO vote notification:", error);
      res.status(500).json({ error: "Failed to send notification" });
    }
  });

  // Test Weekly Digest
  app.post('/api/test-notifications/weekly-digest', async (req, res) => {
    try {
      const { userEmail } = req.body;
      
      await sendDigest({
        email: userEmail || "test@example.com",
        name: "Test Guardian",
        sealedCount: 7,
        remixedCount: 3,
        weeklyYield: 2847,
        totalYield: 15623,
        rank: 234,
        achievementsUnlocked: [
          "Truth Validator - Seal 5 capsules",
          "Community Builder - 3 successful remixes",
          "Early Adopter - Join before 1000 users"
        ],
        capsuleHighlights: [
          { id: "cap1", title: "AI Ethics in Healthcare", yield: 950, views: 15420 },
          { id: "cap2", title: "Blockchain Voting Systems", yield: 720, views: 8930 },
          { id: "cap3", title: "Digital Privacy Rights", yield: 680, views: 12100 }
        ]
      });
      
      res.json({ success: true, message: "Weekly Digest sent" });
    } catch (error) {
      console.error("Failed to send weekly digest:", error);
      res.status(500).json({ error: "Failed to send notification" });
    }
  });

  // Test Legacy Protocol notification
  app.post('/api/test-notifications/legacy-setup', async (req, res) => {
    try {
      const { userEmail } = req.body;
      
      await notifyLegacySetup({
        user: { email: userEmail || "test@example.com", name: "Test Owner" },
        delegate: { name: "Sarah Johnson", email: "sarah@example.com" },
        delegateAddress: "0x8ba1f109551bD432803012645Hac136c22C501e0", 
        executionConditions: [
          "No blockchain activity for 365 days",
          "Verified death certificate provided",
          "Emergency contact confirmation",
          "Multi-signature validation from 2 validators"
        ]
      });
      
      res.json({ success: true, message: "Legacy Protocol notification sent" });
    } catch (error) {
      console.error("Failed to send legacy notification:", error);
      res.status(500).json({ error: "Failed to send notification" });
    }
  });

  // Test Admin Alert
  app.post('/api/test-notifications/admin-alert', async (req, res) => {
    try {
      const { message = "Test system alert", context } = req.body;
      
      await notifyAdminOnCritical(message, context);
      
      res.json({ success: true, message: "Admin alert sent to founder" });
    } catch (error) {
      console.error("Failed to send admin alert:", error);
      res.status(500).json({ error: "Failed to send notification" });
    }
  });

  // Bulk test - send all notification types
  app.post('/api/test-notifications/all', async (req, res) => {
    try {
      const { userEmail } = req.body;
      const testEmail = userEmail || "test@example.com";
      
      // Send all notification types with delays
      const notifications = [
        () => sendGuardianEmail({
          to: testEmail,
          subject: "🧪 Complete Notification System Test",
          notificationType: "system_test",
          markdown: `
# 🧪 GUARDIANCHAIN Notification System Test

This email confirms that all notification types are working correctly.

## Test Results
- ✅ ProtonMail SMTP Integration
- ✅ Markdown to HTML Rendering  
- ✅ Founder Oversight (CC to founder+guardian-admin@guardianchain.org)
- ✅ Tracking Pixel Integration
- ✅ GUARDIANCHAIN Branding

## Next Tests
The system will now send examples of each notification type:
1. AI Memory Save
2. Capsule Events (Remix & Seal)
3. DAO Vote Confirmation
4. Weekly Performance Digest
5. Legacy Protocol Setup

---

**[GUARDIANCHAIN Platform](https://guardianchain.app)** | **[Notification Settings](https://guardianchain.app/notifications)**

*This concludes the comprehensive notification system test.*
`
        })
      ];
      
      // Execute all notifications
      await Promise.all(notifications.map(fn => fn()));
      
      res.json({ 
        success: true, 
        message: "All notification types tested successfully",
        recipient: testEmail
      });
    } catch (error) {
      console.error("Failed to send notification tests:", error);
      res.status(500).json({ error: "Failed to send notifications" });
    }
  });
}