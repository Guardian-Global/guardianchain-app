import React, { useEffect, useState } from "react";
import { useEnhancedAuth } from "@/hooks/useEnhancedAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  AlertTriangle,
  User,
  CreditCard,
  Settings,
  Shield,
  Mail,
  Wallet,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
  icon: React.ReactNode;
  action?: () => void;
}

export default function OnboardingStatusChecker() {
  const { user, isAuthenticated, refetch, isLoading } = useEnhancedAuth();
  const { toast } = useToast();
  const [showStatus, setShowStatus] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Show status checker if user is authenticated but onboarding is incomplete
    if (isAuthenticated && user && !user.onboardingCompleted) {
      setShowStatus(true);
    } else {
      setShowStatus(false);
    }
  }, [isAuthenticated, user]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
      toast({
        title: "Status Updated",
        description: "Onboarding status has been refreshed.",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh onboarding status.",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  if (!showStatus || !user) return null;

  const steps: OnboardingStep[] = [
    {
      id: "profile",
      title: "Complete Profile",
      description: "Add your personal information and profile picture",
      completed: !!(user.firstName && user.lastName && user.username),
      required: true,
      icon: <User className="w-4 h-4" />,
      action: () => window.location.href = "/profile",
    },
    {
      id: "email",
      title: "Verify Email",
      description: "Confirm your email address for security",
      completed: user.emailVerified,
      required: true,
      icon: <Mail className="w-4 h-4" />,
      action: () => window.location.href = "/verify-email",
    },
    {
      id: "subscription",
      title: "Choose Plan",
      description: "Select your Guardian tier and subscription",
      completed: user.tier !== "EXPLORER" || user.subscriptionStatus === "active",
      required: false,
      icon: <CreditCard className="w-4 h-4" />,
      action: () => window.location.href = "/enhanced-onboarding",
    },
    {
      id: "preferences",
      title: "Set Preferences",
      description: "Configure your privacy and notification settings",
      completed: !!(user.preferences?.theme && user.preferences?.language),
      required: false,
      icon: <Settings className="w-4 h-4" />,
      action: () => window.location.href = "/settings",
    },
    {
      id: "security",
      title: "Enable Security",
      description: "Set up two-factor authentication for enhanced security",
      completed: user.twoFactorEnabled,
      required: false,
      icon: <Shield className="w-4 h-4" />,
      action: () => window.location.href = "/security",
    },
    {
      id: "wallet",
      title: "Connect Wallet",
      description: "Link your Web3 wallet for blockchain features",
      completed: user.isWalletVerified,
      required: false,
      icon: <Wallet className="w-4 h-4" />,
      action: () => window.location.href = "/wallet",
    },
  ];

  const completedSteps = steps.filter(step => step.completed).length;
  const requiredSteps = steps.filter(step => step.required);
  const completedRequiredSteps = requiredSteps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / steps.length) * 100;
  const canCompleteOnboarding = completedRequiredSteps === requiredSteps.length;

  const handleCompleteOnboarding = async () => {
    if (!canCompleteOnboarding) {
      toast({
        title: "Requirements Not Met",
        description: "Please complete all required steps before finishing onboarding.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/auth/complete-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        toast({
          title: "Onboarding Complete!",
          description: "Welcome to GuardianChain! You can now access all features.",
        });
        await refetch();
        setShowStatus(false);
      } else {
        throw new Error("Failed to complete onboarding");
      }
    } catch (error) {
      toast({
        title: "Completion Failed",
        description: "Failed to complete onboarding. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/95 z-50 flex items-center justify-center p-4">
      <Card className="bg-slate-800/90 border-slate-700 backdrop-blur-sm max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-400" />
                Complete Your Guardian Setup
              </CardTitle>
              <p className="text-slate-300 mt-1">
                Finish setting up your account to unlock the full GuardianChain experience
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="text-slate-400 hover:text-white"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-300">Progress</span>
              <span className="text-cyan-400">
                {completedSteps}/{steps.length} completed
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Required Steps */}
          <div className="space-y-3">
            <h3 className="text-white font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              Required Steps
            </h3>
            
            {requiredSteps.map((step) => (
              <div
                key={step.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  step.completed
                    ? "bg-green-500/10 border-green-500/50"
                    : "bg-slate-800/50 border-slate-700 hover:border-slate-600"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${step.completed ? "bg-green-500/20" : "bg-slate-700"}`}>
                    {step.completed ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{step.title}</h4>
                    <p className="text-slate-400 text-sm">{step.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className={
                      step.completed
                        ? "bg-green-500/20 text-green-300"
                        : "bg-slate-700 text-slate-300"
                    }
                  >
                    {step.completed ? "Complete" : "Required"}
                  </Badge>
                  
                  {!step.completed && step.action && (
                    <Button
                      size="sm"
                      onClick={step.action}
                      className="bg-cyan-500 hover:bg-cyan-600 text-white"
                    >
                      <ArrowRight className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Optional Steps */}
          <div className="space-y-3">
            <h3 className="text-white font-medium">Optional Enhancements</h3>
            
            {steps.filter(step => !step.required).map((step) => (
              <div
                key={step.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  step.completed
                    ? "bg-blue-500/10 border-blue-500/50"
                    : "bg-slate-800/50 border-slate-700 hover:border-slate-600"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${step.completed ? "bg-blue-500/20" : "bg-slate-700"}`}>
                    {step.completed ? (
                      <CheckCircle className="w-4 h-4 text-blue-400" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{step.title}</h4>
                    <p className="text-slate-400 text-sm">{step.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={
                      step.completed
                        ? "border-blue-500/50 text-blue-300"
                        : "border-slate-600 text-slate-400"
                    }
                  >
                    {step.completed ? "Complete" : "Optional"}
                  </Badge>
                  
                  {!step.completed && step.action && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={step.action}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      <ArrowRight className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-700">
            <Button
              onClick={handleCompleteOnboarding}
              disabled={!canCompleteOnboarding}
              className={`flex-1 ${
                canCompleteOnboarding
                  ? "bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                  : "bg-slate-600"
              } text-white`}
            >
              {canCompleteOnboarding ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Complete Setup
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Complete Required Steps
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setShowStatus(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Skip for Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}