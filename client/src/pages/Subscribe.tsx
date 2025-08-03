import React, { useState, useEffect } from "react";
import { useParams } from "wouter";
import { Helmet } from "react-helmet-async";
import { loadStripe } from "@stripe/stripe-js";
import { Shield, Zap, Star, Crown, ArrowLeft, Check, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

const planConfigs = {
  seeker: {
    name: "Seeker",
    icon: Zap,
    priceMonthly: 9,
    priceYearly: 90,
    description: "AI-powered truth analysis and verification",
    features: [
      "50 Truth Capsules per month",
      "AI Truth Genome analysis", 
      "Emotional resonance scoring",
      "Basic API access (1K calls/mo)",
      "Advanced encryption",
      "Email support",
      "Truth lineage tracking"
    ]
  },
  creator: {
    name: "Creator", 
    icon: Star,
    priceMonthly: 29,
    priceYearly: 290,
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
    ]
  },
  sovereign: {
    name: "Sovereign",
    icon: Crown, 
    priceMonthly: 99,
    priceYearly: 990,
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
    ]
  }
};

export default function Subscribe() {
  const params = useParams();
  const planKey = params.tier as keyof typeof planConfigs;
  const plan = planConfigs[planKey];
  
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!plan) {
      window.location.href = '/pricing';
    }
  }, [plan]);

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      window.location.href = '/auth/login';
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiRequest('POST', '/api/subscription/create-checkout', {
        planTier: planKey.toUpperCase(),
        billingCycle,
        successUrl: `${window.location.origin}/dashboard?subscription=success`,
        cancelUrl: `${window.location.origin}/pricing`
      });

      const { url } = response;
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received');
      }

    } catch (err: any) {
      console.error('Subscription error:', err);
      setError(err.message || 'Failed to create subscription. Please try again.');
      toast({
        title: "Subscription Error",
        description: "Failed to start subscription process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!plan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Plan Not Found</h1>
          <Link href="/pricing">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Pricing
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const PlanIcon = plan.icon;
  const price = billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly;
  const monthlyPrice = billingCycle === 'yearly' ? Math.round(plan.priceYearly / 12) : plan.priceMonthly;
  const savings = billingCycle === 'yearly' ? (plan.priceMonthly * 12) - plan.priceYearly : 0;

  return (
    <>
      <Helmet>
        <title>Subscribe to {plan.name} - GuardianChain</title>
        <meta name="description" content={`Subscribe to GuardianChain ${plan.name} plan - ${plan.description}`} />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        <div className="container mx-auto px-4 py-16">
          
          {/* Back Button */}
          <div className="mb-8">
            <Link href="/pricing">
              <Button variant="ghost" className="text-slate-400 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Pricing
              </Button>
            </Link>
          </div>

          <div className="max-w-2xl mx-auto">
            
            {/* Header */}
            <div className="text-center mb-12">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                <PlanIcon className="w-10 h-10 text-white" />
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-4">
                Subscribe to {plan.name}
              </h1>
              
              <p className="text-slate-300 text-lg mb-6">
                {plan.description}
              </p>

              {/* Billing Toggle */}
              <div className="inline-flex items-center bg-slate-800/50 border border-slate-700 rounded-xl p-1 mb-8">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    billingCycle === 'monthly'
                      ? 'bg-purple-500 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all relative ${
                    billingCycle === 'yearly'
                      ? 'bg-purple-500 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Yearly
                  {savings > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs">
                      Save ${savings}
                    </Badge>
                  )}
                </button>
              </div>
            </div>

            {/* Subscription Card */}
            <Card className="border-2 border-purple-500 bg-slate-800/50 mb-8">
              <CardHeader className="text-center">
                <div className="text-4xl font-bold text-white mb-2">
                  ${monthlyPrice}
                  <span className="text-lg text-slate-400">/month</span>
                </div>
                
                {billingCycle === 'yearly' && savings > 0 && (
                  <p className="text-green-400">
                    Save ${savings} per year
                  </p>
                )}
                
                {billingCycle === 'yearly' && (
                  <p className="text-sm text-slate-400">
                    Billed annually (${price})
                  </p>
                )}
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>

                {error && (
                  <Alert className="border-red-500/20 bg-red-500/10">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <AlertDescription className="text-red-300">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={handleSubscribe}
                  disabled={isLoading || !isAuthenticated}
                  className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold py-3"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Processing...
                    </>
                  ) : !isAuthenticated ? (
                    'Sign In to Subscribe'
                  ) : (
                    `Subscribe to ${plan.name}`
                  )}
                </Button>

                {!isAuthenticated && (
                  <p className="text-center text-sm text-slate-400">
                    <Link href="/auth/login" className="text-purple-400 hover:text-purple-300">
                      Sign in
                    </Link>
                    {' '}or{' '}
                    <Link href="/auth/register" className="text-purple-400 hover:text-purple-300">
                      create an account
                    </Link>
                    {' '}to continue
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-sm text-slate-400">
              <div>
                <Shield className="w-6 h-6 mx-auto mb-2 text-green-400" />
                <p>Secure Payment</p>
                <p>Powered by Stripe</p>
              </div>
              <div>
                <Check className="w-6 h-6 mx-auto mb-2 text-green-400" />
                <p>Cancel Anytime</p>
                <p>No long-term contracts</p>
              </div>
              <div>
                <Star className="w-6 h-6 mx-auto mb-2 text-green-400" />
                <p>14-Day Free Trial</p>
                <p>Full feature access</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}