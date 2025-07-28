import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Loader2, AlertTriangle } from "lucide-react";
import { getAIAdvisorInsights } from "@/lib/ai";

interface AIAdvisorPanelProps {
  treasury: any;
  market: any;
}

export function AIAdvisorPanel({ treasury, market }: AIAdvisorPanelProps) {
  const [advice, setAdvice] = useState<string>(
    "Click 'Generate Insights' to get AI analysis"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const generateInsights = async () => {
    setIsLoading(true);
    setError("");

    try {
      const insights = await getAIAdvisorInsights({ treasury, market });
      setAdvice(insights);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-400" />
            AI Treasury Advisor
          </div>
          <Button
            onClick={generateInsights}
            disabled={isLoading}
            size="sm"
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            Generate Insights
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-3 mb-4">
            <div className="flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2 text-red-400" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="bg-slate-700/50 rounded-lg p-4 min-h-[120px]">
          <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
            {advice}
          </p>
        </div>

        {treasury && market && (
          <div className="mt-4 text-xs text-slate-500">
            Analysis based on: GTT ${market.price} (
            {market.change24h > 0 ? "+" : ""}
            {market.change24h.toFixed(2)}%), Treasury {treasury.balance} GTT,
            Revenue ${treasury.monthlyRevenue}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
