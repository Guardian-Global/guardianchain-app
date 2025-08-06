import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Palette, Sparkles, Zap, Star, Crown, Eye, Monitor } from 'lucide-react';

interface ProfileThemeSelectorProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}

const profileThemes = {
  cyberpunk: {
    name: 'Cyberpunk Elite',
    description: 'Neon-lit futuristic aesthetic with glitch effects',
    colors: { primary: '#00ffe1', secondary: '#ff00d4', accent: '#7c3aed' },
    effects: ['neon-glow', 'glitch', 'particles', 'hologram'],
    preview: 'from-slate-900 via-purple-900 to-slate-900',
    icon: Zap,
    popular: true
  },
  matrix: {
    name: 'Matrix Code',
    description: 'Digital rain and terminal aesthetics',
    colors: { primary: '#00ff00', secondary: '#00cc00', accent: '#008800' },
    effects: ['code-rain', 'terminal', 'scan-lines', 'data-stream'],
    preview: 'from-black via-green-900 to-black',
    icon: Monitor,
    popular: false
  },
  cosmic: {
    name: 'Cosmic Voyager',
    description: 'Galaxy and space-inspired with nebula effects',
    colors: { primary: '#8b5cf6', secondary: '#06b6d4', accent: '#f59e0b' },
    effects: ['stars', 'nebula', 'orbit', 'cosmic-dust'],
    preview: 'from-purple-900 via-blue-900 to-indigo-900',
    icon: Star,
    popular: true
  },
  neon: {
    name: 'Neon Nights',
    description: 'Bright electric colors with pulsing effects',
    colors: { primary: '#10b981', secondary: '#f59e0b', accent: '#ef4444' },
    effects: ['neon-pulse', 'electric', 'glow-trails', 'lightning'],
    preview: 'from-gray-900 via-gray-800 to-black',
    icon: Sparkles,
    popular: false
  },
  royal: {
    name: 'Royal Gold',
    description: 'Luxury and elegance with gold accents',
    colors: { primary: '#fbbf24', secondary: '#7c2d12', accent: '#dc2626' },
    effects: ['gold-shimmer', 'crown-particles', 'luxury-glow', 'royal-fade'],
    preview: 'from-amber-900 via-red-900 to-yellow-900',
    icon: Crown,
    popular: false
  },
  minimal: {
    name: 'Pure Minimal',
    description: 'Clean and simple with subtle animations',
    colors: { primary: '#1f2937', secondary: '#374151', accent: '#6b7280' },
    effects: ['clean-fade', 'simple-hover', 'minimal-border', 'soft-shadow'],
    preview: 'from-gray-50 to-gray-100',
    icon: Eye,
    popular: true
  },
  holographic: {
    name: 'Holographic',
    description: 'Iridescent rainbow effects with prismatic colors',
    colors: { primary: '#ff0080', secondary: '#00ffff', accent: '#ffff00' },
    effects: ['rainbow-shift', 'hologram', 'prism-light', 'spectrum-wave'],
    preview: 'from-pink-500 via-cyan-500 to-yellow-500',
    icon: Palette,
    popular: true
  },
  quantum: {
    name: 'Quantum Field',
    description: 'Quantum physics inspired with particle effects',
    colors: { primary: '#3b82f6', secondary: '#8b5cf6', accent: '#06b6d4' },
    effects: ['quantum-wave', 'particle-field', 'energy-burst', 'phase-shift'],
    preview: 'from-blue-900 via-purple-800 to-cyan-900',
    icon: Zap,
    popular: false
  }
};

export default function ProfileThemeSelector({ currentTheme, onThemeChange }: ProfileThemeSelectorProps) {
  return (
    <Card className="bg-black/50 backdrop-blur-lg border-cyan-500/30">
      <CardHeader>
        <CardTitle className="text-cyan-300 flex items-center">
          <Palette className="w-5 h-5 mr-2" />
          Profile Theme Selection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(profileThemes).map(([key, theme]) => {
            const IconComponent = theme.icon;
            return (
              <button
                key={key}
                onClick={() => onThemeChange(key)}
                className={`group relative p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                  currentTheme === key 
                    ? 'border-cyan-400 bg-cyan-400/20 shadow-lg shadow-cyan-400/25' 
                    : 'border-gray-600 hover:border-gray-400 bg-black/30'
                }`}
                data-testid={`theme-selector-${key}`}
              >
                {/* Popular Badge */}
                {theme.popular && (
                  <Badge 
                    className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs z-10"
                    data-testid={`badge-popular-${key}`}
                  >
                    Popular
                  </Badge>
                )}

                {/* Theme Preview */}
                <div className={`h-16 rounded-lg bg-gradient-to-r ${theme.preview} mb-3 relative overflow-hidden`}>
                  {/* Animated Preview Effects */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse opacity-50" />
                  <div className="absolute top-2 right-2">
                    <IconComponent className={`w-5 h-5 ${currentTheme === key ? 'text-white' : 'text-gray-400'}`} />
                  </div>
                  
                  {/* Active Theme Indicator */}
                  {currentTheme === key && (
                    <div className="absolute inset-0 bg-cyan-400/20 flex items-center justify-center">
                      <div className="w-3 h-3 bg-cyan-400 rounded-full animate-ping" />
                    </div>
                  )}
                </div>

                {/* Theme Info */}
                <div className="text-left">
                  <div className={`text-sm font-semibold mb-1 ${currentTheme === key ? 'text-cyan-300' : 'text-white'}`}>
                    {theme.name}
                  </div>
                  <div className="text-xs text-gray-400 mb-2 leading-relaxed">
                    {theme.description}
                  </div>
                  
                  {/* Color Palette Preview */}
                  <div className="flex gap-1 mb-2">
                    <div 
                      className="w-3 h-3 rounded-full border border-gray-600" 
                      style={{ backgroundColor: theme.colors.primary }}
                      title="Primary Color"
                    />
                    <div 
                      className="w-3 h-3 rounded-full border border-gray-600" 
                      style={{ backgroundColor: theme.colors.secondary }}
                      title="Secondary Color"
                    />
                    <div 
                      className="w-3 h-3 rounded-full border border-gray-600" 
                      style={{ backgroundColor: theme.colors.accent }}
                      title="Accent Color"
                    />
                  </div>
                  
                  {/* Effects Preview */}
                  <div className="flex flex-wrap gap-1">
                    {theme.effects.slice(0, 2).map((effect, idx) => (
                      <div 
                        key={idx} 
                        className="text-xs px-2 py-1 bg-gray-700/50 rounded-full text-gray-300"
                        data-testid={`effect-${effect}`}
                      >
                        {effect}
                      </div>
                    ))}
                    {theme.effects.length > 2 && (
                      <div className="text-xs px-2 py-1 bg-gray-700/50 rounded-full text-gray-400">
                        +{theme.effects.length - 2}
                      </div>
                    )}
                  </div>
                </div>

                {/* Selection Glow Effect */}
                {currentTheme === key && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/20 via-transparent to-purple-400/20 pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>

        {/* Theme Customization Preview */}
        {currentTheme && profileThemes[currentTheme as keyof typeof profileThemes] && (
          <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-600">
            <h4 className="text-white font-medium mb-3 flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-cyan-400" />
              Active Theme: {profileThemes[currentTheme as keyof typeof profileThemes].name}
            </h4>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <div className="text-gray-400 mb-1">Effects</div>
                <div className="text-white font-medium">
                  {profileThemes[currentTheme as keyof typeof profileThemes].effects.length} Active
                </div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">Primary</div>
                <div 
                  className="w-6 h-6 rounded border border-gray-600" 
                  style={{ backgroundColor: profileThemes[currentTheme as keyof typeof profileThemes].colors.primary }}
                />
              </div>
              <div>
                <div className="text-gray-400 mb-1">Secondary</div>
                <div 
                  className="w-6 h-6 rounded border border-gray-600" 
                  style={{ backgroundColor: profileThemes[currentTheme as keyof typeof profileThemes].colors.secondary }}
                />
              </div>
              <div>
                <div className="text-gray-400 mb-1">Accent</div>
                <div 
                  className="w-6 h-6 rounded border border-gray-600" 
                  style={{ backgroundColor: profileThemes[currentTheme as keyof typeof profileThemes].colors.accent }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-600">
          <Button 
            variant="outline" 
            size="sm"
            className="border-gray-600 text-gray-300 hover:border-gray-400"
            data-testid="button-preview-theme"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview Theme
          </Button>
          <Button 
            size="sm"
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
            data-testid="button-apply-theme"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Apply Theme
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}