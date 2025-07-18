import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, Star, TrendingUp, Eye, Award, 
  Sparkles, Crown, Diamond, Shield 
} from 'lucide-react';
import { BRAND_COLORS } from '@/lib/constants';

interface EvolutionLevel {
  level: number;
  name: string;
  description: string;
  requirements: {
    xp: number;
    capsules: number;
    reputation: number;
  };
  visualEffects: {
    border: string;
    glow: string;
    animation: string;
  };
  traits: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

interface NFTEvolutionData {
  tokenId: number;
  contractAddress: string;
  currentLevel: number;
  currentXP: number;
  traits: Array<{
    trait_type: string;
    value: string | number;
    rarity: number;
  }>;
  visualMetadata: {
    imageUrl: string;
    animationUrl?: string;
    backgroundColor: string;
    effects: string[];
  };
  evolutionHistory: Array<{
    level: number;
    evolvedAt: string;
    trigger: string;
  }>;
}

interface EvolutionNFTProps {
  nftData: NFTEvolutionData;
  userStats: {
    totalXP: number;
    totalCapsules: number;
    reputation: number;
    recentActivity: number;
  };
  onEvolve?: () => void;
}

const EVOLUTION_LEVELS: EvolutionLevel[] = [
  {
    level: 1,
    name: "Truth Seeker",
    description: "Beginning your journey in the GUARDIANCHAIN ecosystem",
    requirements: { xp: 0, capsules: 0, reputation: 0 },
    visualEffects: {
      border: "border-slate-500",
      glow: "shadow-slate-500/20",
      animation: ""
    },
    traits: [
      { trait_type: "Rarity", value: "Common" },
      { trait_type: "Power Level", value: 1 }
    ]
  },
  {
    level: 2,
    name: "Guardian Initiate",
    description: "Proven dedication to truth verification",
    requirements: { xp: 1000, capsules: 5, reputation: 100 },
    visualEffects: {
      border: "border-blue-400",
      glow: "shadow-blue-400/30",
      animation: "animate-pulse-slow"
    },
    traits: [
      { trait_type: "Rarity", value: "Uncommon" },
      { trait_type: "Power Level", value: 2 },
      { trait_type: "Verification Boost", value: "10%" }
    ]
  },
  {
    level: 3,
    name: "Truth Validator",
    description: "Recognized for consistent accuracy and engagement",
    requirements: { xp: 5000, capsules: 25, reputation: 500 },
    visualEffects: {
      border: "border-purple-400",
      glow: "shadow-purple-400/40",
      animation: "animate-glow"
    },
    traits: [
      { trait_type: "Rarity", value: "Rare" },
      { trait_type: "Power Level", value: 5 },
      { trait_type: "Verification Boost", value: "25%" },
      { trait_type: "GTT Bonus", value: "15%" }
    ]
  },
  {
    level: 4,
    name: "Chain Guardian",
    description: "Elite protector of truth with significant influence",
    requirements: { xp: 15000, capsules: 100, reputation: 2000 },
    visualEffects: {
      border: "border-yellow-400",
      glow: "shadow-yellow-400/50",
      animation: "animate-shimmer"
    },
    traits: [
      { trait_type: "Rarity", value: "Epic" },
      { trait_type: "Power Level", value: 10 },
      { trait_type: "Verification Boost", value: "50%" },
      { trait_type: "GTT Bonus", value: "30%" },
      { trait_type: "Governance Weight", value: "2x" }
    ]
  },
  {
    level: 5,
    name: "Truth Sovereign",
    description: "Legendary status with maximum ecosystem benefits",
    requirements: { xp: 50000, capsules: 500, reputation: 10000 },
    visualEffects: {
      border: "border-rainbow",
      glow: "shadow-rainbow/60",
      animation: "animate-legendary"
    },
    traits: [
      { trait_type: "Rarity", value: "Legendary" },
      { trait_type: "Power Level", value: 25 },
      { trait_type: "Verification Boost", value: "100%" },
      { trait_type: "GTT Bonus", value: "75%" },
      { trait_type: "Governance Weight", value: "5x" },
      { trait_type: "Special Abilities", value: "Truth Oracle" }
    ]
  }
];

export default function EvolutionNFT({ nftData, userStats, onEvolve }: EvolutionNFTProps) {
  const [canEvolve, setCanEvolve] = useState(false);
  const [nextLevel, setNextLevel] = useState<EvolutionLevel | null>(null);

  const currentEvolution = EVOLUTION_LEVELS[nftData.currentLevel - 1];
  const nextEvolution = EVOLUTION_LEVELS[nftData.currentLevel];

  useEffect(() => {
    if (nextEvolution) {
      const meetsRequirements = 
        userStats.totalXP >= nextEvolution.requirements.xp &&
        userStats.totalCapsules >= nextEvolution.requirements.capsules &&
        userStats.reputation >= nextEvolution.requirements.reputation;
      
      setCanEvolve(meetsRequirements);
      setNextLevel(nextEvolution);
    }
  }, [userStats, nextEvolution]);

  const getProgressToNextLevel = () => {
    if (!nextEvolution) return 100;
    
    const xpProgress = (userStats.totalXP / nextEvolution.requirements.xp) * 100;
    const capsuleProgress = (userStats.totalCapsules / nextEvolution.requirements.capsules) * 100;
    const repProgress = (userStats.reputation / nextEvolution.requirements.reputation) * 100;
    
    return Math.min(xpProgress, capsuleProgress, repProgress);
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'legendary': return <Crown className="w-4 h-4 text-yellow-400" />;
      case 'epic': return <Diamond className="w-4 h-4 text-purple-400" />;
      case 'rare': return <Star className="w-4 h-4 text-blue-400" />;
      case 'uncommon': return <Shield className="w-4 h-4 text-green-400" />;
      default: return <Eye className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Main NFT Display */}
      <Card className={`bg-slate-800/50 border-2 ${currentEvolution.visualEffects.border} ${currentEvolution.visualEffects.glow}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg" style={{ backgroundColor: `${BRAND_COLORS.GUARDIAN}20` }}>
              <Sparkles className="h-5 w-5" style={{ color: BRAND_COLORS.GUARDIAN }} />
            </div>
            <div>
              <span className="text-white">Evolution NFT #{nftData.tokenId}</span>
              <div className="text-sm text-slate-400">Level {nftData.currentLevel} • {currentEvolution.name}</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* NFT Visual */}
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/3">
              <div className={`relative rounded-lg overflow-hidden ${currentEvolution.visualEffects.animation}`}>
                <img
                  src={nftData.visualMetadata.imageUrl}
                  alt={`Evolution NFT Level ${nftData.currentLevel}`}
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-black/50 text-white border-0">
                    Level {nftData.currentLevel}
                  </Badge>
                </div>
                
                {/* Visual Effects Overlay */}
                {nftData.visualMetadata.effects.map((effect, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 ${effect} opacity-30 mix-blend-overlay`}
                  />
                ))}
              </div>
            </div>

            <div className="lg:w-2/3 space-y-4">
              {/* Current Level Info */}
              <div>
                <h3 className="text-white text-xl font-bold mb-2">{currentEvolution.name}</h3>
                <p className="text-slate-300 mb-4">{currentEvolution.description}</p>
                
                {/* Traits */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {nftData.traits.map((trait, index) => (
                    <div key={index} className="bg-slate-700/30 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        {getRarityIcon(trait.trait_type)}
                        <span className="text-slate-400 text-xs">{trait.trait_type}</span>
                      </div>
                      <div className="text-white font-semibold">{trait.value}</div>
                      {trait.rarity && (
                        <div className="text-xs text-slate-500">{(trait.rarity * 100).toFixed(1)}% rare</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Evolution Progress */}
          {nextLevel && (
            <div className="bg-slate-700/20 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-semibold">Evolution Progress</h4>
                <Badge className={canEvolve ? "bg-green-600" : "bg-yellow-600"}>
                  {canEvolve ? "Ready to Evolve!" : "In Progress"}
                </Badge>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Next: {nextLevel.name}</span>
                    <span className="text-white">{getProgressToNextLevel().toFixed(1)}%</span>
                  </div>
                  <Progress value={getProgressToNextLevel()} className="h-2" />
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-slate-400">XP Required</div>
                    <div className="text-white">
                      {userStats.totalXP.toLocaleString()} / {nextLevel.requirements.xp.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400">Capsules</div>
                    <div className="text-white">
                      {userStats.totalCapsules} / {nextLevel.requirements.capsules}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400">Reputation</div>
                    <div className="text-white">
                      {userStats.reputation} / {nextLevel.requirements.reputation}
                    </div>
                  </div>
                </div>

                {canEvolve && onEvolve && (
                  <Button
                    onClick={onEvolve}
                    className="w-full bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700 text-white font-semibold"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Evolve to {nextLevel.name}
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Evolution History */}
          {nftData.evolutionHistory.length > 0 && (
            <div className="bg-slate-700/20 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-3">Evolution History</h4>
              <div className="space-y-2">
                {nftData.evolutionHistory.map((evolution, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-slate-600 last:border-0">
                    <div>
                      <span className="text-white">Level {evolution.level}</span>
                      <span className="text-slate-400 text-sm ml-2">• {evolution.trigger}</span>
                    </div>
                    <span className="text-slate-500 text-xs">
                      {new Date(evolution.evolvedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Benefits Overview */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-400" />
            <span className="text-white">Current Benefits</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentEvolution.traits.map((trait, index) => (
              <div key={index} className="bg-slate-700/30 rounded-lg p-3 text-center">
                <div className="text-white font-semibold">{trait.trait_type}</div>
                <div className="text-green-400 text-lg font-bold">{trait.value}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}