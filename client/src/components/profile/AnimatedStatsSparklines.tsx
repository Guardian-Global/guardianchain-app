import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Activity, Eye, Share2, Zap } from 'lucide-react';

interface SparklineData {
  value: number;
  timestamp: number;
}

interface StatCard {
  id: string;
  title: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  sparklineData: SparklineData[];
  icon: React.ReactNode;
  color: string;
}

const generateSparklineData = (baseValue: number, points: number = 20): SparklineData[] => {
  const data: SparklineData[] = [];
  const now = Date.now();
  
  for (let i = points - 1; i >= 0; i--) {
    const variance = (Math.random() - 0.5) * 0.3; // ±15% variance
    const value = Math.max(0, Math.floor(baseValue * (1 + variance)));
    data.push({
      value,
      timestamp: now - (i * 60000) // 1 minute intervals
    });
  }
  
  return data;
};

const Sparkline: React.FC<{ data: SparklineData[]; color: string }> = ({ data, color }) => {
  if (data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((point.value - minValue) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full h-12 relative">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0"
      >
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          className="animate-pulse"
        />
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline
          points={`0,100 ${points} 100,100`}
          fill={`url(#gradient-${color})`}
          className="animate-pulse"
        />
      </svg>
    </div>
  );
};

export function AnimatedStatsSparklines() {
  const [stats, setStats] = useState<StatCard[]>([]);

  useEffect(() => {
    // Initialize stats with sparkline data
    const initialStats: StatCard[] = [
      {
        id: 'views',
        title: 'Profile Views',
        value: 3245,
        change: 12.5,
        trend: 'up',
        sparklineData: generateSparklineData(3245),
        icon: <Eye className="h-4 w-4" />,
        color: '#00ffe1'
      },
      {
        id: 'engagements',
        title: 'Engagements',
        value: 892,
        change: -2.1,
        trend: 'down',
        sparklineData: generateSparklineData(892),
        icon: <Activity className="h-4 w-4" />,
        color: '#ff00d4'
      },
      {
        id: 'shares',
        title: 'Shares',
        value: 156,
        change: 8.7,
        trend: 'up',
        sparklineData: generateSparklineData(156),
        icon: <Share2 className="h-4 w-4" />,
        color: '#7c3aed'
      },
      {
        id: 'gtt_velocity',
        title: 'GTT Velocity',
        value: 24.7,
        change: 15.3,
        trend: 'up',
        sparklineData: generateSparklineData(24.7),
        icon: <Zap className="h-4 w-4" />,
        color: '#f59e0b'
      }
    ];

    setStats(initialStats);

    // Update stats every 5 seconds for real-time feel
    const interval = setInterval(() => {
      setStats(prevStats => 
        prevStats.map(stat => ({
          ...stat,
          value: Math.max(0, stat.value + (Math.random() - 0.5) * 10),
          change: (Math.random() - 0.5) * 30,
          trend: Math.random() > 0.5 ? 'up' : 'down',
          sparklineData: [
            ...stat.sparklineData.slice(1),
            {
              value: Math.max(0, stat.value + (Math.random() - 0.5) * (stat.value * 0.1)),
              timestamp: Date.now()
            }
          ]
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card 
          key={stat.id} 
          className="bg-[#161b22] border-[#30363d] hover:border-[#00ffe1]/30 transition-all duration-300"
          data-testid={`stat-card-${stat.id}`}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div style={{ color: stat.color }}>
                  {stat.icon}
                </div>
                <CardTitle className="text-sm font-medium text-[#8b949e]">
                  {stat.title}
                </CardTitle>
              </div>
              <div className="flex items-center gap-1">
                {stat.trend === 'up' ? (
                  <TrendingUp className="h-3 w-3 text-green-400" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-400" />
                )}
                <span className={`text-xs ${
                  stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.change > 0 ? '+' : ''}{stat.change.toFixed(1)}%
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="mb-2">
              <span className="text-2xl font-bold text-[#f0f6fc]">
                {typeof stat.value === 'number' && stat.value % 1 !== 0 
                  ? stat.value.toFixed(1) 
                  : Math.floor(stat.value).toLocaleString()
                }
              </span>
            </div>
            <Sparkline data={stat.sparklineData} color={stat.color} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}