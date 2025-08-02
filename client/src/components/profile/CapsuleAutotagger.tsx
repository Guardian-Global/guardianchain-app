import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Tag, 
  Heart, 
  TrendingUp, 
  Lightbulb,
  Loader2,
  Sparkles,
  Target,
  CheckCircle
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CapsuleAutotaggerProps {
  capsuleId: string;
  content: string;
  title: string;
  onTagsGenerated?: (insights: any) => void;
  autoAnalyze?: boolean;
  className?: string;
}

interface AIInsights {
  tags: string[];
  emotionalResonance: {
    score: number;
    emotions: string[];
    intensity: string;
  };
  truthLikelihood: {
    score: number;
    factors: string[];
    confidence: string;
  };
  contentClassification: {
    category: string;
    subcategory: string;
    sensitivity: string;
  };
  keyThemes: string[];
  recommendedActions: string[];
}

export default function CapsuleAutotagger({
  capsuleId,
  content,
  title,
  onTagsGenerated,
  autoAnalyze = false,
  className = ""
}: CapsuleAutotaggerProps) {
  const { toast } = useToast();
  const [insights, setInsights] = useState<AIInsights | null>(null);
  const [analysisStep, setAnalysisStep] = useState<'ready' | 'analyzing' | 'complete'>('ready');

  const analyzeContentMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/ai/analyze-capsule", {
        capsuleId,
        content,
        title,
        includeEmotionalAnalysis: true,
        includeTruthAssessment: true,
        generateTags: true
      });
    },
    onSuccess: (data: AIInsights) => {
      setInsights(data);
      setAnalysisStep('complete');
      onTagsGenerated?.(data);
      
      toast({
        title: "Analysis Complete",
        description: `Generated ${data.tags.length} tags and insights`,
      });
    },
    onError: (error: any) => {
      setAnalysisStep('ready');
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze content",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (autoAnalyze && content.length > 10 && title.length > 3) {
      handleAnalyze();
    }
  }, [autoAnalyze, content, title]);

  const handleAnalyze = () => {
    setAnalysisStep('analyzing');
    analyzeContentMutation.mutate();
  };

  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      joy: "bg-yellow-100 text-yellow-800",
      sadness: "bg-blue-100 text-blue-800",
      anger: "bg-red-100 text-red-800",
      fear: "bg-purple-100 text-purple-800",
      trust: "bg-green-100 text-green-800",
      surprise: "bg-pink-100 text-pink-800",
      neutral: "bg-gray-100 text-gray-800"
    };
    return colors[emotion] || "bg-gray-100 text-gray-800";
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          AI Content Analysis
          {analysisStep === 'complete' && (
            <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {analysisStep === 'ready' && (
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Get AI-powered insights, auto-generated tags, and content analysis
            </p>
            <Button 
              onClick={handleAnalyze}
              disabled={!content || !title}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Analyze Content
            </Button>
          </div>
        )}

        {analysisStep === 'analyzing' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Analyzing content with AI...</span>
            </div>
            <Progress value={50} className="w-full" />
            <div className="text-xs text-muted-foreground text-center">
              This may take a few moments
            </div>
          </div>
        )}

        {analysisStep === 'complete' && insights && (
          <div className="space-y-6">
            {/* Auto-Generated Tags */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4" />
                <span className="font-medium">Auto-Generated Tags</span>
                <Badge variant="secondary">{insights.tags.length}</Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {insights.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Emotional Analysis */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Heart className="w-4 h-4" />
                <span className="font-medium">Emotional Resonance</span>
                <Badge 
                  variant="secondary" 
                  className={getScoreColor(insights.emotionalResonance.score)}
                >
                  {insights.emotionalResonance.score}/100
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {insights.emotionalResonance.emotions.map((emotion, index) => (
                    <Badge 
                      key={index} 
                      className={getEmotionColor(emotion)}
                    >
                      {emotion}
                    </Badge>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground">
                  Intensity: {insights.emotionalResonance.intensity}
                </div>
              </div>
            </div>

            {/* Truth Assessment */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4" />
                <span className="font-medium">Truth Likelihood</span>
                <Badge 
                  variant="secondary"
                  className={getScoreColor(insights.truthLikelihood.score)}
                >
                  {insights.truthLikelihood.score}/100
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">
                  Confidence: {insights.truthLikelihood.confidence}
                </div>
                <ul className="text-xs space-y-1">
                  {insights.truthLikelihood.factors.map((factor, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-green-500 rounded-full" />
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Key Themes */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4" />
                <span className="font-medium">Key Themes</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {insights.keyThemes.map((theme, index) => (
                  <Badge key={index} variant="secondary">
                    {theme}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Content Classification */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4" />
                <span className="font-medium">Content Classification</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Category:</span>
                  <div className="font-medium">{insights.contentClassification.category}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <div className="font-medium">{insights.contentClassification.subcategory}</div>
                </div>
              </div>
            </div>

            {/* Recommended Actions */}
            {insights.recommendedActions.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4" />
                  <span className="font-medium">Recommendations</span>
                </div>
                <ul className="text-xs space-y-1">
                  {insights.recommendedActions.map((action, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-blue-500 rounded-full" />
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}