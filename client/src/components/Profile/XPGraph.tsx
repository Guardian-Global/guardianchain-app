import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { BRAND_COLORS } from '@/lib/constants';
import { useQuery } from '@tanstack/react-query';
import { fetchUserXPData } from '@/lib/api';

interface XPDataPoint {
  day: string;
  XP: number;
  reputation: number;
  capsules: number;
}

interface XPGraphProps {
  address?: string;
  data?: XPDataPoint[];
}

export default function XPGraph({ address }: XPGraphProps) {
  const { data: xpData, isLoading, error } = useQuery({
    queryKey: ['user-xp', address],
    queryFn: () => address ? fetchUserXPData(address) : Promise.resolve([]),
    enabled: !!address,
  });
  if (isLoading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-slate-700 rounded w-48 mb-4"></div>
            <div className="h-32 bg-slate-700 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !xpData?.length) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6 text-center">
          <div className="text-slate-400">No XP data available</div>
        </CardContent>
      </Card>
    );
  }

  const data = xpData;
  const currentXP = data[data.length - 1]?.XP || 0;
  const currentLevel = Math.floor(currentXP / 1000) + 1;
  const nextLevelXP = currentLevel * 1000;
  const progressToNext = ((currentXP % 1000) / 1000) * 100;

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-lg" style={{ backgroundColor: `${BRAND_COLORS.GUARDIAN}20` }}>
            <TrendingUp className="h-5 w-5" style={{ color: BRAND_COLORS.GUARDIAN }} />
          </div>
          <div>
            <span className="text-white">DAO XP Progression</span>
            <div className="text-sm text-slate-400">Level {currentLevel} • {currentXP.toLocaleString()} XP</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Level Progress */}
        <div className="bg-slate-700/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-semibold">Current Level: {currentLevel}</span>
            <span className="text-slate-400 text-sm">{progressToNext.toFixed(1)}% to Level {currentLevel + 1}</span>
          </div>
          <div className="w-full bg-slate-600 rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-green-500"
              style={{ width: `${progressToNext}%` }}
            />
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {currentXP} / {nextLevelXP} XP
          </div>
        </div>

        {/* XP Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={BRAND_COLORS.GUARDIAN} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={BRAND_COLORS.GUARDIAN} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="day" 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
                labelStyle={{ color: '#D1D5DB' }}
              />
              <Area 
                type="monotone" 
                dataKey="XP" 
                stroke={BRAND_COLORS.GUARDIAN}
                strokeWidth={2}
                fill="url(#xpGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-slate-700/30 rounded-lg">
            <div className="text-lg font-bold text-white">{data[data.length - 1]?.reputation || 0}</div>
            <div className="text-xs text-slate-400">Reputation</div>
          </div>
          <div className="text-center p-3 bg-slate-700/30 rounded-lg">
            <div className="text-lg font-bold text-white">{data[data.length - 1]?.capsules || 0}</div>
            <div className="text-xs text-slate-400">Capsules</div>
          </div>
          <div className="text-center p-3 bg-slate-700/30 rounded-lg">
            <div className="text-lg font-bold text-green-400">{currentLevel}</div>
            <div className="text-xs text-slate-400">Level</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}