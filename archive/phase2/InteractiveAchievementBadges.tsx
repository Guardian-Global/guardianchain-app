import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Star, 
  Shield, 
  Crown, 
  Target, 
  Users, 
  Heart,
  Coins,
  Zap,
  Award
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  progress?: number;
  target?: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  points: number;
  earnedAt?: string;
}

const rarityColors = {
  common: 'bg-gray-500',
  uncommon: 'bg-green-500',
  rare: 'bg-blue-500',
  epic: 'bg-purple-500',
  legendary: 'bg-yellow-500'
};

const getIcon = (iconName: string) => {
  const icons: Record<string, React.ReactNode> = {
    trophy: <Trophy className="h-4 w-4" />,
    star: <Star className="h-4 w-4" />,
    shield: <Shield className="h-4 w-4" />,
    crown: <Crown className="h-4 w-4" />,
    target: <Target className="h-4 w-4" />,
    users: <Users className="h-4 w-4" />,
    heart: <Heart className="h-4 w-4" />,
    coins: <Coins className="h-4 w-4" />,
    zap: <Zap className="h-4 w-4" />,
    award: <Award className="h-4 w-4" />
  };
  return icons[iconName] || <Trophy className="h-4 w-4" />;
};

export function InteractiveAchievementBadges() {
  const [selectedBadge, setSelectedBadge] = useState<Achievement | null>(null);

  const achievements: Achievement[] = [
    {
      id: 'truth_seeker',
      title: 'Truth Seeker',
      description: 'Created your first capsule',
      icon: 'target',
      earned: true,
      earnedAt: '2025-01-15T10:30:00Z',
      rarity: 'common',
      points: 100
    },
    {
      id: 'community_builder',
      title: 'Community Builder',
      description: 'Invited 10 friends to the platform',
      icon: 'users',
      earned: true,
      earnedAt: '2025-01-22T14:15:00Z',
      rarity: 'uncommon',
      points: 250
    },
    {
      id: 'social_butterfly',
      title: 'Social Butterfly',
      description: 'Connected all social media accounts',
      icon: 'heart',
      earned: true,
      earnedAt: '2025-01-28T09:45:00Z',
      rarity: 'common',
      points: 150
    },
    {
      id: 'verification_master',
      title: 'Verification Master',
      description: 'Successfully verified 100 capsules',
      icon: 'shield',
      earned: false,
      progress: 28,
      target: 100,
      rarity: 'rare',
      points: 500
    },
    {
      id: 'gtt_collector',
      title: 'GTT Collector',
      description: 'Accumulated 50,000 GTT tokens',
      icon: 'coins',
      earned: false,
      progress: 12547,
      target: 50000,
      rarity: 'epic',
      points: 1000
    },
    {
      id: 'elite_guardian',
      title: 'Elite Guardian',
      description: 'Reached sovereign tier status',
      icon: 'crown',
      earned: false,
      progress: 0,
      target: 1,
      rarity: 'legendary',
      points: 2500
    }
  ];

  const earnedCount = achievements.filter(a => a.earned).length;
  const totalPoints = achievements.filter(a => a.earned).reduce((sum, a) => sum + a.points, 0);

  return (
    <Card className="bg-[#161b22] border-[#30363d]">
      <CardHeader>
        <CardTitle className="text-[#f0f6fc] flex items-center">
          <Trophy className="h-5 w-5 mr-2 text-[#00ffe1]" />
          Achievement Badges
        </CardTitle>
        <div className="flex items-center gap-4 text-sm text-[#8b949e]">
          <span>{earnedCount}/{achievements.length} Earned</span>
          <span>{totalPoints} Points</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-6">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`relative p-3 rounded-lg cursor-pointer transition-all hover:scale-105 ${
                achievement.earned 
                  ? 'bg-gradient-to-br from-[#00ffe1]/20 to-[#ff00d4]/20 border border-[#00ffe1]/30' 
                  : 'bg-[#21262d] border border-[#30363d] opacity-60'
              }`}
              onClick={() => setSelectedBadge(achievement)}
              data-testid={`badge-${achievement.id}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                achievement.earned ? rarityColors[achievement.rarity] : 'bg-gray-600'
              }`}>
                {getIcon(achievement.icon)}
              </div>
              {achievement.earned && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#00ffe1] rounded-full flex items-center justify-center">
                  <Star className="h-2 w-2 text-black" />
                </div>
              )}
              {!achievement.earned && achievement.progress && achievement.target && (
                <div className="mt-2">
                  <Progress 
                    value={(achievement.progress / achievement.target) * 100} 
                    className="h-1"
                  />
                  <div className="text-xs text-[#8b949e] mt-1">
                    {achievement.progress}/{achievement.target}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {selectedBadge && (
          <div className="p-4 bg-[#0d1117] rounded-lg border border-[#30363d]">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                selectedBadge.earned ? rarityColors[selectedBadge.rarity] : 'bg-gray-600'
              }`}>
                {getIcon(selectedBadge.icon)}
              </div>
              <div>
                <h3 className="text-[#f0f6fc] font-semibold">{selectedBadge.title}</h3>
                <Badge variant="outline" className={`text-xs ${selectedBadge.earned ? 'border-[#00ffe1]' : 'border-gray-500'}`}>
                  {selectedBadge.rarity}
                </Badge>
              </div>
            </div>
            <p className="text-[#8b949e] text-sm mb-2">{selectedBadge.description}</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#00ffe1]">{selectedBadge.points} points</span>
              {selectedBadge.earned && selectedBadge.earnedAt && (
                <span className="text-[#8b949e]">
                  Earned {new Date(selectedBadge.earnedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}