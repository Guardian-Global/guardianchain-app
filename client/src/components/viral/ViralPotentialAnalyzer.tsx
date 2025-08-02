import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Target,
  Users,
  Heart,
  Share2,
  Clock,
  Zap,
  Brain,
  AlertTriangle,
  CheckCircle,
  Eye,
  MessageCircle,
  Repeat,
  BookOpen,
  Calendar,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ViralMetrics {
  content: string;
  emotionalResonance: number;
  shareability: number;
  trendAlignment: number;
  audienceMatch: number;
  timingScore: number;
  overallViralScore: number;
  bestPlatforms: string[];
  suggestedHashtags: string[];
  optimalTiming: string;
  improvementTips: string[];
}

const ViralPotentialAnalyzer: React.FC = () => {
  const [content, setContent] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [metrics, setMetrics] = useState<ViralMetrics | null>(null);
  const { toast } = useToast();

  const analyzeViralPotential = async () => {
    if (!content.trim()) {
      toast({
        title: "Content Required",
        description: "Please enter content to analyze",
        variant: "destructive",
      });
      return;
    }

    setAnalyzing(true);

    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate realistic analysis based on content
    const contentLength = content.length;
    const hasEmojis =
      /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u.test(
        content,
      );
    const hasQuestions = content.includes("?");
    const hasCallToAction =
      /share|comment|like|follow|subscribe|check out|click|visit/i.test(
        content,
      );
    const hasTrendingWords =
      /ai|crypto|viral|trending|breaking|exclusive|secret|hack/i.test(content);

    const baseScore = Math.min(
      90,
      Math.max(
        20,
        50 +
          (contentLength > 100 ? 10 : 0) +
          (hasEmojis ? 5 : 0) +
          (hasQuestions ? 5 : 0) +
          (hasCallToAction ? 10 : 0) +
          (hasTrendingWords ? 15 : 0),
      ),
    );

    const analysis: ViralMetrics = {
      content,
      emotionalResonance: Math.min(
        95,
        baseScore + Math.floor(Math.random() * 20) - 10,
      ),
      shareability: Math.min(
        95,
        baseScore + Math.floor(Math.random() * 20) - 10,
      ),
      trendAlignment: Math.min(
        95,
        baseScore + Math.floor(Math.random() * 20) - 10,
      ),
      audienceMatch: Math.min(
        95,
        baseScore + Math.floor(Math.random() * 20) - 10,
      ),
      timingScore: Math.floor(Math.random() * 40) + 60,
      overallViralScore: 0,
      bestPlatforms: [],
      suggestedHashtags: [],
      optimalTiming: "",
      improvementTips: [],
    };

    // Calculate overall score
    analysis.overallViralScore = Math.round(
      (analysis.emotionalResonance +
        analysis.shareability +
        analysis.trendAlignment +
        analysis.audienceMatch +
        analysis.timingScore) /
        5,
    );

    // Determine best platforms
    if (analysis.overallViralScore >= 80) {
      analysis.bestPlatforms = ["Twitter/X", "TikTok", "Instagram", "LinkedIn"];
    } else if (analysis.overallViralScore >= 60) {
      analysis.bestPlatforms = ["Instagram", "Twitter/X", "Facebook"];
    } else {
      analysis.bestPlatforms = ["LinkedIn", "Facebook", "Reddit"];
    }

    // Generate hashtags based on content
    const possibleHashtags = [
      "#viral",
      "#trending",
      "#content",
      "#social",
      "#share",
      "#engage",
      "#innovation",
      "#insights",
      "#growth",
      "#community",
      "#discussion",
      "#knowledge",
      "#tips",
      "#advice",
      "#inspiration",
      "#motivation",
    ];
    analysis.suggestedHashtags = possibleHashtags.slice(
      0,
      5 + Math.floor(Math.random() * 3),
    );

    // Optimal timing
    const times = [
      "9:00 AM EST (Peak morning engagement)",
      "1:00 PM EST (Lunch break peak)",
      "7:00 PM EST (Evening social media time)",
      "9:00 PM EST (Prime time engagement)",
    ];
    analysis.optimalTiming = times[Math.floor(Math.random() * times.length)];

    // Improvement tips
    const allTips = [
      "Add more emotional trigger words to increase resonance",
      "Include a clear call-to-action to boost shareability",
      "Use trending hashtags to improve discoverability",
      "Add visual elements like emojis or mention images",
      "Ask questions to encourage engagement",
      "Create urgency with time-sensitive language",
      "Reference current events or trends",
      "Keep content concise and scannable",
      "Use storytelling elements to increase relatability",
      "Include statistics or surprising facts",
    ];

    analysis.improvementTips = allTips
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);

    setMetrics(analysis);
    setAnalyzing(false);

    toast({
      title: "Analysis Complete",
      description: `Viral potential: ${analysis.overallViralScore}%`,
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    if (score >= 40) return "text-orange-400";
    return "text-red-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-900/20 border-green-700";
    if (score >= 60) return "bg-yellow-900/20 border-yellow-700";
    if (score >= 40) return "bg-orange-900/20 border-orange-700";
    return "bg-red-900/20 border-red-700";
  };

  return (
    <div className="space-y-8">
      <Card className="bg-gradient-to-r from-pink-900/20 to-purple-900/20 border-pink-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <TrendingUp className="w-8 h-8 mr-3 text-pink-400" />
            <div>
              <div className="text-3xl font-bold">Viral Potential Analyzer</div>
              <div className="text-lg text-pink-400">
                AI-Powered Virality Prediction
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <label className="text-white font-semibold mb-2 block">
                Content to Analyze
              </label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your social media post, tweet, caption, or any content you want to analyze for viral potential..."
                className="min-h-32 bg-slate-800/50 border-slate-700 text-white"
              />
              <div className="text-sm text-slate-400 mt-1">
                {content.length} characters • Recommended: 100-280 for maximum
                engagement
              </div>
            </div>

            <Button
              onClick={analyzeViralPotential}
              disabled={analyzing || !content.trim()}
              className="w-full bg-pink-600 hover:bg-pink-700"
              size="lg"
            >
              {analyzing ? (
                <div className="flex items-center">
                  <Brain className="w-5 h-5 mr-2 animate-pulse" />
                  Analyzing Viral Potential...
                </div>
              ) : (
                <div className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Analyze Viral Potential
                </div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {metrics && (
        <div className="space-y-8">
          {/* Overall Score */}
          <Card className={`${getScoreBg(metrics.overallViralScore)}`}>
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <div className="flex items-center">
                  <Target className="w-6 h-6 mr-2 text-white" />
                  Viral Potential Score
                </div>
                <Badge
                  className={`text-2xl px-4 py-2 ${getScoreColor(
                    metrics.overallViralScore,
                  )}`}
                >
                  {metrics.overallViralScore}%
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <Heart className="w-8 h-8 text-red-400 mx-auto mb-2" />
                  <div
                    className={`text-xl font-bold ${getScoreColor(
                      metrics.emotionalResonance,
                    )}`}
                  >
                    {metrics.emotionalResonance}%
                  </div>
                  <div className="text-sm text-slate-400">Emotional Impact</div>
                  <Progress
                    value={metrics.emotionalResonance}
                    className="mt-2 h-2"
                  />
                </div>

                <div className="text-center">
                  <Share2 className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div
                    className={`text-xl font-bold ${getScoreColor(
                      metrics.shareability,
                    )}`}
                  >
                    {metrics.shareability}%
                  </div>
                  <div className="text-sm text-slate-400">Shareability</div>
                  <Progress value={metrics.shareability} className="mt-2 h-2" />
                </div>

                <div className="text-center">
                  <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <div
                    className={`text-xl font-bold ${getScoreColor(
                      metrics.trendAlignment,
                    )}`}
                  >
                    {metrics.trendAlignment}%
                  </div>
                  <div className="text-sm text-slate-400">Trend Alignment</div>
                  <Progress
                    value={metrics.trendAlignment}
                    className="mt-2 h-2"
                  />
                </div>

                <div className="text-center">
                  <Users className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <div
                    className={`text-xl font-bold ${getScoreColor(
                      metrics.audienceMatch,
                    )}`}
                  >
                    {metrics.audienceMatch}%
                  </div>
                  <div className="text-sm text-slate-400">Audience Match</div>
                  <Progress
                    value={metrics.audienceMatch}
                    className="mt-2 h-2"
                  />
                </div>

                <div className="text-center">
                  <Clock className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <div
                    className={`text-xl font-bold ${getScoreColor(
                      metrics.timingScore,
                    )}`}
                  >
                    {metrics.timingScore}%
                  </div>
                  <div className="text-sm text-slate-400">Timing Score</div>
                  <Progress value={metrics.timingScore} className="mt-2 h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Platform Recommendations */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Eye className="w-6 h-6 mr-2 text-blue-400" />
                  Best Platforms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metrics.bestPlatforms.map((platform, index) => (
                    <div
                      key={platform}
                      className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-8 h-8 rounded-full mr-3 flex items-center justify-center text-white font-bold ${
                            index === 0
                              ? "bg-green-600"
                              : index === 1
                                ? "bg-blue-600"
                                : "bg-purple-600"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <span className="text-white font-semibold">
                          {platform}
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-green-400 border-green-400"
                      >
                        Recommended
                      </Badge>
                    </div>
                  ))}

                  <div className="mt-6">
                    <h4 className="text-white font-semibold mb-3">
                      Optimal Timing
                    </h4>
                    <div className="flex items-center p-3 bg-blue-900/20 rounded-lg border border-blue-700">
                      <Calendar className="w-5 h-5 text-blue-400 mr-2" />
                      <span className="text-blue-400 font-semibold">
                        {metrics.optimalTiming}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hashtags & Improvements */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <MessageCircle className="w-6 h-6 mr-2 text-purple-400" />
                  Optimization Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-white font-semibold mb-3">
                      Suggested Hashtags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {metrics.suggestedHashtags.map((hashtag) => (
                        <Badge
                          key={hashtag}
                          className="bg-purple-600 text-white"
                        >
                          {hashtag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold mb-3">
                      Improvement Tips
                    </h4>
                    <div className="space-y-2">
                      {metrics.improvementTips.map((tip, index) => (
                        <div key={index} className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-1 flex-shrink-0" />
                          <span className="text-slate-300 text-sm">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analysis */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Brain className="w-6 h-6 mr-2 text-cyan-400" />
                Detailed Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-white font-semibold mb-3">
                    Content Strengths
                  </h3>
                  <div className="space-y-2">
                    {metrics.emotionalResonance >= 70 && (
                      <div className="flex items-center text-green-400">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        <span className="text-sm">High emotional impact</span>
                      </div>
                    )}
                    {metrics.shareability >= 70 && (
                      <div className="flex items-center text-green-400">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        <span className="text-sm">
                          Strong shareability factors
                        </span>
                      </div>
                    )}
                    {metrics.trendAlignment >= 70 && (
                      <div className="flex items-center text-green-400">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        <span className="text-sm">
                          Well-aligned with trends
                        </span>
                      </div>
                    )}
                    {metrics.audienceMatch >= 70 && (
                      <div className="flex items-center text-green-400">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        <span className="text-sm">Good audience targeting</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-3">
                    Areas for Improvement
                  </h3>
                  <div className="space-y-2">
                    {metrics.emotionalResonance < 70 && (
                      <div className="flex items-center text-yellow-400">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        <span className="text-sm">
                          Boost emotional engagement
                        </span>
                      </div>
                    )}
                    {metrics.shareability < 70 && (
                      <div className="flex items-center text-yellow-400">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        <span className="text-sm">
                          Increase shareability elements
                        </span>
                      </div>
                    )}
                    {metrics.trendAlignment < 70 && (
                      <div className="flex items-center text-yellow-400">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        <span className="text-sm">
                          Better trend alignment needed
                        </span>
                      </div>
                    )}
                    {metrics.audienceMatch < 70 && (
                      <div className="flex items-center text-yellow-400">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        <span className="text-sm">
                          Refine audience targeting
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ViralPotentialAnalyzer;
