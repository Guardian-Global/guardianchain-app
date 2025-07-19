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
    markdown: `
## 🧠 New Memory Stored

Your Sovereign AI has saved a significant interaction with high importance value.

### Interaction Details
**Prompt:** ${message}

**AI Reply:** ${reply}

**Thread ID:** \`${threadId}\`

### Storage Confirmation
✅ Memory encrypted and stored immutably  
✅ Added to your digital legacy record  
✅ Available for future AI context  
✅ Secured with blockchain verification  

This memory will enhance your AI's understanding and responses in future conversations.

[View AI Memory Dashboard](https://guardianchain.ai/profile?tab=ai)
`,
  });
}