import React from "react";
import { Helmet } from "react-helmet-async";
import EnhancedRevenueExplainer from "@/components/EnhancedRevenueExplainer";

export default function RevenueExplainer() {
  return (
    <>
      <Helmet>
        <title>Revenue Model & Compliance | GuardianChain - Institutional Overview</title>
        <meta 
          name="description" 
          content="Comprehensive revenue-sharing system, GTT token utility, DAO structure, and compliance features for grant bodies, investors, and institutional collaborators" 
        />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900/20 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <EnhancedRevenueExplainer />
        </div>
      </div>
    </>
  );
}