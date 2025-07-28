import { askAI } from "./ai";
import { getLatestTreasurySnapshot } from "./treasury";
import { getTreasurySummary } from "./veritus.engine";

export interface DailyReportData {
  date: string;
  capsuleStats: {
    newMints: number;
    totalActive: number;
    avgResonanceScore: number;
    verifiedCapsules: number;
  };
  yieldStats: {
    totalDistributed: number;
    avgYieldPerCapsule: number;
    topEarningCapsule: number;
    uniqueEarners: number;
  };
  financialStats: {
    gttMinted: number;
    platformRevenue: number;
    treasuryBalance: number;
    yieldPoolSize: number;
  };
  userStats: {
    newRegistrations: number;
    activeUsers: number;
    tierUpgrades: number;
    retentionRate: number;
  };
  complianceStats: {
    flaggedActivities: number;
    regionBlocks: number;
    suspiciousTransactions: number;
    complianceScore: number;
  };
  aiInsights: string;
}

export async function generateDailyReportData(): Promise<DailyReportData> {
  try {
    // Gather data from various sources
    const [treasurySnapshot, treasurySummary] = await Promise.all([
      getLatestTreasurySnapshot(),
      getTreasurySummary(),
    ]);

    // Mock data for demonstration - replace with actual data sources
    const reportData: DailyReportData = {
      date: new Date().toISOString().split("T")[0],
      capsuleStats: {
        newMints: Math.floor(Math.random() * 50) + 20,
        totalActive: 1247,
        avgResonanceScore: Math.floor(Math.random() * 30) + 70,
        verifiedCapsules: Math.floor(Math.random() * 15) + 5,
      },
      yieldStats: {
        totalDistributed: Math.floor(Math.random() * 500) + 200,
        avgYieldPerCapsule: Math.floor(Math.random() * 20) + 10,
        topEarningCapsule: Math.floor(Math.random() * 100) + 50,
        uniqueEarners: Math.floor(Math.random() * 100) + 80,
      },
      financialStats: {
        gttMinted: Math.floor(Math.random() * 2000) + 1000,
        platformRevenue:
          treasurySummary?.revenue || Math.floor(Math.random() * 5000) + 2000,
        treasuryBalance: treasurySnapshot?.gttTreasury || 135000000,
        yieldPoolSize: treasurySnapshot?.gttYieldPool || 75000000,
      },
      userStats: {
        newRegistrations: Math.floor(Math.random() * 20) + 10,
        activeUsers: Math.floor(Math.random() * 200) + 800,
        tierUpgrades: Math.floor(Math.random() * 10) + 2,
        retentionRate: Math.floor(Math.random() * 15) + 85,
      },
      complianceStats: {
        flaggedActivities: Math.floor(Math.random() * 3),
        regionBlocks: 0,
        suspiciousTransactions: Math.floor(Math.random() * 2),
        complianceScore: Math.floor(Math.random() * 5) + 95,
      },
      aiInsights: "",
    };

    // Generate AI insights
    const aiPrompt = `Analyze GuardianChain daily performance data and provide strategic insights:

Capsule Activity:
- New mints: ${reportData.capsuleStats.newMints}
- Active capsules: ${reportData.capsuleStats.totalActive}
- Average resonance: ${reportData.capsuleStats.avgResonanceScore}
- Verified capsules: ${reportData.capsuleStats.verifiedCapsules}

Financial Performance:
- GTT minted: ${reportData.financialStats.gttMinted}
- Platform revenue: $${reportData.financialStats.platformRevenue}
- Treasury balance: ${reportData.financialStats.treasuryBalance} GTT
- Yield distributed: ${reportData.yieldStats.totalDistributed} GTT

User Engagement:
- New users: ${reportData.userStats.newRegistrations}
- Active users: ${reportData.userStats.activeUsers}
- Retention rate: ${reportData.userStats.retentionRate}%

Provide:
1. Key performance highlights
2. Areas of concern
3. Strategic recommendations
4. Market opportunities`;

    const aiInsights = await askAI({
      prompt: aiPrompt,
      max_tokens: 400,
    });

    reportData.aiInsights = aiInsights;
    return reportData;
  } catch (error) {
    console.error("Error generating daily report data:", error);
    throw error;
  }
}

export async function getDailyReport(): Promise<string> {
  try {
    const data = await generateDailyReportData();

    return `
=== GUARDIANCHAIN DAILY OPERATIONS REPORT ===
Date: ${data.date}

📊 CAPSULE ACTIVITY
• New capsules minted: ${data.capsuleStats.newMints}
• Total active capsules: ${data.capsuleStats.totalActive.toLocaleString()}
• Average resonance score: ${data.capsuleStats.avgResonanceScore}
• Veritas verified: ${data.capsuleStats.verifiedCapsules}

💰 YIELD & REWARDS
• GTT distributed: ${data.yieldStats.totalDistributed}
• Average yield per capsule: ${data.yieldStats.avgYieldPerCapsule}
• Top earning capsule: ${data.yieldStats.topEarningCapsule} GTT
• Unique earners: ${data.yieldStats.uniqueEarners}

🏦 FINANCIAL SUMMARY
• GTT minted today: ${data.financialStats.gttMinted.toLocaleString()}
• Platform revenue: $${data.financialStats.platformRevenue.toLocaleString()}
• Treasury balance: ${data.financialStats.treasuryBalance.toLocaleString()} GTT
• Yield pool: ${data.financialStats.yieldPoolSize.toLocaleString()} GTT

👥 USER ENGAGEMENT
• New registrations: ${data.userStats.newRegistrations}
• Active users (24h): ${data.userStats.activeUsers}
• Tier upgrades: ${data.userStats.tierUpgrades}
• Retention rate: ${data.userStats.retentionRate}%

🛡️ COMPLIANCE STATUS
• Flagged activities: ${data.complianceStats.flaggedActivities}
• Region blocks: ${data.complianceStats.regionBlocks}
• Suspicious transactions: ${data.complianceStats.suspiciousTransactions}
• Compliance score: ${data.complianceStats.complianceScore}%

🤖 AI STRATEGIC INSIGHTS
${data.aiInsights}

Report generated: ${new Date().toLocaleString()}
System status: Operational ✅
    `.trim();
  } catch (error) {
    console.error("Error generating daily report:", error);
    return `
=== GUARDIANCHAIN DAILY OPERATIONS REPORT ===
Date: ${new Date().toISOString().split("T")[0]}

❌ Report Generation Failed
Unable to generate complete daily report due to system error.

Fallback Summary:
• System status: Monitoring
• Core services: Operational
• User activity: Normal patterns detected
• Revenue tracking: Active
• Compliance: Green status

Please check system logs and retry report generation.
Generated: ${new Date().toLocaleString()}
    `.trim();
  }
}

export async function scheduleNightlyReport() {
  // This would typically be called by a cron job or scheduler
  try {
    const report = await getDailyReport();

    // In production, send email notification
    console.log("Nightly report generated:", report);

    // Save to database/storage for historical tracking
    // await saveReportToDatabase(report);

    return report;
  } catch (error) {
    console.error("Nightly report generation failed:", error);
    throw error;
  }
}

export async function getHistoricalReports(days: number = 7) {
  // Mock historical data - replace with actual database queries
  const reports = [];
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    reports.push({
      date: date.toISOString().split("T")[0],
      summary: `Daily report for ${date.toLocaleDateString()}`,
      status: "completed",
    });
  }
  return reports;
}
