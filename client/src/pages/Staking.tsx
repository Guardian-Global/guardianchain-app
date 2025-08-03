import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, DollarSign, Clock, Shield, Network, Coins } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface StakingPool {
  chain: string;
  chainId: number;
  totalStaked: number;
  apr: number;
  validators: number;
  myStake: number;
  rewards: number;
  lockPeriod: string;
  status: 'active' | 'pending' | 'unstaking';
}

interface MultichainPerformance {
  totalValueLocked: number;
  totalRewards: number;
  averageApr: number;
  activePools: number;
  attestations: number;
  pools: StakingPool[];
}

export default function Staking() {
  const [selectedChain, setSelectedChain] = useState<string>("all");
  
  const { data: performanceData, isLoading } = useQuery<{success: boolean, data: MultichainPerformance, timestamp: string}>({
    queryKey: ["/api/staking/multichain-performance"],
    refetchInterval: 30000,
  });

  const mockData: MultichainPerformance = {
    totalValueLocked: 2847500,
    totalRewards: 12450,
    averageApr: 8.7,
    activePools: 6,
    attestations: 47,
    pools: [
      {
        chain: "Ethereum",
        chainId: 1,
        totalStaked: 1250000,
        apr: 7.2,
        validators: 12,
        myStake: 5000,
        rewards: 360,
        lockPeriod: "32 epochs",
        status: "active"
      },
      {
        chain: "Polygon",
        chainId: 137,
        totalStaked: 875000,
        apr: 12.4,
        validators: 8,
        myStake: 2500,
        rewards: 310,
        lockPeriod: "14 days",
        status: "active"
      },
      {
        chain: "Base",
        chainId: 8453,
        totalStaked: 622500,
        apr: 9.8,
        validators: 6,
        myStake: 1500,
        rewards: 147,
        lockPeriod: "7 days",
        status: "active"
      },
      {
        chain: "Arbitrum",
        chainId: 42161,
        totalStaked: 100000,
        apr: 15.2,
        validators: 3,
        myStake: 500,
        rewards: 76,
        lockPeriod: "21 days",
        status: "pending"
      }
    ]
  };

  const data = performanceData?.data || mockData;
  const filteredPools = selectedChain === "all" ? data.pools : data.pools.filter(pool => pool.chain.toLowerCase() === selectedChain);

  if (isLoading) {
    return (
      <div className="p-10 max-w-7xl mx-auto text-white space-y-6">
        <h1 className="text-4xl font-bold text-yellow-400 mb-4">⚡ Multichain Staking Hub</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-xl animate-pulse">
              <div className="h-16 bg-slate-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 max-w-7xl mx-auto text-white space-y-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-yellow-400 mb-4">⚡ Multichain Staking Hub</h1>
        <p className="text-purple-300 text-lg mb-6">
          Stake GTT tokens across multiple blockchains for maximum yield and validator rewards
        </p>
        
        {/* Chain Filter */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {["all", "ethereum", "polygon", "base", "arbitrum"].map((chain) => (
            <Button
              key={chain}
              onClick={() => setSelectedChain(chain)}
              variant={selectedChain === chain ? "default" : "outline"}
              size="sm"
              className="capitalize"
            >
              {chain === "all" ? "All Chains" : chain}
            </Button>
          ))}
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl text-center">
          <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-3" />
          <p className="text-sm text-slate-300 mb-1">Total Value Locked</p>
          <p className="text-2xl font-bold text-green-400">${data.totalValueLocked?.toLocaleString() || '0'}</p>
          <p className="text-xs text-slate-500">Across all chains</p>
        </div>
        
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl text-center">
          <Coins className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
          <p className="text-sm text-slate-300 mb-1">Total Rewards</p>
          <p className="text-2xl font-bold text-yellow-400">{data.totalRewards?.toLocaleString() || '0'} GTT</p>
          <p className="text-xs text-slate-500">Earned across pools</p>
        </div>
        
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl text-center">
          <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-3" />
          <p className="text-sm text-slate-300 mb-1">Average APR</p>
          <p className="text-2xl font-bold text-blue-400">{data.averageApr || '0'}%</p>
          <p className="text-xs text-slate-500">Weighted average</p>
        </div>
        
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl text-center">
          <Shield className="w-8 h-8 text-purple-400 mx-auto mb-3" />
          <p className="text-sm text-slate-300 mb-1">Attestations</p>
          <p className="text-2xl font-bold text-purple-400">{data.attestations || '0'}</p>
          <p className="text-xs text-slate-500">Cross-chain verified</p>
        </div>
      </div>

      {/* Staking Pools */}
      <div>
        <h2 className="text-2xl font-bold text-purple-300 mb-6">Active Staking Pools</h2>
        <div className="grid gap-6">
          {filteredPools?.map((pool, index) => (
            <Card key={index} className="bg-white/5 border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Network className="w-8 h-8 text-blue-400" />
                    <div>
                      <CardTitle className="text-purple-300">{pool.chain} Network</CardTitle>
                      <p className="text-sm text-slate-400">Chain ID: {pool.chainId}</p>
                    </div>
                  </div>
                  <Badge variant={pool.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                    {pool.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Total Staked</p>
                    <p className="text-lg font-bold text-green-400">${pool.totalStaked?.toLocaleString() || '0'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">APR</p>
                    <p className="text-lg font-bold text-yellow-400">{pool.apr || '0'}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Validators</p>
                    <p className="text-lg font-bold text-blue-400">{pool.validators || '0'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Lock Period</p>
                    <p className="text-lg font-bold text-purple-400">{pool.lockPeriod}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <h4 className="text-purple-300 font-medium mb-3">Your Position</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Staked Amount:</span>
                        <span className="text-green-400">${pool.myStake?.toLocaleString() || '0'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Pending Rewards:</span>
                        <span className="text-yellow-400">{pool.rewards || '0'} GTT</span>
                      </div>
                      <Progress value={pool.totalStaked > 0 ? (pool.myStake / pool.totalStaked) * 100 : 0} className="mt-2" />
                      <p className="text-xs text-slate-500">
                        {pool.totalStaked > 0 ? ((pool.myStake / pool.totalStaked) * 100).toFixed(2) : '0.00'}% of total pool
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Button className="w-full" variant="default">
                      <Coins className="w-4 h-4 mr-2" />
                      Stake More GTT
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Clock className="w-4 h-4 mr-2" />
                      Claim Rewards
                    </Button>
                    {pool.status === 'active' && (
                      <Button className="w-full" variant="secondary">
                        <Shield className="w-4 h-4 mr-2" />
                        Begin Unstaking
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-purple-300">Multichain Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-slate-800/50 rounded-lg flex items-center justify-center">
            <div className="text-center text-slate-400">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Performance charts coming soon</p>
              <p className="text-sm">Cross-chain staking analytics and yield tracking</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-slate-500 text-sm">
        Last updated: {new Date().toLocaleString()} • Auto-refresh every 30 seconds
      </div>
    </div>
  );
}