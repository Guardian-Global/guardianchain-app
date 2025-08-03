import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brain, Search, Sparkles } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface MemoryRecallAIProps {
  userId: string;
}

export default function MemoryRecallAI({ userId }: MemoryRecallAIProps) {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const { toast } = useToast();

  const recallMutation = useMutation({
    mutationFn: async (data: { prompt: string; userId: string }) => {
      return apiRequest("POST", "/api/ai/recall", data);
    },
    onSuccess: (data) => {
      setResult(data.result);
      toast({
        title: "Memory Recalled",
        description: "AI has processed your memory query.",
      });
    },
    onError: () => {
      toast({
        title: "Recall Failed",
        description: "Failed to process memory query. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleRecall = () => {
    if (!prompt.trim()) return;
    recallMutation.mutate({ prompt, userId });
  };

  const clearResult = () => {
    setResult(null);
    setPrompt("");
  };

  return (
    <Card className="bg-brand-secondary border-brand-surface">
      <CardHeader>
        <CardTitle className="text-brand-light flex items-center gap-2">
          <Brain className="w-5 h-5 text-brand-accent" />
          Memory Recall AI
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the memory you're trying to recall..."
            className="bg-brand-surface border-brand-light/20 text-brand-light"
            onKeyPress={(e) => e.key === "Enter" && handleRecall()}
            data-testid="input-memory-prompt"
          />
          <Button
            onClick={handleRecall}
            disabled={!prompt.trim() || recallMutation.isPending}
            className="bg-brand-primary hover:bg-brand-primary/80"
            data-testid="button-recall-memory"
          >
            {recallMutation.isPending ? (
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </Button>
        </div>

        {result && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-brand-accent">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">AI Memory Response</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={clearResult}
                className="border-brand-light/20 text-brand-light hover:bg-brand-light/10"
                data-testid="button-clear-result"
              >
                Clear
              </Button>
            </div>
            
            <div className="p-4 bg-brand-surface rounded-lg border border-brand-light/10">
              <pre className="whitespace-pre-wrap text-sm text-brand-light/90 font-mono">
                {result}
              </pre>
            </div>
          </div>
        )}

        <div className="text-xs text-brand-light/60">
          AI can help you recall memories, connections, and patterns from your capsule history.
        </div>
      </CardContent>
    </Card>
  );
}