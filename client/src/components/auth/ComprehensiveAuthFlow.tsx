import React, { useState, useEffect } from "react";
import { useEnhancedAuth } from "@/hooks/useEnhancedAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  User,
  Mail,
  Crown,
  Wallet,
  CreditCard,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Settings,
  Sparkles,
  ArrowRight,
  EyeOff,
  Star,
} from "lucide-react";

interface AuthStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
  priority: "high" | "medium" | "low";
  icon: React.ReactNode;
  action: () => void;
}

interface ProfileData {
  firstName: string;
  lastName: string;
  username: string;
}

export default function ComprehensiveAuthFlow() {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    needsOnboarding,
    refetch,
    updateProfile,
    verifyEmail,
    connectWallet,
    createSubscription,
    completeOnboarding
  } = useEnhancedAuth();
  
  const { toast } = useToast();
  const [showFlow, setShowFlow] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedTier, setSelectedTier] = useState("EXPLORER");
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    username: "",
  });

  // Initialize profile data from user
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "",
      });
    }
  }, [user]);

  // Show flow logic
  useEffect(() => {
    const shouldShow = isAuthenticated && needsOnboarding && user && !user.onboardingCompleted;
    
    console.log("🔐 ComprehensiveAuthFlow: Effect triggered", {
      isAuthenticated,
      needsOnboarding,
      user: user?.id,
      onboardingCompleted: user?.onboardingCompleted
    });

    if (shouldShow) {
      console.log("✅ ComprehensiveAuthFlow: Showing onboarding flow");
      setShowFlow(true);
    } else {
      console.log("❌ ComprehensiveAuthFlow: Not showing flow");
      setShowFlow(false);
    }
  }, [isAuthenticated, needsOnboarding, user]);

  if (!showFlow || !user) return null;

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
      toast({
        title: "Refresh Complete",
        description: "Authentication data has been updated",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed", 
        description: "Unable to refresh authentication data",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  const authSteps: AuthStep[] = [
    {
      id: "profile",
      title: "Complete Profile",
      description: "Set up your basic profile information",
      completed: !!(user?.firstName && user?.lastName && user?.username),
      required: true,
      priority: "high",
      icon: <User className="w-5 h-5" />,
      action: () => setCurrentStep(0),
    },
    {
      id: "email",
      title: "Verify Email",
      description: "Confirm your email address for security",
      completed: user?.emailVerified || false,
      required: true,
      priority: "high", 
      icon: <Mail className="w-5 h-5" />,
      action: () => verifyEmail?.(),
    },
    {
      id: "tier",
      title: "Choose Your Tier",
      description: "Select subscription tier and features",
      completed: user?.tier !== "EXPLORER",
      required: true,
      priority: "medium",
      icon: <Star className="w-5 h-5" />,
      action: () => setCurrentStep(1),
    },
    {
      id: "wallet",
      title: "Connect Wallet",
      description: "Link your Web3 wallet for blockchain features",
      completed: user?.isWalletVerified || false,
      required: false,
      priority: "medium",
      icon: <Wallet className="w-5 h-5" />,
      action: () => connectWallet?.(),
    },
    {
      id: "subscription",
      title: "Set Up Subscription",
      description: "Configure payment and billing",
      completed: user?.subscriptionStatus === "active",
      required: false,
      priority: "low",
      icon: <CreditCard className="w-5 h-5" />,
      action: () => createSubscription?.(selectedTier),
    },
  ];

  const completedSteps = authSteps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / authSteps.length) * 100;

  const handleCompleteOnboarding = async () => {
    try {
      await completeOnboarding?.();
      toast({
        title: "Welcome to GuardianChain!",
        description: "Your onboarding is complete. Welcome to the truth vault.",
      });
    } catch (error) {
      toast({
        title: "Onboarding Error",
        description: "Failed to complete onboarding. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await updateProfile?.(profileData);
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved",
      });
    } catch (error) {
      toast({
        title: "Profile Update Failed",
        description: "Unable to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl bg-card/95 backdrop-blur-sm border-cyan-500/30">
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Shield className="w-8 h-8 text-cyan-400" />
              <CardTitle className="text-2xl font-bold">
                Complete Your GuardianChain Setup
              </CardTitle>
            </div>
            <div className="space-y-2">
              <Progress value={progressPercentage} className="h-3" />
              <p className="text-sm text-muted-foreground">
                {completedSteps} of {authSteps.length} steps completed ({Math.round(progressPercentage)}%)
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <Tabs value={currentStep.toString()} onValueChange={(value) => setCurrentStep(Number(value))}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="0">Profile</TabsTrigger>
                <TabsTrigger value="1">Subscription</TabsTrigger>
                <TabsTrigger value="2">Advanced</TabsTrigger>
              </TabsList>

              <TabsContent value="0" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5 text-cyan-400" />
                      Profile Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={profileData.firstName}
                          onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                          placeholder="Enter your first name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={profileData.lastName}
                          onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                          placeholder="Enter your last name"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={profileData.username}
                        onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                        placeholder="Choose a unique username"
                      />
                    </div>
                    <Button onClick={handleUpdateProfile} className="w-full">
                      <User className="w-4 h-4 mr-2" />
                      Save Profile
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="1" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="w-5 h-5 text-purple-400" />
                      Choose Your Tier
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {["EXPLORER", "SEEKER", "CREATOR", "SOVEREIGN"].map((tier) => (
                        <div
                          key={tier}
                          className={`p-4 rounded-lg border cursor-pointer transition-all ${
                            selectedTier === tier ? "border-cyan-500 bg-cyan-500/10" : "border-muted hover:border-cyan-500/50"
                          }`}
                          onClick={() => setSelectedTier(tier)}
                        >
                          <div className="text-center space-y-2">
                            <div className="text-lg font-semibold">{tier}</div>
                            <div className="text-sm text-muted-foreground">
                              {tier === "EXPLORER" && "Free • Basic features"}
                              {tier === "SEEKER" && "$9/mo • Enhanced access"}
                              {tier === "CREATOR" && "$29/mo • Creator tools"}
                              {tier === "SOVEREIGN" && "$99/mo • Full sovereignty"}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="2" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-orange-400" />
                        Web3 Wallet
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Wallet Status</span>
                        <Badge variant={user?.isWalletVerified ? "default" : "secondary"}>
                          {user?.isWalletVerified ? "Connected" : "Not Connected"}
                        </Badge>
                      </div>
                      {user?.walletAddress && (
                        <div className="text-sm text-muted-foreground font-mono">
                          {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
                        </div>
                      )}
                      <Button onClick={connectWallet} className="w-full" variant="outline">
                        <Wallet className="w-4 h-4 mr-2" />
                        {user?.isWalletVerified ? "Change Wallet" : "Connect Wallet"}
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-green-400" />
                        Security
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Email Verified</span>
                        <Badge variant={user?.emailVerified ? "default" : "destructive"}>
                          {user?.emailVerified ? "Verified" : "Unverified"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>2FA Enabled</span>
                        <Badge variant={user?.twoFactorEnabled ? "default" : "secondary"}>
                          {user?.twoFactorEnabled ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                      <Button onClick={verifyEmail} className="w-full" variant="outline">
                        <Mail className="w-4 h-4 mr-2" />
                        {user?.emailVerified ? "Re-verify Email" : "Verify Email"}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
                {authSteps.map((step) => (
                  <div
                    key={step.id}
                    className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                      step.completed
                        ? "border-green-500 bg-green-500/10 text-green-400"
                        : step.required
                        ? "border-red-500/50 bg-red-500/5 hover:border-red-500"
                        : "border-muted hover:border-cyan-500/50"
                    }`}
                    onClick={step.action}
                  >
                    {step.completed ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : step.required ? (
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                    ) : (
                      step.icon
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{step.title}</div>
                      <div className="text-xs text-muted-foreground truncate">{step.description}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between gap-4">
                <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh Data
                </Button>

                {showAdvanced && (
                  <Button variant="outline" onClick={() => setShowAdvanced(false)}>
                    <EyeOff className="w-4 h-4 mr-2" />
                    Hide Advanced
                  </Button>
                )}

                <Button onClick={handleCompleteOnboarding} className="flex-1">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Complete Setup
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}