import { sendGuardianEmail } from "../lib/mailer";

const adminEmail = "commander.guardian@protonmail.com";

export async function notifyAdminOnCritical(message: string) {
  await sendGuardianEmail({
    to: adminEmail,
    subject: "⚠️ GUARDIANCHAIN System Alert",
    markdown: `
## URGENT SYSTEM EVENT

${message}

**Time:** ${new Date().toISOString()}

**Action Required:** Immediate attention needed

[Open Admin Dashboard](https://guardianchain.ai/master-admin)
`,
    forceSend: true,
  });
}

export async function notifyAdminUserAction({ action, userId, details }: any) {
  await sendGuardianEmail({
    to: adminEmail,
    subject: `🔔 GUARDIANCHAIN User Action: ${action}`,
    markdown: `
## User Activity Alert

**Action:** ${action}
**User ID:** ${userId}
**Details:** ${details}
**Time:** ${new Date().toISOString()}

[View User Dashboard](https://guardianchain.ai/master-admin)
`,
    forceSend: true,
  });
}

export async function notifyAdminSystemHealth(healthData: any) {
  await sendGuardianEmail({
    to: adminEmail,
    subject: "📊 GUARDIANCHAIN Daily System Report",
    markdown: `
## Daily System Health Report

**Date:** ${new Date().toDateString()}

### System Status
- **Database:** ${healthData.database || 'Healthy'}
- **Blockchain:** ${healthData.blockchain || 'Healthy'}
- **AI Services:** ${healthData.ai || 'Healthy'}
- **Email System:** ${healthData.email || 'Healthy'}

### Daily Metrics
- **Active Users:** ${healthData.activeUsers || 0}
- **New Capsules:** ${healthData.newCapsules || 0}
- **GTT Minted:** ${healthData.gttMinted || 0}
- **Revenue:** $${healthData.revenue || 0}

### Alerts
${healthData.alerts?.length ? healthData.alerts.map((alert: string) => `- ${alert}`).join('\n') : '- No alerts'}

[View Full Dashboard](https://guardianchain.ai/master-admin)
`,
    forceSend: true,
  });
}