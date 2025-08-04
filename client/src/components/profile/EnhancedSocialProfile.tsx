import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Twitter, Github, Linkedin, Instagram, Youtube, Twitch, TikTok, Discord,
  Facebook, Snapchat, Reddit, Pinterest, Medium, Dribbble, Behance, 
  Globe, Mail, Phone, MapPin, Calendar, Camera, Edit3, Save, 
  Users, Heart, MessageCircle, Share2, Trophy, Star, Award,
  Verified, Shield, Crown, Zap, Gem
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SocialLink {
  platform: string;
  username: string;
  url: string;
  verified: boolean;
}

interface ProfileData {
  displayName: string;
  bio: string;
  location: string;
  website: string;
  email: string;
  phone: string;
  birthDate: string;
  avatarUrl: string;
  coverImageUrl: string;
  socialLinks: SocialLink[];
  interests: string[];
  achievements: string[];
  truthScore: number;
  followers: number;
  following: number;
  capsuleCount: number;
  verificationLevel: string;
  customBadges: string[];
}

const socialPlatforms = [
  { name: "Twitter", icon: Twitter, color: "#1da1f2", placeholder: "@username" },
  { name: "GitHub", icon: Github, color: "#333", placeholder: "username" },
  { name: "LinkedIn", icon: Linkedin, color: "#0077b5", placeholder: "in/username" },
  { name: "Instagram", icon: Instagram, color: "#e4405f", placeholder: "@username" },
  { name: "YouTube", icon: Youtube, color: "#ff0000", placeholder: "@channel" },
  { name: "Twitch", icon: Twitch, color: "#9146ff", placeholder: "username" },
  { name: "TikTok", icon: TikTok, color: "#000", placeholder: "@username" },
  { name: "Discord", icon: Discord, color: "#5865f2", placeholder: "username#0000" },
  { name: "Facebook", icon: Facebook, color: "#1877f2", placeholder: "username" },
  { name: "Snapchat", icon: Snapchat, color: "#fffc00", placeholder: "@username" },
  { name: "Reddit", icon: Reddit, color: "#ff4500", placeholder: "u/username" },
  { name: "Pinterest", icon: Pinterest, color: "#bd081c", placeholder: "@username" },
  { name: "Medium", icon: Medium, color: "#00ab6c", placeholder: "@username" },
  { name: "Dribbble", icon: Dribbble, color: "#ea4c89", placeholder: "username" },
  { name: "Behance", icon: Behance, color: "#1769ff", placeholder: "username" },
];

export function EnhancedSocialProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    displayName: "Digital Guardian",
    bio: "Protecting truth in the digital age. Blockchain enthusiast and truth vault creator.",
    location: "Global Network",
    website: "https://guardianchain.app",
    email: "",
    phone: "",
    birthDate: "",
    avatarUrl: "",
    coverImageUrl: "",
    socialLinks: [],
    interests: ["Blockchain", "Truth Verification", "Digital Privacy", "Cybersecurity"],
    achievements: ["Early Adopter", "Truth Seeker", "Community Builder"],
    truthScore: 87,
    followers: 1247,
    following: 543,
    capsuleCount: 23,
    verificationLevel: "Guardian",
    customBadges: ["Founder", "Verified", "Premium"]
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const saveProfileMutation = useMutation({
    mutationFn: async (data: Partial<ProfileData>) => {
      return await apiRequest("PUT", "/api/user/profile", data);
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been saved successfully.",
      });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSaveProfile = () => {
    saveProfileMutation.mutate(profileData);
  };

  const addSocialLink = (platform: string, username: string) => {
    const platformData = socialPlatforms.find(p => p.name === platform);
    if (!platformData || !username) return;

    const newLink: SocialLink = {
      platform,
      username,
      url: `https://${platform.toLowerCase()}.com/${username}`,
      verified: false
    };

    setProfileData(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, newLink]
    }));
  };

  const removeSocialLink = (platform: string) => {
    setProfileData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter(link => link.platform !== platform)
    }));
  };

  const getVerificationBadge = (level: string) => {
    switch (level) {
      case "Guardian": return <Shield className="w-5 h-5 text-[#00ffe1]" />;
      case "Sovereign": return <Crown className="w-5 h-5 text-[#ff00d4]" />;
      case "Verified": return <Verified className="w-5 h-5 text-[#10b981]" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#f0f6fc] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="relative mb-8">
          {/* Cover Image */}
          <div className="h-64 bg-gradient-to-br from-[#00ffe1]/20 via-[#ff00d4]/20 to-[#7c3aed]/20 rounded-lg border border-[#30363d] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#161b22]/80 to-[#0d1117]/80" />
            {profileData.coverImageUrl && (
              <img src={profileData.coverImageUrl} alt="Cover" className="w-full h-full object-cover" />
            )}
            {isEditing && (
              <Button 
                size="sm" 
                className="absolute top-4 right-4 bg-[#21262d] border border-[#30363d]"
              >
                <Camera className="w-4 h-4 mr-2" />
                Change Cover
              </Button>
            )}
          </div>

          {/* Avatar and Basic Info */}
          <div className="relative -mt-16 px-8">
            <div className="flex flex-col md:flex-row md:items-end gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-[#0d1117] bg-gradient-to-br from-[#00ffe1] to-[#ff00d4] p-1">
                  <div className="w-full h-full rounded-full bg-[#161b22] flex items-center justify-center">
                    {profileData.avatarUrl ? (
                      <img src={profileData.avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <Users className="w-12 h-12 text-[#8b949e]" />
                    )}
                  </div>
                </div>
                {isEditing && (
                  <Button size="sm" className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0">
                    <Camera className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="flex-1 mb-4">
                <div className="flex items-center gap-3 mb-2">
                  {isEditing ? (
                    <Input
                      value={profileData.displayName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
                      className="text-2xl font-bold bg-[#21262d] border-[#30363d] text-[#f0f6fc]"
                    />
                  ) : (
                    <h1 className="text-3xl font-bold text-[#f0f6fc]">{profileData.displayName}</h1>
                  )}
                  {getVerificationBadge(profileData.verificationLevel)}
                  {profileData.customBadges.map((badge) => (
                    <Badge key={badge} variant="outline" className="border-[#00ffe1] text-[#00ffe1]">
                      {badge}
                    </Badge>
                  ))}
                </div>
                
                {isEditing ? (
                  <Textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    className="bg-[#21262d] border-[#30363d] text-[#8b949e] resize-none"
                    rows={3}
                  />
                ) : (
                  <p className="text-[#8b949e] max-w-2xl">{profileData.bio}</p>
                )}

                <div className="flex items-center gap-6 mt-4 text-sm text-[#8b949e]">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {isEditing ? (
                      <Input
                        value={profileData.location}
                        onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                        className="bg-[#21262d] border-[#30363d] h-6 text-xs"
                        placeholder="Location"
                      />
                    ) : (
                      <span>{profileData.location}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    {isEditing ? (
                      <Input
                        value={profileData.website}
                        onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                        className="bg-[#21262d] border-[#30363d] h-6 text-xs"
                        placeholder="Website"
                      />
                    ) : (
                      <a href={profileData.website} className="text-[#00ffe1] hover:underline">
                        {profileData.website}
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined 2025</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                {isEditing ? (
                  <>
                    <Button 
                      onClick={handleSaveProfile}
                      disabled={saveProfileMutation.isPending}
                      className="bg-[#00ffe1] text-[#0d1117] hover:bg-[#00e5cb]"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Profile
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditing(false)}
                      className="border-[#30363d] text-[#8b949e]"
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={() => setIsEditing(true)}
                    variant="outline" 
                    className="border-[#30363d] text-[#8b949e] hover:border-[#00ffe1] hover:text-[#00ffe1]"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-6 text-sm">
              <div className="text-center">
                <div className="text-xl font-bold text-[#f0f6fc]">{profileData.followers.toLocaleString()}</div>
                <div className="text-[#8b949e]">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-[#f0f6fc]">{profileData.following.toLocaleString()}</div>
                <div className="text-[#8b949e]">Following</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-[#f0f6fc]">{profileData.capsuleCount}</div>
                <div className="text-[#8b949e]">Capsules</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-[#00ffe1]">{profileData.truthScore}</div>
                <div className="text-[#8b949e]">Truth Score</div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-[#161b22] border-[#30363d] p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#00ffe1] data-[state=active]:text-[#0d1117]">
              Overview
            </TabsTrigger>
            <TabsTrigger value="social" className="data-[state=active]:bg-[#ff00d4] data-[state=active]:text-[#0d1117]">
              Social Links
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-[#7c3aed] data-[state=active]:text-[#0d1117]">
              Achievements
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-[#10b981] data-[state=active]:text-[#0d1117]">
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-[#161b22] border-[#30363d]">
                <CardHeader>
                  <CardTitle className="text-[#f0f6fc] flex items-center gap-2">
                    <Star className="w-5 h-5 text-[#f79009]" />
                    Interests
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {profileData.interests.map((interest) => (
                    <Badge key={interest} variant="outline" className="border-[#00ffe1] text-[#00ffe1]">
                      {interest}
                    </Badge>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-[#161b22] border-[#30363d]">
                <CardHeader>
                  <CardTitle className="text-[#f0f6fc] flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-[#ff00d4]" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[#8b949e]">Truth Score</span>
                    <span className="text-[#00ffe1] font-semibold">{profileData.truthScore}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8b949e]">Verification Level</span>
                    <span className="text-[#ff00d4] font-semibold">{profileData.verificationLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8b949e]">Active Since</span>
                    <span className="text-[#f0f6fc] font-semibold">2025</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="social" className="space-y-6">
            <Card className="bg-[#161b22] border-[#30363d]">
              <CardHeader>
                <CardTitle className="text-[#f0f6fc]">Social Media Profiles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {socialPlatforms.map((platform) => {
                      const existingLink = profileData.socialLinks.find(link => link.platform === platform.name);
                      if (existingLink) return null;

                      return (
                        <div key={platform.name} className="flex items-center gap-3 p-3 bg-[#21262d] rounded-lg border border-[#30363d]">
                          <platform.icon className="w-5 h-5" style={{ color: platform.color }} />
                          <div className="flex-1">
                            <Input
                              placeholder={platform.placeholder}
                              className="bg-[#0d1117] border-[#30363d] h-8 text-sm"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  const target = e.target as HTMLInputElement;
                                  addSocialLink(platform.name, target.value);
                                  target.value = '';
                                }
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profileData.socialLinks.map((link) => {
                    const platform = socialPlatforms.find(p => p.name === link.platform);
                    if (!platform) return null;

                    return (
                      <div key={link.platform} className="flex items-center gap-3 p-4 bg-[#21262d] rounded-lg border border-[#30363d] hover:border-[#00ffe1]/30 transition-all">
                        <platform.icon className="w-6 h-6" style={{ color: platform.color }} />
                        <div className="flex-1">
                          <div className="font-semibold text-[#f0f6fc]">{link.platform}</div>
                          <div className="text-sm text-[#8b949e]">{link.username}</div>
                        </div>
                        {link.verified && (
                          <Verified className="w-5 h-5 text-[#10b981]" />
                        )}
                        {isEditing && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-[#f85149] text-[#f85149] hover:bg-[#f85149]/10"
                            onClick={() => removeSocialLink(link.platform)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profileData.achievements.map((achievement) => (
                <Card key={achievement} className="bg-[#161b22] border-[#30363d] hover:border-[#00ffe1]/30 transition-all">
                  <CardContent className="p-6 text-center">
                    <Award className="w-12 h-12 text-[#f79009] mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-[#f0f6fc] mb-2">{achievement}</h3>
                    <p className="text-sm text-[#8b949e]">Earned for outstanding contribution to the platform</p>
                  </CardContent>
                </Card>
              ))}
              
              <Card className="bg-[#161b22] border-[#30363d] border-dashed opacity-50">
                <CardContent className="p-6 text-center">
                  <Zap className="w-12 h-12 text-[#8b949e] mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-[#8b949e] mb-2">More to Come</h3>
                  <p className="text-sm text-[#8b949e]">Keep contributing to unlock new achievements</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card className="bg-[#161b22] border-[#30363d]">
              <CardHeader>
                <CardTitle className="text-[#f0f6fc]">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-[#21262d] rounded-lg">
                  <Heart className="w-8 h-8 text-[#ff00d4]" />
                  <div className="flex-1">
                    <div className="font-semibold text-[#f0f6fc]">Created new truth capsule</div>
                    <div className="text-sm text-[#8b949e]">2 hours ago</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-[#21262d] rounded-lg">
                  <MessageCircle className="w-8 h-8 text-[#00ffe1]" />
                  <div className="flex-1">
                    <div className="font-semibold text-[#f0f6fc]">Verified community capsule</div>
                    <div className="text-sm text-[#8b949e]">5 hours ago</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-[#21262d] rounded-lg">
                  <Share2 className="w-8 h-8 text-[#7c3aed]" />
                  <div className="flex-1">
                    <div className="font-semibold text-[#f0f6fc]">Shared truth lineage</div>
                    <div className="text-sm text-[#8b949e]">1 day ago</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}