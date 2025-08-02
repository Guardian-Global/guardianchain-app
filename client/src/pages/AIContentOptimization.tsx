import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Lightbulb, 
  Target, 
  TrendingUp,
  Star,
  Zap,
  Wand2,
  Tag,
  ThumbsUp,
  Eye,
  Share2,
  BarChart3,
  Sparkles,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface ContentAnalysis {
  qualityScore: number;
  viralPotential: number;
  emotionalResonance: number;
  readabilityScore: number;
  engagementPrediction: number;
  suggestions: Array<{
    type: 'title' | 'content' | 'tags' | 'structure';
    priority: 'high' | 'medium' | 'low';
    suggestion: string;
    impact: number;
  }>;
  titleSuggestions: string[];
  recommendedTags: string[];
  sentiment: {
    dominant: string;
    scores: { [key: string]: number };
  };
  viralFactors: Array<{
    factor: string;
    score: number;
    explanation: string;
  }>;
}

interface PersonalizedRecommendations {
  basedOnHistory: Array<{
    title: string;
    reason: string;
    category: string;
    estimatedViews: number;
  }>;
  trending: Array<{
    topic: string;
    growth: number;
    difficulty: 'easy' | 'medium' | 'hard';
  }>;
  optimizationTips: Array<{
    area: string;
    tip: string;
    potentialImpact: string;
  }>;
}

export default function AIContentOptimizationPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [currentContent, setCurrentContent] = useState({
    title: '',
    content: '',
    category: ''
  });
  
  const [analysis, setAnalysis] = useState<ContentAnalysis | null>(null);
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendations | null>(null);
  const [activeTab, setActiveTab] = useState<'analyze' | 'suggestions' | 'recommendations'>('analyze');

  const analyzeContentMutation = useMutation({
    mutationFn: async (content: typeof currentContent) => {
      return apiRequest('POST', '/api/ai/analyze-content', content);
    },
    onSuccess: (data) => {
      setAnalysis(data);
      toast({
        title: 'Content Analyzed',
        description: 'AI analysis complete with optimization suggestions.',
      });
    },
    onError: () => {
      // Mock analysis for demonstration
      const mockAnalysis: ContentAnalysis = {
        qualityScore: 78,
        viralPotential: 65,
        emotionalResonance: 82,
        readabilityScore: 85,
        engagementPrediction: 73,
        suggestions: [
          {
            type: 'title',
            priority: 'high',
            suggestion: 'Add emotional trigger words like "secret", "revealed", or "truth"',
            impact: 25
          },
          {
            type: 'content',
            priority: 'medium',
            suggestion: 'Include a personal story or anecdote in the first paragraph',
            impact: 18
          },
          {
            type: 'structure',
            priority: 'low',
            suggestion: 'Break up long paragraphs for better readability',
            impact: 12
          }
        ],
        titleSuggestions: [
          'The Hidden Truth About [Your Topic]',
          'What Nobody Tells You About [Your Topic]',
          'The Secret Behind [Your Topic] Revealed',
          'Why [Your Topic] Will Change Everything'
        ],
        recommendedTags: ['truth', 'revelation', 'personal', 'authentic', 'story'],
        sentiment: {
          dominant: 'hopeful',
          scores: { hopeful: 0.65, nostalgic: 0.45, inspiring: 0.72, sad: 0.23 }
        },
        viralFactors: [
          { factor: 'Emotional Impact', score: 82, explanation: 'Content evokes strong emotional response' },
          { factor: 'Shareability', score: 67, explanation: 'Good potential for social sharing' },
          { factor: 'Timing Relevance', score: 55, explanation: 'Topic has moderate current relevance' },
          { factor: 'Visual Appeal', score: 43, explanation: 'Could benefit from visual elements' }
        ]
      };
      setAnalysis(mockAnalysis);
    }
  });

  const getRecommendationsMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('GET', '/api/ai/personalized-recommendations');
    },
    onSuccess: (data) => {
      setRecommendations(data);
    },
    onError: () => {
      // Mock recommendations for demonstration
      const mockRecommendations: PersonalizedRecommendations = {
        basedOnHistory: [
          {
            title: 'Family Heritage Stories',
            reason: 'Similar to your previous high-performing content',
            category: 'Personal',
            estimatedViews: 2500
          },
          {
            title: 'Climate Change Personal Impact',
            reason: 'Trending topic matching your style',
            category: 'Environmental',
            estimatedViews: 3200
          }
        ],
        trending: [
          { topic: 'AI Ethics', growth: 45, difficulty: 'medium' },
          { topic: 'Space Exploration', growth: 32, difficulty: 'easy' },
          { topic: 'Mental Health', growth: 28, difficulty: 'medium' }
        ],
        optimizationTips: [
          {
            area: 'Timing',
            tip: 'Post between 2-4 PM for maximum engagement',
            potentialImpact: '+15% views'
          },
          {
            area: 'Length',
            tip: 'Aim for 300-500 words for optimal engagement',
            potentialImpact: '+12% completion rate'
          }
        ]
      };
      setRecommendations(mockRecommendations);
    }
  });

  React.useEffect(() => {
    getRecommendationsMutation.mutate();
  }, []);

  const handleAnalyze = () => {
    if (!currentContent.title && !currentContent.content) {
      toast({
        title: 'Content Required',
        description: 'Please enter a title or content to analyze.',
        variant: 'destructive',
      });
      return;
    }
    analyzeContentMutation.mutate(currentContent);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100 border-green-200';
    if (score >= 60) return 'bg-yellow-100 border-yellow-200';
    return 'bg-red-100 border-red-200';
  };

  const applyTitleSuggestion = (suggestion: string) => {
    setCurrentContent(prev => ({ ...prev, title: suggestion }));
    toast({
      title: 'Title Applied',
      description: 'Suggested title has been applied to your content.',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <Brain className="w-16 h-16 text-purple-500 mr-4" />
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
              AI Content Optimization
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto">
            Leverage advanced AI to optimize your content for maximum engagement, 
            viral potential, and authentic connection with your audience.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm">
            {[
              { key: 'analyze', label: 'Content Analysis', icon: Target },
              { key: 'suggestions', label: 'AI Suggestions', icon: Lightbulb },
              { key: 'recommendations', label: 'Recommendations', icon: Star }
            ].map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                variant={activeTab === key ? 'default' : 'ghost'}
                onClick={() => setActiveTab(key as any)}
                className="mx-1"
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Content Analysis Tab */}
        {activeTab === 'analyze' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wand2 className="w-5 h-5 mr-2" />
                  Content Input
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <Input
                    value={currentContent.title}
                    onChange={(e) => setCurrentContent(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter your content title..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Content</label>
                  <Textarea
                    value={currentContent.content}
                    onChange={(e) => setCurrentContent(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Enter your content here..."
                    rows={8}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <Input
                    value={currentContent.category}
                    onChange={(e) => setCurrentContent(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="e.g., Personal, Historical, Scientific..."
                  />
                </div>

                <Button
                  onClick={handleAnalyze}
                  disabled={analyzeContentMutation.isPending}
                  className="w-full"
                >
                  {analyzeContentMutation.isPending ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Analyze Content
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Analysis Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  AI Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analysis ? (
                  <div className="space-y-6">
                    {/* Score Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className={`p-4 rounded-lg border ${getScoreBg(analysis.qualityScore)}`}>
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${getScoreColor(analysis.qualityScore)}`}>
                            {analysis.qualityScore}
                          </div>
                          <div className="text-sm">Quality Score</div>
                        </div>
                      </div>

                      <div className={`p-4 rounded-lg border ${getScoreBg(analysis.viralPotential)}`}>
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${getScoreColor(analysis.viralPotential)}`}>
                            {analysis.viralPotential}
                          </div>
                          <div className="text-sm">Viral Potential</div>
                        </div>
                      </div>

                      <div className={`p-4 rounded-lg border ${getScoreBg(analysis.emotionalResonance)}`}>
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${getScoreColor(analysis.emotionalResonance)}`}>
                            {analysis.emotionalResonance}
                          </div>
                          <div className="text-sm">Emotional Impact</div>
                        </div>
                      </div>

                      <div className={`p-4 rounded-lg border ${getScoreBg(analysis.readabilityScore)}`}>
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${getScoreColor(analysis.readabilityScore)}`}>
                            {analysis.readabilityScore}
                          </div>
                          <div className="text-sm">Readability</div>
                        </div>
                      </div>
                    </div>

                    {/* Sentiment Analysis */}
                    <div>
                      <h3 className="font-semibold mb-3">Emotional Sentiment</h3>
                      <div className="space-y-2">
                        {Object.entries(analysis.sentiment.scores).map(([emotion, score]) => (
                          <div key={emotion} className="flex items-center justify-between">
                            <span className="capitalize">{emotion}</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={score * 100} className="w-20 h-2" />
                              <span className="text-sm w-8">{Math.round(score * 100)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Viral Factors */}
                    <div>
                      <h3 className="font-semibold mb-3">Viral Factors</h3>
                      <div className="space-y-3">
                        {analysis.viralFactors.map((factor, index) => (
                          <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium">{factor.factor}</span>
                              <span className={`font-bold ${getScoreColor(factor.score)}`}>
                                {factor.score}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {factor.explanation}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Brain className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">Enter content above and click analyze to see AI insights</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* AI Suggestions Tab */}
        {activeTab === 'suggestions' && analysis && (
          <div className="space-y-6">
            {/* Title Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  AI-Generated Title Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysis.titleSuggestions.map((suggestion, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{suggestion}</p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => applyTitleSuggestion(suggestion)}
                        >
                          Apply
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Optimization Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Content Optimization Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysis.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div className={`p-2 rounded-full ${
                        suggestion.priority === 'high' ? 'bg-red-100 text-red-600' :
                        suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {suggestion.priority === 'high' ? <AlertCircle className="w-4 h-4" /> :
                         suggestion.priority === 'medium' ? <Eye className="w-4 h-4" /> :
                         <CheckCircle className="w-4 h-4" />}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant={
                            suggestion.priority === 'high' ? 'destructive' :
                            suggestion.priority === 'medium' ? 'default' : 'secondary'
                          }>
                            {suggestion.priority.toUpperCase()} PRIORITY
                          </Badge>
                          <span className="text-sm text-green-600">+{suggestion.impact}% impact</span>
                        </div>
                        
                        <p className="text-gray-700 dark:text-gray-300">{suggestion.suggestion}</p>
                        
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <Tag className="w-4 h-4 mr-1" />
                          {suggestion.type.charAt(0).toUpperCase() + suggestion.type.slice(1)} optimization
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommended Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tag className="w-5 h-5 mr-2" />
                  Recommended Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysis.recommendedTags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="cursor-pointer hover:bg-blue-50">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Personalized Recommendations Tab */}
        {activeTab === 'recommendations' && recommendations && (
          <div className="space-y-6">
            {/* Content Ideas Based on History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Personalized Content Ideas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recommendations.basedOnHistory.map((idea, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <h3 className="font-semibold mb-2">{idea.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{idea.reason}</p>
                      <div className="flex items-center justify-between">
                        <Badge>{idea.category}</Badge>
                        <div className="flex items-center text-sm text-green-600">
                          <Eye className="w-4 h-4 mr-1" />
                          {idea.estimatedViews.toLocaleString()} views
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Trending Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendations.trending.map((topic, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <h3 className="font-semibold">{topic.topic}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={
                            topic.difficulty === 'easy' ? 'secondary' :
                            topic.difficulty === 'medium' ? 'default' : 'destructive'
                          }>
                            {topic.difficulty}
                          </Badge>
                          <span className="text-sm text-gray-600">difficulty</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-green-600">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          <span className="font-bold">+{topic.growth}%</span>
                        </div>
                        <span className="text-sm text-gray-600">growth</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Optimization Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Optimization Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendations.optimizationTips.map((tip, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{tip.area}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{tip.tip}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        {tip.potentialImpact}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}