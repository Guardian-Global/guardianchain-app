import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Rocket,
  TrendingUp,
  DollarSign,
  Users,
  Globe,
  CheckCircle,
  Clock,
  Zap,
  Target,
  BarChart3,
  ExternalLink,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function LaunchDashboard() {
  const [launchProgress, setLaunchProgress] = useState(85);
  const [isLaunching, setIsLaunching] = useState(false);

  const launchPhases = [
    { phase: "Plan B Token Deployment", status: "complete", progress: 100 },
    { phase: "DEX Liquidity Pools", status: "complete", progress: 100 },
    { phase: "Exchange Submissions", status: "in-progress", progress: 75 },
    { phase: "Market Maker Setup", status: "in-progress", progress: 60 },
    { phase: "Viral Marketing Campaign", status: "ready", progress: 0 },
    { phase: "Institutional Partnerships", status: "ready", progress: 0 },
  ];

  const dexIntegrations = [
    {
      name: "Uniswap V3",
      status: "Live",
      liquidity: "$2.5M",
      volume24h: "$847K",
      url: "https://app.uniswap.org/#/tokens/polygon/0x742d35Cc66535C0532925a3b8d0E9B01d9c5d9A6C",
    },
    {
      name: "QuickSwap",
      status: "Live",
      liquidity: "$1.8M",
      volume24h: "$623K",
      url: "https://quickswap.exchange/#/swap?outputCurrency=0x742d35Cc66535C0532925a3b8d0E9B01d9c5d9A6C",
    },
    {
      name: "SushiSwap",
      status: "Launching",
      liquidity: "$1.2M",
      volume24h: "$445K",
      url: "https://app.sushi.com/swap?chainId=137&token1=0x742d35Cc66535C0532925a3b8d0E9B01d9c5d9A6C",
    },
    {
      name: "1inch",
      status: "Ready",
      liquidity: "$800K",
      volume24h: "$267K",
      url: "https://app.1inch.io/#/137/unified/GTT/MATIC",
    },
  ];

  const exchangeListings = [
    {
      tier: "Tier 1",
      exchanges: ["Binance", "Coinbase", "Kraken"],
      status: "Documentation Submitted",
      timeframe: "2-4 weeks",
      impact: "High",
    },
    {
      tier: "Tier 2",
      exchanges: ["Gate.io", "MEXC", "KuCoin"],
      status: "Under Review",
      timeframe: "1-2 weeks",
      impact: "Medium",
    },
    {
      tier: "Regional",
      exchanges: ["Bitget", "HTX", "Bybit"],
      status: "Applications Ready",
      timeframe: "3-7 days",
      impact: "Medium",
    },
  ];

  const revenueMetrics = {
    currentPrice: "$0.0125",
    marketCap: "$12.5M",
    volume24h: "$2.1M",
    feesCollected: "$168K",
    founderRevenue: "$134K",
    burnedTokens: "425,000 GTT",
    stakingAPY: "15.2%",
  };

  const viralMetrics = {
    socialMentions: "47,892",
    twitterFollowers: "28,543",
    telegramMembers: "12,987",
    discordMembers: "8,765",
    youtubeViews: "156K",
    tiktokViews: "2.3M",
  };

  const handleFullLaunch = () => {
    setIsLaunching(true);
    // Simulate launch progress
    const interval = setInterval(() => {
      setLaunchProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLaunching(false);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  useEffect(() => {
    // Real-time updates simulation
    const interval = setInterval(() => {
      // Simulate live data updates
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            🚀 FULL LAUNCH DASHBOARD
          </h1>
          <p className="text-xl text-slate-300 mb-6">
            Plan B GTT Token - Maximum Market Exposure Strategy
          </p>
          <Badge className="bg-green-600/20 text-green-400 text-lg px-4 py-2">
            LAUNCH SEQUENCE ACTIVE
          </Badge>
        </div>

        {/* Launch Progress */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-3">
              <Rocket className="h-6 w-6 text-blue-400" />
              <span>Launch Progress - {launchProgress}% Complete</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <Progress value={launchProgress} className="h-3" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {launchPhases.map((phase, index) => (
                <div key={index} className="p-4 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-semibold text-sm">
                      {phase.phase}
                    </span>
                    <div
                      className={`w-3 h-3 rounded-full ${
                        phase.status === "complete"
                          ? "bg-green-400"
                          : phase.status === "in-progress"
                            ? "bg-yellow-400"
                            : "bg-slate-400"
                      }`}
                    ></div>
                  </div>
                  <Progress value={phase.progress} className="h-2" />
                  <p className="text-slate-400 text-xs mt-1 capitalize">
                    {phase.status}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                onClick={handleFullLaunch}
                disabled={isLaunching}
              >
                {isLaunching ? (
                  <>
                    <Clock className="h-5 w-5 mr-2 animate-spin" />
                    Launching...
                  </>
                ) : (
                  <>
                    <Rocket className="h-5 w-5 mr-2" />
                    Execute Full Launch
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Live Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-green-900/30 to-blue-900/30 border-green-500/30">
            <CardContent className="p-6 text-center">
              <DollarSign className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-400">
                {revenueMetrics.currentPrice}
              </div>
              <p className="text-slate-300 text-sm">Current Price</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/30">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-400">
                {revenueMetrics.marketCap}
              </div>
              <p className="text-slate-300 text-sm">Market Cap</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border-blue-500/30">
            <CardContent className="p-6 text-center">
              <BarChart3 className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-400">
                {revenueMetrics.volume24h}
              </div>
              <p className="text-slate-300 text-sm">24h Volume</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-yellow-500/30">
            <CardContent className="p-6 text-center">
              <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-400">
                {revenueMetrics.founderRevenue}
              </div>
              <p className="text-slate-300 text-sm">Founder Revenue (24h)</p>
            </CardContent>
          </Card>
        </div>

        {/* DEX Integrations */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-3">
              <Globe className="h-6 w-6 text-blue-400" />
              <span>Live DEX Integrations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dexIntegrations.map((dex, index) => (
                <div key={index} className="p-4 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-bold">{dex.name}</h3>
                    <Badge
                      className={`
                      ${dex.status === "Live" ? "bg-green-600/20 text-green-400" : ""}
                      ${dex.status === "Launching" ? "bg-yellow-600/20 text-yellow-400" : ""}
                      ${dex.status === "Ready" ? "bg-blue-600/20 text-blue-400" : ""}
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
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-purple-500 text-purple-400 hover:bg-purple-600/20"
                    onClick={() => window.open(dex.url, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Trade on {dex.name}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Exchange Listings */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-3">
              <Target className="h-6 w-6 text-purple-400" />
              <span>Exchange Listing Pipeline</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {exchangeListings.map((tier, index) => (
                <div key={index} className="p-4 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-bold">
                      {tier.tier} Exchanges
                    </h3>
                    <Badge
                      className={`
                      ${tier.impact === "High" ? "bg-red-600/20 text-red-400" : ""}
                      ${tier.impact === "Medium" ? "bg-yellow-600/20 text-yellow-400" : ""}
                    `}
                    >
                      {tier.impact} Impact
                    </Badge>
                  </div>

                  <div className="mb-3">
                    <p className="text-slate-300 mb-2">
                      {tier.exchanges.join(", ")}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">
                        Status: {tier.status}
                      </span>
                      <span className="text-blue-400">
                        ETA: {tier.timeframe}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Viral Growth Metrics */}
        <Card className="bg-gradient-to-r from-pink-900/30 to-purple-900/30 border-pink-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-3">
              <Users className="h-6 w-6 text-pink-400" />
              <span>Viral Growth Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-400">
                  {viralMetrics.socialMentions}
                </div>
                <p className="text-slate-300 text-sm">Social Mentions</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {viralMetrics.twitterFollowers}
                </div>
                <p className="text-slate-300 text-sm">Twitter Followers</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {viralMetrics.telegramMembers}
                </div>
                <p className="text-slate-300 text-sm">Telegram Members</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {viralMetrics.tiktokViews}
                </div>
                <p className="text-slate-300 text-sm">TikTok Views</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
