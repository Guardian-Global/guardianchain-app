import React from "react";
import { Helmet } from "react-helmet-async";
import EnterpriseFeatures from "@/components/EnterpriseFeatures";

export default function EnterpriseCenter() {
  return (
    <>
      <Helmet>
        <title>Enterprise Center | GuardianChain</title>
        <meta name="description" content="Advanced enterprise features and infrastructure management for GuardianChain" />
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <EnterpriseFeatures />
      </div>
    </>
  );
}