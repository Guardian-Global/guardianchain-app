import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, DollarSign, Users, Shield, Crown } from "lucide-react";

// Competitive revenue share data from uploaded document
const PLATFORM_COMPARISON = {
  guardianChain: {
    name: "GuardianChain",
    creatorShare: 70,
    platformFee: 10,
    daoShare: 20,
    subscriptionShare: 60,
    features: ["Sovereign ownership", "AI verification", "Blockchain immutable", "Time-locked content", "DAO governance"],
    uniqueValue: "Only platform with true digital sovereignty and AI-powered truth verification"
  },
  competitors: [
    {
      name: "YouTube",
      creatorShare: 55,
      platformFee: 45,
      features: ["Large audience", "Monetization tools", "Analytics"],
      limitations: ["Platform control", "Censorship risk", "Algorithm dependency"]
    },
    {
      name: "Patreon",
      creatorShare: 90,
      platformFee: 10,
      features: ["Direct support", "Recurring payments", "Community tools"],
      limitations: ["No content ownership", "Limited discovery", "Platform dependency"]
    },
    {
      name: "OnlyFans",
      creatorShare: 80,
      platformFee: 20,
      features: ["High payouts", "Direct messaging", "Subscription model"],
      limitations: ["Content restrictions", "Payment processing issues", "Reputation concerns"]
    },
    {
      name: "Substack",
      creatorShare: 90,
      platformFee: 10,
      features: ["Newsletter focus", "Direct payments", "Simple publishing"],
      limitations: ["Text-centric", "Limited multimedia", "No blockchain backing"]
    }
  ]
};

const REVENUE_MODELS = [
  {
    type: "Capsule Minting",
    guardianChain: "70% creator, 20% DAO, 10% platform",
    industry: "N/A - Unique to GuardianChain",
    advantage: "Creator-first with community governance"
  },
  {
    type: "Content Unlocks",
    guardianChain: "50% creator, 25% referrer, 25% DAO",
    industry: "30-70% creator typical",
    advantage: "Referral rewards + community funding"
  },
  {
    type: "Subscriptions",
    guardianChain: "60% creator, 30% platform, 10% DAO",
    industry: "55-90% creator typical",
    advantage: "Competitive with transparent governance"
  },
  {
    type: "Yield Staking",
    guardianChain: "90% creator, 10% DAO",
    industry: "5-15% traditional finance",
    advantage: "Revolutionary passive income model"
  }
];

export default function CompetitiveAnalysis() {
  return (
    <Card className="bg-gradient-to-br from-slate-900/50 to-purple-900/20 border-purple-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Crown className="h-6 w-6 text-yellow-400" />
          Competitive Revenue Share Analysis
        </CardTitle>
        <p className="text-muted-foreground">
          GuardianChain vs. Legacy Platforms: Creator Earnings Comparison
        </p>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* GuardianChain Highlight */}
        <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-purple-400" />
              <div>
                <h3 className="text-xl font-bold text-purple-400">GuardianChain</h3>
                <p className="text-sm text-muted-foreground">Sovereign Creator Platform</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
              Leader
            </Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">70%</div>
              <div className="text-xs text-muted-foreground">Creator Share</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">20%</div>
              <div className="text-xs text-muted-foreground">DAO Treasury</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">10%</div>
              <div className="text-xs text-muted-foreground">Platform Fee</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">90%</div>
              <div className="text-xs text-muted-foreground">Yield Share</div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-purple-300">Unique Advantages:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {PLATFORM_COMPARISON.guardianChain.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-3 w-3 text-green-400" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Competitor Comparison */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Platform Comparison</h3>
          <div className="grid gap-4">
            {PLATFORM_COMPARISON.competitors.map((platform, idx) => (
              <div key={idx} className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold">{platform.name}</h4>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-green-400">
                        {platform.creatorShare}% creator share
                      </span>
                      <span className="text-sm text-red-400">
                        {platform.platformFee}% platform fee
                      </span>
                    </div>
                  </div>
                  <Progress 
                    value={platform.creatorShare} 
                    className="w-24 h-2"
                    style={{
                      backgroundColor: 'rgba(100, 116, 139, 0.3)'
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-green-300 font-medium">Strengths:</span>
                    <ul className="list-disc list-inside ml-2 text-muted-foreground">
                      {platform.features.map((feature, fidx) => (
                        <li key={fidx}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="text-red-300 font-medium">Limitations:</span>
                    <ul className="list-disc list-inside ml-2 text-muted-foreground">
                      {platform.limitations.map((limitation, lidx) => (
                        <li key={lidx}>{limitation}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Model Breakdown */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-400" />
            Revenue Model Analysis
          </h3>
          <div className="grid gap-3">
            {REVENUE_MODELS.map((model, idx) => (
              <div key={idx} className="bg-slate-800/30 border border-slate-600/30 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{model.type}</h4>
                  <Badge variant="outline" className="text-xs">
                    {model.advantage.includes("Unique") ? "Exclusive" : "Competitive"}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-purple-300 font-medium">GuardianChain:</span>
                    <p className="text-muted-foreground">{model.guardianChain}</p>
                  </div>
                  <div>
                    <span className="text-blue-300 font-medium">Industry Standard:</span>
                    <p className="text-muted-foreground">{model.industry}</p>
                  </div>
                  <div>
                    <span className="text-green-300 font-medium">Our Advantage:</span>
                    <p className="text-muted-foreground">{model.advantage}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Value Proposition Summary */}
        <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-green-400 mb-3 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Why Choose GuardianChain?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium text-green-300">Financial Benefits:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• 70% revenue share on content minting</li>
                <li>• 90% yield share on staking rewards</li>
                <li>• Referral bonuses up to 25%</li>
                <li>• DAO governance token rewards</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-blue-300">Sovereignty Benefits:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• True content ownership via blockchain</li>
                <li>• Uncensorable, immutable storage</li>
                <li>• AI-powered truth verification</li>
                <li>• Community-governed platform</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-yellow-200 text-sm font-medium">
              💡 Bottom Line: GuardianChain offers 15-40% higher creator earnings than most platforms, 
              plus permanent content ownership and revolutionary yield opportunities that don't exist anywhere else.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}