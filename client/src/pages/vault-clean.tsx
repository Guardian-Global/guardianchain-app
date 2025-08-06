import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import {
  Vault,
  Lock,
  Unlock,
  Clock,
  Coins,
  TrendingUp,
  Target,
  Shield,
  Zap,
  Award,
  Activity,
  BarChart3,
  Calendar,
  DollarSign,
  Percent,
  Timer
} from "lucide-react";

interface VaultCapsule {
  id: string;
  title: string;
  lockedAmount: number;
  unlockDate: string;
  currentValue: number;
  appreciationRate: number;
  isMatured: boolean;
  category: string;
  riskLevel: 'low' | 'medium' | 'high';
}

interface StakeData {
  gttAmount: number;
  duration: number;
  apy: number;
  maturityDate: string;
  status: 'active' | 'matured' | 'claimed';
  rewards: number;
}

interface UnlockTrendData {
  day: string;
  unlocks: number;
  isSpike: boolean;
}

export default function VaultClean() {
  const [activeTab, setActiveTab] = useState("overview");
  const [gttAmount, setGttAmount] = useState("");
  const [stakeDuration, setStakeDuration] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [vaultCapsules, setVaultCapsules] = useState<VaultCapsule[]>([]);
  const [stakeData, setStakeData] = useState<StakeData[]>([]);
  const [unlockTrend, setUnlockTrend] = useState<UnlockTrendData[]>([]);
  const [gttBalance, setGttBalance] = useState(0);
  const { toast } = useToast();

  // Fetch vault data on component mount
  useEffect(() => {
    fetchVaultData();
  }, []);

  const fetchVaultData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch vault capsules
      const capsulesResponse = await fetch('/api/vault/capsules');
      if (capsulesResponse.ok) {
        const capsules = await capsulesResponse.json();
        setVaultCapsules(capsules);
      }

      // Fetch unlock trend data
      const trendResponse = await fetch('/api/vault/unlock-trend');
      if (trendResponse.ok) {
        const trend = await trendResponse.json();
        setUnlockTrend(trend);
      }

      // Fetch GTT balance
      const balanceResponse = await fetch('/api/vault/gtt-balance');
      if (balanceResponse.ok) {
        const balance = await balanceResponse.json();
        setGttBalance(balance.amount);
      }

      // Fetch existing stakes
      const stakesResponse = await fetch('/api/yield/stakes');
      if (stakesResponse.ok) {
        const stakes = await stakesResponse.json();
        setStakeData(stakes);
      }

    } catch (error) {
      console.error('Error fetching vault data:', error);
      toast({
        title: "Error",
        description: "Failed to load vault data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAPY = (duration: number) => {
    // Simple APY calculation based on duration
    const baseAPY = 12; // 12% base APY
    const bonusAPY = Math.min(duration / 10, 15); // Up to 15% bonus for longer durations
    return baseAPY + bonusAPY;
  };

  const handleStakeGTT = async () => {
    if (!gttAmount || parseFloat(gttAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid GTT amount",
        variant: "destructive"
      });
      return;
    }

    if (parseFloat(gttAmount) > gttBalance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough GTT tokens",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await fetch('/api/yield/stake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gttAmount: parseFloat(gttAmount),
          daysLocked: stakeDuration
        })
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Stake Created Successfully",
          description: `Staked ${gttAmount} GTT for ${stakeDuration} days at ${calculateAPY(stakeDuration).toFixed(1)}% APY`,
        });
        
        // Reset form and refresh data
        setGttAmount("");
        fetchVaultData();
      } else {
        throw new Error('Failed to create stake');
      }
    } catch (error) {
      console.error('Error staking GTT:', error);
      toast({
        title: "Staking Failed",
        description: "Failed to create stake. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const totalVaultValue = vaultCapsules.reduce((sum, capsule) => sum + capsule.currentValue, 0);
  const maturedCapsules = vaultCapsules.filter(capsule => capsule.isMatured);
  const activeStakes = stakeData.filter(stake => stake.status === 'active');
  const totalStaked = activeStakes.reduce((sum, stake) => sum + stake.gttAmount, 0);
  const totalRewards = stakeData.reduce((sum, stake) => sum + stake.rewards, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-cyan-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            GuardianChain Vault
          </h1>
          <p className="text-cyan-200 text-lg">
            Secure your truth capsules and earn GTT yield through advanced staking mechanisms
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-slate-800/50 border-cyan-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cyan-300 text-sm">Total Vault Value</p>
                  <p className="text-3xl font-bold text-cyan-100">{totalVaultValue.toLocaleString()} GTT</p>
                </div>
                <Vault className="w-8 h-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-300 text-sm">Available Balance</p>
                  <p className="text-3xl font-bold text-purple-100">{gttBalance.toLocaleString()} GTT</p>
                </div>
                <Coins className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-emerald-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-300 text-sm">Active Stakes</p>
                  <p className="text-3xl font-bold text-emerald-100">{totalStaked.toLocaleString()} GTT</p>
                </div>
                <Lock className="w-8 h-8 text-emerald-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-yellow-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-300 text-sm">Total Rewards</p>
                  <p className="text-3xl font-bold text-yellow-100">{totalRewards.toLocaleString()} GTT</p>
                </div>
                <Award className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="stake">Stake GTT</TabsTrigger>
            <TabsTrigger value="capsules">Vault Capsules</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card className="bg-slate-800/50 border-cyan-500/30">
                <CardHeader>
                  <CardTitle className="text-cyan-100 flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {maturedCapsules.slice(0, 5).map((capsule) => (
                      <div key={capsule.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                        <div>
                          <p className="text-cyan-100 font-medium">{capsule.title}</p>
                          <p className="text-cyan-300 text-sm">Matured • +{capsule.appreciationRate.toFixed(1)}%</p>
                        </div>
                        <Badge variant="outline" className="text-emerald-400 border-emerald-400">
                          <Unlock className="w-3 h-3 mr-1" />
                          Unlocked
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Chart */}
              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-purple-100 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Performance Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={unlockTrend}>
                      <defs>
                        <linearGradient id="unlockGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" tick={{fill: '#a5b4fc'}} />
                      <YAxis tick={{fill: '#a5b4fc'}} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#1e293b',
                          border: '1px solid #8B5CF6',
                          borderRadius: '8px'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="unlocks" 
                        stroke="#8B5CF6" 
                        fillOpacity={1} 
                        fill="url(#unlockGradient)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Stake GTT Tab */}
          <TabsContent value="stake" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Staking Interface */}
              <Card className="bg-slate-800/50 border-cyan-500/30">
                <CardHeader>
                  <CardTitle className="text-cyan-100 flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Stake GTT Tokens
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="gttAmount" className="text-cyan-200">Amount to Stake</Label>
                      <Input
                        id="gttAmount"
                        type="number"
                        placeholder="Enter GTT amount"
                        value={gttAmount}
                        onChange={(e) => setGttAmount(e.target.value)}
                        className="bg-slate-700/50 border-cyan-500/30 text-cyan-100"
                      />
                      <p className="text-cyan-300 text-sm mt-1">
                        Available: {gttBalance.toLocaleString()} GTT
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="duration" className="text-cyan-200">Lock Duration (Days)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={stakeDuration}
                        onChange={(e) => setStakeDuration(parseInt(e.target.value) || 30)}
                        className="bg-slate-700/50 border-cyan-500/30 text-cyan-100"
                      />
                    </div>

                    <div className="p-4 bg-slate-700/30 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="text-cyan-300">Estimated APY:</span>
                        <span className="text-cyan-100 font-bold">{calculateAPY(stakeDuration).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-cyan-300">Maturity Date:</span>
                        <span className="text-cyan-100">
                          {new Date(Date.now() + stakeDuration * 24 * 60 * 60 * 1000).toLocaleDateString()}
                        </span>
                      </div>
                      {gttAmount && (
                        <div className="flex justify-between">
                          <span className="text-cyan-300">Estimated Rewards:</span>
                          <span className="text-emerald-400 font-bold">
                            {((parseFloat(gttAmount) || 0) * calculateAPY(stakeDuration) / 100 * stakeDuration / 365).toFixed(2)} GTT
                          </span>
                        </div>
                      )}
                    </div>

                    <Button 
                      onClick={handleStakeGTT}
                      disabled={isLoading || !gttAmount}
                      className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                    >
                      {isLoading ? "Processing..." : "Stake GTT"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Active Stakes */}
              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-purple-100 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Active Stakes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeStakes.length > 0 ? (
                      activeStakes.map((stake, index) => (
                        <div key={index} className="p-4 bg-slate-700/30 rounded-lg space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-purple-100 font-medium">{stake.gttAmount} GTT</span>
                            <Badge variant="outline" className="text-emerald-400 border-emerald-400">
                              {stake.apy.toFixed(1)}% APY
                            </Badge>
                          </div>
                          <div className="text-sm text-purple-300">
                            Matures: {new Date(stake.maturityDate).toLocaleDateString()}
                          </div>
                          <Progress 
                            value={stake.status === 'matured' ? 100 : 65} 
                            className="h-2"
                          />
                          <div className="text-sm text-emerald-400">
                            Pending Rewards: {stake.rewards.toFixed(2)} GTT
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-purple-300">
                        No active stakes yet. Start staking to earn rewards!
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Vault Capsules Tab */}
          <TabsContent value="capsules" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vaultCapsules.map((capsule) => (
                <Card key={capsule.id} className="bg-slate-800/50 border-cyan-500/30">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-cyan-100 text-lg">{capsule.title}</CardTitle>
                      <Badge 
                        variant="outline" 
                        className={`${
                          capsule.isMatured 
                            ? 'text-emerald-400 border-emerald-400' 
                            : 'text-yellow-400 border-yellow-400'
                        }`}
                      >
                        {capsule.isMatured ? <Unlock className="w-3 h-3 mr-1" /> : <Lock className="w-3 h-3 mr-1" />}
                        {capsule.isMatured ? 'Unlocked' : 'Locked'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-cyan-300">Locked Amount:</span>
                        <span className="text-cyan-100">{capsule.lockedAmount} GTT</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-cyan-300">Current Value:</span>
                        <span className="text-cyan-100">{capsule.currentValue} GTT</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-cyan-300">Appreciation:</span>
                        <span className={`${
                          capsule.appreciationRate >= 0 ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {capsule.appreciationRate >= 0 ? '+' : ''}{capsule.appreciationRate.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-cyan-300">Unlock Date:</span>
                        <span className="text-cyan-100">
                          {new Date(capsule.unlockDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    {capsule.isMatured && (
                      <Button className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600">
                        Claim Rewards
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Unlock Trend Chart */}
              <Card className="bg-slate-800/50 border-cyan-500/30">
                <CardHeader>
                  <CardTitle className="text-cyan-100 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Unlock Trend Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={unlockTrend}>
                      <XAxis dataKey="day" tick={{fill: '#a5b4fc'}} />
                      <YAxis tick={{fill: '#a5b4fc'}} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#1e293b',
                          border: '1px solid #06b6d4',
                          borderRadius: '8px'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="unlocks" 
                        stroke="#06b6d4" 
                        strokeWidth={2}
                        dot={{ r: 4, fill: '#06b6d4' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Vault Statistics */}
              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-purple-100 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Vault Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                      <p className="text-3xl font-bold text-cyan-400">{vaultCapsules.length}</p>
                      <p className="text-cyan-300 text-sm">Total Capsules</p>
                    </div>
                    <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                      <p className="text-3xl font-bold text-emerald-400">{maturedCapsules.length}</p>
                      <p className="text-emerald-300 text-sm">Matured</p>
                    </div>
                    <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                      <p className="text-3xl font-bold text-purple-400">{activeStakes.length}</p>
                      <p className="text-purple-300 text-sm">Active Stakes</p>
                    </div>
                    <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                      <p className="text-3xl font-bold text-yellow-400">
                        {vaultCapsules.length > 0 ? 
                          (vaultCapsules.reduce((sum, c) => sum + c.appreciationRate, 0) / vaultCapsules.length).toFixed(1) 
                          : '0.0'
                        }%
                      </p>
                      <p className="text-yellow-300 text-sm">Avg Growth</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}