import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRightLeft,
  Coins,
  Shield,
  TrendingUp,
  Zap,
  Network,
  Lock,
  Star,
  Globe,
} from "lucide-react";

export default function CrossTradingPage() {
  const supportedChains = [
    { name: "Ethereum", symbol: "ETH", color: "blue", volume: "$2.4M" },
    { name: "Polygon", symbol: "MATIC", color: "purple", volume: "$1.8M" },
    { name: "Arbitrum", symbol: "ARB", color: "cyan", volume: "$945K" },
    { name: "Base", symbol: "BASE", color: "blue", volume: "$672K" },
  ];

  const tradingFeatures = [
    {
      icon: ArrowRightLeft,
      title: "Cross-Chain Swaps via CapsuleDEX",
      description:
        "Seamlessly trade truth capsules across major blockchain networks",
      status: "Q3 2025",
    },
    {
      icon: Coins,
      title: "NFT-to-NFT Capsule Liquidity Swaps",
      description:
        "Exchange verified truth capsules with other sovereign holders",
      status: "Beta Ready",
    },
    {
      icon: Shield,
      title: "Veritas-Backed Verified Seller Badge",
      description:
        "Trust verification system for authenticated capsule traders",
      status: "Live",
    },
    {
      icon: Lock,
      title: "Disputed Truth Redemption Protections",
      description:
        "Built-in escrow and dispute resolution for high-value trades",
      status: "Development",
    },
    {
      icon: TrendingUp,
      title: "Revenue Shared with GTT Stakers",
      description:
        "Trading fees distributed to GTT token stakers automatically",
      status: "Live",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            🔄 Cross-Chain Truth Trading
          </h1>
          <p className="text-xl text-slate-300 mb-6">
            GUARDIANCHAIN's cross-trading module enables sovereign capsule
            holders to trade truth assets across major chains
          </p>
          <Badge className="bg-purple-600/20 text-purple-400 text-lg px-4 py-2">
            CAPSULE DEX POWERED
          </Badge>
        </div>

        {/* Supported Chains */}
        <Card className="bg-slate-800/50 border-slate-700 mb-12">
          <CardHeader>
            <CardTitle className="text-white text-center text-2xl flex items-center justify-center space-x-3">
              <Network className="h-6 w-6 text-blue-400" />
              <span>Supported Networks</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {supportedChains.map((chain, index) => (
                <div
                  key={index}
                  className="text-center p-4 bg-slate-700/50 rounded-lg"
                >
                  <div
                    className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${
                      chain.color === "blue"
                        ? "bg-blue-600/20"
                        : chain.color === "purple"
                          ? "bg-purple-600/20"
                          : chain.color === "cyan"
                            ? "bg-cyan-600/20"
                            : "bg-gray-600/20"
                    }`}
                  >
                    <Globe
                      className={`h-6 w-6 ${
                        chain.color === "blue"
                          ? "text-blue-400"
                          : chain.color === "purple"
                            ? "text-purple-400"
                            : chain.color === "cyan"
                              ? "text-cyan-400"
                              : "text-gray-400"
                      }`}
                    />
                  </div>
                  <h3 className="text-white font-bold">{chain.name}</h3>
                  <p className="text-slate-400 text-sm">{chain.symbol}</p>
                  <p className="text-green-400 text-sm font-semibold">
                    {chain.volume}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Trading Features */}
        <Card className="bg-slate-800/50 border-slate-700 mb-12">
          <CardHeader>
            <CardTitle className="text-white text-2xl">
              Cross-Trading Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {tradingFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="flex items-start space-x-4 p-4 bg-slate-700/30 rounded-lg"
                  >
                    <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-bold">
                          {feature.title}
                        </h3>
                        <Badge
                          className={`
                          ${feature.status === "Live" ? "bg-green-600/20 text-green-400" : ""}
                          ${feature.status === "Beta Ready" ? "bg-yellow-600/20 text-yellow-400" : ""}
                          ${feature.status === "Development" ? "bg-blue-600/20 text-blue-400" : ""}
                          ${feature.status === "Q3 2025" ? "bg-purple-600/20 text-purple-400" : ""}
                        `}
                        >
                          {feature.status}
                        </Badge>
                      </div>
                      <p className="text-slate-300">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Trading Volume & Revenue */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="bg-gradient-to-r from-green-900/30 to-blue-900/30 border-green-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-3">
                <TrendingUp className="h-6 w-6 text-green-400" />
                <span>Cross-Chain Volume</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  $5.82M
                </div>
                <p className="text-slate-300">Total Trading Volume</p>
                <p className="text-green-400 text-sm">+247% this month</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-3">
                <Star className="h-6 w-6 text-purple-400" />
                <span>GTT Staker Rewards</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  $174K
                </div>
                <p className="text-slate-300">Distributed to Stakers</p>
                <p className="text-purple-400 text-sm">3% of trading fees</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/30">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to Trade Truth Across Chains?
            </h2>
            <p className="text-slate-300 mb-6">
              Join the sovereign truth trading revolution with verified capsule
              exchanges
            </p>

            <Separator className="my-6 border-slate-700" />

            <div className="flex justify-center space-x-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                onClick={() => (window.location.href = "/create-capsule")}
              >
                <Coins className="h-5 w-5 mr-2" />
                Create Trading Capsule
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-green-500 text-green-400 hover:bg-green-600/20"
                onClick={() => (window.location.href = "/stake")}
              >
                <Zap className="h-5 w-5 mr-2" />
                Earn GTT for Trading
              </Button>
            </div>

            <div className="flex justify-between items-center mt-6">
              <span className="text-sm text-slate-400">
                Live cross-trading expanding Q3 2025
              </span>
              <Badge className="bg-yellow-600/20 text-yellow-400">
                PREVIEW MODE
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
