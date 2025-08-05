import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown } from "lucide-react";
import { useLocation } from "wouter";

interface PricingTier {
  price: number;
  name: string;
  features: string[];
}

interface PricingData {
  tiers: {
    EXPLORER: PricingTier;
    SEEKER: PricingTier;
    CREATOR: PricingTier;
    SOVEREIGN: PricingTier;
  };
  oneTime: Record<string, number>;
}

const tierIcons = {
  EXPLORER: <Star className="h-5 w-5" />,
  SEEKER: <Zap className="h-5 w-5" />,
  CREATOR: <Crown className="h-5 w-5" />,
  SOVEREIGN: <Crown className="h-5 w-5" />,
};

const tierColors = {
  EXPLORER: "bg-gray-500",
  SEEKER: "bg-blue-500",
  CREATOR: "bg-purple-500",
  SOVEREIGN: "bg-gold-500",
};

export default function Pricing() {
  const [, navigate] = useLocation();
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const { data: pricingData, isLoading } = useQuery<PricingData>({
    queryKey: ['/api/payment/pricing'],
  });

  const handleSubscribe = (tierKey: string) => {
    if (tierKey === 'EXPLORER') {
      // Free tier - no payment needed
      return;
    }
    setSelectedTier(tierKey);
    navigate(`/subscribe?tier=${tierKey}`);
  };

  const handleOneTimePurchase = (feature: string, price: number) => {
    navigate(`/checkout?feature=${feature}&amount=${price}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-12" data-testid="loading-pricing">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-1/3 mx-auto"></div>
              <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-64 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!pricingData) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">Failed to load pricing information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Unlock the full potential of truth verification and decentralized content
          </p>
        </div>

        {/* Subscription Tiers */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {Object.entries(pricingData.tiers).map(([tierKey, tier]) => {
            const isPopular = tierKey === 'SEEKER';
            const isFree = tierKey === 'EXPLORER';
            
            return (
              <Card 
                key={tierKey} 
                className={`relative ${isPopular ? 'border-primary shadow-lg scale-105' : ''}`}
                data-testid={`tier-${tierKey.toLowerCase()}`}
              >
                {isPopular && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary">
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center">
                  <div className={`w-12 h-12 rounded-full ${tierColors[tierKey as keyof typeof tierColors]} flex items-center justify-center mx-auto mb-4 text-white`}>
                    {tierIcons[tierKey as keyof typeof tierIcons]}
                  </div>
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <CardDescription>
                    <span className="text-3xl font-bold">
                      {isFree ? 'Free' : `$${(tier.price / 100).toFixed(0)}`}
                    </span>
                    {!isFree && <span className="text-sm">/month</span>}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className="w-full" 
                    variant={isPopular ? "default" : "outline"}
                    onClick={() => handleSubscribe(tierKey)}
                    disabled={selectedTier === tierKey}
                    data-testid={`button-subscribe-${tierKey.toLowerCase()}`}
                  >
                    {isFree ? 'Get Started' : 'Subscribe Now'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* One-time Purchases */}
        <div className="bg-muted/50 rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">One-Time Purchases</h2>
            <p className="text-muted-foreground">
              Enhance your experience with premium features
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(pricingData.oneTime).map(([feature, price]) => {
              const featureNames = {
                premium_capsule: 'Premium Capsule',
                priority_verification: 'Priority Verification',
                advanced_analytics: 'Advanced Analytics',
                custom_domain: 'Custom Domain',
              };
              
              const featureDescriptions = {
                premium_capsule: 'Enhanced capsule with premium features',
                priority_verification: 'Fast-track verification process',
                advanced_analytics: 'Detailed insights and reports',
                custom_domain: 'Use your own domain name',
              };
              
              return (
                <Card key={feature} data-testid={`one-time-${feature}`}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      {featureNames[feature as keyof typeof featureNames]}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {featureDescriptions[feature as keyof typeof featureDescriptions]}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold">
                        ${(price / 100).toFixed(2)}
                      </span>
                      <Button 
                        size="sm"
                        onClick={() => handleOneTimePurchase(feature, price)}
                        data-testid={`button-buy-${feature}`}
                      >
                        Buy Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Frequently Asked Questions</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I change my plan anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Yes, you can upgrade or downgrade your plan at any time. Changes will be prorated.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  We accept all major credit cards, debit cards, and digital wallets through Stripe.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is there a free trial?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  The Explorer plan is completely free forever. Paid plans don't have a trial period.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I cancel anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}