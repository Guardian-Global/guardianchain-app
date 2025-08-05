import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useEnhancedAuth } from "@/hooks/useEnhancedAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Crown,
  Star,
  Check,
  Zap,
  Shield,
  Users,
  BarChart,
  Upload,
  CreditCard,
  Calendar,
  TrendingUp,
  Lock,
  Unlock,
} from "lucide-react";

interface SubscriptionPlan {
  tier: string;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
}

export default function SubscriptionManager() {
  const { user, hasActiveSubscription } = useEnhancedAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  // Get subscription plans
  const { data: plans, isLoading: plansLoading } = useQuery({
    queryKey: ["/api/subscription/plans"],
    queryFn: async (): Promise<SubscriptionPlan[]> => {
      const response = await fetch("/api/subscription/plans");
      if (!response.ok) throw new Error("Failed to fetch plans");
      return response.json();
    },
  });

  // Create subscription mutation
  const createSubscriptionMutation = useMutation({
    mutationFn: async ({ tier, cycle }: { tier: string; cycle: "monthly" | "yearly" }) => {
      return apiRequest("POST", "/api/subscription/create", {
        planTier: tier,
        billingCycle: cycle,
        successUrl: `${window.location.origin}/subscription/success`,
        cancelUrl: `${window.location.origin}/subscription/cancel`,
      });
    },
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        toast({
          title: "Subscription Created",
          description: "Your subscription has been activated successfully.",
        });
        queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Subscription Failed",
        description: error.message || "Failed to create subscription.",
        variant: "destructive",
      });
    },
  });

  // Update subscription mutation
  const updateSubscriptionMutation = useMutation({
    mutationFn: async ({ tier, cycle }: { tier: string; cycle?: "monthly" | "yearly" }) => {
      return apiRequest("PATCH", "/api/subscription/update", {
        newPlanTier: tier,
        billingCycle: cycle,
      });
    },
    onSuccess: () => {
      toast({
        title: "Subscription Updated",
        description: "Your subscription has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update subscription.",
        variant: "destructive",
      });
    },
  });

  // Cancel subscription mutation
  const cancelSubscriptionMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/subscription/cancel");
    },
    onSuccess: () => {
      toast({
        title: "Subscription Cancelled",
        description: "Your subscription will be cancelled at the end of the billing period.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: (error: any) => {
      toast({
        title: "Cancellation Failed",
        description: error.message || "Failed to cancel subscription.",
        variant: "destructive",
      });
    },
  });

  const handlePlanSelect = (tier: string) => {
    if (tier === "EXPLORER") {
      // Free plan - update directly
      updateSubscriptionMutation.mutate({ tier });
    } else {
      // Paid plan - create subscription
      createSubscriptionMutation.mutate({ tier, cycle: billingCycle });
    }
  };

  const getPlanIcon = (tier: string) => {
    switch (tier) {
      case "EXPLORER":
        return <Shield className="w-8 h-8 text-slate-400" />;
      case "SEEKER":
        return <Star className="w-8 h-8 text-blue-400" />;
      case "CREATOR":
        return <Zap className="w-8 h-8 text-purple-400" />;
      case "SOVEREIGN":
        return <Crown className="w-8 h-8 text-yellow-400" />;
      default:
        return <Shield className="w-8 h-8 text-slate-400" />;
    }
  };

  const getPlanColor = (tier: string) => {
    switch (tier) {
      case "EXPLORER":
        return "border-slate-600 bg-slate-800/50";
      case "SEEKER":
        return "border-blue-500 bg-blue-500/10";
      case "CREATOR":
        return "border-purple-500 bg-purple-500/10";
      case "SOVEREIGN":
        return "border-yellow-500 bg-yellow-500/10";
      default:
        return "border-slate-600 bg-slate-800/50";
    }
  };

  const isCurrentPlan = (tier: string) => {
    return user?.tier === tier;
  };

  const getPrice = (plan: SubscriptionPlan) => {
    const price = billingCycle === "monthly" ? plan.priceMonthly : plan.priceYearly;
    const period = billingCycle === "monthly" ? "month" : "year";
    
    if (price === 0) return "Free";
    
    const savings = billingCycle === "yearly" ? Math.round(((plan.priceMonthly * 12) - plan.priceYearly) / (plan.priceMonthly * 12) * 100) : 0;
    
    return (
      <div className="text-center">
        <div className="text-2xl font-bold text-cyan-400">
          ${price.toLocaleString()}/{period}
        </div>
        {savings > 0 && (
          <div className="text-sm text-green-400">
            Save {savings}% yearly
          </div>
        )}
      </div>
    );
  };

  if (plansLoading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-700 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-64 bg-slate-700 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Subscription Status */}
      {user?.subscription && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Current Subscription
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300">
                    {user.subscription.plan}
                  </Badge>
                  <span className="text-slate-300">
                    {user.subscription.billingCycle}
                  </span>
                </div>
                <p className="text-sm text-slate-400 mt-1">
                  Next billing: {new Date(user.subscription.nextBillingDate).toLocaleDateString()}
                </p>
              </div>
              
              <div className="flex gap-2">
                {user.subscription.canUpgrade && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Upgrade
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-800 border-slate-700 max-w-4xl">
                      <DialogHeader>
                        <DialogTitle className="text-white">Upgrade Your Plan</DialogTitle>
                        <DialogDescription className="text-slate-300">
                          Choose a higher tier to unlock more features and increase your limits.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        {plans?.filter(plan => plan.tier !== user.tier && plan.tier !== "EXPLORER").map((plan) => (
                          <Card key={plan.tier} className={`${getPlanColor(plan.tier)} border-2 cursor-pointer hover:scale-105 transition-transform`}>
                            <CardHeader className="text-center">
                              {getPlanIcon(plan.tier)}
                              <CardTitle className="text-white">{plan.name}</CardTitle>
                              {getPrice(plan)}
                            </CardHeader>
                            <CardContent>
                              <Button 
                                onClick={() => handlePlanSelect(plan.tier)}
                                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
                                disabled={createSubscriptionMutation.isPending}
                              >
                                Upgrade to {plan.name}
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="border-red-600 text-red-400 hover:bg-red-600/10">
                      Cancel
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-800 border-slate-700">
                    <DialogHeader>
                      <DialogTitle className="text-white">Cancel Subscription</DialogTitle>
                      <DialogDescription className="text-slate-300">
                        Are you sure you want to cancel your subscription? You'll continue to have access until the end of your billing period.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex gap-2 mt-4">
                      <Button
                        onClick={() => cancelSubscriptionMutation.mutate()}
                        variant="destructive"
                        disabled={cancelSubscriptionMutation.isPending}
                      >
                        Yes, Cancel Subscription
                      </Button>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="border-slate-600 text-slate-300">
                          Keep Subscription
                        </Button>
                      </DialogTrigger>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Usage Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-700">
              <div className="text-center">
                <div className="text-lg font-bold text-cyan-400">{user.usage.capsulesCreated}</div>
                <div className="text-sm text-slate-400">Capsules Created</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-400">{user.usage.gttEarned.toLocaleString()}</div>
                <div className="text-sm text-slate-400">GTT Earned</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-400">{user.usage.truthScore}</div>
                <div className="text-sm text-slate-400">Truth Score</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-yellow-400">{user.usage.verificationCount}</div>
                <div className="text-sm text-slate-400">Verifications</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Billing Cycle Toggle */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Choose Your Guardian Tier</CardTitle>
          <CardDescription className="text-slate-300">
            Select the plan that best fits your truth preservation needs
          </CardDescription>
          
          <div className="flex items-center gap-4 pt-4">
            <span className="text-slate-300">Billing Cycle:</span>
            <div className="flex gap-2">
              <Button
                variant={billingCycle === "monthly" ? "default" : "outline"}
                size="sm"
                onClick={() => setBillingCycle("monthly")}
                className={billingCycle === "monthly" ? "bg-cyan-500 text-white" : "border-slate-600 text-slate-300"}
              >
                Monthly
              </Button>
              <Button
                variant={billingCycle === "yearly" ? "default" : "outline"}
                size="sm"
                onClick={() => setBillingCycle("yearly")}
                className={billingCycle === "yearly" ? "bg-cyan-500 text-white" : "border-slate-600 text-slate-300"}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Yearly <Badge className="ml-2 bg-green-500/20 text-green-300">Save up to 25%</Badge>
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans?.map((plan) => (
              <Card
                key={plan.tier}
                className={`${getPlanColor(plan.tier)} border-2 cursor-pointer transition-all hover:scale-105 relative ${
                  isCurrentPlan(plan.tier) ? "ring-2 ring-cyan-400" : ""
                }`}
                onClick={() => !isCurrentPlan(plan.tier) && handlePlanSelect(plan.tier)}
              >
                {isCurrentPlan(plan.tier) && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-cyan-500 text-white">Current Plan</Badge>
                  </div>
                )}
                
                {plan.tier === "SEEKER" && (
                  <div className="absolute -top-2 right-4">
                    <Badge className="bg-purple-500 text-white">Most Popular</Badge>
                  </div>
                )}

                <CardHeader className="text-center">
                  {getPlanIcon(plan.tier)}
                  <CardTitle className="text-white">{plan.name}</CardTitle>
                  {getPrice(plan)}
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-slate-300">
                        <Check className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    className={`w-full ${
                      isCurrentPlan(plan.tier)
                        ? "bg-slate-600 text-slate-300 cursor-not-allowed"
                        : plan.tier === "EXPLORER"
                        ? "bg-slate-600 hover:bg-slate-700 text-white"
                        : "bg-cyan-500 hover:bg-cyan-600 text-white"
                    }`}
                    disabled={
                      isCurrentPlan(plan.tier) ||
                      createSubscriptionMutation.isPending ||
                      updateSubscriptionMutation.isPending
                    }
                  >
                    {isCurrentPlan(plan.tier) ? (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Current Plan
                      </>
                    ) : plan.tier === "EXPLORER" ? (
                      <>
                        <Unlock className="w-4 h-4 mr-2" />
                        Downgrade to {plan.name}
                      </>
                    ) : (
                      <>
                        <Crown className="w-4 h-4 mr-2" />
                        Choose {plan.name}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}