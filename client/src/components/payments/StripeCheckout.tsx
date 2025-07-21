import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
// Mock useAuth hook since auth system isn't configured
const useAuth = () => ({
  user: {
    id: 'demo-user',
    email: 'demo@guardianchain.org',
    userTier: 'EXPLORER',
    gttBalance: '1,250',
    reputation: '847',
    totalCapsules: '23'
  },
  isAuthenticated: true
});
import { apiRequest } from "@/lib/queryClient";
import { 
  Crown, 
  Zap, 
  Shield, 
  Rocket,
  CheckCircle,
  CreditCard
} from "lucide-react";

interface TierFeatures {
  name: string;
  price: number;
  description: string;
  features: string[];
  icon: React.ReactNode;
  color: string;
  popular?: boolean;
}

const TIER_DATA: Record<string, TierFeatures> = {
  SEEKER: {
    name: "Seeker",
    price: 29.99,
    description: "Enhanced verification and priority support",
    features: [
      "25 capsules per month",
      "Priority verification",
      "Advanced analytics",
      "Community badges",
      "Email support"
    ],
    icon: <Zap className="h-6 w-6" />,
    color: "from-blue-600 to-purple-600"
  },
  CREATOR: {
    name: "Creator", 
    price: 99.99,
    description: "Full creation suite with revenue sharing",
    features: [
      "100 capsules per month",
      "Premium features",
      "Revenue sharing (25%)",
      "Custom branding",
      "Priority support",
      "API access"
    ],
    icon: <Shield className="h-6 w-6" />,
    color: "from-purple-600 to-green-600",
    popular: true
  },
  SOVEREIGN: {
    name: "Sovereign",
    price: 299.99,
    description: "Ultimate access with governance rights",
    features: [
      "Unlimited capsules",
      "Full platform access",
      "Governance voting",
      "Revenue sharing (50%)",
      "White-label options",
      "Dedicated support",
      "Custom integrations"
    ],
    icon: <Crown className="h-6 w-6" />,
    color: "from-green-600 to-yellow-600"
  }
};

export default function StripeCheckout() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscription = async (tier: string) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to upgrade your tier",
        variant: "destructive"
      });
      return;
    }

    setLoading(tier);

    try {
      const response = await apiRequest('POST', '/api/stripe/create-subscription', {
        userId: user.id,
        tier,
        email: user.email
      });

      if (response.clientSecret) {
        // Redirect to Stripe Checkout
        const stripe = (window as any).Stripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
        
        const { error } = await stripe.confirmCardPayment(response.clientSecret);
        
        if (error) {
          toast({
            title: "Payment Failed",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Upgrade Successful!",
            description: `Welcome to ${tier} tier! Your benefits are now active.`,
          });
        }
      }
    } catch (error: any) {
      toast({
        title: "Upgrade Failed",
        description: error.message || "Failed to process upgrade",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <Card className="max-w-md mx-auto bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Login Required</CardTitle>
            <CardDescription>Please log in to view tier upgrades</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href="/login">Login to Continue</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Upgrade Your Tier</h1>
        <p className="text-slate-300 max-w-2xl mx-auto">
          Unlock more features and earning potential with GUARDIANCHAIN premium tiers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {Object.entries(TIER_DATA).map(([tierKey, tier]) => (
          <Card 
            key={tierKey} 
            className={`relative bg-slate-800/50 border-slate-700 ${
              tier.popular ? 'ring-2 ring-purple-500' : ''
            }`}
          >
            {tier.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white">
                Most Popular
              </Badge>
            )}
            
            <CardHeader className="text-center">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${tier.color} flex items-center justify-center text-white`}>
                {tier.icon}
              </div>
              <CardTitle className="text-2xl text-white">{tier.name}</CardTitle>
              <CardDescription className="text-slate-300">{tier.description}</CardDescription>
              <div className="text-3xl font-bold text-white mt-4">
                ${tier.price}<span className="text-lg text-slate-400">/month</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-slate-300">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-3" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSubscription(tierKey)}
                disabled={loading === tierKey || user.userTier === tierKey}
                className={`w-full bg-gradient-to-r ${tier.color} hover:opacity-90 text-white`}
              >
                {loading === tierKey ? (
                  "Processing..."
                ) : user.userTier === tierKey ? (
                  "Current Tier"
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Upgrade to {tier.name}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Card className="max-w-2xl mx-auto bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Current Tier: {user.userTier}</CardTitle>
            <CardDescription>
              Manage your subscription and billing settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">GTT Balance:</span>
              <span className="text-green-400 font-semibold">{user.gttBalance} GTT</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Reputation:</span>
              <span className="text-purple-400 font-semibold">{user.reputation}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Capsules Created:</span>
              <span className="text-blue-400 font-semibold">{user.totalCapsules}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}