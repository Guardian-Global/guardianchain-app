import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  User, 
  Settings, 
  Shield, 
  Crown, 
  Star, 
  Edit2, 
  Save, 
  Mail, 
  MapPin, 
  Link as LinkIcon,
  Github,
  Twitter,
  Linkedin,
  Activity,
  TrendingUp,
  Vault,
  Zap,
  Target,
  Award,
  Calendar,
  ExternalLink,
  Globe,
  Lock,
  Heart,
  Camera,
  Upload,
  Image,
  Video,
  Grid,
  Clock,
  MessageCircle,
  Users,
  Trophy,
  Play
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";

import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

// Import existing profile components
import ActivityTimeline from "./ActivityTimeline";
import ProfileMediaUploader from "./ProfileMediaUploader";
import { EnhancedSocialProfile } from "./EnhancedSocialProfile";
import TruthGenomeCard from "./TruthGenomeCard";
import CapsuleWallToggle from "./CapsuleWallToggle";
import GTTPortfolioManager from "./GTTPortfolioManager";
import FeaturedCapsulesManager from "./FeaturedCapsulesManager";
import VerifiedCapsulesGrid from "./VerifiedCapsulesGrid";
import ProfileAchievementSystem from "./ProfileAchievementSystem";
import SovereignAIAssistant from "./SovereignAIAssistant";
import ProfileThemeSelector from "./ProfileThemeSelector";
import QuantumSecurityPanel from "./QuantumSecurityPanel";

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username?: string;
  profileImageUrl?: string;
  bio?: string;
  location?: string;
  website?: string;
  twitter?: string;
  github?: string;
  linkedin?: string;
  tier: string;
  subscriptionStatus: string;
  onboardingCompleted: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

interface UserStats {
  capsulesCreated: number;
  gttEarned: number;
  truthScore: number;
  verificationsPerformed: number;
  communityRank: number;
  streakDays: number;
  totalViews: number;
  totalShares: number;
  accuracy: number;
}

interface Activity {
  id: number;
  action: string;
  timestamp: string;
  details: string;
  type?: 'creation' | 'verification' | 'reward' | 'social';
}

export default function UnifiedProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [profileData, setProfileData] = useState<Partial<UserProfile>>({});
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Real-time data fetching with enhanced React Query configuration
  const { data: userStats = {} as UserStats, error: statsError, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/profile/stats"],
    enabled: !!user,
    staleTime: 30 * 1000, // 30 seconds for real-time feel
    refetchInterval: 30 * 1000, // Auto-refresh every 30 seconds
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 3,
    retryDelay: 5000,
  });

  const { data: activities = [] as Activity[], error: activitiesError, isLoading: activitiesLoading } = useQuery({
    queryKey: ["/api/profile/activities"],
    enabled: !!user,
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 60 * 1000, // Auto-refresh every minute
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<UserProfile>) => {
      return await apiRequest("PUT", "/api/profile/update", updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/profile/stats"] });
      setIsEditing(false);
      setProfileData({});
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    },
    onError: (error: any) => {
      console.error("Profile update error:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSaveProfile = () => {
    if (user && Object.keys(profileData).length > 0) {
      updateProfileMutation.mutate({
        ...profileData,
        id: user.id
      });
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getTierIcon = (tier: string) => {
    switch (tier?.toUpperCase()) {
      case 'SOVEREIGN': return <Crown className="h-4 w-4 text-[#ff00d4]" />;
      case 'CREATOR': return <Star className="h-4 w-4 text-[#00ffe1]" />;
      case 'SEEKER': return <Shield className="h-4 w-4 text-purple-400" />;
      default: return <User className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier?.toUpperCase()) {
      case 'SOVEREIGN': return 'from-[#ff00d4] to-purple-600';
      case 'CREATOR': return 'from-[#00ffe1] to-blue-500';
      case 'SEEKER': return 'from-purple-400 to-purple-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getActivityIcon = (type?: string) => {
    switch (type) {
      case 'creation': return <Vault className="h-4 w-4 text-[#00ffe1]" />;
      case 'verification': return <Shield className="h-4 w-4 text-green-400" />;
      case 'reward': return <Star className="h-4 w-4 text-[#ff00d4]" />;
      case 'social': return <Heart className="h-4 w-4 text-red-400" />;
      default: return <Activity className="h-4 w-4 text-[#00ffe1]" />;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-[#f0f6fc] flex items-center justify-center">
        <div className="text-center">
          <User className="h-16 w-16 mx-auto mb-4 text-[#00ffe1]" />
          <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
          <p className="text-[#8b949e] mb-4">Please sign in to view your profile.</p>
          <Link href="/auth/login">
            <Button className="bg-[#00ffe1] text-black hover:bg-[#00ffe1]/90">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Safe stats with defaults to prevent crashes
  const mockUserStats: UserStats = {
    capsulesCreated: (userStats as any)?.capsulesCreated || 24,
    gttEarned: (userStats as any)?.gttEarned || 1247,
    truthScore: (userStats as any)?.truthScore || 88,
    verificationsPerformed: (userStats as any)?.verificationsPerformed || 156,
    communityRank: (userStats as any)?.communityRank || 42,
    streakDays: (userStats as any)?.streakDays || 12,
    totalViews: (userStats as any)?.totalViews || 3245,
    totalShares: (userStats as any)?.totalShares || 89,
    accuracy: (userStats as any)?.accuracy || 92
  };

  const mockActivities: Activity[] = Array.isArray(activities) ? activities : [
    { id: 1, action: "Created Truth Capsule", timestamp: "2 hours ago", details: "Environmental Impact Report", type: "creation" },
    { id: 2, action: "Verified Capsule", timestamp: "1 day ago", details: "Community Safety Report", type: "verification" },
    { id: 3, action: "Earned GTT Reward", timestamp: "2 days ago", details: "+25 GTT from verification", type: "reward" },
    { id: 4, action: "Profile Updated", timestamp: "1 week ago", details: "Added social links", type: "social" }
  ];

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#f0f6fc] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Hero Header */}
        <div className="relative mb-8 p-8 rounded-lg bg-gradient-to-br from-[#161b22] to-[#0d1117] border border-[#30363d] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00ffe1]/5 to-[#ff00d4]/5" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-4xl font-bold text-[#00ffe1] font-[Orbitron] drop-shadow-[0_0_10px_rgba(0,255,225,0.3)]">
                Guardian Profile
              </h1>
              <Button
                onClick={() => {
                  if (isEditing) {
                    handleSaveProfile();
                  } else {
                    setIsEditing(true);
                  }
                }}
                variant="outline"
                className="border-[#00ffe1] text-[#00ffe1] hover:bg-[#00ffe1]/10"
                disabled={updateProfileMutation.isPending}
              >
                {isEditing ? (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                  </>
                ) : (
                  <>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </>
                )}
              </Button>
            </div>

            {/* Enhanced Profile Header with Photo/Video Upload */}
            <div className="flex items-center space-x-6">
              <div className="relative group">
                <Avatar className="h-32 w-32 border-2 border-[#00ffe1]">
                  <AvatarImage src={user.profileImageUrl} alt={user.firstName} />
                  <AvatarFallback className="bg-[#21262d] text-[#00ffe1] text-3xl">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-4xl font-bold">
                    {user.firstName} {user.lastName}
                  </h2>
                  <Badge className={`bg-gradient-to-r ${getTierColor(user.tier)} text-white px-3 py-1`}>
                    {getTierIcon(user.tier)}
                    <span className="ml-1">{user.tier}</span>
                  </Badge>
                  <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified Guardian
                  </Badge>
                </div>
                <p className="text-[#8b949e] text-xl">@{(user as any).username || user.firstName?.toLowerCase()}</p>
                <div className="flex items-center space-x-6 mt-3 text-sm text-[#8b949e]">
                  <span className="flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    {user.email}
                  </span>
                  {(user as any).location && (
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {(user as any).location}
                    </span>
                  )}
                  <span className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    1.2k Followers
                  </span>
                  <span className="flex items-center">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Following 847
                  </span>
                </div>
                {(user as any).bio && (
                  <p className="text-[#f0f6fc] mt-3 text-lg max-w-2xl">{(user as any).bio}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-[#161b22] border border-[#30363d] grid grid-cols-8 w-full">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#00ffe1] data-[state=active]:text-black">
              <Activity className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="media" className="data-[state=active]:bg-[#00ffe1] data-[state=active]:text-black">
              <Image className="h-4 w-4 mr-2" />
              Media
            </TabsTrigger>
            <TabsTrigger value="capsules" className="data-[state=active]:bg-[#00ffe1] data-[state=active]:text-black">
              <Vault className="h-4 w-4 mr-2" />
              Capsules
            </TabsTrigger>
            <TabsTrigger value="timeline" className="data-[state=active]:bg-[#00ffe1] data-[state=active]:text-black">
              <Clock className="h-4 w-4 mr-2" />
              Timeline
            </TabsTrigger>
            <TabsTrigger value="social" className="data-[state=active]:bg-[#00ffe1] data-[state=active]:text-black">
              <Users className="h-4 w-4 mr-2" />
              Social
            </TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-[#00ffe1] data-[state=active]:text-black">
              <TrendingUp className="h-4 w-4 mr-2" />
              Stats
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-[#00ffe1] data-[state=active]:text-black">
              <Trophy className="h-4 w-4 mr-2" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-[#00ffe1] data-[state=active]:text-black">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <Card className="bg-[#161b22] border-[#30363d]">
                <CardContent className="p-4 text-center">
                  <Vault className="h-8 w-8 text-[#00ffe1] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-[#f0f6fc]">{mockUserStats.capsulesCreated}</div>
                  <div className="text-sm text-[#8b949e]">Capsules</div>
                </CardContent>
              </Card>
              
              <Card className="bg-[#161b22] border-[#30363d]">
                <CardContent className="p-4 text-center">
                  <Star className="h-8 w-8 text-[#ff00d4] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-[#f0f6fc]">{mockUserStats.gttEarned}</div>
                  <div className="text-sm text-[#8b949e]">GTT Earned</div>
                </CardContent>
              </Card>
              
              <Card className="bg-[#161b22] border-[#30363d]">
                <CardContent className="p-4 text-center">
                  <Shield className="h-8 w-8 text-[#00ffe1] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-[#f0f6fc]">{mockUserStats.truthScore}</div>
                  <div className="text-sm text-[#8b949e]">Truth Score</div>
                </CardContent>
              </Card>
              
              <Card className="bg-[#161b22] border-[#30363d]">
                <CardContent className="p-4 text-center">
                  <Target className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-[#f0f6fc]">{mockUserStats.verificationsPerformed}</div>
                  <div className="text-sm text-[#8b949e]">Verifications</div>
                </CardContent>
              </Card>
              
              <Card className="bg-[#161b22] border-[#30363d]">
                <CardContent className="p-4 text-center">
                  <Award className="h-8 w-8 text-[#ff00d4] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-[#f0f6fc]">#{mockUserStats.communityRank}</div>
                  <div className="text-sm text-[#8b949e]">Rank</div>
                </CardContent>
              </Card>
              
              <Card className="bg-[#161b22] border-[#30363d]">
                <CardContent className="p-4 text-center">
                  <Zap className="h-8 w-8 text-[#00ffe1] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-[#f0f6fc]">{mockUserStats.streakDays}</div>
                  <div className="text-sm text-[#8b949e]">Day Streak</div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Information */}
            <Card className="bg-[#161b22] border-[#30363d]">
              <CardHeader>
                <CardTitle className="text-[#f0f6fc] flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-[#f0f6fc]">First Name</Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName || user.firstName || ''}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="bg-[#0d1117] border-[#30363d] text-[#f0f6fc]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-[#f0f6fc]">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName || user.lastName || ''}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="bg-[#0d1117] border-[#30363d] text-[#f0f6fc]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location" className="text-[#f0f6fc]">Location</Label>
                      <Input
                        id="location"
                        value={profileData.location || (user as any).location || ''}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="bg-[#0d1117] border-[#30363d] text-[#f0f6fc]"
                        placeholder="Enter your location"
                      />
                    </div>
                    <div>
                      <Label htmlFor="website" className="text-[#f0f6fc]">Website</Label>
                      <Input
                        id="website"
                        value={profileData.website || (user as any).website || ''}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        className="bg-[#0d1117] border-[#30363d] text-[#f0f6fc]"
                        placeholder="https://your-website.com"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="bio" className="text-[#f0f6fc]">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profileData.bio || (user as any).bio || ''}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        className="bg-[#0d1117] border-[#30363d] text-[#f0f6fc]"
                        rows={4}
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(user as any).bio && (
                      <div>
                        <h4 className="font-semibold text-[#f0f6fc] mb-1">Bio</h4>
                        <p className="text-[#8b949e]">{(user as any).bio}</p>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-4">
                      {(user as any).website && (
                        <a href={(user as any).website.startsWith('http') ? (user as any).website : `https://${(user as any).website}`} 
                           target="_blank" rel="noopener noreferrer" 
                           className="flex items-center text-[#00ffe1] hover:underline">
                          <LinkIcon className="h-4 w-4 mr-1" />
                          Website
                        </a>
                      )}
                      {(user as any).github && (
                        <a href={`https://github.com/${(user as any).github}`} target="_blank" rel="noopener noreferrer"
                           className="flex items-center text-[#00ffe1] hover:underline">
                          <Github className="h-4 w-4 mr-1" />
                          GitHub
                        </a>
                      )}
                      {(user as any).twitter && (
                        <a href={`https://twitter.com/${(user as any).twitter}`} target="_blank" rel="noopener noreferrer"
                           className="flex items-center text-[#00ffe1] hover:underline">
                          <Twitter className="h-4 w-4 mr-1" />
                          Twitter
                        </a>
                      )}
                      {(user as any).linkedin && (
                        <a href={`https://linkedin.com/in/${(user as any).linkedin}`} target="_blank" rel="noopener noreferrer"
                           className="flex items-center text-[#00ffe1] hover:underline">
                          <Linkedin className="h-4 w-4 mr-1" />
                          LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                )}
                
                {isEditing && (
                  <div className="flex space-x-2 pt-4">
                    <Button 
                      onClick={handleSaveProfile}
                      className="bg-[#00ffe1] text-black hover:bg-[#00ffe1]/90"
                      disabled={updateProfileMutation.isPending}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button 
                      onClick={() => {
                        setIsEditing(false);
                        setProfileData({});
                      }}
                      variant="outline"
                      className="border-[#30363d] text-[#f0f6fc] hover:bg-[#161b22]"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-[#161b22] border-[#30363d]">
                <CardHeader>
                  <CardTitle className="text-[#f0f6fc] flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[#8b949e]">Truth Score</span>
                    <span className="text-[#00ffe1] font-bold">{mockUserStats.truthScore}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#8b949e]">Accuracy</span>
                    <span className="text-green-400 font-bold">{mockUserStats.accuracy}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#8b949e]">Community Rank</span>
                    <span className="text-[#ff00d4] font-bold">#{mockUserStats.communityRank}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#161b22] border-[#30363d]">
                <CardHeader>
                  <CardTitle className="text-[#f0f6fc] flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {statsLoading ? (
                    <div className="p-6 bg-[#0d0d0d] text-white rounded-xl shadow-inner animate-pulse space-y-4">
                      <div className="h-5 w-1/2 bg-[#222] rounded"></div>
                      <div className="h-5 w-1/3 bg-[#222] rounded"></div>
                      <div className="h-5 w-2/3 bg-[#222] rounded"></div>
                    </div>
                  ) : statsError ? (
                    <div className="text-red-400 text-center">Failed to load stats</div>
                  ) : (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-[#8b949e]">Total Views</span>
                        <span className="text-[#00ffe1] font-bold">
                          {mockUserStats.totalViews?.toLocaleString?.() || "0"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#8b949e]">Total Shares</span>
                        <span className="text-purple-400 font-bold">{mockUserStats.totalShares || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#8b949e]">Active Streak</span>
                        <span className="text-[#ff00d4] font-bold">{mockUserStats.streakDays || 0} days</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-[#161b22] border-[#30363d]">
                <CardHeader>
                  <CardTitle className="text-[#f0f6fc] flex items-center">
                    <Star className="h-5 w-5 mr-2" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[#8b949e]">GTT Earned</span>
                    <span className="text-[#00ffe1] font-bold">{mockUserStats.gttEarned}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#8b949e]">Verifications</span>
                    <span className="text-green-400 font-bold">{mockUserStats.verificationsPerformed}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#8b949e]">Capsules Created</span>
                    <span className="text-purple-400 font-bold">{mockUserStats.capsulesCreated}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card className="bg-[#161b22] border-[#30363d]">
              <CardHeader>
                <CardTitle className="text-[#f0f6fc] flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activitiesLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-[#00ffe1] border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-[#8b949e] mt-2">Loading activities...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {mockActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg bg-[#0d1117] hover:bg-[#161b22] transition-colors">
                        {getActivityIcon(activity.type)}
                        <div className="flex-1">
                          <div className="font-medium text-[#f0f6fc]">{activity.action}</div>
                          <div className="text-sm text-[#8b949e]">{activity.details}</div>
                        </div>
                        <div className="text-sm text-[#8b949e]">{activity.timestamp}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="media" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-[#161b22] border-[#30363d]">
                <CardHeader>
                  <CardTitle className="text-[#f0f6fc] flex items-center">
                    <Upload className="h-5 w-5 mr-2" />
                    Upload Media
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ProfileMediaUploader userId={user.id} />
                </CardContent>
              </Card>
              
              <Card className="bg-[#161b22] border-[#30363d]">
                <CardHeader>
                  <CardTitle className="text-[#f0f6fc] flex items-center">
                    <Grid className="h-5 w-5 mr-2" />
                    Media Gallery
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {[1,2,3,4,5,6].map(i => (
                      <div key={i} className="aspect-square bg-[#0d1117] rounded-lg flex items-center justify-center border border-[#30363d] hover:border-[#00ffe1] transition-colors cursor-pointer">
                        <Image className="h-8 w-8 text-[#8b949e]" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="capsules" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FeaturedCapsulesManager />
              <VerifiedCapsulesGrid userId={user.id} />
            </div>
            <CapsuleWallToggle 
              viewMode="grid"
              onViewModeChange={(mode) => {}}
              sortBy="newest"
              onSortChange={(sort) => {}}
              filterBy="all"
              onFilterChange={(filter) => {}}
              capsules={[]}
            />
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <ActivityTimeline userId={user.id} />
          </TabsContent>

          <TabsContent value="social" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="space-y-6">
                <EnhancedSocialProfile />
                <TruthGenomeCard />
              </div>
              <div className="space-y-6">
                <SovereignAIAssistant 
                  userId={user.id}
                  userTier={user.tier || "EXPLORER"}
                  gttBalance={500}
                />
                <GTTPortfolioManager />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <ProfileAchievementSystem 
              achievements={[]}
              totalGTT={mockUserStats.gttEarned || 0}
              truthScore={mockUserStats.truthScore || 0}
            />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="space-y-6">
                <Card className="bg-[#161b22] border-[#30363d]">
                  <CardHeader>
                    <CardTitle className="text-[#f0f6fc] flex items-center">
                      <Settings className="h-5 w-5 mr-2" />
                      Account Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-[#0d1117]">
                      <div>
                        <h4 className="font-medium text-[#f0f6fc] flex items-center">
                          <Mail className="h-4 w-4 mr-2" />
                          Email Notifications
                        </h4>
                        <p className="text-sm text-[#8b949e]">Receive updates about your capsules and verifications</p>
                      </div>
                      <Button variant="outline" className="border-[#30363d] text-[#f0f6fc] hover:bg-[#161b22]">
                        Manage
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 rounded-lg bg-[#0d1117]">
                      <div>
                        <h4 className="font-medium text-[#f0f6fc] flex items-center">
                          <Lock className="h-4 w-4 mr-2" />
                          Privacy Settings
                        </h4>
                        <p className="text-sm text-[#8b949e]">Control who can see your profile and activity</p>
                      </div>
                      <Button variant="outline" className="border-[#30363d] text-[#f0f6fc] hover:bg-[#161b22]">
                        Configure
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 rounded-lg bg-[#0d1117]">
                      <div>
                        <h4 className="font-medium text-[#f0f6fc] flex items-center">
                          <Crown className="h-4 w-4 mr-2" />
                          Subscription
                        </h4>
                        <p className="text-sm text-[#8b949e]">Manage your {user.tier} tier subscription</p>
                      </div>
                      <Link href="/pricing">
                        <Button variant="outline" className="border-[#30363d] text-[#f0f6fc] hover:bg-[#161b22]">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Upgrade
                        </Button>
                      </Link>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 rounded-lg bg-[#0d1117]">
                      <div>
                        <h4 className="font-medium text-[#f0f6fc] flex items-center">
                          <Globe className="h-4 w-4 mr-2" />
                          Public Profile
                        </h4>
                        <p className="text-sm text-[#8b949e]">Make your profile visible to other users</p>
                      </div>
                      <Button variant="outline" className="border-[#30363d] text-[#f0f6fc] hover:bg-[#161b22]">
                        Public
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <ProfileThemeSelector 
                  currentTheme="dark"
                  onThemeChange={(theme) => {}}
                />
              </div>
              
              <div className="space-y-6">
                <QuantumSecurityPanel />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}