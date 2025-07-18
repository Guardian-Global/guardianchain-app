// Tier Pricing Page

import React from "react";
import { TIERS } from '@/lib/tiers';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Crown, Zap } from "lucide-react";
import { BRAND_COLORS, BRAND_NAME } from "@/lib/constants";

const tierIcons = {
  Explorer: <Zap className="w-6 h-6" />,
  Seeker: <Star className="w-6 h-6" />,
  Creator: <Crown className="w-6 h-6" />,
  Sovereign: <Crown className="w-6 h-6" />
};

const tierColors = {
  Explorer: "bg-slate-600",
  Seeker: "bg-blue-600",
  Creator: "bg-purple-600",
  Sovereign: "bg-yellow-600"
};

export default function TiersPage() {
  const handleUpgrade = (tierName: string) => {
    // Will integrate with Stripe checkout
    console.log(`Upgrading to ${tierName}`);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <section className="pt-20 pb-8 bg-gradient-to-br from-purple-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Choose Your {BRAND_NAME} Tier
          </h1>
          <p className="text-xl text-slate-300 mb-6">
            Unlock more capsule mints, higher yield bonuses, and exclusive features
          </p>
          <Badge className="bg-purple-600 text-white px-4 py-2">
            Unused mints roll over • Donations available • Cancel anytime
          </Badge>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TIERS.map((tier, index) => (
              <Card 
                key={tier.name} 
                className={`bg-slate-800/50 border-slate-700 relative ${
                  tier.name === 'Creator' ? 'border-purple-500 ring-2 ring-purple-500/20' : ''
                }`}
              >
                {tier.name === 'Creator' && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-purple-600 text-white px-3 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-full ${tierColors[tier.name]} flex items-center justify-center text-white`}>
                    {tierIcons[tier.name]}
                  </div>
                  <CardTitle className="text-2xl font-bold text-white">
                    {tier.name}
                  </CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-white">
                      ${tier.priceUsd}
                    </span>
                    {tier.priceUsd > 0 && (
                      <span className="text-slate-400">/month</span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-slate-300 text-sm text-center mb-6">
                    {tier.description}
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Check className="w-4 h-4 mr-3 text-green-400 flex-shrink-0" />
                      <span className="text-slate-300">
                        <strong>{tier.capsuleMints}</strong> capsule mints/month
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <Check className="w-4 h-4 mr-3 text-green-400 flex-shrink-0" />
                      <span className="text-slate-300">
                        <strong>{tier.yieldBonus * 100}%</strong> yield bonus
                      </span>
                    </div>

                    {tier.name !== 'Explorer' && (
                      <>
                        <div className="flex items-center">
                          <Check className="w-4 h-4 mr-3 text-green-400 flex-shrink-0" />
                          <span className="text-slate-300">Priority support</span>
                        </div>
                        
                        <div className="flex items-center">
                          <Check className="w-4 h-4 mr-3 text-green-400 flex-shrink-0" />
                          <span className="text-slate-300">Analytics dashboard</span>
                        </div>
                      </>
                    )}

                    {tier.name === 'Creator' && (
                      <>
                        <div className="flex items-center">
                          <Check className="w-4 h-4 mr-3 text-green-400 flex-shrink-0" />
                          <span className="text-slate-300">Creator badge</span>
                        </div>
                        <div className="flex items-center">
                          <Check className="w-4 h-4 mr-3 text-green-400 flex-shrink-0" />
                          <span className="text-slate-300">Featured placements</span>
                        </div>
                      </>
                    )}

                    {tier.name === 'Sovereign' && (
                      <>
                        <div className="flex items-center">
                          <Check className="w-4 h-4 mr-3 text-green-400 flex-shrink-0" />
                          <span className="text-slate-300">Early access features</span>
                        </div>
                        <div className="flex items-center">
                          <Check className="w-4 h-4 mr-3 text-green-400 flex-shrink-0" />
                          <span className="text-slate-300">Governance voting</span>
                        </div>
                        <div className="flex items-center">
                          <Check className="w-4 h-4 mr-3 text-green-400 flex-shrink-0" />
                          <span className="text-slate-300">White-label options</span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="pt-6">
                    <Button 
                      className="w-full"
                      style={{ 
                        backgroundColor: tier.name === 'Explorer' ? '#64748b' : BRAND_COLORS.GUARDIAN 
                      }}
                      onClick={() => handleUpgrade(tier.name)}
                      disabled={tier.name === 'Explorer'}
                    >
                      {tier.name === 'Explorer' ? 'Current Plan' : `Upgrade to ${tier.name}`}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <div className="bg-slate-800/30 rounded-lg p-6 max-w-4xl mx-auto">
              <h3 className="text-xl font-bold text-white mb-4">
                Flexible Capsule Credits
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-300">
                <div>
                  <strong className="text-white">Rollover Credits:</strong> Unused mints carry forward to next month, up to 2x your tier limit
                </div>
                <div>
                  <strong className="text-white">Donation System:</strong> Donate unused credits to trauma survivors and nonprofit organizations
                </div>
                <div>
                  <strong className="text-white">Fair Billing:</strong> Pro-rated upgrades, cancel anytime, transparent pricing with no hidden fees
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}