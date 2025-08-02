import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Brain, 
  Target, 
  TrendingUp, 
  BookOpen,
  Compass,
  Star,
  Zap,
  Crown,
  Heart,
  Shield,
  Coins
} from 'lucide-react';

interface UserPersonality {
  traits: {
    explorer: number;     // Likes discovering new features
    creator: number;      // Enjoys creating content
    social: number;       // Engages with community
    analytical: number;   // Studies data and metrics
    collector: number;    // Accumulates assets/achievements
  };
  preferences: {
    contentTypes: string[];
    activityTimes: string[];
    engagementStyle: 'guided' | 'independent' | 'social';
    riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  };
  journey: {
    stage: 'newcomer' | 'explorer' | 'creator' | 'expert' | 'guardian';
    completedActions: string[];
    skillLevels: Record<string, number>;
    interests: string[];
  };
}

interface PersonalizedRecommendation {
  id: string;
  title: string;
  description: string;
  action: {
    label: string;
    path: string;
  };
  priority: number;
  reasoning: string;
  category: 'next_step' | 'optimization' | 'exploration' | 'social' | 'earning';
  estimatedValue: string;
  timeToComplete: string;
}

export default function PersonalizationEngine() {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [personality, setPersonality] = useState<UserPersonality | null>(null);
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendation[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  // Initialize personality profiling
  useEffect(() => {
    if (!isAuthenticated) return;

    const initializePersonality = async () => {
      try {
        const response = await apiRequest('GET', '/api/personalization/profile');
        const data = await response.json();
        setPersonality(data.personality);
        generateRecommendations(data.personality);
      } catch (error) {
        // Initialize with default personality if API fails
        const defaultPersonality: UserPersonality = {
          traits: {
            explorer: 70,
            creator: 60,
            social: 50,
            analytical: 40,
            collector: 30
          },
          preferences: {
            contentTypes: ['personal_memory', 'wisdom'],
            activityTimes: ['evening'],
            engagementStyle: 'guided',
            riskTolerance: 'moderate'
          },
          journey: {
            stage: 'newcomer',
            completedActions: [],
            skillLevels: {},
            interests: []
          }
        };
        setPersonality(defaultPersonality);
        generateRecommendations(defaultPersonality);
      }
    };

    initializePersonality();
  }, [isAuthenticated]);

  // Track user behavior to update personality
  useEffect(() => {
    if (!isAuthenticated || !personality) return;

    const trackBehavior = async () => {
      try {
        await apiRequest('POST', '/api/personalization/track', {
          action: 'page_visit',
          path: location,
          timestamp: Date.now(),
          sessionData: {
            timeSpent: Math.random() * 120, // Mock time spent
            interactions: Math.floor(Math.random() * 10)
          }
        });
      } catch (error) {
        console.error('Failed to track behavior:', error);
      }
    };

    trackBehavior();
  }, [location, isAuthenticated, personality]);

  const generateRecommendations = (userPersonality: UserPersonality) => {
    const recs: PersonalizedRecommendation[] = [];

    // Explorer trait recommendations
    if (userPersonality.traits.explorer > 60) {
      recs.push({
        id: 'explore_guardian_map',
        title: 'Discover Global Guardian Network',
        description: 'Explore the interactive map to find Guardians in your area and see their reputation levels.',
        action: { label: 'Explore Map', path: '/guardian-map' },
        priority: 85,
        reasoning: 'High explorer trait detected - you love discovering new features',
        category: 'exploration',
        estimatedValue: '10-25 GTT',
        timeToComplete: '5 mins'
      });
    }

    // Creator trait recommendations
    if (userPersonality.traits.creator > 60) {
      recs.push({
        id: 'create_eternal_contract',
        title: 'Create Your Digital Legacy',
        description: 'Craft an eternal contract that will preserve your wishes and wisdom forever.',
        action: { label: 'Start Creating', path: '/eternal-contracts' },
        priority: 90,
        reasoning: 'Strong creator trait - you enjoy building lasting content',
        category: 'next_step',
        estimatedValue: '50-150 GTT',
        timeToComplete: '15 mins'
      });
    }

    // Analytical trait recommendations
    if (userPersonality.traits.analytical > 60) {
      recs.push({
        id: 'optimize_yield_strategy',
        title: 'Analyze Your Yield Performance',
        description: 'Deep dive into your capsule performance metrics and optimize your earning strategy.',
        action: { label: 'View Analytics', path: '/dashboard/yield' },
        priority: 80,
        reasoning: 'High analytical trait - you appreciate data-driven insights',
        category: 'optimization',
        estimatedValue: '20-40% yield increase',
        timeToComplete: '10 mins'
      });
    }

    // Social trait recommendations
    if (userPersonality.traits.social > 60) {
      recs.push({
        id: 'join_dao_governance',
        title: 'Participate in DAO Voting',
        description: 'Use your GTT voting power to shape the future of GuardianChain governance.',
        action: { label: 'View Proposals', path: '/dao' },
        priority: 75,
        reasoning: 'Strong social engagement - you like community participation',
        category: 'social',
        estimatedValue: 'Governance rewards',
        timeToComplete: '8 mins'
      });
    }

    // Journey stage-based recommendations
    if (userPersonality.journey.stage === 'newcomer') {
      recs.push({
        id: 'first_capsule_bonus',
        title: 'Create Your First Truth Capsule',
        description: 'New users get 2x grief scoring bonus on their first capsule. Start your truth journey!',
        action: { label: 'Create Capsule', path: '/create' },
        priority: 100,
        reasoning: 'Newcomer bonus available - maximize your first capsule value',
        category: 'next_step',
        estimatedValue: '100-300 GTT',
        timeToComplete: '12 mins'
      });
    }

    // Risk tolerance recommendations
    if (userPersonality.preferences.riskTolerance === 'aggressive') {
      recs.push({
        id: 'high_yield_staking',
        title: 'High-Yield Staking Opportunity',
        description: 'Lock your GTT for 100 days and earn up to 25% APY with sovereignty tier benefits.',
        action: { label: 'Stake Tokens', path: '/dashboard/yield' },
        priority: 70,
        reasoning: 'Aggressive risk tolerance - you\'re open to high-reward opportunities',
        category: 'earning',
        estimatedValue: '25% APY',
        timeToComplete: '5 mins'
      });
    }

    // Sort by priority and take top 3
    recs.sort((a, b) => b.priority - a.priority);
    setRecommendations(recs.slice(0, 3));
  };

  const getCategoryIcon = (category: PersonalizedRecommendation['category']) => {
    switch (category) {
      case 'next_step': return <Target className="h-4 w-4 text-brand-primary" />;
      case 'optimization': return <TrendingUp className="h-4 w-4 text-brand-accent" />;
      case 'exploration': return <Compass className="h-4 w-4 text-blue-400" />;
      case 'social': return <Heart className="h-4 w-4 text-pink-400" />;
      case 'earning': return <Coins className="h-4 w-4 text-green-400" />;
      default: return <Star className="h-4 w-4 text-slate-400" />;
    }
  };

  const getTraitIcon = (trait: string) => {
    switch (trait) {
      case 'explorer': return <Compass className="h-3 w-3" />;
      case 'creator': return <Brain className="h-3 w-3" />;
      case 'social': return <Heart className="h-3 w-3" />;
      case 'analytical': return <TrendingUp className="h-3 w-3" />;
      case 'collector': return <Star className="h-3 w-3" />;
      default: return <User className="h-3 w-3" />;
    }
  };

  if (!isAuthenticated || !personality) return null;

  return (
    <>
      {/* Personalization Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsVisible(!isVisible)}
        className="relative"
      >
        <Brain className="h-4 w-4" />
        {recommendations.length > 0 && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-brand-accent rounded-full" />
        )}
      </Button>

      {/* Personalization Panel */}
      {isVisible && (
        <Card className="absolute top-full right-0 mt-2 w-96 z-50 bg-slate-800/95 border-slate-700 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2 text-sm">
              <Brain className="h-4 w-4 text-brand-primary" />
              Your Guardian Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Personality Traits */}
            <div>
              <h4 className="text-white text-xs font-medium mb-2">Personality Traits</h4>
              <div className="grid grid-cols-5 gap-1">
                {Object.entries(personality.traits).map(([trait, value]) => (
                  <div key={trait} className="text-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                      value > 70 ? 'bg-brand-accent/20 text-brand-accent' :
                      value > 50 ? 'bg-brand-primary/20 text-brand-primary' :
                      'bg-slate-700/50 text-slate-400'
                    }`}>
                      {getTraitIcon(trait)}
                    </div>
                    <div className="text-xs text-slate-400 capitalize">{trait}</div>
                    <div className="text-xs font-medium text-white">{value}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Journey Progress */}
            <div>
              <h4 className="text-white text-xs font-medium mb-2">Guardian Journey</h4>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-brand-primary/20 text-brand-primary capitalize">
                  {personality.journey.stage}
                </Badge>
                <span className="text-slate-400 text-xs">
                  {personality.journey.completedActions.length} actions completed
                </span>
              </div>
              <Progress value={(personality.journey.completedActions.length / 10) * 100} className="h-1" />
            </div>

            {/* Personalized Recommendations */}
            <div>
              <h4 className="text-white text-xs font-medium mb-2">Recommended for You</h4>
              <div className="space-y-2">
                {recommendations.map((rec) => (
                  <div key={rec.id} className="bg-slate-700/30 p-3 rounded border-l-2 border-brand-primary/50">
                    <div className="flex items-start gap-2 mb-2">
                      {getCategoryIcon(rec.category)}
                      <div className="flex-1">
                        <h5 className="text-white text-xs font-medium leading-tight">{rec.title}</h5>
                        <p className="text-slate-300 text-xs leading-relaxed mt-1">{rec.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex gap-2">
                        <Badge className="bg-green-500/20 text-green-400">{rec.estimatedValue}</Badge>
                        <Badge className="bg-blue-500/20 text-blue-400">{rec.timeToComplete}</Badge>
                      </div>
                      <Button
                        size="sm"
                        className="h-6 text-xs bg-brand-primary hover:bg-brand-primary/90"
                        onClick={() => window.location.href = rec.action.path}
                      >
                        {rec.action.label}
                      </Button>
                    </div>
                    <div className="text-slate-500 text-xs mt-1 italic">{rec.reasoning}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}