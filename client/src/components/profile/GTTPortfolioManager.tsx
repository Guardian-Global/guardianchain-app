import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  PieChart,
  BarChart3,
  Clock,
  Target,
  Coins,
  Gift,
  ShoppingCart,
  RefreshCw,
} from "lucide-react";

interface Investment {
  id: string;
  capsuleTitle: string;
  investmentDate: string;
  gttInvested: number;
  currentValue: number;
  yieldGenerated: number;
  projectedYield: number;
  roi: number;
}

interface TradeHistory {
  id: string;
  type: "buy" | "sell" | "airdrop" | "yield";
  amount: number;
  price: number;
  date: string;
  status: "completed" | "pending";
}

export default function GTTPortfolioManager() {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock investment data
  const investments: Investment[] = [
    {
      id: "1",
      capsuleTitle: "Climate Research Data Verification",
      investmentDate: "2024-11-15",
      gttInvested: 500,
      currentValue: 823.75,
      yieldGenerated: 147.5,
      projectedYield: 275.25,
      roi: 64.7,
    },
    {
      id: "2",
      capsuleTitle: "Legal Document Authentication",
      investmentDate: "2024-10-22",
      gttInvested: 750,
      currentValue: 1156.8,
      yieldGenerated: 289.33,
      projectedYield: 445.5,
      roi: 54.2,
    },
    {
      id: "3",
      capsuleTitle: "AI Training Data Integrity",
      investmentDate: "2024-09-08",
      gttInvested: 1000,
      currentValue: 2267.45,
      yieldGenerated: 567.45,
      projectedYield: 1200.0,
      roi: 126.7,
    },
  ];

  const tradeHistory: TradeHistory[] = [
    {
      id: "1",
      type: "yield",
      amount: 127.5,
      price: 2.0,
      date: "2024-12-19",
      status: "completed",
    },
    {
      id: "2",
      type: "buy",
      amount: 500,
      price: 1.95,
      date: "2024-12-18",
      status: "completed",
    },
    {
      id: "3",
      type: "airdrop",
      amount: 250,
      price: 0,
      date: "2024-12-15",
      status: "completed",
    },
    {
      id: "4",
      type: "sell",
      amount: 100,
      price: 2.1,
      date: "2024-12-10",
      status: "completed",
    },
  ];

  const totalInvested = investments.reduce(
    (sum, inv) => sum + inv.gttInvested,
    0
  );
  const totalCurrentValue = investments.reduce(
    (sum, inv) => sum + inv.currentValue,
    0
  );
  const totalYieldGenerated = investments.reduce(
    (sum, inv) => sum + inv.yieldGenerated,
    0
  );
  const totalProjectedYield = investments.reduce(
    (sum, inv) => sum + inv.projectedYield,
    0
  );
  const avgROI =
    totalCurrentValue > 0
      ? ((totalCurrentValue - totalInvested) / totalInvested) * 100
      : 0;

  const getTradeIcon = (type: string) => {
    const icons = {
      buy: ShoppingCart,
      sell: DollarSign,
      airdrop: Gift,
      yield: Coins,
    };
    return icons[type as keyof typeof icons] || DollarSign;
  };

  const getTradeColor = (type: string) => {
    const colors = {
      buy: "text-blue-400",
      sell: "text-red-400",
      airdrop: "text-purple-400",
      yield: "text-green-400",
    };
    return colors[type as keyof typeof colors] || "text-gray-400";
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800">
          <CardContent className="p-4 text-center">
            <DollarSign className="w-6 h-6 text-amber-400 mx-auto mb-2" />
            <div className="text-xl font-bold">
              {totalInvested.toLocaleString()} GTT
            </div>
            <div className="text-xs text-slate-400">Total Invested</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className="text-xl font-bold">
              {totalCurrentValue.toLocaleString()} GTT
            </div>
            <div className="text-xs text-slate-400">Current Value</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800">
          <CardContent className="p-4 text-center">
            <Coins className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-xl font-bold">
              {totalYieldGenerated.toLocaleString()} GTT
            </div>
            <div className="text-xs text-slate-400">Yield Generated</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800">
          <CardContent className="p-4 text-center">
            <Target className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-xl font-bold">+{avgROI.toFixed(1)}%</div>
            <div className="text-xs text-slate-400">Average ROI</div>
          </CardContent>
        </Card>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4 bg-slate-800">
          <TabsTrigger value="overview" className="flex items-center">
            <PieChart className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="investments" className="flex items-center">
            <BarChart3 className="w-4 h-4 mr-2" />
            Investments
          </TabsTrigger>
          <TabsTrigger value="trading" className="flex items-center">
            <RefreshCw className="w-4 h-4 mr-2" />
            Trading
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800">
              <CardHeader>
                <CardTitle>Portfolio Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>7-Day Performance</span>
                      <span className="text-green-400">+8.7%</span>
                    </div>
                    <Progress value={87} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>30-Day Performance</span>
                      <span className="text-green-400">+23.4%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>90-Day Performance</span>
                      <span className="text-green-400">+67.2%</span>
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>All-Time Performance</span>
                      <span className="text-green-400">
                        +{avgROI.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={Math.min(avgROI, 100)} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800">
              <CardHeader>
                <CardTitle>Yield Projections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400 mb-1">
                      {totalProjectedYield.toLocaleString()} GTT
                    </div>
                    <div className="text-sm text-slate-400">
                      Projected Annual Yield
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Monthly Estimate</span>
                      <span className="text-green-400">
                        {(totalProjectedYield / 12).toFixed(0)} GTT
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm">Weekly Estimate</span>
                      <span className="text-green-400">
                        {(totalProjectedYield / 52).toFixed(0)} GTT
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm">Daily Estimate</span>
                      <span className="text-green-400">
                        {(totalProjectedYield / 365).toFixed(1)} GTT
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="investments">
          <Card className="bg-slate-800">
            <CardHeader>
              <CardTitle>Investment Portfolio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {investments.map((investment) => (
                  <div
                    key={investment.id}
                    className="bg-slate-700 p-4 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-white mb-1">
                          {investment.capsuleTitle}
                        </h3>
                        <p className="text-sm text-slate-400">
                          Invested:{" "}
                          {new Date(
                            investment.investmentDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge
                        className={`${
                          investment.roi > 0 ? "bg-green-500" : "bg-red-500"
                        } text-white`}
                      >
                        {investment.roi > 0 ? "+" : ""}
                        {investment.roi.toFixed(1)}% ROI
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-slate-400">Invested: </span>
                        <span className="text-white">
                          {investment.gttInvested} GTT
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400">Current: </span>
                        <span className="text-amber-400">
                          {investment.currentValue.toLocaleString()} GTT
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400">Yield: </span>
                        <span className="text-green-400">
                          {investment.yieldGenerated.toLocaleString()} GTT
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400">Projected: </span>
                        <span className="text-blue-400">
                          {investment.projectedYield.toLocaleString()} GTT
                        </span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress to Projected Yield</span>
                        <span>
                          {(
                            (investment.yieldGenerated /
                              investment.projectedYield) *
                            100
                          ).toFixed(0)}
                          %
                        </span>
                      </div>
                      <Progress
                        value={
                          (investment.yieldGenerated /
                            investment.projectedYield) *
                          100
                        }
                        className="h-2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trading">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button className="bg-green-600 hover:bg-green-700 flex flex-col items-center py-8">
                    <ArrowUpRight className="w-6 h-6 mb-2" />
                    <span>Buy GTT</span>
                    <span className="text-xs text-green-200">
                      Current: $2.04
                    </span>
                  </Button>

                  <Button className="bg-red-600 hover:bg-red-700 flex flex-col items-center py-8">
                    <ArrowDownLeft className="w-6 h-6 mb-2" />
                    <span>Sell GTT</span>
                    <span className="text-xs text-red-200">
                      Best bid: $2.02
                    </span>
                  </Button>

                  <Button className="bg-purple-600 hover:bg-purple-700 flex flex-col items-center py-8">
                    <Gift className="w-6 h-6 mb-2" />
                    <span>Airdrop</span>
                    <span className="text-xs text-purple-200">
                      Send to friends
                    </span>
                  </Button>

                  <Button className="bg-blue-600 hover:bg-blue-700 flex flex-col items-center py-8">
                    <RefreshCw className="w-6 h-6 mb-2" />
                    <span>Trade</span>
                    <span className="text-xs text-blue-200">
                      Exchange tokens
                    </span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800">
              <CardHeader>
                <CardTitle>Market Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>GTT Price</span>
                    <div className="text-right">
                      <div className="text-lg font-bold">$2.04</div>
                      <div className="text-green-400 text-sm flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +5.2% (24h)
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <span>Market Cap</span>
                    <span className="font-mono">$247.8M</span>
                  </div>

                  <div className="flex justify-between">
                    <span>24h Volume</span>
                    <span className="font-mono">$12.4M</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Circulating Supply</span>
                    <span className="font-mono">121.4M GTT</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Your Holdings</span>
                    <span className="font-mono text-amber-400">12,847 GTT</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card className="bg-slate-800">
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tradeHistory.map((trade) => {
                  const TradeIcon = getTradeIcon(trade.type);

                  return (
                    <div
                      key={trade.id}
                      className="flex items-center justify-between bg-slate-700 p-4 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-full bg-slate-600 ${getTradeColor(
                            trade.type
                          )}`}
                        >
                          <TradeIcon className="w-4 h-4" />
                        </div>

                        <div>
                          <div className="font-medium capitalize">
                            {trade.type}
                          </div>
                          <div className="text-sm text-slate-400">
                            {new Date(trade.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-medium">
                          {trade.type === "sell" ? "-" : "+"}
                          {trade.amount.toLocaleString()} GTT
                        </div>
                        <div className="text-sm text-slate-400">
                          {trade.price > 0
                            ? `$${trade.price.toFixed(2)}`
                            : "Free"}
                        </div>
                      </div>

                      <Badge
                        className={`${
                          trade.status === "completed"
                            ? "bg-green-500"
                            : "bg-yellow-500"
                        } text-white`}
                      >
                        {trade.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
