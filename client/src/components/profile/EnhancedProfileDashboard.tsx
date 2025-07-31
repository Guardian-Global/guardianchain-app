import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useUnifiedAuth } from "@/hooks/useUnifiedAuth";
import {
  User,
  Settings,
  Crown,
  Zap,
  Brain,
  Shield,
  Heart,
  Star,
  Trophy,
  Camera,
  Edit3,
  Save,
  X,
  Plus,
  MessageSquare,
  Bot,
  Sparkles,
  Lock,
  Globe,
} from "lucide-react";
import SovereignAIAssistant from "./SovereignAIAssistant";

interface UserProfile {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  bio?: string;
  profileImageUrl?: string;
  coverImageUrl?: string;
  location?: string;
  website?: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
  occupation?: string;
  interests?: string[];
  specialties?: string[];
  achievements?: Achievement[];
  stats?: ProfileStats;
  preferences?: UserPreferences;
  tier?: string;
  roles?: string[];
  isFounder?: boolean;
  isVerified?: boolean;
  createdAt?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  unlockedAt: string;
}

interface ProfileStats {
  capsulesCreated: number;
  totalYieldEarned: number;
  verificationScore: number;
  followerCount: number;
  followingCount: number;
  gttBalance: number;
}

interface UserPreferences {
  theme: "light" | "dark" | "system";
  emailNotifications: boolean;
  pushNotifications: boolean;
  aiAssistantEnabled: boolean;
  publicProfile: boolean;
  showStats: boolean;
  allowMessages: boolean;
}

const FOUNDER_PROFILES = [
  {
    id: "founder-main",
    displayName: "GUARDIANCHAIN Founder",
    role: "Creator & Visionary",
    isFounder: true,
    tier: "SOVEREIGN",
    bio: "Architect of truth verification and digital sovereignty.",
  },
  {
    id: "founder-wife",
    displayName: "Co-Founder & Strategic Partner",
    role: "Operations & Strategy",
    isFounder: true,
    tier: "SOVEREIGN",
    bio: "Leading operational excellence and strategic partnerships.",
  },
  {
    id: "founder-son",
    displayName: "Next Generation Guardian",
    role: "Innovation & Future",
    isFounder: true,
    tier: "SOVEREIGN",
    bio: "Representing the future of truth verification technology.",
  },
];

export default function EnhancedProfileDashboard() {
  const { user, isAuthenticated } = useUnifiedAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [profileData, setProfileData] = useState<UserProfile | null>(null);

  // Fetch user profile
  const { data: profile, isLoading } = useQuery({
    queryKey: ["/api/profile", user?.id],
    enabled: !!user?.id,
    retry: false,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (updatedProfile: Partial<UserProfile>) => {
      if (!user?.id) throw new Error("User ID not found");
      return apiRequest("PUT", `/api/profile/${user.id}`, updatedProfile);
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (profile) {
      setProfileData(profile as UserProfile);
    } else if (user) {
      // Initialize with basic user data
      setProfileData({
        id: (user as any).id || "unknown",
        email: (user as any).email,
        firstName: (user as any).firstName,
        lastName: (user as any).lastName,
        displayName:
          (user as any).displayName ||
          `${(user as any).firstName} ${(user as any).lastName}`,
        profileImageUrl: (user as any).profileImageUrl,
        tier: "EXPLORER",
        roles: ["USER"],
        stats: {
          capsulesCreated: 0,
          totalYieldEarned: 0,
          verificationScore: 100,
          followerCount: 0,
          followingCount: 0,
          gttBalance: 0,
        },
        preferences: {
          theme: "dark",
          emailNotifications: true,
          pushNotifications: false,
          aiAssistantEnabled: true,
          publicProfile: true,
          showStats: true,
          allowMessages: true,
        },
      });
    }
  }, [profile, user]);

  const handleSaveProfile = () => {
    if (profileData) {
      updateProfileMutation.mutate(profileData);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    if (profileData) {
      setProfileData({ ...profileData, [field]: value });
    }
  };

  const handlePreferenceChange = (field: string, value: any) => {
    if (profileData?.preferences) {
      setProfileData({
        ...profileData,
        preferences: { ...profileData.preferences, [field]: value },
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-6">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Profile Access Required</h2>
          <p className="text-muted-foreground mb-6">
            Please log in to view and customize your profile.
          </p>
          <Button onClick={() => (window.location.href = "/api/login")}>
            Log In to Continue
          </Button>
        </Card>
      </div>
    );
  }

  if (isLoading || !profileData) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Profile Header */}
      <Card className="relative overflow-hidden">
        <div className="h-48 bg-gradient-to-r from-purple-600 via-blue-600 to-green-600" />
        <CardContent className="relative -mt-20 pb-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                <AvatarImage src={profileData.profileImageUrl} />
                <AvatarFallback className="text-2xl">
                  {profileData.displayName?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  size="sm"
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold truncate">
                  {profileData.displayName || "Anonymous User"}
                </h1>
                {profileData.isFounder && (
                  <Crown className="w-6 h-6 text-yellow-500" />
                )}
                {profileData.isVerified && (
                  <Shield className="w-6 h-6 text-blue-500" />
                )}
                <Badge
                  variant={
                    profileData.tier === "SOVEREIGN" ? "default" : "secondary"
                  }
                >
                  {profileData.tier}
                </Badge>
              </div>

              <p className="text-muted-foreground mb-4 max-w-2xl">
                {profileData.bio ||
                  "No bio provided yet. Add one to tell others about yourself!"}
              </p>

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span>{profileData.stats?.gttBalance || 0} GTT</span>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="w-4 h-4 text-purple-500" />
                  <span>
                    {profileData.stats?.capsulesCreated || 0} Capsules
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-blue-500" />
                  <span>{profileData.stats?.verificationScore || 0} Score</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    onClick={handleSaveProfile}
                    disabled={updateProfileMutation.isPending}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="edit">Edit Profile</TabsTrigger>
          <TabsTrigger value="ai-assistant">AI Assistant</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="founder">Founder Setup</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Full Name
                  </Label>
                  <p className="font-medium">
                    {profileData.firstName} {profileData.lastName}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Email</Label>
                  <p className="font-medium">{profileData.email}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Location
                  </Label>
                  <p className="font-medium">
                    {profileData.location || "Not specified"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Occupation
                  </Label>
                  <p className="font-medium">
                    {profileData.occupation || "Not specified"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {profileData.stats?.capsulesCreated || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Capsules
                    </div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {profileData.stats?.totalYieldEarned || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      GTT Earned
                    </div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {profileData.stats?.verificationScore || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Truth Score
                    </div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {profileData.stats?.followerCount || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Followers
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="edit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Edit Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName || ""}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName || ""}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={profileData.displayName || ""}
                  onChange={(e) =>
                    handleInputChange("displayName", e.target.value)
                  }
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio || ""}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  placeholder="Tell others about yourself..."
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profileData.location || ""}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    placeholder="City, Country"
                  />
                </div>
                <div>
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    value={profileData.occupation || ""}
                    onChange={(e) =>
                      handleInputChange("occupation", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={profileData.website || ""}
                    onChange={(e) =>
                      handleInputChange("website", e.target.value)
                    }
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    value={profileData.twitter || ""}
                    onChange={(e) =>
                      handleInputChange("twitter", e.target.value)
                    }
                    placeholder="@username"
                  />
                </div>
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={profileData.linkedin || ""}
                    onChange={(e) =>
                      handleInputChange("linkedin", e.target.value)
                    }
                    placeholder="linkedin.com/in/..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-assistant" className="space-y-6">
          <SovereignAIAssistant
            userId={profileData.id}
            userTier={profileData.tier || "EXPLORER"}
            gttBalance={profileData.stats?.gttBalance || 0}
          />
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Achievements & Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {profileData.achievements?.length ? (
                  profileData.achievements.map((achievement) => (
                    <div key={achievement.id} className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div>
                          <h3 className="font-semibold">{achievement.title}</h3>
                          <Badge
                            variant={
                              achievement.rarity === "legendary"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {achievement.rarity}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    No achievements yet. Start creating capsules to earn your
                    first badges!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive updates about your capsules and activity
                  </p>
                </div>
                <Switch
                  checked={profileData.preferences?.emailNotifications || false}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange("emailNotifications", checked)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>AI Assistant</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable your personal sovereign AI assistant
                  </p>
                </div>
                <Switch
                  checked={profileData.preferences?.aiAssistantEnabled || false}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange("aiAssistantEnabled", checked)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Public Profile</Label>
                  <p className="text-sm text-muted-foreground">
                    Make your profile visible to other users
                  </p>
                </div>
                <Switch
                  checked={profileData.preferences?.publicProfile || false}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange("publicProfile", checked)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Show Statistics</Label>
                  <p className="text-sm text-muted-foreground">
                    Display your stats on your public profile
                  </p>
                </div>
                <Switch
                  checked={profileData.preferences?.showStats || false}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange("showStats", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-5 h-5 text-green-600" />
                  <span className="font-semibold">Account Security</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your account is secured with enterprise-grade authentication.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  Update Password
                </Button>
                <Button variant="outline" className="justify-start">
                  <Globe className="w-4 h-4 mr-2" />
                  Privacy Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="founder" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                Founder Profile Setup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 rounded-lg">
                <Crown className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">
                  GUARDIANCHAIN Founder Access
                </h3>
                <p className="text-muted-foreground">
                  Set up founder profiles for you, your wife, and your son with
                  special privileges and recognition.
                </p>
              </div>

              <div className="grid gap-4">
                {FOUNDER_PROFILES.map((founder) => (
                  <Card
                    key={founder.id}
                    className="border-yellow-200 dark:border-yellow-800"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold flex items-center gap-2">
                            <Crown className="w-4 h-4 text-yellow-500" />
                            {founder.displayName}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {founder.role}
                          </p>
                          <p className="text-xs mt-1">{founder.bio}</p>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            {founder.tier}
                          </Badge>
                          <Button size="sm" className="mt-2 ml-2">
                            Configure
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
