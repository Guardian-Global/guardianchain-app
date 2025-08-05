import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Users, 
  Link as LinkIcon, 
  Share2, 
  Globe, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Github, 
  Youtube, 
  Twitch,
  Discord,
  Telegram,
  ExternalLink,
  Plus,
  Check,
  X,
  Settings,
  Zap,
  Eye,
  Heart,
  MessageCircle,
  UserPlus,
  TrendingUp,
  Calendar,
  Star
} from 'lucide-react';

interface SocialPlatform {
  id: string;
  name: string;
  icon: any;
  connected: boolean;
  username?: string;
  followers?: number;
  verified?: boolean;
  color: string;
  bgColor: string;
  url?: string;
}

interface ProfileSocialIntegrationProps {
  socialConnections: SocialPlatform[];
  onConnect: (platformId: string, username: string) => void;
  onDisconnect: (platformId: string) => void;
  publicProfile: boolean;
  onPublicProfileChange: (enabled: boolean) => void;
}

const defaultPlatforms: SocialPlatform[] = [
  {
    id: 'twitter',
    name: 'Twitter/X',
    icon: Twitter,
    connected: false,
    color: '#1DA1F2',
    bgColor: 'bg-blue-500/20 border-blue-500/50'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    connected: false,
    color: '#E4405F',
    bgColor: 'bg-pink-500/20 border-pink-500/50'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: Linkedin,
    connected: false,
    color: '#0077B5',
    bgColor: 'bg-blue-600/20 border-blue-600/50'
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: Github,
    connected: false,
    color: '#333',
    bgColor: 'bg-gray-500/20 border-gray-500/50'
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: Youtube,
    connected: false,
    color: '#FF0000',
    bgColor: 'bg-red-500/20 border-red-500/50'
  },
  {
    id: 'twitch',
    name: 'Twitch',
    icon: Twitch,
    connected: false,
    color: '#9146FF',
    bgColor: 'bg-purple-500/20 border-purple-500/50'
  },
  {
    id: 'discord',
    name: 'Discord',
    icon: Discord,
    connected: false,
    color: '#5865F2',
    bgColor: 'bg-indigo-500/20 border-indigo-500/50'
  },
  {
    id: 'telegram',
    name: 'Telegram',
    icon: Telegram,
    connected: false,
    color: '#0088CC',
    bgColor: 'bg-cyan-500/20 border-cyan-500/50'
  }
];

export default function ProfileSocialIntegration({ 
  socialConnections = defaultPlatforms, 
  onConnect = () => {},
  onDisconnect = () => {},
  publicProfile = true,
  onPublicProfileChange = () => {}
}: ProfileSocialIntegrationProps) {
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);
  const [newUsername, setNewUsername] = useState('');

  const connectedPlatforms = socialConnections.filter(p => p.connected);
  const availablePlatforms = socialConnections.filter(p => !p.connected);

  const handleConnect = (platformId: string) => {
    if (newUsername.trim()) {
      onConnect(platformId, newUsername.trim());
      setNewUsername('');
      setConnectingPlatform(null);
    }
  };

  const totalFollowers = connectedPlatforms.reduce((sum, platform) => sum + (platform.followers || 0), 0);

  return (
    <div className="space-y-6">
      {/* Social Overview */}
      <Card className="bg-black/50 backdrop-blur-lg border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-cyan-300 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Social Integration Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-800/50 rounded-lg">
              <div className="text-xl font-bold text-cyan-300">
                {connectedPlatforms.length}
              </div>
              <div className="text-xs text-gray-400">Connected</div>
            </div>
            <div className="text-center p-3 bg-gray-800/50 rounded-lg">
              <div className="text-xl font-bold text-green-300">
                {totalFollowers.toLocaleString()}
              </div>
              <div className="text-xs text-gray-400">Followers</div>
            </div>
            <div className="text-center p-3 bg-gray-800/50 rounded-lg">
              <div className="text-xl font-bold text-purple-300">
                {connectedPlatforms.filter(p => p.verified).length}
              </div>
              <div className="text-xs text-gray-400">Verified</div>
            </div>
            <div className="text-center p-3 bg-gray-800/50 rounded-lg">
              <div className="text-xl font-bold text-yellow-300">
                {publicProfile ? 'Public' : 'Private'}
              </div>
              <div className="text-xs text-gray-400">Profile</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Public Profile Toggle */}
      <Card className="bg-black/50 backdrop-blur-lg border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-300 flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            Public Profile Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
            <div>
              <h4 className="text-white font-medium">Make Profile Public</h4>
              <p className="text-sm text-gray-400">Allow others to discover and view your social connections</p>
            </div>
            <Switch
              checked={publicProfile}
              onCheckedChange={onPublicProfileChange}
              data-testid="switch-public-profile"
            />
          </div>
        </CardContent>
      </Card>

      {/* Connected Platforms */}
      {connectedPlatforms.length > 0 && (
        <Card className="bg-black/50 backdrop-blur-lg border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-blue-300 flex items-center">
              <LinkIcon className="w-5 h-5 mr-2" />
              Connected Platforms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {connectedPlatforms.map(platform => {
                const IconComponent = platform.icon;
                return (
                  <div 
                    key={platform.id} 
                    className={`p-4 rounded-lg border-2 ${platform.bgColor}`}
                    data-testid={`connected-platform-${platform.id}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-800/50 rounded-lg">
                          <IconComponent className="w-5 h-5" style={{ color: platform.color }} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-white font-medium">{platform.name}</h4>
                            {platform.verified && (
                              <Badge className="bg-blue-500/20 text-blue-300 text-xs">
                                <Check className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-400">@{platform.username}</p>
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDisconnect(platform.id)}
                        className="border-red-500 text-red-300 hover:border-red-400"
                        data-testid={`disconnect-${platform.id}`}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {platform.followers && (
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <UserPlus className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-300">{platform.followers.toLocaleString()}</span>
                          </div>
                          {platform.url && (
                            <a 
                              href={platform.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300"
                              data-testid={`platform-link-${platform.id}`}
                            >
                              <ExternalLink className="w-3 h-3" />
                              Visit
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Platforms */}
      {availablePlatforms.length > 0 && (
        <Card className="bg-black/50 backdrop-blur-lg border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-purple-300 flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Connect New Platform
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {availablePlatforms.map(platform => {
                const IconComponent = platform.icon;
                const isConnecting = connectingPlatform === platform.id;
                
                return (
                  <div key={platform.id} className="space-y-2">
                    {isConnecting ? (
                      <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-600">
                        <div className="flex items-center gap-2 mb-2">
                          <IconComponent className="w-4 h-4" style={{ color: platform.color }} />
                          <span className="text-sm font-medium text-white">{platform.name}</span>
                        </div>
                        <Input
                          placeholder="Username"
                          value={newUsername}
                          onChange={(e) => setNewUsername(e.target.value)}
                          className="mb-2 h-8 text-sm"
                          data-testid={`input-username-${platform.id}`}
                        />
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            onClick={() => handleConnect(platform.id)}
                            className="h-7 px-2 text-xs bg-green-600 hover:bg-green-700"
                            data-testid={`connect-confirm-${platform.id}`}
                          >
                            <Check className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setConnectingPlatform(null)}
                            className="h-7 px-2 text-xs border-gray-600"
                            data-testid={`connect-cancel-${platform.id}`}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConnectingPlatform(platform.id)}
                        className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 hover:border-gray-400 transition-all"
                        data-testid={`connect-${platform.id}`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <IconComponent className="w-6 h-6" style={{ color: platform.color }} />
                          <span className="text-xs font-medium text-white">{platform.name}</span>
                        </div>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Social Analytics */}
      <Card className="bg-black/50 backdrop-blur-lg border-yellow-500/30">
        <CardHeader>
          <CardTitle className="text-yellow-300 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Social Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-red-400" />
                <span className="text-sm font-medium text-white">Engagement</span>
              </div>
              <div className="text-xl font-bold text-red-300">8.4K</div>
              <div className="text-xs text-gray-400">Total interactions this month</div>
            </div>
            
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-white">Reach</span>
              </div>
              <div className="text-xl font-bold text-blue-300">24.7K</div>
              <div className="text-xs text-gray-400">Profile views this month</div>
            </div>
            
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium text-white">Growth</span>
              </div>
              <div className="text-xl font-bold text-yellow-300">+12%</div>
              <div className="text-xs text-gray-400">Follower growth this month</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cross-Platform Sharing */}
      <Card className="bg-black/50 backdrop-blur-lg border-orange-500/30">
        <CardHeader>
          <CardTitle className="text-orange-300 flex items-center">
            <Share2 className="w-5 h-5 mr-2" />
            Cross-Platform Sharing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gray-800/50 rounded-lg">
            <h4 className="text-white font-medium mb-2">Auto-Share New Capsules</h4>
            <p className="text-sm text-gray-400 mb-3">
              Automatically share new truth capsules across your connected platforms
            </p>
            <div className="flex flex-wrap gap-2">
              {connectedPlatforms.map(platform => (
                <Button
                  key={platform.id}
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:border-gray-400"
                  data-testid={`auto-share-${platform.id}`}
                >
                  <platform.icon className="w-3 h-3 mr-1" style={{ color: platform.color }} />
                  {platform.name}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="p-4 bg-gray-800/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Unified Profile Link</h4>
                <p className="text-sm text-gray-400">Share a single link to all your profiles</p>
              </div>
              <Button
                size="sm"
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                data-testid="button-generate-link"
              >
                <LinkIcon className="w-4 h-4 mr-2" />
                Generate Link
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}