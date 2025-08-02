// lib/routes.ts — Enterprise-Grade Navigation Schema for GuardianChain
export const ROUTES = [
  {
    path: "/",
    label: "🧭 Dashboard",
    roles: ["guest", "member", "admin", "dao-owner"],
    description: "Central hub for capsule management and platform overview"
  },
  {
    path: "/vault",
    label: "📦 Capsules",
    roles: ["guest", "member", "admin", "dao-owner"],
    description: "Explore sealed memories on the Sovereign Memory Chain"
  },
  {
    path: "/replay",
    label: "🔁 Replay Capsule",
    roles: ["guest", "member", "admin", "dao-owner"],
    description: "Replay memories, unlock encrypted truths, earn GTT"
  },
  {
    path: "/mint",
    label: "🧬 Mint NFT",
    roles: ["member", "admin", "dao-owner"],
    description: "Turn capsules into Veritas-certified NFTs tradable on OpenSea"
  },
  {
    path: "/dao",
    label: "🏛 DAO Governance",
    roles: ["dao-owner"],
    description: "Vote, stake, and propose GuardianChain policies"
  },
  {
    path: "/admin",
    label: "🛡️ Admin Panel",
    roles: ["admin", "dao-owner"],
    description: "Full system control, validator access, DAO configs"
  },
  {
    path: "/analytics",
    label: "📈 Analytics",
    roles: ["admin", "dao-owner"],
    description: "Track user growth, replay metrics, yield flow"
  },
  {
    path: "/moderation",
    label: "🚨 AI Moderation Logs",
    roles: ["admin"],
    description: "Review OpenAI-flagged submissions and reasons"
  },
  {
    path: "/yield",
    label: "💰 Yield Tracker",
    roles: ["admin", "dao-owner"],
    description: "Measure GTT earned by capsule over time"
  },
  {
    path: "/insights",
    label: "🧪 Capsule AI Insights",
    roles: ["admin", "member"],
    description: "Auto-summary, emotion tagging, grief tier classification"
  },
  {
    path: "/metadata",
    label: "📜 Capsule Metadata",
    roles: ["admin", "member"],
    description: "JSON metadata for NFT, VCW, and capsule state"
  },
  {
    path: "/sdk",
    label: "🧰 Developer SDK",
    roles: ["admin", "member"],
    description: "SDK & API routes for external integrations and dApps"
  },
  {
    path: "/settings/language",
    label: "🌍 Language Preferences",
    roles: ["guest", "member", "admin", "dao-owner"],
    description: "Switch app language and localization settings"
  },
  {
    path: "/settings/account",
    label: "🔐 Account Settings",
    roles: ["guest", "member", "admin", "dao-owner"],
    description: "Update your Veritas ID, email, password, and security"
  },
  {
    path: "/earn",
    label: "🎁 Earn GTT",
    roles: ["guest", "member"],
    description: "Invite others and earn yield via capsule creation"
  },
  {
    path: "/media",
    label: "🎞 Media Capsules",
    roles: ["member", "admin"],
    description: "Upload encrypted photo/video capsules (IPFS ready)"
  },
  {
    path: "/timeline",
    label: "🗓 Truth Timeline",
    roles: ["member", "admin"],
    description: "Chronological memory chain, browsable by seal date"
  },
  {
    path: "/veritas",
    label: "🧾 Veritas Certificates",
    roles: ["admin", "dao-owner"],
    description: "Legally timestamped, tamper-proof proof-of-authorship"
  }
];

export interface Route {
  path: string;
  label: string;
  roles: string[];
  description: string;
}

// Helper function to filter routes by user role
export function getRoutesForRole(userRole: string): Route[] {
  return ROUTES.filter(route => route.roles.includes(userRole));
}

// Helper function to check if user has access to a specific route
export function hasAccessToRoute(routePath: string, userRole: string): boolean {
  const route = ROUTES.find(r => r.path === routePath);
  return route ? route.roles.includes(userRole) : false;
}

// Get route metadata by path
export function getRouteMetadata(routePath: string): Route | undefined {
  return ROUTES.find(r => r.path === routePath);
}