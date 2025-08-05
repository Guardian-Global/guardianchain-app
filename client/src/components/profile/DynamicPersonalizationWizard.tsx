import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { 
  Palette, 
  Settings, 
  Eye, 
  Bell, 
  Shield, 
  Zap,
  Sparkles,
  Moon,
  Sun,
  Volume2,
  VolumeX
} from 'lucide-react';

interface PersonalizationSettings {
  theme: 'cyberpunk' | 'minimal' | 'classic';
  accentColor: string;
  animationsEnabled: boolean;
  particleEffects: boolean;
  soundEffects: boolean;
  notifications: boolean;
  autoRefresh: boolean;
  profileLayout: 'grid' | 'list' | 'card';
  privacyLevel: number;
}

const themes = [
  { id: 'cyberpunk', name: 'Cyberpunk', colors: ['#00ffe1', '#ff00d4', '#7c3aed'] },
  { id: 'minimal', name: 'Minimal', colors: ['#6b7280', '#374151', '#1f2937'] },
  { id: 'classic', name: 'Classic', colors: ['#3b82f6', '#10b981', '#f59e0b'] }
];

const accentColors = [
  '#00ffe1', '#ff00d4', '#7c3aed', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4'
];

export function DynamicPersonalizationWizard() {
  const [settings, setSettings] = useState<PersonalizationSettings>({
    theme: 'cyberpunk',
    accentColor: '#00ffe1',
    animationsEnabled: true,
    particleEffects: true,
    soundEffects: false,
    notifications: true,
    autoRefresh: true,
    profileLayout: 'grid',
    privacyLevel: 70
  });

  const [activeStep, setActiveStep] = useState(0);
  const [previewMode, setPreviewMode] = useState(false);

  const steps = [
    { id: 'appearance', title: 'Appearance', icon: <Palette className="h-4 w-4" /> },
    { id: 'interactions', title: 'Interactions', icon: <Zap className="h-4 w-4" /> },
    { id: 'privacy', title: 'Privacy', icon: <Shield className="h-4 w-4" /> },
    { id: 'notifications', title: 'Notifications', icon: <Bell className="h-4 w-4" /> }
  ];

  const updateSetting = <K extends keyof PersonalizationSettings>(
    key: K,
    value: PersonalizationSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const applySettings = () => {
    // Apply settings to the profile
    document.documentElement.style.setProperty('--accent-color', settings.accentColor);
    document.documentElement.classList.toggle('animations-disabled', !settings.animationsEnabled);
    
    // Save to localStorage or send to backend
    localStorage.setItem('profileSettings', JSON.stringify(settings));
    
    setPreviewMode(false);
  };

  const StepContent = () => {
    switch (steps[activeStep].id) {
      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-[#f0f6fc] font-semibold mb-3">Theme</h3>
              <div className="grid grid-cols-3 gap-3">
                {themes.map((theme) => (
                  <div
                    key={theme.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      settings.theme === theme.id
                        ? 'border-[#00ffe1] bg-[#00ffe1]/10'
                        : 'border-[#30363d] hover:border-[#00ffe1]/50'
                    }`}
                    onClick={() => updateSetting('theme', theme.id as any)}
                    data-testid={`theme-${theme.id}`}
                  >
                    <div className="flex gap-1 mb-2">
                      {theme.colors.map((color, index) => (
                        <div
                          key={index}
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-[#f0f6fc]">{theme.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[#f0f6fc] font-semibold mb-3">Accent Color</h3>
              <div className="flex gap-2 flex-wrap">
                {accentColors.map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      settings.accentColor === color
                        ? 'border-white scale-110'
                        : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => updateSetting('accentColor', color)}
                    data-testid={`color-${color}`}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[#f0f6fc] font-semibold mb-3">Layout</h3>
              <div className="flex gap-2">
                {['grid', 'list', 'card'].map((layout) => (
                  <Badge
                    key={layout}
                    variant={settings.profileLayout === layout ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => updateSetting('profileLayout', layout as any)}
                    data-testid={`layout-${layout}`}
                  >
                    {layout}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        );

      case 'interactions':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[#f0f6fc] font-semibold">Animations</h3>
                <p className="text-sm text-[#8b949e]">Enable smooth transitions and effects</p>
              </div>
              <Switch
                checked={settings.animationsEnabled}
                onCheckedChange={(checked) => updateSetting('animationsEnabled', checked)}
                data-testid="toggle-animations"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[#f0f6fc] font-semibold">Particle Effects</h3>
                <p className="text-sm text-[#8b949e]">Background particle animations</p>
              </div>
              <Switch
                checked={settings.particleEffects}
                onCheckedChange={(checked) => updateSetting('particleEffects', checked)}
                data-testid="toggle-particles"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[#f0f6fc] font-semibold">Sound Effects</h3>
                <p className="text-sm text-[#8b949e]">Audio feedback for interactions</p>
              </div>
              <div className="flex items-center gap-2">
                {settings.soundEffects ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                <Switch
                  checked={settings.soundEffects}
                  onCheckedChange={(checked) => updateSetting('soundEffects', checked)}
                  data-testid="toggle-sound"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[#f0f6fc] font-semibold">Auto Refresh</h3>
                <p className="text-sm text-[#8b949e]">Automatically update data</p>
              </div>
              <Switch
                checked={settings.autoRefresh}
                onCheckedChange={(checked) => updateSetting('autoRefresh', checked)}
                data-testid="toggle-refresh"
              />
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-[#f0f6fc] font-semibold mb-3">Privacy Level</h3>
              <div className="space-y-3">
                <Slider
                  value={[settings.privacyLevel]}
                  onValueChange={([value]) => updateSetting('privacyLevel', value)}
                  max={100}
                  step={10}
                  className="w-full"
                  data-testid="privacy-slider"
                />
                <div className="flex justify-between text-sm text-[#8b949e]">
                  <span>Public</span>
                  <span>Current: {settings.privacyLevel}%</span>
                  <span>Private</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#0d1117] rounded-lg border border-[#30363d]">
              <h4 className="text-[#f0f6fc] font-semibold mb-2">What this means:</h4>
              <ul className="text-sm text-[#8b949e] space-y-1">
                {settings.privacyLevel <= 30 && <li>• Profile visible to everyone</li>}
                {settings.privacyLevel <= 50 && <li>• Activity feed public</li>}
                {settings.privacyLevel <= 70 && <li>• Stats visible to community</li>}
                {settings.privacyLevel > 70 && <li>• Limited profile visibility</li>}
                {settings.privacyLevel > 90 && <li>• Private mode enabled</li>}
              </ul>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[#f0f6fc] font-semibold">Push Notifications</h3>
                <p className="text-sm text-[#8b949e]">Get notified about important updates</p>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={(checked) => updateSetting('notifications', checked)}
                data-testid="toggle-notifications"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-[#0d1117] rounded-lg border border-[#30363d]">
                <Bell className="h-6 w-6 text-[#00ffe1] mb-2" />
                <h4 className="text-[#f0f6fc] font-semibold text-sm">Real-time</h4>
                <p className="text-xs text-[#8b949e]">Instant updates</p>
              </div>
              
              <div className="p-3 bg-[#0d1117] rounded-lg border border-[#30363d]">
                <Shield className="h-6 w-6 text-[#ff00d4] mb-2" />
                <h4 className="text-[#f0f6fc] font-semibold text-sm">Security</h4>
                <p className="text-xs text-[#8b949e]">Account alerts</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="bg-[#161b22] border-[#30363d]">
      <CardHeader>
        <CardTitle className="text-[#f0f6fc] flex items-center">
          <Settings className="h-5 w-5 mr-2 text-[#00ffe1]" />
          Personalization Wizard
        </CardTitle>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {steps.map((step, index) => (
              <button
                key={step.id}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  index === activeStep
                    ? 'bg-[#00ffe1] text-black'
                    : index < activeStep
                    ? 'bg-[#00ffe1]/30 text-[#00ffe1]'
                    : 'bg-[#30363d] text-[#8b949e]'
                }`}
                onClick={() => setActiveStep(index)}
                data-testid={`step-${step.id}`}
              >
                {step.icon}
              </button>
            ))}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
            className="border-[#30363d] text-[#f0f6fc]"
            data-testid="preview-toggle"
          >
            <Eye className="h-4 w-4 mr-1" />
            {previewMode ? 'Exit Preview' : 'Preview'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-[#f0f6fc] mb-1">
            {steps[activeStep].title}
          </h2>
          <div className="w-full bg-[#30363d] rounded-full h-2">
            <div
              className="bg-[#00ffe1] h-2 rounded-full transition-all duration-300"
              style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <StepContent />

        <div className="flex justify-between items-center pt-4 border-t border-[#30363d]">
          <Button
            variant="outline"
            onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
            disabled={activeStep === 0}
            className="border-[#30363d] text-[#f0f6fc]"
            data-testid="prev-step"
          >
            Previous
          </Button>
          
          {activeStep === steps.length - 1 ? (
            <Button
              onClick={applySettings}
              className="bg-[#00ffe1] text-black hover:bg-[#00ffe1]/90"
              data-testid="apply-settings"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Apply Settings
            </Button>
          ) : (
            <Button
              onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
              className="bg-[#00ffe1] text-black hover:bg-[#00ffe1]/90"
              data-testid="next-step"
            >
              Next
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}