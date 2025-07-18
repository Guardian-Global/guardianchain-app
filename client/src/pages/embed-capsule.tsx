import React from "react";
import { useLocation } from "wouter";
import CapsuleYieldTracker from "@/components/web3/CapsuleYieldTracker";
import { BRAND_NAME } from "@/lib/constants";

export default function EmbedCapsulePage() {
  const [location] = useLocation();
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const capsuleId = urlParams.get("id") || "";

  if (!capsuleId) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Invalid Capsule ID</h2>
          <p className="text-slate-400">Please provide a valid capsule ID in the URL.</p>
          <p className="text-xs text-slate-500 mt-2">
            Example: /embed/capsule?id=123
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Minimal header for embedded view */}
      <div className="bg-slate-800/50 border-b border-slate-700 p-2">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-white">
            {BRAND_NAME} Capsule Tracker
          </div>
          <div className="text-xs text-slate-400">
            Capsule #{capsuleId}
          </div>
        </div>
      </div>
      
      {/* Embedded yield tracker */}
      <div className="p-4">
        <CapsuleYieldTracker capsuleId={capsuleId} embedded={true} />
      </div>
      
      {/* Powered by footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-800/80 border-t border-slate-700 p-2">
        <div className="text-center text-xs text-slate-400">
          Powered by <span className="text-purple-400 font-semibold">{BRAND_NAME}</span> 
          {" - "}
          <a 
            href={`${window.location.origin}/capsule/${capsuleId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 underline"
          >
            View Full Details
          </a>
        </div>
      </div>
    </div>
  );
}