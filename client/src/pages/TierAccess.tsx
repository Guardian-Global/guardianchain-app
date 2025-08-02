import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Crown, 
  Shield, 
  Star, 
  Zap,
  Lock,
  Unlock,
  CheckCircle,
  ArrowRight,
  Coins,
  Users,
  Brain,
  Globe
} from "lucide-react";
import { Link } from "wouter";

interface TierBenefit {
  name: string;
  description: string;
  icon: any;
  available: boolean;
}

interface AccessTier {
  id: string;
  name: string;
  level: number;
  price: string;
  description: string;
  icon: any;
  color: string;
  benefits: TierBenefit[];
  limits: {
    capsulesPerMonth: number;
    verificationsPerDay: number;
    aiInsights: number;
    storageGB: number;
  };
}

export default function TierAccess() {
  const { user } = useAuth();
  const [selectedTier, setSelectedTier] = useState<string>('explorer');

  const tiers: AccessTier[] = [
    {
      id: 'explorer',
      name: 'Explorer',
      level: 1,
      price: 'Free',
      description: 'Perfect for getting started with truth verification',
      icon: Globe,
      color: 'text-blue-400',
      benefits: [
        { name: 'Basic Truth Capsules', description: 'Create standard verification capsules', icon: Shield, available: true },
        { name: 'Community Verification', description: 'Peer-reviewed by guardian network', icon: Users, available: true },
        { name: 'Basic GTT Rewards', description: 'Earn tokens for verified content', icon: Coins, available: true },
        { name: 'Mobile Access', description: 'Full mobile app functionality', icon: CheckCircle, available: true },
        { name: 'AI Insights', description: 'Limited AI-powered recommendations', icon: Brain, available: false },
        { name: 'Veritas Sealed', description: 'Premium verification tier', icon: Star, available: false }
      ],
      limits: {
        capsulesPerMonth: 5,
        verificationsPerDay: 10,
        aiInsights: 3,
        storageGB: 1
      }
    },
    {
      id: 'seeker',
      name: 'Seeker',
      level: 2,
      price: '$9.99/month',
      description: 'Enhanced features for regular truth seekers',
      icon: Star,
      color: 'text-green-400',
      benefits: [
        { name: 'Enhanced Truth Capsules', description: 'Advanced verification features', icon: Shield, available: true },
        { name: 'Priority Verification', description: 'Faster community review process', icon: Users, available: true },
        { name: '1.5x GTT Rewards', description: 'Bonus multiplier on all earnings', icon: Coins, available: true },
        { name: 'AI Insights Pro', description: 'Advanced AI recommendations', icon: Brain, available: true },
        { name: 'Custom Categories', description: 'Create specialized capsule types', icon: CheckCircle, available: true },
        { name: 'Veritas Sealed', description: 'Access to premium verification', icon: Star, available: false }
      ],
      limits: {
        capsulesPerMonth: 25,
        verificationsPerDay: 50,
        aiInsights: 15,
        storageGB: 5
      }
    },
    {
      id: 'creator',
      name: 'Creator',
      level: 3,
      price: '$29.99/month',
      description: 'Professional tools for content creators',
      icon: Zap,
      color: 'text-purple-400',
      benefits: [
        { name: 'Professional Capsules', description: 'Full feature access', icon: Shield, available: true },
        { name: 'Expert Validation', description: 'Professional validator review', icon: Users, available: true },
        { name: '2x GTT Rewards', description: 'Double earnings on all content', icon: Coins, available: true },
        { name: 'AI Insights Elite', description: 'Unlimited AI recommendations', icon: Brain, available: true },
        { name: 'Analytics Dashboard', description: 'Detailed performance metrics', icon: CheckCircle, available: true },
        { name: 'Veritas Sealed', description: 'Ultimate truth verification', icon: Star, available: true }
      ],
      limits: {
        capsulesPerMonth: 100,
        verificationsPerDay: 200,
        aiInsights: 50,
        storageGB: 25
      }
    },
    {
      id: 'sovereign',
      name: 'Sovereign',
      level: 4,
      price: '$99.99/month',
      description: 'Enterprise-grade truth infrastructure',
      icon: Crown,
      color: 'text-yellow-400',
      benefits: [
        { name: 'Unlimited Capsules', description: 'No restrictions on creation', icon: Shield, available: true },
        { name: 'Instant Verification', description: 'Priority processing guarantee', icon: Users, available: true },
        { name: '3x GTT Rewards', description: 'Maximum earning potential', icon: Coins, available: true },
        { name: 'AI Co-Pilot', description: 'Personal AI assistant', icon: Brain, available: true },
        { name: 'White-label Access', description: 'Custom branding options', icon: CheckCircle, available: true },
        { name: 'Veritas Sealed+', description: 'Institutional verification', icon: Star, available: true }
      ],
      limits: {
        capsulesPerMonth: -1, // Unlimited
        verificationsPerDay: -1, // Unlimited
        aiInsights: -1, // Unlimited
        storageGB: 100
      }
    }
  ];

  const currentTier = tiers.find(t => t.id === ((user as any)?.tier?.toLowerCase() || 'explorer')) || tiers[0];
  const selectedTierData = tiers.find(t => t.id === selectedTier) || currentTier;

  const getTierProgress = () => {
    const currentLevel = currentTier.level;
    const maxLevel = Math.max(...tiers.map(t => t.level));
    return (currentLevel / maxLevel) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-16">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
            Tiered Access System
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Unlock advanced features and higher GTT rewards as you progress through our verification tiers
          </p>
        </div>

        {/* Current Tier Status */}
        {user && (
          <div className="max-w-2xl mx-auto mb-12">
            <Card className="bg-gradient-to-r from-slate-800/50 to-blue-900/20 border-slate-700/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-700/50 rounded-lg">
                      <currentTier.icon className={`h-6 w-6 ${currentTier.color}`} />
                    </div>
                    <div>
                      <CardTitle>Current Tier: {currentTier.name}</CardTitle>
                      <CardDescription>Level {currentTier.level} Guardian</CardDescription>
                    </div>
                  </div>
                  <Badge className={`bg-${currentTier.color.split('-')[1]}-600/20 ${currentTier.color} border-${currentTier.color.split('-')[1]}-500/30`}>
                    Active
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-400">Tier Progress</span>
                      <span className="text-sm text-gray-400">{currentTier.level}/4</span>
                    </div>
                    <Progress value={getTierProgress()} className="h-2" />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Monthly Capsules:</span>
                      <span className="ml-2 text-white">
                        {currentTier.limits.capsulesPerMonth === -1 ? 'Unlimited' : currentTier.limits.capsulesPerMonth}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Daily Verifications:</span>
                      <span className="ml-2 text-white">
                        {currentTier.limits.verificationsPerDay === -1 ? 'Unlimited' : currentTier.limits.verificationsPerDay}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">AI Insights:</span>
                      <span className="ml-2 text-white">
                        {currentTier.limits.aiInsights === -1 ? 'Unlimited' : `${currentTier.limits.aiInsights}/month`}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Storage:</span>
                      <span className="ml-2 text-white">{currentTier.limits.storageGB}GB</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tier Selection */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {tiers.map((tier) => {
            const Icon = tier.icon;
            const isSelected = selectedTier === tier.id;
            const isCurrent = currentTier.id === tier.id;
            
            return (
              <Card 
                key={tier.id}
                className={`cursor-pointer transition-all duration-300 ${
                  isSelected 
                    ? 'bg-gradient-to-br from-slate-700/50 to-blue-900/30 border-blue-500/50 scale-105' 
                    : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600/50'
                } ${isCurrent ? 'ring-2 ring-green-500/30' : ''}`}
                onClick={() => setSelectedTier(tier.id)}
              >
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-2">
                    <div className={`p-3 bg-slate-700/50 rounded-lg ${isCurrent ? 'ring-2 ring-green-500/30' : ''}`}>
                      <Icon className={`h-8 w-8 ${tier.color}`} />
                    </div>
                  </div>
                  
                  <CardTitle className="flex items-center justify-center gap-2">
                    {tier.name}
                    {isCurrent && <Badge className="bg-green-600/20 text-green-400 border-green-500/30 text-xs">Current</Badge>}
                  </CardTitle>
                  
                  <div className="text-2xl font-bold text-white mb-2">{tier.price}</div>
                  <CardDescription className="text-sm">{tier.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* Selected Tier Details */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <selectedTierData.icon className={`h-8 w-8 ${selectedTierData.color}`} />
                <div>
                  <CardTitle className="text-2xl">{selectedTierData.name} Tier Benefits</CardTitle>
                  <CardDescription>Complete feature breakdown and access levels</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {selectedTierData.benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  
                  return (
                    <div key={index} className={`flex items-start gap-3 p-3 rounded-lg ${
                      benefit.available 
                        ? 'bg-green-600/10 border border-green-500/20' 
                        : 'bg-gray-600/10 border border-gray-500/20'
                    }`}>
                      <div className={`p-2 rounded-lg ${
                        benefit.available ? 'bg-green-600/20' : 'bg-gray-600/20'
                      }`}>
                        {benefit.available ? (
                          <Unlock className="h-4 w-4 text-green-400" />
                        ) : (
                          <Lock className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className={`font-medium mb-1 ${
                          benefit.available ? 'text-white' : 'text-gray-400'
                        }`}>
                          {benefit.name}
                        </h4>
                        <p className="text-sm text-gray-400">{benefit.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {selectedTierData.id !== currentTier.id && (
                <div className="mt-8 text-center">
                  <Button 
                    asChild 
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Link href="/pricing">
                      {selectedTierData.level > currentTier.level ? 'Upgrade' : 'Change'} to {selectedTierData.name}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Upgrade Benefits */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Unlock More Features?</h3>
              <p className="text-gray-300 mb-6">
                Higher tiers unlock increased GTT rewards, advanced AI features, and premium verification options.
              </p>
              
              <div className="flex gap-4 justify-center">
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/pricing">
                    <Crown className="h-4 w-4 mr-2" />
                    View Pricing
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-purple-500/30 text-purple-400 hover:bg-purple-600/20">
                  <Link href="/dashboard">
                    <Shield className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}