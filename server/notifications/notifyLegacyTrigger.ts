import { sendGuardianEmail } from "../lib/mailer";

export async function notifyLegacySetup({ user, delegate }: any) {
  await sendGuardianEmail({
    to: user.email,
    subject: "👁️ GUARDIANCHAIN Legacy AI Protocol Activated",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #7F5AF0 0%, #2CB67D 100%); color: white; padding: 20px; border-radius: 10px;">
        <h2 style="color: #2CB67D;">👁️ Your Sovereign AI Will Outlive You</h2>
        <p>You have authorized <strong>${delegate}</strong> as the beneficiary of your legacy capsules and AI memory streams.</p>
        <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin: 15px 0;">
          <p>🔮 <strong>Legacy Status:</strong> Active & Immutable</p>
          <p>🤖 <strong>AI Executor:</strong> ${delegate}</p>
          <p>⚡ <strong>Protocol:</strong> On-chain verification</p>
        </div>
        <p>This instruction is now immutable and secured on the blockchain. Your digital legacy is protected.</p>
        <p style="color: #2CB67D; font-weight: bold;">GUARDIANCHAIN - Digital Sovereignty Secured</p>
      </div>
    `,
  });
}

export async function notifyLegacyExpiration({ user, expirationDate }: any) {
  await sendGuardianEmail({
    to: user.email,
    subject: "⏰ GUARDIANCHAIN Legacy Protocol Expiring",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #7F5AF0 0%, #2CB67D 100%); color: white; padding: 20px; border-radius: 10px;">
        <h2 style="color: #FFD700;">⏰ Legacy Protocol Renewal Required</h2>
        <p>Your legacy AI protocol will expire on <strong>${expirationDate}</strong>.</p>
        <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin: 15px 0;">
          <p>🚨 <strong>Action Required:</strong> Renew before expiration</p>
          <p>🛡️ <strong>Risk:</strong> Loss of legacy protection</p>
          <p>⚡ <strong>Solution:</strong> Update protocol settings</p>
        </div>
        <p>Renew your legacy protocol to ensure continuous protection of your digital sovereignty.</p>
        <p style="color: #2CB67D; font-weight: bold;">GUARDIANCHAIN - Digital Sovereignty Secured</p>
      </div>
    `,
  });
}