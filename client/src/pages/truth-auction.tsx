import React from "react";
import TruthAuctionPanel from "@/components/web3/TruthAuctionPanel";

export default function TruthAuctionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">Truth Auction</h1>
          <p className="text-slate-400">
            Bid on truth capsules and participate in decentralized truth markets
          </p>
        </div>
        <TruthAuctionPanel />
      </div>
    </div>
  );
}