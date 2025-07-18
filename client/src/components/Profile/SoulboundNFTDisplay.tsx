import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, Flame, Brain, Scroll, Shield, 
  Star, Crown, Diamond, Target, Award 
} from 'lucide-react';
import { BRAND_COLORS } from '@/lib/constants';
import { useQuery } from '@tanstack/react-query';
import { fetchUserAchievements } from '@/lib/api';

interface SoulboundAchievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: string;
  metadata?: {
    level?: number;
    progress?: number;
    benefits?: string[];
  };
}

interface SoulboundNFTDisplayProps {
  address?: string;
  achievements?: SoulboundAchievement[];
}

export default function SoulboundNFTDisplay({ address }: SoulboundNFTDisplayProps) {
  const { data: achievements, isLoading, error } = useQuery({
    queryKey: ['user-achievements', address],
    queryFn: () => address ? fetchUserAchievements(address) : Promise.resolve([]),
    enabled: !!address,
  });

  const defaultAchievements: SoulboundAchievement[] = [
  {
    id: "truth-pioneer",
    title: "Truth Pioneer",
    description: "First 100 users to seal a Veritas Capsule",
    icon: Flame,
    rarity: "legendary",
    unlockedAt: "2024-07-15",
    metadata: {
      level: 1,
      benefits: ["10% GTT Bonus", "Priority Verification", "Pioneer Badge"]
    }
  },
  {
    id: "dao-voter",
    title: "Top 10 DAO Voter",
    description: "Ranked in top 10 for governance participation",
    icon: Brain,
    rarity: "epic",
    unlockedAt: "2024-07-20",
    metadata: {
      level: 3,
      benefits: ["2x Voting Weight", "Proposal Priority", "Governance Badge"]
    }
  },
  {
    id: "veritas-certified",
    title: "Veritas Certified Author",
    description: "Published 5+ verified truth capsules",
    icon: Scroll,
    rarity: "rare",
    unlockedAt: "2024-07-18",
    metadata: {
      level: 2,
      progress: 100,
      benefits: ["Author Verification", "Content Priority", "Creator Tools"]
    }
  },
  {
    id: "guardian-defender",
    title: "Guardian Defender",
    description: "Prevented fraud through verification",
    icon: Shield,
    rarity: "epic",
    unlockedAt: "2024-07-22",
    metadata: {
      level: 1,
      benefits: ["Fraud Detection Bonus", "Security Badge", "Community Recognition"]
    }
  }
];

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'legendary': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/50';
    case 'epic': return 'text-purple-400 bg-purple-400/20 border-purple-400/50';
    case 'rare': return 'text-blue-400 bg-blue-400/20 border-blue-400/50';
    default: return 'text-gray-400 bg-gray-400/20 border-gray-400/50';
  }
};

const getRarityIcon = (rarity: string) => {
  switch (rarity) {
    case 'legendary': return <Crown className="w-4 h-4" />;
    case 'epic': return <Diamond className="w-4 h-4" />;
    case 'rare': return <Star className="w-4 h-4" />;
    default: return <Award className="w-4 h-4" />;
  }
};

  if (isLoading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="animate-pulse grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-32 bg-slate-700 rounded-xl"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayAchievements = achievements?.length ? achievements : defaultAchievements;
  const legendaryCount = displayAchievements.filter(a => a.rarity === 'legendary').length;
  const epicCount = displayAchievements.filter(a => a.rarity === 'epic').length;
  const totalValue = displayAchievements.length * 100; // Example calculation

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-lg" style={{ backgroundColor: `${BRAND_COLORS.GUARDIAN}20` }}>
            <Trophy className="h-5 w-5" style={{ color: BRAND_COLORS.GUARDIAN }} />
          </div>
          <div>
            <span className="text-white">Soulbound Achievements</span>
            <div className="text-sm text-slate-400">
              Connected: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not Connected'}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Achievement Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-slate-700/30 rounded-lg">
            <div className="text-lg font-bold text-white">{achievements.length}</div>
            <div className="text-xs text-slate-400">Total Earned</div>
          </div>
          <div className="text-center p-3 bg-slate-700/30 rounded-lg">
            <div className="text-lg font-bold text-yellow-400">{legendaryCount + epicCount}</div>
            <div className="text-xs text-slate-400">Rare+</div>
          </div>
          <div className="text-center p-3 bg-slate-700/30 rounded-lg">
            <div className="text-lg font-bold text-green-400">{totalValue}</div>
            <div className="text-xs text-slate-400">GTT Value</div>
          </div>
        </div>

        {/* Achievement Grid */}
        <div className="space-y-4">
          <h4 className="text-white font-semibold">Earned Achievements</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <Card key={achievement.id} className={`bg-slate-700/30 border ${getRarityColor(achievement.rarity)}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${getRarityColor(achievement.rarity)}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white font-semibold text-sm">{achievement.title}</h3>
                          <Badge className={`${getRarityColor(achievement.rarity)} text-xs`}>
                            {getRarityIcon(achievement.rarity)}
                            <span className="ml-1 capitalize">{achievement.rarity}</span>
                          </Badge>
                        </div>
                        <p className="text-slate-400 text-xs mb-2">{achievement.description}</p>
                        
                        {achievement.metadata?.benefits && (
                          <div className="space-y-1">
                            <div className="text-xs text-slate-500">Benefits:</div>
                            <div className="flex flex-wrap gap-1">
                              {achievement.metadata.benefits.slice(0, 2).map((benefit, idx) => (
                                <Badge key={idx} variant="outline" className="border-slate-600 text-slate-300 text-xs px-1 py-0">
                                  {benefit}
                                </Badge>
                              ))}
                              {achievement.metadata.benefits.length > 2 && (
                                <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs px-1 py-0">
                                  +{achievement.metadata.benefits.length - 2}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                        
                        <div className="text-xs text-slate-500 mt-2">
                          Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Upcoming Achievements */}
        <div className="bg-slate-700/20 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-3">In Progress</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-orange-400" />
                <span className="text-slate-300 text-sm">Truth Validator</span>
              </div>
              <Badge className="bg-orange-600/20 text-orange-400">7/10 capsules</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-yellow-400" />
                <span className="text-slate-300 text-sm">DAO Legendary</span>
              </div>
              <Badge className="bg-yellow-600/20 text-yellow-400">85/100 votes</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}