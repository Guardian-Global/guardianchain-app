import React, { useEffect, useState } from 'react';
import { getLatestTreasurySnapshot, TreasurySnapshot } from '@/lib/treasury';
import { fetchGTTMarketData } from '@/lib/gttPrice';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, DollarSign, Coins, BarChart3, PieChart, Activity } from "lucide-react";
import { BRAND_COLORS, BRAND_NAME } from "@/lib/constants";

export default function TreasuryDashboard() {
  const [snapshot, setSnapshot] = useState<TreasurySnapshot | null>(null);
  const [marketData, setMarketData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [treasuryData, marketInfo] = await Promise.all([
          getLatestTreasurySnapshot(),
          fetchGTTMarketData()
        ]);
        setSnapshot(treasuryData);
        setMarketData(marketInfo);
      } catch (error) {
        console.error('Failed to load treasury data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!snapshot) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">GTT Treasury Dashboard</h2>
          <p className="text-slate-400">Failed to load treasury data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <section className="pt-20 pb-8 bg-gradient-to-br from-purple-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">
            GTT Treasury & Platform Financials
          </h1>
          <p className="text-xl text-slate-300 mb-6">
            Real-time monitoring of {BRAND_NAME} economic health and token metrics
          </p>
          <Badge className="bg-green-600 text-white px-4 py-2">
            <Activity className="w-4 h-4 mr-2" />
            Last Updated: {new Date(snapshot.timestamp).toLocaleString()}
          </Badge>
        </div>
      </section>

      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-400 flex items-center">
                  <Coins className="w-4 h-4 mr-2" />
                  Total GTT Supply
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-white">
                  {snapshot.gttTotalSupply.toLocaleString()}
                </p>
                <p className="text-xs text-slate-500 mt-1">GTT Tokens</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-400 flex items-center">
                  <PieChart className="w-4 h-4 mr-2" />
                  Treasury Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold" style={{ color: BRAND_COLORS.SUCCESS }}>
                  {snapshot.gttTreasury.toLocaleString()}
                </p>
                <p className="text-xs text-slate-500 mt-1">GTT Reserved</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-400 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Yield Pool
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold" style={{ color: BRAND_COLORS.GUARDIAN }}>
                  {snapshot.gttYieldPool.toLocaleString()}
                </p>
                <p className="text-xs text-slate-500 mt-1">Available Rewards</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-400 flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Platform Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-400">
                  ${snapshot.platformRevenueUSD.toLocaleString()}
                </p>
                <p className="text-xs text-slate-500 mt-1">Total USD</p>
              </CardContent>
            </Card>
          </div>

          {/* Market Data */}
          {marketData && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Market Cap
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-bold text-white">
                    ${marketData.marketCap.toLocaleString()}
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    {marketData.circulatingSupply.toLocaleString()} GTT Circulating
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">24h Volume</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-bold text-white">
                    ${marketData.volume24h.toLocaleString()}
                  </p>
                  <p className="text-sm text-slate-400 mt-1">Trading Activity</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Token Price</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-bold text-white">
                    ${marketData.price.toFixed(4)}
                  </p>
                  <p className="text-sm text-slate-400 mt-1">Current GTT/USD</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Token Burn Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">GTT Burned:</span>
                    <span className="text-red-400 font-semibold">
                      {snapshot.gttBurned.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Burn Rate:</span>
                    <span className="text-slate-400">
                      {((snapshot.gttBurned / snapshot.gttTotalSupply) * 100).toFixed(3)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Deflationary Pressure:</span>
                    <Badge className="bg-red-600 text-white">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Trading Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">24h Volume:</span>
                    <span className="text-green-400 font-semibold">
                      ${snapshot.tradingVolume24h.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Liquidity Health:</span>
                    <Badge className="bg-green-600 text-white">Healthy</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Market Activity:</span>
                    <Badge className="bg-blue-600 text-white">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Treasury Controls */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Treasury Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  className="w-full"
                  style={{ backgroundColor: BRAND_COLORS.GUARDIAN }}
                  onClick={() => console.log('Generate treasury report')}
                >
                  Generate Report
                </Button>
                <Button 
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                  onClick={() => console.log('Sync treasury data')}
                >
                  Sync Data
                </Button>
                <Button 
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                  onClick={() => console.log('Export treasury data')}
                >
                  Export Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}