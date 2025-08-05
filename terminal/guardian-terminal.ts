import readline from "readline";
import { mintCapsule, sendCapsule } from "../lib/api/capsuleActions";
import dotenv from "dotenv";
dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(query: string): Promise<string> {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function main() {
  console.log("🔐 GuardianChain Terminal v1.0 — Capsule Interface\n");
  const action = await ask("Choose action (mint/send): ");

  if (action === "mint") {
    const content = await ask("Enter capsule content (text or IPFS URL): ");
    const recipient = await ask("Enter recipient wallet: ");
    const result = await mintCapsule({ content, recipient });
    console.log("✅ Capsule Minted:", result);
  } else if (action === "send") {
    const capsuleId = await ask("Enter Capsule ID to send: ");
    const to = await ask("Enter recipient wallet: ");
    const result = await sendCapsule({ capsuleId, to });
    console.log("📦 Capsule Sent:", result);
  } else {
    console.log("❌ Unknown action.");
  }

  rl.close();
}

main();