import { sendGuardianEmail } from "../lib/mailer";

export async function notifyCapsuleRemix({
  user,
  capsuleId,
  remixerName,
  remixerAddress,
  originalCapsule,
}: {
  user: { email: string; name?: string };
  capsuleId: string;
  remixerName: string;
  remixerAddress: string;
  originalCapsule: { title: string; yield?: number };
}) {
  await sendGuardianEmail({
    to: user.email,
    subject: "🎭 Your Capsule Has Been Remixed!",
    notificationType: "capsule_event",
    markdown: `
# 🎭 Capsule Remix Notification

Great news! Your truth capsule has been remixed by another creator.

## Remix Details
- **Original Capsule:** "${originalCapsule.title}"
- **Capsule ID:** \`${capsuleId}\`
- **Remixed By:** ${remixerName}
- **Remixer Address:** \`${remixerAddress}\`
- **Date:** ${new Date().toLocaleString()}

## What This Means
- 🎯 Your content is gaining viral traction
- 💰 You'll earn **25% of remix yield** automatically
- 📈 Your reputation score increases
- 🌟 Original capsule gets enhanced visibility

## Current Earnings
${
  originalCapsule.yield
    ? `Your capsule has generated **${originalCapsule.yield} GTT** so far.`
    : "Yield tracking starting now."
}

---

**[View Remix](https://guardianchain.app/capsule/${capsuleId})** | **[Dashboard](https://guardianchain.app/dashboard)** | **[Earnings](https://guardianchain.app/earnings)**

*Content that gets remixed is valuable content.*
`,
  });
}

export async function notifyCapsuleSealed({
  user,
  capsuleId,
  capsuleTitle,
  sealType = "standard",
  finalYield,
}: {
  user: { email: string; name?: string };
  capsuleId: string;
  capsuleTitle: string;
  sealType?: "standard" | "premium" | "legal" | "diamond";
  finalYield?: number;
}) {
  const sealEmojis = {
    standard: "🔒",
    premium: "💎",
    legal: "⚖️",
    diamond: "💠",
  };

  await sendGuardianEmail({
    to: user.email,
    subject: `${sealEmojis[sealType]} Capsule Permanently Sealed`,
    notificationType: "capsule_event",
    markdown: `
# ${sealEmojis[sealType]} Capsule Sealed Successfully

Your truth capsule has been permanently sealed and is now immutable.

## Seal Details
- **Capsule:** "${capsuleTitle}"
- **Capsule ID:** \`${capsuleId}\`
- **Seal Type:** ${sealType.toUpperCase()}
- **Sealed:** ${new Date().toLocaleString()}
- **Status:** Permanently Immutable ✅

## What Happens Next
${
  finalYield
    ? `
- 💰 **Final Yield:** ${finalYield} GTT tokens
- 🎯 Yield distribution begins immediately
- 📈 NFT certificate available for minting
`
    : `
- ⏳ Yield calculation in progress
- 🔄 Community verification ongoing
- 📊 Results available within 24 hours
`
}

## Immutability Guarantee
Your capsule is now:
- ✅ Stored permanently on blockchain
- ✅ Tamper-proof and unchangeable
- ✅ Timestamped for historical record
- ✅ Protected by cryptographic hash

---

**[View Capsule](https://guardianchain.app/capsule/${capsuleId})** | **[Mint NFT](https://guardianchain.app/mint-nft/${capsuleId})** | **[Share](https://guardianchain.app/share/${capsuleId})**

*Sealed capsules are eternal truth.*
`,
  });
}
