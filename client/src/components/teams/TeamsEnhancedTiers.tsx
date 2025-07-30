import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Crown,
  Zap,
  Shield,
  Star,
  Globe,
  Database,
  Users,
  TrendingUp,
  Sparkles,
  Lock,
  CheckCircle,
  ArrowUp,
  Gift,
  Award,
} from "lucide-react";

interface EnhancedTier {
  id: string;
  name: string;
  price: number;
  gttRequired: number;
  description: string;
  color: string;
  gradient: string;
  features: string[];
  limits: {
    capsules: number;
    storage: string;
    apiCalls: number;
    users: number;
  };
  teamsExclusive: boolean;
  popularityBoost: number;
  icon: React.ComponentType<any>;
}

interface TierBenefit {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  teamsOnly: boolean;
  valueMultiplier: number;
}

const TeamsEnhancedTiers: React.FC = () => {
  const [currentTier, setCurrentTier] = useState("professional");
  const [gttBalance, setGttBalance] = useState(2500);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [teamsMultiplier, setTeamsMultiplier] = useState(1.6);

  const enhancedTiers: EnhancedTier[] = [
    {
      id: "explorer",
      name: "Explorer",
      price: 0,
      gttRequired: 0,
      description: "Perfect for getting started with truth verification",
      color: "text-blue-400",
      gradient: "from-blue-500 to-cyan-500",
      features: [
        "5 truth capsules per month",
        "Basic verification tools",
        "Community leaderboard access",
        "Standard GTT rewards",
        "Email support",
      ],
      limits: {
        capsules: 5,
        storage: "1GB",
        apiCalls: 100,
        users: 1,
      },
      teamsExclusive: false,
      popularityBoost: 1.0,
      icon: Globe,
    },
    {
      id: "seeker",
      name: "Truth Seeker",
      price: 25,
      gttRequired: 100,
      description: "Enhanced features for active truth seekers",
      color: "text-green-400",
      gradient: "from-green-500 to-emerald-500",
      features: [
        "25 truth capsules per month",
        "Advanced analytics dashboard",
        "Priority verification queue",
        "2x GTT reward multiplier",
        "Live chat support",
        "Custom profile themes",
      ],
      limits: {
        capsules: 25,
        storage: "10GB",
        apiCalls: 1000,
        users: 3,
      },
      teamsExclusive: false,
      popularityBoost: 1.5,
      icon: Star,
    },
    {
      id: "professional",
      name: "Professional",
      price: 75,
      gttRequired: 500,
      description: "Professional tools for content creators and businesses",
      color: "text-purple-400",
      gradient: "from-purple-500 to-pink-500",
      features: [
        "100 truth capsules per month",
        "AI-powered content analysis",
        "White-label verification",
        "3x GTT reward multiplier",
        "Dedicated account manager",
        "API access",
        "Team collaboration tools",
        "Custom branding",
      ],
      limits: {
        capsules: 100,
        storage: "100GB",
        apiCalls: 10000,
        users: 10,
      },
      teamsExclusive: false,
      popularityBoost: 2.0,
      icon: Sparkles,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 299,
      gttRequired: 2000,
      description: "Complete enterprise solution with Teams integration",
      color: "text-yellow-400",
      gradient: "from-yellow-500 to-orange-500",
      features: [
        "500 truth capsules per month",
        "Advanced AI suite",
        "SAML SSO integration",
        "5x GTT reward multiplier",
        "White-glove onboarding",
        "Custom integrations",
        "Priority support",
        "Advanced analytics",
        "Bulk operations",
        "Custom contracts",
      ],
      limits: {
        capsules: 500,
        storage: "1TB",
        apiCalls: 100000,
        users: 50,
      },
      teamsExclusive: true,
      popularityBoost: 3.0,
      icon: Crown,
    },
    {
      id: "sovereign",
      name: "Sovereign",
      price: 999,
      gttRequired: 10000,
      description: "Ultimate tier for blockchain protocols and institutions",
      color: "text-red-400",
      gradient: "from-red-500 to-rose-500",
      features: [
        "Unlimited truth capsules",
        "Full AI governance suite",
        "Private blockchain integration",
        "10x GTT reward multiplier",
        "Dedicated infrastructure",
        "Custom smart contracts",
        "24/7 premium support",
        "Regulatory compliance tools",
        "Multi-chain support",
        "Custom UI/UX",
        "Revenue sharing program",
        "Protocol governance rights",
      ],
      limits: {
        capsules: -1, // Unlimited
        storage: "Unlimited",
        apiCalls: -1, // Unlimited
        users: -1, // Unlimited
      },
      teamsExclusive: true,
      popularityBoost: 5.0,
      icon: Shield,
    },
  ];

  const teamsBenefits: TierBenefit[] = [
    {
      id: "resource-multiplier",
      name: "Teams Resource Multiplier",
      description: "60% more monthly credits ($40 vs $25)",
      enabled: true,
      teamsOnly: true,
      valueMultiplier: 1.6,
    },
    {
      id: "private-deployment",
      name: "Private Deployment Security",
      description: "Enterprise-grade private deployments for sensitive data",
      enabled: true,
      teamsOnly: true,
      valueMultiplier: 2.0,
    },
    {
      id: "advanced-collaboration",
      name: "Enhanced Team Collaboration",
      description: "Real-time multiplayer editing and live chat",
      enabled: true,
      teamsOnly: true,
      valueMultiplier: 1.8,
    },
    {
      id: "premium-ai",
      name: "Premium AI Features",
      description: "Advanced AI tools exclusive to Teams subscribers",
      enabled: true,
      teamsOnly: true,
      valueMultiplier: 2.5,
    },
  ];

  const calculateTeamsValue = (basePrice: number): number => {
    return Math.round(basePrice * teamsMultiplier);
  };

  const calculateGTTValue = (gttRequired: number): string => {
    const usdValue = gttRequired * 0.0075; // Assuming GTT price
    return `$${usdValue.toFixed(2)}`;
  };

  const upgradeTier = async (tierId: string) => {
    setIsUpgrading(true);
    // Simulate upgrade process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setCurrentTier(tierId);
    setIsUpgrading(false);
    console.log(`Upgraded to tier: ${tierId}`);
  };

  const canUpgrade = (tier: EnhancedTier): boolean => {
    return gttBalance >= tier.gttRequired && tier.id !== currentTier;
  };

  const getCurrentTierData = (): EnhancedTier | undefined => {
    return enhancedTiers.find(tier => tier.id === currentTier);
  };

  return (
    <div className="space-y-6">
      {/* Teams Enhancement Header */}
      <Card className="bg-gradient-to-br from-indigo-900 to-purple-900 border-indigo-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center">
              <Crown className="w-6 h-6 mr-2 text-yellow-400" />
              Teams Enhanced Tier System
            </div>
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
              Premium Unlocked
            </Badge>
          </CardTitle>
          <p className="text-indigo-100">
            Unlock maximum value with Teams-exclusive tier enhancements and premium features
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-1">
                {teamsMultiplier}x
              </div>
              <div className="text-indigo-200 text-sm">Value Multiplier</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">
                {gttBalance.toLocaleString()}
              </div>
              <div className="text-indigo-200 text-sm">GTT Balance</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-1">
                {getCurrentTierData()?.name || "N/A"}
              </div>
              <div className="text-indigo-200 text-sm">Current Tier</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-1">5</div>
              <div className="text-indigo-200 text-sm">Exclusive Tiers</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Tier Tabs */}
      <Tabs defaultValue="tiers" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800">
          <TabsTrigger value="tiers" className="text-white">
            Enhanced Tiers
          </TabsTrigger>
          <TabsTrigger value="benefits" className="text-white">
            Teams Benefits
          </TabsTrigger>
          <TabsTrigger value="comparison" className="text-white">
            Value Comparison
          </TabsTrigger>
          <TabsTrigger value="upgrade" className="text-white">
            Upgrade Path
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tiers" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {enhancedTiers.map((tier) => (
              <Card 
                key={tier.id} 
                className={`bg-slate-800/50 border-slate-700 relative overflow-hidden ${
                  currentTier === tier.id ? 'ring-2 ring-purple-500' : ''
                }`}
              >
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${tier.gradient}`} />
                
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${tier.gradient} mr-3`}>
                        <tier.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center">
                          {tier.name}
                          {tier.teamsExclusive && (
                            <Crown className="w-4 h-4 ml-2 text-yellow-400" />
                          )}
                        </div>
                        {currentTier === tier.id && (
                          <Badge className="mt-1 bg-green-600 text-white">Current</Badge>
                        )}
                      </div>
                    </div>
                  </CardTitle>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-white">
                        ${tier.price}
                        {tier.teamsExclusive && (
                          <span className="text-lg font-normal text-green-400 ml-2">
                            (+{Math.round((teamsMultiplier - 1) * 100)}% Teams Value)
                          </span>
                        )}
                      </span>
                      <div className="text-right text-sm">
                        <div className="text-slate-400">GTT Required</div>
                        <div className={`font-bold ${tier.color}`}>
                          {tier.gttRequired.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm">{tier.description}</p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {tier.features.slice(0, 4).map((feature, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                        <span className="text-slate-300">{feature}</span>
                      </div>
                    ))}
                    {tier.features.length > 4 && (
                      <div className="text-xs text-slate-500">
                        +{tier.features.length - 4} more features
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-700/50 rounded p-2 text-center">
                      <div className="text-slate-400">Capsules</div>
                      <div className="text-white font-bold">
                        {tier.limits.capsules === -1 ? "∞" : tier.limits.capsules}
                      </div>
                    </div>
                    <div className="bg-slate-700/50 rounded p-2 text-center">
                      <div className="text-slate-400">Storage</div>
                      <div className="text-white font-bold">{tier.limits.storage}</div>
                    </div>
                  </div>

                  <Button
                    onClick={() => upgradeTier(tier.id)}
                    disabled={!canUpgrade(tier) || isUpgrading}
                    className={`w-full ${
                      currentTier === tier.id
                        ? "bg-green-600 hover:bg-green-700"
                        : `bg-gradient-to-r ${tier.gradient} hover:opacity-90`
                    }`}
                  >
                    {isUpgrading ? (
                      <div className="flex items-center">
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        Upgrading...
                      </div>
                    ) : currentTier === tier.id ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Current Tier
                      </>
                    ) : canUpgrade(tier) ? (
                      <>
                        <ArrowUp className="w-4 h-4 mr-2" />
                        Upgrade Now
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Need {(tier.gttRequired - gttBalance).toLocaleString()} GTT
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="benefits" className="space-y-4">
          <div className="grid gap-4">
            {teamsBenefits.map((benefit) => (
              <Card key={benefit.id} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                        <Gift className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium flex items-center">
                          {benefit.name}
                          <Crown className="w-4 h-4 ml-2 text-yellow-400" />
                        </h3>
                        <p className="text-sm text-slate-400">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                        {benefit.valueMultiplier}x VALUE
                      </Badge>
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                  Individual vs Teams Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Monthly Credits</span>
                    <div className="text-right">
                      <div className="text-slate-400 line-through">$25</div>
                      <div className="text-green-400 font-bold">$40 (+60%)</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Security Features</span>
                    <div className="text-right">
                      <div className="text-slate-400">Basic</div>
                      <div className="text-purple-400 font-bold">Enterprise</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Collaboration</span>
                    <div className="text-right">
                      <div className="text-slate-400">None</div>
                      <div className="text-blue-400 font-bold">Real-time</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">AI Features</span>
                    <div className="text-right">
                      <div className="text-slate-400">Standard</div>
                      <div className="text-yellow-400 font-bold">Premium</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Award className="w-5 h-5 mr-2 text-purple-400" />
                  ROI Calculator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      {Math.round((teamsMultiplier - 1) * 100)}%
                    </div>
                    <div className="text-slate-300">Additional Value</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Base Tier Value</span>
                      <span className="text-white">$75/month</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Teams Enhancement</span>
                      <span className="text-green-400">+$45/month</span>
                    </div>
                    <div className="border-t border-slate-600 pt-2">
                      <div className="flex justify-between font-bold">
                        <span className="text-white">Total Value</span>
                        <span className="text-green-400">$120/month</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="upgrade" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {enhancedTiers
              .filter(tier => tier.price > (getCurrentTierData()?.price || 0))
              .map((tier, index) => (
                <Card key={tier.id} className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${tier.gradient} mr-3`}>
                        <tier.icon className="w-5 h-5 text-white" />
                      </div>
                      {tier.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white mb-1">
                        ${tier.price - (getCurrentTierData()?.price || 0)}
                      </div>
                      <div className="text-slate-400 text-sm">Upgrade Cost</div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">GTT Required</span>
                        <span className={tier.color}>
                          {(tier.gttRequired - (getCurrentTierData()?.gttRequired || 0)).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Capsule Increase</span>
                        <span className="text-green-400">
                          +{tier.limits.capsules - (getCurrentTierData()?.limits.capsules || 0)}
                        </span>
                      </div>
                    </div>

                    <Progress 
                      value={canUpgrade(tier) ? 100 : (gttBalance / tier.gttRequired) * 100}
                      className="h-2"
                    />

                    <Button
                      onClick={() => upgradeTier(tier.id)}
                      disabled={!canUpgrade(tier) || isUpgrading}
                      className={`w-full bg-gradient-to-r ${tier.gradient} hover:opacity-90`}
                    >
                      {canUpgrade(tier) ? (
                        <>
                          <ArrowUp className="w-4 h-4 mr-2" />
                          Upgrade to {tier.name}
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Need More GTT
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamsEnhancedTiers;