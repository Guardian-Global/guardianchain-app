// Email system status checker
export function getEmailSystemStatus() {
  const hasHost = !!process.env.SMTP_HOST;
  const hasUser = !!process.env.SMTP_USER;
  const hasPass = !!process.env.SMTP_PASS;

  const isConfigured = hasHost && hasUser && hasPass;

  return {
    configured: isConfigured,
    status: isConfigured ? "Ready" : "Needs ProtonMail SMTP credentials",
    missing: [
      !hasHost && "SMTP_HOST (smtp.protonmail.ch)",
      !hasUser && "SMTP_USER (commander.guardian@protonmail.com)",
      !hasPass && "SMTP_PASS (ProtonMail app password)",
    ].filter(Boolean),
    ready: isConfigured,
  };
}

export async function mockSendEmail(to: string, subject: string) {
  console.log(`📧 Mock Email Send:`);
  console.log(`   To: ${to}`);
  console.log(`   Subject: ${subject}`);
  console.log(`   Status: Would send when SMTP configured`);

  return {
    messageId: "mock-" + Date.now(),
    status: "mock-sent",
    note: "Email system ready - configure ProtonMail SMTP to enable sending",
  };
}
