import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Crown,
  Shield,
  Sparkles,
  Zap,
  CheckCircle,
  ArrowRight,
  Star,
  Gift,
} from "lucide-react";

// Import the new Teams components
import TeamsEnhancedSecurity from "@/components/teams/TeamsEnhancedSecurity";
import TeamsVisualUpgrades from "@/components/teams/TeamsVisualUpgrades";
import TeamsAdvancedAuth from "@/components/teams/TeamsAdvancedAuth";
import TeamsEnhancedTiers from "@/components/teams/TeamsEnhancedTiers";

const TeamsUpgrades: React.FC = () => {
  const [upgradesApplied, setUpgradeApplied] = useState(0);
  const [totalUpgrades] = useState(4);

  const upgradeCategories = [
    {
      id: "security",
      name: "Enhanced Security",
      description: "Enterprise-grade security monitoring and threat protection",
      icon: Shield,
      color: "text-green-400",
      gradient: "from-green-500 to-emerald-500",
      features: [
        "Real-time threat detection",
        "Advanced audit logging",
        "Private deployment security",
        "24/7 security monitoring",
      ],
    },
    {
      id: "visual",
      name: "Visual Enhancements",
      description: "Premium themes and advanced animation systems",
      icon: Sparkles,
      color: "text-purple-400",
      gradient: "from-purple-500 to-pink-500",
      features: [
        "Teams-exclusive themes",
        "Advanced animations",
        "Performance optimization",
        "Custom branding options",
      ],
    },
    {
      id: "auth",
      name: "Advanced Authentication",
      description: "Multi-provider enterprise authentication with SSO",
      icon: Shield,
      color: "text-blue-400",
      gradient: "from-blue-500 to-cyan-500",
      features: [
        "SAML SSO integration",
        "Enhanced biometric auth",
        "Device trust management",
        "AI anomaly detection",
      ],
    },
    {
      id: "tiers",
      name: "Enhanced Tier System",
      description: "Advanced tier management with Teams multipliers",
      icon: Crown,
      color: "text-yellow-400",
      gradient: "from-yellow-500 to-orange-500",
      features: [
        "Teams value multipliers",
        "Enhanced tier benefits",
        "Advanced analytics",
        "Premium support tiers",
      ],
    },
  ];

  const applyAllUpgrades = async () => {
    console.log("Applying all Teams upgrades...");
    // Simulate upgrade process
    for (let i = 0; i <= totalUpgrades; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUpgradeApplied(i);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Crown className="w-12 h-12 text-yellow-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              GUARDIANCHAIN Teams Upgrades
            </h1>
          </div>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Unlock the full potential of your GUARDIANCHAIN platform with Teams-exclusive enhancements, 
            premium features, and enterprise-grade capabilities
          </p>
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2">
            <CheckCircle className="w-4 h-4 mr-2" />
            Teams Transfer Complete - Upgrades Available
          </Badge>
        </div>

        {/* Upgrade Overview */}
        <Card className="bg-gradient-to-br from-indigo-900 to-purple-900 border-indigo-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <div className="flex items-center">
                <Zap className="w-6 h-6 mr-2 text-yellow-400" />
                Teams Enhancement Suite
              </div>
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                Premium Active
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {upgradeCategories.map((category) => (
                <div key={category.id} className="text-center">
                  <div className={`p-3 rounded-full bg-gradient-to-r ${category.gradient} inline-block mb-3`}>
                    <category.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{category.name}</h3>
                  <p className="text-slate-300 text-sm mb-3">{category.description}</p>
                  <div className="space-y-1">
                    {category.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-xs text-slate-400">
                        <Star className="w-3 h-3 mr-1 text-yellow-400" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <Button
                onClick={applyAllUpgrades}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg"
                disabled={upgradesApplied === totalUpgrades}
              >
                {upgradesApplied === totalUpgrades ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    All Upgrades Applied
                  </>
                ) : (
                  <>
                    <Gift className="w-5 h-5 mr-2" />
                    Apply All Teams Upgrades
                  </>
                )}
              </Button>
              {upgradesApplied > 0 && upgradesApplied < totalUpgrades && (
                <div className="mt-4">
                  <div className="text-sm text-slate-400 mb-2">
                    Applying upgrades... {upgradesApplied}/{totalUpgrades}
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(upgradesApplied / totalUpgrades) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upgrade Tabs */}
        <Tabs defaultValue="security" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800 p-1">
            <TabsTrigger 
              value="security" 
              className="text-white data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger 
              value="visual" 
              className="text-white data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Visual
            </TabsTrigger>
            <TabsTrigger 
              value="auth" 
              className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <Shield className="w-4 h-4 mr-2" />
              Auth
            </TabsTrigger>
            <TabsTrigger 
              value="tiers" 
              className="text-white data-[state=active]:bg-yellow-600 data-[state=active]:text-white"
            >
              <Crown className="w-4 h-4 mr-2" />
              Tiers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="security" className="space-y-6">
            <TeamsEnhancedSecurity />
          </TabsContent>

          <TabsContent value="visual" className="space-y-6">
            <TeamsVisualUpgrades />
          </TabsContent>

          <TabsContent value="auth" className="space-y-6">
            <TeamsAdvancedAuth />
          </TabsContent>

          <TabsContent value="tiers" className="space-y-6">
            <TeamsEnhancedTiers />
          </TabsContent>
        </Tabs>

        {/* Success Message */}
        {upgradesApplied === totalUpgrades && (
          <Card className="bg-gradient-to-br from-green-900 to-emerald-900 border-green-700">
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">
                Teams Upgrades Successfully Applied!
              </h2>
              <p className="text-green-200 mb-4">
                Your GUARDIANCHAIN platform is now running with maximum Teams capabilities
              </p>
              <div className="flex items-center justify-center space-x-4">
                <Badge className="bg-green-600 text-white">
                  Security Enhanced
                </Badge>
                <Badge className="bg-purple-600 text-white">
                  Visual Upgraded
                </Badge>
                <Badge className="bg-blue-600 text-white">
                  Auth Advanced
                </Badge>
                <Badge className="bg-yellow-600 text-white">
                  Tiers Optimized
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TeamsUpgrades;