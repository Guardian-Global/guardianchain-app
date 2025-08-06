import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Globe, 
  Users, 
  UserCheck, 
  Settings, 
  AlertTriangle,
  Download,
  Trash2,
  Key,
  History,
  Database,
  Clock,
  Activity,
  CheckCircle
} from 'lucide-react';

interface PrivacySetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  level: 'public' | 'friends' | 'private';
  category: 'profile' | 'activity' | 'data' | 'communication';
}

interface EnhancedProfilePrivacySettingsProps {
  privacySettings: PrivacySetting[];
  onSettingChange: (settingId: string, enabled: boolean) => void;
  onLevelChange: (settingId: string, level: 'public' | 'friends' | 'private') => void;
}

const mockPrivacySettings: PrivacySetting[] = [
  {
    id: 'profile_visibility',
    title: 'Profile Visibility',
    description: 'Control who can view your profile information',
    enabled: true,
    level: 'public',
    category: 'profile'
  },
  {
    id: 'capsule_visibility',
    title: 'Capsule Visibility',
    description: 'Who can see your truth capsules',
    enabled: true,
    level: 'friends',
    category: 'profile'
  },
  {
    id: 'activity_tracking',
    title: 'Activity Tracking',
    description: 'Allow platform to track your activity for analytics',
    enabled: false,
    level: 'private',
    category: 'activity'
  },
  {
    id: 'search_indexing',
    title: 'Search Engine Indexing',
    description: 'Allow your profile to appear in search results',
    enabled: true,
    level: 'public',
    category: 'profile'
  },
  {
    id: 'data_collection',
    title: 'Data Collection',
    description: 'Consent to anonymized data collection for platform improvement',
    enabled: false,
    level: 'private',
    category: 'data'
  },
  {
    id: 'contact_discovery',
    title: 'Contact Discovery',
    description: 'Allow others to find you by email or phone',
    enabled: false,
    level: 'friends',
    category: 'communication'
  }
];

const categoryIcons = {
  profile: Users,
  activity: Activity,
  data: Database,
  communication: UserCheck
};

const levelColors = {
  public: 'text-green-400 border-green-500',
  friends: 'text-yellow-400 border-yellow-500',
  private: 'text-red-400 border-red-500'
};

const levelIcons = {
  public: Globe,
  friends: Users,
  private: Lock
};

export default function EnhancedProfilePrivacySettings({ 
  privacySettings = mockPrivacySettings, 
  onSettingChange = () => {},
  onLevelChange = () => {}
}: EnhancedProfilePrivacySettingsProps) {
  const categories = ['profile', 'activity', 'data', 'communication'] as const;

  const getSettingsByCategory = (category: string) => {
    return privacySettings.filter(setting => setting.category === category);
  };

  return (
    <div className="space-y-6">
      {/* Privacy Overview */}
      <Card className="bg-black/50 backdrop-blur-lg border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-blue-300 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Privacy Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-800/50 rounded-lg">
              <div className="text-xl font-bold text-green-300">
                {privacySettings.filter(s => s.level === 'public').length}
              </div>
              <div className="text-xs text-gray-400">Public Settings</div>
            </div>
            <div className="text-center p-3 bg-gray-800/50 rounded-lg">
              <div className="text-xl font-bold text-yellow-300">
                {privacySettings.filter(s => s.level === 'friends').length}
              </div>
              <div className="text-xs text-gray-400">Friends Only</div>
            </div>
            <div className="text-center p-3 bg-gray-800/50 rounded-lg">
              <div className="text-xl font-bold text-red-300">
                {privacySettings.filter(s => s.level === 'private').length}
              </div>
              <div className="text-xs text-gray-400">Private</div>
            </div>
            <div className="text-center p-3 bg-gray-800/50 rounded-lg">
              <div className="text-xl font-bold text-cyan-300">
                {privacySettings.filter(s => s.enabled).length}
              </div>
              <div className="text-xs text-gray-400">Active</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings by Category */}
      {categories.map(category => {
        const CategoryIcon = categoryIcons[category];
        const categorySettings = getSettingsByCategory(category);
        
        return (
          <Card key={category} className="bg-black/50 backdrop-blur-lg border-gray-600/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center capitalize">
                <CategoryIcon className="w-5 h-5 mr-2 text-cyan-400" />
                {category} Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {categorySettings.map(setting => {
                const LevelIcon = levelIcons[setting.level];
                
                return (
                  <div 
                    key={setting.id} 
                    className="p-4 bg-gray-800/50 rounded-lg border border-gray-600"
                    data-testid={`privacy-setting-${setting.id}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-white font-medium">{setting.title}</h4>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${levelColors[setting.level]}`}
                            data-testid={`privacy-level-${setting.id}`}
                          >
                            <LevelIcon className="w-3 h-3 mr-1" />
                            {setting.level.charAt(0).toUpperCase() + setting.level.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400">{setting.description}</p>
                      </div>
                      
                      <Switch
                        checked={setting.enabled}
                        onCheckedChange={(checked) => onSettingChange(setting.id, checked)}
                        data-testid={`privacy-switch-${setting.id}`}
                      />
                    </div>
                    
                    {/* Privacy Level Selector */}
                    <div className="flex gap-2">
                      {(['public', 'friends', 'private'] as const).map(level => {
                        const LevelIconComponent = levelIcons[level];
                        return (
                          <Button
                            key={level}
                            variant={setting.level === level ? "default" : "outline"}
                            size="sm"
                            onClick={() => onLevelChange(setting.id, level)}
                            className={`${
                              setting.level === level 
                                ? `bg-${level === 'public' ? 'green' : level === 'friends' ? 'yellow' : 'red'}-600 hover:bg-${level === 'public' ? 'green' : level === 'friends' ? 'yellow' : 'red'}-700` 
                                : 'border-gray-600 text-gray-300 hover:border-gray-400'
                            }`}
                            data-testid={`privacy-level-${setting.id}-${level}`}
                          >
                            <LevelIconComponent className="w-3 h-3 mr-1" />
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        );
      })}

      {/* Data Management */}
      <Card className="bg-black/50 backdrop-blur-lg border-orange-500/30">
        <CardHeader>
          <CardTitle className="text-orange-300 flex items-center">
            <Database className="w-5 h-5 mr-2" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h4 className="text-white font-medium mb-2 flex items-center">
                <Download className="w-4 h-4 mr-2 text-blue-400" />
                Export Your Data
              </h4>
              <p className="text-sm text-gray-400 mb-3">
                Download a complete copy of your GuardianChain data
              </p>
              <Button 
                size="sm" 
                variant="outline"
                className="border-blue-500 text-blue-300 hover:border-blue-400"
                data-testid="button-export-data"
              >
                <Download className="w-4 h-4 mr-2" />
                Request Export
              </Button>
            </div>

            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h4 className="text-white font-medium mb-2 flex items-center">
                <Trash2 className="w-4 h-4 mr-2 text-red-400" />
                Delete Account
              </h4>
              <p className="text-sm text-gray-400 mb-3">
                Permanently delete your account and all associated data
              </p>
              <Button 
                size="sm" 
                variant="outline"
                className="border-red-500 text-red-300 hover:border-red-400"
                data-testid="button-delete-account"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </div>

            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h4 className="text-white font-medium mb-2 flex items-center">
                <History className="w-4 h-4 mr-2 text-purple-400" />
                Activity History
              </h4>
              <p className="text-sm text-gray-400 mb-3">
                View and manage your activity history
              </p>
              <Button 
                size="sm" 
                variant="outline"
                className="border-purple-500 text-purple-300 hover:border-purple-400"
                data-testid="button-activity-history"
              >
                <History className="w-4 h-4 mr-2" />
                View History
              </Button>
            </div>

            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h4 className="text-white font-medium mb-2 flex items-center">
                <Key className="w-4 h-4 mr-2 text-green-400" />
                Access Keys
              </h4>
              <p className="text-sm text-gray-400 mb-3">
                Manage API keys and access tokens
              </p>
              <Button 
                size="sm" 
                variant="outline"
                className="border-green-500 text-green-300 hover:border-green-400"
                data-testid="button-access-keys"
              >
                <Key className="w-4 h-4 mr-2" />
                Manage Keys
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Recommendations */}
      <Card className="bg-black/50 backdrop-blur-lg border-yellow-500/30">
        <CardHeader>
          <CardTitle className="text-yellow-300 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Security Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-900/20 rounded-lg border border-green-500/30">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <div>
                <div className="text-sm font-medium text-green-300">Two-Factor Authentication Enabled</div>
                <div className="text-xs text-gray-400">Your account is protected with 2FA</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-yellow-900/20 rounded-lg border border-yellow-500/30">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <div>
                <div className="text-sm font-medium text-yellow-300">Review Privacy Settings</div>
                <div className="text-xs text-gray-400">Some settings allow public access to your data</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-blue-900/20 rounded-lg border border-blue-500/30">
              <Clock className="w-5 h-5 text-blue-400" />
              <div>
                <div className="text-sm font-medium text-blue-300">Regular Security Checkups</div>
                <div className="text-xs text-gray-400">Last security review: 15 days ago</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}