import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  User, Camera, Shield, Sparkles, Crown, Target, 
  Palette, Globe, Bell, Settings, ArrowRight, ArrowLeft,
  CheckCircle, Upload, CreditCard, Zap, Award, Wallet
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface OnboardingData {
  profile: {
    firstName: string;
    lastName: string;
    bio: string;
    interests: string[];
    goals: string;
    experience: string;
  };
  preferences: {
    theme: "light" | "dark" | "auto";
    language: string;
    notifications: {
      email: boolean;
      browser: boolean;
      mobile: boolean;
    };
    privacy: {
      profileVisible: boolean;
      showActivity: boolean;
      allowAnalytics: boolean;
    };
  };
  verification: {
    emailVerified: boolean;
    identityVerified: boolean;
  };
  wallet: {
    connected: boolean;
    address?: string;
  };
  tier: "EXPLORER" | "SEEKER" | "CREATOR" | "SOVEREIGN";
}

const STEPS = [
  { id: 1, title: "Profile Setup", icon: User, description: "Basic information" },
  { id: 2, title: "Interests", icon: Target, description: "Your preferences" },
  { id: 3, title: "Verification", icon: Shield, description: "Verify identity" },
  { id: 4, title: "Wallet", icon: Wallet, description: "Connect Web3 wallet" },
  { id: 5, title: "Tier Selection", icon: Crown, description: "Choose your plan" },
  { id: 6, title: "Finish", icon: CheckCircle, description: "Complete setup" }
];

const TIERS = [
  {
    name: "EXPLORER",
    price: "Free",
    features: ["5 Capsules/month", "Basic verification", "Community access"],
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10"
  },
  {
    name: "SEEKER", 
    price: "$9/month",
    features: ["50 Capsules/month", "Advanced verification", "Priority support"],
    color: "text-purple-400",
    bgColor: "bg-purple-500/10"
  },
  {
    name: "CREATOR",
    price: "$29/month", 
    features: ["Unlimited capsules", "NFT minting", "Revenue sharing"],
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10"
  },
  {
    name: "SOVEREIGN",
    price: "$99/month",
    features: ["Enterprise features", "Custom branding", "API access"],
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10"
  }
];

const INTERESTS = [
  "Technology", "Science", "Art", "Music", "History", "Philosophy",
  "Politics", "Environment", "Health", "Education", "Business", "Gaming",
  "Blockchain", "AI/ML", "Cybersecurity", "Privacy Rights", "Truth & Justice"
];

export default function ComprehensiveOnboardingFlow() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { updateProfile, uploadAvatar } = useUserProfile();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    profile: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      bio: "",
      interests: [],
      goals: "",
      experience: ""
    },
    preferences: {
      theme: "dark",
      language: "en",
      notifications: {
        email: true,
        browser: true,
        mobile: false
      },
      privacy: {
        profileVisible: true,
        showActivity: true,
        allowAnalytics: true
      }
    },
    verification: {
      emailVerified: false,
      identityVerified: false
    },
    wallet: {
      connected: false
    },
    tier: "EXPLORER"
  });
  
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const totalSteps = STEPS.length;
  const progress = (currentStep / totalSteps) * 100;

  const completeOnboardingMutation = useMutation({
    mutationFn: async (data: OnboardingData) => {
      const response = await fetch("/api/auth/complete-onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profileData: data.profile,
          preferences: data.preferences,
          interests: data.profile.interests,
          walletAddress: data.wallet.address,
          tier: data.tier
        }),
        credentials: "include"
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Onboarding failed");
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Onboarding Complete!",
        description: "Welcome to GuardianChain. Your account is now set up.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setLocation(data.redirectTo || "/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Onboarding Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const updateOnboardingData = (section: keyof OnboardingData, updates: any) => {
    setOnboardingData(prev => {
      const currentSection = prev[section];
      if (typeof currentSection === 'object' && currentSection !== null) {
        return {
          ...prev,
          [section]: { ...currentSection, ...updates }
        };
      }
      return {
        ...prev,
        [section]: updates
      };
    });
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      // Upload avatar if provided
      if (avatarFile) {
        await uploadAvatar(avatarFile);
      }
      
      // Complete onboarding
      await completeOnboardingMutation.mutateAsync(onboardingData);
    } catch (error) {
      console.error("Onboarding completion failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="relative mx-auto w-24 h-24">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={avatarFile ? URL.createObjectURL(avatarFile) : user?.profileImageUrl} />
                  <AvatarFallback className="text-2xl">
                    {onboardingData.profile.firstName[0]}{onboardingData.profile.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <Label htmlFor="avatar-upload" className="absolute bottom-0 right-0 p-2 bg-purple-600 rounded-full cursor-pointer hover:bg-purple-700 transition-colors">
                  <Camera className="h-4 w-4 text-white" />
                </Label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setAvatarFile(file);
                  }}
                  data-testid="input-avatar-upload"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={onboardingData.profile.firstName}
                  onChange={(e) => updateOnboardingData("profile", { firstName: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                  data-testid="input-first-name"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={onboardingData.profile.lastName}
                  onChange={(e) => updateOnboardingData("profile", { lastName: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                  data-testid="input-last-name"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={onboardingData.profile.bio}
                onChange={(e) => updateOnboardingData("profile", { bio: e.target.value })}
                placeholder="Tell us about yourself..."
                className="bg-white/5 border-white/10 text-white"
                data-testid="textarea-bio"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label>Interests</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {INTERESTS.map((interest) => (
                  <div key={interest} className="flex items-center space-x-2">
                    <Checkbox
                      id={interest}
                      checked={onboardingData.profile.interests.includes(interest)}
                      onCheckedChange={(checked) => {
                        const interests = checked
                          ? [...onboardingData.profile.interests, interest]
                          : onboardingData.profile.interests.filter(i => i !== interest);
                        updateOnboardingData("profile", { interests });
                      }}
                      data-testid={`checkbox-interest-${interest.toLowerCase()}`}
                    />
                    <Label htmlFor={interest} className="text-sm">{interest}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label htmlFor="goals">Goals</Label>
              <Textarea
                id="goals"
                value={onboardingData.profile.goals}
                onChange={(e) => updateOnboardingData("profile", { goals: e.target.value })}
                placeholder="What do you hope to achieve with GuardianChain?"
                className="bg-white/5 border-white/10 text-white"
                data-testid="textarea-goals"
              />
            </div>
            
            <div>
              <Label htmlFor="experience">Experience</Label>
              <Select
                value={onboardingData.profile.experience}
                onValueChange={(value) => updateOnboardingData("profile", { experience: value })}
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white" data-testid="select-experience">
                  <SelectValue placeholder="Select your experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 text-center">
            <Shield className="mx-auto h-16 w-16 text-cyan-400" />
            <div>
              <h3 className="text-xl font-semibold mb-2">Verify Your Identity</h3>
              <p className="text-gray-400">Help us keep the platform secure by verifying your identity.</p>
            </div>
            <div className="space-y-4">
              <Button
                onClick={() => updateOnboardingData("verification", { emailVerified: true })}
                disabled={onboardingData.verification.emailVerified}
                className="w-full bg-cyan-600 hover:bg-cyan-700"
                data-testid="button-verify-email"
              >
                {onboardingData.verification.emailVerified ? "Email Verified ✓" : "Verify Email"}
              </Button>
              <Button
                onClick={() => updateOnboardingData("verification", { identityVerified: true })}
                disabled={onboardingData.verification.identityVerified}
                variant="outline"
                className="w-full"
                data-testid="button-verify-identity"
              >
                {onboardingData.verification.identityVerified ? "Identity Verified ✓" : "Verify Identity (Optional)"}
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 text-center">
            <Wallet className="mx-auto h-16 w-16 text-purple-400" />
            <div>
              <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
              <p className="text-gray-400">Connect a Web3 wallet to access blockchain features.</p>
            </div>
            <div className="space-y-4">
              <Button
                onClick={() => {
                  // Simulate wallet connection
                  const mockAddress = "0x" + Math.random().toString(16).substr(2, 40);
                  updateOnboardingData("wallet", { connected: true, address: mockAddress });
                }}
                disabled={onboardingData.wallet.connected}
                className="w-full bg-purple-600 hover:bg-purple-700"
                data-testid="button-connect-wallet"
              >
                {onboardingData.wallet.connected ? "Wallet Connected ✓" : "Connect Wallet"}
              </Button>
              {onboardingData.wallet.connected && (
                <p className="text-sm text-gray-400 truncate">
                  Connected: {onboardingData.wallet.address}
                </p>
              )}
              <Button
                onClick={handleNext}
                variant="outline"
                className="w-full"
                data-testid="button-skip-wallet"
              >
                Skip for Now
              </Button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Choose Your Tier</h3>
              <p className="text-gray-400">Select the plan that best fits your needs.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {TIERS.map((tier) => (
                <Card
                  key={tier.name}
                  className={`cursor-pointer border-2 transition-all ${
                    onboardingData.tier === tier.name
                      ? "border-cyan-400 bg-cyan-500/10"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                  onClick={() => updateOnboardingData("tier", tier.name)}
                  data-testid={`card-tier-${tier.name.toLowerCase()}`}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className={`text-lg ${tier.color}`}>{tier.name}</CardTitle>
                    <p className="text-2xl font-bold">{tier.price}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="text-sm text-gray-400">• {feature}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6 text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-emerald-400" />
            <div>
              <h3 className="text-xl font-semibold mb-2">Setup Complete!</h3>
              <p className="text-gray-400">You're ready to start using GuardianChain.</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 space-y-2">
              <h4 className="font-semibold">Summary:</h4>
              <p className="text-sm text-gray-400">Name: {onboardingData.profile.firstName} {onboardingData.profile.lastName}</p>
              <p className="text-sm text-gray-400">Interests: {onboardingData.profile.interests.length} selected</p>
              <p className="text-sm text-gray-400">Tier: {onboardingData.tier}</p>
              <p className="text-sm text-gray-400">Wallet: {onboardingData.wallet.connected ? "Connected" : "Not connected"}</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-hsl(218,54%,9%) via-hsl(220,39%,11%) to-hsl(222,47%,11%) p-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Welcome to GuardianChain
            </h1>
            <Badge variant="secondary" className="bg-white/10">
              Step {currentStep} of {totalSteps}
            </Badge>
          </div>
          <Progress value={progress} className="h-2 bg-white/10" />
          
          {/* Step indicators */}
          <div className="flex justify-between mt-4">
            {STEPS.map((step) => (
              <div
                key={step.id}
                className={`flex flex-col items-center space-y-2 ${
                  currentStep >= step.id ? "text-cyan-400" : "text-gray-600"
                }`}
              >
                <div className={`p-2 rounded-full ${
                  currentStep >= step.id ? "bg-cyan-500/20" : "bg-white/5"
                }`}>
                  <step.icon className="h-4 w-4" />
                </div>
                <span className="text-xs">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-xl">
              {STEPS.find(s => s.id === currentStep)?.title}
            </CardTitle>
            <p className="text-gray-400">
              {STEPS.find(s => s.id === currentStep)?.description}
            </p>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            variant="outline"
            className="border-white/10"
            data-testid="button-previous"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <Button
            onClick={currentStep === totalSteps ? handleComplete : handleNext}
            disabled={loading}
            className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700"
            data-testid="button-next"
          >
            {loading ? "Completing..." : currentStep === totalSteps ? "Complete Setup" : "Next"}
            {currentStep < totalSteps && <ArrowRight className="h-4 w-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
}