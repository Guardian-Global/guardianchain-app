import React from "react";
import { Helmet } from "react-helmet-async";
import EnhancedDashboard from "@/components/EnhancedDashboard";

export default function EnhancedDashboardPage() {
  return (
    <>
      <Helmet>
        <title>Enhanced Dashboard | GuardianChain</title>
        <meta name="description" content="Advanced analytics and performance insights for your GuardianChain activity" />
      </Helmet>
      <EnhancedDashboard />
    </>
  );
}