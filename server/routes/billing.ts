import type { Express } from "express";
import { AuditAI } from "../agents/AuditAI";
import { ProtocolBillingFeedPublisher } from "../feeds/protocolBillingFeed";
import { GuardianTrustCalculator } from "../metering/aiYieldScore";
import { sendGuardianEmail } from "../lib/mailer";
import { notifyAdminOnCritical } from "../notifications/notifyAdmin";

interface BillingData {
  treasury: {
    balance: number;
    gttCirculation: number;
    weeklyVolume: number;
    monthlyRevenue: number;
  };
  invoices: Array<{
    id: string;
    vendor: string;
    amount: number;
    status: 'pending' | 'paid' | 'disputed';
    dueDate: string;
    category: string;
  }>;
  vendors: Array<{
    address: string;
    name: string;
    lifetimePayouts: number;
    paid: boolean;
    lastPayment: string;
    trustScore: number;
  }>;
}

export function registerBillingRoutes(app: Express) {
  // Get treasury overview and financial health
  app.get('/api/billing/treasury', async (req, res) => {
    try {
      // In production, this would fetch from blockchain and database
      const treasuryData = {
        balance: 247500, // GTT
        gttCirculation: 1250000,
        weeklyVolume: 38400,
        monthlyRevenue: 142000,
        lastUpdated: new Date().toISOString(),
        healthScore: 95,
        riskLevel: "LOW",
        trends: {
          balanceChange: "+12.4%",
          volumeChange: "+8.7%",
          revenueChange: "+15.2%"
        }
      };

      res.json({
        success: true,
        data: treasuryData
      });
    } catch (error) {
      console.error("Failed to fetch treasury data:", error);
      res.status(500).json({ error: "Failed to fetch treasury data" });
    }
  });

  // Get all pending invoices
  app.get('/api/billing/invoices', async (req, res) => {
    try {
      const invoices = [
        {
          id: "INV-2025-001",
          vendor: "ProtonMail",
          amount: 450,
          status: 'paid' as const,
          dueDate: "2025-01-15",
          category: "Infrastructure",
          description: "Email infrastructure - January 2025",
          paidDate: "2025-01-14"
        },
        {
          id: "INV-2025-002", 
          vendor: "AWS",
          amount: 1850,
          status: 'pending' as const,
          dueDate: "2025-01-25",
          category: "Cloud Services",
          description: "Computing and storage - January 2025",
          paidDate: null
        },
        {
          id: "INV-2025-003",
          vendor: "Chainlink",
          amount: 750,
          status: 'pending' as const,
          dueDate: "2025-01-30",
          category: "Oracle Services",
          description: "Price feeds and data oracles - January 2025", 
          paidDate: null
        },
        {
          id: "INV-2025-004",
          vendor: "Legal Counsel",
          amount: 2500,
          status: 'disputed' as const,
          dueDate: "2025-01-20",
          category: "Legal",
          description: "Regulatory compliance review - Q4 2024",
          paidDate: null
        }
      ];

      const summary = {
        total: invoices.length,
        pending: invoices.filter(i => i.status === 'pending').length,
        paid: invoices.filter(i => i.status === 'paid').length,
        disputed: invoices.filter(i => i.status === 'disputed').length,
        totalAmount: invoices.reduce((sum, inv) => sum + inv.amount, 0),
        pendingAmount: invoices.filter(i => i.status === 'pending').reduce((sum, inv) => sum + inv.amount, 0)
      };

      res.json({
        success: true,
        data: {
          invoices,
          summary
        }
      });
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
      res.status(500).json({ error: "Failed to fetch invoices" });
    }
  });

  // Get vendor information and payment history
  app.get('/api/billing/vendors', async (req, res) => {
    try {
      const vendors = [
        {
          address: "0x742d35Cc4C0C06d32e95b96D77fd31f0f0b5d5A1",
          name: "ProtonMail",
          lifetimePayouts: 5400,
          paid: true,
          lastPayment: "2025-01-14",
          trustScore: 0.98,
          category: "Infrastructure",
          monthlyAverage: 450,
          paymentHistory: 12
        },
        {
          address: "0x8ba1f109551bD432803012645Hac136c22C501e0",
          name: "AWS",
          lifetimePayouts: 18750,
          paid: false,
          lastPayment: "2024-12-28",
          trustScore: 0.92,
          category: "Cloud Services", 
          monthlyAverage: 1650,
          paymentHistory: 18
        },
        {
          address: "0x123d456f789a012b345c678d901e234f567a890b",
          name: "Chainlink",
          lifetimePayouts: 9200,
          paid: false,
          lastPayment: "2024-12-30",
          trustScore: 0.89,
          category: "Oracle Services",
          monthlyAverage: 800,
          paymentHistory: 8
        },
        {
          address: "0x987f654e321b098c765d432a109f876e543b210a",
          name: "Legal Counsel",
          lifetimePayouts: 15600,
          paid: false,
          lastPayment: "2024-11-15",
          trustScore: 0.75,
          category: "Legal",
          monthlyAverage: 2200,
          paymentHistory: 6
        }
      ];

      const summary = {
        totalVendors: vendors.length,
        activeVendors: vendors.filter(v => v.trustScore > 0.8).length,
        totalPayouts: vendors.reduce((sum, v) => sum + v.lifetimePayouts, 0),
        averageTrustScore: vendors.reduce((sum, v) => sum + v.trustScore, 0) / vendors.length
      };

      res.json({
        success: true,
        data: {
          vendors,
          summary
        }
      });
    } catch (error) {
      console.error("Failed to fetch vendors:", error);
      res.status(500).json({ error: "Failed to fetch vendors" });
    }
  });

  // Calculate Guardian Trust Score for a user
  app.post('/api/billing/trust-score', async (req, res) => {
    try {
      const { userId, userMetrics } = req.body;
      
      // Default metrics if not provided
      const metrics = userMetrics || {
        gttSpent: 1200,
        gttEarned: 1850,
        capsulesCreated: 15,
        capsulesRemixed: 8,
        capsulesSealed: 12,
        aiInteractions: 45,
        memorySaves: 23,
        daoVotes: 7,
        legacySet: true,
        accountAge: 120,
        verificationScore: 0.9,
        socialScore: 0.75
      };

      const trustResult = GuardianTrustCalculator.calculateGuardianTrustScore(metrics);

      res.json({
        success: true,
        data: {
          userId,
          trustScore: trustResult,
          calculatedAt: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error("Failed to calculate trust score:", error);
      res.status(500).json({ error: "Failed to calculate trust score" });
    }
  });

  // Run comprehensive financial audit
  app.post('/api/billing/audit', async (req, res) => {
    try {
      // Gather current financial data
      const billingData: BillingData = {
        treasury: {
          balance: 247500,
          gttCirculation: 1250000,
          weeklyVolume: 38400,
          monthlyRevenue: 142000
        },
        invoices: [
          { id: "INV-2025-002", vendor: "AWS", amount: 1850, status: 'pending', dueDate: "2025-01-25", category: "Cloud Services" },
          { id: "INV-2025-003", vendor: "Chainlink", amount: 750, status: 'pending', dueDate: "2025-01-30", category: "Oracle Services" },
          { id: "INV-2025-004", vendor: "Legal Counsel", amount: 2500, status: 'disputed', dueDate: "2025-01-20", category: "Legal" }
        ],
        vendors: [
          { address: "0x742d35Cc4C0C06d32e95b96D77fd31f0f0b5d5A1", name: "ProtonMail", lifetimePayouts: 5400, paid: true, lastPayment: "2025-01-14", trustScore: 0.98 },
          { address: "0x8ba1f109551bD432803012645Hac136c22C501e0", name: "AWS", lifetimePayouts: 18750, paid: false, lastPayment: "2024-12-28", trustScore: 0.92 },
          { address: "0x123d456f789a012b345c678d901e234f567a890b", name: "Chainlink", lifetimePayouts: 9200, paid: false, lastPayment: "2024-12-30", trustScore: 0.89 },
          { address: "0x987f654e321b098c765d432a109f876e543b210a", name: "Legal Counsel", lifetimePayouts: 15600, paid: false, lastPayment: "2024-11-15", trustScore: 0.75 }
        ]
      };

      // Run AI audit
      const auditReport = await AuditAI.runAudit(billingData);

      // Publish protocol feed
      await ProtocolBillingFeedPublisher.publishProtocolFeed({
        ledgerHash: `0x${Date.now().toString(16)}${Math.random().toString(16).substr(2, 8)}`,
        totalYield: billingData.treasury.weeklyVolume,
        payouts: billingData.vendors.map(v => ({
          vendor: v.name,
          amount: v.lifetimePayouts,
          timestamp: v.lastPayment,
          invoiceId: `INV-${v.name.toUpperCase()}-001`,
          category: "Infrastructure"
        })),
        flags: auditReport.riskFlags,
        complianceScore: auditReport.complianceScore,
        auditTimestamp: auditReport.timestamp
      });

      res.json({
        success: true,
        data: {
          auditReport,
          feedPublished: true,
          message: "Financial audit completed and feed published"
        }
      });
    } catch (error) {
      console.error("Failed to run audit:", error);
      res.status(500).json({ error: "Failed to run audit" });
    }
  });

  // Get protocol billing feed (public endpoint)
  app.get('/api/billing/protocol-feed', async (req, res) => {
    try {
      const feedUrl = ProtocolBillingFeedPublisher.getFeedUrl(req.protocol + '://' + req.get('host'));
      
      res.json({
        success: true,
        data: {
          feedUrl,
          lastUpdated: new Date().toISOString(),
          format: "JSON/XBRL",
          compliance: "GAAP/IFRS",
          retention: "7_years_immutable"
        }
      });
    } catch (error) {
      console.error("Failed to get protocol feed:", error);
      res.status(500).json({ error: "Failed to get protocol feed" });
    }
  });

  // Emergency billing system check
  app.post('/api/billing/emergency-check', async (req, res) => {
    try {
      const { reason, context } = req.body;
      
      // Run emergency audit
      const emergencyData = {
        treasury: { balance: 247500, gttCirculation: 1250000, weeklyVolume: 38400, monthlyRevenue: 142000 },
        invoices: [],
        vendors: []
      };

      const emergencyReport = await AuditAI.runAudit(emergencyData);
      
      // Send critical alert
      await notifyAdminOnCritical(`Emergency billing check triggered: ${reason}`, {
        emergencyReport,
        triggerReason: reason,
        context,
        timestamp: new Date().toISOString()
      });

      res.json({
        success: true,
        data: {
          emergencyReport,
          alertSent: true,
          message: "Emergency check completed and admin notified"
        }
      });
    } catch (error) {
      console.error("Failed emergency check:", error);
      res.status(500).json({ error: "Failed emergency check" });
    }
  });

  // Schedule automated audits
  app.post('/api/billing/schedule-audit', async (req, res) => {
    try {
      await AuditAI.scheduleWeeklyAudit();
      
      res.json({
        success: true,
        data: {
          scheduled: true,
          nextAudit: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          message: "Weekly audit scheduled successfully"
        }
      });
    } catch (error) {
      console.error("Failed to schedule audit:", error);
      res.status(500).json({ error: "Failed to schedule audit" });
    }
  });
}