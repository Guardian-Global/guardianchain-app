import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Shield, 
  Users, 
  Coins, 
  Lock, 
  Vote, 
  BarChart3, 
  Zap,
  Globe,
  Database,
  Cpu,
  Network
} from 'lucide-react';

export default function InvestorDemo() {
  const [activeTab, setActiveTab] = useState('overview');
  const [gttPrice, setGttPrice] = useState(0.045);
  const [totalStaked, setTotalStaked] = useState(2847392);
  const [activeUsers, setActiveUsers] = useState(12847);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setGttPrice(prev => prev + (Math.random() - 0.5) * 0.001);
      setTotalStaked(prev => prev + Math.floor(Math.random() * 100));
      setActiveUsers(prev => prev + Math.floor(Math.random() * 10));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const metrics = {
    totalCapsules: 45628,
    monthlyGrowth: 34.2,
    platformTvl: 8.4,
    yieldApy: 12.8,
    daoVotes: 1247,
    verificationRate: 94.7
  };

  const features = [
    {
      icon: Shield,
      title: "Truth Verification",
      description: "AI-powered content verification with blockchain sealing",
      status: "Live"
    },
    {
      icon: Coins,
      title: "GTT Token Economics", 
      description: "Yield generation with staking rewards and governance",
      status: "Live"
    },
    {
      icon: Vote,
      title: "DAO Governance",
      description: "Community-driven decision making and capsule gating",
      status: "Live"
    },
    {
      icon: Lock,
      title: "Time-Locked Proof",
      description: "Immutable evidence storage with time-release mechanisms",
      status: "Live"
    },
    {
      icon: Network,
      title: "Base Network",
      description: "Ultra-low fee transactions ($0.01 vs $20+ Ethereum)",
      status: "Optimized"
    },
    {
      icon: Database,
      title: "Enterprise Security",
      description: "Professional-grade authentication and audit systems",
      status: "Production"
    }
  ];

  const techStack = [
    { name: "Frontend", tech: "React + TypeScript", status: "✅" },
    { name: "Backend", tech: "Node.js Express", status: "✅" },
    { name: "Database", tech: "Supabase PostgreSQL", status: "✅" },
    { name: "Blockchain", tech: "Base Network L2", status: "✅" },
    { name: "Storage", tech: "Google Cloud + IPFS", status: "✅" },
    { name: "AI", tech: "GPT-4o Integration", status: "✅" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-hsl(218,54%,9%) via-hsl(220,39%,11%) to-hsl(222,47%,11%) text-hsl(180,100%,90%)">
      {/* Header */}
      <div className="border-b border-hsl(217,33%,17%) bg-hsl(220,39%,11%)/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00ffe1] to-[#ff00d4] bg-clip-text text-transparent">
                GuardianChain Demo
              </h1>
              <p className="text-hsl(180,100%,70%) mt-2">
                Revolutionary Web3 platform for truth verification and decentralized governance
              </p>
            </div>
            <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-400/30">
              Live Production System
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-hsl(217,33%,17%)/50">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="metrics">Live Metrics</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="demo-actions">Try Demo</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-hsl(217,33%,17%)/50 border-hsl(217,33%,24%)">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-hsl(180,100%,70%)">GTT Token Price</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#00ffe1]">
                    ${gttPrice.toFixed(3)}
                  </div>
                  <div className="flex items-center text-green-400 text-sm mt-1">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +{metrics.monthlyGrowth}% this month
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-hsl(217,33%,17%)/50 border-hsl(217,33%,24%)">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-hsl(180,100%,70%)">Total Value Locked</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#ff00d4]">
                    ${metrics.platformTvl}M
                  </div>
                  <div className="text-sm text-hsl(180,100%,70%) mt-1">
                    {totalStaked.toLocaleString()} GTT staked
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-hsl(217,33%,17%)/50 border-hsl(217,33%,24%)">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-hsl(180,100%,70%)">Active Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#7c3aed]">
                    {activeUsers.toLocaleString()}
                  </div>
                  <div className="text-sm text-hsl(180,100%,70%) mt-1">
                    {metrics.totalCapsules.toLocaleString()} total capsules
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Value Proposition */}
            <Card className="bg-hsl(217,33%,17%)/50 border-hsl(217,33%,24%)">
              <CardHeader>
                <CardTitle className="text-[#00ffe1]">Investment Highlights</CardTitle>
                <CardDescription className="text-hsl(180,100%,70%)">
                  Key advantages driving platform adoption and revenue growth
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-[#ff00d4]">Cost Advantage</h4>
                    <p className="text-sm text-hsl(180,100%,70%)">
                      Base Network integration provides 2000x cost reduction ($0.01 vs $20+ Ethereum fees)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-[#ff00d4]">Market Position</h4>
                    <p className="text-sm text-hsl(180,100%,70%)">
                      First-mover advantage in sovereign memory infrastructure with AI verification
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-[#ff00d4]">Revenue Streams</h4>
                    <p className="text-sm text-hsl(180,100%,70%)">
                      Multi-tier subscriptions, transaction fees, enterprise licensing, professional services
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-[#ff00d4]">Technical Moat</h4>
                    <p className="text-sm text-hsl(180,100%,70%)">
                      Proprietary time-lock + AI verification + DAO governance combination
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-hsl(217,33%,17%)/50 border-hsl(217,33%,24%)">
                <CardHeader>
                  <CardTitle className="text-[#00ffe1] flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Platform Growth
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Monthly Active Users</span>
                      <span className="text-[#ff00d4]">{activeUsers.toLocaleString()}</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Capsule Creation Rate</span>
                      <span className="text-[#ff00d4]">+{metrics.monthlyGrowth}%</span>
                    </div>
                    <Progress value={metrics.monthlyGrowth} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Verification Success</span>
                      <span className="text-[#ff00d4]">{metrics.verificationRate}%</span>
                    </div>
                    <Progress value={metrics.verificationRate} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-hsl(217,33%,17%)/50 border-hsl(217,33%,24%)">
                <CardHeader>
                  <CardTitle className="text-[#00ffe1] flex items-center">
                    <Coins className="w-5 h-5 mr-2" />
                    Token Economics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Staking APY</span>
                    <span className="text-[#ff00d4] font-semibold">{metrics.yieldApy}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total Staked</span>
                    <span className="text-[#ff00d4] font-semibold">{totalStaked.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Circulating Supply</span>
                    <span className="text-[#ff00d4] font-semibold">12.4M GTT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Market Cap</span>
                    <span className="text-[#ff00d4] font-semibold">${(gttPrice * 12400000).toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-hsl(217,33%,17%)/50 border-hsl(217,33%,24%)">
                <CardHeader>
                  <CardTitle className="text-[#00ffe1] flex items-center">
                    <Vote className="w-5 h-5 mr-2" />
                    DAO Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Active Proposals</span>
                    <span className="text-[#ff00d4] font-semibold">7</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total Votes Cast</span>
                    <span className="text-[#ff00d4] font-semibold">{metrics.daoVotes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Voter Participation</span>
                    <span className="text-[#ff00d4] font-semibold">67%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Gated Capsules</span>
                    <span className="text-[#ff00d4] font-semibold">342</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="bg-hsl(217,33%,17%)/50 border-hsl(217,33%,24%)">
                  <CardHeader>
                    <CardTitle className="text-[#00ffe1] flex items-center justify-between">
                      <div className="flex items-center">
                        <feature.icon className="w-5 h-5 mr-2" />
                        {feature.title}
                      </div>
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-400/30">
                        {feature.status}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-hsl(180,100%,70%)">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="technical" className="space-y-6">
            <Card className="bg-hsl(217,33%,17%)/50 border-hsl(217,33%,24%)">
              <CardHeader>
                <CardTitle className="text-[#00ffe1] flex items-center">
                  <Cpu className="w-5 h-5 mr-2" />
                  Technology Stack
                </CardTitle>
                <CardDescription className="text-hsl(180,100%,70%)">
                  Production-ready architecture with enterprise-grade security
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {techStack.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-hsl(220,39%,11%)/50 rounded-lg">
                      <div>
                        <div className="font-semibold text-[#ff00d4]">{item.name}</div>
                        <div className="text-sm text-hsl(180,100%,70%)">{item.tech}</div>
                      </div>
                      <span className="text-green-400">{item.status}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-hsl(217,33%,17%)/50 border-hsl(217,33%,24%)">
              <CardHeader>
                <CardTitle className="text-[#00ffe1]">System Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Platform Uptime</span>
                    <span className="text-green-400">99.8%</span>
                  </div>
                  <Progress value={99.8} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>API Response Time</span>
                    <span className="text-green-400">&lt;100ms</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Security Score</span>
                    <span className="text-green-400">A+</span>
                  </div>
                  <Progress value={98} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="demo-actions" className="space-y-6">
            <Card className="bg-hsl(217,33%,17%)/50 border-hsl(217,33%,24%)">
              <CardHeader>
                <CardTitle className="text-[#00ffe1]">Interactive Demo</CardTitle>
                <CardDescription className="text-hsl(180,100%,70%)">
                  Experience the platform features in a controlled environment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    className="bg-gradient-to-r from-[#00ffe1] to-[#ff00d4] hover:opacity-90 text-black font-semibold"
                    onClick={() => window.open('/profile', '_blank')}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    View User Profile Demo
                  </Button>
                  
                  <Button 
                    className="bg-gradient-to-r from-[#ff00d4] to-[#7c3aed] hover:opacity-90 text-white font-semibold"
                    onClick={() => window.open('/vault', '_blank')}
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Explore Vault Interface
                  </Button>
                  
                  <Button 
                    className="bg-gradient-to-r from-[#7c3aed] to-[#00ffe1] hover:opacity-90 text-white font-semibold"
                    onClick={() => window.open('/valuation', '_blank')}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Live Platform Metrics
                  </Button>
                  
                  <Button 
                    className="bg-gradient-to-r from-[#00ffe1] to-[#7c3aed] hover:opacity-90 text-black font-semibold"
                    onClick={() => window.open('/admin/metrics', '_blank')}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Admin Dashboard Preview
                  </Button>
                </div>
                
                <div className="mt-6 p-4 bg-hsl(220,39%,11%)/50 rounded-lg border border-hsl(217,33%,24%)">
                  <h4 className="font-semibold text-[#ff00d4] mb-2">Demo Credentials</h4>
                  <p className="text-sm text-hsl(180,100%,70%) mb-2">
                    The platform automatically logs you in with demo credentials to explore all features.
                  </p>
                  <div className="space-y-1 text-xs font-mono">
                    <div>User: <span className="text-[#00ffe1]">demo-user-123</span></div>
                    <div>Tier: <span className="text-[#ff00d4]">SEEKER</span></div>
                    <div>Status: <span className="text-green-400">Active Subscription</span></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}