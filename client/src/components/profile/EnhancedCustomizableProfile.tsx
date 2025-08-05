import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import ProfileCustomizationPanels from './ProfileCustomizationPanels';
import { 
  User, 
  Settings, 
  Palette, 
  Image, 
  Users, 
  Shield, 
  Trophy, 
  Crown,
  Share2,
  MessageCircle,
  Heart,
  Star,
  BarChart3,
  Coins,
  FileText,
  Calendar,
  MapPin,
  Clock,
  Mail,
  Phone,
  Globe,
  Link as LinkIcon,
  Edit3,
  Save,
  RefreshCw,
  Download,
  Upload,
  Eye,
  Lock,
  Unlock,
  Sparkles,
  Zap,
  Target,
  Award,
  CheckCircle,
  AlertCircle,
  Info,
  HelpCircle
} from 'lucide-react';

const availabilityStatuses = {
  online: { color: 'bg-green-500', label: 'Online' },
  busy: { color: 'bg-red-500', label: 'Busy' },
  away: { color: 'bg-yellow-500', label: 'Away' },
  offline: { color: 'bg-gray-500', label: 'Offline' }
};

const themes = {
  cyberpunk: {
    name: 'Cyberpunk',
    primary: '#00ffe1',
    secondary: '#ff00d4',
    accent: '#7c3aed',
    background: 'from-slate-900 via-purple-900 to-slate-900'
  },
  minimal: {
    name: 'Minimal',
    primary: '#1f2937',
    secondary: '#374151',
    accent: '#6b7280',
    background: 'from-gray-50 to-gray-100'
  },
  cosmic: {
    name: 'Cosmic',
    primary: '#8b5cf6',
    secondary: '#06b6d4',
    accent: '#f59e0b',
    background: 'from-purple-900 via-blue-900 to-indigo-900'
  },
  neon: {
    name: 'Neon',
    primary: '#10b981',
    secondary: '#f59e0b',
    accent: '#ef4444',
    background: 'from-gray-900 via-gray-800 to-black'  
  },
  matrix: {
    name: 'Matrix',
    primary: '#00ff00',
    secondary: '#00cc00',
    accent: '#008800',
    background: 'from-black via-green-900 to-black'
  },
  royal: {
    name: 'Royal',
    primary: '#fbbf24',
    secondary: '#7c2d12',
    accent: '#dc2626',
    background: 'from-amber-900 via-red-900 to-yellow-900'
  }
};

export default function EnhancedCustomizableProfile() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');

  const { data: profileData, isLoading } = useQuery({
    queryKey: ['/api/profile/advanced'],
    enabled: isAuthenticated
  });

  const { data: userStats } = useQuery({
    queryKey: ['/api/user/advanced-stats'],
    enabled: isAuthenticated
  });

  const { data: achievements } = useQuery({
    queryKey: ['/api/user/achievements'],
    enabled: isAuthenticated
  });

  const updateCustomizationMutation = useMutation({
    mutationFn: async (updates: any) => {
      return apiRequest('PUT', '/api/profile/customization', updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/profile/advanced'] });
      toast({
        title: "Profile Updated",
        description: "Your profile customization has been saved.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      });
    }
  });

  const handleCustomizationChange = (key: string, value: any) => {
    updateCustomizationMutation.mutate({ [key]: value });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black flex items-center justify-center">
        <Card className="bg-black/50 border-cyan-500/30 p-8 backdrop-blur-lg" data-testid="card-auth-required">
          <CardContent className="text-center">
            <Lock className="w-16 h-16 mx-auto mb-4 text-cyan-400" />
            <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
            <p className="text-gray-300 mb-6">Please log in to access your enhanced profile</p>
            <Button className="bg-gradient-to-r from-cyan-500 to-purple-500" data-testid="button-connect-wallet">
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading || !profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading enhanced profile...</p>
        </div>
      </div>
    );
  }

  const selectedTheme = themes[profileData.customization?.theme || 'cyberpunk'];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${selectedTheme.background} relative overflow-hidden`}>
      {/* Particle Effects */}
      {profileData.customization?.particleEffects && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400/60 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="relative">
            {/* Banner */}
            <div className="h-48 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-t-xl relative overflow-hidden">
              {profileData.banner && (
                <img 
                  src={profileData.banner} 
                  alt="Profile Banner" 
                  className="w-full h-full object-cover opacity-60"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>

            {/* Profile Info */}
            <div className="bg-black/80 backdrop-blur-lg rounded-b-xl p-6 relative">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Avatar */}
                <div className="relative">
                  <Avatar className="w-24 h-24 border-4 border-cyan-400/50" data-testid="avatar-profile">
                    <AvatarImage src={profileData.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-purple-500 text-white text-2xl font-bold">
                      {profileData.firstName?.[0]}{profileData.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 ${availabilityStatuses[profileData.customization?.availabilityStatus || 'online'].color} rounded-full border-2 border-black`} />
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-white" data-testid="text-profile-name">
                      {profileData.displayName}
                    </h1>
                    <Badge className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white" data-testid="badge-tier">
                      <Crown className="w-4 h-4 mr-1" />
                      {profileData.tier}
                    </Badge>
                  </div>
                  <p className="text-gray-300 text-lg mb-3" data-testid="text-status-message">
                    {profileData.customization?.statusMessage || profileData.bio}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {profileData.customization?.customBadges?.map((badge: string, index: number) => (
                      <Badge key={index} variant="secondary" className="bg-cyan-500/20 text-cyan-300" data-testid={`badge-custom-${index}`}>
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2">
                  <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-purple-500" data-testid="button-share">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  {profileData.customization?.allowDirectMessages && (
                    <Button size="sm" variant="outline" className="border-cyan-500/30 text-cyan-300" data-testid="button-message">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-black/50 backdrop-blur-lg border border-cyan-500/30 p-1" data-testid="tabs-profile">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-purple-500" data-testid="tab-overview">
              <User className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="customization" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-purple-500" data-testid="tab-customization">
              <Palette className="w-4 h-4 mr-2" />
              Customization
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-purple-500" data-testid="tab-achievements">
              <Trophy className="w-4 h-4 mr-2" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="privacy" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-purple-500" data-testid="tab-privacy">
              <Shield className="w-4 h-4 mr-2" />
              Privacy
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Stats Cards */}
                  {userStats && (
                    <>
                      <Card className="bg-black/50 backdrop-blur-lg border-cyan-500/30" data-testid="card-truth-score">
                        <CardHeader>
                          <CardTitle className="text-cyan-300 flex items-center">
                            <BarChart3 className="w-5 h-5 mr-2" />
                            Truth Score
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-white mb-2" data-testid="text-truth-score">
                            {userStats.truthScore?.current}
                          </div>
                          <Progress value={userStats.truthScore?.current} className="h-2 mb-2" />
                          <p className="text-sm text-gray-400" data-testid="text-truth-score-trend">
                            {userStats.truthScore?.trend > 0 ? '+' : ''}{userStats.truthScore?.trend} this week
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="bg-black/50 backdrop-blur-lg border-purple-500/30" data-testid="card-gtt-earned">
                        <CardHeader>
                          <CardTitle className="text-purple-300 flex items-center">
                            <Coins className="w-5 h-5 mr-2" />
                            GTT Earned
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-white mb-2" data-testid="text-gtt-earned">
                            {userStats.gttTokens?.earned?.toLocaleString()}
                          </div>
                          <Progress value={65} className="h-2 mb-2" />
                          <p className="text-sm text-gray-400" data-testid="text-gtt-available">
                            {userStats.gttTokens?.available} available
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="bg-black/50 backdrop-blur-lg border-green-500/30" data-testid="card-capsules">
                        <CardHeader>
                          <CardTitle className="text-green-300 flex items-center">
                            <FileText className="w-5 h-5 mr-2" />
                            Capsules
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-white mb-2" data-testid="text-capsules-total">
                            {userStats.capsules?.total}
                          </div>
                          <Progress value={84} className="h-2 mb-2" />
                          <p className="text-sm text-gray-400" data-testid="text-capsules-verified">
                            {userStats.capsules?.verified} verified
                          </p>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </div>

                {/* Profile Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-black/50 backdrop-blur-lg border-cyan-500/30" data-testid="card-personal-info">
                    <CardHeader>
                      <CardTitle className="text-cyan-300">Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {profileData.customization?.location && (
                        <div className="flex items-center gap-3" data-testid="info-location">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-white">{profileData.customization.location}</span>
                        </div>
                      )}
                      {profileData.customization?.timezone && (
                        <div className="flex items-center gap-3" data-testid="info-timezone">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-white">{profileData.customization.timezone}</span>
                        </div>
                      )}
                      {profileData.customization?.pronouns && (
                        <div className="flex items-center gap-3" data-testid="info-pronouns">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-white">{profileData.customization.pronouns}</span>
                        </div>
                      )}
                      {profileData.customization?.occupation && (
                        <div className="flex items-center gap-3" data-testid="info-occupation">
                          <Trophy className="w-4 h-4 text-gray-400" />
                          <span className="text-white">{profileData.customization.occupation}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-black/50 backdrop-blur-lg border-purple-500/30" data-testid="card-skills-interests">
                    <CardHeader>
                      <CardTitle className="text-purple-300">Skills & Interests</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {profileData.customization?.skillTags && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-400 mb-2">Skills</h4>
                          <div className="flex flex-wrap gap-2" data-testid="skills-container">
                            {profileData.customization.skillTags.map((skill: string, index: number) => (
                              <Badge key={index} className="bg-purple-500/20 text-purple-300" data-testid={`skill-${index}`}>
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {profileData.customization?.interests && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-400 mb-2">Interests</h4>
                          <div className="flex flex-wrap gap-2" data-testid="interests-container">
                            {profileData.customization.interests.map((interest: string, index: number) => (
                              <Badge key={index} className="bg-cyan-500/20 text-cyan-300" data-testid={`interest-${index}`}>
                                {interest}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Favorite Quote */}
                {profileData.customization?.favoriteQuote && (
                  <Card className="bg-black/50 backdrop-blur-lg border-yellow-500/30" data-testid="card-favorite-quote">
                    <CardContent className="p-6">
                      <blockquote className="text-xl italic text-center text-white" data-testid="text-favorite-quote">
                        "{profileData.customization.favoriteQuote}"
                      </blockquote>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Customization Tab */}
              <TabsContent value="customization">
                <ProfileCustomizationPanels
                  customization={profileData.customization || {}}
                  onCustomizationChange={handleCustomizationChange}
                />
              </TabsContent>

              {/* Achievements Tab */}
              <TabsContent value="achievements" className="space-y-6">
                {achievements && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="achievements-grid">
                    {achievements.achievements?.map((achievement: any, index: number) => (
                      <Card key={index} className={`bg-black/50 backdrop-blur-lg ${achievement.earned ? 'border-yellow-500/50' : 'border-gray-600/30'}`} data-testid={`achievement-${achievement.id}`}>
                        <CardContent className="p-6 text-center">
                          <div className={`w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full ${achievement.earned ? 'bg-yellow-500/20' : 'bg-gray-600/20'}`}>
                            {achievement.icon === 'target' && <Target className={`w-6 h-6 ${achievement.earned ? 'text-yellow-400' : 'text-gray-400'}`} />}
                            {achievement.icon === 'users' && <Users className={`w-6 h-6 ${achievement.earned ? 'text-yellow-400' : 'text-gray-400'}`} />}
                            {achievement.icon === 'heart' && <Heart className={`w-6 h-6 ${achievement.earned ? 'text-yellow-400' : 'text-gray-400'}`} />}
                            {achievement.icon === 'shield' && <Shield className={`w-6 h-6 ${achievement.earned ? 'text-yellow-400' : 'text-gray-400'}`} />}
                            {achievement.icon === 'coins' && <Coins className={`w-6 h-6 ${achievement.earned ? 'text-yellow-400' : 'text-gray-400'}`} />}
                            {achievement.icon === 'crown' && <Crown className={`w-6 h-6 ${achievement.earned ? 'text-yellow-400' : 'text-gray-400'}`} />}
                          </div>
                          <h3 className={`font-semibold mb-2 ${achievement.earned ? 'text-yellow-300' : 'text-gray-300'}`} data-testid={`achievement-title-${achievement.id}`}>
                            {achievement.title}
                          </h3>
                          <p className="text-sm text-gray-400 mb-3" data-testid={`achievement-description-${achievement.id}`}>
                            {achievement.description}
                          </p>
                          {achievement.earned ? (
                            <Badge className="bg-yellow-500/20 text-yellow-300" data-testid={`achievement-earned-${achievement.id}`}>
                              <Trophy className="w-3 h-3 mr-1" />
                              Earned
                            </Badge>
                          ) : achievement.progress !== undefined ? (
                            <div className="space-y-2">
                              <Progress value={(achievement.progress / achievement.target) * 100} className="h-2" />
                              <p className="text-xs text-gray-500" data-testid={`achievement-progress-${achievement.id}`}>
                                {achievement.progress} / {achievement.target}
                              </p>
                            </div>
                          ) : null}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Privacy Tab */}
              <TabsContent value="privacy" className="space-y-6">
                <Card className="bg-black/50 backdrop-blur-lg border-red-500/30" data-testid="card-privacy-settings">
                  <CardHeader>
                    <CardTitle className="text-red-300 flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
                      Privacy Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                          <div>
                            <h4 className="text-white font-medium">Public Profile</h4>
                            <p className="text-sm text-gray-400">Allow others to view your profile</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {profileData.privacy?.profilePublic ? (
                              <Eye className="w-4 h-4 text-green-400" />
                            ) : (
                              <EyeOff className="w-4 h-4 text-red-400" />
                            )}
                            <span className="text-sm text-gray-300" data-testid="privacy-public-profile">
                              {profileData.privacy?.profilePublic ? 'Public' : 'Private'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                          <div>
                            <h4 className="text-white font-medium">Show Statistics</h4>
                            <p className="text-sm text-gray-400">Display your stats publicly</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {profileData.privacy?.showStats ? (
                              <BarChart3 className="w-4 h-4 text-green-400" />
                            ) : (
                              <BarChart3 className="w-4 h-4 text-red-400" />
                            )}
                            <span className="text-sm text-gray-300" data-testid="privacy-show-stats">
                              {profileData.privacy?.showStats ? 'Visible' : 'Hidden'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                          <div>
                            <h4 className="text-white font-medium">Direct Messages</h4>
                            <p className="text-sm text-gray-400">Allow others to message you</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {profileData.privacy?.allowMessages ? (
                              <MessageCircle className="w-4 h-4 text-green-400" />
                            ) : (
                              <MessageCircle className="w-4 h-4 text-red-400" />
                            )}
                            <span className="text-sm text-gray-300" data-testid="privacy-allow-messages">
                              {profileData.privacy?.allowMessages ? 'Enabled' : 'Disabled'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                          <div>
                            <h4 className="text-white font-medium">Activity Feed</h4>
                            <p className="text-sm text-gray-400">Show your recent activity</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {profileData.privacy?.showActivityFeed ? (
                              <BarChart3 className="w-4 h-4 text-green-400" />
                            ) : (
                              <BarChart3 className="w-4 h-4 text-red-400" />
                            )}
                            <span className="text-sm text-gray-300" data-testid="privacy-activity-feed">
                              {profileData.privacy?.showActivityFeed ? 'Public' : 'Private'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  );
}