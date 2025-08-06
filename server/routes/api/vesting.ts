import { Router } from "express";
import { pool } from "../../db";
import type { Request, Response } from "express";

const router = Router();

// Store vesting alert webhook endpoint
router.post("/webhook/cliff-alert", async (req: Request, res: Response) => {
  try {
    const { contributor, wallet, releasable } = req.body;
    
    console.log(`🔔 Vesting Alert: ${contributor} (${wallet}) has ${releasable} GTT available to claim`);
    
    // Store alert in database for tracking
    const client = await pool.connect();
    try {
      await client.query(`
        INSERT INTO vesting_alerts (
          contributor_name, 
          wallet_address, 
          releasable_amount, 
          alert_timestamp,
          status
        ) VALUES ($1, $2, $3, NOW(), 'sent')
        ON CONFLICT (contributor_name, wallet_address) 
        DO UPDATE SET 
          releasable_amount = $2,
          alert_timestamp = NOW(),
          status = 'updated'
      `, [contributor, wallet, releasable]);
      
    } finally {
      client.release();
    }

    // Here you could integrate with email/Discord/Slack notifications
    // Example: Send to Discord webhook
    if (process.env.DISCORD_WEBHOOK_URL) {
      await fetch(process.env.DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          embeds: [{
            title: "🔔 GTT Vesting Alert",
            description: `**${contributor}** has tokens available to claim!`,
            fields: [
              { name: "Wallet", value: `\`${wallet}\``, inline: true },
              { name: "Available GTT", value: `${parseFloat(releasable).toLocaleString()}`, inline: true }
            ],
            color: 0x00ffe1,
            timestamp: new Date().toISOString()
          }]
        })
      }).catch(console.warn);
    }

    res.json({ success: true, message: "Alert processed" });
  } catch (error) {
    console.error("Webhook alert error:", error);
    res.status(500).json({ success: false, message: "Alert processing failed" });
  }
});

// Get vesting analytics for admin dashboard
router.get("/analytics", async (req: Request, res: Response) => {
  try {
    const client = await pool.connect();
    try {
      const alertsResult = await client.query(`
        SELECT 
          contributor_name,
          wallet_address,
          releasable_amount,
          alert_timestamp,
          status
        FROM vesting_alerts 
        ORDER BY alert_timestamp DESC 
        LIMIT 50
      `);

      const analytics = {
        recentAlerts: alertsResult.rows,
        totalAlerts: alertsResult.rows.length,
        pendingClaims: alertsResult.rows.filter(row => 
          parseFloat(row.releasable_amount) > 0
        ).length
      };

      res.json(analytics);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Vesting analytics error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch analytics" });
  }
});

export default router;