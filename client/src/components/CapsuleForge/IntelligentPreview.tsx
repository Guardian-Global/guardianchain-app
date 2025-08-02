import React, { useState, useEffect } from "react";
import {
  Eye,
  Sparkles,
  Tag,
  TrendingUp,
  Shield,
  Globe,
  Users,
  DollarSign,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface CapsuleFormData {
  title: string;
  content: string;
  category: string;
  type: string;
  tags: string[];
  accessLevel: string;
  viewingCost: number;
  requiresAuth: boolean;
}

interface IntelligentPreviewProps {
  formData: CapsuleFormData;
  onOptimize: (suggestions: any) => void;
}

interface ContentAnalysis {
  readabilityScore: number;
  sentimentScore: number;
  keyPhrases: string[];
  suggestedTags: string[];
  estimatedEngagement: number;
  contentQuality: "Low" | "Medium" | "High" | "Excellent";
  viralPotential: number;
  truthScore: number;
}

export default function IntelligentPreview({
  formData,
  onOptimize,
}: IntelligentPreviewProps) {
  const [analysis, setAnalysis] = useState<ContentAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const { toast } = useToast();

  const analyzeContent = async () => {
    if (!formData.content || formData.content.length < 10) return;

    setAnalyzing(true);
    try {
      // Simulate AI content analysis
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockAnalysis: ContentAnalysis = {
        readabilityScore: Math.floor(Math.random() * 30) + 70,
        sentimentScore: Math.random() * 0.6 + 0.2, // 0.2 to 0.8
        keyPhrases: extractKeyPhrases(formData.content),
        suggestedTags: generateSuggestedTags(
          formData.content,
          formData.category,
        ),
        estimatedEngagement: Math.floor(Math.random() * 40) + 60,
        contentQuality: getContentQuality(formData.content),
        viralPotential: Math.floor(Math.random() * 30) + 40,
        truthScore: Math.floor(Math.random() * 20) + 80,
      };

      setAnalysis(mockAnalysis);
    } catch (error) {
      toast({
        title: "Analysis Error",
        description: "Unable to analyze content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const extractKeyPhrases = (content: string): string[] => {
    const words = content.toLowerCase().split(/\s+/);
    const phrases = [];

    // Simple key phrase extraction
    for (let i = 0; i < words.length - 1; i++) {
      if (words[i].length > 4 && words[i + 1].length > 4) {
        phrases.push(`${words[i]} ${words[i + 1]}`);
      }
    }

    return phrases.slice(0, 5);
  };

  const generateSuggestedTags = (
    content: string,
    category: string,
  ): string[] => {
    const contentWords = content.toLowerCase().split(/\s+/);
    const commonWords = [
      "truth",
      "evidence",
      "verified",
      "authentic",
      "blockchain",
      "decentralized",
    ];
    const suggested = [];

    // Add category-based tags
    suggested.push(category.toLowerCase());

    // Add content-based tags
    commonWords.forEach((word) => {
      if (contentWords.some((cw) => cw.includes(word))) {
        suggested.push(word);
      }
    });

    return suggested.slice(0, 4);
  };

  const getContentQuality = (
    content: string,
  ): ContentAnalysis["contentQuality"] => {
    if (content.length > 1000) return "Excellent";
    if (content.length > 500) return "High";
    if (content.length > 200) return "Medium";
    return "Low";
  };

  const getAccessLevelIcon = (level: string) => {
    switch (level) {
      case "public":
        return <Globe className="h-4 w-4 text-green-400" />;
      case "private":
        return <Shield className="h-4 w-4 text-red-400" />;
      case "restricted":
        return <Users className="h-4 w-4 text-yellow-400" />;
      case "premium":
        return <DollarSign className="h-4 w-4 text-purple-400" />;
      default:
        return <Globe className="h-4 w-4 text-green-400" />;
    }
  };

  const applyOptimizations = () => {
    if (!analysis) return;

    const optimizations = {
      tags: [
        ...formData.tags,
        ...analysis.suggestedTags.filter((tag) => !formData.tags.includes(tag)),
      ],
      category: formData.category || "general",
      accessLevel:
        analysis.viralPotential > 70 ? "public" : formData.accessLevel,
      requiresAuth: analysis.truthScore > 90,
    };

    onOptimize(optimizations);
    toast({
      title: "Optimizations Applied",
      description: "Your capsule has been optimized based on AI analysis.",
    });
  };

  useEffect(() => {
    if (formData.content && formData.content.length > 10) {
      const debounceTimer = setTimeout(() => {
        analyzeContent();
      }, 1000);

      return () => clearTimeout(debounceTimer);
    }
  }, [formData.content, formData.title]);

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Eye className="h-5 w-5 text-purple-400" />
          Intelligent Content Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Content Preview */}
        <div className="bg-slate-900/50 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-white">
              {formData.title || "Untitled Capsule"}
            </h3>
            {getAccessLevelIcon(formData.accessLevel)}
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className="border-purple-500 text-purple-300"
            >
              {formData.type || "Standard"}
            </Badge>
            {formData.category && (
              <Badge
                variant="outline"
                className="border-blue-500 text-blue-300"
              >
                {formData.category}
              </Badge>
            )}
            {formData.viewingCost > 0 && (
              <Badge
                variant="outline"
                className="border-green-500 text-green-300"
              >
                ${formData.viewingCost}
              </Badge>
            )}
          </div>

          <div className="text-slate-300 text-sm max-h-32 overflow-y-auto">
            {formData.content || "No content yet..."}
          </div>

          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* AI Analysis */}
        {analyzing ? (
          <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-purple-400 animate-pulse" />
              <span className="text-white font-medium">
                Analyzing Content...
              </span>
            </div>
            <div className="space-y-2">
              <Progress value={33} className="h-1" />
              <div className="text-sm text-purple-300">
                Extracting metadata and optimizing settings...
              </div>
            </div>
          </div>
        ) : analysis ? (
          <div className="space-y-4">
            {/* Quality Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/30 rounded-lg p-3">
                <div className="text-sm text-slate-400">Content Quality</div>
                <div
                  className={`font-bold ${
                    analysis.contentQuality === "Excellent"
                      ? "text-green-400"
                      : analysis.contentQuality === "High"
                        ? "text-blue-400"
                        : analysis.contentQuality === "Medium"
                          ? "text-yellow-400"
                          : "text-red-400"
                  }`}
                >
                  {analysis.contentQuality}
                </div>
              </div>

              <div className="bg-slate-900/30 rounded-lg p-3">
                <div className="text-sm text-slate-400">Truth Score</div>
                <div className="text-green-400 font-bold">
                  {analysis.truthScore}%
                </div>
              </div>

              <div className="bg-slate-900/30 rounded-lg p-3">
                <div className="text-sm text-slate-400">Viral Potential</div>
                <div className="text-purple-400 font-bold">
                  {analysis.viralPotential}%
                </div>
              </div>

              <div className="bg-slate-900/30 rounded-lg p-3">
                <div className="text-sm text-slate-400">Engagement Est.</div>
                <div className="text-blue-400 font-bold">
                  {analysis.estimatedEngagement}%
                </div>
              </div>
            </div>

            {/* Suggested Improvements */}
            {analysis.suggestedTags.length > 0 && (
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="h-4 w-4 text-blue-400" />
                  <span className="text-white font-medium">Suggested Tags</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {analysis.suggestedTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-blue-900/50 text-blue-300 text-xs"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Key Phrases */}
            {analysis.keyPhrases.length > 0 && (
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <span className="text-white font-medium">Key Phrases</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {analysis.keyPhrases.map((phrase) => (
                    <Badge
                      key={phrase}
                      variant="secondary"
                      className="bg-green-900/50 text-green-300 text-xs"
                    >
                      {phrase}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Apply Optimizations */}
            <Button
              onClick={applyOptimizations}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Apply AI Optimizations
            </Button>
          </div>
        ) : formData.content && formData.content.length > 10 ? (
          <Button
            onClick={analyzeContent}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Analyze Content with AI
          </Button>
        ) : (
          <div className="text-center text-slate-400 text-sm">
            Add content to enable intelligent preview and analysis
          </div>
        )}
      </CardContent>
    </Card>
  );
}
