import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Coins,
  PiggyBank,
  Activity,
  RefreshCw
} from "lucide-react";
import { getGTTContractInfo, getGTTPrice, getGTTPriceChange24h } from '@/lib/gtt';
import { useEthersProvider } from '@/lib/ethers';

interface TreasuryStats {
  gttVault: string;
  usdReserves: number;
  revenue24h: number;
  revenue24hUSD: number;
  yieldPaid: string;
  activeSubs: number;
  gttPrice: number;
  priceChange24h: number;
  totalSupply: string;
  tradingTaxRate: number;
}

export default function TreasuryDashboard() {
  const [treasuryStats, setTreasuryStats] = useState<TreasuryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const provider = useEthersProvider();

  const GTT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_GTT_CONTRACT || "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const fetchTreasuryData = async () => {
    try {
      setLoading(true);

      // Get on-chain GTT data
      let contractInfo = null;
      try {
        contractInfo = await getGTTContractInfo(provider, GTT_CONTRACT_ADDRESS);
      } catch (error) {
        console.log('Using mock contract data for development');
      }

      // Get GTT price data
      const [gttPrice, priceChange24h] = await Promise.all([
        getGTTPrice(),
        getGTTPriceChange24h()
      ]);

      // Mock treasury data - replace with real API calls in production
      const mockData: TreasuryStats = {
        gttVault: contractInfo?.treasuryBalance || "123456.75",
        usdReserves: 284500,
        revenue24h: 3420,
        revenue24hUSD: 1710,
        yieldPaid: contractInfo?.yieldPoolBalance || "5678.25",
        activeSubs: 1247,
        gttPrice,
        priceChange24h,
        totalSupply: contractInfo?.totalSupply || "1000000000",
        tradingTaxRate: contractInfo?.currentTaxRate || 200
      };

      setTreasuryStats(mockData);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching treasury data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTreasuryData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchTreasuryData, 30000);
    return () => clearInterval(interval);
  }, [provider]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatGTT = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 2
    }).format(num);
  };

  if (loading && !treasuryStats) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Treasury Overview</h3>
          <div className="animate-spin w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-slate-600 rounded w-3/4"></div>
                  <div className="h-8 bg-slate-600 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">Treasury Overview</h3>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-slate-400">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </span>
          <Button
            onClick={fetchTreasuryData}
            disabled={loading}
            size="sm"
            variant="outline"
            className="border-slate-600 text-slate-300 hover:text-white"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* GTT Price */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-400 flex items-center">
              <Coins className="w-4 h-4 mr-2" />
              GTT Price
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-white">
                {formatCurrency(treasuryStats?.gttPrice || 0)}
              </div>
              <div className="flex items-center">
                {(treasuryStats?.priceChange24h || 0) >= 0 ? (
                  <TrendingUp className="w-4 h-4 mr-1 text-green-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1 text-red-400" />
                )}
                <span className={`text-sm ${
                  (treasuryStats?.priceChange24h || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {(treasuryStats?.priceChange24h || 0).toFixed(2)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Treasury Balance */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-400 flex items-center">
              <PiggyBank className="w-4 h-4 mr-2" />
              Treasury Vault
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-white">
                {formatGTT(treasuryStats?.gttVault || 0)} GTT
              </div>
              <div className="text-sm text-slate-400">
                ≈ {formatCurrency((parseFloat(treasuryStats?.gttVault || '0') * (treasuryStats?.gttPrice || 0)))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 24h Revenue */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-400 flex items-center">
              <DollarSign className="w-4 h-4 mr-2" />
              24h Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-white">
                {formatCurrency(treasuryStats?.revenue24hUSD || 0)}
              </div>
              <div className="text-sm text-slate-400">
                {formatGTT(treasuryStats?.revenue24h || 0)} GTT
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Subscriptions */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-400 flex items-center">
              <Activity className="w-4 h-4 mr-2" />
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-white">
                {treasuryStats?.activeSubs?.toLocaleString() || '0'}
              </div>
              <div className="text-sm text-green-400">
                +5.2% this week
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Token Economics */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Token Economics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-slate-400">Total Supply</div>
                <div className="text-lg font-semibold text-white">
                  {formatGTT(treasuryStats?.totalSupply || 0)} GTT
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-400">Market Cap</div>
                <div className="text-lg font-semibold text-white">
                  {formatCurrency((parseFloat(treasuryStats?.totalSupply || '0') * (treasuryStats?.gttPrice || 0)))}
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-400">Trading Tax</div>
                <div className="text-lg font-semibold text-white">
                  {((treasuryStats?.tradingTaxRate || 0) / 100).toFixed(1)}%
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-400">Yield Distributed</div>
                <div className="text-lg font-semibold text-white">
                  {formatGTT(treasuryStats?.yieldPaid || 0)} GTT
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Treasury Health */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Treasury Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Revenue Stability:</span>
                <Badge className="bg-green-600 text-white">Excellent</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Burn Rate:</span>
                <Badge className="bg-blue-600 text-white">Sustainable</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Growth Rate:</span>
                <Badge className="bg-purple-600 text-white">High</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Liquidity:</span>
                <Badge className="bg-green-600 text-white">Strong</Badge>
              </div>
            </div>
            
            <div className="pt-2 border-t border-slate-700">
              <div className="text-sm text-slate-400">
                Treasury runway: <span className="text-white font-semibold">24+ months</span>
              </div>
              <div className="text-sm text-slate-400">
                Yield coverage: <span className="text-white font-semibold">100%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}