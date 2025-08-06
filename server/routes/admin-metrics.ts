import express from "express";
import { consolidatedAuth } from "../auth/authConsolidation";

export const adminMetricsRoutes = express.Router();

// Verify admin access
adminMetricsRoutes.get("/verify", consolidatedAuth, async (req: any, res) => {
  try {
    const userTier = req.user?.tier || "EXPLORER";
    
    // Check if user has admin privileges
    if (!["ADMIN", "SOVEREIGN"].includes(userTier)) {
      return res.status(403).json({ error: "Admin access required" });
    }
    
    res.json({ 
      success: true, 
      message: "Admin access verified",
      tier: userTier 
    });
  } catch (error) {
    console.error("Error verifying admin access:", error);
    res.status(500).json({ error: "Failed to verify admin access" });
  }
});

// Get admin metrics data
adminMetricsRoutes.get("/metrics", consolidatedAuth, async (req: any, res) => {
  try {
    const userTier = req.user?.tier || "EXPLORER";
    
    if (!["ADMIN", "SOVEREIGN"].includes(userTier)) {
      return res.status(403).json({ error: "Admin access required" });
    }
    
    // Mock admin metrics - replace with actual database queries
    const mockMetrics = {
      totalUsers: 5691,
      activeUsers: 2847,
      newSignups: 284,
      capsulesMinted: 12847,
      verificationRate: 94.2,
      systemHealth: 99.8,
      lastUpdated: new Date().toISOString()
    };

    res.json(mockMetrics);
    console.log("🔧 Admin metrics requested by", req.user?.id);
  } catch (error) {
    console.error("Error fetching admin metrics:", error);
    res.status(500).json({ error: "Failed to fetch admin metrics" });
  }
});

// Export admin metrics
adminMetricsRoutes.post("/export", consolidatedAuth, async (req: any, res) => {
  try {
    const userTier = req.user?.tier || "EXPLORER";
    const { format, type } = req.body;
    
    if (!["ADMIN", "SOVEREIGN"].includes(userTier)) {
      return res.status(403).json({ error: "Admin access required" });
    }
    
    if (format === "csv" && type === "metrics") {
      console.log("📊 Generating admin metrics CSV export");
      
      // Mock CSV generation - replace with actual CSV export
      const csvData = `Date,Users,Active Users,New Signups,Capsules,Verification Rate,System Health
2025-08-06,5691,2847,284,12847,94.2,99.8`;
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="admin-metrics.csv"');
      res.send(csvData);
    } else {
      res.status(400).json({ error: "Unsupported export format or type" });
    }
  } catch (error) {
    console.error("Error exporting admin metrics:", error);
    res.status(500).json({ error: "Failed to export admin metrics" });
  }
});

export default adminMetricsRoutes;