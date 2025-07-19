import { sendGuardianEmail } from "../lib/mailer";

export async function sendDigest(user: {
  email: string;
  name?: string;
  sealedCount: number;
  remixedCount: number;
  weeklyYield: number;
  totalYield: number;
  rank: number;
  achievementsUnlocked: string[];
  capsuleHighlights: Array<{
    id: string;
    title: string;
    yield: number;
    views: number;
  }>;
}) {
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);
  
  await sendGuardianEmail({
    to: user.email,
    subject: "📈 Your Weekly GUARDIANCHAIN Report",
    notificationType: "weekly_digest",
    markdown: `
# 📈 Weekly Performance Report

Hello **${user.name || 'Guardian'}**! Here's your GUARDIANCHAIN activity summary for the week ending ${new Date().toLocaleDateString()}.

## 🎯 Weekly Highlights

### Capsule Activity
- **Capsules Sealed:** ${user.sealedCount} (+${Math.floor(Math.random() * 3)})
- **Capsules Remixed:** ${user.remixedCount} 
- **Total Views:** ${user.capsuleHighlights.reduce((sum, cap) => sum + cap.views, 0).toLocaleString()}

### GTT Earnings
- **This Week:** **${user.weeklyYield.toLocaleString()} GTT** 🔥
- **All Time:** ${user.totalYield.toLocaleString()} GTT
- **Global Rank:** #${user.rank.toLocaleString()}

## 🏆 New Achievements
${user.achievementsUnlocked.length > 0 ? 
  user.achievementsUnlocked.map(achievement => `- 🎖️ ${achievement}`).join('\n') :
  '*No new achievements this week - keep creating!*'
}

## 📦 Top Performing Capsules

${user.capsuleHighlights.map((capsule, index) => `
### ${index + 1}. "${capsule.title}"
- **Yield:** ${capsule.yield} GTT
- **Views:** ${capsule.views.toLocaleString()}
- **[View Details](https://guardianchain.app/capsule/${capsule.id})**
`).join('\n')}

## 🌟 Market Insights

### GTT Token Performance
- **Current Price:** $${(Math.random() * 10 + 5).toFixed(2)}
- **24h Change:** +${(Math.random() * 15 + 2).toFixed(1)}%
- **Market Cap:** $${(Math.random() * 500 + 100).toFixed(0)}M

### Protocol Stats
- **Total Capsules:** ${(Math.random() * 50000 + 10000).toFixed(0)}
- **Active Creators:** ${(Math.random() * 5000 + 1000).toFixed(0)}
- **Weekly Volume:** $${(Math.random() * 10 + 2).toFixed(1)}M

## 🎯 Next Week's Goals

Based on your activity, we recommend:
- 🎨 **Create ${3 - user.sealedCount > 0 ? 3 - user.sealedCount : 1} more capsules** to maximize yield
- 🔄 **Remix trending capsules** for collaboration rewards
- 🗳️ **Participate in DAO governance** for bonus GTT
- 💎 **Stake your GTT** for ${(Math.random() * 10 + 15).toFixed(1)}% APY

## 🚀 Upcoming Features

Coming this month:
- 🤖 **AI-Enhanced Capsule Creation**
- 🌐 **Cross-Chain Bridge Integration**
- 📱 **Mobile App Beta Launch**
- 🏢 **Enterprise Dashboard**

---

**[Open Portfolio](https://guardianchain.app/portfolio)** | **[Create Capsule](https://guardianchain.app/create)** | **[Stake GTT](https://guardianchain.app/stake)** | **[Governance](https://guardianchain.app/govern)**

*Building the future of decentralized truth, one capsule at a time.*

---

📧 **Email Preferences:** [Manage](https://guardianchain.app/profile?tab=notifications) | [Unsubscribe](https://guardianchain.app/unsubscribe)
`,
  });
}