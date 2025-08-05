import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useEnhancedAuth } from "@/hooks/useEnhancedAuth";
import {
  Crown,
  Star,
  Zap,
  User,
  Check,
  ArrowRight,
  Sparkles,
  Shield,
  Infinity,
  Clock,
  CreditCard,
  TrendingUp,
} from "lucide-react";

interface SubscriptionPlan {
  tier: string;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  limits: {
    capsulesLimit: number;
    apiCallsPerMonth: number;
    storageLimit: number;
  };
}

export default function EnhancedSubscriptionManager() {
  const { user, refetch } = useEnhancedAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  // Fetch subscription plans
  const { data: plans, isLoading: plansLoading } = useQuery({
    queryKey: ["/api/subscription/plans"],
    queryFn: async (): Promise<{ plans: SubscriptionPlan[] }> => {
      const response = await fetch("/api/subscription/plans");
      if (!response.ok) throw new Error("Failed to fetch subscription plans");
      return response.json();
    },
  });

  // Create subscription mutation
  const createSubscriptionMutation = useMutation({
    mutationFn: async ({ planTier, cycle }: { planTier: string; cycle: string }) => {
      const response = await fetch("/api/subscription/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planTier, billingCycle: cycle }),
      });
      if (!response.ok) throw new Error("Failed to create subscription");
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Subscription Created",
        description: "Redirecting to checkout...",
      });
      
      // Simulate Stripe checkout redirect
      if (data.checkoutUrl) {
        window.open(data.checkoutUrl, "_blank");
      }
      
      // Refresh user data after a delay to simulate successful payment
      setTimeout(() => {
        refetch();
        queryClient.invalidateQueries({ queryKey: ["/api/subscription/plans"] });
      }, 3000);
    },
    onError: (error: any) => {
      toast({
        title: "Subscription Failed",
        description: error.message || "Failed to create subscription",
        variant: "destructive",
      });
    },
  });

  // Update subscription mutation
  const updateSubscriptionMutation = useMutation({
    mutationFn: async ({ newPlanTier, cycle }: { newPlanTier: string; cycle: string }) => {
      const response = await fetch("/api/subscription/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPlanTier, billingCycle: cycle }),
      });
      if (!response.ok) throw new Error("Failed to update subscription");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Subscription Updated",
        description: "Your plan has been updated successfully.",
      });
      refetch();
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update subscription",
        variant: "destructive",
      });
    },
  });

  if (plansLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-700 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-96 bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const planIcons = {
    EXPLORER: <User className="w-6 h-6" />,
    SEEKER: <Zap className="w-6 h-6" />,
    CREATOR: <Star className="w-6 h-6" />,
    SOVEREIGN: <Crown className="w-6 h-6" />,
  };

  const tierColors = {
    EXPLORER: "from-slate-500 to-slate-600",
    SEEKER: "from-cyan-500 to-blue-500",
    CREATOR: "from-purple-500 to-pink-500",
    SOVEREIGN: "from-yellow-500 to-orange-500",
  };

  const isCurrentPlan = (planTier: string) => user?.tier === planTier;
  const canUpgradeTo = (planTier: string) => {
    const tierOrder = ["EXPLORER", "SEEKER", "CREATOR", "SOVEREIGN"];
    const currentIndex = tierOrder.indexOf(user?.tier || "EXPLORER");
    const targetIndex = tierOrder.indexOf(planTier);
    return targetIndex > currentIndex;
  };

  const canDowngradeTo = (planTier: string) => {
    const tierOrder = ["EXPLORER", "SEEKER", "CREATOR", "SOVEREIGN"];
    const currentIndex = tierOrder.indexOf(user?.tier || "EXPLORER");
    const targetIndex = tierOrder.indexOf(planTier);
    return targetIndex < currentIndex;
  };

  const handlePlanSelection = async (planTier: string) => {
    if (isCurrentPlan(planTier)) return;

    setSelectedPlan(planTier);

    if (user?.tier === "EXPLORER" && planTier !== "EXPLORER") {
      // New subscription
      await createSubscriptionMutation.mutateAsync({
        planTier,
        cycle: billingCycle,
      });
    } else if (user?.subscriptionStatus === "active") {
      // Upgrade/downgrade existing subscription
      await updateSubscriptionMutation.mutateAsync({
        newPlanTier: planTier,
        cycle: billingCycle,
      });
    }
  };

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === -1) return 0; // Unlimited
    return Math.min((used / limit) * 100, 100);
  };

  const formatLimit = (limit: number) => {
    if (limit === -1) return "Unlimited";
    if (limit >= 1000) return `${(limit / 1000).toFixed(0)}K`;
    return limit.toString();
  };

  return (
    <div className="space-y-8">
      {/* Current Usage Status */}
      {user && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              Current Usage & Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Capsules Created</span>
                  <span className="text-white font-medium">
                    {user.usage.capsulesCreated} / {formatLimit(user.usage.capsulesLimit)}
                  </span>
                </div>
                <Progress 
                  value={getUsagePercentage(user.usage.capsulesCreated, user.usage.capsulesLimit)} 
                  className="h-2"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">GTT Earned</span>
                  <span className="text-white font-medium">{user.usage.gttEarned.toFixed(2)}</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full w-1/3"></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Truth Score</span>
                  <span className="text-white font-medium">{user.usage.truthScore}/100</span>
                </div>
                <Progress value={user.usage.truthScore} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Billing Cycle Toggle */}
      <div className="flex justify-center">
        <div className="bg-slate-800/50 p-1 rounded-lg border border-slate-700">
          <div className="flex">
            <Button
              variant={billingCycle === "monthly" ? "default" : "ghost"}
              onClick={() => setBillingCycle("monthly")}
              className="rounded-md"
            >
              Monthly
            </Button>
            <Button
              variant={billingCycle === "yearly" ? "default" : "ghost"}
              onClick={() => setBillingCycle("yearly")}
              className="rounded-md"
            >
              Yearly
              <Badge className="ml-2 bg-green-500/20 text-green-300 border-green-500/50">
                Save 17%
              </Badge>
            </Button>
          </div>
        </div>
      </div>

      {/* Subscription Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans?.plans.map((plan) => {
          const isSelected = selectedPlan === plan.tier;
          const isCurrent = isCurrentPlan(plan.tier);
          const isProcessing = createSubscriptionMutation.isPending || updateSubscriptionMutation.isPending;
          
          return (
            <Card
              key={plan.tier}
              className={`relative overflow-hidden transition-all duration-300 ${
                isCurrent
                  ? "bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-cyan-500/50"
                  : isSelected
                  ? "bg-slate-800/70 border-slate-500 scale-105"
                  : "bg-slate-800/50 border-slate-700 hover:border-slate-600 hover:scale-105"
              }`}
            >
              {isCurrent && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-center py-1 text-xs font-medium">
                  Current Plan
                </div>
              )}
              
              <CardHeader className={isCurrent ? "pt-8" : ""}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${tierColors[plan.tier as keyof typeof tierColors]}`}>
                    {planIcons[plan.tier as keyof typeof planIcons]}
                  </div>
                  <div>
                    <CardTitle className="text-white">{plan.name}</CardTitle>
                    <Badge variant="outline" className="border-slate-600 text-slate-300">
                      {plan.tier}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-white">
                      ${billingCycle === "monthly" ? plan.priceMonthly : plan.priceYearly}
                    </span>
                    <span className="text-slate-400">
                      /{billingCycle === "monthly" ? "month" : "year"}
                    </span>
                  </div>
                  {billingCycle === "yearly" && plan.priceYearly < plan.priceMonthly * 12 && (
                    <div className="text-green-400 text-sm">
                      Save ${plan.priceMonthly * 12 - plan.priceYearly}/year
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Features */}
                <div className="space-y-2">
                  <h4 className="text-white font-medium">Features</h4>
                  <div className="space-y-1">
                    {plan.features.slice(0, 4).map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Check className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                        <span className="text-slate-300">{feature}</span>
                      </div>
                    ))}
                    {plan.features.length > 4 && (
                      <div className="text-xs text-slate-400">
                        +{plan.features.length - 4} more features
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Limits */}
                <div className="space-y-2">
                  <h4 className="text-white font-medium">Limits</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Capsules</span>
                      <span className="text-slate-300">{formatLimit(plan.limits.capsulesLimit)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">API Calls</span>
                      <span className="text-slate-300">{formatLimit(plan.limits.apiCallsPerMonth)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Storage</span>
                      <span className="text-slate-300">{formatLimit(plan.limits.storageLimit)}MB</span>
                    </div>
                  </div>
                </div>
                
                {/* Action Button */}
                <Button
                  onClick={() => handlePlanSelection(plan.tier)}
                  disabled={isCurrent || isProcessing}
                  className={`w-full ${
                    isCurrent
                      ? "bg-slate-600 cursor-not-allowed"
                      : canUpgradeTo(plan.tier)
                      ? "bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                      : canDowngradeTo(plan.tier)
                      ? "bg-slate-600 hover:bg-slate-700"
                      : "bg-cyan-500 hover:bg-cyan-600"
                  } text-white`}
                >
                  {isProcessing && isSelected ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : isCurrent ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Current Plan
                    </>
                  ) : canUpgradeTo(plan.tier) ? (
                    <>
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Upgrade
                    </>
                  ) : canDowngradeTo(plan.tier) ? (
                    <>
                      <ArrowRight className="w-4 h-4 mr-2 transform rotate-180" />
                      Downgrade
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Get Started
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Payment Security Notice */}
      <Card className="bg-slate-800/30 border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 text-center">
            <Shield className="w-5 h-5 text-green-400" />
            <div className="text-sm text-slate-300">
              Secure payment processing powered by Stripe. Your payment information is encrypted and never stored on our servers.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}