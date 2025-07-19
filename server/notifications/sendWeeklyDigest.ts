import { sendGuardianEmail } from "../lib/mailer";

export async function sendDigest(user: any) {
  const totalValue = user.weeklyYield * 2.45; // GTT to USD conversion
  
  await sendGuardianEmail({
    to: user.email,
    subject: "📈 GUARDIANCHAIN Weekly GTT Report",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #7F5AF0 0%, #2CB67D 100%); color: white; padding: 20px; border-radius: 10px;">
        <h2 style="color: #2CB67D;">📈 Weekly Performance Report</h2>
        <p>Hello <strong>${user.name}</strong>,</p>
        <p>Here's your weekly GUARDIANCHAIN performance summary:</p>
        
        <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #FFD700; margin-top: 0;">💰 GTT Rewards</h3>
          <p style="font-size: 24px; margin: 10px 0;"><strong>${user.weeklyYield} GTT</strong></p>
          <p style="font-size: 16px; opacity: 0.9;">≈ $${totalValue.toFixed(2)} USD</p>
        </div>

        <div style="display: flex; justify-content: space-between; margin: 20px 0;">
          <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; width: 30%;">
            <h4 style="color: #2CB67D; margin: 0;">📦 Sealed</h4>
            <p style="font-size: 20px; margin: 5px 0;"><strong>${user.sealedCount}</strong></p>
          </div>
          <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; width: 30%;">
            <h4 style="color: #2CB67D; margin: 0;">🔄 Remixed</h4>
            <p style="font-size: 20px; margin: 5px 0;"><strong>${user.remixedCount}</strong></p>
          </div>
          <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; width: 30%;">
            <h4 style="color: #2CB67D; margin: 0;">👀 Views</h4>
            <p style="font-size: 20px; margin: 5px 0;"><strong>${user.viewCount || 0}</strong></p>
          </div>
        </div>

        <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin: 15px 0;">
          <p>🎯 <strong>Top Performer:</strong> ${user.topCapsule || 'N/A'}</p>
          <p>🔥 <strong>Engagement Rate:</strong> ${user.engagementRate || '0%'}</p>
          <p>📊 <strong>Portfolio Growth:</strong> +${user.portfolioGrowth || '0%'}</p>
        </div>

        <p>Keep creating valuable content to increase your GTT yield and digital sovereignty.</p>
        <p style="color: #2CB67D; font-weight: bold;">GUARDIANCHAIN - Digital Sovereignty Secured</p>
      </div>
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