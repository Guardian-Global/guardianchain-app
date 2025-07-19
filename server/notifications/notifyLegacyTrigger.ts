import { sendGuardianEmail } from "../lib/mailer";

export async function notifyLegacySetup({ 
  user, 
  delegate,
  delegateAddress,
  executionConditions
}: {
  user: { email: string; name?: string };
  delegate: { name: string; email: string };
  delegateAddress: string;
  executionConditions: string[];
}) {
  await sendGuardianEmail({
    to: user.email,
    subject: "👁️ Legacy AI Protocol Activated",
    notificationType: "legacy_protocol",
    forceSend: true, // Critical legal notification
    markdown: `
# 👁️ Legacy AI Protocol Successfully Activated

**IMPORTANT LEGAL NOTICE:** Your digital legacy has been configured and recorded immutably on-chain.

## Legacy Configuration
- **Authorized Delegate:** ${delegate.name}
- **Delegate Email:** ${delegate.email}
- **Delegate Address:** \`${delegateAddress}\`
- **Activation Date:** ${new Date().toLocaleString()}

## Execution Conditions
Your legacy will be activated when any of these conditions are met:
${executionConditions.map(condition => `- ${condition}`).join('\n')}

## What Your Delegate Inherits
- 🧠 **AI Memory Archive:** Complete conversation history and personality model
- 📦 **Capsule Portfolio:** All truth capsules and associated yield rights
- 💰 **GTT Holdings:** Full token balance and staking rewards
- 🏛️ **DAO Voting Power:** Governance rights and proposal history
- 🔐 **Digital Identity:** Immutable reputation and achievement records

## Legal Protections
- ✅ **Immutable Record:** Cannot be changed without your private key
- ✅ **Multi-Signature Required:** Delegate + 2 validators must confirm execution
- ✅ **Fraud Protection:** 30-day challenge period for any inheritance claims
- ✅ **Legal Compliance:** Adheres to digital asset inheritance laws

## Emergency Override
Only you can modify this configuration using your private key. No third party, including GUARDIANCHAIN, can alter these settings.

---

**[View Legacy Settings](https://guardianchain.app/profile?tab=legacy)** | **[Legal Documentation](https://guardianchain.app/legal/legacy)** | **[Emergency Contact](https://guardianchain.app/contact)**

*Your digital sovereignty extends beyond life.*
`,
  });

  // Also notify the delegate
  await sendGuardianEmail({
    to: delegate.email,
    subject: "👁️ You've Been Named as Digital Legacy Delegate",
    notificationType: "legacy_protocol",
    forceSend: true,
    markdown: `
# 👁️ Digital Legacy Delegate Appointment

You have been appointed as a digital legacy delegate for **${user.name || user.email}**.

## Your Responsibilities
As a delegate, you are authorized to inherit and manage:
- 🧠 AI memory archives and personality models
- 📦 Truth capsule portfolios and yield rights
- 💰 GTT token holdings and staking rewards
- 🏛️ DAO governance rights and voting power

## Activation Process
Legacy inheritance is activated when:
${executionConditions.map(condition => `- ${condition}`).join('\n')}

## Legal Requirements
- ✅ Multi-signature validation required
- ✅ 30-day public challenge period
- ✅ Identity verification through KYC
- ✅ Legal documentation of inheritance claim

## Next Steps
1. Review your delegate responsibilities
2. Complete identity verification
3. Set up multi-signature wallet
4. Acknowledge legal obligations

---

**[Delegate Portal](https://guardianchain.app/delegate)** | **[Legal Guide](https://guardianchain.app/legal/delegate)** | **[Contact Support](https://guardianchain.app/contact)**

*Digital legacy is a sacred responsibility.*
`,
  });
}