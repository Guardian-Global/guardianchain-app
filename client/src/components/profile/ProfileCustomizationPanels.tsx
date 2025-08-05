import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Palette,
  Layout,
  Image,
  Video,
  Upload,
  Sparkles,
  Zap,
  Shield,
  Globe,
  Lock,
  Eye,
  EyeOff,
  Monitor,
  Smartphone,
  Tablet,
  Grid,
  List,
  Layers,
  Settings,
  Download,
  Share2,
  Copy,
  CheckCircle,
  Plus,
  Minus,
  RotateCcw,
  Save,
  Wand2
} from "lucide-react";

interface CustomizationTheme {
  id: string;
  name: string;
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
  };
  effects: {
    glow: boolean;
    blur: boolean;
    gradient: boolean;
    shadows: boolean;
    animations: boolean;
  };
}

interface LayoutConfig {
  id: string;
  name: string;
  description: string;
  preview: string;
  responsive: boolean;
  columns: number;
  spacing: 'tight' | 'normal' | 'loose';
}

const customThemes: CustomizationTheme[] = [
  {
    id: 'cyberpunk-neon',
    name: 'Cyberpunk Neon',
    preview: 'bg-gradient-to-r from-[#00ffe1] to-[#ff00d4]',
    colors: {
      primary: '#00ffe1',
      secondary: '#ff00d4',
      accent: '#7c3aed',
      background: '#0a0e17',
      surface: '#161b22',
      text: '#f0f6fc'
    },
    effects: {
      glow: true,
      blur: false,
      gradient: true,
      shadows: true,
      animations: true
    }
  },
  {
    id: 'quantum-blue',
    name: 'Quantum Blue',
    preview: 'bg-gradient-to-r from-[#4f46e5] to-[#06b6d4]',
    colors: {
      primary: '#4f46e5',
      secondary: '#06b6d4',
      accent: '#8b5cf6',
      background: '#1e1b4b',
      surface: '#312e81',
      text: '#e2e8f0'
    },
    effects: {
      glow: true,
      blur: true,
      gradient: true,
      shadows: false,
      animations: true
    }
  },
  {
    id: 'holographic',
    name: 'Holographic',
    preview: 'bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#06b6d4]',
    colors: {
      primary: '#ec4899',
      secondary: '#8b5cf6',
      accent: '#06b6d4',
      background: '#18181b',
      surface: '#27272a',
      text: '#fafafa'
    },
    effects: {
      glow: true,
      blur: true,
      gradient: true,
      shadows: true,
      animations: true
    }
  },
  {
    id: 'minimal-glass',
    name: 'Minimal Glass',
    preview: 'bg-gradient-to-r from-[#f8fafc] to-[#e2e8f0]',
    colors: {
      primary: '#6366f1',
      secondary: '#f59e0b',
      accent: '#10b981',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1f2937'
    },
    effects: {
      glow: false,
      blur: true,
      gradient: false,
      shadows: true,
      animations: false
    }
  }
];

const layoutConfigs: LayoutConfig[] = [
  {
    id: 'hero-grid',
    name: 'Hero Grid',
    description: 'Large hero section with grid layout',
    preview: 'Hero + 3x3 Grid',
    responsive: true,
    columns: 3,
    spacing: 'normal'
  },
  {
    id: 'timeline',
    name: 'Timeline Flow',
    description: 'Chronological timeline layout',
    preview: 'Vertical Timeline',
    responsive: true,
    columns: 1,
    spacing: 'loose'
  },
  {
    id: 'magazine',
    name: 'Magazine Style',
    description: 'Editorial magazine layout',
    preview: 'Magazine Grid',
    responsive: true,
    columns: 2,
    spacing: 'tight'
  },
  {
    id: 'dashboard',
    name: 'Dashboard View',
    description: 'Data-focused dashboard',
    preview: 'Stats Dashboard',
    responsive: true,
    columns: 4,
    spacing: 'normal'
  },
  {
    id: 'portfolio',
    name: 'Portfolio Gallery',
    description: 'Visual portfolio layout',
    preview: 'Image Gallery',
    responsive: true,
    columns: 3,
    spacing: 'tight'
  }
];

interface ProfileCustomizationPanelsProps {
  selectedTheme?: CustomizationTheme;
  selectedLayout?: LayoutConfig;
  onThemeChange: (theme: CustomizationTheme) => void;
  onLayoutChange: (layout: LayoutConfig) => void;
  onSettingChange: (category: string, setting: string, value: any) => void;
  settings: Record<string, any>;
}

export default function ProfileCustomizationPanels({
  selectedTheme = customThemes[0],
  selectedLayout = layoutConfigs[0],
  onThemeChange,
  onLayoutChange,
  onSettingChange,
  settings = {}
}: ProfileCustomizationPanelsProps) {
  const [activePanel, setActivePanel] = useState('theme');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const ThemeCustomizer = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium">Pre-built Themes</Label>
        <div className="grid grid-cols-1 gap-4 mt-3">
          {customThemes.map((theme) => (
            <div
              key={theme.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedTheme.id === theme.id
                  ? 'border-[#00ffe1] bg-[#00ffe1]/10'
                  : 'border-[#30363d] hover:border-[#8b949e]'
              }`}
              onClick={() => onThemeChange(theme)}
              data-testid={`theme-option-${theme.id}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-[#f0f6fc] mb-2">{theme.name}</div>
                  <div className={`h-8 rounded-md ${theme.preview}`} />
                  <div className="flex gap-2 mt-2">
                    <div 
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                    <div 
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: theme.colors.secondary }}
                    />
                    <div 
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: theme.colors.accent }}
                    />
                  </div>
                </div>
                {selectedTheme.id === theme.id && (
                  <CheckCircle className="w-5 h-5 text-[#00ffe1] ml-3" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-base font-medium">Theme Effects</Label>
        <div className="space-y-3 mt-3">
          {Object.entries({
            glow: 'Glow Effects',
            blur: 'Glass Blur',
            gradient: 'Gradient Backgrounds',
            shadows: 'Drop Shadows',
            animations: 'Smooth Animations'
          }).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm text-[#8b949e]">{label}</span>
              <Switch
                checked={selectedTheme.effects[key as keyof typeof selectedTheme.effects]}
                onCheckedChange={(checked) => onSettingChange('theme', `effects.${key}`, checked)}
                data-testid={`toggle-effect-${key}`}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-base font-medium">Custom Colors</Label>
        <div className="grid grid-cols-2 gap-4 mt-3">
          {Object.entries({
            primary: 'Primary',
            secondary: 'Secondary',
            accent: 'Accent',
            background: 'Background'
          }).map(([key, label]) => (
            <div key={key}>
              <Label className="text-xs text-[#8b949e]">{label}</Label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={selectedTheme.colors[key as keyof typeof selectedTheme.colors]}
                  onChange={(e) => onSettingChange('theme', `colors.${key}`, e.target.value)}
                  className="w-8 h-8 rounded border-[#30363d] bg-transparent cursor-pointer"
                  data-testid={`color-picker-${key}`}
                />
                <Input
                  value={selectedTheme.colors[key as keyof typeof selectedTheme.colors]}
                  onChange={(e) => onSettingChange('theme', `colors.${key}`, e.target.value)}
                  className="bg-[#21262d] border-[#30363d] text-[#f0f6fc] text-xs"
                  placeholder="#000000"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const LayoutCustomizer = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium">Layout Templates</Label>
        <div className="grid grid-cols-1 gap-3 mt-3">
          {layoutConfigs.map((layout) => (
            <div
              key={layout.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedLayout.id === layout.id
                  ? 'border-[#00ffe1] bg-[#00ffe1]/10'
                  : 'border-[#30363d] hover:border-[#8b949e]'
              }`}
              onClick={() => onLayoutChange(layout)}
              data-testid={`layout-option-${layout.id}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-[#f0f6fc]">{layout.name}</div>
                  <div className="text-sm text-[#8b949e] mt-1">{layout.description}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {layout.columns} cols
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {layout.spacing}
                    </Badge>
                    {layout.responsive && (
                      <Badge variant="outline" className="text-xs">
                        Responsive
                      </Badge>
                    )}
                  </div>
                </div>
                {selectedLayout.id === layout.id && (
                  <CheckCircle className="w-5 h-5 text-[#00ffe1]" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-base font-medium">Layout Settings</Label>
        <div className="space-y-4 mt-3">
          <div>
            <Label className="text-sm text-[#8b949e]">Content Spacing</Label>
            <Select 
              value={settings.spacing || 'normal'} 
              onValueChange={(value) => onSettingChange('layout', 'spacing', value)}
            >
              <SelectTrigger className="bg-[#21262d] border-[#30363d] text-[#f0f6fc] mt-1" data-testid="select-spacing">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#21262d] border-[#30363d]">
                <SelectItem value="tight">Tight</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="loose">Loose</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm text-[#8b949e]">Section Order</Label>
            <div className="space-y-2 mt-2">
              {['Header', 'Stats', 'Bio', 'Activity', 'Connections'].map((section, index) => (
                <div key={section} className="flex items-center justify-between p-3 bg-[#21262d] rounded-lg">
                  <span className="text-sm text-[#f0f6fc]">{section}</span>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Plus className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Minus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const MediaCustomizer = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium">Profile Media</Label>
        <div className="space-y-4 mt-3">
          <div className="p-4 border-2 border-dashed border-[#30363d] rounded-lg text-center">
            <Upload className="w-8 h-8 text-[#8b949e] mx-auto mb-2" />
            <div className="text-sm text-[#8b949e] mb-2">Upload Profile Image</div>
            <Button variant="outline" size="sm" data-testid="upload-profile-image">
              Choose File
            </Button>
          </div>
          
          <div className="p-4 border-2 border-dashed border-[#30363d] rounded-lg text-center">
            <Video className="w-8 h-8 text-[#8b949e] mx-auto mb-2" />
            <div className="text-sm text-[#8b949e] mb-2">Upload Background Video</div>
            <Button variant="outline" size="sm" data-testid="upload-background-video">
              Choose Video
            </Button>
          </div>
        </div>
      </div>

      <div>
        <Label className="text-base font-medium">Media Settings</Label>
        <div className="space-y-3 mt-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#8b949e]">Auto-play Videos</span>
            <Switch
              checked={settings.autoPlayVideos || false}
              onCheckedChange={(checked) => onSettingChange('media', 'autoPlayVideos', checked)}
              data-testid="toggle-autoplay-videos"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#8b949e]">Show Image Captions</span>
            <Switch
              checked={settings.showCaptions || true}
              onCheckedChange={(checked) => onSettingChange('media', 'showCaptions', checked)}
              data-testid="toggle-show-captions"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#8b949e]">Enable Lightbox</span>
            <Switch
              checked={settings.enableLightbox || true}
              onCheckedChange={(checked) => onSettingChange('media', 'enableLightbox', checked)}
              data-testid="toggle-enable-lightbox"
            />
          </div>
        </div>
      </div>

      <div>
        <Label className="text-base font-medium">Image Quality</Label>
        <div className="mt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#8b949e]">Compression Level</span>
            <span className="text-sm text-[#f0f6fc]">{settings.imageQuality || 80}%</span>
          </div>
          <Slider
            value={[settings.imageQuality || 80]}
            onValueChange={([value]) => onSettingChange('media', 'imageQuality', value)}
            max={100}
            min={20}
            step={10}
            className="w-full"
            data-testid="slider-image-quality"
          />
        </div>
      </div>
    </div>
  );

  const AdvancedSettings = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium">Performance</Label>
        <div className="space-y-3 mt-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#8b949e]">Lazy Loading</span>
            <Switch
              checked={settings.lazyLoading !== false}
              onCheckedChange={(checked) => onSettingChange('advanced', 'lazyLoading', checked)}
              data-testid="toggle-lazy-loading"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#8b949e]">Preload Critical Assets</span>
            <Switch
              checked={settings.preloadAssets || true}
              onCheckedChange={(checked) => onSettingChange('advanced', 'preloadAssets', checked)}
              data-testid="toggle-preload-assets"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#8b949e]">Enable Service Worker</span>
            <Switch
              checked={settings.serviceWorker || false}
              onCheckedChange={(checked) => onSettingChange('advanced', 'serviceWorker', checked)}
              data-testid="toggle-service-worker"
            />
          </div>
        </div>
      </div>

      <div>
        <Label className="text-base font-medium">SEO Settings</Label>
        <div className="space-y-3 mt-3">
          <div>
            <Label className="text-sm text-[#8b949e]">Meta Description</Label>
            <Input
              value={settings.metaDescription || ''}
              onChange={(e) => onSettingChange('seo', 'metaDescription', e.target.value)}
              className="bg-[#21262d] border-[#30363d] text-[#f0f6fc] mt-1"
              placeholder="Describe your profile..."
              maxLength={160}
              data-testid="input-meta-description"
            />
          </div>
          <div>
            <Label className="text-sm text-[#8b949e]">Keywords</Label>
            <Input
              value={settings.keywords || ''}
              onChange={(e) => onSettingChange('seo', 'keywords', e.target.value)}
              className="bg-[#21262d] border-[#30363d] text-[#f0f6fc] mt-1"
              placeholder="guardian, truth, blockchain..."
              data-testid="input-keywords"
            />
          </div>
        </div>
      </div>

      <div>
        <Label className="text-base font-medium">Analytics</Label>
        <div className="space-y-3 mt-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#8b949e]">Track Profile Views</span>
            <Switch
              checked={settings.trackViews !== false}
              onCheckedChange={(checked) => onSettingChange('analytics', 'trackViews', checked)}
              data-testid="toggle-track-views"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#8b949e]">Track Interactions</span>
            <Switch
              checked={settings.trackInteractions !== false}
              onCheckedChange={(checked) => onSettingChange('analytics', 'trackInteractions', checked)}
              data-testid="toggle-track-interactions"
            />
          </div>
        </div>
      </div>

      <div>
        <Label className="text-base font-medium">Export & Import</Label>
        <div className="flex gap-3 mt-3">
          <Button variant="outline" size="sm" className="flex-1" data-testid="export-profile">
            <Download className="w-4 h-4 mr-2" />
            Export Profile
          </Button>
          <Button variant="outline" size="sm" className="flex-1" data-testid="import-profile">
            <Upload className="w-4 h-4 mr-2" />
            Import Profile
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="bg-[#161b22] border-[#30363d]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-[#f0f6fc] flex items-center gap-2">
            <Wand2 className="w-5 h-5" />
            Profile Customization
          </CardTitle>
          <div className="flex items-center gap-1 bg-[#21262d] rounded-lg p-1">
            <Button
              variant={previewMode === 'desktop' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPreviewMode('desktop')}
              data-testid="preview-desktop"
            >
              <Monitor className="w-4 h-4" />
            </Button>
            <Button
              variant={previewMode === 'tablet' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPreviewMode('tablet')}
              data-testid="preview-tablet"
            >
              <Tablet className="w-4 h-4" />
            </Button>
            <Button
              variant={previewMode === 'mobile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPreviewMode('mobile')}
              data-testid="preview-mobile"
            >
              <Smartphone className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activePanel} onValueChange={setActivePanel} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-[#21262d]">
            <TabsTrigger value="theme" className="flex items-center gap-2" data-testid="tab-theme">
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">Theme</span>
            </TabsTrigger>
            <TabsTrigger value="layout" className="flex items-center gap-2" data-testid="tab-layout">
              <Layout className="w-4 h-4" />
              <span className="hidden sm:inline">Layout</span>
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-2" data-testid="tab-media">
              <Image className="w-4 h-4" />
              <span className="hidden sm:inline">Media</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2" data-testid="tab-advanced">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Advanced</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="theme" className="m-0">
              <ThemeCustomizer />
            </TabsContent>
            
            <TabsContent value="layout" className="m-0">
              <LayoutCustomizer />
            </TabsContent>
            
            <TabsContent value="media" className="m-0">
              <MediaCustomizer />
            </TabsContent>
            
            <TabsContent value="advanced" className="m-0">
              <AdvancedSettings />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export { customThemes, layoutConfigs };
export type { CustomizationTheme, LayoutConfig };