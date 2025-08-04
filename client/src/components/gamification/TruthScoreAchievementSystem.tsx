import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Star, 
  Crown, 
  Medal, 
  Zap, 
  Target,
  TrendingUp,
  Award,
  Flame,
  Sparkles,
  Shield,
  Diamond,
  Gem,
  Rocket,
  CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'truth' | 'engagement' | 'verification' | 'legacy' | 'social';
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  points: number;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: string;
  requirements: string[];
  rewards: {
    gttTokens: number;
    truthScoreBonus: number;
    specialBadge?: string;
    tierBonus?: string;
  };
}

interface ScoreLevel {
  level: number;
  title: string;
  minScore: number;
  maxScore: number;
  color: string;
  benefits: string[];
  nextLevelRequirement?: number;
}

interface AchievementSystemData {
  currentScore: number;
  totalPossibleScore: number;
  currentLevel: ScoreLevel;
  nextLevel?: ScoreLevel;
  achievements: Achievement[];
  recentUnlocks: Achievement[];
  streakCount: number;
  multiplier: number;
}

export function TruthScoreAchievementSystem() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCelebration, setShowCelebration] = useState<Achievement | null>(null);

  const { data: achievementData, isLoading } = useQuery<AchievementSystemData>({
    queryKey: ['/api/achievements/truth-score'],
    staleTime: 60000,
  });

  useEffect(() => {
    if (achievementData?.recentUnlocks.length) {
      const latestUnlock = achievementData.recentUnlocks[0];
      setShowCelebration(latestUnlock);
      setTimeout(() => setShowCelebration(null), 5000);
    }
  }, [achievementData?.recentUnlocks]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'truth': return <Shield className="w-4 h-4" />;
      case 'engagement': return <Flame className="w-4 h-4" />;
      case 'verification': return <Star className="w-4 h-4" />;
      case 'legacy': return <Crown className="w-4 h-4" />;
      case 'social': return <Sparkles className="w-4 h-4" />;
      default: return <Award className="w-4 h-4" />;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-[#8b949e] to-[#6b7280]';
      case 'rare': return 'from-[#3b82f6] to-[#1d4ed8]';
      case 'epic': return 'from-[#7c3aed] to-[#5b21b6]';
      case 'legendary': return 'from-[#f59e0b] to-[#d97706]';
      case 'mythic': return 'from-[#ff00d4] to-[#00ffe1]';
      default: return 'from-[#8b949e] to-[#6b7280]';
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'shadow-lg shadow-[#f59e0b]/30';
      case 'mythic': return 'shadow-lg shadow-[#ff00d4]/30';
      default: return '';
    }
  };

  const getAchievementIcon = (iconName: string) => {
    const icons = {
      trophy: Trophy,
      star: Star,
      crown: Crown,
      medal: Medal,
      zap: Zap,
      target: Target,
      trending: TrendingUp,
      award: Award,
      flame: Flame,
      sparkles: Sparkles,
      shield: Shield,
      diamond: Diamond,
      gem: Gem,
      rocket: Rocket,
    };
    const IconComponent = icons[iconName as keyof typeof icons] || Trophy;
    return <IconComponent className="w-6 h-6" />;
  };

  const filteredAchievements = achievementData?.achievements.filter(
    achievement => selectedCategory === 'all' || achievement.category === selectedCategory
  ) || [];

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <Card className="bg-[#161b22] border-[#30363d]">
          <CardContent className="p-6">
            <div className="h-32 bg-[#21262d] rounded-lg"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!achievementData) return null;

  return (
    <div className="space-y-6">
      {/* Achievement Celebration Modal */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              className={`p-8 rounded-2xl bg-gradient-to-br ${getRarityColor(showCelebration.rarity)} max-w-md mx-4`}
            >
              <div className="text-center text-white">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                  className="mb-4"
                >
                  {getAchievementIcon(showCelebration.icon)}
                </motion.div>
                <h3 className="text-2xl font-bold mb-2">Achievement Unlocked!</h3>
                <h4 className="text-xl mb-2">{showCelebration.title}</h4>
                <p className="mb-4">{showCelebration.description}</p>
                <div className="flex justify-center gap-4 text-sm">
                  <div>+{showCelebration.rewards.gttTokens} GTT</div>
                  <div>+{showCelebration.rewards.truthScoreBonus} Truth Score</div>
                </div>
                <Button
                  className="mt-4 bg-white/20 hover:bg-white/30"
                  onClick={() => setShowCelebration(null)}
                >
                  Awesome!
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current Level & Progress */}
      <Card className="bg-[#161b22] border-[#30363d]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#f0f6fc]">
            <Trophy className="w-5 h-5 text-[#f59e0b]" />
            Truth Score Level System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Current Level */}
            <div className="text-center">
              <div className={`w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center bg-gradient-to-br ${getRarityColor('legendary')}`}>
                <span className="text-2xl font-bold text-white">
                  {achievementData.currentLevel.level}
                </span>
              </div>
              <h3 className="font-bold text-[#f0f6fc] mb-1">
                {achievementData.currentLevel.title}
              </h3>
              <p className="text-sm text-[#8b949e]">Current Level</p>
            </div>

            {/* Progress to Next Level */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[#8b949e]">Progress to Next</span>
                  <span className="text-[#f0f6fc]">
                    {achievementData.currentScore} / {achievementData.nextLevel?.minScore || achievementData.currentScore}
                  </span>
                </div>
                <Progress 
                  value={achievementData.nextLevel ? 
                    ((achievementData.currentScore - achievementData.currentLevel.minScore) / 
                    (achievementData.nextLevel.minScore - achievementData.currentLevel.minScore)) * 100 : 100
                  }
                  className="h-3"
                />
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#8b949e]">Streak: {achievementData.streakCount} days</span>
                <span className="text-[#00ffe1]">Multiplier: {achievementData.multiplier}x</span>
              </div>
            </div>

            {/* Next Level Preview */}
            {achievementData.nextLevel && (
              <div className="text-center">
                <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center bg-gradient-to-br from-[#30363d] to-[#21262d] border-2 border-[#00ffe1]">
                  <span className="text-lg font-bold text-[#00ffe1]">
                    {achievementData.nextLevel.level}
                  </span>
                </div>
                <h3 className="font-bold text-[#00ffe1] mb-1">
                  {achievementData.nextLevel.title}
                </h3>
                <p className="text-sm text-[#8b949e]">Next Level</p>
              </div>
            )}
          </div>

          {/* Current Level Benefits */}
          <div className="mt-6 pt-6 border-t border-[#30363d]">
            <h4 className="font-semibold text-[#f0f6fc] mb-3">Current Level Benefits</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {achievementData.currentLevel.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-[#f59e0b]" />
                  <span className="text-sm text-[#8b949e]">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements Grid */}
      <Card className="bg-[#161b22] border-[#30363d]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-[#f0f6fc]">
              <Award className="w-5 h-5 text-[#7c3aed]" />
              Achievement Collection
            </CardTitle>
            
            {/* Category Filter */}
            <div className="flex gap-2">
              {['all', 'truth', 'engagement', 'verification', 'legacy', 'social'].map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? 
                    'bg-[#7c3aed] text-white' : 
                    'border-[#30363d] text-[#8b949e] hover:text-[#f0f6fc]'
                  }
                >
                  {getCategoryIcon(category)}
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAchievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className={`relative p-4 rounded-lg border-2 transition-all ${
                  achievement.unlocked 
                    ? `bg-gradient-to-br ${getRarityColor(achievement.rarity)} ${getRarityGlow(achievement.rarity)}` 
                    : 'bg-[#21262d] border-[#30363d]'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-full ${
                    achievement.unlocked ? 'bg-white/20' : 'bg-[#30363d]'
                  }`}>
                    <div className={achievement.unlocked ? 'text-white' : 'text-[#8b949e]'}>
                      {getAchievementIcon(achievement.icon)}
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      achievement.unlocked 
                        ? 'border-white/30 text-white' 
                        : 'border-[#30363d] text-[#8b949e]'
                    }`}
                  >
                    {achievement.rarity}
                  </Badge>
                </div>

                <h4 className={`font-bold mb-2 ${
                  achievement.unlocked ? 'text-white' : 'text-[#f0f6fc]'
                }`}>
                  {achievement.title}
                </h4>
                
                <p className={`text-sm mb-3 ${
                  achievement.unlocked ? 'text-white/80' : 'text-[#8b949e]'
                }`}>
                  {achievement.description}
                </p>

                {/* Progress Bar */}
                {!achievement.unlocked && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#8b949e]">Progress</span>
                      <span className="text-[#8b949e]">
                        {achievement.progress}/{achievement.maxProgress}
                      </span>
                    </div>
                    <Progress 
                      value={(achievement.progress / achievement.maxProgress) * 100}
                      className="h-2"
                    />
                  </div>
                )}

                {/* Rewards */}
                <div className={`text-xs flex justify-between ${
                  achievement.unlocked ? 'text-white/70' : 'text-[#8b949e]'
                }`}>
                  <span>+{achievement.rewards.gttTokens} GTT</span>
                  <span>+{achievement.rewards.truthScoreBonus} Score</span>
                  <span>{achievement.points} pts</span>
                </div>

                {/* Unlocked indicator */}
                {achievement.unlocked && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}