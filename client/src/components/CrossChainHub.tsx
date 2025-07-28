import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Network,
  Zap,
  Globe,
  Shield,
  TrendingUp,
  Coins,
  ArrowRightLeft,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  Star,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CrossChainHub: React.FC = () => {
  const [selectedChain, setSelectedChain] = useState("ethereum");
  const [bridgeAmount, setBridgeAmount] = useState("");
  const [isBridging, setIsBridging] = useState(false);
  const { toast } = useToast();

  const supportedChains = [
    {
      id: "ethereum",
      name: "Ethereum",
      symbol: "ETH",
      logo: "⟠",
      color: "text-blue-400",
      gttBalance: "125,000",
      totalValue: "$2.5M",
      gasPrice: "15 gwei",
      status: "active",
      features: ["Smart Contracts", "DeFi Integration", "NFT Support"],
    },
    {
      id: "polygon",
      name: "Polygon",
      symbol: "MATIC",
      logo: "⬟",
      color: "text-purple-400",
      gttBalance: "500,000",
      totalValue: "$1.8M",
      gasPrice: "2 gwei",
      status: "active",
      features: ["Low Fees", "Fast Transactions", "Ethereum Compatible"],
    },
    {
      id: "solana",
      name: "Solana",
      symbol: "SOL",
      logo: "◉",
      color: "text-green-400",
      gttBalance: "750,000",
      totalValue: "$3.2M",
      gasPrice: "$0.00025",
      status: "active",
      features: ["High Speed", "Low Cost", "NFT Ecosystem"],
    },
    {
      id: "avalanche",
      name: "Avalanche",
      symbol: "AVAX",
      logo: "▲",
      color: "text-red-400",
      gttBalance: "300,000",
      totalValue: "$1.1M",
      gasPrice: "25 nAVAX",
      status: "active",
      features: ["Subnets", "Fast Finality", "EVM Compatible"],
    },
    {
      id: "arbitrum",
      name: "Arbitrum",
      symbol: "ARB",
      logo: "⚡",
      color: "text-blue-300",
      gttBalance: "400,000",
      totalValue: "$1.6M",
      gasPrice: "0.1 gwei",
      status: "active",
      features: ["Layer 2", "Optimistic Rollups", "Ethereum Security"],
    },
    {
      id: "bsc",
      name: "BNB Chain",
      symbol: "BNB",
      logo: "◆",
      color: "text-yellow-400",
      gttBalance: "600,000",
      totalValue: "$2.1M",
      gasPrice: "5 gwei",
      status: "active",
      features: ["High Throughput", "Low Fees", "DeFi Hub"],
    },
  ];

  const crossChainFeatures = [
    {
      title: "Universal GTT Token",
      description: "Single GTT token works across all supported blockchains",
      icon: <Coins className="w-6 h-6" />,
      benefits: ["Seamless transfers", "No token swaps", "Unified balance"],
    },
    {
      title: "Instant Bridging",
      description: "Cross-chain transfers in under 30 seconds",
      icon: <Zap className="w-6 h-6" />,
      benefits: ["Sub-30s transfers", "Minimal fees", "Auto-routing"],
    },
    {
      title: "Multi-Chain Verification",
      description: "Truth verification across multiple blockchain networks",
      icon: <Shield className="w-6 h-6" />,
      benefits: [
        "Enhanced security",
        "Redundant verification",
        "Cross-chain proofs",
      ],
    },
    {
      title: "Unified Dashboard",
      description: "Manage all chains from single interface",
      icon: <Globe className="w-6 h-6" />,
      benefits: [
        "Single interface",
        "Portfolio overview",
        "Cross-chain analytics",
      ],
    },
  ];

  const marketMetrics = {
    totalTVL: "$15.2B",
    dailyVolume: "$850M",
    totalTransactions: "2.1M",
    averageFee: "$0.12",
    bridgeVolume: "$45M",
    activeUsers: "125K",
  };

  const handleChainBridge = async (fromChain: string, toChain: string) => {
    setIsBridging(true);
    try {
      // Simulate cross-chain bridge transaction
      await new Promise((resolve) => setTimeout(resolve, 3000));

      toast({
        title: "Bridge Complete",
        description: `Successfully bridged GTT from ${fromChain} to ${toChain}`,
      });
    } catch (error) {
      toast({
        title: "Bridge Failed",
        description: "Please try again or contact support",
        variant: "destructive",
      });
    } finally {
      setIsBridging(false);
    }
  };

  return (
    <div className="w-full space-y-8">
      <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-center">
            <Network className="w-8 h-8 mr-3 text-blue-400" />
            <div className="text-center">
              <div className="text-3xl font-bold">
                Cross-Chain Infrastructure
              </div>
              <div className="text-lg text-blue-400">
                50+ Blockchain Networks Supported
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">
                {marketMetrics.totalTVL}
              </div>
              <div className="text-sm text-slate-400">Total TVL</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">
                {marketMetrics.dailyVolume}
              </div>
              <div className="text-sm text-slate-400">Daily Volume</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">
                {marketMetrics.totalTransactions}
              </div>
              <div className="text-sm text-slate-400">Transactions</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {marketMetrics.averageFee}
              </div>
              <div className="text-sm text-slate-400">Avg Fee</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-400">
                {marketMetrics.bridgeVolume}
              </div>
              <div className="text-sm text-slate-400">Bridge Volume</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-300">
                {marketMetrics.activeUsers}
              </div>
              <div className="text-sm text-slate-400">Active Users</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Supported Blockchain Networks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {supportedChains.map((chain) => (
          <Card
            key={chain.id}
            className={`bg-slate-800/50 border-slate-700 cursor-pointer transition-all ${
              selectedChain === chain.id ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => setSelectedChain(chain.id)}
          >
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-3xl mr-3">{chain.logo}</span>
                  <div>
                    <div className={chain.color}>{chain.name}</div>
                    <div className="text-sm font-normal text-slate-400">
                      {chain.symbol}
                    </div>
                  </div>
                </div>
                <Badge
                  className={`${
                    chain.status === "active" ? "bg-green-600" : "bg-yellow-600"
                  }`}
                >
                  {chain.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">GTT Balance:</span>
                  <span className="text-white font-bold">
                    {chain.gttBalance}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Value:</span>
                  <span className="text-green-400 font-bold">
                    {chain.totalValue}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Gas Price:</span>
                  <span className="text-blue-400 font-bold">
                    {chain.gasPrice}
                  </span>
                </div>

                <div className="space-y-1">
                  {chain.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center">
                      <CheckCircle className="w-3 h-3 text-green-400 mr-2" />
                      <span className="text-slate-300 text-xs">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cross-Chain Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {crossChainFeatures.map((feature, index) => (
          <Card key={index} className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <div className="p-2 bg-blue-600 rounded-lg mr-3">
                  {feature.icon}
                </div>
                <div>
                  <div>{feature.title}</div>
                  <div className="text-sm font-normal text-slate-400">
                    {feature.description}
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {feature.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-2" />
                    <span className="text-slate-300 text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cross-Chain Bridge Interface */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <ArrowRightLeft className="w-6 h-6 mr-2 text-purple-400" />
            Cross-Chain Bridge
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div>
              <label className="text-white font-semibold mb-2 block">
                From Chain
              </label>
              <Card className="bg-slate-700/50 border-slate-600 p-4">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">⟠</span>
                  <div>
                    <div className="text-white font-bold">Ethereum</div>
                    <div className="text-slate-400 text-sm">
                      Balance: 125,000 GTT
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="text-center">
              <Button
                onClick={() => handleChainBridge("ethereum", "polygon")}
                disabled={isBridging}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isBridging ? (
                  <div className="flex items-center">
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Bridging...
                  </div>
                ) : (
                  <>
                    <ArrowRightLeft className="w-4 h-4 mr-2" />
                    Bridge GTT
                  </>
                )}
              </Button>
              <div className="text-slate-400 text-sm mt-2">
                Fee: $0.12 • Time: ~30s
              </div>
            </div>

            <div>
              <label className="text-white font-semibold mb-2 block">
                To Chain
              </label>
              <Card className="bg-slate-700/50 border-slate-600 p-4">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">⬟</span>
                  <div>
                    <div className="text-white font-bold">Polygon</div>
                    <div className="text-slate-400 text-sm">
                      Balance: 500,000 GTT
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="mt-6 bg-blue-900/20 border border-blue-700 rounded-lg p-4">
            <h3 className="text-white font-bold mb-3">Bridge Benefits</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <Clock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-white font-bold">&lt; 30 seconds</div>
                <div className="text-slate-400 text-sm">Transfer Time</div>
              </div>
              <div className="text-center">
                <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-white font-bold">$0.12</div>
                <div className="text-slate-400 text-sm">Average Fee</div>
              </div>
              <div className="text-center">
                <Shield className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-white font-bold">99.9%</div>
                <div className="text-slate-400 text-sm">Success Rate</div>
              </div>
              <div className="text-center">
                <Users className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-white font-bold">125K+</div>
                <div className="text-slate-400 text-sm">Daily Users</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Network Performance */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-green-400" />
            Network Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-white">Cross-Chain Volume (24h)</span>
                <span className="text-green-400 font-bold">$45M</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-white">Network Utilization</span>
                <span className="text-blue-400 font-bold">68%</span>
              </div>
              <Progress value={68} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-white">Bridge Success Rate</span>
                <span className="text-purple-400 font-bold">99.9%</span>
              </div>
              <Progress value={99.9} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-white">GTT Token Distribution</span>
                <span className="text-yellow-400 font-bold">2.7M GTT</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-900/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">$15.2B</div>
              <div className="text-sm text-slate-400">Total Value Locked</div>
            </div>
            <div className="bg-blue-900/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">50+</div>
              <div className="text-sm text-slate-400">Supported Chains</div>
            </div>
            <div className="bg-purple-900/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">99.99%</div>
              <div className="text-sm text-slate-400">Uptime SLA</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CrossChainHub;
