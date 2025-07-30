import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Star, 
  Crown, 
  Zap, 
  Shield, 
  Target,
  Coins,
  Users,
  Clock,
  TrendingUp,
  Gift,
  Sparkles,
  Award,
  Medal
} from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'development' | 'community' | 'token' | 'security' | 'milestone';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'legendary';
  progress: number;
  maxProgress: number;
  isUnlocked: boolean;
  reward: {
    gtt: number;
    xp: number;
    title?: string;
  };
  unlockedAt?: Date;
}

interface PlayerStats {
  level: number;
  totalXP: number;
  nextLevelXP: number;
  gttEarned: number;
  achievementsUnlocked: number;
  currentTitle: string;
  streak: number;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-deployment',
    name: 'Hello World',
    description: 'Deploy your first application',
    category: 'development',
    tier: 'bronze',
    progress: 0,
    maxProgress: 1,
    isUnlocked: false,
    reward: { gtt: 100, xp: 50 }
  },
  {
    id: 'replit-tools-master',
    name: 'Tool Master',
    description: 'Activate all 20+ Replit tools',
    category: 'development',
    tier: 'gold',
    progress: 0,
    maxProgress: 20,
    isUnlocked: false,
    reward: { gtt: 500, xp: 250, title: 'Tool Master' }
  },
  {
    id: 'gtt-holder',
    name: 'Token Collector',
    description: 'Hold 1,000+ GTT tokens',
    category: 'token',
    tier: 'silver',
    progress: 0,
    maxProgress: 1000,
    isUnlocked: false,
    reward: { gtt: 200, xp: 100 }
  },
  {
    id: 'security-expert',
    name: 'Security Guardian',
    description: 'Complete all security implementations',
    category: 'security',
    tier: 'platinum',
    progress: 0,
    maxProgress: 5,
    isUnlocked: false,
    reward: { gtt: 750, xp: 400, title: 'Security Guardian' }
  },
  {
    id: 'community-leader',
    name: 'Community Builder',
    description: 'Help 50 community members',
    category: 'community',
    tier: 'gold',
    progress: 0,
    maxProgress: 50,
    isUnlocked: false,
    reward: { gtt: 400, xp: 200, title: 'Community Leader' }
  },
  {
    id: 'blockchain-expert',
    name: 'Blockchain Sage',
    description: 'Complete all learning modules',
    category: 'development',
    tier: 'legendary',
    progress: 0,
    maxProgress: 10,
    isUnlocked: false,
    reward: { gtt: 1000, xp: 500, title: 'Blockchain Sage' }
  },
  {
    id: 'early-adopter',
    name: 'Pioneer',
    description: 'Join during launch week',
    category: 'milestone',
    tier: 'silver',
    progress: 1,
    maxProgress: 1,
    isUnlocked: true,
    reward: { gtt: 250, xp: 125 },
    unlockedAt: new Date()
  },
  {
    id: 'speed-demon',
    name: 'Lightning Fast',
    description: 'Deploy in under 60 seconds',
    category: 'development',
    tier: 'gold',
    progress: 0,
    maxProgress: 1,
    isUnlocked: false,
    reward: { gtt: 300, xp: 150 }
  },
  {
    id: 'wallet-wizard',
    name: 'Wallet Wizard',
    description: 'Connect 5 different wallet types',
    category: 'development',
    tier: 'bronze',
    progress: 0,
    maxProgress: 5,
    isUnlocked: false,
    reward: { gtt: 150, xp: 75 }
  },
  {
    id: 'network-explorer',
    name: 'Network Explorer',
    description: 'Connect to all supported networks',
    category: 'development',
    tier: 'silver',
    progress: 0,
    maxProgress: 6,
    isUnlocked: false,
    reward: { gtt: 200, xp: 100 }
  }
];

const INITIAL_STATS: PlayerStats = {
  level: 1,
  totalXP: 125,
  nextLevelXP: 500,
  gttEarned: 250,
  achievementsUnlocked: 1,
  currentTitle: 'Pioneer',
  streak: 1
};

export default function GamifiedPlatformAchievements() {
  const [achievements, setAchievements] = useState(ACHIEVEMENTS);
  const [playerStats, setPlayerStats] = useState(INITIAL_STATS);
  const [isSimulating, setIsSimulating] = useState(false);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);

  const simulateProgress = async () => {
    setIsSimulating(true);
    
    // Simulate various achievements being unlocked
    const progressUpdates = [
      { id: 'first-deployment', progress: 1 },
      { id: 'replit-tools-master', progress: 15 },
      { id: 'gtt-holder', progress: 847 },
      { id: 'wallet-wizard', progress: 3 },
      { id: 'network-explorer', progress: 4 },
      { id: 'security-expert', progress: 3 }
    ];

    for (const update of progressUpdates) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAchievements(prev => prev.map(achievement => {
        if (achievement.id === update.id) {
          const newProgress = Math.min(update.progress, achievement.maxProgress);
          const isUnlocked = !achievement.isUnlocked && newProgress >= achievement.maxProgress;
          
          if (isUnlocked) {
            const unlockedAchievement = { ...achievement, progress: newProgress, isUnlocked: true, unlockedAt: new Date() };
            setNewAchievements(prev => [...prev, unlockedAchievement]);
            
            // Update player stats
            setPlayerStats(prev => ({
              ...prev,
              totalXP: prev.totalXP + achievement.reward.xp,
              gttEarned: prev.gttEarned + achievement.reward.gtt,
              achievementsUnlocked: prev.achievementsUnlocked + 1,
              currentTitle: achievement.reward.title || prev.currentTitle,
              streak: prev.streak + 1
            }));
          }
          
          return { ...achievement, progress: newProgress, isUnlocked: isUnlocked || achievement.isUnlocked };
        }
        return achievement;
      }));
    }

    setIsSimulating(false);
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'bronze': return <Medal className="h-5 w-5 text-amber-600" />;
      case 'silver': return <Award className="h-5 w-5 text-gray-400" />;
      case 'gold': return <Trophy className="h-5 w-5 text-yellow-400" />;
      case 'platinum': return <Crown className="h-5 w-5 text-purple-400" />;
      case 'legendary': return <Star className="h-5 w-5 text-pink-400" />;
      default: return <Target className="h-5 w-5 text-gray-400" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'border-amber-600/50 bg-amber-900/20';
      case 'silver': return 'border-gray-400/50 bg-gray-900/20';
      case 'gold': return 'border-yellow-400/50 bg-yellow-900/20';
      case 'platinum': return 'border-purple-400/50 bg-purple-900/20';
      case 'legendary': return 'border-pink-400/50 bg-pink-900/20';
      default: return 'border-slate-700 bg-slate-800/50';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'development': return <Zap className="h-4 w-4 text-blue-400" />;
      case 'community': return <Users className="h-4 w-4 text-green-400" />;
      case 'token': return <Coins className="h-4 w-4 text-yellow-400" />;
      case 'security': return <Shield className="h-4 w-4 text-red-400" />;
      case 'milestone': return <TrendingUp className="h-4 w-4 text-purple-400" />;
      default: return <Target className="h-4 w-4 text-gray-400" />;
    }
  };

  const dismissNewAchievements = () => {
    setNewAchievements([]);
  };

  const unlockedAchievements = achievements.filter(a => a.isUnlocked);
  const totalAchievements = achievements.length;
  const completionPercentage = (unlockedAchievements.length / totalAchievements) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
          Gamified Platform Achievements
        </h1>
        <p className="text-xl text-slate-300">
          Unlock achievements, earn GTT tokens, and level up your GUARDIANCHAIN journey
        </p>
      </div>

      {/* Player Stats */}
      <Card className="bg-slate-800/50 border-yellow-500/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            <Trophy className="h-6 w-6 text-yellow-400" />
            Player Profile - {playerStats.currentTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-blue-400">{playerStats.level}</p>
              <p className="text-sm text-slate-400">Level</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-purple-400">{playerStats.totalXP}</p>
              <p className="text-sm text-slate-400">Total XP</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-yellow-400">{playerStats.gttEarned}</p>
              <p className="text-sm text-slate-400">GTT Earned</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-green-400">{playerStats.achievementsUnlocked}</p>
              <p className="text-sm text-slate-400">Achievements</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300">Progress to Level {playerStats.level + 1}</span>
              <span className="text-white font-semibold">
                {playerStats.totalXP}/{playerStats.nextLevelXP} XP
              </span>
            </div>
            <Progress value={(playerStats.totalXP / playerStats.nextLevelXP) * 100} className="h-3" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300">Achievement Completion</span>
              <span className="text-white font-semibold">{Math.round(completionPercentage)}%</span>
            </div>
            <Progress value={completionPercentage} className="h-3" />
          </div>

          <Button 
            onClick={simulateProgress}
            disabled={isSimulating}
            className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white"
          >
            {isSimulating ? (
              <>
                <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                SIMULATING PROGRESS...
              </>
            ) : (
              <>
                <Gift className="mr-2 h-5 w-5" />
                SIMULATE ACHIEVEMENTS
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* New Achievement Notifications */}
      {newAchievements.length > 0 && (
        <Card className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 border-yellow-500/50 animate-pulse">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <Trophy className="w-16 h-16 text-yellow-400 mx-auto" />
              <h2 className="text-2xl font-bold text-white">🎉 Achievement{newAchievements.length > 1 ? 's' : ''} Unlocked!</h2>
              
              <div className="space-y-2">
                {newAchievements.map((achievement) => (
                  <div key={achievement.id} className="bg-slate-800/50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getTierIcon(achievement.tier)}
                        <div>
                          <h3 className="text-white font-semibold">{achievement.name}</h3>
                          <p className="text-sm text-slate-400">{achievement.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-yellow-400 font-semibold">+{achievement.reward.gtt} GTT</p>
                        <p className="text-purple-400 text-sm">+{achievement.reward.xp} XP</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button onClick={dismissNewAchievements} variant="outline" className="border-yellow-500 text-yellow-400">
                <CheckCircle className="mr-2 h-4 w-4" />
                Awesome!
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement) => (
          <Card 
            key={achievement.id} 
            className={`border transition-all duration-300 ${
              achievement.isUnlocked 
                ? getTierColor(achievement.tier)
                : 'bg-slate-800/50 border-slate-700 opacity-60'
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getTierIcon(achievement.tier)}
                  <div>
                    <CardTitle className={`text-lg ${achievement.isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                      {achievement.name}
                    </CardTitle>
                    <p className="text-sm text-slate-400">{achievement.description}</p>
                  </div>
                </div>
                {getCategoryIcon(achievement.category)}
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Progress</span>
                  <span className={achievement.isUnlocked ? 'text-white' : 'text-slate-400'}>
                    {achievement.progress}/{achievement.maxProgress}
                  </span>
                </div>
                <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Badge className={`text-xs ${
                      achievement.tier === 'bronze' ? 'bg-amber-600' :
                      achievement.tier === 'silver' ? 'bg-gray-400' :
                      achievement.tier === 'gold' ? 'bg-yellow-600' :
                      achievement.tier === 'platinum' ? 'bg-purple-600' : 'bg-pink-600'
                    }`}>
                      {achievement.tier.toUpperCase()}
                    </Badge>
                    {achievement.isUnlocked && (
                      <Badge className="bg-green-600 text-white text-xs">
                        UNLOCKED
                      </Badge>
                    )}
                  </div>
                  
                  <div className="text-right text-sm">
                    <p className="text-yellow-400 font-semibold">{achievement.reward.gtt} GTT</p>
                    <p className="text-purple-400">{achievement.reward.xp} XP</p>
                  </div>
                </div>

                {achievement.reward.title && (
                  <div className="bg-slate-700/50 rounded p-2 text-center">
                    <p className="text-xs text-slate-400">Title Reward:</p>
                    <p className="text-sm text-yellow-400 font-semibold">"{achievement.reward.title}"</p>
                  </div>
                )}

                {achievement.unlockedAt && (
                  <div className="text-xs text-green-400 text-center">
                    Unlocked on {achievement.unlockedAt.toLocaleDateString()}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}