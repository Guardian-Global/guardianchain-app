import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Check, Zap, Crown, Shield, Star, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DisclaimerBlock from "@/components/DisclaimerBlock";
import Footer from "@/components/Footer";

const pricingPlans = [
  {
    name: "Explorer",
    tier: "EXPLORER",
    price: 0,
    yearlyPrice: 0,
    icon: Shield,
    popular: false,
    description: "Perfect for getting started with truth capsules",
    features: [
      "5 Truth Capsules per month",
      "Basic capsule creation",
      "Public Truth Explorer access",
      "Community support",
      "Basic encryption",
      "Mobile app access"
    ],
    limits: "5 capsules • 100MB storage • Community support",
    cta: "Start Free",
    comparison: "vs. Google Drive ($6/mo for 100GB)"
  },
  {
    name: "Seeker",
    tier: "SEEKER", 
    price: 9,
    yearlyPrice: 90,
    icon: Zap,
    popular: true,
    description: "AI-powered truth analysis and verification",
    features: [
      "50 Truth Capsules per month",
      "AI Truth Genome analysis",
      "Emotional resonance scoring",
      "Basic API access (1K calls/mo)",
      "Advanced encryption",
      "Email support",
      "Truth lineage tracking"
    ],
    limits: "50 capsules • 1GB storage • 1K API calls • Email support",
    cta: "Start Seeking",
    comparison: "vs. Medium ($8/mo) + OpenAI ($20/mo)"
  },
  {
    name: "Creator",
    tier: "CREATOR",
    price: 29,
    yearlyPrice: 290,
    icon: Star,
    popular: false,
    description: "Full creator suite with NFT minting and monetization",
    features: [
      "500 Truth Capsules per month",
      "NFT minting & marketplace",
      "Custom Truth Reels",
      "Advanced API access (10K calls/mo)",
      "GTT yield optimization",
      "Priority support",
      "Custom branding options",
      "Advanced analytics dashboard"
    ],
    limits: "500 capsules • 10GB storage • 10K API calls • Priority support",
    cta: "Create Truth",
    comparison: "vs. Substack Pro ($10/mo) + OpenSea Pro ($20/mo)"
  },
  {
    name: "Sovereign",
    tier: "SOVEREIGN",
    price: 99,
    yearlyPrice: 990,
    icon: Crown,
    popular: false,
    description: "Enterprise-grade sovereignty with unlimited access",
    features: [
      "Unlimited Truth Capsules",
      "White-label deployment",
      "Full developer API (100K calls/mo)",
      "Custom smart contracts",
      "Dedicated infrastructure",
      "24/7 dedicated support",
      "Custom integrations",
      "Advanced compliance tools",
      "Multi-chain deployment"
    ],
    limits: "Unlimited everything • Dedicated support • White-label ready",
    cta: "Go Sovereign",
    comparison: "vs. AWS + Stripe + Auth0 ($300+/mo)"
  }
];

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const { isAuthenticated } = useAuth();

  const handleSubscribe = (tier: string) => {
    if (!isAuthenticated) {
      window.location.href = '/auth/login';
      return;
    }
    
    // Navigate to subscription flow
    window.location.href = `/subscribe/${tier.toLowerCase()}`;
  };

  return (
    <>
      <Helmet>
        <title>Pricing - Sovereign Truth Infrastructure | GuardianChain</title>
        <meta name="description" content="Compare GuardianChain subscription plans. From free Explorer to enterprise Sovereign - find the perfect plan for your truth preservation needs." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        <div className="container mx-auto px-4 py-16">
          
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 text-sm font-medium">Lower Cost • Higher Sovereignty</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Truth Infrastructure
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                Built for Sovereignty
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              Replace expensive legacy platforms with sovereign truth infrastructure. 
              Pay less, own more, control everything.
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center bg-slate-800/50 border border-slate-700 rounded-xl p-1 mb-12">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-purple-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all relative ${
                  billingCycle === 'yearly'
                    ? 'bg-purple-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Yearly
                <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs">
                  Save 17%
                </Badge>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {pricingPlans.map((plan) => {
              const PlanIcon = plan.icon;
              const price = billingCycle === 'yearly' ? plan.yearlyPrice : plan.price;
              const monthlyPrice = billingCycle === 'yearly' ? Math.round(plan.yearlyPrice / 12) : plan.price;
              
              return (
                <Card
                  key={plan.tier}
                  className={`relative border-2 transition-all hover:scale-105 ${
                    plan.popular
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-slate-700 bg-slate-800/50'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-purple-500 text-white px-3 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <PlanIcon className="w-6 h-6 text-white" />
                    </div>
                    
                    <CardTitle className="text-white text-xl mb-2">
                      {plan.name}
                    </CardTitle>
                    
                    <div className="text-3xl font-bold text-white mb-2">
                      ${monthlyPrice}
                      <span className="text-lg text-slate-400">/mo</span>
                    </div>
                    
                    {billingCycle === 'yearly' && plan.price > 0 && (
                      <p className="text-sm text-green-400">
                        Save ${(plan.price * 12) - plan.yearlyPrice}/year
                      </p>
                    )}
                    
                    <p className="text-slate-400 text-sm mt-2">
                      {plan.description}
                    </p>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      {plan.features.map((feature) => (
                        <div key={feature} className="flex items-start gap-3">
                          <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-300 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t border-slate-700 pt-4">
                      <p className="text-xs text-slate-500 mb-3">{plan.limits}</p>
                      <p className="text-xs text-cyan-400 mb-4">{plan.comparison}</p>
                    </div>
                    
                    <Button
                      onClick={() => handleSubscribe(plan.tier)}
                      className={`w-full ${
                        plan.popular
                          ? 'bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600'
                          : 'bg-slate-700 hover:bg-slate-600'
                      }`}
                    >
                      {plan.cta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Comparison Section */}
          <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-8 mb-16">
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              Why Choose Sovereign Infrastructure?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🏢</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Legacy Platforms</h3>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• Censorship risk</li>
                  <li>• Data harvesting</li>
                  <li>• Platform dependency</li>
                  <li>• Hidden costs</li>
                  <li>• No true ownership</li>
                </ul>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-purple-500/20 border border-purple-500/30 rounded-xl flex items-center justify-center">
                  <Shield className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">GuardianChain</h3>
                <ul className="text-sm text-green-400 space-y-1">
                  <li>• Censorship resistant</li>
                  <li>• You own your data</li>
                  <li>• Sovereign infrastructure</li>
                  <li>• Transparent pricing</li>
                  <li>• Blockchain verified</li>
                </ul>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Cost Savings</h3>
                <ul className="text-sm text-cyan-400 space-y-1">
                  <li>• 70% less than AWS stack</li>
                  <li>• No hidden platform fees</li>
                  <li>• Earn GTT yield rewards</li>
                  <li>• One bill, all features</li>
                  <li>• No vendor lock-in</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Developer API Section */}
          <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 rounded-2xl p-8 mb-16">
            <h2 className="text-2xl font-bold text-white text-center mb-6">
              Developer API Access
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-purple-300 mb-4">API Features</h3>
                <ul className="space-y-2 text-slate-300">
                  <li>• RESTful endpoints for all capsule operations</li>
                  <li>• WebSocket real-time Truth Net updates</li>
                  <li>• Blockchain integration APIs</li>
                  <li>• AI analysis and scoring endpoints</li>
                  <li>• NFT minting and marketplace APIs</li>
                  <li>• White-label deployment tools</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-cyan-300 mb-4">Usage Tracking</h3>
                <ul className="space-y-2 text-slate-300">
                  <li>• Real-time usage analytics</li>
                  <li>• Cost-effective rate limiting</li>
                  <li>• Automatic scaling</li>
                  <li>• Detailed billing breakdown</li>
                  <li>• Custom integration support</li>
                  <li>• Enterprise SLA options</li>
                </ul>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <Link href="/docs/api">
                <Button className="bg-purple-500 hover:bg-purple-600">
                  View API Documentation
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="text-center mb-16">
            <h2 className="text-2xl font-bold text-white mb-8">
              Frequently Asked Questions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-4xl mx-auto">
              <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Can I change plans anytime?
                </h3>
                <p className="text-slate-300 text-sm">
                  Yes, upgrade or downgrade your plan at any time. Changes take effect immediately with prorated billing.
                </p>
              </div>
              
              <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  What happens to my data if I cancel?
                </h3>
                <p className="text-slate-300 text-sm">
                  Your capsules remain on the blockchain forever. You can always re-subscribe to access advanced features.
                </p>
              </div>
              
              <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Do you offer enterprise discounts?
                </h3>
                <p className="text-slate-300 text-sm">
                  Yes, contact us for volume discounts and custom enterprise solutions with dedicated infrastructure.
                </p>
              </div>
              
              <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Is there a free trial?
                </h3>
                <p className="text-slate-300 text-sm">
                  The Explorer plan is free forever. Paid plans include a 14-day free trial with full feature access.
                </p>
              </div>
            </div>
          </div>

          {/* Legal Disclaimer */}
          <DisclaimerBlock />
        </div>
        
        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}