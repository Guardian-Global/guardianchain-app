import { sendGuardianEmail } from "../lib/mailer";

export async function sendDAOVoteReceipt({ user, proposalId, voteChoice, votingPower }: any) {
  await sendGuardianEmail({
    to: user.email,
    subject: "🗳️ GUARDIANCHAIN DAO Vote Confirmation",
    markdown: `
## 🗳️ DAO Vote Receipt

Your governance vote has been recorded immutably on-chain.

### Vote Details
**Proposal ID:** \`${proposalId}\`  
**Your Vote:** **${voteChoice}**  
**Voting Power:** ${votingPower} GTT  
**Transaction:** Confirmed on blockchain  

### Impact
✅ Vote recorded immutably  
🏛️ Shaping GUARDIANCHAIN's future  
🎁 Governance participation rewards earned  

Thank you for participating in GUARDIANCHAIN governance and securing our collective digital sovereignty.

[View Governance Dashboard](https://guardianchain.ai/govern)
`,
  });
}

export async function notifyProposalUpdate({ user, proposalId, status, result }: any) {
  await sendGuardianEmail({
    to: user.email,
    subject: `📊 GUARDIANCHAIN Proposal ${status}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #7F5AF0 0%, #2CB67D 100%); color: white; padding: 20px; border-radius: 10px;">
        <h2 style="color: #2CB67D;">📊 Proposal Update</h2>
        <p>A proposal you voted on has been <strong>${status}</strong>.</p>
        
        <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #FFD700; margin-top: 0;">Proposal Results</h3>
          <p><strong>Proposal ID:</strong> ${proposalId}</p>
          <p><strong>Final Status:</strong> ${status}</p>
          <p><strong>Result:</strong> ${result}</p>
        </div>

        <p>Your voice in GUARDIANCHAIN governance helps shape the future of digital sovereignty.</p>
        <p style="color: #2CB67D; font-weight: bold;">GUARDIANCHAIN - Digital Sovereignty Secured</p>
      </div>
    `,
  });
}