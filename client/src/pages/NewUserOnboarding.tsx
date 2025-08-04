import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Camera,
  Shield,
  Sparkles,
  Crown,
  Target,
  Palette,
  Globe,
  Bell,
  Settings,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Upload,
  CreditCard,
  Zap,
  Award
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface OnboardingProfile {
  displayName: string;
  bio: string;
  profileImageUrl?: string;
  backgroundImageUrl?: string;
  location?: string;
  website?: string;
  interests: string[];
  tier: "EXPLORER" | "SEEKER" | "CREATOR" | "SOVEREIGN";
  preferences: {
    theme: "light" | "dark" | "auto";
    language: string;
    notifications: {
      email: boolean;
      browser: boolean;
      mobile: boolean;
    };
    privacy: {
      profileVisibility: "public" | "private" | "friends";
      showActivity: boolean;
      showStats: boolean;
    };
    ai: {
      enableRecommendations: boolean;
      autoTag: boolean;
      sentiment: boolean;
    };
  };
}

const TIERS = [
  {
    name: "EXPLORER",
    price: "Free",
    features: ["5 Capsules/month", "Basic verification", "Community access"],
    color: "text-blue-400",
    bgColor: "bg-blue-500/10"
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
  "Politics", "Environment", "Health", "Education", "Business", "Gaming"
];

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "ja", name: "日本語" },
  { code: "zh", name: "中文" }
];

export default function NewUserOnboarding() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [profile, setProfile] = useState<OnboardingProfile>({
    displayName: user?.firstName || "",
    bio: "",
    interests: [],
    tier: "EXPLORER",
    preferences: {
      theme: "dark",
      language: "en",
      notifications: {
        email: true,
        browser: true,
        mobile: false
      },
      privacy: {
        profileVisibility: "public",
        showActivity: true,
        showStats: true
      },
      ai: {
        enableRecommendations: true,
        autoTag: true,
        sentiment: true
      }
    }
  });

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const saveProfileMutation = useMutation({
    mutationFn: async (profileData: OnboardingProfile) => {
      return apiRequest("PUT", "/api/user/onboarding", profileData);
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully configured."
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const completeMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/user/complete-onboarding", {
        profile,
        completedAt: new Date().toISOString()
      });
    },
    onSuccess: () => {
      toast({
        title: "Welcome to GuardianChain!",
        description: "Your account setup is complete. Let's start preserving truth!"
      });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Setup Failed", 
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleNext = async () => {
    if (currentStep === 3) {
      // Save profile data before proceeding to subscription
      await saveProfileMutation.mutateAsync(profile);
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      completeMutation.mutate();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const updateProfile = (updates: Partial<OnboardingProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const updatePreferences = (updates: any) => {
    setProfile(prev => ({
      ...prev,
      preferences: { ...prev.preferences, ...updates }
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-400">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={profile.profileImageUrl} />
                  <AvatarFallback className="bg-purple-500 text-white text-lg">
                    {profile.displayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" className="flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Upload Photo
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="displayName" className="text-purple-300">Display Name</Label>
                  <Input
                    id="displayName"
                    value={profile.displayName}
                    onChange={(e) => updateProfile({ displayName: e.target.value })}
                    placeholder="Your public display name"
                    className="bg-white/5 border-white/10 text-white"
                    data-testid="input-display-name"
                  />
                </div>

                <div>
                  <Label htmlFor="bio" className="text-purple-300">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => updateProfile({ bio: e.target.value })}
                    placeholder="Tell the world about yourself..."
                    className="bg-white/5 border-white/10 text-white min-h-[100px]"
                    data-testid="textarea-bio"
                  />
                </div>

                <div>
                  <Label htmlFor="location" className="text-purple-300">Location (Optional)</Label>
                  <Input
                    id="location"
                    value={profile.location || ""}
                    onChange={(e) => updateProfile({ location: e.target.value })}
                    placeholder="City, Country"
                    className="bg-white/5 border-white/10 text-white"
                    data-testid="input-location"
                  />
                </div>

                <div>
                  <Label htmlFor="website" className="text-purple-300">Website (Optional)</Label>
                  <Input
                    id="website"
                    value={profile.website || ""}
                    onChange={(e) => updateProfile({ website: e.target.value })}
                    placeholder="https://your-website.com"
                    className="bg-white/5 border-white/10 text-white"
                    data-testid="input-website"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-400">
                <Target className="w-5 h-5" />
                Interests & Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-purple-300 mb-3 block">Your Interests</Label>
                <div className="grid grid-cols-3 gap-2">
                  {INTERESTS.map((interest) => (
                    <div key={interest} className="flex items-center space-x-2">
                      <Checkbox
                        id={interest}
                        checked={profile.interests.includes(interest)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateProfile({ 
                              interests: [...profile.interests, interest] 
                            });
                          } else {
                            updateProfile({
                              interests: profile.interests.filter(i => i !== interest)
                            });
                          }
                        }}
                        data-testid={`checkbox-interest-${interest.toLowerCase()}`}
                      />
                      <Label htmlFor={interest} className="text-sm text-white">
                        {interest}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-purple-300">Language</Label>
                <Select 
                  value={profile.preferences.language} 
                  onValueChange={(value) => updatePreferences({ language: value })}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-purple-300">Theme</Label>
                <Select 
                  value={profile.preferences.theme} 
                  onValueChange={(value) => updatePreferences({ theme: value })}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-400">
                <Crown className="w-5 h-5" />
                Choose Your Tier
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {TIERS.map((tier) => (
                  <div
                    key={tier.name}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      profile.tier === tier.name
                        ? "border-blue-400 bg-blue-400/10"
                        : "border-white/10 hover:border-white/20"
                    }`}
                    onClick={() => updateProfile({ tier: tier.name as any })}
                    data-testid={`tier-option-${tier.name.toLowerCase()}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className={`font-semibold ${tier.color}`}>{tier.name}</h3>
                        <p className="text-white text-lg font-bold">{tier.price}</p>
                      </div>
                      {profile.tier === tier.name && (
                        <CheckCircle className="w-5 h-5 text-blue-400" />
                      )}
                    </div>
                    <ul className="text-sm text-white/70 space-y-1">
                      {tier.features.map((feature, idx) => (
                        <li key={idx}>• {feature}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-400">
                <Settings className="w-5 h-5" />
                Privacy & Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-purple-300 mb-3 block">Notification Preferences</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-notif" className="text-white">Email Notifications</Label>
                    <Checkbox
                      id="email-notif"
                      checked={profile.preferences.notifications.email}
                      onCheckedChange={(checked) => 
                        updatePreferences({
                          notifications: { 
                            ...profile.preferences.notifications, 
                            email: !!checked 
                          }
                        })
                      }
                      data-testid="checkbox-email-notifications"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="browser-notif" className="text-white">Browser Notifications</Label>
                    <Checkbox
                      id="browser-notif"
                      checked={profile.preferences.notifications.browser}
                      onCheckedChange={(checked) => 
                        updatePreferences({
                          notifications: { 
                            ...profile.preferences.notifications, 
                            browser: !!checked 
                          }
                        })
                      }
                      data-testid="checkbox-browser-notifications"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-purple-300">Profile Visibility</Label>
                <Select 
                  value={profile.preferences.privacy.profileVisibility} 
                  onValueChange={(value) => 
                    updatePreferences({
                      privacy: { 
                        ...profile.preferences.privacy, 
                        profileVisibility: value 
                      }
                    })
                  }
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="friends">Friends Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-purple-300 mb-3 block">AI Features</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="ai-recommendations" className="text-white">AI Recommendations</Label>
                    <Checkbox
                      id="ai-recommendations"
                      checked={profile.preferences.ai.enableRecommendations}
                      onCheckedChange={(checked) => 
                        updatePreferences({
                          ai: { 
                            ...profile.preferences.ai, 
                            enableRecommendations: !!checked 
                          }
                        })
                      }
                      data-testid="checkbox-ai-recommendations"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-tag" className="text-white">Auto-tagging</Label>
                    <Checkbox
                      id="auto-tag"
                      checked={profile.preferences.ai.autoTag}
                      onCheckedChange={(checked) => 
                        updatePreferences({
                          ai: { 
                            ...profile.preferences.ai, 
                            autoTag: !!checked 
                          }
                        })
                      }
                      data-testid="checkbox-auto-tag"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-400">
                <Sparkles className="w-5 h-5" />
                Welcome to GuardianChain!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center mx-auto">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Your Profile is Complete!
                </h3>
                <p className="text-white/70">
                  You're ready to start preserving truth and building your legacy on the blockchain.
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-lg text-left">
                <h4 className="font-medium text-purple-300 mb-2">Profile Summary:</h4>
                <div className="text-sm space-y-1 text-white/70">
                  <p><strong>Name:</strong> {profile.displayName}</p>
                  <p><strong>Tier:</strong> {profile.tier}</p>
                  <p><strong>Interests:</strong> {profile.interests.slice(0, 3).join(", ")}{profile.interests.length > 3 ? "..." : ""}</p>
                  <p><strong>Language:</strong> {LANGUAGES.find(l => l.code === profile.preferences.language)?.name}</p>
                </div>
              </div>

              <div className="bg-blue-500/10 p-4 rounded-lg">
                <h4 className="font-medium text-blue-400 mb-2">Next Steps:</h4>
                <ul className="text-sm text-white/70 space-y-1 text-left">
                  <li>• Create your first Truth Capsule</li>
                  <li>• Explore the Truth Net</li>
                  <li>• Connect with the community</li>
                  <li>• Start earning GTT tokens</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-yellow-400 mb-2">
            Complete Your Profile
          </h1>
          <p className="text-white/70 mb-6">
            Let's personalize your GuardianChain experience
          </p>

          {/* Progress */}
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm text-white/70 mb-2">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          {renderStep()}

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <Button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
              data-testid="button-previous"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <Button
              onClick={handleNext}
              disabled={saveProfileMutation.isPending || completeMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              data-testid="button-next"
            >
              {currentStep === totalSteps ? (
                completeMutation.isPending ? "Completing..." : "Get Started"
              ) : (
                saveProfileMutation.isPending ? "Saving..." : "Next"
              )}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}