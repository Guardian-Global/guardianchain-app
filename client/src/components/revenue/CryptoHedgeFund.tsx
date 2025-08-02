import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  DollarSign,
  PieChart,
  Users,
  Shield,
  Star,
  Building2,
  Briefcase,
  Crown,
  Target,
  BarChart3,
  Activity,
  Zap,
  Lock,
  Globe,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

interface Fund {
  id: string;
  name: string;
  strategy: string;
  aum: number;
  returns: number;
  sharpe: number;
  maxDrawdown: number;
  minimumInvestment: number;
  managementFee: number;
  performanceFee: number;
  investors: number;
  status: "active" | "closed" | "launching";
  riskLevel: "conservative" | "moderate" | "aggressive";
}

interface Investor {
  id: string;
  name: string;
  type: "individual" | "institution" | "family_office";
  investment: number;
  returns: number;
  joinDate: string;
  tier: "platinum" | "gold" | "silver";
}

export function CryptoHedgeFund() {
  const [activeTab, setActiveTab] = useState<
    "funds" | "performance" | "investors" | "analytics"
  >("funds");

  const [funds] = useState<Fund[]>([
    {
      id: "1",
      name: "Guardian Alpha Fund",
      strategy: "Long/Short Crypto Equity",
      aum: 850000000, // $850M
      returns: 127.3,
      sharpe: 2.8,
      maxDrawdown: -12.4,
      minimumInvestment: 250000,
      managementFee: 2.0,
      performanceFee: 20.0,
      investors: 847,
      status: "active",
      riskLevel: "aggressive",
    },
    {
      id: "2",
      name: "Truth Yield Fund",
      strategy: "DeFi Yield Arbitrage",
      aum: 450000000, // $450M
      returns: 89.7,
      sharpe: 3.2,
      maxDrawdown: -8.1,
      minimumInvestment: 100000,
      managementFee: 1.5,
      performanceFee: 15.0,
      investors: 1247,
      status: "active",
      riskLevel: "moderate",
    },
    {
      id: "3",
      name: "Institutional Quant",
      strategy: "Market Neutral AI",
      aum: 1200000000, // $1.2B
      returns: 67.4,
      sharpe: 4.1,
      maxDrawdown: -5.3,
      minimumInvestment: 1000000,
      managementFee: 2.5,
      performanceFee: 25.0,
      investors: 234,
      status: "active",
      riskLevel: "conservative",
    },
  ]);

  const [topInvestors] = useState<Investor[]>([
    {
      id: "1",
      name: "Sovereign Wealth Fund UAE",
      type: "institution",
      investment: 250000000,
      returns: 87.3,
      joinDate: "2024-03-15",
      tier: "platinum",
    },
    {
      id: "2",
      name: "Renaissance Family Office",
      type: "family_office",
      investment: 180000000,
      returns: 95.7,
      joinDate: "2024-01-22",
      tier: "platinum",
    },
    {
      id: "3",
      name: "Blackstone Crypto Division",
      type: "institution",
      investment: 320000000,
      returns: 76.2,
      joinDate: "2024-02-08",
      tier: "platinum",
    },
  ]);

  const totalAUM = funds.reduce((sum, fund) => sum + fund.aum, 0);
  const averageReturns =
    funds.reduce((sum, fund) => sum + fund.returns, 0) / funds.length;
  const totalInvestors = funds.reduce((sum, fund) => sum + fund.investors, 0);

  // Revenue calculations
  const managementFeesAnnual = funds.reduce(
    (sum, fund) => sum + (fund.aum * fund.managementFee) / 100,
    0,
  );
  const performanceFeesAnnual = funds.reduce(
    (sum, fund) =>
      sum + (((fund.aum * fund.returns) / 100) * fund.performanceFee) / 100,
    0,
  );
  const totalAnnualRevenue = managementFeesAnnual + performanceFeesAnnual;

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}B`;
    }
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US").format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Guardian Hedge Fund
          </h2>
          <p className="text-slate-400">
            Managing ${formatCurrency(totalAUM)} AUM with{" "}
            {averageReturns.toFixed(1)}% average returns
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge className="bg-green-600/20 text-green-400 border-green-500/30">
            ${formatCurrency(totalAnnualRevenue)} Annual Revenue
          </Badge>
          <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/30">
            {totalInvestors} Investors
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-600/20 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Total AUM</p>
                <p className="text-xl font-bold text-white">
                  {formatCurrency(totalAUM)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Avg Returns</p>
                <p className="text-xl font-bold text-white">
                  {averageReturns.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600/20 rounded-lg">
                <Users className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Investors</p>
                <p className="text-xl font-bold text-white">
                  {formatNumber(totalInvestors)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-600/20 rounded-lg">
                <Building2 className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Annual Revenue</p>
                <p className="text-xl font-bold text-white">
                  {formatCurrency(totalAnnualRevenue)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-slate-800 p-1 rounded-lg">
        <Button
          size="sm"
          variant={activeTab === "funds" ? "default" : "ghost"}
          onClick={() => setActiveTab("funds")}
          className="flex-1"
        >
          Fund Portfolio
        </Button>
        <Button
          size="sm"
          variant={activeTab === "performance" ? "default" : "ghost"}
          onClick={() => setActiveTab("performance")}
          className="flex-1"
        >
          Performance
        </Button>
        <Button
          size="sm"
          variant={activeTab === "investors" ? "default" : "ghost"}
          onClick={() => setActiveTab("investors")}
          className="flex-1"
        >
          Investors
        </Button>
        <Button
          size="sm"
          variant={activeTab === "analytics" ? "default" : "ghost"}
          onClick={() => setActiveTab("analytics")}
          className="flex-1"
        >
          Revenue Analytics
        </Button>
      </div>

      {/* Content Sections */}
      {activeTab === "funds" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Active Funds</h3>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Building2 className="h-4 w-4 mr-2" />
              Launch New Fund
            </Button>
          </div>

          <div className="grid gap-6">
            {funds.map((fund) => (
              <Card key={fund.id} className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h4 className="text-xl font-bold text-white">
                          {fund.name}
                        </h4>
                        <Badge
                          className={`${
                            fund.status === "active"
                              ? "bg-green-600/20 text-green-400"
                              : fund.status === "launching"
                                ? "bg-yellow-600/20 text-yellow-400"
                                : "bg-gray-600/20 text-gray-400"
                          }`}
                        >
                          {fund.status.toUpperCase()}
                        </Badge>
                        <Badge
                          className={`${
                            fund.riskLevel === "conservative"
                              ? "bg-blue-600/20 text-blue-400"
                              : fund.riskLevel === "moderate"
                                ? "bg-yellow-600/20 text-yellow-400"
                                : "bg-red-600/20 text-red-400"
                          }`}
                        >
                          {fund.riskLevel.toUpperCase()}
                        </Badge>
                      </div>

                      <p className="text-sm text-slate-400 mb-4">
                        {fund.strategy}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-slate-500">
                            Assets Under Management
                          </p>
                          <p className="text-lg font-bold text-white">
                            {formatCurrency(fund.aum)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">YTD Returns</p>
                          <p className="text-lg font-bold text-green-400">
                            +{fund.returns}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Sharpe Ratio</p>
                          <p className="text-lg font-bold text-purple-400">
                            {fund.sharpe}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Max Drawdown</p>
                          <p className="text-lg font-bold text-red-400">
                            {fund.maxDrawdown}%
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="text-right ml-6">
                      <div className="mb-4">
                        <p className="text-xs text-slate-500">Investors</p>
                        <p className="text-2xl font-bold text-white">
                          {formatNumber(fund.investors)}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between gap-4">
                          <span className="text-xs text-slate-400">
                            Management Fee
                          </span>
                          <span className="text-xs text-white">
                            {fund.managementFee}%
                          </span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-xs text-slate-400">
                            Performance Fee
                          </span>
                          <span className="text-xs text-white">
                            {fund.performanceFee}%
                          </span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-xs text-slate-400">
                            Min Investment
                          </span>
                          <span className="text-xs text-white">
                            {formatCurrency(fund.minimumInvestment)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gradient-to-br from-purple-900/50 to-green-900/50 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">
                    Launch Institutional Fund
                  </h4>
                  <p className="text-sm text-purple-300 mb-4">
                    Create custom fund structures for institutional clients with
                    $10M+ allocations
                  </p>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Contact Institutional Sales
                  </Button>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">Potential AUM</p>
                  <p className="text-3xl font-bold text-green-400">$2.5B+</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "performance" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-400" />
                  Cumulative Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {funds.map((fund) => (
                    <div
                      key={fund.id}
                      className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
                    >
                      <div>
                        <p className="text-white font-medium">{fund.name}</p>
                        <p className="text-xs text-slate-400">
                          {fund.strategy}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-bold">
                          +{fund.returns}%
                        </p>
                        <p className="text-xs text-slate-400">YTD</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-400" />
                  Risk Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {funds.map((fund) => (
                    <div key={fund.id} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">{fund.name}</span>
                        <span className="text-white">
                          Sharpe: {fund.sharpe}
                        </span>
                      </div>
                      <Progress
                        value={Math.min(fund.sharpe * 20, 100)}
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "investors" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              Top Institutional Investors
            </h3>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Users className="h-4 w-4 mr-2" />
              Investor Relations
            </Button>
          </div>

          <div className="grid gap-4">
            {topInvestors.map((investor) => (
              <Card key={investor.id} className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-lg ${
                          investor.type === "institution"
                            ? "bg-blue-600/20"
                            : investor.type === "family_office"
                              ? "bg-purple-600/20"
                              : "bg-green-600/20"
                        }`}
                      >
                        <Building2
                          className={`h-6 w-6 ${
                            investor.type === "institution"
                              ? "text-blue-400"
                              : investor.type === "family_office"
                                ? "text-purple-400"
                                : "text-green-400"
                          }`}
                        />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white">
                          {investor.name}
                        </h4>
                        <p className="text-sm text-slate-400">
                          {investor.type.replace("_", " ").toUpperCase()} •
                          Joined {investor.joinDate}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          className={`${
                            investor.tier === "platinum"
                              ? "bg-purple-600/20 text-purple-400"
                              : investor.tier === "gold"
                                ? "bg-yellow-600/20 text-yellow-400"
                                : "bg-gray-600/20 text-gray-400"
                          }`}
                        >
                          {investor.tier.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xl font-bold text-white">
                        {formatCurrency(investor.investment)}
                      </p>
                      <p className="text-sm text-green-400">
                        +{investor.returns}% returns
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-400" />
                  Revenue Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Management Fees</span>
                    <span className="text-green-400 font-bold">
                      {formatCurrency(managementFeesAnnual)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Performance Fees</span>
                    <span className="text-green-400 font-bold">
                      {formatCurrency(performanceFeesAnnual)}
                    </span>
                  </div>
                  <div className="border-t border-slate-600 pt-2">
                    <div className="flex justify-between">
                      <span className="text-white font-medium">
                        Total Annual Revenue
                      </span>
                      <span className="text-green-400 font-bold text-xl">
                        {formatCurrency(totalAnnualRevenue)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                  Growth Projections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-400">Current AUM</span>
                      <span className="text-white">
                        {formatCurrency(totalAUM)}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-400">
                        Projected AUM (12m)
                      </span>
                      <span className="text-blue-400">
                        {formatCurrency(totalAUM * 1.8)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">
                        Projected Revenue (12m)
                      </span>
                      <span className="text-green-400 font-bold">
                        {formatCurrency(totalAnnualRevenue * 1.8)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-br from-green-900/50 to-blue-900/50 border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">
                    Fund Management Excellence
                  </h4>
                  <p className="text-green-300 mb-4">
                    Top-tier institutional fund management generating{" "}
                    {((totalAnnualRevenue / totalAUM) * 100).toFixed(1)}%
                    revenue yield on AUM
                  </p>
                  <div className="flex items-center gap-4">
                    <ArrowUpRight className="h-5 w-5 text-green-400" />
                    <span className="text-sm text-green-300">
                      47% YoY revenue growth
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">Institutional Grade</p>
                  <p className="text-3xl font-bold text-green-400">AAA</p>
                  <p className="text-sm text-green-300">Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
