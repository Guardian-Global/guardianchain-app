import React from "react";
import { WhaleTracker } from "@/components/trading/WhaleTracker";

export default function WhaleTrackerPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">
            Whale & Smart Money Tracker
          </h1>
          <p className="text-slate-400">
            Track large GTT transactions and follow smart money movements in
            real-time
          </p>
        </div>

        <WhaleTracker />
      </div>
    </div>
  );
}
