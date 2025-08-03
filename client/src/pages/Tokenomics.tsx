import React from "react";
import { Helmet } from "react-helmet-async";
import GTTTokenomicsDashboard from "@/components/GTTTokenomicsDashboard";

export default function Tokenomics() {
  return (
    <>
      <Helmet>
        <title>GTT Tokenomics | GuardianChain - Revenue Sharing & DAO Governance</title>
        <meta 
          name="description" 
          content="Complete GTT token utility, revenue sharing model, DAO treasury flows, and compliance framework for GuardianChain's sovereign creator economy" 
        />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <GTTTokenomicsDashboard />
        </div>
      </div>
    </>
  );
}