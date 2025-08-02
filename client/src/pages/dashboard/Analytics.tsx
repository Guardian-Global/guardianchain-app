import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Zap, Shield, Globe, BarChart3, PieChart, Activity } from 'lucide-react';
import CardGlass from '@/components/ui/CardGlass';
import { Badge } from '@/components/ui/badge';
import GlowButton from '@/components/ui/GlowButton';

interface AnalyticsData {
  total: number;
  minted: number;
  sealed: number;
  verified: number;
  languages: string[];
  growth: {
    capsules: number;
    users: number;
    gtt: number;
  };
  categories: {
    name: string;
    count: number;
    percentage: number;
  }[];
}

const mockData: AnalyticsData = {
  total: 2847,
  minted: 1256,
  sealed: 847,
  verified: 1893,
  languages: ['en', 'es', 'fr', 'ar', 'zh', 'hi', 'pt', 'ru'],
  growth: {
    capsules: 24,
    users: 18,
    gtt: 32
  },
  categories: [
    { name: 'Personal Legacy', count: 1204, percentage: 42.3 },
    { name: 'Whistleblower', count: 568, percentage: 19.9 },
    { name: 'Legal Evidence', count: 426, percentage: 15.0 },
    { name: 'Environmental', count: 312, percentage: 11.0 },
    { name: 'Corporate', count: 227, percentage: 8.0 },
    { name: 'Other', count: 110, percentage: 3.8 }
  ]
};

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      try {
        // In production, this would fetch from /api/analytics/capsules
        await new Promise(resolve => setTimeout(resolve, 1000));
        setData(mockData);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
        setData(mockData); // Fallback to mock data
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center text-slate-400">
        <p>Failed to load analytics data</p>
      </div>
    );
  }

  const metrics = [
    {
      label: 'Total Capsules',
      value: data.total.toLocaleString(),
      icon: Zap,
      change: `+${data.growth.capsules}%`,
      color: 'text-blue-400'
    },
    {
      label: 'NFTs Minted',
      value: data.minted.toLocaleString(),
      icon: Shield,
      change: '+15%',
      color: 'text-green-400'
    },
    {
      label: 'Truth Sealed',
      value: data.sealed.toLocaleString(),
      icon: Activity,
      change: '+28%',
      color: 'text-purple-400'
    },
    {
      label: 'Verified Content',
      value: data.verified.toLocaleString(),
      icon: Users,
      change: '+12%',
      color: 'text-orange-400'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Capsule Analytics
          </h1>
          <p className="text-slate-400 mt-2">Real-time insights into truth preservation network</p>
        </div>
        
        <div className="flex gap-2">
          <GlowButton variant="secondary" size="sm">
            <BarChart3 className="w-4 h-4 mr-2" />
            Export Data
          </GlowButton>
          <GlowButton variant="primary" size="sm">
            <TrendingUp className="w-4 h-4 mr-2" />
            Live View
          </GlowButton>
        </div>
      </div>

      {/* Key Metrics */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <CardGlass key={metric.label} hover>
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-6 h-6 ${metric.color}`} />
                <Badge variant="secondary" className="text-xs">
                  {metric.change}
                </Badge>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
              <div className="text-sm text-slate-400">{metric.label}</div>
            </CardGlass>
          );
        })}
      </section>

      {/* Categories Breakdown */}
      <section className="grid md:grid-cols-2 gap-6">
        <CardGlass>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-blue-400" />
            Content Categories
          </h3>
          
          <div className="space-y-3">
            {data.categories.map((category, index) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-3"
                    style={{ 
                      backgroundColor: `hsl(${(index * 60) % 360}, 70%, 50%)` 
                    }}
                  />
                  <span className="text-slate-300">{category.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">{category.count}</div>
                  <div className="text-xs text-slate-400">{category.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </CardGlass>

        <CardGlass>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Globe className="w-5 h-5 mr-2 text-green-400" />
            Global Reach
          </h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-300">Active Languages</span>
                <span className="text-white font-semibold">{data.languages.length}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.languages.map((lang) => (
                  <Badge key={lang} variant="secondary" className="text-xs">
                    {lang.toUpperCase()}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="border-t border-white/10 pt-4">
              <div className="text-sm text-slate-400 mb-2">Growth Metrics</div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-300">Capsule Growth</span>
                  <span className="text-green-400">+{data.growth.capsules}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">User Growth</span>
                  <span className="text-green-400">+{data.growth.users}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">GTT Distribution</span>
                  <span className="text-green-400">+{data.growth.gtt}%</span>
                </div>
              </div>
            </div>
          </div>
        </CardGlass>
      </section>

      {/* Performance Summary */}
      <CardGlass gradient>
        <h3 className="text-lg font-semibold text-white mb-4">Performance Summary</h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {((data.verified / data.total) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-slate-300">Verification Rate</div>
            <div className="text-xs text-slate-400 mt-1">
              High-quality content standards maintained
            </div>
          </div>
          
          <div>
            <div className="text-2xl font-bold text-green-400 mb-1">
              {((data.minted / data.total) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-slate-300">NFT Conversion</div>
            <div className="text-xs text-slate-400 mt-1">
              Strong blockchain adoption rate
            </div>
          </div>
          
          <div>
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {((data.sealed / data.total) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-slate-300">Time-Lock Usage</div>
            <div className="text-xs text-slate-400 mt-1">
              Advanced encryption feature adoption
            </div>
          </div>
        </div>
      </CardGlass>
    </div>
  );
}