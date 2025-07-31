import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Zap, 
  Crown, 
  Building2,
  Lock,
  Check,
  ArrowRight,
  Star
} from "lucide-react";

export default function CapsulePricingPage() {
  const capsuleTiers = [
    {
      name: "Basic Capsule",
      description: "Standard truth verification",
      icon: FileText,
      price: 0.99,
      gttReward: 5,
      popular: false,
      features: [
        "Community verification",
        "Standard priority queue",
        "Basic analytics",
        "30-day verification window",
        "5 GTT token reward on approval"
      ],
      limitations: [
        "No priority support",
        "Standard verification time"
      ]
    },
    {
      name: "Premium Capsule",
      description: "Enhanced verification with priority",
      icon: Star,
      price: 4.99,
      gttReward: 25,
      popular: true,
      features: [
        "Priority verification queue",
        "Advanced analytics dashboard",
        "DocuSign integration",
        "24-hour verification window",
        "25 GTT token reward on approval",
        "Truth seal certification",
        "Export verification report"
      ],
      limitations: []
    },
    {
      name: "Enterprise Capsule",
      description: "Maximum verification power",
      icon: Crown,
      price: 19.99,
      gttReward: 100,
      popular: false,
      features: [
        "Instant verification priority",
        "Professional truth seal",
        "Legal-grade documentation",
        "4-hour verification window",
        "100 GTT token reward on approval",
        "White-label verification",
        "API integration access",
        "Dedicated verification team",
        "Commercial licensing included"
      ],
      limitations: []
    }
  ];

  const subscriptionTiers = [
    {
      name: "Explorer",
      price: 0,
      capsuleLimit: 3,
      discount: 0,
      features: [
        "3 capsules per month",
        "Pay per capsule",
        "Community access",
        "Basic support"
      ]
    },
    {
      name: "Creator",
      price: 24.99,
      capsuleLimit: 50,
      discount: 20,
      features: [
        "50 capsules per month",
        "20% discount on all capsules",
        "Priority support",
        "Advanced analytics",
        "Creator marketplace access"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: 99.99,
      capsuleLimit: 200,
      discount: 40,
      features: [
        "200 capsules per month",
        "40% discount on all capsules",
        "Dedicated support team",
        "White-label options",
        "API access",
        "Custom integrations"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
            Truth Capsule Pricing
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Choose your truth verification level. Higher tiers = faster verification + bigger GTT rewards.
          </p>
          <div className="mt-8 p-4 bg-green-500/10 border border-green-500/20 rounded-lg max-w-2xl mx-auto">
            <p className="text-green-400 font-medium">
              🌱 Platform access is FREE forever - you only pay when creating capsules
            </p>
          </div>
        </div>

        {/* Capsule Tiers */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Per-Capsule Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {capsuleTiers.map((tier, index) => (
              <Card key={index} className={`bg-slate-800/50 border-slate-700 relative ${tier.popular ? 'ring-2 ring-purple-500' : ''}`}>
                {tier.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white">
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full">
                      <tier.icon className="w-8 h-8 text-purple-400" />
                    </div>
                  </div>
                  
                  <CardTitle className="text-2xl text-white">{tier.name}</CardTitle>
                  <p className="text-slate-400">{tier.description}</p>
                  
                  <div className="mt-4">
                    <div className="text-4xl font-bold text-white">${tier.price}</div>
                    <div className="text-green-400 font-medium">+{tier.gttReward} GTT reward</div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {tier.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-slate-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    onClick={() => window.location.href = '/create-capsule'}
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Create Capsule
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Subscription Plans */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-12">Subscription Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {subscriptionTiers.map((tier, index) => (
              <Card key={index} className={`bg-slate-800/50 border-slate-700 relative ${tier.popular ? 'ring-2 ring-purple-500' : ''}`}>
                {tier.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white">
                    Best Value
                  </Badge>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-white">{tier.name}</CardTitle>
                  <div className="mt-4">
                    <div className="text-4xl font-bold text-white">
                      {tier.price === 0 ? 'Free' : `$${tier.price}`}
                    </div>
                    {tier.price > 0 && <div className="text-slate-400">/month</div>}
                    {tier.discount > 0 && (
                      <div className="text-green-400 font-medium">
                        {tier.discount}% discount on capsules
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {tier.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-slate-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    onClick={() => tier.price === 0 ? window.location.href = '/api/login' : window.location.href = '/api/upgrade-stripe'}
                  >
                    {tier.price === 0 ? 'Start Free' : `Upgrade to ${tier.name}`}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Revenue Model Explanation */}
        <div className="mt-20 text-center">
          <Card className="bg-slate-800/30 border-slate-600 max-w-4xl mx-auto">
            <CardContent className="pt-8">
              <h3 className="text-2xl font-bold text-white mb-6">How Our Revenue Model Works</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                <div>
                  <h4 className="text-lg font-semibold text-purple-400 mb-3">Free Platform Access</h4>
                  <ul className="space-y-2 text-slate-300">
                    <li>• Browse all public truth capsules</li>
                    <li>• Participate in community verification</li>
                    <li>• Earn GTT tokens from verification</li>
                    <li>• Access basic analytics</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-green-400 mb-3">Pay-Per-Capsule Revenue</h4>
                  <ul className="space-y-2 text-slate-300">
                    <li>• Users pay when creating truth capsules</li>
                    <li>• Higher tiers = faster verification</li>
                    <li>• Successful capsules earn GTT rewards</li>
                    <li>• Subscription plans offer volume discounts</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}