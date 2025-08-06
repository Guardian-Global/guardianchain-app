import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Palette, 
  Layout, 
  Eye, 
  Volume2, 
  Sparkles, 
  Music,
  Image,
  Settings,
  Globe,
  Shield,
  Bell,
  User,
  Heart,
  Star,
  Zap,
  Crown,
  Trophy,
  Target,
  Award
} from 'lucide-react';

interface ProfileCustomizationPanelsProps {
  customization: any;
  onCustomizationChange: (key: string, value: any) => void;
}

const themes = {
  cyberpunk: {
    name: 'Cyberpunk',
    primary: '#00ffe1',
    secondary: '#ff00d4',
    accent: '#7c3aed',
    preview: 'from-slate-900 via-purple-900 to-slate-900'
  },
  minimal: {
    name: 'Minimal',
    primary: '#1f2937',
    secondary: '#374151',
    accent: '#6b7280',
    preview: 'from-gray-50 to-gray-100'
  },
  cosmic: {
    name: 'Cosmic',
    primary: '#8b5cf6',
    secondary: '#06b6d4',
    accent: '#f59e0b',
    preview: 'from-purple-900 via-blue-900 to-indigo-900'
  },
  neon: {
    name: 'Neon',
    primary: '#10b981',
    secondary: '#f59e0b',
    accent: '#ef4444',
    preview: 'from-gray-900 via-gray-800 to-black'  
  },
  matrix: {
    name: 'Matrix',
    primary: '#00ff00',
    secondary: '#00cc00',
    accent: '#008800',
    preview: 'from-black via-green-900 to-black'
  },
  royal: {
    name: 'Royal',
    primary: '#fbbf24',
    secondary: '#7c2d12',
    accent: '#dc2626',
    preview: 'from-amber-900 via-red-900 to-yellow-900'
  }
};

export default function ProfileCustomizationPanels({ customization, onCustomizationChange }: ProfileCustomizationPanelsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Theme Selection Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-black/50 backdrop-blur-lg border-cyan-500/30 h-full">
          <CardHeader>
            <CardTitle className="text-cyan-300 flex items-center">
              <Palette className="w-5 h-5 mr-2" />
              Theme & Colors
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(themes).map(([key, theme]) => (
                <button
                  key={key}
                  onClick={() => onCustomizationChange('theme', key)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    customization.theme === key 
                      ? 'border-cyan-400 bg-cyan-400/20' 
                      : 'border-gray-600 hover:border-gray-400'
                  }`}
                  data-testid={`theme-${key}`}
                >
                  <div className={`h-8 rounded bg-gradient-to-r ${theme.preview} mb-2`} />
                  <div className="text-sm text-white">{theme.name}</div>
                </button>
              ))}
            </div>
            <div className="pt-4 border-t border-gray-600">
              <label className="text-sm font-medium text-gray-400 mb-2 block">
                Accent Color
              </label>
              <Input
                type="color"
                value={customization.accentColor}
                onChange={(e) => onCustomizationChange('accentColor', e.target.value)}
                className="w-full h-10 bg-black/50 border-gray-600"
                data-testid="input-accent-color"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Layout & Display Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-black/50 backdrop-blur-lg border-purple-500/30 h-full">
          <CardHeader>
            <CardTitle className="text-purple-300 flex items-center">
              <Layout className="w-5 h-5 mr-2" />
              Layout & Display
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-400 mb-2 block">
                Profile Layout
              </label>
              <Select
                value={customization.profileLayout}
                onValueChange={(value) => onCustomizationChange('profileLayout', value)}
              >
                <SelectTrigger className="bg-black/50 border-gray-600 text-white" data-testid="select-profile-layout">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">Grid Layout</SelectItem>
                  <SelectItem value="timeline">Timeline Layout</SelectItem>
                  <SelectItem value="cards">Card Layout</SelectItem>
                  <SelectItem value="minimal">Minimal Layout</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-300" />
                  <span className="text-white text-sm">Particle Effects</span>
                </div>
                <Switch
                  checked={customization.particleEffects}
                  onCheckedChange={(checked) => onCustomizationChange('particleEffects', checked)}
                  data-testid="switch-particle-effects"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-300" />
                  <span className="text-white text-sm">Animations</span>
                </div>
                <Switch
                  checked={customization.animationsEnabled}
                  onCheckedChange={(checked) => onCustomizationChange('animationsEnabled', checked)}
                  data-testid="switch-animations"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-purple-300" />
                  <span className="text-white text-sm">Music Player</span>
                </div>
                <Switch
                  checked={customization.musicPlayer}
                  onCheckedChange={(checked) => onCustomizationChange('musicPlayer', checked)}
                  data-testid="switch-music-player"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Privacy & Visibility Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-black/50 backdrop-blur-lg border-green-500/30 h-full">
          <CardHeader>
            <CardTitle className="text-green-300 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Privacy & Visibility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-green-300" />
                  <span className="text-white text-sm">Public Capsules</span>
                </div>
                <Switch
                  checked={customization.showCapsulesPublic}
                  onCheckedChange={(checked) => onCustomizationChange('showCapsulesPublic', checked)}
                  data-testid="switch-public-capsules"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-green-300" />
                  <span className="text-white text-sm">Show Statistics</span>
                </div>
                <Switch
                  checked={customization.showStatsPublic}
                  onCheckedChange={(checked) => onCustomizationChange('showStatsPublic', checked)}
                  data-testid="switch-show-stats"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-green-300" />
                  <span className="text-white text-sm">Activity Feed</span>
                </div>
                <Switch
                  checked={customization.showActivityFeed}
                  onCheckedChange={(checked) => onCustomizationChange('showActivityFeed', checked)}
                  data-testid="switch-activity-feed"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-green-300" />
                  <span className="text-white text-sm">Direct Messages</span>
                </div>
                <Switch
                  checked={customization.allowDirectMessages}
                  onCheckedChange={(checked) => onCustomizationChange('allowDirectMessages', checked)}
                  data-testid="switch-direct-messages"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Status & Presence Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-black/50 backdrop-blur-lg border-yellow-500/30 h-full">
          <CardHeader>
            <CardTitle className="text-yellow-300 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Status & Presence
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-400 mb-2 block">
                Status Message
              </label>
              <Input
                value={customization.statusMessage}
                onChange={(e) => onCustomizationChange('statusMessage', e.target.value)}
                placeholder="What's on your mind?"
                className="bg-black/50 border-gray-600 text-white"
                data-testid="input-status-message"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-400 mb-2 block">
                Availability
              </label>
              <Select
                value={customization.availabilityStatus}
                onValueChange={(value) => onCustomizationChange('availabilityStatus', value)}
              >
                <SelectTrigger className="bg-black/50 border-gray-600 text-white" data-testid="select-availability">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      Online
                    </div>
                  </SelectItem>
                  <SelectItem value="busy">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      Busy
                    </div>
                  </SelectItem>
                  <SelectItem value="away">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500" />
                      Away
                    </div>
                  </SelectItem>
                  <SelectItem value="offline">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-500" />
                      Offline
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-400 mb-2 block">
                Display Mode
              </label>
              <Select
                value={customization.displayMode}
                onValueChange={(value) => onCustomizationChange('displayMode', value)}
              >
                <SelectTrigger className="bg-black/50 border-gray-600 text-white" data-testid="select-display-mode">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                  <SelectItem value="gaming">Gaming</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Personal Information Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-black/50 backdrop-blur-lg border-blue-500/30 h-full">
          <CardHeader>
            <CardTitle className="text-blue-300 flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              Personal Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Pronouns (e.g., they/them)"
              value={customization.pronouns}
              onChange={(e) => onCustomizationChange('pronouns', e.target.value)}
              className="bg-black/50 border-gray-600 text-white"
              data-testid="input-pronouns"
            />
            <Input
              placeholder="Location"
              value={customization.location}
              onChange={(e) => onCustomizationChange('location', e.target.value)}
              className="bg-black/50 border-gray-600 text-white"
              data-testid="input-location"
            />
            <Input
              placeholder="Occupation"
              value={customization.occupation}
              onChange={(e) => onCustomizationChange('occupation', e.target.value)}
              className="bg-black/50 border-gray-600 text-white"
              data-testid="input-occupation"
            />
            <Input
              placeholder="Company"
              value={customization.company}
              onChange={(e) => onCustomizationChange('company', e.target.value)}
              className="bg-black/50 border-gray-600 text-white"
              data-testid="input-company"
            />
            <Textarea
              placeholder="Favorite Quote"
              value={customization.favoriteQuote}
              onChange={(e) => onCustomizationChange('favoriteQuote', e.target.value)}
              className="bg-black/50 border-gray-600 text-white resize-none"
              rows={3}
              data-testid="textarea-favorite-quote"
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Badges & Achievements Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="bg-black/50 backdrop-blur-lg border-orange-500/30 h-full">
          <CardHeader>
            <CardTitle className="text-orange-300 flex items-center">
              <Award className="w-5 h-5 mr-2" />
              Badges & Skills
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-400 mb-2 block">
                Custom Badges
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {customization.customBadges?.map((badge: string, index: number) => (
                  <Badge key={index} className="bg-orange-500/20 text-orange-300">
                    {badge}
                    <button
                      onClick={() => {
                        const newBadges = customization.customBadges.filter((_: string, i: number) => i !== index);
                        onCustomizationChange('customBadges', newBadges);
                      }}
                      className="ml-1 text-orange-400 hover:text-orange-200"
                      data-testid={`button-remove-badge-${index}`}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a badge"
                  className="bg-black/50 border-gray-600 text-white flex-1"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const input = e.target as HTMLInputElement;
                      if (input.value.trim()) {
                        const newBadges = [...(customization.customBadges || []), input.value.trim()];
                        onCustomizationChange('customBadges', newBadges);
                        input.value = '';
                      }
                    }
                  }}
                  data-testid="input-new-badge"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-400 mb-2 block">
                Skill Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {customization.skillTags?.map((skill: string, index: number) => (
                  <Badge key={index} className="bg-blue-500/20 text-blue-300">
                    {skill}
                    <button
                      onClick={() => {
                        const newSkills = customization.skillTags.filter((_: string, i: number) => i !== index);
                        onCustomizationChange('skillTags', newSkills);
                      }}
                      className="ml-1 text-blue-400 hover:text-blue-200"
                      data-testid={`button-remove-skill-${index}`}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
              <Input
                placeholder="Add a skill (press Enter)"
                className="bg-black/50 border-gray-600 text-white"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const input = e.target as HTMLInputElement;
                    if (input.value.trim()) {
                      const newSkills = [...(customization.skillTags || []), input.value.trim()];
                      onCustomizationChange('skillTags', newSkills);
                      input.value = '';
                    }
                  }
                }}
                data-testid="input-new-skill"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}