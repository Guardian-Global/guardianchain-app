import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  AlertTriangle, 
  Loader2
} from "lucide-react";
import { runAccountingAI, generateFinancialInsights } from "@/lib/ai";

export default function AIAccountingPanel() {
  const [insights, setInsights] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRunAnalysis = async () => {
    setIsLoading(true);
    setError("");
    setInsights("");
    
    try {
      const analysis = await runAccountingAI();
      setInsights(analysis);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateInsights = async () => {
    setIsLoading(true);
    setError("");
    setInsights("");
    
    try {
      const analysis = await generateFinancialInsights();
      setInsights(analysis);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Brain className="w-5 h-5 mr-2 text-purple-400" />
          AI Financial Intelligence
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={handleRunAnalysis}
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Run Treasury Analysis
          </Button>
          <Button 
            onClick={handleGenerateInsights}
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Generate Insights
          </Button>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2 text-red-400" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          </div>
        )}

        {insights && (
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">AI Analysis Results</h4>
            <pre className="text-slate-300 text-sm whitespace-pre-wrap">{insights}</pre>
          </div>
        )}

        {!insights && !error && !isLoading && (
          <div className="text-slate-400 text-sm text-center py-8">
            Connect OpenAI API to enable AI-powered financial analysis and strategic insights
          </div>
        )}
      </CardContent>
    </Card>
  );
}