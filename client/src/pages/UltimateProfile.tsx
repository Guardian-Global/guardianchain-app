import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  User, 
  Settings, 
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
  Layout,
  Palette,
  Bell,
  Shield,
  Eye,
  EyeOff,
  Upload,
  Download,
  Share2,
  Heart,
  Star,
  Zap,
  Target,
  Award,
  Coins,
  Users,
  MessageCircle,
  Image,
  Video,
  Music,
  Mic,
  Headphones,
  Gamepad2,
  Code,
  Brush,
  Scissors,
  Wand2,
  Layers,
  Filter,
  Contrast,
  Sunrise,
  Moon,
  Laptop,
  Smartphone,
  Volume2,
  VolumeX,
  PlayCircle,
  PauseCircle,
  SkipForward,
  SkipBack,
  Repeat,
  Shuffle,
  Radio,
  Wifi,
  WifiOff,
  Bluetooth,
  Battery,
  BatteryLow,
  Power,
  Monitor,
  HardDrive,
  Cpu,
  MemoryStick,
  Network,
  Server,
  Database,
  Cloud,
  CloudOff,
  Download as DownloadIcon,
  Upload as UploadIcon,
  RefreshCw,
  Search,
  Filter as FilterIcon,
  Grid,
  List,
  Maximize,
  Minimize,
  MoreHorizontal,
  MoreVertical,
  Plus,
  Minus,
  X,
  Check,
  AlertTriangle,
  Info,
  HelpCircle,
  ExternalLink,
  Copy,
  Bookmark,
  Flag,
  Tag,
  Clock,
  Timer,
  AlarmClock,
  Watch,
  Hourglass
} from 'lucide-react';
import MediaGallery from '@/components/profile/MediaGallery';

interface ProfileCustomization {
  theme: 'cyberpunk' | 'minimal' | 'cosmic' | 'neon' | 'matrix' | 'royal';
  accentColor: string;
  backgroundImage: string;
  musicPlayer: boolean;
  particleEffects: boolean;
  animationsEnabled: boolean;
  profileLayout: 'grid' | 'timeline' | 'cards' | 'minimal';
  showActivityFeed: boolean;
  showCapsulesPublic: boolean;
  showStatsPublic: boolean;
  allowDirectMessages: boolean;
  displayMode: 'professional' | 'creative' | 'gaming' | 'academic';
  statusMessage: string;
  availabilityStatus: 'online' | 'busy' | 'away' | 'offline';
  customBadges: string[];
  socialLinks: Record<string, string>;
  achievements: string[];
  favoriteQuote: string;
  skillTags: string[];
  interests: string[];
  languages: string[];
  timezone: string;
  pronouns: string;
  occupation: string;
  company: string;
  location: string;
  website: string;
  portfolio: string;
  github: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  youtube: string;
  twitch: string;
  discord: string;
  telegram: string;
  whatsapp: string;
  email: string;
  phone: string;
  customFields: Record<string, string>;
}

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

const displayModes = {
  professional: { icon: Laptop, label: 'Professional' },
  creative: { icon: Brush, label: 'Creative' },
  gaming: { icon: Gamepad2, label: 'Gaming' },
  academic: { icon: FileText, label: 'Academic' }
};

const availabilityStatuses = {
  online: { color: 'bg-green-500', label: 'Online' },
  busy: { color: 'bg-red-500', label: 'Busy' },
  away: { color: 'bg-yellow-500', label: 'Away' },
  offline: { color: 'bg-gray-500', label: 'Offline' }
};

export default function UltimateProfile() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');
  const [customization, setCustomization] = useState<ProfileCustomization>({
    theme: 'cyberpunk',
    accentColor: '#00ffe1',
    backgroundImage: '',
    musicPlayer: true,
    particleEffects: true,
    animationsEnabled: true,
    profileLayout: 'grid',
    showActivityFeed: true,
    showCapsulesPublic: true,
    showStatsPublic: true,
    allowDirectMessages: true,
    displayMode: 'professional',
    statusMessage: 'Building the future of truth',
    availabilityStatus: 'online',
    customBadges: ['Truth Seeker', 'Capsule Creator'],
    socialLinks: {},
    achievements: [],
    favoriteQuote: 'Truth is the ultimate currency',
    skillTags: ['Blockchain', 'AI', 'Web3'],
    interests: ['Technology', 'Innovation', 'Decentralization'],
    languages: ['English'],
    timezone: 'UTC',
    pronouns: 'they/them',
    occupation: 'Guardian',
    company: 'GuardianChain',
    location: 'Decentralized',
    website: '',
    portfolio: '',
    github: '',
    linkedin: '',
    twitter: '',
    instagram: '',
    youtube: '',
    twitch: '',
    discord: '',
    telegram: '',
    whatsapp: '',
    email: '',
    phone: '',
    customFields: {}
  });

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

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<ProfileCustomization>) => {
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

  const handleCustomizationChange = (key: keyof ProfileCustomization, value: any) => {
    const newCustomization = { ...customization, [key]: value };
    setCustomization(newCustomization);
    updateProfileMutation.mutate({ [key]: value });
  };

  const selectedTheme = themes[customization.theme];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black flex items-center justify-center">
        <Card className="bg-black/50 border-cyan-500/30 p-8 backdrop-blur-lg">
          <CardContent className="text-center">
            <Lock className="w-16 h-16 mx-auto mb-4 text-cyan-400" />
            <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
            <p className="text-gray-300 mb-6">Please log in to access your ultimate profile</p>
            <Button className="bg-gradient-to-r from-cyan-500 to-purple-500">
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${selectedTheme.background} relative overflow-hidden`}>
      {/* Particle Effects */}
      {customization.particleEffects && (
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
              {customization.backgroundImage && (
                <img 
                  src={customization.backgroundImage} 
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
                  <Avatar className="w-24 h-24 border-4 border-cyan-400/50">
                    <AvatarImage src={user?.profileImageUrl} />
                    <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-purple-500 text-white text-2xl font-bold">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 ${availabilityStatuses[customization.availabilityStatus].color} rounded-full border-2 border-black`} />
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-white">
                      {user?.firstName} {user?.lastName}
                    </h1>
                    <Badge className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white">
                      <Crown className="w-4 h-4 mr-1" />
                      {user?.tier}
                    </Badge>
                  </div>
                  <p className="text-gray-300 text-lg mb-3">{customization.statusMessage}</p>
                  <div className="flex flex-wrap gap-2">
                    {customization.customBadges.map((badge, index) => (
                      <Badge key={index} variant="secondary" className="bg-cyan-500/20 text-cyan-300">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2">
                  <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-purple-500">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button size="sm" variant="outline" className="border-cyan-500/30 text-cyan-300">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-black/50 backdrop-blur-lg border border-cyan-500/30 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-purple-500">
              <User className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="customization" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-purple-500">
              <Palette className="w-4 h-4 mr-2" />
              Customization
            </TabsTrigger>
            <TabsTrigger value="media" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-purple-500">
              <Image className="w-4 h-4 mr-2" />
              Media
            </TabsTrigger>
            <TabsTrigger value="social" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-purple-500">
              <Users className="w-4 h-4 mr-2" />
              Social
            </TabsTrigger>
            <TabsTrigger value="privacy" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-purple-500">
              <Shield className="w-4 h-4 mr-2" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-purple-500">
              <Trophy className="w-4 h-4 mr-2" />
              Achievements
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
                  <Card className="bg-black/50 backdrop-blur-lg border-cyan-500/30">
                    <CardHeader>
                      <CardTitle className="text-cyan-300 flex items-center">
                        <BarChart3 className="w-5 h-5 mr-2" />
                        Truth Score
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-white mb-2">87</div>
                      <Progress value={87} className="h-2 mb-2" />
                      <p className="text-sm text-gray-400">+5 this week</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-black/50 backdrop-blur-lg border-purple-500/30">
                    <CardHeader>
                      <CardTitle className="text-purple-300 flex items-center">
                        <Coins className="w-5 h-5 mr-2" />
                        GTT Earned
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-white mb-2">12,547</div>
                      <Progress value={65} className="h-2 mb-2" />
                      <p className="text-sm text-gray-400">+247 this week</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-black/50 backdrop-blur-lg border-green-500/30">
                    <CardHeader>
                      <CardTitle className="text-green-300 flex items-center">
                        <FileText className="w-5 h-5 mr-2" />
                        Capsules
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-white mb-2">42</div>
                      <Progress value={84} className="h-2 mb-2" />
                      <p className="text-sm text-gray-400">3 verified</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Profile Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-black/50 backdrop-blur-lg border-cyan-500/30">
                    <CardHeader>
                      <CardTitle className="text-cyan-300">Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-white">{customization.location || 'Not specified'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-white">{customization.timezone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-white">{customization.pronouns}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Laptop className="w-4 h-4 text-gray-400" />
                        <span className="text-white">{customization.occupation}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-black/50 backdrop-blur-lg border-purple-500/30">
                    <CardHeader>
                      <CardTitle className="text-purple-300">Skills & Interests</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {customization.skillTags.map((skill, index) => (
                            <Badge key={index} className="bg-purple-500/20 text-purple-300">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Interests</h4>
                        <div className="flex flex-wrap gap-2">
                          {customization.interests.map((interest, index) => (
                            <Badge key={index} className="bg-cyan-500/20 text-cyan-300">
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Favorite Quote */}
                {customization.favoriteQuote && (
                  <Card className="bg-black/50 backdrop-blur-lg border-yellow-500/30">
                    <CardContent className="p-6">
                      <blockquote className="text-xl italic text-center text-white">
                        "{customization.favoriteQuote}"
                      </blockquote>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Customization Tab */}
              <TabsContent value="customization" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Theme Selection */}
                  <Card className="bg-black/50 backdrop-blur-lg border-cyan-500/30">
                    <CardHeader>
                      <CardTitle className="text-cyan-300">Theme Selection</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(themes).map(([key, theme]) => (
                          <button
                            key={key}
                            onClick={() => handleCustomizationChange('theme', key)}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              customization.theme === key 
                                ? 'border-cyan-400 bg-cyan-400/20' 
                                : 'border-gray-600 hover:border-gray-400'
                            }`}
                          >
                            <div className={`h-8 rounded bg-gradient-to-r ${theme.background} mb-2`} />
                            <div className="text-sm text-white">{theme.name}</div>
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Display Options */}
                  <Card className="bg-black/50 backdrop-blur-lg border-purple-500/30">
                    <CardHeader>
                      <CardTitle className="text-purple-300">Display Options</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-purple-300" />
                          <span className="text-white">Particle Effects</span>
                        </div>
                        <Switch
                          checked={customization.particleEffects}
                          onCheckedChange={(checked) => handleCustomizationChange('particleEffects', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-purple-300" />
                          <span className="text-white">Animations</span>
                        </div>
                        <Switch
                          checked={customization.animationsEnabled}
                          onCheckedChange={(checked) => handleCustomizationChange('animationsEnabled', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Music className="w-4 h-4 text-purple-300" />
                          <span className="text-white">Music Player</span>
                        </div>
                        <Switch
                          checked={customization.musicPlayer}
                          onCheckedChange={(checked) => handleCustomizationChange('musicPlayer', checked)}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Status Settings */}
                  <Card className="bg-black/50 backdrop-blur-lg border-green-500/30">
                    <CardHeader>
                      <CardTitle className="text-green-300">Status Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-400 mb-2 block">
                          Status Message
                        </label>
                        <Input
                          value={customization.statusMessage}
                          onChange={(e) => handleCustomizationChange('statusMessage', e.target.value)}
                          placeholder="What's on your mind?"
                          className="bg-black/50 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-400 mb-2 block">
                          Availability
                        </label>
                        <Select
                          value={customization.availabilityStatus}
                          onValueChange={(value) => handleCustomizationChange('availabilityStatus', value)}
                        >
                          <SelectTrigger className="bg-black/50 border-gray-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(availabilityStatuses).map(([key, status]) => (
                              <SelectItem key={key} value={key}>
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${status.color}`} />
                                  {status.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Personal Details */}
                  <Card className="bg-black/50 backdrop-blur-lg border-yellow-500/30">
                    <CardHeader>
                      <CardTitle className="text-yellow-300">Personal Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Input
                        placeholder="Pronouns (e.g., they/them)"
                        value={customization.pronouns}
                        onChange={(e) => handleCustomizationChange('pronouns', e.target.value)}
                        className="bg-black/50 border-gray-600 text-white"
                      />
                      <Input
                        placeholder="Location"
                        value={customization.location}
                        onChange={(e) => handleCustomizationChange('location', e.target.value)}
                        className="bg-black/50 border-gray-600 text-white"
                      />
                      <Input
                        placeholder="Occupation"
                        value={customization.occupation}
                        onChange={(e) => handleCustomizationChange('occupation', e.target.value)}
                        className="bg-black/50 border-gray-600 text-white"
                      />
                      <Textarea
                        placeholder="Favorite Quote"
                        value={customization.favoriteQuote}
                        onChange={(e) => handleCustomizationChange('favoriteQuote', e.target.value)}
                        className="bg-black/50 border-gray-600 text-white"
                      />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Media Tab */}
              <TabsContent value="media" className="space-y-6">
                <MediaGallery userId={user?.id || 'dev-user-123'} />
              </TabsContent>

              {/* Social Tab */}
              <TabsContent value="social" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-black/50 backdrop-blur-lg border-cyan-500/30">
                    <CardHeader>
                      <CardTitle className="text-cyan-300">Social Links</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { key: 'twitter', icon: LinkIcon, label: 'Twitter' },
                        { key: 'github', icon: Code, label: 'GitHub' },
                        { key: 'linkedin', icon: LinkIcon, label: 'LinkedIn' },
                        { key: 'instagram', icon: Image, label: 'Instagram' },
                        { key: 'youtube', icon: Video, label: 'YouTube' },
                        { key: 'discord', icon: MessageCircle, label: 'Discord' }
                      ].map(({ key, icon: Icon, label }) => (
                        <div key={key}>
                          <label className="text-sm font-medium text-gray-400 mb-2 block flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            {label}
                          </label>
                          <Input
                            placeholder={`Your ${label} URL`}
                            value={customization.socialLinks[key] || ''}
                            onChange={(e) => handleCustomizationChange('socialLinks', { ...customization.socialLinks, [key]: e.target.value })}
                            className="bg-black/50 border-gray-600 text-white"
                          />
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="bg-black/50 backdrop-blur-lg border-purple-500/30">
                    <CardHeader>
                      <CardTitle className="text-purple-300">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-400 mb-2 block flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          Website
                        </label>
                        <Input
                          placeholder="Your website URL"
                          value={customization.website}
                          onChange={(e) => handleCustomizationChange('website', e.target.value)}
                          className="bg-black/50 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-400 mb-2 block flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email
                        </label>
                        <Input
                          placeholder="Contact email"
                          value={customization.email}
                          onChange={(e) => handleCustomizationChange('email', e.target.value)}
                          className="bg-black/50 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-400 mb-2 block flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Phone
                        </label>
                        <Input
                          placeholder="Contact phone"
                          value={customization.phone}
                          onChange={(e) => handleCustomizationChange('phone', e.target.value)}
                          className="bg-black/50 border-gray-600 text-white"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Privacy Tab */}
              <TabsContent value="privacy" className="space-y-6">
                <Card className="bg-black/50 backdrop-blur-lg border-red-500/30">
                  <CardHeader>
                    <CardTitle className="text-red-300 flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
                      Privacy Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Public Profile</h4>
                        <p className="text-sm text-gray-400">Allow others to view your profile</p>
                      </div>
                      <Switch
                        checked={customization.showCapsulesPublic}
                        onCheckedChange={(checked) => handleCustomizationChange('showCapsulesPublic', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Show Statistics</h4>
                        <p className="text-sm text-gray-400">Display your stats publicly</p>
                      </div>
                      <Switch
                        checked={customization.showStatsPublic}
                        onCheckedChange={(checked) => handleCustomizationChange('showStatsPublic', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Direct Messages</h4>
                        <p className="text-sm text-gray-400">Allow others to message you</p>
                      </div>
                      <Switch
                        checked={customization.allowDirectMessages}
                        onCheckedChange={(checked) => handleCustomizationChange('allowDirectMessages', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Activity Feed</h4>
                        <p className="text-sm text-gray-400">Show your recent activity</p>
                      </div>
                      <Switch
                        checked={customization.showActivityFeed}
                        onCheckedChange={(checked) => handleCustomizationChange('showActivityFeed', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Achievements Tab */}
              <TabsContent value="achievements" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { title: 'Truth Seeker', description: 'Created your first capsule', icon: Target, earned: true },
                    { title: 'Community Builder', description: 'Invited 10 friends', icon: Users, earned: true },
                    { title: 'Verification Master', description: 'Verified 100 capsules', icon: Shield, earned: false },
                    { title: 'GTT Collector', description: 'Earned 50,000 GTT', icon: Coins, earned: false },
                    { title: 'Social Butterfly', description: 'Connected all social accounts', icon: Heart, earned: true },
                    { title: 'Elite Guardian', description: 'Reached sovereign tier', icon: Crown, earned: false }
                  ].map((achievement, index) => (
                    <Card key={index} className={`bg-black/50 backdrop-blur-lg ${achievement.earned ? 'border-yellow-500/50' : 'border-gray-600/30'}`}>
                      <CardContent className="p-6 text-center">
                        <achievement.icon className={`w-12 h-12 mx-auto mb-4 ${achievement.earned ? 'text-yellow-400' : 'text-gray-400'}`} />
                        <h3 className={`font-semibold mb-2 ${achievement.earned ? 'text-yellow-300' : 'text-gray-300'}`}>
                          {achievement.title}
                        </h3>
                        <p className="text-sm text-gray-400">{achievement.description}</p>
                        {achievement.earned && (
                          <Badge className="mt-3 bg-yellow-500/20 text-yellow-300">
                            <Trophy className="w-3 h-3 mr-1" />
                            Earned
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>

        {/* Music Player (if enabled) */}
        {customization.musicPlayer && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-4 right-4 bg-black/80 backdrop-blur-lg border border-cyan-500/30 rounded-lg p-4 z-50"
          >
            <div className="flex items-center gap-3">
              <Button size="sm" variant="ghost" className="text-cyan-300">
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-cyan-300">
                <PlayCircle className="w-5 h-5" />
              </Button>
              <Button size="sm" variant="ghost" className="text-cyan-300">
                <SkipForward className="w-4 h-4" />
              </Button>
              <div className="text-sm text-white">
                Now Playing: Cyber Dreams
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}