import { sendGuardianEmail } from "../lib/mailer";

export async function notifyMemorySaved({
  user,
  message,
  reply,
  threadId,
}: any) {
  await sendGuardianEmail({
    to: user.email,
    subject: "🧠 GUARDIANCHAIN AI Memory Saved",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #7F5AF0 0%, #2CB67D 100%); color: white; padding: 20px; border-radius: 10px;">
        <h2 style="color: #2CB67D;">🧠 Memory Saved!</h2>
        <p>Your Sovereign AI has permanently stored a high-yield interaction.</p>
        <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin: 15px 0;">
          <p><strong>Prompt:</strong> ${message}</p>
          <p><strong>Reply:</strong> ${reply}</p>
          <p><em>Thread ID:</em> ${threadId}</p>
        </div>
        <p>This memory is now bonded to your capsule legacy record and immutable on-chain.</p>
        <p style="color: #2CB67D; font-weight: bold;">GUARDIANCHAIN - Digital Sovereignty Secured</p>
      </div>
    `,
  });
}