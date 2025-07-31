import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  Activity 
} from 'lucide-react';

interface QueueStatsData {
  total: number;
  verified: number;
  pending: number;
  underReview: number;
  disputed: number;
  avgProcessingTime: number;
  weeklyThroughput: number;
}

export default function QueueStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/queue/stats'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fallback data for demo
  const queueStats: QueueStatsData = stats as QueueStatsData || {
    total: 1247,
    verified: 943,
    pending: 156,
    underReview: 89,
    disputed: 59,
    avgProcessingTime: 2.3,
    weeklyThroughput: 234
  };

  const verificationRate = queueStats.total > 0 
    ? (queueStats.verified / queueStats.total) * 100 
    : 0;

  const pendingRate = queueStats.total > 0 
    ? (queueStats.pending / queueStats.total) * 100 
    : 0;

  if (isLoading) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-700 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-slate-700 rounded"></div>
              <div className="h-3 bg-slate-700 rounded w-5/6"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
          Queue Performance
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-700/50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-400 text-xs">Total Capsules</span>
              <Activity className="w-3 h-3 text-blue-400" />
            </div>
            <div className="text-white font-bold text-lg">{queueStats.total.toLocaleString()}</div>
          </div>
          
          <div className="bg-slate-700/50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-400 text-xs">Verified</span>
              <CheckCircle className="w-3 h-3 text-green-400" />
            </div>
            <div className="text-white font-bold text-lg">{queueStats.verified.toLocaleString()}</div>
          </div>
          
          <div className="bg-slate-700/50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-400 text-xs">Pending</span>
              <Clock className="w-3 h-3 text-yellow-400" />
            </div>
            <div className="text-white font-bold text-lg">{queueStats.pending}</div>
          </div>
          
          <div className="bg-slate-700/50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-400 text-xs">Disputed</span>
              <AlertTriangle className="w-3 h-3 text-red-400" />
            </div>
            <div className="text-white font-bold text-lg">{queueStats.disputed}</div>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400">Verification Rate</span>
              <span className="text-green-400">{verificationRate.toFixed(1)}%</span>
            </div>
            <Progress value={verificationRate} className="bg-slate-700" />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400">Pending Rate</span>
              <span className="text-yellow-400">{pendingRate.toFixed(1)}%</span>
            </div>
            <Progress value={pendingRate} className="bg-slate-700" />
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="border-t border-slate-700 pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 text-blue-400 mr-2" />
              <span className="text-slate-400 text-sm">Avg Processing</span>
            </div>
            <span className="text-white font-medium">{queueStats.avgProcessingTime}h</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BarChart3 className="w-4 h-4 text-purple-400 mr-2" />
              <span className="text-slate-400 text-sm">Weekly Throughput</span>
            </div>
            <Badge className="bg-purple-600">
              {queueStats.weeklyThroughput} capsules
            </Badge>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="border-t border-slate-700 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">Queue Health</span>
            <Badge className={`${
              pendingRate < 15 ? 'bg-green-600' : 
              pendingRate < 25 ? 'bg-yellow-600' : 'bg-red-600'
            }`}>
              {pendingRate < 15 ? 'Healthy' : 
               pendingRate < 25 ? 'Moderate' : 'High Load'}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-slate-400 text-sm">System Status</span>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              <span className="text-green-400 text-sm">Operational</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}