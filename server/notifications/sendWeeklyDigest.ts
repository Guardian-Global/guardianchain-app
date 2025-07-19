import { sendGuardianEmail } from "../lib/mailer";

export async function sendDigest(user: any) {
  const totalValue = user.weeklyYield * 2.45; // GTT to USD conversion
  
  await sendGuardianEmail({
    to: user.email,
    subject: "📈 GUARDIANCHAIN Weekly GTT Report",
    markdown: `
## 📈 Weekly Capsule Summary

Hello **${user.name}**,

Your GUARDIANCHAIN performance for the week:

### 💰 GTT Rewards Earned
**${user.weeklyYield} GTT** (≈ $${totalValue.toFixed(2)} USD)

### 📊 Activity Breakdown
- **Capsules sealed:** ${user.sealedCount}
- **Capsules remixed:** ${user.remixedCount}  
- **Total views:** ${user.viewCount || 0}

### 🏆 Performance Highlights
- **Top Performer:** ${user.topCapsule || 'N/A'}
- **Engagement Rate:** ${user.engagementRate || '0%'}
- **Portfolio Growth:** +${user.portfolioGrowth || '0%'}

### 💡 Weekly Insights
Your content is generating consistent value in the GUARDIANCHAIN ecosystem. Continue creating high-quality capsules to maximize your GTT yield and strengthen your digital sovereignty.

[Open Portfolio Dashboard](https://guardianchain.ai/portfolio)  
[View Detailed Analytics](https://guardianchain.ai/capsule-analytics)
`,
  });
}

export async function sendMonthlyReport(user: any) {
  await sendGuardianEmail({
    to: user.email,
    subject: "🏆 GUARDIANCHAIN Monthly Achievement Report",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #7F5AF0 0%, #2CB67D 100%); color: white; padding: 20px; border-radius: 10px;">
        <h2 style="color: #FFD700;">🏆 Monthly Achievements</h2>
        <p>Congratulations <strong>${user.name}</strong>!</p>
        
        <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #2CB67D; margin-top: 0;">📊 Monthly Statistics</h3>
          <p>Total GTT Earned: <strong>${user.monthlyGTT || 0}</strong></p>
          <p>Capsules Created: <strong>${user.monthlyCapsules || 0}</strong></p>
          <p>AI Interactions: <strong>${user.monthlyAI || 0}</strong></p>
          <p>Community Rank: <strong>#${user.communityRank || 'N/A'}</strong></p>
        </div>

        <p>Your digital sovereignty grows stronger each month. Keep building your legacy!</p>
        <p style="color: #2CB67D; font-weight: bold;">GUARDIANCHAIN - Digital Sovereignty Secured</p>
      </div>
    `,
  });
}