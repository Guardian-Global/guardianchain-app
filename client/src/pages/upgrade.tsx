import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Lock,
  Check,
  Crown,
  Zap,
  Star,
  ArrowRight,
  Building2,
  Sparkles,
  Shield,
  FileText,
  TrendingUp,
} from "lucide-react";

export default function UpgradePage() {
  const [annual, setAnnual] = useState(false);

  const currentTier = "Explorer"; // This would come from user context
  const recommendedTier = "Pro";

  const features = [
    {
      name: "Veritas Seal",
      description: "DocuSign-powered legal verification",
      explorer: false,
      pro: true,
      enterprise: true,
      icon: Shield,
    },
    {
      name: "Truth Bounty Access",
      description: "Crowdsourced investigation rewards",
      explorer: false,
      pro: true,
      enterprise: true,
      icon: TrendingUp,
    },
    {
      name: "Unlimited Truth Capsules",
      description: "Create unlimited verified content",
      explorer: false,
      pro: true,
      enterprise: true,
      icon: FileText,
    },
    {
      name: "Advanced Analytics",
      description: "Detailed performance insights",
      explorer: false,
      pro: true,
      enterprise: true,
      icon: TrendingUp,
    },
    {
      name: "Priority Verification",
      description: "Fast-track your submissions",
      explorer: false,
      pro: true,
      enterprise: true,
      icon: Zap,
    },
    {
      name: "GTT Earning Boost",
      description: "Earn up to 500 GTT/month",
      explorer: false,
      pro: true,
      enterprise: true,
      icon: Star,
    },
  ];

  const tiers = [
    {
      name: "Explorer",
      price: { monthly: 0, annual: 0 },
      description: "Your current plan",
      maxGTT: "10 GTT/month",
      features: [
        "Basic verification",
        "Public capsule viewing",
        "Community access",
      ],
    },
    {
      name: "Pro",
      price: { monthly: 29, annual: 290 },
      description: "Recommended upgrade",
      maxGTT: "500 GTT/month",
      features: [
        "Everything in Explorer",
        "Unlimited capsules",
        "Veritas tools",
        "Advanced analytics",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: { monthly: "Custom", annual: "Custom" },
      description: "For organizations",
      maxGTT: "Unlimited GTT potential",
      features: [
        "Everything in Pro",
        "White-label solution",
        "API access",
        "Dedicated support",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-300">
              Unlock your earning potential
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">Upgrade to</span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Unlock Premium Features
            </span>
          </h1>

          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Get access to Veritas Seals, Truth Bounty rewards, unlimited capsule
            creation, and earn up to 50x more GTT tokens.
          </p>
        </div>

        {/* Current vs Recommended */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center">
                  <Star className="w-4 h-4 text-slate-400" />
                </div>
                Current: Explorer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Monthly GTT Limit</span>
                  <span className="text-amber-400 font-medium">10 GTT</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Truth Capsules</span>
                  <span className="text-slate-400">3/month</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Veritas Tools</span>
                  <Lock className="w-4 h-4 text-red-400" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Advanced Analytics</span>
                  <Lock className="w-4 h-4 text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                Recommended
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Crown className="w-4 h-4 text-white" />
                </div>
                Upgrade to Pro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Monthly GTT Limit</span>
                  <span className="text-green-400 font-medium">500 GTT</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Truth Capsules</span>
                  <span className="text-green-400">Unlimited</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Veritas Tools</span>
                  <Check className="w-4 h-4 text-green-400" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Advanced Analytics</span>
                  <Check className="w-4 h-4 text-green-400" />
                </div>
              </div>
              <div className="mt-6">
                <div className="text-center mb-4">
                  <span className="text-3xl font-bold text-white">$29</span>
                  <span className="text-slate-400">/month</span>
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={() => (window.location.href = "/api/upgrade-stripe")}
                >
                  Upgrade Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Locked Features */}
        <Card className="bg-slate-800 border-slate-700 mb-12">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white">
              Unlock These Premium Features
            </CardTitle>
            <p className="text-slate-400">
              See what you're missing with your current Explorer plan
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features
                .filter((f) => !f.explorer)
                .map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-lg border border-slate-600"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">
                          {feature.name}
                        </h3>
                        <p className="text-sm text-slate-400">
                          {feature.description}
                        </p>
                      </div>
                      <Lock className="w-5 h-5 text-red-400" />
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>

        {/* Billing Toggle */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-4 bg-slate-800 border border-slate-700 rounded-lg p-2">
            <span
              className={`text-sm px-3 py-1 rounded ${!annual ? "bg-blue-600 text-white" : "text-slate-400"}`}
            >
              Monthly
            </span>
            <Switch
              checked={annual}
              onCheckedChange={setAnnual}
              className="data-[state=checked]:bg-blue-600"
            />
            <span
              className={`text-sm px-3 py-1 rounded ${annual ? "bg-blue-600 text-white" : "text-slate-400"}`}
            >
              Annual
            </span>
            {annual && (
              <Badge className="bg-green-600 text-white">Save 17%</Badge>
            )}
          </div>
        </div>

        {/* All Plans Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {tiers.map((tier, index) => {
            const price = tier.price[annual ? "annual" : "monthly"];
            const isCurrent = tier.name === currentTier;
            const isRecommended = tier.name === recommendedTier;

            return (
              <Card
                key={tier.name}
                className={`relative ${
                  isRecommended
                    ? "bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500 scale-105"
                    : isCurrent
                      ? "bg-slate-800 border-yellow-500"
                      : "bg-slate-800 border-slate-700"
                }`}
              >
                {isRecommended && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      Recommended
                    </Badge>
                  </div>
                )}
                {isCurrent && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-yellow-600 text-white">
                      Current Plan
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center">
                  <CardTitle className="text-xl font-bold text-white">
                    {tier.name}
                  </CardTitle>
                  <p className="text-slate-400 text-sm">{tier.description}</p>
                  <div className="mt-4">
                    {typeof price === "number" ? (
                      <div>
                        <span className="text-3xl font-bold text-white">
                          ${price}
                        </span>
                        <span className="text-slate-400">
                          /{annual ? "year" : "month"}
                        </span>
                      </div>
                    ) : (
                      <div className="text-2xl font-bold text-white">
                        {price}
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-green-400 mt-2">
                    {tier.maxGTT}
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-2 mb-6">
                    {tier.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-slate-300 text-sm">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {!isCurrent && (
                    <Button
                      className={`w-full ${
                        isRecommended
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          : "border-slate-600 hover:bg-slate-700"
                      }`}
                      variant={isRecommended ? "default" : "outline"}
                      onClick={() => {
                        if (tier.name === "Enterprise") {
                          window.location.href = "/contact";
                        } else {
                          window.location.href = "/api/upgrade-stripe";
                        }
                      }}
                    >
                      {tier.name === "Enterprise"
                        ? "Contact Sales"
                        : "Upgrade Now"}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* ROI Calculator */}
        <Card className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-700/50 mb-12">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white">
              Return on Investment
            </CardTitle>
            <p className="text-slate-400">
              See how Pro pays for itself with increased GTT earning potential
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400 mb-1">
                  10 GTT/month
                </div>
                <div className="text-slate-400 text-sm">Explorer Limit</div>
                <div className="text-slate-500 text-xs">≈ $0.075/month</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">
                  500 GTT/month
                </div>
                <div className="text-slate-400 text-sm">Pro Potential</div>
                <div className="text-green-400 text-xs">≈ $3.75/month</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-1">
                  50x Growth
                </div>
                <div className="text-slate-400 text-sm">Earning Multiplier</div>
                <div className="text-blue-400 text-xs">ROI: 12.9%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center pb-16">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Unlock Your Potential?
          </h2>
          <p className="text-slate-300 mb-8">
            Join thousands of Pro users earning more GTT tokens and accessing
            premium features.
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4"
            onClick={() => (window.location.href = "/api/upgrade-stripe")}
          >
            Upgrade to Pro - $29/month
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
