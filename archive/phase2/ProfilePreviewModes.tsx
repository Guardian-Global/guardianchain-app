import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Monitor,
  Smartphone,
  Tablet,
  Eye,
  Share2,
  Download,
  Copy,
  ExternalLink,
  QrCode,
  Globe,
  Lock,
  Users,
  Heart,
  Star,
  Trophy,
  Sparkles,
  Crown,
  Shield,
  Zap,
  CheckCircle
} from "lucide-react";

interface ProfileData {
  id: string;
  displayName?: string;
  bio?: string;
  profileImageUrl?: string;
  backgroundImageUrl?: string;
  tier?: string;
  isVerified?: boolean;
  stats: {
    truthScore: number;
    gttEarned: number;
    capsulesCreated: number;
    nftCount: number;
    connections: number;
  };
  badges: Array<{
    id: string;
    name: string;
    icon: string;
  }>;
  socialLinks: Record<string, string>;
  customization: {
    theme: {
      colors: Record<string, string>;
      gradients: Record<string, string>;
      effects: Record<string, boolean>;
    };
    layout: string;
    display: Record<string, boolean>;
    privacy: Record<string, boolean>;
  };
}

interface ProfilePreviewModesProps {
  profile: ProfileData;
  mode: 'desktop' | 'tablet' | 'mobile';
  onModeChange: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  isPublic?: boolean;
}

export default function ProfilePreviewModes({
  profile,
  mode,
  onModeChange,
  isPublic = false
}: ProfilePreviewModesProps) {
  const [activePreview, setActivePreview] = useState<'profile' | 'public' | 'share'>('profile');

  const getPreviewClasses = () => {
    switch (mode) {
      case 'mobile':
        return 'max-w-sm mx-auto';
      case 'tablet':
        return 'max-w-2xl mx-auto';
      default:
        return 'w-full max-w-4xl mx-auto';
    }
  };

  const ProfileCard = ({ variant = 'default' }: { variant?: 'default' | 'public' | 'minimal' }) => {
    const theme = profile.customization.theme;
    const isMinimal = variant === 'minimal';
    
    return (
      <Card 
        className={`${getPreviewClasses()} transition-all duration-300 ${
          isMinimal ? 'bg-white dark:bg-gray-900' : `bg-gradient-to-br ${theme.gradients.card || 'from-gray-900 to-gray-800'}`
        } border-2`}
        style={!isMinimal ? { borderColor: theme.colors.primary } : {}}
      >
        {/* Profile Header */}
        <CardHeader 
          className={`${
            isMinimal 
              ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
              : `bg-gradient-to-r ${theme.gradients.header || 'from-cyan-400 to-purple-600'}`
          } text-white relative overflow-hidden`}
        >
          {/* Background Effects */}
          {theme.effects.particles && !isMinimal && (
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-4 left-4 w-2 h-2 bg-white rounded-full animate-pulse" />
              <div className="absolute top-8 right-8 w-1 h-1 bg-white rounded-full animate-pulse delay-300" />
              <div className="absolute bottom-6 left-1/3 w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-700" />
            </div>
          )}
          
          <div className={`relative z-10 ${mode === 'mobile' ? 'text-center' : 'flex items-center gap-4'}`}>
            <Avatar className={`border-4 border-white/20 ${
              mode === 'mobile' ? 'w-16 h-16 mx-auto mb-3' : 'w-20 h-20'
            }`}>
              <AvatarImage src={profile.profileImageUrl} />
              <AvatarFallback className="text-2xl font-bold">
                {profile.displayName?.charAt(0) || 'G'}
              </AvatarFallback>
            </Avatar>
            
            <div className={mode === 'mobile' ? 'text-center' : ''}>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <CardTitle className={`font-bold ${mode === 'mobile' ? 'text-xl' : 'text-2xl'}`}>
                  {profile.displayName || 'Guardian User'}
                </CardTitle>
                {profile.isVerified && (
                  <CheckCircle className="w-5 h-5 text-blue-400" />
                )}
              </div>
              
              {profile.bio && (
                <p className={`text-white/80 mt-1 ${mode === 'mobile' ? 'text-sm' : ''}`}>
                  {profile.bio}
                </p>
              )}
              
              <div className={`flex gap-2 mt-3 ${mode === 'mobile' ? 'justify-center flex-wrap' : 'flex-wrap'}`}>
                <Badge variant="secondary" className="bg-white/20 text-white backdrop-blur-sm">
                  <Crown className="w-3 h-3 mr-1" />
                  {profile.tier || 'EXPLORER'}
                </Badge>
                
                {profile.badges?.slice(0, mode === 'mobile' ? 2 : 4).map(badge => (
                  <Badge key={badge.id} variant="outline" className="bg-white/10 text-white border-white/30">
                    <span className="mr-1">{badge.icon}</span>
                    {mode !== 'mobile' && badge.name}
                  </Badge>
                ))}
                
                {profile.badges?.length > (mode === 'mobile' ? 2 : 4) && (
                  <Badge variant="outline" className="bg-white/10 text-white border-white/30">
                    +{profile.badges.length - (mode === 'mobile' ? 2 : 4)}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        
        {/* Profile Content */}
        <CardContent className={`p-6 ${mode === 'mobile' ? 'p-4' : ''}`} style={{ color: theme.colors.text }}>
          {/* Stats Grid */}
          {profile.customization.display.showStats && (
            <div className={`grid gap-4 mb-6 ${
              mode === 'mobile' ? 'grid-cols-2' : 
              mode === 'tablet' ? 'grid-cols-3' : 
              'grid-cols-5'
            }`}>
              <div className="text-center">
                <div className={`font-bold ${mode === 'mobile' ? 'text-lg' : 'text-2xl'}`} 
                     style={{ color: theme.colors.primary }}>
                  {profile.stats.truthScore}
                </div>
                <div className={`opacity-80 ${mode === 'mobile' ? 'text-xs' : 'text-sm'}`}>
                  Truth Score
                </div>
              </div>
              
              <div className="text-center">
                <div className={`font-bold ${mode === 'mobile' ? 'text-lg' : 'text-2xl'}`} 
                     style={{ color: theme.colors.secondary }}>
                  {profile.stats.gttEarned.toLocaleString()}
                </div>
                <div className={`opacity-80 ${mode === 'mobile' ? 'text-xs' : 'text-sm'}`}>
                  GTT Earned
                </div>
              </div>
              
              <div className="text-center">
                <div className={`font-bold ${mode === 'mobile' ? 'text-lg' : 'text-2xl'}`} 
                     style={{ color: theme.colors.accent }}>
                  {profile.stats.capsulesCreated}
                </div>
                <div className={`opacity-80 ${mode === 'mobile' ? 'text-xs' : 'text-sm'}`}>
                  Capsules
                </div>
              </div>
              
              {mode !== 'mobile' && (
                <>
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: theme.colors.primary }}>
                      {profile.stats.nftCount}
                    </div>
                    <div className="text-sm opacity-80">NFTs</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: theme.colors.secondary }}>
                      {profile.stats.connections}
                    </div>
                    <div className="text-sm opacity-80">Connections</div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Social Links */}
          {profile.customization.display.showConnections && Object.keys(profile.socialLinks).length > 0 && (
            <div className={`flex gap-2 ${mode === 'mobile' ? 'flex-wrap justify-center' : 'flex-wrap'}`}>
              {Object.entries(profile.socialLinks).map(([platform, url]) => url && (
                <Button 
                  key={platform} 
                  variant="outline" 
                  size={mode === 'mobile' ? 'sm' : 'default'}
                  className="capitalize"
                  style={{ borderColor: theme.colors.primary }}
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  {platform}
                </Button>
              ))}
            </div>
          )}

          {/* Public/Private Indicator */}
          {variant === 'public' && (
            <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-green-400">
                <Globe className="w-4 h-4" />
                <span className="text-sm">This profile is publicly visible</span>
              </div>
            </div>
          )}
          
          {variant === 'default' && !profile.customization.privacy.profilePublic && (
            <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-amber-400">
                <Lock className="w-4 h-4" />
                <span className="text-sm">This profile is private</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Preview Mode Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-[#f0f6fc]">Preview Mode</h3>
          <div className="flex items-center gap-1 bg-[#21262d] rounded-lg p-1">
            <Button
              variant={mode === 'desktop' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onModeChange('desktop')}
              data-testid="preview-mode-desktop"
            >
              <Monitor className="w-4 h-4" />
            </Button>
            <Button
              variant={mode === 'tablet' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onModeChange('tablet')}
              data-testid="preview-mode-tablet"
            >
              <Tablet className="w-4 h-4" />
            </Button>
            <Button
              variant={mode === 'mobile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onModeChange('mobile')}
              data-testid="preview-mode-mobile"
            >
              <Smartphone className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" data-testid="copy-profile-link">
            <Copy className="w-4 h-4 mr-2" />
            Copy Link
          </Button>
          <Button variant="outline" size="sm" data-testid="share-profile">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Preview Tabs */}
      <Tabs value={activePreview} onValueChange={setActivePreview} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-[#21262d]">
          <TabsTrigger value="profile" data-testid="preview-tab-profile">
            <Eye className="w-4 h-4 mr-2" />
            Your View
          </TabsTrigger>
          <TabsTrigger value="public" data-testid="preview-tab-public">
            <Globe className="w-4 h-4 mr-2" />
            Public View
          </TabsTrigger>
          <TabsTrigger value="share" data-testid="preview-tab-share">
            <Share2 className="w-4 h-4 mr-2" />
            Share Card
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="profile" className="m-0">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="bg-[#00ffe1]/10 text-[#00ffe1] border-[#00ffe1]/30">
                  <Eye className="w-3 h-3 mr-1" />
                  Personal View
                </Badge>
                <span className="text-sm text-[#8b949e]">
                  This is how your profile appears to you with all customizations
                </span>
              </div>
              <ProfileCard variant="default" />
            </div>
          </TabsContent>
          
          <TabsContent value="public" className="m-0">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
                  <Globe className="w-3 h-3 mr-1" />
                  Public View
                </Badge>
                <span className="text-sm text-[#8b949e]">
                  This is how your profile appears to other users
                </span>
              </div>
              <ProfileCard variant="public" />
            </div>
          </TabsContent>
          
          <TabsContent value="share" className="m-0">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/30">
                  <Share2 className="w-3 h-3 mr-1" />
                  Share Card
                </Badge>
                <span className="text-sm text-[#8b949e]">
                  Minimal card perfect for sharing on social media
                </span>
              </div>
              <ProfileCard variant="minimal" />
              
              <div className="flex justify-center gap-3 mt-6">
                <Button variant="outline" size="sm" data-testid="download-share-card">
                  <Download className="w-4 h-4 mr-2" />
                  Download Image
                </Button>
                <Button variant="outline" size="sm" data-testid="generate-qr-code">
                  <QrCode className="w-4 h-4 mr-2" />
                  QR Code
                </Button>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* Device Frame Effect for Mobile/Tablet */}
      {mode !== 'desktop' && (
        <div className="text-center text-sm text-[#8b949e] mt-4">
          <div className="flex items-center justify-center gap-2">
            {mode === 'mobile' ? <Smartphone className="w-4 h-4" /> : <Tablet className="w-4 h-4" />}
            Previewing {mode} layout ({mode === 'mobile' ? '375px' : '768px'} width)
          </div>
        </div>
      )}
    </div>
  );
}