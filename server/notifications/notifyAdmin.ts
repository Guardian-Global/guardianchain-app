import { sendGuardianEmail } from "../lib/mailer";

const ADMIN_EMAIL = "founder+guardian-admin@guardianchain.org";

export async function notifyAdminOnCritical(message: string, context?: any) {
  await sendGuardianEmail({
    to: ADMIN_EMAIL,
    subject: "🚨 GUARDIANCHAIN System Alert",
    notificationType: "admin_alert",
    forceSend: true, // Critical alerts always send
    markdown: `
# 🚨 URGENT SYSTEM EVENT

**Alert Time:** ${new Date().toLocaleString()}

## Critical Alert
${message}

## System Context
${
  context
    ? `
\`\`\`json
${JSON.stringify(context, null, 2)}
\`\`\`
`
    : "*No additional context provided*"
}

## Immediate Actions Required
1. Review system status dashboard
2. Check error logs and metrics
3. Verify all critical services
4. Execute emergency protocols if needed

---

**[Open Admin Dashboard](https://guardianchain.app/master-admin)** | **[System Health](https://guardianchain.app/admin/health)** | **[Emergency Protocols](https://guardianchain.app/admin/emergency)**

*This is an automated critical alert from GUARDIANCHAIN protocol.*
`,
  });
}

export async function notifyAdminUserAction(
  action: string,
  userEmail: string,
  details?: any
) {
  await sendGuardianEmail({
    to: ADMIN_EMAIL,
    subject: `📊 User Action: ${action}`,
    notificationType: "admin_tracking",
    markdown: `
# 📊 User Activity Report

## Action Details
- **Action:** ${action}
- **User:** ${userEmail}
- **Timestamp:** ${new Date().toLocaleString()}

## Additional Details
${
  details
    ? `
\`\`\`json
${JSON.stringify(details, null, 2)}
\`\`\`
`
    : "*No additional details*"
}

---

**[User Profile](https://guardianchain.app/admin/users?email=${encodeURIComponent(
      userEmail
    )})** | **[Activity Log](https://guardianchain.app/admin/activity)**
`,
  });
}

export async function notifyAdminSystemHealth(healthData: any) {
  await sendGuardianEmail({
    to: ADMIN_EMAIL,
    subject: "💗 Daily System Health Report",
    notificationType: "admin_health",
    markdown: `
# 💗 Daily System Health Report

**Report Generated:** ${new Date().toLocaleString()}

## System Status
- **Overall Health:** ${healthData.status || "Unknown"}
- **Uptime:** ${healthData.uptime || "N/A"}
- **Active Users:** ${healthData.activeUsers || "0"}
- **GTT Transactions:** ${healthData.transactions || "0"}

## Service Status
${
  healthData.services
    ? Object.entries(healthData.services)
        .map(([service, status]) => `- **${service}:** ${status}`)
        .join("\n")
    : "*No service data available*"
}

## Performance Metrics
- **Response Time:** ${healthData.responseTime || "N/A"}ms
- **Error Rate:** ${healthData.errorRate || "0"}%
- **Database Performance:** ${healthData.dbPerformance || "Normal"}

---

**[Full Health Dashboard](https://guardianchain.app/admin/health)** | **[Performance Metrics](https://guardianchain.app/admin/metrics)**
`,
  });
}
