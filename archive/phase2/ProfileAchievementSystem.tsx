import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Crown, 
  Star, 
  Shield, 
  Target, 
  Award, 
  Zap, 
  Heart, 
  Users, 
  FileText,
  CheckCircle,
  Lock,
  Unlock,
  Gift,
  Medal,
  Gem,
  Sparkles,
  Flame,
  Bolt,
  Timer,
  TrendingUp,
  Calendar,
  BookOpen,
  MessageSquare,
  Share2,
  Eye,
  Bookmark
} from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: 'truth' | 'social' | 'technical' | 'special' | 'milestone';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: string;
  reward?: {
    type: 'badge' | 'title' | 'theme' | 'gtt' | 'feature';
    value: string | number;
  };
}

interface ProfileAchievementSystemProps {
  achievements: Achievement[];
  totalGTT: number;
  truthScore: number;
}

const rarityColors = {
  common: 'from-gray-500 to-gray-600',
  uncommon: 'from-green-500 to-green-600',
  rare: 'from-blue-500 to-blue-600',
  epic: 'from-purple-500 to-purple-600',
  legendary: 'from-yellow-400 to-orange-500'
};

const rarityBorders = {
  common: 'border-gray-500/50',
  uncommon: 'border-green-500/50',
  rare: 'border-blue-500/50',
  epic: 'border-purple-500/50',
  legendary: 'border-yellow-500/50'
};

const categoryIcons = {
  truth: Shield,
  social: Users,
  technical: Zap,
  special: Star,
  milestone: Trophy
};

const mockAchievements: Achievement[] = [
  {
    id: 'truth_seeker',
    name: 'Truth Seeker',
    description: 'Verify 10 truth capsules',
    icon: Shield,
    category: 'truth',
    rarity: 'common',
    progress: 7,
    maxProgress: 10,
    unlocked: false,
    reward: { type: 'badge', value: 'Truth Seeker' }
  },
  {
    id: 'social_butterfly',
    name: 'Social Butterfly',
    description: 'Connect with 50 guardians',
    icon: Users,
    category: 'social',
    rarity: 'uncommon',
    progress: 50,
    maxProgress: 50,
    unlocked: true,
    unlockedAt: '2024-01-15',
    reward: { type: 'title', value: 'Social Guardian' }
  },
  {
    id: 'tech_master',
    name: 'Tech Master',
    description: 'Deploy 5 smart contracts',
    icon: Zap,
    category: 'technical',
    rarity: 'rare',
    progress: 3,
    maxProgress: 5,
    unlocked: false,
    reward: { type: 'theme', value: 'Matrix Code' }
  },
  {
    id: 'legendary_guardian',
    name: 'Legendary Guardian',
    description: 'Reach 95+ Truth Score',
    icon: Crown,
    category: 'milestone',
    rarity: 'legendary',
    progress: 87,
    maxProgress: 95,
    unlocked: false,
    reward: { type: 'gtt', value: 10000 }
  },
  {
    id: 'capsule_creator',
    name: 'Capsule Creator',
    description: 'Create 100 truth capsules',
    icon: FileText,
    category: 'truth',
    rarity: 'epic',
    progress: 45,
    maxProgress: 100,
    unlocked: false,
    reward: { type: 'feature', value: 'Premium Editor' }
  }
];

export default function ProfileAchievementSystem({ 
  achievements = mockAchievements, 
  totalGTT = 12547, 
  truthScore = 87 
}: ProfileAchievementSystemProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'progress' | 'rarity' | 'recent'>('progress');

  const categories = [
    { id: 'all', name: 'All Achievements', icon: Trophy },
    { id: 'truth', name: 'Truth & Validation', icon: Shield },
    { id: 'social', name: 'Social & Community', icon: Users },
    { id: 'technical', name: 'Technical Mastery', icon: Zap },
    { id: 'milestone', name: 'Major Milestones', icon: Crown },
    { id: 'special', name: 'Special Events', icon: Star }
  ];

  const filteredAchievements = achievements.filter(achievement => 
    selectedCategory === 'all' || achievement.category === selectedCategory
  );

  const sortedAchievements = [...filteredAchievements].sort((a, b) => {
    switch (sortBy) {
      case 'progress':
        return (b.progress / b.maxProgress) - (a.progress / a.maxProgress);
      case 'rarity':
        const rarityOrder = { common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5 };
        return rarityOrder[b.rarity] - rarityOrder[a.rarity];
      case 'recent':
        return (b.unlockedAt || '0').localeCompare(a.unlockedAt || '0');
      default:
        return 0;
    }
  });

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const completionPercentage = (unlockedCount / achievements.length) * 100;

  return (
    <div className="space-y-6">
      {/* Achievement Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-black/50 backdrop-blur-lg border-yellow-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-300" data-testid="text-unlocked-count">
                  {unlockedCount}
                </div>
                <div className="text-sm text-gray-400">Achievements Unlocked</div>
              </div>
              <Trophy className="w-8 h-8 text-yellow-300" />
            </div>
            <Progress value={completionPercentage} className="mt-2 h-2" />
            <div className="text-xs text-gray-400 mt-1">
              {completionPercentage.toFixed(1)}% Complete
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 backdrop-blur-lg border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-300" data-testid="text-gtt-rewards">
                  {totalGTT.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">GTT from Achievements</div>
              </div>
              <Gem className="w-8 h-8 text-purple-300" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 backdrop-blur-lg border-cyan-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-cyan-300" data-testid="text-truth-score">
                  {truthScore}
                </div>
                <div className="text-sm text-gray-400">Current Truth Score</div>
              </div>
              <Shield className="w-8 h-8 text-cyan-300" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Controls */}
      <Card className="bg-black/50 backdrop-blur-lg border-gray-600/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-300" />
            Achievement Gallery
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`transition-all ${
                  selectedCategory === category.id 
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white' 
                    : 'border-gray-600 text-gray-300 hover:border-gray-400'
                }`}
                data-testid={`category-filter-${category.id}`}
              >
                <category.icon className="w-4 h-4 mr-2" />
                {category.name}
              </Button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex gap-2">
            <span className="text-sm text-gray-400 flex items-center">Sort by:</span>
            {[
              { id: 'progress', name: 'Progress' },
              { id: 'rarity', name: 'Rarity' },
              { id: 'recent', name: 'Recent' }
            ].map((option) => (
              <Button
                key={option.id}
                variant={sortBy === option.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setSortBy(option.id as any)}
                className={sortBy === option.id ? 'bg-gray-700' : ''}
                data-testid={`sort-${option.id}`}
              >
                {option.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedAchievements.map((achievement) => {
          const IconComponent = achievement.icon;
          const CategoryIcon = categoryIcons[achievement.category];
          const progressPercentage = (achievement.progress / achievement.maxProgress) * 100;

          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card 
                className={`bg-black/50 backdrop-blur-lg border-2 transition-all duration-300 hover:scale-105 ${
                  achievement.unlocked 
                    ? `${rarityBorders[achievement.rarity]} shadow-lg` 
                    : 'border-gray-600/50'
                } ${achievement.unlocked ? 'opacity-100' : 'opacity-75'}`}
                data-testid={`achievement-${achievement.id}`}
              >
                <CardContent className="p-4 relative">
                  {/* Rarity Glow */}
                  {achievement.unlocked && (
                    <div className={`absolute inset-0 bg-gradient-to-br ${rarityColors[achievement.rarity]} opacity-10 rounded-lg`} />
                  )}

                  {/* Achievement Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${
                        achievement.unlocked 
                          ? `bg-gradient-to-br ${rarityColors[achievement.rarity]}` 
                          : 'bg-gray-700'
                      }`}>
                        {achievement.unlocked ? (
                          <IconComponent className="w-5 h-5 text-white" />
                        ) : (
                          <Lock className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <div className={`font-semibold ${achievement.unlocked ? 'text-white' : 'text-gray-400'}`}>
                          {achievement.name}
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            achievement.unlocked 
                              ? `border-${achievement.rarity === 'legendary' ? 'yellow' : achievement.rarity === 'epic' ? 'purple' : 'blue'}-500 text-${achievement.rarity === 'legendary' ? 'yellow' : achievement.rarity === 'epic' ? 'purple' : 'blue'}-300` 
                              : 'border-gray-600 text-gray-400'
                          }`}
                          data-testid={`badge-rarity-${achievement.rarity}`}
                        >
                          <CategoryIcon className="w-3 h-3 mr-1" />
                          {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    
                    {achievement.unlocked && (
                      <CheckCircle className="w-5 h-5 text-green-400" data-testid="icon-unlocked" />
                    )}
                  </div>

                  {/* Achievement Description */}
                  <p className={`text-sm mb-3 ${achievement.unlocked ? 'text-gray-300' : 'text-gray-500'}`}>
                    {achievement.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Progress</span>
                      <span data-testid={`progress-${achievement.id}`}>
                        {achievement.progress}/{achievement.maxProgress}
                      </span>
                    </div>
                    <Progress 
                      value={progressPercentage} 
                      className="h-2"
                      data-testid={`progress-bar-${achievement.id}`}
                    />
                  </div>

                  {/* Reward Information */}
                  {achievement.reward && (
                    <div className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg">
                      <Gift className="w-4 h-4 text-yellow-300" />
                      <span className="text-xs text-gray-300">
                        Reward: {achievement.reward.type === 'gtt' ? `${achievement.reward.value} GTT` : achievement.reward.value}
                      </span>
                    </div>
                  )}

                  {/* Unlock Date */}
                  {achievement.unlocked && achievement.unlockedAt && (
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                      <Calendar className="w-3 h-3" />
                      <span>Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Achievement Statistics */}
      <Card className="bg-black/50 backdrop-blur-lg border-gray-600/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-300" />
            Achievement Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            {Object.entries({
              common: achievements.filter(a => a.rarity === 'common' && a.unlocked).length,
              uncommon: achievements.filter(a => a.rarity === 'uncommon' && a.unlocked).length,
              rare: achievements.filter(a => a.rarity === 'rare' && a.unlocked).length,
              epic: achievements.filter(a => a.rarity === 'epic' && a.unlocked).length,
              legendary: achievements.filter(a => a.rarity === 'legendary' && a.unlocked).length
            }).map(([rarity, count]) => (
              <div key={rarity} className="p-3 bg-gray-800/50 rounded-lg">
                <div className={`text-lg font-bold ${
                  rarity === 'legendary' ? 'text-yellow-300' :
                  rarity === 'epic' ? 'text-purple-300' :
                  rarity === 'rare' ? 'text-blue-300' :
                  rarity === 'uncommon' ? 'text-green-300' :
                  'text-gray-300'
                }`} data-testid={`stat-${rarity}`}>
                  {count}
                </div>
                <div className="text-xs text-gray-400 capitalize">{rarity}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}