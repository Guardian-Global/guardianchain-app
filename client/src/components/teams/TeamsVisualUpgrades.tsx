import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Palette,
  Sparkles,
  Monitor,
  Smartphone,
  Zap,
  Crown,
  Eye,
  Settings,
  Layers,
  Brush,
  Image,
  Video,
} from "lucide-react";

interface VisualTheme {
  id: string;
  name: string;
  description: string;
  preview: string;
  teamsOnly: boolean;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
}

interface AnimationFeature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  performance: "low" | "medium" | "high";
  teamsExclusive: boolean;
}

const TeamsVisualUpgrades: React.FC = () => {
  const [activeTheme, setActiveTheme] = useState("guardianchain-pro");
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [performanceMode, setPerformanceMode] = useState<"standard" | "enhanced" | "maximum">("enhanced");

  const visualThemes: VisualTheme[] = [
    {
      id: "guardianchain-pro",
      name: "GUARDIANCHAIN Pro",
      description: "Enhanced enterprise theme with advanced gradients and effects",
      preview: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)",
      teamsOnly: true,
      colors: {
        primary: "#6366f1",
        secondary: "#8b5cf6",
        accent: "#06b6d4",
        background: "#0f172a",
      },
    },
    {
      id: "sovereign-elite",
      name: "Sovereign Elite",
      description: "Premium dark theme with golden accents for high-tier users",
      preview: "linear-gradient(135deg, #1e293b 0%, #334155 50%, #f59e0b 100%)",
      teamsOnly: true,
      colors: {
        primary: "#f59e0b",
        secondary: "#1e293b",
        accent: "#10b981",
        background: "#020617",
      },
    },
    {
      id: "blockchain-matrix",
      name: "Blockchain Matrix",
      description: "Futuristic theme with animated blockchain elements",
      preview: "linear-gradient(135deg, #065f46 0%, #047857 50%, #059669 100%)",
      teamsOnly: true,
      colors: {
        primary: "#059669",
        secondary: "#065f46",
        accent: "#34d399",
        background: "#064e3b",
      },
    },
    {
      id: "truth-oracle",
      name: "Truth Oracle",
      description: "Mystical theme with oracle-inspired color palette",
      preview: "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%)",
      teamsOnly: false,
      colors: {
        primary: "#7c3aed",
        secondary: "#a855f7",
        accent: "#c084fc",
        background: "#1e1b4b",
      },
    },
  ];

  const animationFeatures: AnimationFeature[] = [
    {
      id: "particle-bg",
      name: "Particle Background",
      description: "Animated particle system for immersive experience",
      enabled: true,
      performance: "medium",
      teamsExclusive: true,
    },
    {
      id: "blockchain-viz",
      name: "Live Blockchain Visualization",
      description: "Real-time blockchain data visualization effects",
      enabled: true,
      performance: "high",
      teamsExclusive: true,
    },
    {
      id: "smooth-transitions",
      name: "Enhanced Transitions",
      description: "Smooth page transitions with advanced easing",
      enabled: true,
      performance: "low",
      teamsExclusive: false,
    },
    {
      id: "gtt-pulse",
      name: "GTT Token Pulse",
      description: "Animated GTT token effects and price indicators",
      enabled: true,
      performance: "low",
      teamsExclusive: false,
    },
    {
      id: "neural-network",
      name: "Neural Network Animation",
      description: "AI-inspired network connections for advanced features",
      enabled: false,
      performance: "high",
      teamsExclusive: true,
    },
    {
      id: "holographic-ui",
      name: "Holographic UI Elements",
      description: "3D holographic effects for premium interactions",
      enabled: false,
      performance: "high",
      teamsExclusive: true,
    },
  ];

  const applyTheme = (themeId: string) => {
    const theme = visualThemes.find(t => t.id === themeId);
    if (!theme) return;

    setActiveTheme(themeId);
    
    // Apply CSS custom properties
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.colors.primary);
    root.style.setProperty('--secondary-color', theme.colors.secondary);
    root.style.setProperty('--accent-color', theme.colors.accent);
    root.style.setProperty('--background-color', theme.colors.background);

    console.log(`Applied theme: ${theme.name}`);
  };

  const toggleAnimation = (animationId: string) => {
    const updatedFeatures = animationFeatures.map(feature => 
      feature.id === animationId 
        ? { ...feature, enabled: !feature.enabled }
        : feature
    );
    console.log(`Toggled animation: ${animationId}`);
  };

  const setPerformanceLevel = (level: "standard" | "enhanced" | "maximum") => {
    setPerformanceMode(level);
    console.log(`Performance mode set to: ${level}`);
  };

  const getPerformanceColor = (performance: AnimationFeature["performance"]) => {
    switch (performance) {
      case "low":
        return "text-green-400";
      case "medium":
        return "text-yellow-400";
      case "high":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Visual Enhancement Header */}
      <Card className="bg-gradient-to-br from-purple-900 to-slate-900 border-purple-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center">
              <Sparkles className="w-6 h-6 mr-2 text-purple-400" />
              Teams Visual Enhancement Suite
            </div>
            <Badge className="bg-purple-600 text-white">
              Premium Unlocked
            </Badge>
          </CardTitle>
          <p className="text-purple-100">
            Unlock advanced visual features and premium themes with your Teams subscription
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <Palette className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <h3 className="text-white font-medium">Premium Themes</h3>
              <p className="text-purple-200 text-sm">Exclusive visual themes</p>
            </div>
            <div className="text-center">
              <Zap className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <h3 className="text-white font-medium">Advanced Animations</h3>
              <p className="text-purple-200 text-sm">Smooth, professional effects</p>
            </div>
            <div className="text-center">
              <Crown className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <h3 className="text-white font-medium">Elite Features</h3>
              <p className="text-purple-200 text-sm">Teams-exclusive enhancements</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visual Controls Tabs */}
      <Tabs defaultValue="themes" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800">
          <TabsTrigger value="themes" className="text-white">
            Themes
          </TabsTrigger>
          <TabsTrigger value="animations" className="text-white">
            Animations
          </TabsTrigger>
          <TabsTrigger value="performance" className="text-white">
            Performance
          </TabsTrigger>
          <TabsTrigger value="preview" className="text-white">
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="themes" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visualThemes.map((theme) => (
              <Card 
                key={theme.id} 
                className={`bg-slate-800/50 border-slate-700 cursor-pointer transition-all hover:border-purple-500 ${
                  activeTheme === theme.id ? 'ring-2 ring-purple-500' : ''
                }`}
                onClick={() => applyTheme(theme.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-medium flex items-center">
                      {theme.name}
                      {theme.teamsOnly && (
                        <Crown className="w-4 h-4 ml-2 text-yellow-400" />
                      )}
                    </h3>
                    {activeTheme === theme.id && (
                      <Badge className="bg-purple-600 text-white">Active</Badge>
                    )}
                  </div>
                  
                  <div 
                    className="w-full h-20 rounded-lg mb-3"
                    style={{ background: theme.preview }}
                  />
                  
                  <p className="text-sm text-slate-400 mb-3">
                    {theme.description}
                  </p>
                  
                  <div className="flex space-x-2">
                    {Object.entries(theme.colors).map(([key, color]) => (
                      <div
                        key={key}
                        className="w-6 h-6 rounded-full border border-slate-600"
                        style={{ backgroundColor: color }}
                        title={key}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="animations" className="space-y-4">
          <div className="grid gap-4">
            {animationFeatures.map((feature) => (
              <Card key={feature.id} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        feature.enabled 
                          ? "bg-purple-600/20 text-purple-400" 
                          : "bg-gray-600/20 text-gray-400"
                      }`}>
                        <Layers className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium flex items-center">
                          {feature.name}
                          {feature.teamsExclusive && (
                            <Crown className="w-4 h-4 ml-2 text-yellow-400" />
                          )}
                        </h3>
                        <p className="text-sm text-slate-400">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge
                        className={`${getPerformanceColor(feature.performance)} bg-transparent border`}
                      >
                        {feature.performance.toUpperCase()} IMPACT
                      </Badge>
                      <Switch
                        checked={feature.enabled}
                        onCheckedChange={() => toggleAnimation(feature.id)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Settings className="w-5 h-5 mr-2 text-blue-400" />
                Performance Optimization
              </CardTitle>
              <p className="text-slate-400">
                Optimize visual performance based on your Teams resources
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant={performanceMode === "standard" ? "default" : "outline"}
                  onClick={() => setPerformanceLevel("standard")}
                  className="h-auto p-4 flex flex-col items-start"
                >
                  <Monitor className="w-6 h-6 mb-2" />
                  <div className="text-left">
                    <div className="font-medium">Standard</div>
                    <div className="text-sm opacity-75">Basic animations</div>
                  </div>
                </Button>
                
                <Button
                  variant={performanceMode === "enhanced" ? "default" : "outline"}
                  onClick={() => setPerformanceLevel("enhanced")}
                  className="h-auto p-4 flex flex-col items-start"
                >
                  <Zap className="w-6 h-6 mb-2" />
                  <div className="text-left">
                    <div className="font-medium">Enhanced</div>
                    <div className="text-sm opacity-75">Teams optimized</div>
                  </div>
                </Button>
                
                <Button
                  variant={performanceMode === "maximum" ? "default" : "outline"}
                  onClick={() => setPerformanceLevel("maximum")}
                  className="h-auto p-4 flex flex-col items-start"
                >
                  <Crown className="w-6 h-6 mb-2" />
                  <div className="text-left">
                    <div className="font-medium">Maximum</div>
                    <div className="text-sm opacity-75">All features enabled</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Eye className="w-5 h-5 mr-2 text-green-400" />
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-white font-medium flex items-center">
                    <Smartphone className="w-5 h-5 mr-2" />
                    Mobile Preview
                  </h3>
                  <div className="bg-slate-900 rounded-lg p-4 h-64 flex items-center justify-center border">
                    <div className="text-slate-400">
                      Mobile interface preview would appear here
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-white font-medium flex items-center">
                    <Monitor className="w-5 h-5 mr-2" />
                    Desktop Preview
                  </h3>
                  <div className="bg-slate-900 rounded-lg p-4 h-64 flex items-center justify-center border">
                    <div className="text-slate-400">
                      Desktop interface preview would appear here
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamsVisualUpgrades;