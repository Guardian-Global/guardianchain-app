import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Coins, 
  Trophy, 
  Zap, 
  Star, 
  Gift, 
  Calendar,
  Target,
  Users,
  TrendingUp,
  Award,
  Crown,
  Gem
} from 'lucide-react';

interface Quest {
  id: string;
  title: string;
  description: string;
  reward: number;
  progress: number;
  maxProgress: number;
  type: 'daily' | 'weekly' | 'special' | 'achievement';
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
  completed: boolean;
  expiresAt?: Date;
}

interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  type: 'nft' | 'token' | 'access' | 'boost' | 'exclusive';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  available: number;
  claimed: boolean;
}

interface UserStats {
  totalGTT: number;
  questPoints: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  streak: number;
  rank: number;
  totalUsers: number;
}

export default function GamifiedBlockchainRewardsSystem() {
  const [userStats, setUserStats] = useState<UserStats>({
    totalGTT: 2450,
    questPoints: 1890,
    level: 12,
    xp: 8750,
    xpToNextLevel: 1250,
    streak: 7,
    rank: 156,
    totalUsers: 25000
  });

  const [quests, setQuests] = useState<Quest[]>([
    {
      id: 'daily-login',
      title: 'Daily GTT Seeker',
      description: 'Log in to the platform for 7 consecutive days',
      reward: 50,
      progress: 7,
      maxProgress: 7,
      type: 'daily',
      difficulty: 'easy',
      completed: true,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    },
    {
      id: 'bridge-master',
      title: 'Cross-Chain Bridge Master',
      description: 'Successfully bridge GTT tokens across 3 different networks',
      reward: 200,
      progress: 2,
      maxProgress: 3,
      type: 'weekly',
      difficulty: 'medium',
      completed: false,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'staking-legend',
      title: 'Staking Legend',
      description: 'Stake 10,000+ GTT tokens for at least 30 days',
      reward: 500,
      progress: 25,
      maxProgress: 30,
      type: 'achievement',
      difficulty: 'hard',
      completed: false
    },
    {
      id: 'truth-validator',
      title: 'Truth Validator Supreme',
      description: 'Verify 100 truth capsules with 95%+ accuracy',
      reward: 1000,
      progress: 87,
      maxProgress: 100,
      type: 'special',
      difficulty: 'legendary',
      completed: false
    }
  ]);

  const [rewards, setRewards] = useState<Reward[]>([
    {
      id: 'bronze-nft',
      title: 'Guardian Bronze Badge',
      description: 'Exclusive Bronze Guardian NFT with special traits',
      cost: 500,
      type: 'nft',
      rarity: 'common',
      available: 1000,
      claimed: false
    },
    {
      id: 'gtt-bonus',
      title: '1000 GTT Bonus',
      description: 'Instant 1000 GTT tokens added to your wallet',
      cost: 800,
      type: 'token',
      rarity: 'rare',
      available: 50,
      claimed: false
    },
    {
      id: 'premium-access',
      title: 'Premium Features Access',
      description: '30-day access to all premium platform features',
      cost: 1200,
      type: 'access',
      rarity: 'epic',
      available: 20,
      claimed: false
    },
    {
      id: 'legendary-crown',
      title: 'Truth Guardian Crown',
      description: 'Ultra-rare NFT crown with special governance powers',
      cost: 5000,
      type: 'exclusive',
      rarity: 'legendary',
      available: 1,
      claimed: false
    }
  ]);

  const getDifficultyColor = (difficulty: Quest['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-orange-500';
      case 'legendary': return 'bg-purple-500';
    }
  };

  const getRarityColor = (rarity: Reward['rarity']) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-yellow-500';
    }
  };

  const getTypeIcon = (type: Quest['type']) => {
    switch (type) {
      case 'daily': return <Calendar className="w-4 h-4" />;
      case 'weekly': return <Target className="w-4 h-4" />;
      case 'special': return <Star className="w-4 h-4" />;
      case 'achievement': return <Trophy className="w-4 h-4" />;
    }
  };

  const getRewardIcon = (type: Reward['type']) => {
    switch (type) {
      case 'nft': return <Gem className="w-4 h-4" />;
      case 'token': return <Coins className="w-4 h-4" />;
      case 'access': return <Crown className="w-4 h-4" />;
      case 'boost': return <Zap className="w-4 h-4" />;
      case 'exclusive': return <Award className="w-4 h-4" />;
    }
  };

  const claimQuest = (questId: string) => {
    setQuests(prev => prev.map(quest => 
      quest.id === questId 
        ? { ...quest, completed: true }
        : quest
    ));
    
    const quest = quests.find(q => q.id === questId);
    if (quest) {
      setUserStats(prev => ({
        ...prev,
        questPoints: prev.questPoints + quest.reward,
        xp: prev.xp + quest.reward * 2
      }));
    }
  };

  const claimReward = (rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (reward && userStats.questPoints >= reward.cost) {
      setRewards(prev => prev.map(r =>
        r.id === rewardId
          ? { ...r, claimed: true, available: r.available - 1 }
          : r
      ));
      
      setUserStats(prev => ({
        ...prev,
        questPoints: prev.questPoints - reward.cost
      }));
    }
  };

  const calculateLevelProgress = () => {
    return Math.round((userStats.xp / (userStats.xp + userStats.xpToNextLevel)) * 100);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Gamified Blockchain Rewards and Engagement System
        </CardTitle>
        <CardDescription>
          Complete quests, earn rewards, and climb the leaderboards in the GTT ecosystem
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* User Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-300">
              {userStats.totalGTT.toLocaleString()}
            </div>
            <div className="text-xs text-purple-600 dark:text-purple-400">GTT Tokens</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-300">
              {userStats.questPoints.toLocaleString()}
            </div>
            <div className="text-xs text-yellow-600 dark:text-yellow-400">Quest Points</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-300">
              {userStats.level}
            </div>
            <div className="text-xs text-green-600 dark:text-green-400">Level</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-300">
              #{userStats.rank}
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400">Global Rank</div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Level {userStats.level} Progress</span>
            <span className="text-sm text-muted-foreground">
              {userStats.xp.toLocaleString()} / {(userStats.xp + userStats.xpToNextLevel).toLocaleString()} XP
            </span>
          </div>
          <Progress value={calculateLevelProgress()} className="h-3" />
        </div>

        <Tabs defaultValue="quests" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="quests">Active Quests</TabsTrigger>
            <TabsTrigger value="rewards">Reward Shop</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          <TabsContent value="quests" className="space-y-4">
            <div className="grid gap-4">
              {quests.map(quest => (
                <Card key={quest.id} className={`p-4 ${quest.completed ? 'bg-green-50 dark:bg-green-950' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-muted rounded-lg">
                        {getTypeIcon(quest.type)}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{quest.title}</h3>
                          <Badge 
                            className={`text-white ${getDifficultyColor(quest.difficulty)}`}
                            variant="secondary"
                          >
                            {quest.difficulty}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {quest.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{quest.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Coins className="w-3 h-3" />
                            {quest.reward} points
                          </span>
                          {quest.expiresAt && (
                            <span>Expires: {quest.expiresAt.toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 text-right">
                      <div className="text-sm font-medium">
                        {quest.progress}/{quest.maxProgress}
                      </div>
                      <Progress value={(quest.progress / quest.maxProgress) * 100} className="w-24 h-2" />
                      {quest.progress >= quest.maxProgress && !quest.completed && (
                        <Button
                          size="sm"
                          onClick={() => claimQuest(quest.id)}
                          className="w-24"
                        >
                          Claim
                        </Button>
                      )}
                      {quest.completed && (
                        <Badge className="w-24 justify-center">Completed</Badge>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-lg font-semibold">Available Quest Points</div>
              <div className="text-3xl font-bold text-primary">{userStats.questPoints.toLocaleString()}</div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {rewards.map(reward => (
                <Card key={reward.id} className={`p-4 ${reward.claimed ? 'opacity-50' : ''}`}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getRewardIcon(reward.type)}
                        <h3 className="font-medium">{reward.title}</h3>
                      </div>
                      <Badge 
                        className={`text-white ${getRarityColor(reward.rarity)}`}
                        variant="secondary"
                      >
                        {reward.rarity}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{reward.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Coins className="w-4 h-4" />
                        <span className="font-medium">{reward.cost.toLocaleString()} points</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {reward.available} available
                      </span>
                    </div>
                    
                    <Button 
                      className="w-full"
                      disabled={reward.claimed || userStats.questPoints < reward.cost || reward.available === 0}
                      onClick={() => claimReward(reward.id)}
                    >
                      {reward.claimed ? 'Claimed' : 
                       userStats.questPoints < reward.cost ? 'Insufficient Points' :
                       reward.available === 0 ? 'Sold Out' : 'Claim Reward'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gradient-to-b from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800 rounded-lg">
                  <div className="text-2xl">🥇</div>
                  <div className="font-medium">TruthSeeker1</div>
                  <div className="text-sm text-muted-foreground">15,420 points</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg">
                  <div className="text-2xl">🥈</div>
                  <div className="font-medium">GuardianPro</div>
                  <div className="text-sm text-muted-foreground">12,890 points</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-b from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800 rounded-lg">
                  <div className="text-2xl">🥉</div>
                  <div className="font-medium">ChainMaster</div>
                  <div className="text-sm text-muted-foreground">11,560 points</div>
                </div>
              </div>

              <Card className="p-4">
                <div className="space-y-3">
                  <h3 className="font-medium">Your Position</h3>
                  <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-lg font-bold">#{userStats.rank}</div>
                      <div>
                        <div className="font-medium">You</div>
                        <div className="text-sm text-muted-foreground">{userStats.questPoints.toLocaleString()} points</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">Top {Math.round((userStats.rank / userStats.totalUsers) * 100)}%</div>
                      <div className="text-xs text-muted-foreground">of {userStats.totalUsers.toLocaleString()} users</div>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <div className="font-medium">Weekly Growth</div>
                  <div className="text-2xl font-bold text-green-500">+12%</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <div className="font-medium">Active Players</div>
                  <div className="text-2xl font-bold">{userStats.totalUsers.toLocaleString()}</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Star className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                  <div className="font-medium">Avg Level</div>
                  <div className="text-2xl font-bold">8.2</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}