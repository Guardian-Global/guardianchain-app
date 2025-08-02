import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGuardianAI, type AIInsight } from "@/hooks/useGuardianAI";
import {
  Brain,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Zap,
  RefreshCw,
} from "lucide-react";

interface GuardianAssistantProps {
  userTier?: string;
  context?: "dashboard" | "creation" | "staking";
}

export default function GuardianAssistant({
  userTier = "EXPLORER",
  context = "dashboard",
}: GuardianAssistantProps) {
  const { isGenerating, generateInsights, getRecommendations } =
    useGuardianAI();
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const handleGenerateInsights = async () => {
    try {
      const newInsights = await generateInsights({ userTier, context });
      setInsights(newInsights);

      const newRecommendations = await getRecommendations(userTier);
      setRecommendations(newRecommendations);
    } catch (error) {
      console.error("Failed to generate AI insights:", error);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "optimization":
        return TrendingUp;
      case "warning":
        return AlertTriangle;
      case "suggestion":
        return Lightbulb;
      case "prediction":
        return Sparkles;
      default:
        return Brain;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case "optimization":
        return "text-green-400";
      case "warning":
        return "text-orange-400";
      case "suggestion":
        return "text-blue-400";
      case "prediction":
        return "text-purple-400";
      default:
        return "text-gray-400";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "border-red-500/30 text-red-400";
      case "medium":
        return "border-yellow-500/30 text-yellow-400";
      case "low":
        return "border-green-500/30 text-green-400";
      default:
        return "border-gray-500/30 text-gray-400";
    }
  };

  return (
    <Card className="bg-gradient-to-br from-slate-800/50 to-purple-900/20 border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-400" />
          Guardian AI Assistant
        </CardTitle>
        <CardDescription>
          Personalized insights and recommendations for your truth verification
          journey
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {insights.length === 0 ? (
          <div className="text-center py-8">
            <Brain className="h-12 w-12 text-purple-400 mx-auto mb-4 opacity-50" />
            <p className="text-gray-400 mb-4">
              Activate Guardian AI to receive personalized insights and
              optimization suggestions.
            </p>
            <Button
              onClick={handleGenerateInsights}
              disabled={isGenerating}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Generate AI Insights
                </>
              )}
            </Button>
          </div>
        ) : (
          <>
            {/* AI Insights */}
            <div className="space-y-3">
              <h4 className="font-semibold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-yellow-400" />
                AI Insights
              </h4>

              {insights.map((insight, index) => {
                const Icon = getInsightIcon(insight.type);

                return (
                  <div
                    key={index}
                    className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/50"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-slate-800/50 rounded-lg">
                        <Icon
                          className={`h-4 w-4 ${getInsightColor(insight.type)}`}
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h5 className="font-medium text-white">
                            {insight.title}
                          </h5>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={getImpactColor(insight.impact)}
                            >
                              {insight.impact}
                            </Badge>
                            <span className="text-xs text-gray-400">
                              {Math.round(insight.confidence * 100)}%
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-300">
                          {insight.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Recommendations */}
            {recommendations.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-white flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-blue-400" />
                  Recommended Actions
                </h4>

                {recommendations.slice(0, 3).map((rec, index) => (
                  <div
                    key={index}
                    className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="font-medium text-blue-400">{rec.title}</h5>
                      {rec.actionable && (
                        <Badge className="bg-green-600/20 text-green-400 border-green-500/30 text-xs">
                          Actionable
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-300">{rec.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Refresh Button */}
            <div className="pt-2">
              <Button
                variant="outline"
                onClick={handleGenerateInsights}
                disabled={isGenerating}
                className="w-full border-purple-500/30 text-purple-400 hover:bg-purple-600/20"
              >
                {isGenerating ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Refresh Insights
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
