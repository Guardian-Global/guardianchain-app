import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Brain, TrendingUp, Sparkles, Target, RefreshCw, Star, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface RecommendationResult {
  capsuleId: number;
  score: number;
  reasoning: string;
  category: string;
  relevanceFactors: string[];
  capsule?: {
    id: number;
    title: string;
    content: string;
    category: string;
    tags: string[];
    verificationScore: number;
    engagement: {
      views: number;
      shares: number;
      verifications: number;
    };
    createdAt: string;
  };
}

interface UserProfile {
  interests: string[];
  preferredCategories: string[];
  behaviorPattern: string;
  recommendations: string[];
}

export default function RecommendationEngine() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { toast } = useToast();

  const { data: recommendations, refetch: refetchRecommendations, isLoading } = useQuery({
    queryKey: ['/api/recommendations'],
    enabled: false // We'll trigger manually
  });

  const { data: userProfile, refetch: refetchProfile } = useQuery({
    queryKey: ['/api/user-profile'],
    enabled: false
  });

  const generateRecommendations = async () => {
    setIsGenerating(true);
    try {
      await refetchRecommendations();
      toast({
        title: "Recommendations Updated",
        description: "AI has analyzed your preferences and found new relevant capsules",
      });
    } catch (error: any) {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate recommendations",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const analyzeProfile = async () => {
    try {
      await refetchProfile();
      toast({
        title: "Profile Updated",
        description: "Your interest profile has been refreshed based on recent activity",
      });
    } catch (error: any) {
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze profile",
        variant: "destructive"
      });
    }
  };

  const filteredRecommendations = recommendations?.filter((rec: RecommendationResult) => 
    selectedCategory === 'all' || rec.category.toLowerCase() === selectedCategory.toLowerCase()
  ) || [];

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Technology: 'bg-blue-600',
      Politics: 'bg-red-600',
      Environment: 'bg-green-600',
      Health: 'bg-purple-600',
      Science: 'bg-indigo-600',
      Social: 'bg-pink-600',
      Economics: 'bg-yellow-600',
      Culture: 'bg-orange-600',
      Legal: 'bg-gray-600',
      Education: 'bg-teal-600'
    };
    return colors[category] || 'bg-slate-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Brain className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <span className="text-white text-xl font-bold">AI Recommendation Engine</span>
              <p className="text-slate-400 text-sm font-normal">Personalized capsule discovery powered by AI</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={generateRecommendations}
              disabled={isGenerating || isLoading}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Get Recommendations
                </>
              )}
            </Button>
            
            <Button
              onClick={analyzeProfile}
              variant="outline"
              className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
            >
              <Target className="mr-2 h-4 w-4" />
              Analyze Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="recommendations" className="w-full">
        <TabsList className="grid grid-cols-2 w-full bg-slate-800 border-slate-700">
          <TabsTrigger value="recommendations" className="data-[state=active]:bg-purple-600">
            AI Recommendations
          </TabsTrigger>
          <TabsTrigger value="profile" className="data-[state=active]:bg-blue-600">
            Interest Profile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-6">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setSelectedCategory('all')}
            >
              All Categories
            </Badge>
            {['Technology', 'Politics', 'Environment', 'Health', 'Science', 'Social'].map(category => (
              <Badge
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* Recommendations Grid */}
          <div className="grid gap-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-purple-400" />
                <span className="ml-3 text-slate-400">Loading recommendations...</span>
              </div>
            ) : filteredRecommendations.length > 0 ? (
              filteredRecommendations.map((rec: RecommendationResult) => (
                <Card key={rec.capsuleId} className="bg-slate-800/50 border-slate-700 hover:border-purple-500 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">
                            {rec.capsule?.title || `Capsule #${rec.capsuleId}`}
                          </h3>
                          <Badge className={`${getCategoryColor(rec.category)} text-white`}>
                            {rec.category}
                          </Badge>
                        </div>
                        <p className="text-slate-300 text-sm mb-3">
                          {rec.capsule?.content.slice(0, 150)}...
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-400" />
                          <span className="text-yellow-400 font-bold">{rec.score}/100</span>
                        </div>
                        <Progress value={rec.score} className="w-20" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-white mb-2">Why recommended:</h4>
                        <p className="text-sm text-slate-400">{rec.reasoning}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-white mb-2">Relevance factors:</h4>
                        <div className="flex flex-wrap gap-1">
                          {rec.relevanceFactors.map((factor, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {factor}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {rec.capsule && (
                        <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                          <div className="flex items-center gap-4 text-xs text-slate-400">
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {rec.capsule.engagement.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              Score: {rec.capsule.verificationScore}
                            </span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
                          >
                            View Capsule
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-12 text-center">
                  <Brain className="h-16 w-16 text-slate-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No Recommendations Yet</h3>
                  <p className="text-slate-400 mb-4">
                    Click "Get Recommendations" to let AI analyze and suggest relevant capsules for you.
                  </p>
                  <Button
                    onClick={generateRecommendations}
                    disabled={isGenerating}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate First Recommendations
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          {userProfile ? (
            <div className="grid gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Your Interests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.interests?.map((interest: string, index: number) => (
                      <Badge key={index} className="bg-blue-600 text-white">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Preferred Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.preferredCategories?.map((category: string, index: number) => (
                      <Badge key={index} className={`${getCategoryColor(category)} text-white`}>
                        {category}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Behavior Pattern</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300">{userProfile.behaviorPattern}</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">AI Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {userProfile.recommendations?.map((suggestion: string, index: number) => (
                      <li key={index} className="text-slate-300 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full" />
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-12 text-center">
                <Target className="h-16 w-16 text-slate-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Profile Not Generated</h3>
                <p className="text-slate-400 mb-4">
                  Let AI analyze your activity to build a personalized interest profile.
                </p>
                <Button
                  onClick={analyzeProfile}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Target className="mr-2 h-4 w-4" />
                  Analyze My Profile
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}