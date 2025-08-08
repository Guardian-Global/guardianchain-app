import React from "react";
import EnhancedTruthExplorer from "@/../components/enhanced/EnhancedTruthExplorer";
import DisclaimerBlock from "@/components/DisclaimerBlock";

export default function Explorer() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <EnhancedTruthExplorer />
        
        {/* Legal Disclaimer */}
        <DisclaimerBlock />
      </div>
    </div>
  );
}