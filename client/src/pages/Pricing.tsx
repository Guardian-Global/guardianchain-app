import React from "react";
import { Helmet } from "react-helmet-async";
import EnhancedSubscriptionPlans from "@/components/EnhancedSubscriptionPlans";

export default function Pricing() {
  return (
    <>
      <Helmet>
        <title>Pricing & Plans - Truth Sovereignty for Every Creator | GuardianChain</title>
        <meta name="description" content="Choose your truth sovereignty level. From free exploration to enterprise infrastructure. Own your content, earn 85-95% revenue share, and build the decentralized future." />
        <meta name="keywords" content="GuardianChain pricing, creator revenue share, blockchain content, NFT minting, decentralized storage, truth preservation" />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="GuardianChain Pricing - Higher Creator Revenue, True Ownership" />
        <meta property="og:description" content="Compare 85-95% creator revenue share vs traditional platforms. Own your content forever with blockchain technology." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://guardianchain.app/pricing" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="GuardianChain Pricing - True Content Ownership" />
        <meta name="twitter:description" content="85-95% creator revenue share. Own your content forever. Start free, scale to enterprise." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900/20 to-slate-900">
        <div className="container mx-auto px-4 py-12">
          <EnhancedSubscriptionPlans />
        </div>
      </div>
    </>
  );
}