import React from "react";

export function PremiumBadge() {
  // Placeholder: Replace with real premium check
  const isPremium = false;
  if (!isPremium) return null;
  return (
    <span className="ml-2 px-2 py-1 bg-gradient-to-r from-yellow-400 to-pink-500 text-white text-xs rounded shadow animate-pulse">
      Premium
    </span>
  );
}
