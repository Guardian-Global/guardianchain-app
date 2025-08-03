import fetch from "node-fetch";

export async function sendDiscordAlert({ title, chain, griefScore }) {
  const webhook = process.env.DISCORD_WEBHOOK_URL;
  if (!webhook) return;

  const message = {
    content: `📢 Capsule Unlocked: **${title}** on ${chain.toUpperCase()} | GriefScore: ${griefScore}`
  };

  await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message)
  });
}
