import React, { useEffect, useState } from "react";
import { useEnhancedAuth } from "@/hooks/useEnhancedAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  CheckCircle,
  AlertTriangle,
  User,
  Mail,
  Shield,
  Wallet,
  CreditCard,
  Settings,
  ArrowRight,
  RefreshCw,
  Clock,
  Star,
  Zap,
  Crown,
} from "lucide-react";

interface AuthStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
  priority: "high" | "medium" | "low";
  icon: React.ReactNode;
  action?: () => void;
}

export default function ComprehensiveAuthFlow() {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    needsOnboarding, 
    refetch,
    completeOnboarding,
    verifyEmail,
    connectWallet,
    updateProfile,
    createSubscription 
  } = useEnhancedAuth();
  
  const { toast } = useToast();
  const [showFlow, setShowFlow] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (isAuthenticated && needsOnboarding) {
      setShowFlow(true);
    } else {
      setShowFlow(false);
    }
  }, [isAuthenticated, needsOnboarding]);

  if (!showFlow || !user) return null;

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
      toast({
        title: "Status Updated",
        description: "Authentication status refreshed successfully.",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh authentication status.",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  const steps: AuthStep[] = [
    {
      id: "profile",
      title: "Complete Your Profile",
      description: "Add your personal information and profile details",
      completed: !!(user.firstName && user.lastName && user.username),
      required: true,
      priority: "high",
      icon: <User className="w-5 h-5" />,
      action: () => window.location.href = "/profile",
    },
    {
      id: "email",
      title: "Verify Email Address",
      description: "Confirm your email for security and notifications",
      completed: user.emailVerified,
      required: true,
      priority: "high",
      icon: <Mail className="w-5 h-5" />,
      action: async () => {
        try {
          await verifyEmail.mutateAsync({ verificationCode: "auto-verify" });
        } catch (error) {
          toast({
            title: "Verification Required",
            description: "Please check your email for verification instructions.",
            variant: "destructive",
          });
        }
      },
    },
    {
      id: "subscription",
      title: "Choose Your Guardian Tier",
      description: "Select the plan that fits your needs",
      completed: user.tier !== "EXPLORER" && user.subscriptionStatus === "active",
      required: false,
      priority: "high",
      icon: <Crown className="w-5 h-5" />,
      action: () => window.location.href = "/enhanced-onboarding",
    },
    {
      id: "security",
      title: "Enable Two-Factor Auth",
      description: "Add an extra layer of security to your account",
      completed: user.twoFactorEnabled,
      required: false,
      priority: "medium",
      icon: <Shield className="w-5 h-5" />,
      action: () => window.location.href = "/security",
    },
    {
      id: "wallet",
      title: "Connect Web3 Wallet",
      description: "Link your wallet for blockchain features",
      completed: user.isWalletVerified,
      required: false,
      priority: "medium",
      icon: <Wallet className="w-5 h-5" />,
      action: async () => {
        try {
          // Simulate wallet connection
          await connectWallet.mutateAsync({ 
            walletAddress: "0x1234...5678", 
            signature: "mock-signature" 
          });
        } catch (error) {
          toast({
            title: "Wallet Connection",
            description: "Please install MetaMask or another Web3 wallet.",
            variant: "destructive",
          });
        }
      },
    },
    {
      id: "preferences",
      title: "Customize Preferences",
      description: "Set up notifications and privacy settings",
      completed: !!(user.preferences?.theme && user.preferences?.language),
      required: false,
      priority: "low",
      icon: <Settings className="w-5 h-5" />,
      action: () => window.location.href = "/settings",
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
        description: "Please complete all required steps first.",
        variant: "destructive",
      });
      return;
    }

    try {
      await completeOnboarding.mutateAsync({
        completedAt: new Date().toISOString(),
        completedSteps: steps.filter(s => s.completed).map(s => s.id)
      });
      
      setShowFlow(false);
      
      toast({
        title: "Welcome to GuardianChain! 🎉",
        description: "Your account is now fully set up and ready to use.",
      });
      
      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2000);
    } catch (error) {
      toast({
        title: "Setup Failed",
        description: "Failed to complete onboarding. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500/20 text-red-300 border-red-500/50";
      case "medium": return "bg-yellow-500/20 text-yellow-300 border-yellow-500/50";
      case "low": return "bg-blue-500/20 text-blue-300 border-blue-500/50";
      default: return "bg-slate-500/20 text-slate-300 border-slate-500/50";
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "SOVEREIGN": return <Crown className="w-4 h-4 text-purple-400" />;
      case "CREATOR": return <Star className="w-4 h-4 text-blue-400" />;
      case "SEEKER": return <Zap className="w-4 h-4 text-cyan-400" />;
      default: return <User className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <Card className="bg-slate-800/95 border-slate-700 backdrop-blur-sm max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-white text-xl">Complete Your Guardian Setup</CardTitle>
                <p className="text-slate-300 text-sm">
                  Welcome, {user.firstName || "Guardian"}! Let's finish setting up your account.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge className="bg-slate-700 text-slate-300 border-slate-600">
                {getTierIcon(user.tier)}
                <span className="ml-1">{user.tier}</span>
              </Badge>
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
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-300">Progress</span>
              <span className="text-cyan-400 font-medium">
                {completedSteps}/{steps.length} completed
              </span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">
                Required: {completedRequiredSteps}/{requiredSteps.length}
              </span>
              <span className="text-slate-400">
                {Math.round(progressPercentage)}% complete
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Required Steps */}
            <div>
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                Required Steps
              </h3>
              
              <div className="space-y-3">
                {requiredSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`p-4 rounded-lg border transition-all ${
                      step.completed
                        ? "bg-green-500/10 border-green-500/50"
                        : "bg-slate-800/50 border-slate-700 hover:border-slate-600"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${
                          step.completed ? "bg-green-500/20" : "bg-slate-700"
                        }`}>
                          {step.completed ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            step.icon
                          )}
                        </div>
                        <div>
                          <h4 className="text-white font-medium">{step.title}</h4>
                          <p className="text-slate-400 text-sm">{step.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Badge className={getPriorityColor(step.priority)}>
                          {step.priority.toUpperCase()}
                        </Badge>
                        
                        {!step.completed && step.action && (
                          <Button
                            onClick={step.action}
                            className="bg-cyan-500 hover:bg-cyan-600 text-white"
                          >
                            Complete
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        )}
                        
                        {step.completed && (
                          <Badge className="bg-green-500/20 text-green-300 border-green-500/50">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Done
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Optional Steps */}
            <div>
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Star className="w-4 h-4 text-blue-400" />
                Enhance Your Experience
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {steps.filter(step => !step.required).map((step) => (
                  <div
                    key={step.id}
                    className={`p-4 rounded-lg border transition-all ${
                      step.completed
                        ? "bg-blue-500/10 border-blue-500/50"
                        : "bg-slate-800/50 border-slate-700 hover:border-slate-600"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2 rounded-lg ${
                        step.completed ? "bg-blue-500/20" : "bg-slate-700"
                      }`}>
                        {step.completed ? (
                          <CheckCircle className="w-4 h-4 text-blue-400" />
                        ) : (
                          step.icon
                        )}
                      </div>
                      <Badge className={getPriorityColor(step.priority)} variant="outline">
                        {step.priority}
                      </Badge>
                    </div>
                    
                    <h4 className="text-white font-medium text-sm mb-1">{step.title}</h4>
                    <p className="text-slate-400 text-xs mb-3">{step.description}</p>
                    
                    {!step.completed && step.action && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={step.action}
                        className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        Set Up
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-slate-700">
              <Button
                onClick={handleCompleteOnboarding}
                disabled={!canCompleteOnboarding || completeOnboarding.isPending}
                className={`flex-1 ${
                  canCompleteOnboarding
                    ? "bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                    : "bg-slate-600"
                } text-white`}
              >
                {completeOnboarding.isPending ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Completing Setup...
                  </>
                ) : canCompleteOnboarding ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete Setup & Continue
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Complete Required Steps First
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setShowFlow(false)}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Skip for Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}