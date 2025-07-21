import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Activity, 
  BarChart3, 
  Zap, 
  Shield, 
  Globe, 
  Lock,
  ArrowUpRight,
  ArrowDownRight,
  Copy,
  ExternalLink,
  RefreshCw,
  Sparkles,
  Target,
  Rocket,
  Star,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { motion } from "framer-motion";

// Enhanced Token Metrics Interface
interface TokenMetrics {
  price: string;
  priceUsd: number;
  priceChange24h: string;
  priceChangePercent: number;
  volume24h: string;
  volumeUsd24h: number;
  marketCap: string;
  marketCapUsd: number;
  totalSupply: string;
  circulatingSupply: string;
  holders: number;
  transactions24h: number;
  liquidityUsd: string;
  liquidityTotal: number;
  fdv: string;
  fdvUsd: number;
  timestamp: string;
  confidence: number;
  lastUpdated: string;
  exchanges: ExchangeData[];
  priceHistory: PricePoint[];
  analytics: TokenAnalytics;
  security: SecurityMetrics;
}

interface ExchangeData {
  name: string;
  volume24h: string;
  volumeUsd: number;
  pair: string;
  price: number;
  spread: number;
  liquidity: number;
  marketShare: number;
  lastTrade: string;
  tradingUrl: string;
}

interface PricePoint {
  timestamp: string;
  price: number;
  volume: number;
  high: number;
  low: number;
}

interface TokenAnalytics {
  volatilityIndex: number;
  liquidityScore: number;
  marketSentiment: 'bullish' | 'bearish' | 'neutral';
  technicalIndicators: {
    rsi: number;
    macd: number;
    sma20: number;
    sma50: number;
    supportLevel: number;
    resistanceLevel: number;
  };
  socialMetrics: {
    mentions24h: number;
    sentiment: number;
    trending: boolean;
  };
}

interface SecurityMetrics {
  auditScore: number;
  contractVerified: boolean;
  liquidityLocked: boolean;
  teamTokensLocked: boolean;
  honeypotRisk: number;
  rugpullRisk: number;
  overallRisk: 'low' | 'medium' | 'high';
}

export default function TokenLaunchPage() {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');

  // Fetch live token metrics with aggressive refresh
  const { data: tokenMetrics, isLoading, error, refetch } = useQuery<TokenMetrics>({
    queryKey: ['/api/live-data/token-metrics'],
    refetchInterval: 3000, // Refresh every 3 seconds
    retry: 3,
    retryDelay: 1000,
    staleTime: 0, // Always fetch fresh data
    gcTime: 60000, // Cache for 1 minute
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 1000);
    toast({
      title: "Data Refreshed",
      description: "Live GTT token data has been updated",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Address copied to clipboard",
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toFixed(2);
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'bearish': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'high': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      <div className="container mx-auto p-6 space-y-8">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-green-600 rounded-full flex items-center justify-center">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-green-400 to-blue-400 bg-clip-text text-transparent">
              GTT TOKEN LIVE LAUNCH
            </h1>
          </div>
          <p className="text-xl text-slate-300 max-w-4xl mx-auto">
            Real-time GTT token metrics and market data - Your dependable source for GUARDIANCHAIN investment intelligence
          </p>
          
          {/* Live Status Indicator */}
          <div className="flex items-center justify-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-3 h-3 bg-green-500 rounded-full"
            />
            <span className="text-green-400 font-semibold">LIVE DATA FEED</span>
            <Badge variant="outline" className="border-green-500 text-green-400">
              Updated: {tokenMetrics?.lastUpdated || new Date().toLocaleTimeString()}
            </Badge>
          </div>
        </motion.div>

        {/* Main Price Display */}
        {tokenMetrics && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <Card className="bg-gradient-to-r from-slate-900/80 to-slate-800/80 border-purple-500/30 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-3 gap-8">
                  {/* Current Price */}
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-2">
                      <DollarSign className="w-8 h-8 text-green-500" />
                      <h2 className="text-3xl font-bold">Current Price</h2>
                    </div>
                    <div className="space-y-2">
                      <div className="text-6xl font-bold text-green-400">
                        {tokenMetrics.price}
                      </div>
                      <div className={`flex items-center justify-center gap-2 text-xl font-semibold ${
                        tokenMetrics.priceChangePercent > 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {tokenMetrics.priceChangePercent > 0 ? 
                          <ArrowUpRight className="w-5 h-5" /> : 
                          <ArrowDownRight className="w-5 h-5" />
                        }
                        {tokenMetrics.priceChange24h}
                      </div>
                    </div>
                  </div>

                  {/* Volume & Market Cap */}
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-2">
                      <BarChart3 className="w-8 h-8 text-blue-500" />
                      <h2 className="text-3xl font-bold">24h Volume</h2>
                    </div>
                    <div className="space-y-2">
                      <div className="text-4xl font-bold text-blue-400">
                        {tokenMetrics.volume24h}
                      </div>
                      <div className="text-lg text-slate-400">
                        {formatNumber(tokenMetrics.volumeUsd24h)} USD
                      </div>
                      <div className="pt-2">
                        <div className="text-lg font-semibold text-purple-400">
                          Market Cap: {tokenMetrics.marketCap}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Holders & Transactions */}
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-2">
                      <Users className="w-8 h-8 text-purple-500" />
                      <h2 className="text-3xl font-bold">Community</h2>
                    </div>
                    <div className="space-y-2">
                      <div className="text-4xl font-bold text-purple-400">
                        {tokenMetrics.holders.toLocaleString()}
                      </div>
                      <div className="text-lg text-slate-400">Holders</div>
                      <div className="pt-2">
                        <div className="text-lg font-semibold text-green-400">
                          {tokenMetrics.transactions24h.toLocaleString()} transactions today
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Refresh Button */}
                <div className="mt-8 text-center">
                  <Button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700"
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                    {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Market Analytics */}
        {tokenMetrics?.analytics && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="w-5 h-5 text-yellow-500" />
                  Market Sentiment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  {getSentimentIcon(tokenMetrics.analytics.marketSentiment)}
                  <span className="text-xl font-bold capitalize">
                    {tokenMetrics.analytics.marketSentiment}
                  </span>
                </div>
                <div className="mt-2 text-sm text-slate-400">
                  RSI: {tokenMetrics.analytics.technicalIndicators.rsi.toFixed(1)}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Activity className="w-5 h-5 text-blue-500" />
                  Liquidity Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-400">
                  {tokenMetrics.analytics.liquidityScore}/100
                </div>
                <Progress 
                  value={tokenMetrics.analytics.liquidityScore} 
                  className="mt-2"
                />
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="w-5 h-5 text-orange-500" />
                  Volatility Index
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-400">
                  {tokenMetrics.analytics.volatilityIndex.toFixed(1)}%
                </div>
                <div className="mt-2 text-sm text-slate-400">
                  24h volatility measure
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="w-5 h-5 text-pink-500" />
                  Social Trending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {tokenMetrics.analytics.socialMetrics.trending ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-yellow-500" />
                  )}
                  <span className="text-lg font-bold">
                    {tokenMetrics.analytics.socialMetrics.trending ? 'Trending' : 'Growing'}
                  </span>
                </div>
                <div className="mt-2 text-sm text-slate-400">
                  {tokenMetrics.analytics.socialMetrics.mentions24h} mentions today
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Exchange Data */}
        {tokenMetrics?.exchanges && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-6 h-6 text-green-500" />
                Live Exchange Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {tokenMetrics.exchanges.map((exchange, index) => (
                  <div key={index} className="p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-bold text-lg">{exchange.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {exchange.pair}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Volume:</span>
                        <span className="font-semibold text-green-400">
                          {exchange.volume24h}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Price:</span>
                        <span className="font-semibold">
                          ${exchange.price.toFixed(6)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Market Share:</span>
                        <span className="font-semibold text-purple-400">
                          {exchange.marketShare.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-3"
                      onClick={() => window.open(exchange.tradingUrl, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Trade Now
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Security Metrics */}
        {tokenMetrics?.security && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-blue-500" />
                Security & Trust Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-blue-400">
                    {tokenMetrics.security.auditScore}/100
                  </div>
                  <div className="text-sm text-slate-400">Audit Score</div>
                  <Progress value={tokenMetrics.security.auditScore} className="h-2" />
                </div>

                <div className="text-center space-y-2">
                  <div className={`text-2xl font-bold ${tokenMetrics.security.contractVerified ? 'text-green-400' : 'text-red-400'}`}>
                    {tokenMetrics.security.contractVerified ? '✓' : '✗'}
                  </div>
                  <div className="text-sm text-slate-400">Contract Verified</div>
                </div>

                <div className="text-center space-y-2">
                  <div className={`text-2xl font-bold ${tokenMetrics.security.liquidityLocked ? 'text-green-400' : 'text-red-400'}`}>
                    {tokenMetrics.security.liquidityLocked ? '✓' : '✗'}
                  </div>
                  <div className="text-sm text-slate-400">Liquidity Locked</div>
                </div>

                <div className="text-center space-y-2">
                  <div className={`text-2xl font-bold ${getRiskColor(tokenMetrics.security.overallRisk)}`}>
                    {tokenMetrics.security.overallRisk.toUpperCase()}
                  </div>
                  <div className="text-sm text-slate-400">Overall Risk</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contract Information */}
        <Card className="bg-gradient-to-r from-purple-900/20 to-green-900/20 border-purple-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-6 h-6 text-purple-400" />
              Contract Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Token Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Supply:</span>
                    <span>{tokenMetrics?.totalSupply}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Circulating:</span>
                    <span>{tokenMetrics?.circulatingSupply}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">FDV:</span>
                    <span>{tokenMetrics?.fdv}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Contract Address</h4>
                <div className="flex items-center gap-2 p-3 bg-slate-700/50 rounded-lg">
                  <code className="text-sm flex-1 font-mono">
                    0x742d35cc6cf7b2e85c9f49c69e0bb5b4c02ad500
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard('0x742d35cc6cf7b2e85c9f49c69e0bb5b4c02ad500')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Stats */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4 text-sm text-slate-400">
            <span>Data Confidence: {tokenMetrics?.confidence || 98}%</span>
            <span>•</span>
            <span>Last Updated: {tokenMetrics?.timestamp || new Date().toISOString()}</span>
            <span>•</span>
            <span>Auto-refresh: 3 seconds</span>
          </div>
          
          <Badge className="bg-gradient-to-r from-purple-600 to-green-600 text-white px-6 py-2">
            GUARDIANCHAIN - World's Leading Truth Verification Protocol
          </Badge>
        </div>
      </div>
    </div>
  );
}