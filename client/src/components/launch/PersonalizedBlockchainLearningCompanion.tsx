import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Brain, 
  Trophy, 
  Target, 
  PlayCircle, 
  CheckCircle2, 
  Star,
  Lightbulb,
  TrendingUp,
  Award
} from 'lucide-react';

interface LearningModule {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  progress: number;
  completed: boolean;
  category: 'basics' | 'defi' | 'nft' | 'dao' | 'security';
  prerequisites?: string[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

export default function PersonalizedBlockchainLearningCompanion() {
  const [userLevel, setUserLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null);
  const [learningPath, setLearningPath] = useState<LearningModule[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [totalXP, setTotalXP] = useState(2450);
  const [streak, setStreak] = useState(7);

  const modules: LearningModule[] = [
    {
      id: 'blockchain-basics',
      title: 'Blockchain Fundamentals',
      description: 'Understanding the core concepts of blockchain technology',
      difficulty: 'beginner',
      duration: '30 min',
      progress: 100,
      completed: true,
      category: 'basics'
    },
    {
      id: 'smart-contracts',
      title: 'Smart Contracts Deep Dive',
      description: 'Learn how smart contracts work and their applications',
      difficulty: 'intermediate',
      duration: '45 min',
      progress: 75,
      completed: false,
      category: 'basics',
      prerequisites: ['blockchain-basics']
    },
    {
      id: 'defi-protocols',
      title: 'DeFi Protocols & Yield Farming',
      description: 'Explore decentralized finance and earning opportunities',
      difficulty: 'intermediate',
      duration: '60 min',
      progress: 30,
      completed: false,
      category: 'defi',
      prerequisites: ['smart-contracts']
    },
    {
      id: 'nft-ecosystem',
      title: 'NFT Ecosystem & Creation',
      description: 'Understanding NFTs and how to create them',
      difficulty: 'beginner',
      duration: '40 min',
      progress: 0,
      completed: false,
      category: 'nft'
    },
    {
      id: 'dao-governance',
      title: 'DAO Governance & Participation',
      description: 'Learn about decentralized autonomous organizations',
      difficulty: 'advanced',
      duration: '50 min',
      progress: 0,
      completed: false,
      category: 'dao',
      prerequisites: ['smart-contracts', 'defi-protocols']
    },
    {
      id: 'security-best-practices',
      title: 'Blockchain Security Best Practices',
      description: 'Protecting your assets and avoiding common pitfalls',
      difficulty: 'intermediate',
      duration: '35 min',
      progress: 60,
      completed: false,
      category: 'security'
    }
  ];

  const mockAchievements: Achievement[] = [
    {
      id: 'first-lesson',
      title: 'First Steps',
      description: 'Complete your first learning module',
      icon: PlayCircle,
      unlocked: true,
      progress: 1,
      maxProgress: 1
    },
    {
      id: 'streak-master',
      title: 'Streak Master',
      description: 'Maintain a 7-day learning streak',
      icon: TrendingUp,
      unlocked: true,
      progress: 7,
      maxProgress: 7
    },
    {
      id: 'defi-expert',
      title: 'DeFi Expert',
      description: 'Complete all DeFi-related modules',
      icon: Trophy,
      unlocked: false,
      progress: 1,
      maxProgress: 3
    },
    {
      id: 'security-conscious',
      title: 'Security Conscious',
      description: 'Master blockchain security practices',
      icon: Shield,
      unlocked: false,
      progress: 0,
      maxProgress: 1
    }
  ];

  useEffect(() => {
    setAchievements(mockAchievements);
    
    // Generate personalized learning path based on user level
    const recommendedModules = modules.filter(module => {
      if (userLevel === 'beginner') {
        return module.difficulty === 'beginner' || 
               (module.difficulty === 'intermediate' && module.prerequisites?.every(prereq => 
                 modules.find(m => m.id === prereq)?.completed
               ));
      }
      return true;
    }).slice(0, 4);
    
    setLearningPath(recommendedModules);
  }, [userLevel]);

  const getDifficultyColor = (difficulty: LearningModule['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
    }
  };

  const getCategoryIcon = (category: LearningModule['category']) => {
    switch (category) {
      case 'basics': return <BookOpen className="w-4 h-4" />;
      case 'defi': return <TrendingUp className="w-4 h-4" />;
      case 'nft': return <Star className="w-4 h-4" />;
      case 'dao': return <Target className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const startModule = (module: LearningModule) => {
    setSelectedModule(module);
    // In a real app, this would start the actual learning content
  };

  const calculateOverallProgress = () => {
    const totalModules = modules.length;
    const completedModules = modules.filter(m => m.completed).length;
    const progressSum = modules.reduce((sum, m) => sum + m.progress, 0);
    return Math.round(progressSum / (totalModules * 100) * 100);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Personalized Blockchain Learning Companion Chatbot
        </CardTitle>
        <CardDescription>
          AI-powered learning companion that adapts to your knowledge level and learning pace
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* User Progress Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-300">{totalXP}</div>
            <div className="text-xs text-purple-600 dark:text-purple-400">Total XP</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-300">{streak}</div>
            <div className="text-xs text-green-600 dark:text-green-400">Day Streak</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-300">
              {modules.filter(m => m.completed).length}
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400">Completed</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800 rounded-lg">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-300">
              {calculateOverallProgress()}%
            </div>
            <div className="text-xs text-orange-600 dark:text-orange-400">Progress</div>
          </div>
        </div>

        <Tabs defaultValue="learning" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="learning">Learning Path</TabsTrigger>
            <TabsTrigger value="modules">All Modules</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="learning" className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm font-medium">Your Level:</span>
              <div className="flex gap-2">
                {(['beginner', 'intermediate', 'advanced'] as const).map(level => (
                  <Button
                    key={level}
                    variant={userLevel === level ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setUserLevel(level)}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              {learningPath.map((module, index) => (
                <Card key={module.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-muted rounded-lg">
                        {getCategoryIcon(module.category)}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{module.title}</h3>
                          <Badge 
                            className={`text-white ${getDifficultyColor(module.difficulty)}`}
                            variant="secondary"
                          >
                            {module.difficulty}
                          </Badge>
                          {module.completed && (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{module.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{module.duration}</span>
                          <span>{module.progress}% complete</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Button
                        onClick={() => startModule(module)}
                        disabled={module.prerequisites?.some(prereq => 
                          !modules.find(m => m.id === prereq)?.completed
                        )}
                      >
                        {module.progress > 0 ? 'Continue' : 'Start'}
                      </Button>
                      <Progress value={module.progress} className="w-20 h-2" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="modules" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {modules.map(module => (
                <Card key={module.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(module.category)}
                        <h3 className="font-medium">{module.title}</h3>
                      </div>
                      <Badge 
                        className={`text-white ${getDifficultyColor(module.difficulty)}`}
                        variant="secondary"
                      >
                        {module.difficulty}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{module.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{module.duration}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={module.progress} className="w-16 h-2" />
                        <span className="text-xs">{module.progress}%</span>
                      </div>
                    </div>
                    
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => startModule(module)}
                    >
                      {module.completed ? 'Review' : module.progress > 0 ? 'Continue' : 'Start'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {achievements.map(achievement => (
                <Card key={achievement.id} className={`p-4 ${
                  achievement.unlocked ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20' : ''
                }`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${
                      achievement.unlocked ? 'bg-yellow-500 text-white' : 'bg-muted'
                    }`}>
                      <achievement.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{achievement.title}</h3>
                        {achievement.unlocked && (
                          <Award className="w-4 h-4 text-yellow-500" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={(achievement.progress / achievement.maxProgress) * 100} 
                          className="flex-1 h-2" 
                        />
                        <span className="text-xs text-muted-foreground">
                          {achievement.progress}/{achievement.maxProgress}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* AI Companion Chat Preview */}
        <div className="bg-muted p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary rounded-full">
              <Brain className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Learning Companion</div>
              <div className="text-sm text-muted-foreground">
                "Great progress on smart contracts! Based on your learning pattern, I recommend starting DeFi protocols next. You're showing strong understanding of the fundamentals. Would you like me to create a custom quiz to test your knowledge?"
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">Ask Question</Button>
                <Button size="sm" variant="outline">Get Recommendation</Button>
                <Button size="sm" variant="outline">Take Quiz</Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Shield({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      height="24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}