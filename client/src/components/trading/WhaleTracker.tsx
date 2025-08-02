import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  Eye,
  AlertTriangle,
  Zap,
  Target,
} from "lucide-react";

interface WhaleTransaction {
  id: string;
  wallet: string;
  type: "buy" | "sell";
  amount: number;
  usdValue: number;
  timestamp: Date;
  exchange: string;
  confidence: number;
}

interface SmartMoneyWallet {
  address: string;
  nickname: string;
  totalProfit: number;
  winRate: number;
  avgHoldTime: string;
  currentGTTHoldings: number;
  lastActivity: Date;
  tier: "whale" | "smart_money" | "institution";
}

export function WhaleTracker() {
  const [whaleTransactions, setWhaleTransactions] = useState<
    WhaleTransaction[]
  >([]);
  const [smartWallets, setSmartWallets] = useState<SmartMoneyWallet[]>([]);
  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "transactions" | "wallets" | "alerts"
  >("transactions");

  useEffect(() => {
    // Simulate real-time whale activity
    const generateWhaleData = () => {
      const exchanges = ["Binance", "Coinbase", "OKX", "Kraken", "Uniswap V3"];
      const walletPrefixes = [
        "0x742d...",
        "0x959C...",
        "0x8c7C...",
        "0xa1b2...",
        "0xdef0...",
      ];

      const transaction: WhaleTransaction = {
        id: Math.random().toString(36).substr(2, 9),
        wallet:
          walletPrefixes[Math.floor(Math.random() * walletPrefixes.length)] +
          Math.random().toString(36).substr(2, 4),
        type: Math.random() > 0.5 ? "buy" : "sell",
        amount: Math.floor(Math.random() * 50000000) + 100000, // 100K to 50M GTT
        usdValue: 0,
        timestamp: new Date(),
        exchange: exchanges[Math.floor(Math.random() * exchanges.length)],
        confidence: Math.floor(Math.random() * 30) + 70, // 70-100% confidence
      };

      transaction.usdValue = transaction.amount * 0.0075; // Current GTT price

      setWhaleTransactions((prev) => [transaction, ...prev.slice(0, 19)]);
    };

    const interval = setInterval(generateWhaleData, 15000); // Every 15 seconds
    generateWhaleData(); // Initial load

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Generate smart money wallets
    const smartWalletData: SmartMoneyWallet[] = [
      {
        address: "0x742d35Cc66535C0532925a3b8d0E9B01d9c5d9A6C",
        nickname: "GTT Accumulator",
        totalProfit: 2750000,
        winRate: 87.5,
        avgHoldTime: "45 days",
        currentGTTHoldings: 15000000,
        lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
        tier: "whale",
      },
      {
        address: "0x959C1E8Baa6EB72A0A9F2547B59176a96dD239db",
        nickname: "Truth Seeker Alpha",
        totalProfit: 1890000,
        winRate: 92.3,
        avgHoldTime: "12 days",
        currentGTTHoldings: 8500000,
        lastActivity: new Date(Date.now() - 30 * 60 * 1000),
        tier: "smart_money",
      },
      {
        address: "0x8c7C2D9a3F4B5E6f7A8b9C0d1E2F3a4B5c6D7e8F",
        nickname: "Institutional Bot",
        totalProfit: 5200000,
        winRate: 78.9,
        avgHoldTime: "3 months",
        currentGTTHoldings: 35000000,
        lastActivity: new Date(Date.now() - 5 * 60 * 1000),
        tier: "institution",
      },
    ];

    setSmartWallets(smartWalletData);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(2)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    return `$${amount.toFixed(2)}`;
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "whale":
        return "bg-purple-500";
      case "smart_money":
        return "bg-blue-500";
      case "institution":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Eye className="h-5 w-5 text-purple-400" />
            Whale & Smart Money Tracker
            <Badge
              variant="outline"
              className="text-green-400 border-green-400"
            >
              LIVE
            </Badge>
          </CardTitle>
          <div className="flex gap-2 mt-4">
            <Button
              size="sm"
              variant={activeTab === "transactions" ? "default" : "outline"}
              onClick={() => setActiveTab("transactions")}
            >
              Live Transactions
            </Button>
            <Button
              size="sm"
              variant={activeTab === "wallets" ? "default" : "outline"}
              onClick={() => setActiveTab("wallets")}
            >
              Smart Wallets
            </Button>
            <Button
              size="sm"
              variant={activeTab === "alerts" ? "default" : "outline"}
              onClick={() => setActiveTab("alerts")}
            >
              Alert Settings
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {activeTab === "transactions" && (
            <div className="space-y-3">
              <div className="text-sm text-slate-400 mb-4">
                Tracking transactions &gt; $1,000 with 70%+ confidence
              </div>
              {whaleTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 bg-slate-800 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded ${tx.type === "buy" ? "bg-green-500/20" : "bg-red-500/20"}`}
                    >
                      {tx.type === "buy" ? (
                        <TrendingUp className="h-4 w-4 text-green-400" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-400" />
                      )}
                    </div>
                    <div>
                      <div className="text-white font-medium">
                        {formatNumber(tx.amount)} GTT {tx.type.toUpperCase()}
                      </div>
                      <div className="text-sm text-slate-400">
                        {tx.wallet} • {tx.exchange}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium">
                      {formatCurrency(tx.usdValue)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {tx.confidence}% confident
                      </Badge>
                      <span className="text-xs text-slate-400">
                        {tx.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "wallets" && (
            <div className="space-y-4">
              <div className="text-sm text-slate-400 mb-4">
                Top performing wallets currently holding GTT
              </div>
              {smartWallets.map((wallet) => (
                <div
                  key={wallet.address}
                  className="p-4 bg-slate-800 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-medium">
                          {wallet.nickname}
                        </span>
                        <div
                          className={`w-2 h-2 rounded-full ${getTierColor(wallet.tier)}`}
                        />
                        <Badge variant="outline" className="text-xs">
                          {wallet.tier.replace("_", " ").toUpperCase()}
                        </Badge>
                      </div>
                      <div className="text-sm text-slate-400 font-mono">
                        {wallet.address.slice(0, 20)}...
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-medium">
                        +{formatCurrency(wallet.totalProfit)}
                      </div>
                      <div className="text-sm text-slate-400">Total P&L</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-white font-medium">
                        {wallet.winRate}%
                      </div>
                      <div className="text-xs text-slate-400">Win Rate</div>
                    </div>
                    <div>
                      <div className="text-white font-medium">
                        {wallet.avgHoldTime}
                      </div>
                      <div className="text-xs text-slate-400">Avg Hold</div>
                    </div>
                    <div>
                      <div className="text-purple-400 font-medium">
                        {formatNumber(wallet.currentGTTHoldings)}
                      </div>
                      <div className="text-xs text-slate-400">GTT Holdings</div>
                    </div>
                    <div>
                      <div className="text-blue-400 font-medium">
                        {Math.floor(
                          (Date.now() - wallet.lastActivity.getTime()) / 60000,
                        )}
                        m
                      </div>
                      <div className="text-xs text-slate-400">Last Active</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "alerts" && (
            <div className="space-y-4">
              <div className="text-sm text-slate-400 mb-4">
                Configure real-time whale activity alerts
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    <div>
                      <div className="text-white font-medium">
                        Large Buy Orders
                      </div>
                      <div className="text-sm text-slate-400">
                        Alert on purchases &gt; $10K
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={alertsEnabled ? "default" : "outline"}
                    onClick={() => setAlertsEnabled(!alertsEnabled)}
                  >
                    {alertsEnabled ? "Enabled" : "Enable"}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Zap className="h-4 w-4 text-blue-400" />
                    <div>
                      <div className="text-white font-medium">
                        Smart Money Moves
                      </div>
                      <div className="text-sm text-slate-400">
                        Track 90%+ win rate wallets
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Configure
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Target className="h-4 w-4 text-green-400" />
                    <div>
                      <div className="text-white font-medium">
                        Institutional Activity
                      </div>
                      <div className="text-sm text-slate-400">
                        Monitor whale accumulation patterns
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Configure
                  </Button>
                </div>
              </div>

              <div className="mt-6 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <div className="text-purple-400 font-medium mb-2">
                  API Access Available
                </div>
                <div className="text-sm text-slate-300">
                  Get real-time whale alerts via webhook or WebSocket for
                  trading bot integration. Enterprise plans include custom alert
                  thresholds and advanced analytics.
                </div>
                <Button className="mt-3" size="sm">
                  Get API Access
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
