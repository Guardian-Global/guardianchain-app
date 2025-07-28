import { sendGuardianEmail } from "../lib/mailer";

export async function notifyMemorySaved({
  user,
  message,
  reply,
  threadId,
  importance = "medium",
}: {
  user: { email: string; name?: string };
  message: string;
  reply: string;
  threadId: string;
  importance?: "low" | "medium" | "high" | "critical";
}) {
  const emoji =
    importance === "critical" ? "🚨" : importance === "high" ? "⚡" : "🧠";

  await sendGuardianEmail({
    to: user.email,
    subject: `${emoji} AI Memory Saved - ${importance.toUpperCase()} Priority`,
    notificationType: "ai_memory",
    markdown: `
# ${emoji} AI Memory Successfully Stored

Your Sovereign AI has saved a significant interaction based on importance threshold analysis.

## Conversation Details

**Your Prompt:**
> ${message}

**AI Response:**
> ${reply}

## Memory Classification
- **Importance Level:** ${importance.toUpperCase()}
- **Thread ID:** \`${threadId}\`
- **Stored:** ${new Date().toLocaleString()}

## What This Means
Your AI assistant has determined this conversation contains valuable information for future reference. This memory is:
- ✅ Stored immutably on-chain
- ✅ Accessible only to you
- ✅ Protected by zero-knowledge encryption
- ✅ Never accessible to GUARDIANCHAIN team

---

**[View All Memories](https://guardianchain.app/profile?tab=ai)** | **[Memory Settings](https://guardianchain.app/profile?tab=preferences)**

*Your AI becomes more intelligent with each saved memory.*
`,
  });
}
