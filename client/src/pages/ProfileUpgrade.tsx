import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Crown, 
  Award, 
  Shield,
  Star,
  Camera,
  Edit,
  Save,
  Upload,
  Zap,
  Trophy,
  Target,
  Heart,
  Globe,
  Link,
  Mail,
  Calendar,
  MapPin,
  Briefcase,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username?: string;
  bio?: string;
  location?: string;
  website?: string;
  twitter?: string;
  linkedin?: string;
  profileImageUrl?: string;
  bannerImageUrl?: string;
  tier: 'EXPLORER' | 'SEEKER' | 'CREATOR' | 'SOVEREIGN';
  reputation: {
    truthScore: number;
    griefTotal: number;
    capsuleCount: number;
    verificationsCount: number;
    reputationTier: string;
  };
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    earnedAt: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  }>;
  stats: {
    capsulesCreated: number;
    truthsVerified: number;
    tokensEarned: number;
    daysActive: number;
    influence: number;
  };
}

export default function ProfileUpgradePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'edit' | 'achievements' | 'stats'>('overview');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    bio: '',
    location: '',
    website: '',
    twitter: '',
    linkedin: ''
  });

  const { data: profile, isLoading, refetch } = useQuery<UserProfile>({
    queryKey: ['/api/profile/detailed', user?.id],
    enabled: !!user?.id
  });

  // Update form data when profile data changes
  React.useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        username: profile.username || '',
        bio: profile.bio || '',
        location: profile.location || '',
        website: profile.website || '',
        twitter: profile.twitter || '',
        linkedin: profile.linkedin || ''
      });
    }
  }, [profile]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return apiRequest('PUT', '/api/profile/update', data);
    },
    onSuccess: () => {
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
      });
      setIsEditing(false);
      refetch();
    },
    onError: (error) => {
      toast({
        title: 'Update Failed',
        description: 'There was an error updating your profile.',
        variant: 'destructive',
      });
    }
  });

  // Default profile data for display
  const defaultProfile: UserProfile = {
    id: user?.id || 'debug-user',
    email: user?.email || 'debug@guardianchain.app',
    firstName: 'Debug',
    lastName: 'User',
    username: 'debuguser',
    bio: 'Truth seeker and memory keeper on GuardianChain. Passionate about preserving authentic stories for future generations.',
    location: 'San Francisco, CA',
    website: 'https://guardianchain.app',
    twitter: '@guardianchain',
    linkedin: 'guardianchain',
    tier: 'CREATOR',
    reputation: {
      truthScore: 756,
      griefTotal: 12,
      capsuleCount: 23,
      verificationsCount: 156,
      reputationTier: 'Gold'
    },
    achievements: [
      {
        id: '1',
        title: 'Truth Pioneer',
        description: 'Created your first 10 verified capsules',
        icon: '🏆',
        earnedAt: '2025-07-15',
        rarity: 'epic'
      },
      {
        id: '2',
        title: 'Community Verifier',
        description: 'Verified 100+ community submissions',
        icon: '✅',
        earnedAt: '2025-07-28',
        rarity: 'rare'
      },
      {
        id: '3',
        title: 'Grief Master',
        description: 'Achieved grief score over 500',
        icon: '💎',
        earnedAt: '2025-08-01',
        rarity: 'legendary'
      }
    ],
    stats: {
      capsulesCreated: 23,
      truthsVerified: 156,
      tokensEarned: 2450,
      daysActive: 45,
      influence: 89
    }
  };

  const displayProfile = profile || defaultProfile;

  const getTierColor = (tier: string) => {
    const colors = {
      EXPLORER: 'bg-gray-100 text-gray-800 border-gray-300',
      SEEKER: 'bg-blue-100 text-blue-800 border-blue-300',
      CREATOR: 'bg-purple-100 text-purple-800 border-purple-300',
      SOVEREIGN: 'bg-yellow-100 text-yellow-800 border-yellow-300'
    };
    return colors[tier as keyof typeof colors] || colors.EXPLORER;
  };

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'border-gray-300 bg-gray-50',
      rare: 'border-blue-300 bg-blue-50',
      epic: 'border-purple-300 bg-purple-50',
      legendary: 'border-yellow-300 bg-yellow-50'
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  };

  const getReputationProgress = () => {
    const tierThresholds = { Bronze: 100, Silver: 300, Gold: 500, Platinum: 1000 };
    const current = displayProfile.reputation.truthScore;
    const nextTier = Object.entries(tierThresholds).find(([tier, threshold]) => current < threshold);
    
    if (!nextTier) return { progress: 100, nextTierName: 'Max', pointsNeeded: 0 };
    
    const [nextTierName, nextThreshold] = nextTier;
    const prevThreshold = Object.values(tierThresholds)[Object.keys(tierThresholds).indexOf(nextTierName) - 1] || 0;
    const progress = ((current - prevThreshold) / (nextThreshold - prevThreshold)) * 100;
    
    return { progress, nextTierName, pointsNeeded: nextThreshold - current };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header */}
        <Card className="relative overflow-hidden">
          {/* Banner */}
          <div className="h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative">
            <div className="absolute inset-0 bg-black/20" />
            <Button
              variant="outline"
              size="sm"
              className="absolute top-4 right-4 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Camera className="w-4 h-4 mr-2" />
              Change Banner
            </Button>
          </div>

          <CardContent className="relative -mt-16 pb-6">
            {/* Profile Picture */}
            <div className="flex items-end space-x-6">
              <div className="relative">
                <div className="w-32 h-32 bg-white dark:bg-gray-800 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center text-4xl font-bold text-gray-600 dark:text-gray-300">
                  {displayProfile.firstName?.[0]}{displayProfile.lastName?.[0]}
                </div>
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 rounded-full p-2"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>

              {/* Profile Info */}
              <div className="flex-1 pt-16">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {displayProfile.firstName} {displayProfile.lastName}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                      @{displayProfile.username}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge className={`${getTierColor(displayProfile.tier)} border`}>
                        <Crown className="w-3 h-3 mr-1" />
                        {displayProfile.tier}
                      </Badge>
                      <Badge variant="outline">
                        <Trophy className="w-3 h-3 mr-1" />
                        {displayProfile.reputation.reputationTier}
                      </Badge>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => setIsEditing(!isEditing)}
                    variant={isEditing ? "default" : "outline"}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="mt-6">
              <p className="text-gray-700 dark:text-gray-300 text-lg">
                {displayProfile.bio}
              </p>
              
              {/* Contact Links */}
              <div className="flex items-center space-x-4 mt-4 text-sm text-gray-600 dark:text-gray-400">
                {displayProfile.location && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {displayProfile.location}
                  </div>
                )}
                {displayProfile.website && (
                  <div className="flex items-center">
                    <Link className="w-4 h-4 mr-1" />
                    <a href={displayProfile.website} className="hover:text-blue-600">
                      {displayProfile.website}
                    </a>
                  </div>
                )}
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Joined July 2025
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Tabs */}
        <div className="flex justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm">
            {['overview', 'edit', 'achievements', 'stats'].map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? 'default' : 'ghost'}
                onClick={() => setActiveTab(tab as any)}
                className="mx-1"
              >
                {tab === 'overview' && <User className="w-4 h-4 mr-2" />}
                {tab === 'edit' && <Edit className="w-4 h-4 mr-2" />}
                {tab === 'achievements' && <Award className="w-4 h-4 mr-2" />}
                {tab === 'stats' && <Target className="w-4 h-4 mr-2" />}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Reputation Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Reputation Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      {displayProfile.reputation.truthScore}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Truth Score</div>
                  </div>

                  {(() => {
                    const { progress, nextTierName, pointsNeeded } = getReputationProgress();
                    return (
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>{displayProfile.reputation.reputationTier}</span>
                          <span>{nextTierName === 'Max' ? 'Max Level' : `${pointsNeeded} to ${nextTierName}`}</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    );
                  })()}

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">{displayProfile.reputation.capsuleCount}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Capsules</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{displayProfile.reputation.verificationsCount}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Verifications</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Activity Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{displayProfile.stats.capsulesCreated}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Capsules Created</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{displayProfile.stats.tokensEarned}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">GTT Earned</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{displayProfile.stats.daysActive}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Days Active</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{displayProfile.stats.influence}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Influence Score</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'edit' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Edit className="w-5 h-5 mr-2" />
                Edit Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name</label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name</label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Username</label>
                <Input
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="@username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Bio</label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="San Francisco, CA"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Website</label>
                  <Input
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://your-website.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Twitter</label>
                  <Input
                    value={formData.twitter}
                    onChange={(e) => setFormData(prev => ({ ...prev, twitter: e.target.value }))}
                    placeholder="@username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">LinkedIn</label>
                  <Input
                    value={formData.linkedin}
                    onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                    placeholder="linkedin-username"
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={() => updateProfileMutation.mutate(formData)}
                  disabled={updateProfileMutation.isPending}
                  className="flex-1"
                >
                  {updateProfileMutation.isPending ? (
                    <>
                      <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Your Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {displayProfile.achievements.map((achievement) => (
                    <Card key={achievement.id} className={`border-2 ${getRarityColor(achievement.rarity)}`}>
                      <CardContent className="p-4 text-center">
                        <div className="text-4xl mb-2">{achievement.icon}</div>
                        <h3 className="font-semibold mb-1">{achievement.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {achievement.description}
                        </p>
                        <Badge className={getRarityColor(achievement.rarity)}>
                          {achievement.rarity.toUpperCase()}
                        </Badge>
                        <div className="text-xs text-gray-500 mt-2">
                          Earned: {new Date(achievement.earnedAt).toLocaleDateString()}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{displayProfile.stats.capsulesCreated}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Capsules Created</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Shield className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{displayProfile.stats.truthsVerified}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Truths Verified</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Star className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{displayProfile.stats.tokensEarned}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">GTT Earned</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{displayProfile.stats.influence}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Influence Score</div>
                </CardContent>
              </Card>
            </div>

            {/* Activity Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Activity Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-center">
                    <Target className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">Activity chart coming soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}