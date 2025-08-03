import React from "react";

export default function DisclaimerBlock() {
  return (
    <div className="text-xs text-slate-400 border-t border-slate-700/50 pt-6 mt-12 space-y-3">
      <p className="leading-relaxed">
        GuardianChain is a sovereign protocol. All Capsules are created and controlled by users with full ownership and custody. You are responsible for your own content and private key access.
      </p>
      <p className="leading-relaxed">
        GTT yield rates are variable and determined by protocol logic, community votes, and staking mechanisms. No earnings are guaranteed. The "estimated yield" shown is an advisory calculation only.
      </p>
      <p className="leading-relaxed">
        Our Sovereign AI provides grief, truth, rarity, and virality scoring based on non-custodial analysis. It does not retain or store your data. Scores are provided for user insight only.
      </p>
      <p className="leading-relaxed">
        By using GuardianChain, you agree to the terms of use and acknowledge that your content, once minted, is permanent and publicly visible if made shareable.
      </p>
    </div>
  );
}