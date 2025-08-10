import React from "react";
import BulkDataDumpCapsule from "@/components/BulkDataDumpCapsule";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Zap, Lock, Cloud, Users, Star, Globe, Key, Rocket } from "lucide-react";

export default function BulkDumpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            The World's First NFT Memory Vault
          </h1>
          <p className="text-xl text-brand-text-muted max-w-2xl mx-auto mb-6">
            Instantly upload your entire phone's photo and video library, mint it as a permanent, AI-powered NFT capsule, and control access forever. No more lost memories, no more cloud lock-in.
          </p>
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            <Badge variant="secondary"><Shield className="w-4 h-4 mr-1" /> Blockchain Ownership</Badge>
            <Badge variant="secondary"><Zap className="w-4 h-4 mr-1" /> AI Voice Recall</Badge>
            <Badge variant="secondary"><Lock className="w-4 h-4 mr-1" /> Private & Public Sharing</Badge>
            <Badge variant="secondary"><Cloud className="w-4 h-4 mr-1" /> No Centralized Cloud</Badge>
            <Badge variant="secondary"><Users className="w-4 h-4 mr-1" /> Group & Family Vaults</Badge>
            <Badge variant="secondary"><Star className="w-4 h-4 mr-1" /> NFT Remix & Edit</Badge>
            <Badge variant="secondary"><Globe className="w-4 h-4 mr-1" /> Global Access</Badge>
          </div>
        </div>

        {/* Why This Is Revolutionary */}
        <Card className="mb-10 bg-brand-surface border-brand-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2"><Rocket className="w-6 h-6 text-purple-400" /> Why This Is Revolutionary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-lg text-brand-text-muted">
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>True Digital Ownership:</strong> Your memories are minted as NFTs, not just stored in a cloud. You control access, forever.</li>
              <li><strong>AI-Powered Recall:</strong> Instantly find, remix, or relive any moment with voice commands—no more endless scrolling.</li>
              <li><strong>Permanent, Tamper-Proof:</strong> Blockchain-backed storage means your data can’t be lost, censored, or altered.</li>
              <li><strong>Granular Sharing:</strong> Decide who, when, and how your memories are shared—at minting or anytime after.</li>
              <li><strong>Monetize or Bequeath:</strong> Pass on your digital legacy, or monetize unique moments as collectible NFTs.</li>
              <li><strong>Institutional Use:</strong> Schools, law firms, hospitals, and creators can archive, verify, and share critical media with full audit trails.</li>
              <li><strong>GTT & Truth Vault Integration:</strong> Pay for storage and AI features with GTT tokens, earn rewards for sharing, and unlock premium features with Truth Vault tokens.</li>
            </ul>
          </CardContent>
        </Card>

        {/* Competitive Comparison */}
        <Card className="mb-10 bg-brand-surface border-brand-primary/20">
          <CardHeader>
            <CardTitle className="text-xl">How We Compare to Traditional Storage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-slate-800/40 rounded-lg p-4">
                <h4 className="font-bold mb-2">GuardianChain Vault</h4>
                <p className="text-green-400 font-semibold">Permanent, On-Chain</p>
                <p>AI recall, NFT minting, full control, GTT-powered</p>
              </div>
              <div className="bg-slate-800/40 rounded-lg p-4">
                <h4 className="font-bold mb-2">Google/Apple Cloud</h4>
                <p className="text-yellow-400 font-semibold">Subscription, Centralized</p>
                <p>Limited control, no blockchain, no AI recall, risk of loss</p>
              </div>
              <div className="bg-slate-800/40 rounded-lg p-4">
                <h4 className="font-bold mb-2">External Drives</h4>
                <p className="text-red-400 font-semibold">Physical, Fragile</p>
                <p>Easy to lose, no remote access, no AI, no sharing</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Data Dump Capsule Component */}
        <BulkDataDumpCapsule />

        {/* Institutional Use & Adders */}
        <Card className="mt-12 bg-brand-surface border-brand-primary/20">
          <CardHeader>
            <CardTitle className="text-xl">Institutional & Advanced Use Cases</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-lg text-brand-text-muted">
            <ul className="list-disc pl-6">
              <li><strong>Legal & Compliance:</strong> Law firms can mint evidence, chain-of-custody, and discovery files as immutable NFTs.</li>
              <li><strong>Education:</strong> Schools can archive student projects, performances, and records for permanent, auditable access.</li>
              <li><strong>Healthcare:</strong> Hospitals can store and share medical imaging, records, and consent forms with full privacy controls.</li>
              <li><strong>Enterprise:</strong> Companies can create secure, shareable vaults for IP, contracts, and internal media.</li>
              <li><strong>Family & Group Vaults:</strong> Multi-user capsules for family albums, team projects, or collaborative archives.</li>
              <li><strong>AI-Driven Insights:</strong> Automatic tagging, clustering, and memory highlights for large datasets.</li>
              <li><strong>White-Label & API:</strong> Offer branded vaults or integrate with existing apps via API.</li>
            </ul>
          </CardContent>
        </Card>

        {/* Pricing & Token Logic */}
        <Card className="mt-12 bg-brand-surface border-brand-primary/20">
          <CardHeader>
            <CardTitle className="text-xl">Pricing & Token Integration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-lg text-brand-text-muted">
            <ul className="list-disc pl-6">
              <li><strong>GTT-Powered Storage:</strong> Pay for storage and AI features with GTT tokens—no fiat lock-in, global access.</li>
              <li><strong>Truth Vault Tiers:</strong> Unlock premium features (AI remix, advanced sharing, institutional controls) with Truth Vault tokens.</li>
              <li><strong>Aggressive Pricing:</strong> Offer 30-50% lower cost per GB than Google/Apple, with permanent storage and AI included.</li>
              <li><strong>Rewards:</strong> Earn GTT for sharing, remixing, or contributing to public memory vaults.</li>
              <li><strong>Flexible Plans:</strong> Free tier for basic uploads, pay-as-you-go for bulk, and enterprise plans for institutions.</li>
              <li><strong>Monetization:</strong> Users can sell or license their NFT memories, with royalties paid in GTT.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
