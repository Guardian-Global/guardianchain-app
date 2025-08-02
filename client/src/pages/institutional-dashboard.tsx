import React from "react";
import { InstitutionalDashboard } from "@/components/trading/InstitutionalDashboard";

export default function InstitutionalDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Institutional Dashboard</h1>
          <p className="text-slate-400">
            Enterprise client management and performance tracking
          </p>
        </div>

        <InstitutionalDashboard />
      </div>
    </div>
  );
}
