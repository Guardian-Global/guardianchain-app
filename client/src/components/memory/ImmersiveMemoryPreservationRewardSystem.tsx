import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Star, 
  Gift, 
  Zap, 
  Crown,
  Target,
  Award,
  Coins,
  TrendingUp,
  Clock,
  Users,
  Heart,
  Sparkles,
  Calendar,
  ArrowUp,
  CheckCircle
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  type: 'milestone' | 'engagement' | 'quality' | 'community' | 'streak';
  progress: number;
  maxProgress: number;
  reward: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
  icon: React.ComponentType<any>;
}

interface RewardTier {
  level: number;
  title: string;
  requiredXP: number;
  benefits: string[];
  multiplier: number;
  badge: string;
}

interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  reward: number;
  progress: number;
  maxProgress: number;
  completed: boolean;
  expiresAt: Date;
}

const REWARD_TIERS: RewardTier[] = [
  {
    level: 1,
    title: 'Memory Keeper',
    requiredXP: 0,
    benefits: ['Basic memory storage', '1x reward multiplier'],
    multiplier: 1.0,
    badge: '🏅'
  },
  {
    level: 2,
    title: 'Story Weaver',
    requiredXP: 1000,
    benefits: ['Enhanced storage', 'Story connections', '1.2x reward multiplier'],
    multiplier: 1.2,
    badge: '🎖️'
  },
  {
    level: 3,
    title: 'Memory Guardian',
    requiredXP: 5000,
    benefits: ['Premium features', 'Community voting', '1.5x reward multiplier'],
    multiplier: 1.5,
    badge: '🏆'
  },
  {
    level: 4,
    title: 'Legacy Architect',
    requiredXP: 15000,
    benefits: ['Advanced analytics', 'Mentorship access', '2x reward multiplier'],
    multiplier: 2.0,
    badge: '👑'
  },
  {
    level: 5,
    title: 'Eternal Chronicler',
    requiredXP: 50000,
    benefits: ['Unlimited storage', 'Premium support', '3x reward multiplier'],
    multiplier: 3.0,
    badge: '⭐'
  }
];

const SAMPLE_ACHIEVEMENTS: Achievement[] = [
  {
    id: '1',
    title: 'First Memory',
    description: 'Create your first memory capsule',
    type: 'milestone',
    progress: 1,
    maxProgress: 1,
    reward: 50,
    rarity: 'common',
    unlockedAt: new Date('2024-01-15'),
    icon: Star
  },
  {
    id: '2',
    title: 'Week Streak',
    description: 'Add memories for 7 consecutive days',
    type: 'streak',
    progress: 5,
    maxProgress: 7,
    reward: 200,
    rarity: 'rare',
    icon: Calendar
  },
  {
    id: '3',
    title: 'Community Favorite',
    description: 'Receive 100 likes on a single memory',
    type: 'engagement',
    progress: 67,
    maxProgress: 100,
    reward: 300,
    rarity: 'epic',
    icon: Heart
  },
  {
    id: '4',
    title: 'Master Storyteller',
    description: 'Create 50 interconnected memories',
    type: 'quality',
    progress: 23,
    maxProgress: 50,
    reward: 1000,
    rarity: 'legendary',
    icon: Crown
  },
  {
    id: '5',
    title: 'Helping Hand',
    description: 'Help verify 25 community memories',
    type: 'community',
    progress: 18,
    maxProgress: 25,
    reward: 250,
    rarity: 'rare',
    icon: Users
  }
];

const DAILY_CHALLENGES: DailyChallenge[] = [
  {
    id: '1',
    title: 'Memory Moment',
    description: 'Add one new memory today',
    reward: 25,
    progress: 0,
    maxProgress: 1,
    completed: false,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
  },
  {
    id: '2',
    title: 'Social Butterfly',
    description: 'Like 5 community memories',
    reward: 15,
    progress: 2,
    maxProgress: 5,
    completed: false,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
  },
  {
    id: '3',
    title: 'Quality Focus',
    description: 'Add emotional tags to 3 memories',
    reward: 30,
    progress: 3,
    maxProgress: 3,
    completed: true,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
  }
];

const rarityColors = {
  common: 'from-gray-500 to-gray-600',
  rare: 'from-blue-500 to-blue-600',
  epic: 'from-purple-500 to-purple-600',
  legendary: 'from-yellow-500 to-orange-500'
};

const rarityBorders = {
  common: 'border-gray-500/50',
  rare: 'border-blue-500/50',
  epic: 'border-purple-500/50',
  legendary: 'border-yellow-500/50'
};

export default function ImmersiveMemoryPreservationRewardSystem() {
  const [currentXP, setCurrentXP] = useState(3247);
  const [currentLevel, setCurrentLevel] = useState(2);
  const [totalGTT, setTotalGTT] = useState(147.8);
  const [achievements, setAchievements] = useState(SAMPLE_ACHIEVEMENTS);
  const [dailyChallenges, setDailyChallenges] = useState(DAILY_CHALLENGES);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [showRewardAnimation, setShowRewardAnimation] = useState(false);

  const currentTier = REWARD_TIERS[currentLevel - 1];
  const nextTier = REWARD_TIERS[currentLevel];
  const progressToNext = nextTier ? 
    ((currentXP - currentTier.requiredXP) / (nextTier.requiredXP - currentTier.requiredXP)) * 100 : 100;

  const completeDailyChallenge = (challengeId: string) => {
    setDailyChallenges(prev => prev.map(challenge => 
      challenge.id === challengeId 
        ? { ...challenge, completed: true, progress: challenge.maxProgress }
        : challenge
    ));
    
    const challenge = dailyChallenges.find(c => c.id === challengeId);
    if (challenge) {
      setCurrentXP(prev => prev + challenge.reward);
      setTotalGTT(prev => prev + (challenge.reward * 0.1));
      setShowRewardAnimation(true);
      setTimeout(() => setShowRewardAnimation(false), 2000);
    }
  };

  const AchievementCard = ({ achievement }: { achievement: Achievement }) => {
    const Icon = achievement.icon;
    const isCompleted = achievement.progress >= achievement.maxProgress;
    
    return (
      <motion.div
        whileHover={{ scale: 1.03, y: -5 }}
        whileTap={{ scale: 0.98 }}
        className={`cursor-pointer ${rarityBorders[achievement.rarity]}`}
        onClick={() => setSelectedAchievement(achievement)}
      >
        <Card className={`bg-slate-800/80 backdrop-blur-sm border-2 ${rarityBorders[achievement.rarity]} overflow-hidden`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className={`${isCompleted ? 'text-yellow-400' : 'text-gray-400'}`} size={20} />
                {isCompleted && <CheckCircle className="text-green-400" size={16} />}
              </div>
              <Badge className={`bg-gradient-to-r ${rarityColors[achievement.rarity]} text-white`}>
                {achievement.rarity}
              </Badge>
            </div>
            <CardTitle className="text-white text-sm">{achievement.title}</CardTitle>
          </CardHeader>
          
          <CardContent>
            <p className="text-gray-300 text-xs mb-3 line-clamp-2">
              {achievement.description}
            </p>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Progress</span>
                <span className="text-white">{achievement.progress}/{achievement.maxProgress}</span>
              </div>
              
              <Progress 
                value={(achievement.progress / achievement.maxProgress) * 100} 
                className="h-2"
              />
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Reward</span>
                <div className="flex items-center gap-1">
                  <Coins className="text-yellow-400" size={12} />
                  <span className="text-yellow-300 text-xs font-bold">{achievement.reward} GTT</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const DailyChallengeCard = ({ challenge }: { challenge: DailyChallenge }) => {
    const timeLeft = Math.max(0, challenge.expiresAt.getTime() - Date.now());
    const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
    
    return (
      <Card className={`bg-slate-800/80 backdrop-blur-sm border transition-all duration-300 ${
        challenge.completed ? 'border-green-500/50 bg-green-500/10' : 'border-blue-500/30'
      }`}>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold text-sm">{challenge.title}</h3>
            {challenge.completed ? (
              <CheckCircle className="text-green-400" size={16} />
            ) : (
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Clock size={12} />
                <span>{hoursLeft}h left</span>
              </div>
            )}
          </div>
          
          <p className="text-gray-300 text-xs mb-3">{challenge.description}</p>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Progress</span>
              <span className="text-white">{challenge.progress}/{challenge.maxProgress}</span>
            </div>
            
            <Progress 
              value={(challenge.progress / challenge.maxProgress) * 100} 
              className="h-2"
            />
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <Gift className="text-blue-400" size={12} />
                <span className="text-blue-300 text-xs">{challenge.reward} XP</span>
              </div>
              
              {!challenge.completed && challenge.progress < challenge.maxProgress && (
                <Button
                  size="sm"
                  onClick={() => completeDailyChallenge(challenge.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 h-6"
                >
                  Complete
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Trophy className="text-yellow-400" />
            Immersive Memory Preservation Reward System
            <Sparkles className="text-purple-400" />
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Earn rewards, unlock achievements, and level up your memory preservation journey
          </p>
        </motion.div>

        {/* Player Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="bg-slate-800/80 backdrop-blur-sm border-yellow-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Crown className="text-yellow-400" />
                {currentTier.badge} {currentTier.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-1">{currentXP.toLocaleString()}</div>
                  <div className="text-gray-400 text-sm">Total XP</div>
                  {nextTier && (
                    <div className="mt-2">
                      <div className="text-xs text-gray-400 mb-1">Next Level: {nextTier.requiredXP.toLocaleString()} XP</div>
                      <Progress value={progressToNext} className="h-2" />
                    </div>
                  )}
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-1">{totalGTT.toFixed(1)}</div>
                  <div className="text-gray-400 text-sm">GTT Earned</div>
                  <div className="mt-2">
                    <Badge className="bg-green-500/20 text-green-300">
                      {currentTier.multiplier}x multiplier
                    </Badge>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-1">
                    {achievements.filter(a => a.unlockedAt).length}
                  </div>
                  <div className="text-gray-400 text-sm">Achievements Unlocked</div>
                  <div className="mt-2">
                    <div className="text-xs text-gray-400">
                      {achievements.filter(a => !a.unlockedAt).length} remaining
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-1">
                    {dailyChallenges.filter(c => c.completed).length}
                  </div>
                  <div className="text-gray-400 text-sm">Daily Challenges Done</div>
                  <div className="mt-2">
                    <div className="text-xs text-gray-400">
                      {dailyChallenges.length - dailyChallenges.filter(c => c.completed).length} remaining
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Achievements */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Award className="text-purple-400" />
                Achievements
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <AchievementCard key={achievement.id} achievement={achievement} />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Daily Challenges & Tier Benefits */}
          <div className="space-y-6">
            {/* Daily Challenges */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Target className="text-blue-400" />
                Daily Challenges
              </h2>
              
              <div className="space-y-3">
                {dailyChallenges.map((challenge) => (
                  <DailyChallengeCard key={challenge.id} challenge={challenge} />
                ))}
              </div>
            </motion.div>

            {/* Current Tier Benefits */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-slate-800/80 backdrop-blur-sm border-yellow-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Sparkles className="text-yellow-400" />
                    Current Benefits
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    {currentTier.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="text-green-400" size={16} />
                        <span className="text-gray-300 text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                  
                  {nextTier && (
                    <div className="mt-4 pt-4 border-t border-slate-600">
                      <h4 className="text-white font-semibold mb-2">Next Tier: {nextTier.title}</h4>
                      <div className="space-y-2">
                        {nextTier.benefits.slice(currentTier.benefits.length).map((benefit, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <ArrowUp className="text-blue-400" size={16} />
                            <span className="text-gray-400 text-sm">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Reward Animation */}
        <AnimatePresence>
          {showRewardAnimation && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
            >
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3">
                <Trophy className="text-white" size={24} />
                <span className="font-bold text-lg">Reward Earned!</span>
                <Sparkles className="text-white" size={24} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Achievement Detail Modal */}
        <AnimatePresence>
          {selectedAchievement && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedAchievement(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-800 rounded-2xl p-8 max-w-md w-full"
                onClick={e => e.stopPropagation()}
              >
                <div className="text-center">
                  <div className="mb-4">
                    <selectedAchievement.icon className="text-yellow-400 mx-auto" size={48} />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedAchievement.title}</h2>
                  <Badge className={`mb-4 bg-gradient-to-r ${rarityColors[selectedAchievement.rarity]} text-white`}>
                    {selectedAchievement.rarity.toUpperCase()}
                  </Badge>
                  
                  <p className="text-gray-300 mb-6">{selectedAchievement.description}</p>
                  
                  <div className="space-y-4">
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <div className="text-lg font-bold text-white mb-2">
                        Progress: {selectedAchievement.progress}/{selectedAchievement.maxProgress}
                      </div>
                      <Progress 
                        value={(selectedAchievement.progress / selectedAchievement.maxProgress) * 100} 
                        className="h-3"
                      />
                    </div>
                    
                    <div className="flex items-center justify-center gap-2">
                      <Coins className="text-yellow-400" size={20} />
                      <span className="text-yellow-300 font-bold text-lg">{selectedAchievement.reward} GTT Reward</span>
                    </div>
                    
                    {selectedAchievement.unlockedAt && (
                      <div className="text-sm text-gray-400">
                        Unlocked: {selectedAchievement.unlockedAt.toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    onClick={() => setSelectedAchievement(null)}
                    className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Close
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}