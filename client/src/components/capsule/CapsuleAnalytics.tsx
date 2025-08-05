import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BarChart3,
  TrendingUp,
  Target,
  Users,
  Clock,
  Star,
  Zap,
  Heart,
  Shield,
  Eye,
  Coins,
  Activity
} from 'lucide-react';

interface AnalyticsData {
  totalCapsules: number;
  totalGTT: number;
  avgTruthScore: number;
  avgImpactScore: number;
  successRate: number;
  engagement: number;
  topCategories: Array<{
    name: string;
    count: number;
    gtt: number;
    growth: string;
  }>;
  recentPerformance: Array<{
    date: string;
    capsules: number;
    gtt: number;
    engagement: number;
  }>;
  milestones: Array<{
    title: string;
    description: string;
    achieved: boolean;
    progress: number;
  }>;
}

interface CapsuleAnalyticsProps {
  data: AnalyticsData;
  timeframe: 'week' | 'month' | 'year';
  onTimeframeChange: (timeframe: 'week' | 'month' | 'year') => void;
}

export default function CapsuleAnalytics({ 
  data, 
  timeframe, 
  onTimeframeChange 
}: CapsuleAnalyticsProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Creation Analytics</h2>
        <div className="flex items-center gap-2">
          {(['week', 'month', 'year'] as const).map((period) => (
            <button
              key={period}
              onClick={() => onTimeframeChange(period)}
              className={`px-3 py-1 rounded text-sm transition-all ${
                timeframe === period
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              data-testid={`timeframe-${period}`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800/50 border-gray-600">
          <CardContent className="p-4 text-center">
            <Shield className="w-6 h-6 mx-auto text-cyan-400 mb-2" />
            <div className="text-xl font-bold text-white">{data.totalCapsules}</div>
            <div className="text-xs text-gray-400">Total Capsules</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-600">
          <CardContent className="p-4 text-center">
            <Coins className="w-6 h-6 mx-auto text-yellow-400 mb-2" />
            <div className="text-xl font-bold text-white">{data.totalGTT}</div>
            <div className="text-xs text-gray-400">Total GTT Earned</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-600">
          <CardContent className="p-4 text-center">
            <Target className="w-6 h-6 mx-auto text-green-400 mb-2" />
            <div className="text-xl font-bold text-white">{data.avgTruthScore}%</div>
            <div className="text-xs text-gray-400">Avg Truth Score</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-600">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 mx-auto text-purple-400 mb-2" />
            <div className="text-xl font-bold text-white">{data.successRate}%</div>
            <div className="text-xs text-gray-400">Success Rate</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Categories */}
        <Card className="bg-gray-800/50 border-gray-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Top Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.topCategories.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">{category.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-yellow-600 text-xs">
                      {category.gtt} GTT
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {category.growth}
                    </Badge>
                  </div>
                </div>
                <Progress 
                  value={(category.count / data.totalCapsules) * 100} 
                  className="h-2" 
                />
                <div className="text-xs text-gray-400">
                  {category.count} capsules ({Math.round((category.count / data.totalCapsules) * 100)}%)
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Performance Trend */}
        <Card className="bg-gray-800/50 border-gray-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Performance Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.recentPerformance.map((period, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-700/50 rounded">
                <div>
                  <div className="text-white font-medium">{period.date}</div>
                  <div className="text-xs text-gray-400">
                    {period.capsules} capsules created
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-yellow-300 font-bold">{period.gtt} GTT</div>
                  <div className="text-xs text-gray-400">
                    {period.engagement}% engagement
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Milestones */}
      <Card className="bg-gray-800/50 border-gray-600">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Star className="w-5 h-5 mr-2" />
            Achievement Milestones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.milestones.map((milestone, index) => (
              <div
                key={index}
                className={`p-4 rounded border ${
                  milestone.achieved
                    ? 'border-green-500/30 bg-green-500/10'
                    : 'border-gray-600 bg-gray-800/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`font-medium ${
                    milestone.achieved ? 'text-green-300' : 'text-white'
                  }`}>
                    {milestone.title}
                  </h3>
                  {milestone.achieved && (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-400 mb-3">
                  {milestone.description}
                </p>
                <div className="space-y-1">
                  <Progress 
                    value={milestone.progress} 
                    className="h-2"
                  />
                  <div className="text-xs text-gray-400">
                    {milestone.progress}% complete
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights & Recommendations */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-purple-300 flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            AI Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            {
              type: 'success',
              message: 'Your truth capsules perform 23% better than average',
              action: 'Continue focusing on authentic personal experiences'
            },
            {
              type: 'opportunity',
              message: 'Voice notes increase engagement by 40%',
              action: 'Try adding voice recordings to your next capsule'
            },
            {
              type: 'trend',
              message: 'Climate-related content is trending +45% this week',
              action: 'Consider sharing environmental insights or experiences'
            },
            {
              type: 'optimization',
              message: 'Your optimal posting time is 7-9 PM',
              action: 'Schedule capsule releases during peak engagement hours'
            }
          ].map((insight, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-gray-800/50 rounded">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                insight.type === 'success' ? 'bg-green-400' :
                insight.type === 'opportunity' ? 'bg-yellow-400' :
                insight.type === 'trend' ? 'bg-purple-400' :
                'bg-cyan-400'
              }`} />
              <div className="flex-1">
                <p className="text-sm text-gray-300">{insight.message}</p>
                <p className="text-xs text-gray-500 mt-1">{insight.action}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}