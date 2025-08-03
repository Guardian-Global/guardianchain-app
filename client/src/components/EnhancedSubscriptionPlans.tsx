import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap, Rocket, Building2, Star, TrendingUp, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const SUBSCRIPTION_TIERS = [
  {
    id: "seeker",
    name: "Seeker",
    price: 0,
    period: "month",
    popular: false,
    description: "Perfect for exploring GuardianChain's truth preservation capabilities",
    features: [
      "Mint 3 Capsules per month",
      "View and unlock public Capsules",
      "Access to Timeline + Profile",
      "Basic AI content analysis",
      "Community discussions",
      "Mobile app access"
    ],
    limitations: [
      "Limited minting capacity",
      "No advanced AI features",
      "No time-release capsules"
    ],
    cta: "Start Free",
    icon: Shield,
    gradient: "from-slate-600 to-slate-800"
  },
  {
    id: "creator",
    name: "Creator+",
    price: 5,
    period: "month",
    popular: true,
    description: "Ideal for content creators and storytellers monetizing their truth",
    features: [
      "Unlimited Capsule minting",
      "Access Sovereign AI scoring",
      "Enable time-release + private sharing",
      "Earn GTT share dividends (70% creator share)",
      "Advanced encryption options",
      "Priority content verification",
      "Analytics dashboard",
      "Custom capsule branding",
      "Referral program access"
    ],
    limitations: [],
    valueProps: [
      "Break even with just 1 premium capsule unlock per month",
      "Average creators earn $25-75/month in GTT yield",
      "15-40% higher revenue share than YouTube/Patreon"
    ],
    cta: "Upgrade to Creator+",
    icon: Crown,
    gradient: "from-purple-600 to-pink-600"
  },
  {
    id: "builder",
    name: "Builder API",
    price: 25,
    period: "month",
    popular: false,
    description: "For developers integrating GuardianChain's truth infrastructure into their applications",
    features: [
      "Developer API access (5,000 credits/month)",
      "Embed Capsule minting on any site",
      "Access Veritas AI scoring API",
      "Webhook integration support",
      "Custom brand white-labeling",
      "Priority email support",
      "SDK access and documentation",
      "Sandbox environment",
      "Advanced analytics API",
      "Bulk operations support"
    ],
    limitations: [],
    valueProps: [
      "Replace expensive truth verification services (save $200+/month)",
      "Add sovereign content features to existing platforms",
      "Monetize your app users' content creation"
    ],
    apiFeatures: [
      "Capsule creation API",
      "AI truth scoring endpoint",
      "Blockchain minting interface",
      "Content encryption API",
      "User authentication SDK"
    ],
    cta: "Start Building",
    icon: Rocket,
    gradient: "from-blue-600 to-cyan-600"
  },
  {
    id: "guardian_patron",
    name: "Guardian Patron",
    price: 99,
    period: "month",
    popular: false,
    description: "For power users, validators, and platform stakeholders driving GuardianChain's future",
    features: [
      "Everything in Creator+ and Builder API",
      "Early DAO governance access",
      "Veritas Seal overlay privileges",
      "Capsule lineage support tools",
      "Advanced truth network analytics",
      "Private validator node access",
      "Exclusive community channels",
      "Monthly founder office hours",
      "Custom API rate limits (25K requests)",
      "Priority feature voting",
      "Revenue sharing eligibility"
    ],
    limitations: [],
    valueProps: [
      "Potential DAO governance token airdrops",
      "Revenue sharing from platform growth",
      "Influence platform development direction",
      "Premium validator rewards"
    ],
    exclusiveFeatures: [
      "Truth Bounty creation privileges",
      "Cross-capsule lineage mapping",
      "Advanced grief analytics",
      "Community moderation tools"
    ],
    cta: "Become a Guardian",
    icon: Building2,
    gradient: "from-yellow-600 to-orange-600"
  }
];

const COMPETITIVE_COMPARISON = [
  {
    platform: "YouTube Premium",
    price: "$11.99/month",
    creatorShare: "55%",
    limitations: "Platform control, censorship risk, algorithm dependency"
  },
  {
    platform: "Patreon Pro",
    price: "$12/month + 8% fees",
    creatorShare: "92%",
    limitations: "No content ownership, limited discovery, platform dependency"
  },
  {
    platform: "Substack Pro",
    price: "$10/month",
    creatorShare: "90%",
    limitations: "Text-centric, limited multimedia, no blockchain backing"
  }
];

export default function EnhancedSubscriptionPlans() {
  const [selectedTier, setSelectedTier] = useState("creator");
  const [showAnnual, setShowAnnual] = useState(false);

  const calculateAnnualPrice = (monthlyPrice: number) => {
    return monthlyPrice * 12 * 0.8; // 20% annual discount
  };

  const calculateROI = (tier: typeof SUBSCRIPTION_TIERS[0]) => {
    if (tier.id === "seeker") return null;
    if (tier.id === "creator") return "Break even with 1 capsule unlock/month";
    if (tier.id === "builder") return "Save $200+/month vs. traditional services";
    if (tier.id === "guardian_patron") return "Revenue sharing + governance rewards";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
          Choose Your Sovereignty Level
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Unlike legacy platforms that control your content, GuardianChain gives you true ownership plus higher revenue shares
        </p>
        
        {/* Annual Toggle */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <span className={cn("text-sm", !showAnnual && "text-white font-medium")}>Monthly</span>
          <button
            onClick={() => setShowAnnual(!showAnnual)}
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
              showAnnual ? "bg-purple-600" : "bg-gray-600"
            )}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                showAnnual ? "translate-x-6" : "translate-x-1"
              )}
            />
          </button>
          <span className={cn("text-sm", showAnnual && "text-white font-medium")}>
            Annual <Badge variant="secondary" className="ml-1 text-xs">20% off</Badge>
          </span>
        </div>
      </div>

      {/* Subscription Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {SUBSCRIPTION_TIERS.map((tier) => {
          const Icon = tier.icon;
          const isSelected = selectedTier === tier.id;
          const displayPrice = showAnnual && tier.price > 0 
            ? calculateAnnualPrice(tier.price)
            : tier.price;
          const displayPeriod = showAnnual ? "year" : tier.period;
          
          return (
            <Card
              key={tier.id}
              className={cn(
                "relative overflow-hidden transition-all duration-300 hover:scale-105",
                tier.popular 
                  ? "border-purple-500/50 bg-gradient-to-br from-purple-900/20 to-pink-900/20" 
                  : "border-slate-700/50 bg-slate-900/50",
                isSelected && "ring-2 ring-purple-500/50"
              )}
            >
              {tier.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-1 text-xs font-medium">
                  MOST POPULAR
                </div>
              )}

              <CardHeader className={cn("text-center pb-4", tier.popular && "pt-8")}>
                <div className={cn(
                  "w-12 h-12 mx-auto rounded-full bg-gradient-to-br flex items-center justify-center mb-3",
                  tier.gradient
                )}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                
                <CardTitle className="text-xl">{tier.name}</CardTitle>
                <div className="space-y-1">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold">
                      ${displayPrice}
                    </span>
                    {tier.price > 0 && (
                      <span className="text-muted-foreground">/{displayPeriod}</span>
                    )}
                  </div>
                  {showAnnual && tier.price > 0 && (
                    <div className="text-xs text-green-400">
                      Save ${(tier.price * 12 * 0.2).toFixed(0)}/year
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{tier.description}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* ROI Highlight */}
                {calculateROI(tier) && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                      <TrendingUp className="h-4 w-4" />
                      ROI Estimate
                    </div>
                    <p className="text-xs text-green-300 mt-1">{calculateROI(tier)}</p>
                  </div>
                )}

                {/* Features */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">What's Included:</h4>
                  <ul className="space-y-2">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Value Props */}
                {tier.valueProps && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-purple-300">Value Highlights:</h4>
                    <ul className="space-y-1">
                      {tier.valueProps.map((prop, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs">
                          <Star className="h-3 w-3 text-yellow-400 flex-shrink-0 mt-0.5" />
                          <span className="text-yellow-200">{prop}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* API Features */}
                {tier.apiFeatures && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-blue-300">API Capabilities:</h4>
                    <ul className="space-y-1">
                      {tier.apiFeatures.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs">
                          <Zap className="h-3 w-3 text-blue-400 flex-shrink-0 mt-0.5" />
                          <span className="text-blue-200">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* CTA Button */}
                <Button 
                  className={cn(
                    "w-full",
                    tier.popular 
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" 
                      : "bg-slate-700 hover:bg-slate-600"
                  )}
                  onClick={() => setSelectedTier(tier.id)}
                >
                  {tier.cta}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Competitive Comparison */}
      <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 text-center">
          How We Compare to Legacy Platforms
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-lg p-4">
            <h4 className="font-semibold text-purple-400 mb-2">GuardianChain Creator+</h4>
            <div className="space-y-1 text-sm">
              <p><strong>$5/month</strong></p>
              <p className="text-green-400"><strong>70% creator share</strong></p>
              <p className="text-muted-foreground">True ownership + AI verification</p>
            </div>
          </div>
          
          {COMPETITIVE_COMPARISON.map((comp, idx) => (
            <div key={idx} className="bg-slate-800/40 border border-slate-600/30 rounded-lg p-4">
              <h4 className="font-semibold mb-2">{comp.platform}</h4>
              <div className="space-y-1 text-sm">
                <p>{comp.price}</p>
                <p className="text-yellow-400">{comp.creatorShare} creator share</p>
                <p className="text-muted-foreground text-xs">{comp.limitations}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            💡 <strong>GuardianChain delivers 15-40% higher creator earnings</strong> plus permanent content ownership that other platforms can't match.
          </p>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-xl p-8">
        <h3 className="text-2xl font-bold mb-2">Ready to Own Your Content?</h3>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Join thousands of creators who've made the switch to true digital sovereignty. 
          Start with our free Seeker plan and upgrade as your truth empire grows.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
            Start Free Today
          </Button>
          <Button size="lg" variant="outline">
            Talk to Our Team
          </Button>
        </div>
      </div>
    </div>
  );
}