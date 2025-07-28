import { sendGuardianEmail } from "../lib/mailer";

export async function notifyOptOut({ user }: any) {
  await sendGuardianEmail({
    to: user.email,
    subject: "🔕 GUARDIANCHAIN Email Preferences Updated",
    markdown: `
## Email Notifications Disabled

You have successfully disabled non-critical email notifications.

### What you'll still receive:
- Critical security alerts
- Legacy protocol notifications  
- DAO governance receipts
- Emergency system notifications

### What you won't receive:
- Weekly digest reports
- Capsule activity updates
- AI memory confirmations
- Monthly achievement reports

You can re-enable notifications anytime in your profile settings.

[Manage Preferences](https://guardianchain.ai/notifications)
`,
    forceSend: true, // Always send opt-out confirmations
  });
}

export async function notifyOptIn({ user }: any) {
  await sendGuardianEmail({
    to: user.email,
    subject: "🔔 GUARDIANCHAIN Email Notifications Enabled",
    markdown: `
## Welcome Back to Email Notifications!

You have successfully re-enabled email notifications.

### You'll now receive:
- Weekly GTT yield reports
- Capsule activity updates (remix, seal, replay)
- AI memory save confirmations
- DAO governance receipts
- Monthly achievement reports
- Security and system alerts

### Customize Your Experience
You can fine-tune which notifications you receive in your profile settings.

[Manage Preferences](https://guardianchain.ai/notifications)
`,
  });
}
