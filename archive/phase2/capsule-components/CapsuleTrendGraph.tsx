import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import useSWR from 'swr';
import { TrendingUp, Activity } from 'lucide-react';

interface CapsuleTrendGraphProps {
  capsuleId: string;
}

export default function CapsuleTrendGraph({ capsuleId }: CapsuleTrendGraphProps) {
  const { data: trendData, isLoading } = useSWR(`/api/capsule/analytics/trends/${capsuleId}`);
  const { data: spikesData } = useSWR(`/api/capsule/analytics/spikes/${capsuleId}`);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-[#8b949e]">
        <Activity className="h-6 w-6 animate-spin mr-2" />
        Loading trend data...
      </div>
    );
  }

  if (!trendData || trendData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-[#8b949e]">
        <TrendingUp className="h-6 w-6 mr-2" />
        No interaction data available yet
      </div>
    );
  }

  // Process data for chart
  const chartData = trendData.map((item: any) => ({
    day: new Date(item.day).toLocaleDateString(),
    interactions: parseInt(item.interactions),
    isSpike: spikesData?.some((spike: any) => 
      new Date(spike.spikeDate).toDateString() === new Date(item.day).toDateString()
    )
  }));

  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (payload.isSpike) {
      return (
        <circle 
          cx={cx} 
          cy={cy} 
          r={6} 
          fill="#ff00d4" 
          stroke="#ff00d4" 
          strokeWidth={2} 
          className="animate-pulse"
        />
      );
    }
    return null;
  };

  return (
    <div className="bg-[#0d1117] p-6 rounded-xl text-[#f0f6fc]">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-[#00ffe1]" />
        <h3 className="text-xl font-bold text-[#00ffe1]">Daily Interaction Trends</h3>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <XAxis 
            dataKey="day" 
            stroke="#8b949e" 
            fontSize={12}
            tick={{ fill: '#8b949e' }}
          />
          <YAxis 
            stroke="#8b949e" 
            fontSize={12}
            tick={{ fill: '#8b949e' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#161b22',
              border: '1px solid #30363d',
              borderRadius: '8px',
              color: '#f0f6fc'
            }}
            formatter={(value: any, name: string) => [
              `${value} interactions`,
              'Daily Activity'
            ]}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Line 
            type="monotone" 
            dataKey="interactions" 
            stroke="#00ffe1" 
            strokeWidth={2}
            dot={<CustomDot />}
            activeDot={{ r: 4, fill: '#00ffe1' }}
          />
        </LineChart>
      </ResponsiveContainer>

      {spikesData && spikesData.length > 0 && (
        <div className="mt-4 p-3 bg-[#161b22] rounded-lg border border-[#30363d]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-[#ff00d4] animate-pulse"></div>
            <span className="text-sm text-[#ff00d4] font-semibold">Activity Spikes Detected</span>
          </div>
          <p className="text-xs text-[#8b949e]">
            Pink dots indicate abnormal activity spikes. Total spikes detected: {spikesData.length}
          </p>
        </div>
      )}
    </div>
  );
}