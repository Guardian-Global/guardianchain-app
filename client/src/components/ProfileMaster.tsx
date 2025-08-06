// client/src/components/ProfileMaster.tsx
// Consolidated user profile component with all profile features

import React, { useState, useEffect } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useUserCapsules } from '@/hooks/useUserCapsules';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  MapPin, 
  Globe, 
  Calendar, 
  Settings, 
  Vault, 
  Hash, 
  Eye, 
  Shield,
  Award,
  TrendingUp,
  Camera,
  Edit
} from 'lucide-react';

interface ProfileStats {
  capsules: {
    total: number;
    sealed: number;
    verified: number;
    thisMonth: number;
    byVisibility: {
      private: number;
      public: number;
      friends: number;
      unlockable: number;
    };
  };
  gtt: {
    balance: number;
    totalEarned: number;
    totalSpent: number;
  };
  activity: {
    totalActivities: number;
    lastActivity: string | null;
  };
}

export default function ProfileMaster() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    display_name: '',
    bio: '',
    location: '',
    website: ''
  });
  const [stats, setStats] = useState<ProfileStats | null>(null);

  const {
    profile,
    isLoading: profileLoading,
    updateProfile,
    uploadAvatar,
    isUpdating,
    isUploadingAvatar,
    getCapsuleStats,
    getGTTBalance,
    getActivitySummary
  } = useUserProfile();

  const { capsules } = useUserCapsules();

  // Load profile data when profile changes
  useEffect(() => {
    if (profile) {
      setEditData({
        display_name: profile.display_name || '',
        bio: profile.bio || '',
        location: profile.location || '',
        website: profile.website || ''
      });
    }
  }, [profile]);

  // Load statistics
  useEffect(() => {
    if (profile) {
      loadStats();
    }
  }, [profile, capsules]);

  const loadStats = async () => {
    try {
      const [capsuleStats, gttBalance, activitySummary] = await Promise.all([
        getCapsuleStats(),
        getGTTBalance(),
        getActivitySummary()
      ]);

      setStats({
        capsules: capsuleStats || {
          total: 0,
          sealed: 0,
          verified: 0,
          thisMonth: 0,
          byVisibility: { private: 0, public: 0, friends: 0, unlockable: 0 }
        },
        gtt: gttBalance || { balance: 0, totalEarned: 0, totalSpent: 0 },
        activity: activitySummary || { totalActivities: 0, lastActivity: null }
      });
    } catch (error) {
      console.error('❌ Error loading profile stats:', error);
    }
  };

  const handleSaveProfile = () => {
    updateProfile(editData);
    setIsEditing(false);
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadAvatar(file);
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'SEEKER': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'EXPLORER': return 'bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-300';
      case 'CREATOR': return 'bg-purple-100 text-purple-800 dark:bg-purple-700 dark:text-purple-300';
      case 'SOVEREIGN': return 'bg-gold-100 text-gold-800 dark:bg-gold-700 dark:text-gold-300';
      case 'ADMIN': return 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  if (profileLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-20 w-20"></div>
                  <div className="space-y-2">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <h3 className="text-lg font-semibold mb-2">Profile not found</h3>
            <p className="text-muted-foreground">Unable to load your profile information.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profile.avatar_url} alt={profile.display_name} />
                <AvatarFallback className="text-xl">
                  {(profile.display_name || profile.username || 'U').charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <Button
                size="sm"
                variant="outline"
                className="absolute -bottom-2 -right-2 rounded-full p-2 h-8 w-8"
                onClick={() => document.getElementById('avatar-upload')?.click()}
                disabled={isUploadingAvatar}
                data-testid="button-upload-avatar"
              >
                <Camera className="w-3 h-3" />
              </Button>
              
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="display_name">Display Name</Label>
                      <Input
                        id="display_name"
                        value={editData.display_name}
                        onChange={(e) => setEditData(prev => ({ ...prev, display_name: e.target.value }))}
                        data-testid="input-display-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={editData.location}
                        onChange={(e) => setEditData(prev => ({ ...prev, location: e.target.value }))}
                        data-testid="input-location"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={editData.bio}
                      onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                      rows={3}
                      data-testid="textarea-bio"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={editData.website}
                      onChange={(e) => setEditData(prev => ({ ...prev, website: e.target.value }))}
                      data-testid="input-website"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleSaveProfile} 
                      disabled={isUpdating}
                      data-testid="button-save-profile"
                    >
                      {isUpdating ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditing(false)}
                      data-testid="button-cancel-edit"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h1 className="text-2xl font-bold flex items-center gap-3">
                        {profile.display_name || profile.username}
                        <Badge className={getTierColor(profile.tier)}>
                          {profile.tier}
                        </Badge>
                      </h1>
                      <p className="text-muted-foreground">@{profile.username}</p>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditing(true)}
                      data-testid="button-edit-profile"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>

                  {profile.bio && (
                    <p className="text-foreground">{profile.bio}</p>
                  )}

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {profile.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                    
                    {profile.website && (
                      <div className="flex items-center gap-1">
                        <Globe className="w-4 h-4" />
                        <a 
                          href={profile.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {profile.website}
                        </a>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {new Date(profile.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Vault className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Capsules</p>
                  <p className="text-2xl font-bold">{stats.capsules.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Shield className="w-5 h-5 text-green-600 dark:text-green-300" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sealed Capsules</p>
                  <p className="text-2xl font-bold">{stats.capsules.sealed}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Award className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">GTT Balance</p>
                  <p className="text-2xl font-bold">{stats.gtt.balance}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-300" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">{stats.capsules.thisMonth}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Profile Tabs */}
      <Tabs defaultValue="capsules" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="capsules" data-testid="tab-capsules">
            Capsules ({stats?.capsules.total || 0})
          </TabsTrigger>
          <TabsTrigger value="activity" data-testid="tab-activity">
            Activity
          </TabsTrigger>
          <TabsTrigger value="achievements" data-testid="tab-achievements">
            Achievements
          </TabsTrigger>
          <TabsTrigger value="settings" data-testid="tab-settings">
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="capsules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Capsules</CardTitle>
              <CardDescription>Your latest truth capsules</CardDescription>
            </CardHeader>
            <CardContent>
              {capsules.length === 0 ? (
                <div className="text-center py-8">
                  <Vault className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No capsules yet</h3>
                  <p className="text-muted-foreground mb-4">Create your first truth capsule to get started</p>
                  <Button onClick={() => window.location.href = '/create-capsule'}>
                    Create Capsule
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {capsules.slice(0, 5).map((capsule) => (
                    <div key={capsule.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <h4 className="font-medium">{capsule.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Hash className="w-3 h-3" />
                            Grief: {capsule.grief_score}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {capsule.view_count} views
                          </span>
                          <span>{new Date(capsule.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.location.href = `/capsule/${capsule.id}`}
                      >
                        View
                      </Button>
                    </div>
                  ))}
                  
                  {capsules.length > 5 && (
                    <div className="text-center pt-4">
                      <Button 
                        variant="outline"
                        onClick={() => window.location.href = '/capsules'}
                      >
                        View All Capsules
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest actions on GuardianChain</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Activity Timeline</h3>
                <p className="text-muted-foreground">Activity tracking will be available soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>Your GuardianChain milestones and badges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Award className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Achievement System</h3>
                <p className="text-muted-foreground">Achievements and badges coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Settings Panel</h3>
                <p className="text-muted-foreground">Advanced settings coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}