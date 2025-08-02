import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Lightbulb, TrendingUp, Target, Sparkles } from "lucide-react";

interface AIInsight {
  type: 'suggestion' | 'forecast' | 'optimization' | 'insight';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
}

export function AIAdvisorPanel() {
  const [insights] = useState<AIInsight[]>([
    {
      type: 'suggestion',
      title: 'Optimize Capsule Tags',
      description: 'Based on your recent capsules, adding "blockchain-verified" and "AI-enhanced" tags could increase visibility by 34%.',
      confidence: 87,
      actionable: true
    },
    {
      type: 'forecast',
      title: 'Staking Forecast',
      description: 'Current market conditions suggest optimal GTT staking window in the next 72 hours for maximum yield.',
      confidence: 92,
      actionable: true
    },
    {
      type: 'insight',
      title: 'Truth Score Analysis',
      description: 'Your capsules with emotional resonance scores above 8.5 receive 40% more community verification.',
      confidence: 95,
      actionable: false
    },
    {
      type: 'optimization',
      title: 'Verification Strategy',
      description: 'Consider upgrading to Creator tier for access to professional Veritas seals and higher yield rates.',
      confidence: 78,
      actionable: true
    }
  ]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'suggestion': return Lightbulb;
      case 'forecast': return TrendingUp;
      case 'optimization': return Target;
      default: return Sparkles;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'suggestion': return 'text-yellow-400';
      case 'forecast': return 'text-blue-400';
      case 'optimization': return 'text-green-400';
      default: return 'text-purple-400';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-slate-800/50 to-purple-900/20 border-slate-700/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-600/20 rounded-lg">
            <Brain className="h-6 w-6 text-purple-400" />
          </div>
          <div>
            <CardTitle className="text-white">AI Guardian Advisor</CardTitle>
            <CardDescription>Powered by GPT-4 • Personalized insights</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => {
          const Icon = getInsightIcon(insight.type);
          const iconColor = getInsightColor(insight.type);
          
          return (
            <div
              key={index}
              className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-800/50 rounded-lg">
                  <Icon className={`h-4 w-4 ${iconColor}`} />
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-white">{insight.title}</h4>
                    <Badge 
                      variant="outline" 
                      className="text-xs border-white/20 text-gray-300"
                    >
                      {insight.confidence}% confidence
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {insight.description}
                  </p>
                  
                  {insight.actionable && (
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                      Take Action
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        
        <div className="pt-4 border-t border-slate-700/50">
          <Button 
            variant="outline" 
            className="w-full border-purple-500/30 text-purple-300 hover:bg-purple-600/20"
          >
            <Brain className="h-4 w-4 mr-2" />
            Get Advanced AI Analysis
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}