import { sendGuardianEmail } from "../lib/mailer";

export async function notifyCapsuleRemix({
  user,
  capsuleId,
  remixerName,
}: any) {
  await sendGuardianEmail({
    to: user.email,
    subject: "📦 GUARDIANCHAIN Capsule Remixed",
    markdown: `
## 📦 Capsule Remixed

Your capsule \`${capsuleId}\` was remixed by **${remixerName}**.

### Impact Summary
- **Original Value:** Preserved immutably
- **Remix Value:** Building on your foundation  
- **GTT Rewards:** Earning from derivative content
- **Social Proof:** Increased verification weight

### Next Steps
Check your yield dashboard for updated performance metrics and potential GTT rewards.

[View Capsule Dashboard](https://guardianchain.ai/capsule/${capsuleId})  
[Check Yield Tracker](https://guardianchain.ai/yield-tracker)
`,
  });
}

export async function notifyCapsuleSealed({ user, capsuleId }: any) {
  await sendGuardianEmail({
    to: user.email,
    subject: "🔒 GUARDIANCHAIN Capsule Sealed",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #7F5AF0 0%, #2CB67D 100%); color: white; padding: 20px; border-radius: 10px;">
        <h2 style="color: #2CB67D;">🔒 Seal Confirmation</h2>
        <p>Your capsule <strong>${capsuleId}</strong> has been sealed permanently on the blockchain.</p>
        <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin: 15px 0;">
          <p>✅ <strong>Status:</strong> Immutable & Verified</p>
          <p>🛡️ <strong>Protection:</strong> Cryptographically secured</p>
          <p>🌍 <strong>Access:</strong> Globally accessible</p>
        </div>
        <p>This capsule now forms part of your digital legacy and cannot be altered.</p>
        <p style="color: #2CB67D; font-weight: bold;">GUARDIANCHAIN - Digital Sovereignty Secured</p>
      </div>
    `,
  });
}

export async function notifyCapsuleReplayed({ user, capsuleId, viewerCount }: any) {
  await sendGuardianEmail({
    to: user.email,
    subject: "🔄 GUARDIANCHAIN Capsule Replayed",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #7F5AF0 0%, #2CB67D 100%); color: white; padding: 20px; border-radius: 10px;">
        <h2 style="color: #2CB67D;">🔄 Replay Activity</h2>
        <p>Your capsule <strong>${capsuleId}</strong> has been replayed <strong>${viewerCount}</strong> times.</p>
        <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin: 15px 0;">
          <p>📈 <strong>Engagement:</strong> Growing audience</p>
          <p>💎 <strong>Value:</strong> Increasing social proof</p>
          <p>🎁 <strong>Rewards:</strong> GTT yield accumulating</p>
        </div>
        <p style="color: #2CB67D; font-weight: bold;">GUARDIANCHAIN - Digital Sovereignty Secured</p>
      </div>
    `,
  });
}