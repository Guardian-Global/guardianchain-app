import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Crown, 
  Shield, 
  Zap, 
  TrendingUp, 
  Users, 
  Coins,
  Star,
  Lock,
  ArrowUp,
  CheckCircle,
  Sparkles,
  Target
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PremiumFeatures: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const premiumTiers = [
    {
      name: "Truth Guardian",
      price: "$299/month",
      gttRewards: "10,000 GTT/month",
      features: [
        "Enterprise API Access (1M calls/month)",
        "AI-Powered Truth Verification",
        "Priority Support & Training",
        "Custom White-Label Deployment",
        "Advanced Analytics Dashboard",
        "Cross-Chain Integration"
      ],
      valueAdd: "$50,000+ monthly savings",
      roi: "16,700% ROI"
    },
    {
      name: "Protocol Sovereign",
      price: "$999/month",
      gttRewards: "50,000 GTT/month",
      features: [
        "Unlimited API Access",
        "Dedicated Infrastructure",
        "Private Blockchain Deployment",
        "24/7 Dedicated Support Team",
        "Custom AI Model Training",
        "Regulatory Compliance Suite",
        "Revenue Sharing Program"
      ],
      valueAdd: "$250,000+ monthly savings",
      roi: "25,000% ROI",
      popular: true
    },
    {
      name: "Enterprise Alliance",
      price: "Custom Pricing",
      gttRewards: "1M+ GTT/month",
      features: [
        "Multi-Billion Scale Infrastructure",
        "Global Regulatory Compliance",
        "Custom Smart Contract Development",
        "Enterprise Integration Team",
        "Board Advisory Access",
        "Protocol Governance Rights",
        "IPO Participation Rights"
      ],
      valueAdd: "$10M+ monthly savings",
      roi: "Unlimited ROI"
    }
  ];

  const valueMultipliers = [
    {
      feature: "AI Truth Verification",
      multiplier: "1000x",
      description: "Automated fact-checking reducing manual verification costs by 99.9%",
      savings: "$2.5M annually"
    },
    {
      feature: "Cross-Chain Deployment",
      multiplier: "500x",
      description: "Multi-blockchain support eliminating integration overhead",
      savings: "$1.8M annually"
    },
    {
      feature: "Enterprise Compliance",
      multiplier: "300x",
      description: "Automated regulatory reporting and audit trail generation",
      savings: "$850K annually"
    },
    {
      feature: "Revenue Sharing",
      multiplier: "200x",
      description: "Direct protocol revenue participation for enterprise partners",
      savings: "$500K annually"
    }
  ];

  const handleSubscriptionUpgrade = async (tierName: string) => {
    setIsProcessing(true);
    try {
      // Real Stripe integration for subscription management
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tier: tierName,
          features: 'premium_enterprise'
        })
      });

      if (response.ok) {
        const { clientSecret } = await response.json();
        // Redirect to Stripe checkout
        window.location.href = `/checkout?client_secret=${clientSecret}`;
      }
    } catch (error) {
      toast({
        title: "Upgrade Error",
        description: "Please contact enterprise support for custom pricing",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full space-y-8">
      <Card className="bg-gradient-to-r from-yellow-900/20 to-purple-900/20 border-yellow-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-center">
            <Crown className="w-8 h-8 mr-3 text-yellow-400" />
            <div className="text-center">
              <div className="text-3xl font-bold">Premium Enterprise Features</div>
              <div className="text-lg text-yellow-400">Unlock Billion-Dollar Protocol Value</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-slate-300 mb-6">
            Transform your organization with enterprise-grade truth verification infrastructure. 
            Save millions annually while earning substantial GTT rewards.
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">$10M+</div>
              <div className="text-sm text-slate-400">Annual Savings</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">1000x</div>
              <div className="text-sm text-slate-400">Efficiency Gains</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">99.9%</div>
              <div className="text-sm text-slate-400">Accuracy Rate</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">24/7</div>
              <div className="text-sm text-slate-400">Global Support</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Premium Tier Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {premiumTiers.map((tier, index) => (
          <Card 
            key={index}
            className={`bg-slate-800/50 border-slate-700 ${
              tier.popular ? 'ring-2 ring-purple-500 scale-105' : ''
            }`}
          >
            <CardHeader>
              <CardTitle className="text-white text-center">
                <div className="text-2xl font-bold">{tier.name}</div>
                {tier.popular && (
                  <Badge className="mt-2 bg-purple-600">Most Popular</Badge>
                )}
              </CardTitle>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{tier.price}</div>
                <div className="text-lg text-yellow-400">{tier.gttRewards}</div>
                <div className="text-sm text-slate-400">+ {tier.valueAdd}</div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                {tier.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                    <span className="text-slate-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="bg-green-900/20 border border-green-700 rounded-lg p-3 mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-400">{tier.roi}</div>
                  <div className="text-xs text-slate-400">Return on Investment</div>
                </div>
              </div>

              <Button 
                className={`w-full ${
                  tier.popular 
                    ? 'bg-purple-600 hover:bg-purple-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
                disabled={isProcessing}
                onClick={() => handleSubscriptionUpgrade(tier.name)}
              >
                {isProcessing ? (
                  <div className="flex items-center">
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Processing...
                  </div>
                ) : (
                  <>
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade Now
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Value Multipliers */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Sparkles className="w-6 h-6 mr-2 text-yellow-400" />
            Value Multiplication Engines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {valueMultipliers.map((multiplier, index) => (
              <div key={index} className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-semibold">{multiplier.feature}</h3>
                  <Badge className="bg-yellow-600 text-black font-bold">
                    {multiplier.multiplier}
                  </Badge>
                </div>
                <p className="text-slate-300 text-sm mb-3">{multiplier.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Annual Savings:</span>
                  <span className="text-green-400 font-bold">{multiplier.savings}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* GTT Token Integration */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Coins className="w-6 h-6 mr-2 text-yellow-400" />
            GTT Token Rewards & Utility
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-yellow-900/20 rounded-lg p-6 mb-4">
                <Coins className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-400">1M+ GTT</div>
                <div className="text-sm text-slate-400">Monthly Rewards</div>
              </div>
              <p className="text-slate-300 text-sm">
                Earn substantial GTT tokens through premium subscriptions and enterprise usage
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-900/20 rounded-lg p-6 mb-4">
                <TrendingUp className="w-12 h-12 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-400">25% APY</div>
                <div className="text-sm text-slate-400">Staking Rewards</div>
              </div>
              <p className="text-slate-300 text-sm">
                Stake GTT tokens for additional yield and governance voting power
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-900/20 rounded-lg p-6 mb-4">
                <Shield className="w-12 h-12 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-400">Revenue Share</div>
                <div className="text-sm text-slate-400">Protocol Fees</div>
              </div>
              <p className="text-slate-300 text-sm">
                Receive direct protocol revenue sharing through GTT token holdings
              </p>
            </div>
          </div>

          <div className="mt-8 bg-gradient-to-r from-yellow-900/20 to-purple-900/20 border border-yellow-500/30 rounded-lg p-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-4">GTT Token Value Drivers</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-lg font-bold text-green-400">Burn Mechanism</div>
                  <div className="text-sm text-slate-400">50% fee burns</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-400">Utility Growth</div>
                  <div className="text-sm text-slate-400">Enterprise adoption</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-purple-400">Staking Yield</div>
                  <div className="text-sm text-slate-400">25% annual rewards</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-yellow-400">Revenue Sharing</div>
                  <div className="text-sm text-slate-400">Protocol profits</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PremiumFeatures;