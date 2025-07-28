import React, { useEffect, useState } from "react";
import { getLatestTreasurySnapshot } from "@/lib/treasury";
import { askAI } from "@/lib/ai";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  RefreshCw,
} from "lucide-react";
import { BRAND_COLORS, BRAND_NAME } from "@/lib/constants";

export default function AIAdvisorPanel() {
  const [advice, setAdvice] = useState<string>("Analyzing financial data...");
  const [snapshot, setSnapshot] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const analyzeFinancials = async () => {
    try {
      setRefreshing(true);
      const data = await getLatestTreasurySnapshot();
      setSnapshot(data);

      const prompt = `GuardianChain financial status:
${JSON.stringify(data, null, 2)}

Please provide actionable financial recommendations focusing on:
1. Treasury optimization strategies
2. Risk assessment and mitigation
3. Profit-boosting opportunities
4. Operational efficiency improvements

Format as clear bullet points.`;

      const aiResponse = await askAI({
        prompt,
        model: "gpt-4o",
        max_tokens: 300,
      });

      setAdvice(aiResponse);
    } catch (error) {
      console.error("AI analysis error:", error);
      setAdvice("AI analysis temporarily unavailable. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    analyzeFinancials();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <section className="pt-20 pb-8 bg-gradient-to-br from-purple-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">
            🤖 Veritus AI Financial Advisor
          </h1>
          <p className="text-xl text-slate-300 mb-6">
            AI-powered strategic recommendations and financial optimization
            insights
          </p>
          <Badge className="bg-purple-600 text-white px-4 py-2">
            <Brain className="w-4 h-4 mr-2" />
            Advanced Financial Intelligence
          </Badge>
        </div>
      </section>

      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* AI Insights */}
          <Card className="bg-slate-800/50 border-slate-700 mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center">
                  <Lightbulb
                    className="w-5 h-5 mr-2"
                    style={{ color: BRAND_COLORS.GUARDIAN }}
                  />
                  Strategic Financial Recommendations
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={analyzeFinancials}
                  disabled={refreshing}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <RefreshCw
                    className={`w-4 h-4 mr-2 ${
                      refreshing ? "animate-spin" : ""
                    }`}
                  />
                  Refresh Analysis
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-700/50 p-6 rounded-lg">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin w-6 h-6 border-4 border-purple-500 border-t-transparent rounded-full mr-3" />
                    <span className="text-slate-300">
                      AI analyzing financial data...
                    </span>
                  </div>
                ) : (
                  <div className="whitespace-pre-line text-slate-300 leading-relaxed">
                    {advice}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Treasury Data */}
          {snapshot && (
            <Card className="bg-slate-800/50 border-slate-700 mb-8">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp
                    className="w-5 h-5 mr-2"
                    style={{ color: BRAND_COLORS.SUCCESS }}
                  />
                  Latest Treasury Snapshot
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Total Supply:</span>
                      <span className="text-white font-semibold">
                        {snapshot.gttTotalSupply?.toLocaleString()} GTT
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Treasury Balance:</span>
                      <span className="text-green-400 font-semibold">
                        {snapshot.gttTreasury?.toLocaleString()} GTT
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Yield Pool:</span>
                      <span className="text-purple-400 font-semibold">
                        {snapshot.gttYieldPool?.toLocaleString()} GTT
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Platform Revenue:</span>
                      <span className="text-green-400 font-semibold">
                        ${snapshot.platformRevenueUSD?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Tokens Burned:</span>
                      <span className="text-red-400 font-semibold">
                        {snapshot.gttBurned?.toLocaleString()} GTT
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">24h Volume:</span>
                      <span className="text-blue-400 font-semibold">
                        ${snapshot.tradingVolume24h?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Capabilities */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">
                AI Advisor Capabilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white font-medium mb-3 flex items-center">
                    <Brain className="w-4 h-4 mr-2 text-purple-400" />
                    Analysis Features
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li>• Real-time treasury health assessment</li>
                    <li>• Revenue optimization strategies</li>
                    <li>• Risk identification and mitigation</li>
                    <li>• Token economics optimization</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-3 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2 text-yellow-400" />
                    Alert Categories
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li>• Liquidity warnings</li>
                    <li>• Unusual trading patterns</li>
                    <li>• Revenue anomalies</li>
                    <li>• Compliance concerns</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
