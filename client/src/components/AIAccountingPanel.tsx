import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Download,
  Calendar
} from "lucide-react";

interface AIFinancialReport {
  summary: string;
  metrics: {
    treasuryHealth: 'excellent' | 'good' | 'warning' | 'critical';
    revenueGrowth: number;
    burnRate: number;
    projectedRunway: number;
  };
  recommendations: string[];
  alerts: string[];
  lastAnalysis: Date;
}

export default function AIAccountingPanel() {
  const [report, setReport] = useState<AIFinancialReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const generateAIReport = async () => {
    try {
      setGenerating(true);
      
      // TODO: Replace with actual OpenAI API call
      // const response = await fetch('/api/ai/financial-report', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' }
      // });
      // const aiReport = await response.json();

      // Mock AI analysis for development
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate AI processing

      const mockReport: AIFinancialReport = {
        summary: `Treasury analysis complete. Revenue streams are performing exceptionally well with a 15.2% increase in subscription revenue and 8.7% growth in trading fees. GTT token price stability indicates strong market confidence. Current burn rate is sustainable with projected runway exceeding 24 months.`,
        metrics: {
          treasuryHealth: 'excellent',
          revenueGrowth: 15.2,
          burnRate: 3.1,
          projectedRunway: 28
        },
        recommendations: [
          "Consider increasing yield distribution by 10% to boost user retention",
          "Implement quarterly token buyback program to support price stability",
          "Expand institutional tier offerings to capture enterprise market",
          "Optimize trading tax rate based on volume analysis"
        ],
        alerts: [
          "No critical issues detected",
          "All compliance metrics within acceptable ranges",
          "Revenue diversification on track"
        ],
        lastAnalysis: new Date()
      };

      setReport(mockReport);
    } catch (error) {
      console.error('Error generating AI report:', error);
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    generateAIReport().finally(() => setLoading(false));
  }, []);

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'bg-green-600';
      case 'good': return 'bg-blue-600';
      case 'warning': return 'bg-yellow-600';
      case 'critical': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'excellent':
      case 'good':
        return <CheckCircle className="w-4 h-4" />;
      case 'warning':
      case 'critical':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-400" />
            AI Financial Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-600 rounded w-3/4"></div>
            <div className="h-4 bg-slate-600 rounded w-1/2"></div>
            <div className="h-4 bg-slate-600 rounded w-5/6"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center">
              <Brain className="w-5 h-5 mr-2 text-purple-400" />
              AI Financial Intelligence
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                onClick={generateAIReport}
                disabled={generating}
                size="sm"
                variant="outline"
                className="border-slate-600 text-slate-300 hover:text-white"
              >
                {generating ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Analysis
                  </>
                )}
              </Button>
              <Button
                size="sm"
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Analysis Summary */}
          <div className="bg-slate-700/30 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-white mb-2">Executive Summary</h4>
            <p className="text-slate-300 text-sm leading-relaxed">
              {report?.summary}
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {report?.metrics.revenueGrowth.toFixed(1)}%
              </div>
              <div className="text-xs text-slate-400">Revenue Growth</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {report?.metrics.burnRate.toFixed(1)}%
              </div>
              <div className="text-xs text-slate-400">Monthly Burn</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {report?.metrics.projectedRunway}mo
              </div>
              <div className="text-xs text-slate-400">Runway</div>
            </div>
            <div className="text-center">
              <Badge 
                className={`${getHealthColor(report?.metrics.treasuryHealth || 'good')} text-white`}
              >
                {getHealthIcon(report?.metrics.treasuryHealth || 'good')}
                <span className="ml-1 capitalize">{report?.metrics.treasuryHealth}</span>
              </Badge>
              <div className="text-xs text-slate-400 mt-1">Health Score</div>
            </div>
          </div>

          {/* AI Recommendations */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-green-400" />
              Strategic Recommendations
            </h4>
            <div className="space-y-2">
              {report?.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-slate-300 text-sm">{recommendation}</span>
                </div>
              ))}
            </div>
          </div>

          {/* System Alerts */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2 text-yellow-400" />
              System Alerts
            </h4>
            <div className="space-y-2">
              {report?.alerts.map((alert, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">{alert}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Last Analysis Time */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-700">
            <div className="flex items-center text-slate-400 text-sm">
              <Calendar className="w-4 h-4 mr-2" />
              Last Analysis: {report?.lastAnalysis.toLocaleString()}
            </div>
            <Badge className="bg-slate-700 text-slate-300">
              Powered by GPT-4o
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}