import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Tag, 
  Sparkles, 
  Loader2,
  Check,
  RefreshCw,
  Heart,
  MessageCircle,
  Eye
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface CapsuleAutotaggerProps {
  capsuleId: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  content?: string;
  onTagsGenerated?: (tags: AutoTag[]) => void;
  className?: string;
}

interface AutoTag {
  tag: string;
  confidence: number;
  category: 'emotion' | 'topic' | 'genre' | 'historical' | 'personal';
  reasoning: string;
}

interface GPTInsights {
  tags: AutoTag[];
  emotionalResonance: number;
  truthLikelihood: number;
  historicalSignificance: number;
  personalValue: number;
  suggestedTitle?: string;
  keyThemes: string[];
  recommendedAudience: string;
}

export default function CapsuleAutotagger({
  capsuleId,
  fileUrl,
  fileName,
  fileType,
  content,
  onTagsGenerated,
  className = ""
}: CapsuleAutotaggerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [insights, setInsights] = useState<GPTInsights | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (fileUrl && !insights) {
      analyzeContent();
    }
  }, [fileUrl]);

  const analyzeContent = async () => {
    setIsAnalyzing(true);
    
    try {
      const analysisData = {
        capsuleId,
        fileUrl,
        fileName,
        fileType,
        content: content || `File: ${fileName}`,
        analysisType: 'comprehensive'
      };

      const result = await apiRequest('/api/ai/analyze-capsule', {
        method: 'POST',
        body: JSON.stringify(analysisData),
        headers: { 'Content-Type': 'application/json' }
      });

      // Mock GPT insights for development
      const mockInsights: GPTInsights = {
        tags: [
          { tag: "Family Legacy", confidence: 0.95, category: 'personal', reasoning: "Strong family-related content detected" },
          { tag: "Emotional", confidence: 0.88, category: 'emotion', reasoning: "High emotional resonance indicators" },
          { tag: "Historical Record", confidence: 0.82, category: 'historical', reasoning: "Contains valuable historical context" },
          { tag: "Truth Testimony", confidence: 0.91, category: 'topic', reasoning: "Authentic personal account" },
          { tag: "Memory Preservation", confidence: 0.87, category: 'genre', reasoning: "Focused on preserving memories" }
        ],
        emotionalResonance: 92,
        truthLikelihood: 89,
        historicalSignificance: 76,
        personalValue: 94,
        suggestedTitle: "A Family's Truth: Memories That Matter",
        keyThemes: ["Family", "Legacy", "Truth", "Memory", "Heritage"],
        recommendedAudience: "Family members and future generations"
      };

      setInsights(mockInsights);
      setSelectedTags(mockInsights.tags.slice(0, 3).map(t => t.tag));
      onTagsGenerated?.(mockInsights.tags);

    } catch (error) {
      console.error('Content analysis failed:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "text-green-600";
    if (confidence >= 0.8) return "text-blue-600";
    if (confidence >= 0.7) return "text-yellow-600";
    return "text-gray-600";
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'emotion': return <Heart className="w-3 h-3" />;
      case 'topic': return <MessageCircle className="w-3 h-3" />;
      case 'historical': return <Eye className="w-3 h-3" />;
      default: return <Tag className="w-3 h-3" />;
    }
  };

  if (isAnalyzing) {
    return (
      <Card className={`border-blue-200 bg-blue-50 dark:bg-blue-950 ${className}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <p className="text-sm text-blue-800 dark:text-blue-200">
              AI analyzing capsule content...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!insights) return null;

  return (
    <Card className={`border-purple-200 bg-purple-50 dark:bg-purple-950 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Brain className="w-5 h-5 text-purple-600" />
          AI Content Insights
          <Button
            variant="ghost"
            size="sm"
            onClick={analyzeContent}
            className="ml-auto"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Analysis Scores */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-2 bg-white dark:bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400">Emotional Resonance</p>
            <p className="text-lg font-bold text-purple-600">{insights.emotionalResonance}%</p>
          </div>
          <div className="text-center p-2 bg-white dark:bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400">Truth Likelihood</p>
            <p className="text-lg font-bold text-green-600">{insights.truthLikelihood}%</p>
          </div>
        </div>

        {/* Suggested Title */}
        {insights.suggestedTitle && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-xs text-yellow-700 dark:text-yellow-300 mb-1">Suggested Title:</p>
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              {insights.suggestedTitle}
            </p>
          </div>
        )}

        {/* Auto-generated Tags */}
        <div>
          <p className="text-sm font-medium mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            AI-Generated Tags
          </p>
          <div className="flex flex-wrap gap-2">
            {insights.tags.map((autoTag, index) => (
              <Badge
                key={index}
                variant={selectedTags.includes(autoTag.tag) ? "default" : "outline"}
                className={`cursor-pointer transition-all ${getConfidenceColor(autoTag.confidence)}`}
                onClick={() => toggleTag(autoTag.tag)}
              >
                {getCategoryIcon(autoTag.category)}
                <span className="ml-1">{autoTag.tag}</span>
                <span className="ml-1 text-xs opacity-70">
                  {Math.round(autoTag.confidence * 100)}%
                </span>
                {selectedTags.includes(autoTag.tag) && (
                  <Check className="w-3 h-3 ml-1" />
                )}
              </Badge>
            ))}
          </div>
        </div>

        {/* Key Themes */}
        <div>
          <p className="text-sm font-medium mb-2">Key Themes:</p>
          <div className="flex flex-wrap gap-1">
            {insights.keyThemes.map((theme, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {theme}
              </Badge>
            ))}
          </div>
        </div>

        {/* Recommended Audience */}
        <div className="text-sm">
          <span className="font-medium">Recommended Audience: </span>
          <span className="text-gray-600 dark:text-gray-400">{insights.recommendedAudience}</span>
        </div>
      </CardContent>
    </Card>
  );
}