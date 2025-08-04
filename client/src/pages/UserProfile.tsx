import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  User, 
  Settings, 
  Shield, 
  Edit3, 
  Save, 
  Camera,
  Lock,
  Unlock,
  Crown,
  Trophy,
  BarChart3,
  FileText,
  Calendar,
  MapPin,
  Globe,
  Mail,
  Phone,
  Link as LinkIcon,
  Sparkles,
  Layout
} from 'lucide-react';
import CustomizableDashboard from '@/components/CustomizableDashboard';

interface UserProfileData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  bio?: string;
  location?: string;
  website?: string;
  twitter?: string;
  linkedin?: string;
  avatar?: string;
  banner?: string;
  tier: string;
  truthScore: number;
  gttEarned: number;
  capsulesCreated: number;
  verification: {
    email: boolean;
    phone: boolean;
    identity: boolean;
    wallet: boolean;
  };
  privacy: {
    profilePublic: boolean;
    showEmail: boolean;
    showStats: boolean;
    allowMessages: boolean;
  };
  preferences: {
    notifications: boolean;
    newsletter: boolean;
    darkMode: boolean;
    language: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function UserProfile() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);

  const { data: profileData, isLoading } = useQuery<UserProfileData>({
    queryKey: ['/api/profile'],
    enabled: isAuthenticated
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<UserProfileData>) => {
      return apiRequest('PUT', '/api/profile', updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/profile'] });
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      setIsEditing(false);
      setEditingSection(null);
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      });
    }
  });

  const { data: userCapsules } = useQuery({
    queryKey: ['/api/capsules/user'],
    enabled: isAuthenticated
  });

  const { data: userStats } = useQuery({
    queryKey: ['/api/user/detailed-stats'],
    enabled: isAuthenticated
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <Card className="bg-[#161b22] border-[#30363d] p-8">
          <CardContent className="text-center">
            <Lock className="w-16 h-16 mx-auto mb-4 text-[#8b949e]" />
            <h2 className="text-2xl font-bold text-[#f0f6fc] mb-4">Access Restricted</h2>
            <p className="text-[#8b949e] mb-6">Please log in to view your profile.</p>
            <Button className="bg-[#00ffe1] text-[#0d1117] hover:bg-[#00e5cb]">
              Log In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#00ffe1] border-t-transparent rounded-full" />
      </div>
    );
  }

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'explorer': return 'from-[#00ffe1] to-[#059669]';
      case 'seeker': return 'from-[#ff00d4] to-[#c21cac]';
      case 'creator': return 'from-[#7c3aed] to-[#5b21b6]';
      case 'sovereign': return 'from-[#f59e0b] to-[#d97706]';
      default: return 'from-[#8b949e] to-[#6b7280]';
    }
  };

  const handleSaveProfile = (updates: Partial<UserProfileData>) => {
    updateProfileMutation.mutate(updates);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#f0f6fc] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="relative mb-8">
          {/* Banner */}
          <div className="h-48 bg-gradient-to-r from-[#161b22] to-[#0d1117] rounded-xl overflow-hidden relative">
            {profileData?.banner && (
              <img 
                src={profileData.banner} 
                alt="Profile Banner" 
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
            
            {/* Edit Banner Button */}
            <Button
              size="sm"
              variant="outline"
              className="absolute top-4 right-4 border-white/20 text-white hover:bg-white/10"
              onClick={() => setEditingSection('banner')}
            >
              <Camera className="w-4 h-4 mr-2" />
              Change Banner
            </Button>
          </div>
          
          {/* Avatar and Basic Info */}
          <div className="relative -mt-16 ml-8">
            <div className="flex items-end gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-[#0d1117] overflow-hidden bg-gradient-to-br from-[#00ffe1] to-[#7c3aed] flex items-center justify-center">
                  {profileData?.avatar ? (
                    <img 
                      src={profileData.avatar} 
                      alt="Profile Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-white" />
                  )}
                </div>
                
                <Button
                  size="sm"
                  className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-[#00ffe1] text-[#0d1117] hover:bg-[#00e5cb]"
                  onClick={() => setEditingSection('avatar')}
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-[#f0f6fc]">
                    {profileData?.displayName || `${profileData?.firstName} ${profileData?.lastName}`}
                  </h1>
                  
                  <Badge 
                    className={`bg-gradient-to-r ${getTierColor(profileData?.tier || '')} text-white border-none`}
                  >
                    <Crown className="w-4 h-4 mr-1" />
                    {profileData?.tier}
                  </Badge>
                </div>
                
                <p className="text-[#8b949e] mb-3">
                  {profileData?.bio || "No bio added yet."}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-[#8b949e]">
                  {profileData?.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{profileData.location}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(profileData?.createdAt || '').toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="ml-auto pb-4">
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-[#30363d] text-[#f0f6fc] hover:bg-[#21262d]"
                >
                  {isEditing ? (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-[#161b22] border border-[#30363d]">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#00ffe1] data-[state=active]:text-[#0d1117]">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="capsules" className="data-[state=active]:bg-[#ff00d4] data-[state=active]:text-white">
              <FileText className="w-4 h-4 mr-2" />
              Capsules
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-[#7c3aed] data-[state=active]:text-white">
              <Layout className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-[#f59e0b] data-[state=active]:text-white">
              <Trophy className="w-4 h-4 mr-2" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-[#10b981] data-[state=active]:text-[#0d1117]">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-[#ef4444] data-[state=active]:text-white">
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-[#161b22] border-[#30363d]">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-[#f0f6fc]">
                    <Trophy className="w-5 h-5 text-[#f59e0b]" />
                    Truth Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#f59e0b] mb-2">
                    {profileData?.truthScore || 0}
                  </div>
                  <p className="text-sm text-[#8b949e]">
                    Your reputation in the community
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-[#161b22] border-[#30363d]">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-[#f0f6fc]">
                    <Sparkles className="w-5 h-5 text-[#00ffe1]" />
                    GTT Earned
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#00ffe1] mb-2">
                    {profileData?.gttEarned?.toLocaleString() || 0}
                  </div>
                  <p className="text-sm text-[#8b949e]">
                    Guardian Truth Tokens
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-[#161b22] border-[#30363d]">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-[#f0f6fc]">
                    <FileText className="w-5 h-5 text-[#ff00d4]" />
                    Capsules Created
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#ff00d4] mb-2">
                    {profileData?.capsulesCreated || 0}
                  </div>
                  <p className="text-sm text-[#8b949e]">
                    Truth capsules submitted
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {/* Recent Activity */}
            <Card className="bg-[#161b22] border-[#30363d]">
              <CardHeader>
                <CardTitle className="text-[#f0f6fc]">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#8b949e]">Activity timeline will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Capsules Tab */}
          <TabsContent value="capsules" className="space-y-6">
            <Card className="bg-[#161b22] border-[#30363d]">
              <CardHeader>
                <CardTitle className="text-[#f0f6fc]">Your Truth Capsules</CardTitle>
              </CardHeader>
              <CardContent>
                {userCapsules && userCapsules.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userCapsules.map((capsule: any) => (
                      <Card key={capsule.id} className="bg-[#21262d] border-[#30363d]">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-medium text-[#f0f6fc] line-clamp-1">
                              {capsule.title}
                            </h4>
                            <Badge 
                              variant={capsule.status === 'verified' ? 'default' : 'secondary'}
                              className={capsule.status === 'verified' ? 'bg-[#00ffe1] text-[#0d1117]' : ''}
                            >
                              {capsule.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-[#8b949e] mb-3 line-clamp-2">
                            {capsule.description}
                          </p>
                          <div className="flex items-center justify-between text-xs text-[#8b949e]">
                            <span>
                              {new Date(capsule.createdAt).toLocaleDateString()}
                            </span>
                            {capsule.truthScore > 0 && (
                              <span className="text-[#00ffe1]">
                                Score: {capsule.truthScore}
                              </span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#8b949e] text-center py-8">
                    No capsules created yet. Start by creating your first truth capsule.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dashboard Customization Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <CustomizableDashboard />
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <Card className="bg-[#161b22] border-[#30363d]">
              <CardHeader>
                <CardTitle className="text-[#f0f6fc]">Achievements & Badges</CardTitle>
              </CardHeader>
              <CardContent>
                {userStats?.achievements ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userStats.achievements.map((achievement: any) => (
                      <div
                        key={achievement.id}
                        className={`
                          p-4 rounded-lg border transition-all
                          ${achievement.unlocked 
                            ? 'bg-[#21262d] border-[#00ffe1]/30' 
                            : 'bg-[#21262d]/50 border-[#30363d]'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`
                            w-12 h-12 rounded-full flex items-center justify-center
                            ${achievement.unlocked 
                              ? 'bg-[#00ffe1]/20 text-[#00ffe1]' 
                              : 'bg-[#8b949e]/20 text-[#8b949e]'
                            }
                          `}>
                            <Trophy className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className={`font-medium ${achievement.unlocked ? 'text-[#f0f6fc]' : 'text-[#8b949e]'}`}>
                              {achievement.name}
                            </h4>
                            <Badge 
                              variant={achievement.unlocked ? "default" : "secondary"}
                              className={achievement.unlocked ? "bg-[#00ffe1] text-[#0d1117]" : ""}
                            >
                              {achievement.unlocked ? "Unlocked" : "Locked"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#8b949e] text-center py-8">
                    No achievements unlocked yet. Keep engaging with the platform to earn badges!
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            {isEditing ? (
              <Card className="bg-[#161b22] border-[#30363d]">
                <CardHeader>
                  <CardTitle className="text-[#f0f6fc]">Edit Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-[#f0f6fc] mb-2 block">
                        Display Name
                      </label>
                      <Input
                        defaultValue={profileData?.displayName}
                        className="bg-[#21262d] border-[#30363d] text-[#f0f6fc]"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-[#f0f6fc] mb-2 block">
                        Location
                      </label>
                      <Input
                        defaultValue={profileData?.location}
                        className="bg-[#21262d] border-[#30363d] text-[#f0f6fc]"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-[#f0f6fc] mb-2 block">
                      Bio
                    </label>
                    <Textarea
                      defaultValue={profileData?.bio}
                      className="bg-[#21262d] border-[#30363d] text-[#f0f6fc]"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-[#f0f6fc] mb-2 block">
                        Website
                      </label>
                      <Input
                        defaultValue={profileData?.website}
                        className="bg-[#21262d] border-[#30363d] text-[#f0f6fc]"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-[#f0f6fc] mb-2 block">
                        Twitter
                      </label>
                      <Input
                        defaultValue={profileData?.twitter}
                        className="bg-[#21262d] border-[#30363d] text-[#f0f6fc]"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-[#161b22] border-[#30363d]">
                <CardHeader>
                  <CardTitle className="text-[#f0f6fc]">Profile Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#8b949e]">Click "Edit Profile" to modify your settings.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="bg-[#161b22] border-[#30363d]">
              <CardHeader>
                <CardTitle className="text-[#f0f6fc]">Security & Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-[#21262d] rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-[#00ffe1]" />
                      <div>
                        <h4 className="font-medium text-[#f0f6fc]">Email Verification</h4>
                        <p className="text-sm text-[#8b949e]">Verify your email address</p>
                      </div>
                    </div>
                    <Badge variant={profileData?.verification?.email ? "default" : "secondary"}>
                      {profileData?.verification?.email ? "Verified" : "Pending"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-[#21262d] rounded-lg">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-[#7c3aed]" />
                      <div>
                        <h4 className="font-medium text-[#f0f6fc]">Two-Factor Authentication</h4>
                        <p className="text-sm text-[#8b949e]">Add an extra layer of security</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="border-[#30363d]">
                      Enable
                    </Button>
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