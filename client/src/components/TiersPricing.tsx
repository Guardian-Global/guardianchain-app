import React, { useState } from "react";
import { getAllTiers, getTierById, getNextTier, type Tier } from "@/lib/roles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Crown, Zap, ArrowRight } from "lucide-react";
import { BRAND_COLORS, BRAND_NAME } from "@/lib/constants";
import { useTier } from "@/hooks/useTier";

interface TiersPricingProps {
  userId?: string;
  currentTierId?: string;
  onUpgrade?: (tierId: string) => void;
}

export default function TiersPricing({
  userId,
  currentTierId = "explorer",
  onUpgrade,
}: TiersPricingProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">(
    "monthly"
  );
  const { userProfile } = useTier(userId);

  const tiers = getAllTiers();
  const currentTier = getTierById(currentTierId);

  const handleUpgrade = async (tier: Tier) => {
    if (tier.id === currentTierId) return;

    setLoading(tier.id);

    try {
      if (onUpgrade) {
        onUpgrade(tier.id);
      } else {
        // Create Stripe checkout session
        const response = await fetch("/api/stripe/create-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tierId: tier.id,
            userId: userId || userProfile?.id,
            billingPeriod,
          }),
        });

        if (response.ok) {
          const { url } = await response.json();
          window.location.href = url;
        } else {
          throw new Error("Failed to create checkout session");
        }
      }
    } catch (error) {
      console.error("Upgrade failed:", error);
      // You could show a toast notification here
    } finally {
      setLoading(null);
    }
  };

  const getAnnualPrice = (monthlyPrice: number) => {
    return monthlyPrice === 0 ? 0 : monthlyPrice * 10; // 2 months free
  };

  const getDisplayPrice = (tier: Tier) => {
    if (tier.priceUSD === 0) return "Free";

    if (billingPeriod === "annual") {
      const annualPrice = getAnnualPrice(tier.priceUSD);
      return `$${annualPrice}/year`;
    }

    return `$${tier.priceUSD}/month`;
  };

  const getSavingsText = (tier: Tier) => {
    if (tier.priceUSD === 0 || billingPeriod === "monthly") return null;

    const savings = tier.priceUSD * 2;
    return `Save $${savings}/year`;
  };

  const getTierIcon = (tierId: string) => {
    switch (tierId) {
      case "explorer":
        return <Star className="w-5 h-5" />;
      case "seeker":
        return <Zap className="w-5 h-5" />;
      case "creator":
        return <Crown className="w-5 h-5" />;
      case "sovereign":
        return <Crown className="w-5 h-5" />;
      default:
        return <Star className="w-5 h-5" />;
    }
  };

  const isCurrentTier = (tierId: string) => tierId === currentTierId;
  const canUpgradeToTier = (tierId: string) => {
    const tierIndex = tiers.findIndex((t) => t.id === tierId);
    const currentIndex = tiers.findIndex((t) => t.id === currentTierId);
    return tierIndex > currentIndex;
  };

  return (
    <div className="space-y-8">
      {/* Billing Period Toggle */}
      <div className="flex justify-center">
        <div className="bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setBillingPeriod("monthly")}
            className={`px-4 py-2 rounded-md transition-colors ${
              billingPeriod === "monthly"
                ? "bg-white text-slate-900"
                : "text-slate-300 hover:text-white"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod("annual")}
            className={`px-4 py-2 rounded-md transition-colors ${
              billingPeriod === "annual"
                ? "bg-white text-slate-900"
                : "text-slate-300 hover:text-white"
            }`}
          >
            Annual
            <Badge className="ml-2 bg-green-600 text-white text-xs">
              Save 20%
            </Badge>
          </button>
        </div>
      </div>

      {/* Tiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tiers.map((tier, index) => {
          const isPopular = tier.id === "creator";
          const isCurrent = isCurrentTier(tier.id);
          const canUpgrade = canUpgradeToTier(tier.id);

          return (
            <Card
              key={tier.id}
              className={`relative transition-all hover:scale-105 ${
                isPopular ? "ring-2 ring-purple-500" : ""
              } ${
                isCurrent
                  ? "bg-slate-700 border-green-500"
                  : "bg-slate-800/50 border-slate-700"
              }`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-purple-600 text-white px-3 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}

              {isCurrent && (
                <div className="absolute -top-3 right-4">
                  <Badge className="bg-green-600 text-white px-3 py-1">
                    Current Plan
                  </Badge>
                </div>
              )}

              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div style={{ color: tier.color }}>
                      {getTierIcon(tier.id)}
                    </div>
                    <CardTitle className="text-white flex items-center">
                      {tier.badge} {tier.name}
                    </CardTitle>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-3xl font-bold text-white">
                    {getDisplayPrice(tier)}
                  </div>
                  {getSavingsText(tier) && (
                    <div className="text-sm text-green-400">
                      {getSavingsText(tier)}
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <p className="text-slate-300 text-sm">{tier.description}</p>

                {/* Key Stats */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">
                      Monthly Capsules:
                    </span>
                    <span className="text-white font-semibold">
                      {tier.capsuleLimit}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Yield Bonus:</span>
                    <span className="text-white font-semibold">
                      +{tier.yieldBonus * 100}%
                    </span>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-2">
                  {tier.features.map((feature, featureIndex) => (
                    <div
                      key={featureIndex}
                      className="flex items-start space-x-2"
                    >
                      <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <div className="pt-4">
                  {isCurrent ? (
                    <Button
                      className="w-full"
                      disabled
                      style={{ backgroundColor: "#4ade80" }}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Current Plan
                    </Button>
                  ) : canUpgrade ? (
                    <Button
                      onClick={() => handleUpgrade(tier)}
                      disabled={loading === tier.id}
                      className="w-full"
                      style={{ backgroundColor: tier.color }}
                    >
                      {loading === tier.id ? (
                        <>
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Upgrade Now
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button className="w-full" disabled variant="outline">
                      Lower Tier
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tier Comparison Note */}
      <div className="text-center text-slate-400 text-sm">
        <p>
          All plans include basic capsule creation, community verification, and
          standard support.
        </p>
        <p className="mt-1">
          Cancel anytime. No setup fees. Enterprise plans available upon
          request.
        </p>
      </div>
    </div>
  );
}
