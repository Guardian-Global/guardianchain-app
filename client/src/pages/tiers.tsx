// Tier Pricing Page

import React from "react";
import TiersPricing from "@/components/TiersPricing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Crown, Zap, Users, TrendingUp } from "lucide-react";
import { BRAND_COLORS, BRAND_NAME } from "@/lib/constants";
import { useTier } from "@/hooks/useTier";

export default function TiersPage() {
  const { userProfile } = useTier();

  const handleUpgrade = (tierId: string) => {
    console.log(`Upgrading to tier: ${tierId}`);
    // Stripe integration will be handled by TiersPricing component
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <section className="pt-20 pb-8 bg-gradient-to-br from-purple-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Choose Your {BRAND_NAME} Access Tier
          </h1>
          <p className="text-xl text-slate-300 mb-6">
            Unlock more capsule mints, higher yield bonuses, and exclusive features with GTT token economics
          </p>
          <Badge className="bg-purple-600 text-white px-4 py-2">
            <Check className="w-4 h-4 mr-2" />
            Unused mints roll over • Donations available • Cancel anytime
          </Badge>
        </div>
      </section>

      {/* Current User Status */}
      {userProfile && (
        <section className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-slate-800/30 rounded-lg p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Users className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                  <div className="text-2xl font-bold text-white">
                    {userProfile.mintsThisPeriod}
                  </div>
                  <div className="text-sm text-slate-400">Mints Used This Month</div>
                </div>
                <div className="text-center">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-400" />
                  <div className="text-2xl font-bold text-white">
                    {userProfile.gttBalance?.toFixed(2) || '0.00'} GTT
                  </div>
                  <div className="text-sm text-slate-400">Current Balance</div>
                </div>
                <div className="text-center">
                  <Star className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                  <div className="text-2xl font-bold text-white">
                    {userProfile.totalYieldEarned?.toFixed(2) || '0.00'} GTT
                  </div>
                  <div className="text-sm text-slate-400">Total Yield Earned</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tier Pricing Component */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TiersPricing 
            userId={userProfile?.id}
            currentTierId={userProfile?.tierId || 'explorer'}
            onUpgrade={handleUpgrade}
          />
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-12 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-white mb-8">
            Why Upgrade Your {BRAND_NAME} Tier?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                  Higher Yield Multipliers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  Earn up to 25% bonus yield on all your capsule verifications and community contributions.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Crown className="w-5 h-5 mr-2 text-purple-400" />
                  Exclusive Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  Access advanced analytics, API endpoints, custom branding, and priority support.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="w-5 h-5 mr-2 text-green-400" />
                  Community Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  Donate unused mints to support trauma survivors, nonprofits, and public truth initiatives.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* GTT Token Integration */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Powered by GTT Token Economics
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            All tier benefits integrate with our Guardian Truth Token (GTT) for seamless yield distribution and governance participation.
          </p>
          
          <div className="bg-gradient-to-r from-purple-900/50 to-green-900/50 rounded-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Automatic Yield Distribution</h3>
                <p className="text-slate-300">
                  Higher tiers receive boosted GTT yields automatically distributed from our smart contract treasury system.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Governance Participation</h3>
                <p className="text-slate-300">
                  Use earned GTT tokens to participate in {BRAND_NAME} DAO governance and shape platform development.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}