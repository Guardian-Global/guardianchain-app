import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { getTreasuryMetrics } from "@/lib/analytics";

interface TreasuryData {
  totalValue: number;
  gttPrice: number;
  marketCap: number;
  change24h: number;
  lastUpdate: string;
}

export default function TreasuryDashboard() {
  const [treasuryData, setTreasuryData] = useState<TreasuryData | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTreasuryData();
  }, []);

  const loadTreasuryData = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const data = await getTreasuryMetrics();
      if (data) {
        setTreasuryData({
          totalValue: data.total_value || 0,
          gttPrice: data.gtt_price || 0,
          marketCap: data.market_cap || 0,
          change24h: data.change_24h || 0,
          lastUpdate: data.updated_at || new Date().toISOString()
        });
      } else {
        setError("No treasury data available");
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-green-400" />
            Treasury Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-green-400" />
            Treasury Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2 text-yellow-400" />
              <p className="text-yellow-300 text-sm">{error}</p>
            </div>
            <p className="text-slate-400 text-xs mt-2">
              Connect Supabase and ensure treasury_snapshots table is populated
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!treasuryData) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-green-400" />
            Treasury Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-slate-400 text-sm text-center py-8">
            No treasury data available yet
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 4,
      maximumFractionDigits: 4
    }).format(value);
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-green-400" />
            Treasury Overview
          </div>
          <Badge variant="outline" className="text-xs">
            Live Data
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-700/50 rounded-lg p-4">
            <p className="text-slate-400 text-sm">Total Treasury Value</p>
            <p className="text-white text-2xl font-bold">
              {formatCurrency(treasuryData.totalValue)}
            </p>
            <div className="flex items-center mt-1">
              {treasuryData.change24h >= 0 ? (
                <TrendingUp className="w-4 h-4 mr-1 text-green-400" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1 text-red-400" />
              )}
              <span className={`text-sm ${treasuryData.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {treasuryData.change24h >= 0 ? '+' : ''}{treasuryData.change24h.toFixed(2)}%
              </span>
            </div>
          </div>

          <div className="bg-slate-700/50 rounded-lg p-4">
            <p className="text-slate-400 text-sm">GTT Price</p>
            <p className="text-white text-2xl font-bold">
              {formatPrice(treasuryData.gttPrice)}
            </p>
            <p className="text-slate-400 text-xs mt-1">
              Market Cap: {formatCurrency(treasuryData.marketCap)}
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-500 text-center">
          Last updated: {new Date(treasuryData.lastUpdate).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
}