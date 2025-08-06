import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { 
  Palette, 
  Layout, 
  Eye, 
  EyeOff,
  Volume2, 
  VolumeX,
  Sparkles, 
  Music,
  Image,
  Video,
  Camera,
  Settings,
  Globe,
  Shield,
  Bell,
  BellOff,
  User,
  Users,
  Heart,
  Star,
  Zap,
  Crown,
  Trophy,
  Target,
  Award,
  Brush,
  Wand2,
  Filter,
  Contrast,
  Sun,
  Moon,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Gamepad2,
  Code,
  Briefcase,
  GraduationCap,
  Headphones,
  Radio,
  Mic,
  MessageSquare,
  Share2,
  Download,
  Upload,
  Bookmark,
  Lock,
  Unlock,
  RefreshCw,
  RotateCcw,
  Save,
  Edit3,
  Plus,
  Minus,
  X,
  Check,
  AlertTriangle,
  Info,
  HelpCircle
} from 'lucide-react';

interface AdvancedProfileOptionsProps {
  profileData: any;
  onUpdate: (updates: any) => void;
}

const advancedThemes = {
  cyberpunk: {
    name: 'Cyberpunk',
    description: 'Neon-lit futuristic aesthetic',
    colors: { primary: '#00ffe1', secondary: '#ff00d4', accent: '#7c3aed' },
    effects: ['neon', 'glitch', 'particles'],
    preview: 'from-slate-900 via-purple-900 to-slate-900'
  },
  matrix: {
    name: 'Matrix',
    description: 'Digital rain and green terminals',
    colors: { primary: '#00ff00', secondary: '#00cc00', accent: '#008800' },
    effects: ['rain', 'terminal', 'scan'],
    preview: 'from-black via-green-900 to-black'
  },
  cosmic: {
    name: 'Cosmic',
    description: 'Galaxy and space-inspired',
    colors: { primary: '#8b5cf6', secondary: '#06b6d4', accent: '#f59e0b' },
    effects: ['stars', 'nebula', 'orbit'],
    preview: 'from-purple-900 via-blue-900 to-indigo-900'
  },
  neon: {
    name: 'Neon',
    description: 'Bright electric colors',
    colors: { primary: '#10b981', secondary: '#f59e0b', accent: '#ef4444' },
    effects: ['glow', 'pulse', 'electric'],
    preview: 'from-gray-900 via-gray-800 to-black'
  },
  royal: {
    name: 'Royal',
    description: 'Luxury and elegance',
    colors: { primary: '#fbbf24', secondary: '#7c2d12', accent: '#dc2626' },
    effects: ['shimmer', 'gold', 'crown'],
    preview: 'from-amber-900 via-red-900 to-yellow-900'
  },
  minimal: {
    name: 'Minimal',
    description: 'Clean and simple',
    colors: { primary: '#1f2937', secondary: '#374151', accent: '#6b7280' },
    effects: ['clean', 'fade', 'simple'],
    preview: 'from-gray-50 to-gray-100'
  },
  holographic: {
    name: 'Holographic',
    description: 'Iridescent rainbow effects',
    colors: { primary: '#ff0080', secondary: '#00ffff', accent: '#ffff00' },
    effects: ['rainbow', 'hologram', 'prism'],
    preview: 'from-pink-500 via-cyan-500 to-yellow-500'
  },
  steampunk: {
    name: 'Steampunk',
    description: 'Victorian industrial aesthetic',
    colors: { primary: '#8b4513', secondary: '#cd853f', accent: '#daa520' },
    effects: ['gears', 'steam', 'brass'],
    preview: 'from-amber-800 via-orange-800 to-yellow-800'
  }
};

const profileLayouts = {
  grid: { name: 'Grid', icon: Layout, description: 'Organized card layout' },
  timeline: { name: 'Timeline', icon: Layout, description: 'Chronological feed' },
  magazine: { name: 'Magazine', icon: Layout, description: 'Editorial style' },
  portfolio: { name: 'Portfolio', icon: Briefcase, description: 'Professional showcase' },
  social: { name: 'Social', icon: Users, description: 'Social media style' },
  minimal: { name: 'Minimal', icon: Layout, description: 'Clean and simple' },
  immersive: { name: 'Immersive', icon: Monitor, description: 'Full-screen experience' },
  dashboard: { name: 'Dashboard', icon: Layout, description: 'Analytics focused' }
};

const displayModes = {
  professional: { name: 'Professional', icon: Briefcase, description: 'Business-focused' },
  creative: { name: 'Creative', icon: Brush, description: 'Artistic expression' },
  gaming: { name: 'Gaming', icon: Gamepad2, description: 'Gaming community' },
  academic: { name: 'Academic', icon: GraduationCap, description: 'Educational focus' },
  developer: { name: 'Developer', icon: Code, description: 'Tech-oriented' },
  influencer: { name: 'Influencer', icon: Star, description: 'Social presence' }
};

const animationPresets = {
  none: { name: 'None', intensity: 0 },
  subtle: { name: 'Subtle', intensity: 25 },
  moderate: { name: 'Moderate', intensity: 50 },
  dynamic: { name: 'Dynamic', intensity: 75 },
  intense: { name: 'Intense', intensity: 100 }
};

export default function AdvancedProfileOptions({ profileData, onUpdate }: AdvancedProfileOptionsProps) {
  const [activeSection, setActiveSection] = useState('theme');
  const customization = profileData?.customization || {};

  const updateCustomization = (key: string, value: any) => {
    const newCustomization = { ...customization, [key]: value };
    onUpdate({ customization: newCustomization });
  };

  const sections = [
    { id: 'theme', name: 'Theme & Appearance', icon: Palette },
    { id: 'layout', name: 'Layout & Structure', icon: Layout },
    { id: 'animations', name: 'Effects & Animations', icon: Sparkles },
    { id: 'privacy', name: 'Privacy & Visibility', icon: Shield },
    { id: 'social', name: 'Social & Contact', icon: Users },
    { id: 'media', name: 'Media & Content', icon: Image },
    { id: 'advanced', name: 'Advanced Settings', icon: Settings }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Section Navigation */}
      <Card className="bg-black/50 backdrop-blur-lg border-cyan-500/30">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2">
            {sections.map((section) => (
              <Button
                key={section.id}
                variant={activeSection === section.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveSection(section.id)}
                className={`transition-all ${
                  activeSection === section.id 
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white' 
                    : 'border-gray-600 text-gray-300 hover:border-gray-400'
                }`}
                data-testid={`section-${section.id}`}
              >
                <section.icon className="w-4 h-4 mr-2" />
                {section.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Theme & Appearance Section */}
      {activeSection === 'theme' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Theme Selection */}
          <Card className="bg-black/50 backdrop-blur-lg border-cyan-500/30">
            <CardHeader>
              <CardTitle className="text-cyan-300 flex items-center">
                <Palette className="w-5 h-5 mr-2" />
                Theme Selection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(advancedThemes).map(([key, theme]) => (
                  <button
                    key={key}
                    onClick={() => updateCustomization('theme', key)}
                    className={`p-4 rounded-lg border-2 transition-all relative overflow-hidden ${
                      customization.theme === key 
                        ? 'border-cyan-400 bg-cyan-400/20' 
                        : 'border-gray-600 hover:border-gray-400'
                    }`}
                    data-testid={`advanced-theme-${key}`}
                  >
                    <div className={`h-12 rounded bg-gradient-to-r ${theme.preview} mb-3 relative`}>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
                    </div>
                    <div className="text-sm font-medium text-white mb-1">{theme.name}</div>
                    <div className="text-xs text-gray-400">{theme.description}</div>
                    <div className="flex gap-1 mt-2">
                      {theme.effects.slice(0, 3).map((effect, idx) => (
                        <div key={idx} className="text-xs px-2 py-1 bg-gray-700 rounded">
                          {effect}
                        </div>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Color Customization */}
          <Card className="bg-black/50 backdrop-blur-lg border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-purple-300 flex items-center">
                <Brush className="w-5 h-5 mr-2" />
                Color Customization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-400 mb-2 block">
                    Primary Color
                  </label>
                  <Input
                    type="color"
                    value={customization.primaryColor || '#00ffe1'}
                    onChange={(e) => updateCustomization('primaryColor', e.target.value)}
                    className="w-full h-12 bg-black/50 border-gray-600"
                    data-testid="input-primary-color"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400 mb-2 block">
                    Accent Color
                  </label>
                  <Input
                    type="color"
                    value={customization.accentColor || '#7c3aed'}
                    onChange={(e) => updateCustomization('accentColor', e.target.value)}
                    className="w-full h-12 bg-black/50 border-gray-600"
                    data-testid="input-accent-color"
                  />
                </div>
              </div>

              {/* Background Options */}
              <div>
                <label className="text-sm font-medium text-gray-400 mb-2 block">
                  Background Image URL
                </label>
                <Input
                  placeholder="https://example.com/image.jpg"
                  value={customization.backgroundImage || ''}
                  onChange={(e) => updateCustomization('backgroundImage', e.target.value)}
                  className="bg-black/50 border-gray-600 text-white"
                  data-testid="input-background-image"
                />
              </div>

              {/* Opacity Controls */}
              <div>
                <label className="text-sm font-medium text-gray-400 mb-2 block">
                  Background Opacity: {customization.backgroundOpacity || 80}%
                </label>
                <Slider
                  value={[customization.backgroundOpacity || 80]}
                  onValueChange={([value]) => updateCustomization('backgroundOpacity', value)}
                  max={100}
                  step={5}
                  className="w-full"
                  data-testid="slider-background-opacity"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Layout & Structure Section */}
      {activeSection === 'layout' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <Card className="bg-black/50 backdrop-blur-lg border-green-500/30">
            <CardHeader>
              <CardTitle className="text-green-300 flex items-center">
                <Layout className="w-5 h-5 mr-2" />
                Profile Layout
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(profileLayouts).map(([key, layout]) => (
                  <button
                    key={key}
                    onClick={() => updateCustomization('profileLayout', key)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      customization.profileLayout === key 
                        ? 'border-green-400 bg-green-400/20' 
                        : 'border-gray-600 hover:border-gray-400'
                    }`}
                    data-testid={`layout-${key}`}
                  >
                    <layout.icon className={`w-8 h-8 mx-auto mb-2 ${
                      customization.profileLayout === key ? 'text-green-400' : 'text-gray-400'
                    }`} />
                    <div className="text-sm font-medium text-white mb-1">{layout.name}</div>
                    <div className="text-xs text-gray-400">{layout.description}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/50 backdrop-blur-lg border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-blue-300 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Display Mode
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(displayModes).map(([key, mode]) => (
                  <button
                    key={key}
                    onClick={() => updateCustomization('displayMode', key)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      customization.displayMode === key 
                        ? 'border-blue-400 bg-blue-400/20' 
                        : 'border-gray-600 hover:border-gray-400'
                    }`}
                    data-testid={`display-mode-${key}`}
                  >
                    <mode.icon className={`w-8 h-8 mx-auto mb-2 ${
                      customization.displayMode === key ? 'text-blue-400' : 'text-gray-400'
                    }`} />
                    <div className="text-sm font-medium text-white mb-1">{mode.name}</div>
                    <div className="text-xs text-gray-400">{mode.description}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Effects & Animations Section */}
      {activeSection === 'animations' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <Card className="bg-black/50 backdrop-blur-lg border-yellow-500/30">
            <CardHeader>
              <CardTitle className="text-yellow-300 flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                Visual Effects
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span className="text-white text-sm">Particle Effects</span>
                </div>
                <Switch
                  checked={customization.particleEffects || false}
                  onCheckedChange={(checked) => updateCustomization('particleEffects', checked)}
                  data-testid="switch-particle-effects"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-300" />
                  <span className="text-white text-sm">Hover Animations</span>
                </div>
                <Switch
                  checked={customization.hoverAnimations || true}
                  onCheckedChange={(checked) => updateCustomization('hoverAnimations', checked)}
                  data-testid="switch-hover-animations"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-yellow-300" />
                  <span className="text-white text-sm">Magic Cursor</span>
                </div>
                <Switch
                  checked={customization.magicCursor || false}
                  onCheckedChange={(checked) => updateCustomization('magicCursor', checked)}
                  data-testid="switch-magic-cursor"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-400 mb-2 block">
                  Animation Intensity: {customization.animationIntensity || 50}%
                </label>
                <Slider
                  value={[customization.animationIntensity || 50]}
                  onValueChange={([value]) => updateCustomization('animationIntensity', value)}
                  max={100}
                  step={25}
                  className="w-full"
                  data-testid="slider-animation-intensity"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Minimal</span>
                  <span>Moderate</span>
                  <span>Maximum</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/50 backdrop-blur-lg border-pink-500/30">
            <CardHeader>
              <CardTitle className="text-pink-300 flex items-center">
                <Music className="w-5 h-5 mr-2" />
                Audio & Interaction
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-pink-300" />
                  <span className="text-white text-sm">Sound Effects</span>
                </div>
                <Switch
                  checked={customization.soundEffects || false}
                  onCheckedChange={(checked) => updateCustomization('soundEffects', checked)}
                  data-testid="switch-sound-effects"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-pink-300" />
                  <span className="text-white text-sm">Background Music</span>
                </div>
                <Switch
                  checked={customization.backgroundMusic || false}
                  onCheckedChange={(checked) => updateCustomization('backgroundMusic', checked)}
                  data-testid="switch-background-music"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mic className="w-4 h-4 text-pink-300" />
                  <span className="text-white text-sm">Voice Commands</span>
                </div>
                <Switch
                  checked={customization.voiceCommands || false}
                  onCheckedChange={(checked) => updateCustomization('voiceCommands', checked)}
                  data-testid="switch-voice-commands"
                />
              </div>

              {customization.backgroundMusic && (
                <div>
                  <label className="text-sm font-medium text-gray-400 mb-2 block">
                    Music Volume: {customization.musicVolume || 30}%
                  </label>
                  <Slider
                    value={[customization.musicVolume || 30]}
                    onValueChange={([value]) => updateCustomization('musicVolume', value)}
                    max={100}
                    step={5}
                    className="w-full"
                    data-testid="slider-music-volume"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Privacy & Visibility Section */}
      {activeSection === 'privacy' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card className="bg-black/50 backdrop-blur-lg border-red-500/30">
            <CardHeader>
              <CardTitle className="text-red-300 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Privacy Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-white font-medium">Profile Visibility</h4>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div>
                      <div className="text-white font-medium">Public Profile</div>
                      <div className="text-sm text-gray-400">Allow others to find and view your profile</div>
                    </div>
                    <Switch
                      checked={customization.profilePublic !== false}
                      onCheckedChange={(checked) => updateCustomization('profilePublic', checked)}
                      data-testid="switch-profile-public"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div>
                      <div className="text-white font-medium">Search Engine Indexing</div>
                      <div className="text-sm text-gray-400">Allow search engines to index your profile</div>
                    </div>
                    <Switch
                      checked={customization.searchIndexing || false}
                      onCheckedChange={(checked) => updateCustomization('searchIndexing', checked)}
                      data-testid="switch-search-indexing"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div>
                      <div className="text-white font-medium">Show Online Status</div>
                      <div className="text-sm text-gray-400">Display when you're active</div>
                    </div>
                    <Switch
                      checked={customization.showOnlineStatus !== false}
                      onCheckedChange={(checked) => updateCustomization('showOnlineStatus', checked)}
                      data-testid="switch-online-status"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-white font-medium">Content Sharing</h4>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div>
                      <div className="text-white font-medium">Public Capsules</div>
                      <div className="text-sm text-gray-400">Show your capsules to visitors</div>
                    </div>
                    <Switch
                      checked={customization.showCapsulesPublic !== false}
                      onCheckedChange={(checked) => updateCustomization('showCapsulesPublic', checked)}
                      data-testid="switch-public-capsules"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div>
                      <div className="text-white font-medium">Statistics Display</div>
                      <div className="text-sm text-gray-400">Show your truth score and achievements</div>
                    </div>
                    <Switch
                      checked={customization.showStatsPublic !== false}
                      onCheckedChange={(checked) => updateCustomization('showStatsPublic', checked)}
                      data-testid="switch-show-stats"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div>
                      <div className="text-white font-medium">Activity Timeline</div>
                      <div className="text-sm text-gray-400">Display your recent activities</div>
                    </div>
                    <Switch
                      checked={customization.showActivityFeed !== false}
                      onCheckedChange={(checked) => updateCustomization('showActivityFeed', checked)}
                      data-testid="switch-activity-feed"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Social & Contact Section */}
      {activeSection === 'social' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <Card className="bg-black/50 backdrop-blur-lg border-cyan-500/30">
            <CardHeader>
              <CardTitle className="text-cyan-300 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Social Networks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'twitter', label: 'Twitter/X', placeholder: 'https://twitter.com/username' },
                { key: 'github', label: 'GitHub', placeholder: 'https://github.com/username' },
                { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/username' },
                { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/username' },
                { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@username' },
                { key: 'twitch', label: 'Twitch', placeholder: 'https://twitch.tv/username' },
                { key: 'discord', label: 'Discord', placeholder: 'username#1234' },
                { key: 'telegram', label: 'Telegram', placeholder: '@username' }
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="text-sm font-medium text-gray-400 mb-2 block">
                    {label}
                  </label>
                  <Input
                    placeholder={placeholder}
                    value={customization.socialLinks?.[key] || ''}
                    onChange={(e) => updateCustomization('socialLinks', { 
                      ...customization.socialLinks, 
                      [key]: e.target.value 
                    })}
                    className="bg-black/50 border-gray-600 text-white"
                    data-testid={`input-social-${key}`}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-black/50 backdrop-blur-lg border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-purple-300 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Communication Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-purple-300" />
                  <span className="text-white text-sm">Direct Messages</span>
                </div>
                <Switch
                  checked={customization.allowDirectMessages !== false}
                  onCheckedChange={(checked) => updateCustomization('allowDirectMessages', checked)}
                  data-testid="switch-direct-messages"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-purple-300" />
                  <span className="text-white text-sm">Email Notifications</span>
                </div>
                <Switch
                  checked={customization.emailNotifications !== false}
                  onCheckedChange={(checked) => updateCustomization('emailNotifications', checked)}
                  data-testid="switch-email-notifications"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-300" />
                  <span className="text-white text-sm">Friend Requests</span>
                </div>
                <Select
                  value={customization.friendRequestPolicy || 'everyone'}
                  onValueChange={(value) => updateCustomization('friendRequestPolicy', value)}
                >
                  <SelectTrigger className="w-32 bg-black/50 border-gray-600 text-white" data-testid="select-friend-policy">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="everyone">Everyone</SelectItem>
                    <SelectItem value="friends">Friends of Friends</SelectItem>
                    <SelectItem value="none">No One</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator className="bg-gray-600" />

              <div>
                <label className="text-sm font-medium text-gray-400 mb-2 block">
                  Status Message
                </label>
                <Textarea
                  placeholder="What's on your mind?"
                  value={customization.statusMessage || ''}
                  onChange={(e) => updateCustomization('statusMessage', e.target.value)}
                  className="bg-black/50 border-gray-600 text-white resize-none"
                  rows={3}
                  maxLength={280}
                  data-testid="textarea-status-message"
                />
                <div className="text-xs text-gray-400 mt-1">
                  {(customization.statusMessage || '').length}/280 characters
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Advanced Settings Section */}
      {activeSection === 'advanced' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card className="bg-black/50 backdrop-blur-lg border-orange-500/30">
            <CardHeader>
              <CardTitle className="text-orange-300 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Advanced Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-white font-medium">Performance Settings</h4>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-orange-300" />
                      <span className="text-white text-sm">Hardware Acceleration</span>
                    </div>
                    <Switch
                      checked={customization.hardwareAcceleration !== false}
                      onCheckedChange={(checked) => updateCustomization('hardwareAcceleration', checked)}
                      data-testid="switch-hardware-acceleration"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-orange-300" />
                      <span className="text-white text-sm">High Refresh Rate</span>
                    </div>
                    <Switch
                      checked={customization.highRefreshRate || false}
                      onCheckedChange={(checked) => updateCustomization('highRefreshRate', checked)}
                      data-testid="switch-high-refresh-rate"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-400 mb-2 block">
                      Image Quality: {customization.imageQuality || 'High'}
                    </label>
                    <Select
                      value={customization.imageQuality || 'high'}
                      onValueChange={(value) => updateCustomization('imageQuality', value)}
                    >
                      <SelectTrigger className="bg-black/50 border-gray-600 text-white" data-testid="select-image-quality">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low (Faster)</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="ultra">Ultra (Slower)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-white font-medium">Data & Storage</h4>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4 text-orange-300" />
                      <span className="text-white text-sm">Offline Mode</span>
                    </div>
                    <Switch
                      checked={customization.offlineMode || false}
                      onCheckedChange={(checked) => updateCustomization('offlineMode', checked)}
                      data-testid="switch-offline-mode"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-orange-300" />
                      <span className="text-white text-sm">Auto-Sync</span>
                    </div>
                    <Switch
                      checked={customization.autoSync !== false}
                      onCheckedChange={(checked) => updateCustomization('autoSync', checked)}
                      data-testid="switch-auto-sync"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-400 mb-2 block">
                      Data Retention: {customization.dataRetention || '1 Year'}
                    </label>
                    <Select
                      value={customization.dataRetention || '1year'}
                      onValueChange={(value) => updateCustomization('dataRetention', value)}
                    >
                      <SelectTrigger className="bg-black/50 border-gray-600 text-white" data-testid="select-data-retention">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1month">1 Month</SelectItem>
                        <SelectItem value="6months">6 Months</SelectItem>
                        <SelectItem value="1year">1 Year</SelectItem>
                        <SelectItem value="forever">Forever</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator className="bg-gray-600" />

              {/* Export/Import Settings */}
              <div className="space-y-4">
                <h4 className="text-white font-medium">Profile Management</h4>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:border-gray-400"
                    data-testid="button-export-profile"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Profile
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:border-gray-400"
                    data-testid="button-import-profile"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Import Profile
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:border-gray-400"
                    data-testid="button-reset-profile"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset to Default
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Save Button */}
      <div className="flex justify-center">
        <Button 
          size="lg" 
          className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
          data-testid="button-save-all-settings"
        >
          <Save className="w-5 h-5 mr-2" />
          Save All Settings
        </Button>
      </div>
    </div>
  );
}