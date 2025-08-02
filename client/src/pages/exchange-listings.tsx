import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Building2,
  Globe,
  CheckCircle,
  Clock,
  TrendingUp,
  ExternalLink,
  Star,
  DollarSign,
  Users,
  Zap,
} from "lucide-react";

export default function ExchangeListings() {
  const exchangeListings = [
    {
      name: "Binance",
      tier: "Tier 1",
      status: "Application Submitted",
      progress: 75,
      volume: "$2.4B",
      users: "120M+",
      listingFee: "$100K",
      timeframe: "2-4 weeks",
      requirements: ["Legal compliance", "Security audit", "Market making"],
      completed: 2,
      total: 3,
      priority: "Critical",
      logo: "🟡",
    },
    {
      name: "Coinbase",
      tier: "Tier 1",
      status: "Documentation Review",
      progress: 60,
      volume: "$1.8B",
      users: "100M+",
      listingFee: "$250K",
      timeframe: "3-6 weeks",
      requirements: [
        "Regulatory approval",
        "Tech integration",
        "Compliance review",
      ],
      completed: 1,
      total: 3,
      priority: "Critical",
      logo: "🔵",
    },
    {
      name: "OKX",
      tier: "Tier 1",
      status: "Under Review",
      progress: 45,
      volume: "$1.2B",
      users: "50M+",
      listingFee: "$50K",
      timeframe: "1-3 weeks",
      requirements: ["Project evaluation", "Token audit", "Market analysis"],
      completed: 1,
      total: 3,
      priority: "High",
      logo: "⚫",
    },
    {
      name: "Gate.io",
      tier: "Tier 2",
      status: "Fast Track Approved",
      progress: 90,
      volume: "$800M",
      users: "13M+",
      listingFee: "$30K",
      timeframe: "3-7 days",
      requirements: [
        "Contract verification",
        "Initial listing",
        "Marketing campaign",
      ],
      completed: 3,
      total: 3,
      priority: "Ready",
      logo: "🟣",
    },
    {
      name: "MEXC",
      tier: "Tier 2",
      status: "Listing Confirmed",
      progress: 95,
      volume: "$600M",
      users: "10M+",
      listingFee: "$15K",
      timeframe: "1-3 days",
      requirements: [
        "Technical integration",
        "Trading pairs",
        "Launch announcement",
      ],
      completed: 3,
      total: 3,
      priority: "Launching",
      logo: "🔴",
    },
    {
      name: "KuCoin",
      tier: "Tier 2",
      status: "Application Pending",
      progress: 30,
      volume: "$700M",
      users: "30M+",
      listingFee: "$40K",
      timeframe: "2-4 weeks",
      requirements: ["Application review", "Due diligence", "Community vote"],
      completed: 1,
      total: 3,
      priority: "Medium",
      logo: "🟢",
    },
  ];

  const dexListings = [
    {
      name: "Uniswap V3",
      status: "Live",
      liquidity: "$2.5M",
      volume24h: "$847K",
      fees: "0.3%",
      pairs: ["GTT/MATIC", "GTT/USDC", "GTT/WETH"],
    },
    {
      name: "QuickSwap",
      status: "Live",
      liquidity: "$1.8M",
      volume24h: "$623K",
      fees: "0.25%",
      pairs: ["GTT/MATIC", "GTT/USDC"],
    },
    {
      name: "SushiSwap",
      status: "Launching",
      liquidity: "$1.2M",
      volume24h: "$445K",
      fees: "0.3%",
      pairs: ["GTT/MATIC", "GTT/WETH"],
    },
  ];

  const marketMetrics = {
    totalExchanges: 12,
    liveExchanges: 3,
    pendingListings: 6,
    totalVolume: "$5.2M",
    marketCap: "$12.5M",
    holders: "8,742",
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-600/20 text-red-400";
      case "High":
        return "bg-orange-600/20 text-orange-400";
      case "Ready":
        return "bg-green-600/20 text-green-400";
      case "Launching":
        return "bg-purple-600/20 text-purple-400";
      case "Medium":
        return "bg-blue-600/20 text-blue-400";
      default:
        return "bg-gray-600/20 text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            🏛️ EXCHANGE LISTINGS PIPELINE
          </h1>
          <p className="text-xl text-slate-300 mb-6">
            Complete GTT token listing strategy across Tier 1, Tier 2, and DEX
            platforms
          </p>
          <Badge className="bg-blue-600/20 text-blue-400 text-lg px-4 py-2">
            MAXIMUM EXPOSURE STRATEGY
          </Badge>
        </div>

        {/* Market Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <Building2 className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">
                {marketMetrics.totalExchanges}
              </div>
              <p className="text-slate-400 text-sm">Total Targets</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-6 w-6 text-green-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">
                {marketMetrics.liveExchanges}
              </div>
              <p className="text-slate-400 text-sm">Live Exchanges</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <Clock className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">
                {marketMetrics.pendingListings}
              </div>
              <p className="text-slate-400 text-sm">Pending</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-6 w-6 text-purple-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">
                {marketMetrics.totalVolume}
              </div>
              <p className="text-slate-400 text-sm">24h Volume</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <DollarSign className="h-6 w-6 text-green-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">
                {marketMetrics.marketCap}
              </div>
              <p className="text-slate-400 text-sm">Market Cap</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <Users className="h-6 w-6 text-cyan-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">
                {marketMetrics.holders}
              </div>
              <p className="text-slate-400 text-sm">Holders</p>
            </CardContent>
          </Card>
        </div>

        {/* Exchange Listings */}
        <Card className="bg-slate-800/50 border-slate-700 mb-12">
          <CardHeader>
            <CardTitle className="text-white text-2xl">
              Centralized Exchange Listings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {exchangeListings.map((exchange, index) => (
                <div key={index} className="p-6 bg-slate-700/30 rounded-lg">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Exchange Info */}
                    <div className="lg:col-span-2">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="text-3xl">{exchange.logo}</div>
                        <div>
                          <h3 className="text-white font-bold text-lg">
                            {exchange.name}
                          </h3>
                          <div className="flex items-center space-x-3">
                            <Badge className="bg-blue-600/20 text-blue-400">
                              {exchange.tier}
                            </Badge>
                            <Badge
                              className={getPriorityColor(exchange.priority)}
                            >
                              {exchange.priority}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-slate-400 text-sm">Volume</p>
                          <p className="text-white font-semibold">
                            {exchange.volume}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">Users</p>
                          <p className="text-white font-semibold">
                            {exchange.users}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">Listing Fee</p>
                          <p className="text-green-400 font-semibold">
                            {exchange.listingFee}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">ETA</p>
                          <p className="text-yellow-400 font-semibold">
                            {exchange.timeframe}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Progress & Status */}
                    <div className="lg:col-span-2">
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-semibold">
                            Progress
                          </span>
                          <span className="text-blue-400">
                            {exchange.progress}%
                          </span>
                        </div>
                        <Progress value={exchange.progress} className="h-3" />
                        <p className="text-slate-400 text-sm mt-1">
                          {exchange.status}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-white font-semibold mb-2">
                          Requirements ({exchange.completed}/{exchange.total})
                        </p>
                        {exchange.requirements.map((req, idx) => (
                          <div
                            key={idx}
                            className="flex items-center space-x-3"
                          >
                            <CheckCircle
                              className={`h-4 w-4 ${
                                idx < exchange.completed
                                  ? "text-green-400"
                                  : "text-slate-500"
                              }`}
                            />
                            <span
                              className={`text-sm ${
                                idx < exchange.completed
                                  ? "text-green-400"
                                  : "text-slate-400"
                              }`}
                            >
                              {req}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* DEX Listings */}
        <Card className="bg-slate-800/50 border-slate-700 mb-12">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-3">
              <Zap className="h-6 w-6 text-purple-400" />
              <span>Live DEX Integrations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {dexListings.map((dex, index) => (
                <div key={index} className="p-4 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-bold">{dex.name}</h3>
                    <Badge
                      className={`
                      ${dex.status === "Live" ? "bg-green-600/20 text-green-400" : ""}
                      ${dex.status === "Launching" ? "bg-yellow-600/20 text-yellow-400" : ""}
                    `}
                    >
                      {dex.status}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Liquidity:</span>
                      <span className="text-green-400 font-semibold">
                        {dex.liquidity}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">24h Volume:</span>
                      <span className="text-blue-400 font-semibold">
                        {dex.volume24h}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Fees:</span>
                      <span className="text-purple-400 font-semibold">
                        {dex.fees}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-slate-400 text-sm mb-2">
                      Trading Pairs:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {dex.pairs.map((pair, idx) => (
                        <Badge
                          key={idx}
                          className="bg-slate-600/50 text-slate-300 text-xs"
                        >
                          {pair}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-green-500 text-green-400 hover:bg-green-600/20"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Trade Now
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Launch Impact */}
        <Card className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-3">
              <Star className="h-6 w-6 text-yellow-400" />
              <span>Projected Launch Impact</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  $50M+
                </div>
                <p className="text-slate-300">Market Cap Target</p>
                <p className="text-slate-400 text-sm">
                  Within 30 days of major listings
                </p>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  100K+
                </div>
                <p className="text-slate-300">New Holders</p>
                <p className="text-slate-400 text-sm">
                  Across all exchange platforms
                </p>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  $25M+
                </div>
                <p className="text-slate-300">Daily Volume</p>
                <p className="text-slate-400 text-sm">
                  Combined CEX and DEX trading
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Globe className="h-5 w-5 mr-2" />
                View Full Launch Timeline
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
