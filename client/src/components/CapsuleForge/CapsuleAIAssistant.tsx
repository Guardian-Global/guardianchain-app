import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface CapsuleData {
  title: string;
  content: string;
  category: string;
  tags: string[];
  type: string;
  accessLevel?: string;
  requiresAuth?: boolean;
  viewingCost?: number;
}

interface AISuggestion {
  type: "improvement" | "optimization" | "enhancement";
  title: string;
  description: string;
  confidence: number;
  action?: () => void;
}

interface Props {
  capsuleData: CapsuleData;
  onSuggestionApply: (improvements: Partial<CapsuleData>) => void;
}

const CapsuleAIAssistant: React.FC<Props> = ({
  capsuleData,
  onSuggestionApply,
}) => {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSuggestions = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate AI analysis
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockSuggestions: AISuggestion[] = [
        {
          type: "optimization",
          title: "Enhance Title Structure",
          description:
            "Consider adding specific keywords to improve discoverability",
          confidence: 85,
          action: () =>
            onSuggestionApply({
              title: `${capsuleData.title} | Truth Verified`,
            }),
        },
        {
          type: "improvement",
          title: "Add Relevant Tags",
          description:
            "Based on content analysis, these tags would improve categorization",
          confidence: 92,
          action: () =>
            onSuggestionApply({
              tags: [...capsuleData.tags, "verified", "truth", "evidence"],
            }),
        },
        {
          type: "enhancement",
          title: "Optimize Access Level",
          description:
            "Content appears suitable for restricted access with authentication",
          confidence: 78,
          action: () =>
            onSuggestionApply({
              accessLevel: "restricted",
              requiresAuth: true,
            }),
        },
      ];

      setSuggestions(mockSuggestions);
    } catch (err) {
      setError("Unable to generate AI suggestions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const applySuggestion = (suggestion: AISuggestion) => {
    if (suggestion.action) {
      suggestion.action();
      // Remove applied suggestion
      setSuggestions((prev) => prev.filter((s) => s !== suggestion));
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-400" />
          AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={generateSuggestions}
          disabled={loading || !capsuleData.content}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Get AI Suggestions
            </>
          )}
        </Button>

        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {suggestions.length > 0 && (
          <ScrollArea className="h-64">
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="bg-slate-900/50 rounded-lg p-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-white font-medium text-sm">
                      {suggestion.title}
                    </h4>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        suggestion.type === "improvement"
                          ? "border-green-500 text-green-400"
                          : suggestion.type === "optimization"
                            ? "border-blue-500 text-blue-400"
                            : "border-purple-500 text-purple-400"
                      }`}
                    >
                      {suggestion.confidence}% confident
                    </Badge>
                  </div>
                  <p className="text-slate-300 text-sm">
                    {suggestion.description}
                  </p>
                  <Button
                    size="sm"
                    onClick={() => applySuggestion(suggestion)}
                    className="w-full bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700"
                  >
                    <CheckCircle className="mr-2 h-3 w-3" />
                    Apply Suggestion
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {!loading && suggestions.length === 0 && (
          <div className="text-slate-400 text-sm text-center py-4">
            Add content to your capsule to get AI-powered suggestions for
            optimization.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CapsuleAIAssistant;
