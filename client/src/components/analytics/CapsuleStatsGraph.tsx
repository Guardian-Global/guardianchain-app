import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import useSWR from 'swr';
import { BarChart3, TrendingUp } from 'lucide-react';

interface CapsuleStatsGraphProps {
  capsuleId: string;
}

export default function CapsuleStatsGraph({ capsuleId }: CapsuleStatsGraphProps) {
  const { data: stats, isLoading } = useSWR(`/api/capsule/stats/${capsuleId}`);

  if (isLoading) {
    return (
      <div className="bg-[#0d1117] p-6 rounded-xl text-[#f0f6fc] border border-[#30363d]">
        <div className="flex items-center justify-center h-64">
          <BarChart3 className="h-8 w-8 animate-pulse text-[#00ffe1]" />
          <span className="ml-2 text-[#8b949e]">Loading stats...</span>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-[#0d1117] p-6 rounded-xl text-[#f0f6fc] border border-[#30363d]">
        <div className="flex items-center justify-center h-64 text-[#8b949e]">
          <BarChart3 className="h-8 w-8 mr-2" />
          No analytics data available
        </div>
      </div>
    );
  }

  const chartData = [
    { 
      name: "Views", 
      value: parseInt(stats.views) || 0, 
      color: "#00ffe1" 
    },
    { 
      name: "Shares", 
      value: parseInt(stats.shares) || 0, 
      color: "#ff00d4" 
    },
    { 
      name: "Unlocks", 
      value: parseInt(stats.unlocks) || 0, 
      color: "#7c3aed" 
    },
  ];

  const maxValue = Math.max(...chartData.map(d => d.value));

  return (
    <div className="bg-[#0d1117] p-6 rounded-xl shadow-lg border border-[#30363d]">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="h-6 w-6 text-[#00ffe1]" />
        <h3 className="text-xl font-bold text-[#f0f6fc]">Capsule Analytics</h3>
        <div className="ml-auto flex items-center text-xs text-[#8b949e]">
          <TrendingUp className="h-3 w-3 mr-1" />
          Last updated: {new Date(stats.lastViewedAt).toLocaleDateString()}
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis 
            dataKey="name" 
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
              `${value} ${name.toLowerCase()}`,
              name
            ]}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-[#30363d]">
        <div className="text-center">
          <div className="text-2xl font-bold text-[#00ffe1]">
            {chartData[0].value.toLocaleString()}
          </div>
          <div className="text-xs text-[#8b949e]">Total Views</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-[#ff00d4]">
            {chartData[1].value.toLocaleString()}
          </div>
          <div className="text-xs text-[#8b949e]">Shares</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-[#7c3aed]">
            {chartData[2].value.toLocaleString()}
          </div>
          <div className="text-xs text-[#8b949e]">Unlocks</div>
        </div>
      </div>

      {/* Engagement Rate */}
      <div className="mt-4 p-3 bg-[#161b22] rounded-lg border border-[#30363d]">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#8b949e]">Engagement Rate:</span>
          <span className="text-sm font-bold text-[#00ffe1]">
            {maxValue > 0 ? Math.round(((chartData[1].value + chartData[2].value) / chartData[0].value) * 100) : 0}%
          </span>
        </div>
        <div className="text-xs text-[#8b949e] mt-1">
          Based on shares and unlocks vs views
        </div>
      </div>
    </div>
  );
}