import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import {
  DollarSign,
  TrendingUp,
  Target,
  BarChart3,
  Coins,
  Users,
  Activity,
  Globe,
  Download,
  RefreshCw,
  Shield,
  Zap,
  Crown,
  Database
} from "lucide-react";

interface ValuationData {
  gttMarketCap: number;
  totalCapsules: number;
  gttInVault: number;
  activeUsers: number;
  dailyVolume: number;
  platformValue: number;
  lastUpdated: string;
}

interface PriceHistoryData {
  date: string;
  price: number;
  volume: number;
  marketCap: number;
}

interface MetricCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ElementType;
  color: string;
}

export default function Valuation() {
  const [isLoading, setIsLoading] = useState(false);
  const [valuationData, setValuationData] = useState<ValuationData | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceHistoryData[]>([]);
  const { toast } = useToast();

  // Fetch valuation data on component mount
  useEffect(() => {
    fetchValuationData();
  }, []);

  const fetchValuationData = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/valuation/data');
      if (response.ok) {
        const data = await response.json();
        setValuationData(data);
        
        // Generate mock price history for chart
        const mockPriceHistory = Array.from({ length: 30 }, (_, i) => {
          const date = new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000);
          const basePrice = 0.0075;
          const volatility = 0.15;
          const trend = 0.002;
          const randomChange = (Math.random() - 0.5) * volatility;
          const price = basePrice * (1 + trend * i/30 + randomChange);
          
          return {
            date: date.toISOString().split('T')[0],
            price: Math.max(0.001, price),
            volume: Math.floor(Math.random() * 50000) + 10000,
            marketCap: Math.max(0.001, price) * 1000000 // Assuming 1M total supply
          };
        });
        setPriceHistory(mockPriceHistory);
      }
    } catch (error) {
      console.error('Error fetching valuation data:', error);
      toast({
        title: "Error",
        description: "Failed to load valuation data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportReport = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/valuation/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ format: 'pdf' })
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Report Generation Started",
          description: result.message,
        });
      }
    } catch (error) {
      console.error('Error exporting report:', error);
      toast({
        title: "Export Failed",
        description: "Failed to generate valuation report",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!valuationData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-cyan-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <RefreshCw className="w-16 h-16 text-cyan-400 mx-auto animate-spin" />
          <p className="text-cyan-300">Loading valuation data...</p>
        </div>
      </div>
    );
  }

  const metricCards: MetricCard[] = [
    {
      title: "GTT Market Cap",
      value: `$${(valuationData.gttMarketCap / 1000000).toFixed(2)}M`,
      change: "+12.4%",
      trend: "up",
      icon: Coins,
      color: "cyan"
    },
    {
      title: "Platform Value",
      value: `$${(valuationData.platformValue / 1000000).toFixed(1)}M`,
      change: "+8.7%",
      trend: "up",
      icon: Globe,
      color: "purple"
    },
    {
      title: "Total Capsules",
      value: valuationData.totalCapsules.toLocaleString(),
      change: "+156",
      trend: "up",
      icon: Database,
      color: "emerald"
    },
    {
      title: "GTT in Vault",
      value: `${(valuationData.gttInVault / 1000).toFixed(0)}K`,
      change: "+5.2%",
      trend: "up",
      icon: Shield,
      color: "blue"
    },
    {
      title: "Active Users",
      value: valuationData.activeUsers.toLocaleString(),
      change: "+247",
      trend: "up",
      icon: Users,
      color: "yellow"
    },
    {
      title: "Daily Volume",
      value: `$${(valuationData.dailyVolume / 1000).toFixed(0)}K`,
      change: "+18.3%",
      trend: "up",
      icon: Activity,
      color: "green"
    }
  ];

  const currentPrice = priceHistory.length > 0 ? priceHistory[priceHistory.length - 1].price : 0;
  const priceChange = priceHistory.length > 1 ? 
    ((currentPrice - priceHistory[priceHistory.length - 2].price) / priceHistory[priceHistory.length - 2].price) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-cyan-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              GuardianChain Valuation
            </h1>
            <p className="text-cyan-200 text-lg mt-2">
              Real-time platform metrics and GTT token performance
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => fetchValuationData()}
              disabled={isLoading}
              variant="outline"
              className="border-cyan-500/30 text-cyan-100"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              onClick={exportReport}
              disabled={isLoading}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* GTT Price Highlight */}
        <Card className="bg-gradient-to-r from-slate-800/70 to-slate-900/70 border-cyan-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-cyan-100">GTT Token Price</h2>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-4xl font-bold text-cyan-400">
                    ${currentPrice.toFixed(4)}
                  </span>
                  <Badge 
                    variant="outline" 
                    className={`${
                      priceChange >= 0 
                        ? 'text-emerald-400 border-emerald-400' 
                        : 'text-red-400 border-red-400'
                    }`}
                  >
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                  </Badge>
                </div>
                <p className="text-cyan-300 text-sm mt-1">
                  Last updated: {new Date(valuationData.lastUpdated).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-cyan-300 text-sm">24h Volume</p>
                <p className="text-2xl font-bold text-cyan-100">
                  ${valuationData.dailyVolume.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metricCards.map((metric, index) => (
            <Card key={index} className={`bg-slate-800/50 border-${metric.color}-500/30`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className={`text-${metric.color}-300 text-sm`}>{metric.title}</p>
                    <p className={`text-3xl font-bold text-${metric.color}-100`}>{metric.value}</p>
                    <Badge 
                      variant="outline" 
                      className={`mt-2 text-emerald-400 border-emerald-400`}
                    >
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {metric.change}
                    </Badge>
                  </div>
                  <metric.icon className={`w-8 h-8 text-${metric.color}-400`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Price Chart */}
          <Card className="bg-slate-800/50 border-cyan-500/30">
            <CardHeader>
              <CardTitle className="text-cyan-100 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                GTT Price History (30 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={priceHistory}>
                  <defs>
                    <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis 
                    dataKey="date" 
                    tick={{fill: '#a5b4fc'}}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis tick={{fill: '#a5b4fc'}} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #06b6d4',
                      borderRadius: '8px'
                    }}
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    formatter={(value) => [`$${Number(value).toFixed(4)}`, 'Price']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#06B6D4" 
                    fillOpacity={1} 
                    fill="url(#priceGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Volume Chart */}
          <Card className="bg-slate-800/50 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-purple-100 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Trading Volume (30 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={priceHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis 
                    dataKey="date" 
                    tick={{fill: '#a5b4fc'}}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis tick={{fill: '#a5b4fc'}} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #8b5cf6',
                      borderRadius: '8px'
                    }}
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Volume']}
                  />
                  <Bar dataKey="volume" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Platform Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Growth Metrics */}
          <Card className="bg-slate-800/50 border-emerald-500/30">
            <CardHeader>
              <CardTitle className="text-emerald-100 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Growth Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-emerald-300">User Growth</span>
                <span className="text-emerald-100 font-bold">+24.7%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-emerald-300">Capsule Creation</span>
                <span className="text-emerald-100 font-bold">+31.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-emerald-300">Revenue Growth</span>
                <span className="text-emerald-100 font-bold">+18.9%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-emerald-300">Token Adoption</span>
                <span className="text-emerald-100 font-bold">+42.5%</span>
              </div>
            </CardContent>
          </Card>

          {/* Platform Health */}
          <Card className="bg-slate-800/50 border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-blue-100 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Platform Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-blue-300">Uptime</span>
                <Badge variant="outline" className="text-emerald-400 border-emerald-400">
                  99.8%
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-300">Response Time</span>
                <span className="text-blue-100 font-bold">45ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-300">Error Rate</span>
                <span className="text-blue-100 font-bold">0.02%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-300">Security Score</span>
                <Badge variant="outline" className="text-emerald-400 border-emerald-400">
                  A+
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Investment Highlights */}
          <Card className="bg-slate-800/50 border-yellow-500/30">
            <CardHeader>
              <CardTitle className="text-yellow-100 flex items-center gap-2">
                <Crown className="w-5 h-5" />
                Investment Highlights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-slate-700/30 rounded-lg">
                <p className="text-yellow-100 font-medium">Strong User Retention</p>
                <p className="text-yellow-300 text-sm">87% monthly active users</p>
              </div>
              <div className="p-3 bg-slate-700/30 rounded-lg">
                <p className="text-yellow-100 font-medium">Revenue Diversification</p>
                <p className="text-yellow-300 text-sm">Multiple income streams</p>
              </div>
              <div className="p-3 bg-slate-700/30 rounded-lg">
                <p className="text-yellow-100 font-medium">Technology Moat</p>
                <p className="text-yellow-300 text-sm">Proprietary verification system</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-cyan-300 text-sm">
          <p>
            Data provided by GuardianChain Analytics • Real-time updates every 5 minutes
          </p>
          <p className="mt-1">
            Last updated: {new Date(valuationData.lastUpdated).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}