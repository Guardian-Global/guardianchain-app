import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import {
  TrendingUp,
  DollarSign,
  Users,
  Activity,
  Coins,
  FileText,
  Download,
  Eye,
  BarChart3,
  PieChart as PieChartIcon,
  Calculator,
  Zap
} from "lucide-react";

interface ValuationData {
  gttMarketCap: number;
  totalCapsules: number;
  gttInVault: number;
  activeUsers: number;
  dailyVolume: number;
  platformValue: number;
}

interface TokenomicsData {
  totalSupply: number;
  circulating: number;
  staked: number;
  rewards: number;
  burned: number;
}

export default function Valuation() {
  const [valuationData, setValuationData] = useState<ValuationData>({
    gttMarketCap: 2450000,
    totalCapsules: 12847,
    gttInVault: 856234,
    activeUsers: 5691,
    dailyVolume: 42850,
    platformValue: 8750000
  });

  const [tokenomicsData, setTokenomicsData] = useState<TokenomicsData>({
    totalSupply: 100000000,
    circulating: 65000000,
    staked: 15000000,
    rewards: 5000000,
    burned: 2000000
  });

  const [priceHistory, setPriceHistory] = useState([
    { date: '2025-07-01', price: 0.0068, volume: 38450 },
    { date: '2025-07-08', price: 0.0071, volume: 41200 },
    { date: '2025-07-15', price: 0.0069, volume: 39800 },
    { date: '2025-07-22', price: 0.0073, volume: 44300 },
    { date: '2025-07-29', price: 0.0075, volume: 42850 },
    { date: '2025-08-05', price: 0.0078, volume: 45600 }
  ]);

  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const fetchValuationData = async () => {
      try {
        const response = await fetch("/api/valuation/data");
        if (response.ok) {
          const data = await response.json();
          setValuationData(data);
        }
      } catch (error) {
        console.error("Failed to fetch valuation data:", error);
      }
    };

    fetchValuationData();
  }, []);

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const response = await fetch("/api/valuation/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ format: "pdf" })
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `guardian-chain-valuation-${new Date().toISOString().split('T')[0]}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const tokenDistribution = [
    { name: 'Circulating', value: tokenomicsData.circulating, color: '#00ffe1' },
    { name: 'Staked', value: tokenomicsData.staked, color: '#ff00d4' },
    { name: 'Rewards Pool', value: tokenomicsData.rewards, color: '#7c3aed' },
    { name: 'Burned', value: tokenomicsData.burned, color: '#ef4444' },
    { name: 'Reserved', value: tokenomicsData.totalSupply - tokenomicsData.circulating - tokenomicsData.staked - tokenomicsData.rewards - tokenomicsData.burned, color: '#6b7280' }
  ];

  const platformMetrics = [
    { name: 'User Growth', value: 234, change: '+12%' },
    { name: 'Capsule Creation', value: 189, change: '+8%' },
    { name: 'Verification Rate', value: 94.2, change: '+2.1%' },
    { name: 'GTT Velocity', value: 1.45, change: '+0.15%' }
  ];

  return (
    <div className="min-h-screen bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">📈 Platform Valuation</h1>
            <p className="text-brand-text-muted">
              Comprehensive valuation metrics and tokenomics analysis
            </p>
          </div>
          
          <Button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="bg-brand-accent hover:bg-brand-accent/90"
          >
            {isExporting ? (
              <>
                <Activity className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </>
            )}
          </Button>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-brand-secondary border-brand-surface">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-brand-text-muted text-sm">GTT Market Cap</p>
                  <p className="text-2xl font-bold text-brand-accent">
                    ${(valuationData.gttMarketCap / 1000000).toFixed(2)}M
                  </p>
                  <p className="text-green-400 text-sm">+15.3% this month</p>
                </div>
                <DollarSign className="w-8 h-8 text-brand-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-brand-secondary border-brand-surface">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-brand-text-muted text-sm">Total Capsules</p>
                  <p className="text-2xl font-bold text-white">
                    {valuationData.totalCapsules.toLocaleString()}
                  </p>
                  <p className="text-green-400 text-sm">+284 today</p>
                </div>
                <FileText className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-brand-secondary border-brand-surface">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-brand-text-muted text-sm">GTT in Vault</p>
                  <p className="text-2xl font-bold text-white">
                    {(valuationData.gttInVault / 1000).toFixed(0)}K
                  </p>
                  <p className="text-blue-400 text-sm">12.4% of supply</p>
                </div>
                <Coins className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-brand-secondary border-brand-surface">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-brand-text-muted text-sm">Active Users</p>
                  <p className="text-2xl font-bold text-white">
                    {(valuationData.activeUsers / 1000).toFixed(1)}K
                  </p>
                  <p className="text-green-400 text-sm">+8.7% this week</p>
                </div>
                <Users className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-brand-surface max-w-2xl">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tokenomics">Tokenomics</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="projections">Projections</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Price History Chart */}
              <Card className="bg-brand-secondary border-brand-surface">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    GTT Price History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={priceHistory}>
                      <XAxis 
                        dataKey="date" 
                        stroke="#8b949e" 
                        fontSize={12}
                        tick={{ fill: '#8b949e' }}
                      />
                      <YAxis 
                        stroke="#8b949e" 
                        fontSize={12}
                        tick={{ fill: '#8b949e' }}
                        domain={['dataMin * 0.95', 'dataMax * 1.05']}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#161b22',
                          border: '1px solid #30363d',
                          borderRadius: '8px',
                          color: '#f0f6fc'
                        }}
                        formatter={(value: any) => [`$${value}`, 'Price']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#00ffe1" 
                        strokeWidth={3}
                        dot={{ fill: '#00ffe1', r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Platform Value Breakdown */}
              <Card className="bg-brand-secondary border-brand-surface">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Platform Valuation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-brand-accent mb-1">
                      ${(valuationData.platformValue / 1000000).toFixed(1)}M
                    </div>
                    <p className="text-brand-text-muted">Estimated Platform Value</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-brand-text-muted">Token Market Cap</span>
                      <span className="font-semibold">${(valuationData.gttMarketCap / 1000000).toFixed(2)}M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-text-muted">Staked Value (TVL)</span>
                      <span className="font-semibold">${((valuationData.gttInVault * 0.0075) / 1000000).toFixed(2)}M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-text-muted">Revenue Multiple</span>
                      <span className="font-semibold">12.5x</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-text-muted">User Value</span>
                      <span className="font-semibold">${(valuationData.platformValue / valuationData.activeUsers).toFixed(0)}/user</span>
                    </div>
                  </div>

                  <Badge className="w-full justify-center bg-green-500/20 text-green-400 border-green-500">
                    +23% Month-over-Month Growth
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {/* Platform Metrics */}
            <Card className="bg-brand-secondary border-brand-surface">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Key Performance Indicators
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {platformMetrics.map((metric, index) => (
                    <div key={index} className="text-center p-4 bg-brand-surface rounded-lg">
                      <div className="text-2xl font-bold text-white mb-1">
                        {typeof metric.value === 'number' && metric.value > 10 
                          ? metric.value.toFixed(0)
                          : metric.value
                        }
                        {metric.name === 'Verification Rate' ? '%' : ''}
                      </div>
                      <div className="text-sm text-brand-text-muted mb-2">{metric.name}</div>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500 text-xs">
                        {metric.change}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tokenomics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Token Distribution Chart */}
              <Card className="bg-brand-secondary border-brand-surface">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="w-5 h-5" />
                    Token Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={tokenDistribution}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                      >
                        {tokenDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#161b22',
                          border: '1px solid #30363d',
                          borderRadius: '8px',
                          color: '#f0f6fc'
                        }}
                        formatter={(value: any) => [value.toLocaleString(), 'Tokens']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Token Metrics */}
              <Card className="bg-brand-secondary border-brand-surface">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Coins className="w-5 h-5" />
                    Token Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-brand-surface rounded-lg">
                      <div className="text-lg font-bold text-brand-accent">
                        {(tokenomicsData.totalSupply / 1000000).toFixed(0)}M
                      </div>
                      <div className="text-sm text-brand-text-muted">Total Supply</div>
                    </div>
                    <div className="text-center p-3 bg-brand-surface rounded-lg">
                      <div className="text-lg font-bold text-white">
                        ${((tokenomicsData.circulating * 0.0075) / 1000000).toFixed(1)}M
                      </div>
                      <div className="text-sm text-brand-text-muted">Market Cap</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-brand-text-muted">Circulating Supply</span>
                      <span className="font-semibold">{(tokenomicsData.circulating / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-text-muted">Staking Ratio</span>
                      <span className="font-semibold">{((tokenomicsData.staked / tokenomicsData.circulating) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-text-muted">Burn Rate</span>
                      <span className="font-semibold">0.5% monthly</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-text-muted">Inflation Rate</span>
                      <span className="font-semibold text-green-400">-2.1% (deflationary)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            <Card className="bg-brand-secondary border-brand-surface">
              <CardHeader>
                <CardTitle>Platform Activity Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={priceHistory}>
                    <XAxis dataKey="date" stroke="#8b949e" />
                    <YAxis stroke="#8b949e" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#161b22',
                        border: '1px solid #30363d',
                        borderRadius: '8px',
                        color: '#f0f6fc'
                      }}
                    />
                    <Bar dataKey="volume" fill="#00ffe1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projections" className="space-y-6">
            <Card className="bg-brand-secondary border-brand-surface">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  AI-Generated Projections
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-brand-surface rounded-lg">
                    <div className="text-2xl font-bold text-green-400 mb-2">$15.2M</div>
                    <div className="text-sm text-brand-text-muted">6-Month Target</div>
                    <div className="text-xs text-green-400 mt-1">+74% Growth</div>
                  </div>
                  <div className="text-center p-4 bg-brand-surface rounded-lg">
                    <div className="text-2xl font-bold text-blue-400 mb-2">25K</div>
                    <div className="text-sm text-brand-text-muted">Projected Users</div>
                    <div className="text-xs text-blue-400 mt-1">+340% Growth</div>
                  </div>
                  <div className="text-center p-4 bg-brand-surface rounded-lg">
                    <div className="text-2xl font-bold text-purple-400 mb-2">$0.025</div>
                    <div className="text-sm text-brand-text-muted">GTT Price Target</div>
                    <div className="text-xs text-purple-400 mt-1">+233% Upside</div>
                  </div>
                </div>

                <div className="p-4 bg-brand-surface rounded-lg">
                  <h4 className="font-semibold mb-2">Key Growth Drivers:</h4>
                  <ul className="space-y-1 text-sm text-brand-text-muted">
                    <li>• Enterprise adoption increasing verification volume</li>
                    <li>• Cross-chain expansion reducing transaction costs</li>
                    <li>• DAO governance driving community engagement</li>
                    <li>• Institutional partnerships accelerating growth</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}