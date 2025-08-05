import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useSWR from 'swr';

interface WeeklyTrendViewerProps {
  capsuleId: string;
}

export default function WeeklyTrendViewer({ capsuleId }: WeeklyTrendViewerProps) {
  const { data: trendData, isLoading } = useSWR(`/api/capsule/analytics/weekly-trend/${capsuleId}`);

  // Generate sample data for demonstration
  const sampleData = [
    { day: 'Mon', views: 15, shares: 3, unlocks: 1 },
    { day: 'Tue', views: 22, shares: 5, unlocks: 2 },
    { day: 'Wed', views: 18, shares: 4, unlocks: 1 },
    { day: 'Thu', views: 35, shares: 8, unlocks: 4 },
    { day: 'Fri', views: 28, shares: 6, unlocks: 3 },
    { day: 'Sat', views: 42, shares: 12, unlocks: 6 },
    { day: 'Sun', views: 31, shares: 7, unlocks: 3 },
  ];

  const data = trendData || sampleData;

  if (isLoading) {
    return (
      <Card className="bg-[#0d1117] border-[#30363d]">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <Calendar className="h-8 w-8 animate-pulse text-[#00ffe1]" />
            <span className="ml-2 text-[#8b949e]">Loading weekly trends...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#0d1117] border-[#30363d]">
      <CardHeader>
        <CardTitle className="text-[#f0f6fc] flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-[#00ffe1]" />
          Weekly Engagement Trends
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
            <XAxis dataKey="day" stroke="#8b949e" fontSize={12} />
            <YAxis stroke="#8b949e" fontSize={12} />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#161b22',
                border: '1px solid #30363d',
                borderRadius: '8px',
                color: '#f0f6fc'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="views" 
              stroke="#00ffe1" 
              strokeWidth={2}
              dot={{ r: 4, fill: '#00ffe1' }}
              activeDot={{ r: 6, fill: '#00ffe1' }}
              name="Views"
            />
            <Line 
              type="monotone" 
              dataKey="shares" 
              stroke="#ff00d4" 
              strokeWidth={2}
              dot={{ r: 4, fill: '#ff00d4' }}
              activeDot={{ r: 6, fill: '#ff00d4' }}
              name="Shares"
            />
            <Line 
              type="monotone" 
              dataKey="unlocks" 
              stroke="#7c3aed" 
              strokeWidth={2}
              dot={{ r: 4, fill: '#7c3aed' }}
              activeDot={{ r: 6, fill: '#7c3aed' }}
              name="Unlocks"
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-[#30363d]">
          <div className="text-center">
            <div className="text-lg font-bold text-[#00ffe1]">
              {data.reduce((sum, day) => sum + day.views, 0)}
            </div>
            <div className="text-xs text-[#8b949e]">Week Total Views</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-[#ff00d4]">
              {data.reduce((sum, day) => sum + day.shares, 0)}
            </div>
            <div className="text-xs text-[#8b949e]">Week Total Shares</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-[#7c3aed]">
              {data.reduce((sum, day) => sum + day.unlocks, 0)}
            </div>
            <div className="text-xs text-[#8b949e]">Week Total Unlocks</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}