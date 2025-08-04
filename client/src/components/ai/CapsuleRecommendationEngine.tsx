import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  Users, 
  Clock, 
  Star, 
  Zap,
  Target,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';

interface RecommendedCapsule {
  id: string;
  title: string;
  description: string;
  author: string;
  truthScore: number;
  matchScore: number;
  reasonForRecommendation: string;
  tags: string[];
  estimatedReadTime: number;
  category: string;
  createdAt: string;
}

interface RecommendationData {
  personalizedCapsules: RecommendedCapsule[];
  trendingCapsules: RecommendedCapsule[];
  similarInterests: RecommendedCapsule[];
  aiInsights: {
    userPersonality: string;
    preferredTopics: string[];
    optimalEngagementTime: string;
    recommendationConfidence: number;
  };
}

export function CapsuleRecommendationEngine() {
  const [activeTab, setActiveTab] = useState<'personalized' | 'trending' | 'similar'>('personalized');
  const [refreshing, setRefreshing] = useState(false);

  const { data: recommendations, isLoading, refetch } = useQuery<RecommendationData>({
    queryKey: ['/api/ai/capsule-recommendations'],
    staleTime: 300000, // 5 minutes
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'truth': 'text-[#00ffe1] border-[#00ffe1]',
      'legacy': 'text-[#ff00d4] border-[#ff00d4]',
      'testimony': 'text-[#7c3aed] border-[#7c3aed]',
      'evidence': 'text-[#f59e0b] border-[#f59e0b]',
      'personal': 'text-[#10b981] border-[#10b981]',
    };
    return colors[category as keyof typeof colors] || 'text-[#8b949e] border-[#8b949e]';
  };

  const getRecommendationSource = (tab: string) => {
    switch (tab) {
      case 'personalized': return recommendations?.personalizedCapsules || [];
      case 'trending': return recommendations?.trendingCapsules || [];
      case 'similar': return recommendations?.similarInterests || [];
      default: return [];
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-[#161b22] border-[#30363d]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#f0f6fc]">
            <Brain className="w-5 h-5 text-[#00ffe1]" />
            Loading AI Recommendations...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-[#21262d] rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Insights Panel */}
      {recommendations?.aiInsights && (
        <Card className="bg-gradient-to-r from-[#161b22] to-[#0d1117] border-[#30363d]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#f0f6fc]">
              <Sparkles className="w-5 h-5 text-[#7c3aed]" />
              AI Personality Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="text-sm text-[#8b949e]">Your Truth Profile</div>
                <div className="text-[#f0f6fc] font-medium">
                  {recommendations.aiInsights.userPersonality}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-[#8b949e]">Optimal Engagement</div>
                <div className="text-[#00ffe1] font-medium">
                  {recommendations.aiInsights.optimalEngagementTime}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-[#8b949e]">Recommendation Confidence</div>
                <div className="flex items-center gap-2">
                  <Progress 
                    value={recommendations.aiInsights.recommendationConfidence} 
                    className="flex-1 h-2"
                  />
                  <span className="text-[#f0f6fc] text-sm">
                    {recommendations.aiInsights.recommendationConfidence}%
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-[#8b949e] mb-2">Preferred Topics</div>
              <div className="flex flex-wrap gap-2">
                {recommendations.aiInsights.preferredTopics.map((topic) => (
                  <Badge 
                    key={topic} 
                    variant="outline" 
                    className="border-[#7c3aed] text-[#7c3aed]"
                  >
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Recommendation Panel */}
      <Card className="bg-[#161b22] border-[#30363d]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-[#f0f6fc]">
              <Brain className="w-5 h-5 text-[#00ffe1]" />
              AI-Powered Capsule Recommendations
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="border-[#30363d] text-[#8b949e] hover:text-[#f0f6fc]"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex gap-2 mt-4">
            <Button
              variant={activeTab === 'personalized' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('personalized')}
              className={activeTab === 'personalized' ? 
                'bg-[#00ffe1] text-[#0d1117]' : 
                'border-[#30363d] text-[#8b949e] hover:text-[#f0f6fc]'
              }
            >
              <Target className="w-4 h-4 mr-2" />
              For You
            </Button>
            <Button
              variant={activeTab === 'trending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('trending')}
              className={activeTab === 'trending' ? 
                'bg-[#ff00d4] text-[#0d1117]' : 
                'border-[#30363d] text-[#8b949e] hover:text-[#f0f6fc]'
              }
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Trending
            </Button>
            <Button
              variant={activeTab === 'similar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('similar')}
              className={activeTab === 'similar' ? 
                'bg-[#7c3aed] text-white' : 
                'border-[#30363d] text-[#8b949e] hover:text-[#f0f6fc]'
              }
            >
              <Users className="w-4 h-4 mr-2" />
              Similar Interests
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {getRecommendationSource(activeTab).map((capsule, index) => (
                <motion.div
                  key={capsule.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-[#21262d] rounded-lg border border-[#30363d] hover:border-[#00ffe1]/50 transition-colors group cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-[#f0f6fc] group-hover:text-[#00ffe1] transition-colors">
                          {capsule.title}
                        </h4>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getCategoryColor(capsule.category)}`}
                        >
                          {capsule.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-[#8b949e] mb-2 line-clamp-2">
                        {capsule.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-[#8b949e]">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {capsule.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {capsule.estimatedReadTime}min
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          {capsule.truthScore}/100
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-[#00ffe1] mb-1">
                        <Zap className="w-4 h-4" />
                        <span className="font-bold">{capsule.matchScore}%</span>
                      </div>
                      <div className="text-xs text-[#8b949e]">match</div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="text-xs text-[#7c3aed] mb-1">AI Insight:</div>
                    <div className="text-sm text-[#8b949e] italic">
                      {capsule.reasonForRecommendation}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {capsule.tags.slice(0, 3).map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="outline" 
                          className="text-xs border-[#30363d] text-[#8b949e]"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      size="sm"
                      className="bg-[#00ffe1] text-[#0d1117] hover:bg-[#00e5cb]"
                    >
                      View Capsule
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}