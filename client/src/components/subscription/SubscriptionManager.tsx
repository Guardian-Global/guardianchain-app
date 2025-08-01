import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest, getQueryFn } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Crown, 
  Shield, 
  Star, 
  Zap, 
  CheckCircle, 
  Clock,
  CreditCard,
  TrendingUp
} from "lucide-react";

interface SubscriptionPlan {
  id: string;
  name: string;
  tier: string;
  price: number;
  features: string[];
  icon: any;
  color: string;
  popular?: boolean;
}

const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "explorer",
    name: "Explorer",
    tier: "EXPLORER",
    price: 0,
    features: [
      "Basic truth verification",
      "5 capsules per month",
      "Community access",
      "Basic analytics"
    ],
    icon: Shield,
    color: "text-blue-400"
  },
  {
    id: "seeker",
    name: "Seeker",
    tier: "SEEKER",
    price: 9.99,
    features: [
      "Advanced verification tools",
      "25 capsules per month",
      "Priority support",
      "Enhanced analytics",
      "Jury participation"
    ],
    icon: Star,
    color: "text-purple-400",
    popular: true
  },
  {
    id: "creator",
    name: "Creator",
    tier: "CREATOR",
    price: 29.99,
    features: [
      "Professional verification suite",
      "Unlimited capsules",
      "API access",
      "Custom branding",
      "Advanced reporting",
      "Truth bounty creation"
    ],
    icon: Zap,
    color: "text-green-400"
  },
  {
    id: "sovereign",
    name: "Sovereign",
    tier: "SOVEREIGN",
    price: 99.99,
    features: [
      "Enterprise-grade tools",
      "White-label solutions",
      "Dedicated support",
      "Custom integrations",
      "Governance voting rights",
      "Revenue sharing"
    ],
    icon: Crown,
    color: "text-yellow-400"
  }
];

export function SubscriptionManager() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const { data: subscription, isLoading } = useQuery({
    queryKey: ["/api/subscription/status"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!user
  });

  const upgradeMutation = useMutation({
    mutationFn: async (planId: string) => {
      const response = await apiRequest("POST", "/api/subscription/upgrade", { planId });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        console.log("Subscription updated successfully");
        queryClient.invalidateQueries({ queryKey: ["/api/subscription/status"] });
      }
    },
    onError: (error: any) => {
      console.error("Upgrade failed:", error.message || "Failed to upgrade subscription");
    }
  });

  const cancelMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/subscription/cancel");
      return response.json();
    },
    onSuccess: () => {
      console.log("Subscription cancelled successfully");
      queryClient.invalidateQueries({ queryKey: ["/api/subscription/status"] });
    },
    onError: (error: any) => {
      console.error("Cancellation failed:", error.message || "Failed to cancel subscription");
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const currentTier = user?.tier || 'EXPLORER';
  const currentPlan = SUBSCRIPTION_PLANS.find(plan => plan.tier === currentTier);

  return (
    <div className="space-y-8">
      {/* Current Subscription Status */}
      {subscription && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Current Subscription
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {currentPlan && <currentPlan.icon className={`h-6 w-6 ${currentPlan.color}`} />}
                <div>
                  <p className="font-semibold">{currentPlan?.name || currentTier}</p>
                  <p className="text-sm text-gray-400">
                    {subscription.status === 'active' ? 'Active' : subscription.status}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">${currentPlan?.price || 0}/month</p>
                {subscription.nextBillingDate && (
                  <p className="text-sm text-gray-400">
                    Next billing: {new Date(subscription.nextBillingDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            {subscription.usage && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Capsules Used</span>
                  <span>{subscription.usage.capsules}/{subscription.usage.capsulesLimit}</span>
                </div>
                <Progress 
                  value={(subscription.usage.capsules / subscription.usage.capsulesLimit) * 100} 
                  className="h-2" 
                />
              </div>
            )}

            {subscription.status === 'active' && currentTier !== 'EXPLORER' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => cancelMutation.mutate()}
                disabled={cancelMutation.isPending}
              >
                {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Subscription'}
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Subscription Plans */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const Icon = plan.icon;
          const isCurrentPlan = plan.tier === currentTier;
          const isUpgrade = SUBSCRIPTION_PLANS.findIndex(p => p.tier === currentTier) < 
                           SUBSCRIPTION_PLANS.findIndex(p => p.tier === plan.tier);

          return (
            <Card 
              key={plan.id}
              className={`relative bg-slate-800/50 border-slate-700 ${
                plan.popular ? 'ring-2 ring-purple-500' : ''
              } ${isCurrentPlan ? 'ring-2 ring-green-500' : ''}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-purple-600">
                  Most Popular
                </Badge>
              )}
              {isCurrentPlan && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-green-600">
                  Current Plan
                </Badge>
              )}

              <CardHeader className="text-center">
                <Icon className={`h-12 w-12 mx-auto mb-4 ${plan.color}`} />
                <CardTitle>{plan.name}</CardTitle>
                <div className="space-y-1">
                  <p className="text-3xl font-bold">
                    ${plan.price}
                    <span className="text-sm font-normal text-gray-400">/month</span>
                  </p>
                  <CardDescription>{plan.tier} Tier</CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button 
                  className="w-full" 
                  variant={isCurrentPlan ? "secondary" : "default"}
                  disabled={isCurrentPlan || upgradeMutation.isPending}
                  onClick={() => {
                    if (!isCurrentPlan && isUpgrade) {
                      upgradeMutation.mutate(plan.id);
                    }
                  }}
                >
                  {isCurrentPlan ? (
                    "Current Plan"
                  ) : upgradeMutation.isPending && selectedPlan === plan.id ? (
                    "Upgrading..."
                  ) : isUpgrade ? (
                    "Upgrade"
                  ) : (
                    "Downgrade"
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tier Benefits Comparison */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Tier Benefits Overview
          </CardTitle>
          <CardDescription>
            Unlock more features as you progress through the tiers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-2">Feature</th>
                  {SUBSCRIPTION_PLANS.map(plan => (
                    <th key={plan.id} className="text-center py-2">{plan.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="space-y-2">
                <tr className="border-b border-slate-700/50">
                  <td className="py-2">Monthly Capsules</td>
                  <td className="text-center py-2">5</td>
                  <td className="text-center py-2">25</td>
                  <td className="text-center py-2">Unlimited</td>
                  <td className="text-center py-2">Unlimited</td>
                </tr>
                <tr className="border-b border-slate-700/50">
                  <td className="py-2">API Access</td>
                  <td className="text-center py-2">❌</td>
                  <td className="text-center py-2">❌</td>
                  <td className="text-center py-2">✅</td>
                  <td className="text-center py-2">✅</td>
                </tr>
                <tr className="border-b border-slate-700/50">
                  <td className="py-2">Governance Voting</td>
                  <td className="text-center py-2">❌</td>
                  <td className="text-center py-2">Limited</td>
                  <td className="text-center py-2">✅</td>
                  <td className="text-center py-2">Full Rights</td>
                </tr>
                <tr className="border-b border-slate-700/50">
                  <td className="py-2">Revenue Sharing</td>
                  <td className="text-center py-2">❌</td>
                  <td className="text-center py-2">❌</td>
                  <td className="text-center py-2">❌</td>
                  <td className="text-center py-2">✅</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}