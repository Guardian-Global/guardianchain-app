import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Coins,
  TrendingUp,
  PieChart,
  Users,
  Lock,
  Zap,
  Award,
  Target,
  Calculator,
  BarChart3,
  DollarSign,
  Percent,
  Clock,
  Flame,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface TokenomicsData {
  totalSupply: number;
  circulatingSupply: number;
  burnedTokens: number;
  stakedTokens: number;
  currentPrice: number;
  marketCap: number;
  distribution: {
    community: number;
    team: number;
    ecosystem: number;
    investors: number;
    treasury: number;
    staking: number;
  };
  stakingAPY: number;
  inflationRate: number;
  burnRate: number;
}

export default function TokenomicsPage() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "distribution" | "staking" | "metrics"
  >("overview");

  const { data: tokenomics, isLoading } = useQuery<TokenomicsData>({
    queryKey: ["/api/tokenomics"],
  });

  // Default data for display
  const defaultTokenomics: TokenomicsData = {
    totalSupply: 1000000000,
    circulatingSupply: 400000000,
    burnedTokens: 50000000,
    stakedTokens: 200000000,
    currentPrice: 0.0075,
    marketCap: 3000000,
    distribution: {
      community: 40,
      team: 25,
      ecosystem: 20,
      investors: 15,
      treasury: 10,
      staking: 15,
    },
    stakingAPY: 12.3,
    inflationRate: -2.5, // Deflationary
    burnRate: 0.1,
  };

  const data = tokenomics || defaultTokenomics;

  const distributionData = [
    {
      label: "Community Rewards",
      percentage: data.distribution.community,
      color: "bg-blue-500",
      description:
        "Yield generation, governance participation, and platform activities",
    },
    {
      label: "Team & Development",
      percentage: data.distribution.team,
      color: "bg-green-500",
      description: "4-year vesting schedule with 1-year cliff",
    },
    {
      label: "Ecosystem Growth",
      percentage: data.distribution.ecosystem,
      color: "bg-purple-500",
      description: "Partnerships, integrations, and platform expansion",
    },
    {
      label: "Strategic Investors",
      percentage: data.distribution.investors,
      color: "bg-orange-500",
      description: "Seed and Series A funding rounds",
    },
    {
      label: "Treasury Reserve",
      percentage: data.distribution.treasury,
      color: "bg-red-500",
      description: "Emergency fund and long-term sustainability",
    },
    {
      label: "Staking Rewards",
      percentage: data.distribution.staking,
      color: "bg-yellow-500",
      description: "Additional rewards for token staking",
    },
  ];

  const keyMetrics = [
    {
      title: "Total Supply",
      value: `${(data.totalSupply / 1000000).toFixed(0)}M GTT`,
      change: "Fixed Cap",
      icon: Coins,
      color: "blue",
    },
    {
      title: "Circulating Supply",
      value: `${(data.circulatingSupply / 1000000).toFixed(0)}M GTT`,
      change: `${((data.circulatingSupply / data.totalSupply) * 100).toFixed(1)}%`,
      icon: TrendingUp,
      color: "green",
    },
    {
      title: "Market Cap",
      value: `$${(data.marketCap / 1000000).toFixed(1)}M`,
      change: "+15.2%",
      icon: DollarSign,
      color: "purple",
    },
    {
      title: "Current Price",
      value: `$${data.currentPrice.toFixed(4)}`,
      change: "+8.3%",
      icon: BarChart3,
      color: "orange",
    },
    {
      title: "Staked Tokens",
      value: `${(data.stakedTokens / 1000000).toFixed(0)}M GTT`,
      change: `${((data.stakedTokens / data.circulatingSupply) * 100).toFixed(1)}%`,
      icon: Lock,
      color: "indigo",
    },
    {
      title: "Burned Tokens",
      value: `${(data.burnedTokens / 1000000).toFixed(0)}M GTT`,
      change: "Permanent",
      icon: Flame,
      color: "red",
    },
  ];

  const stakingTiers = [
    {
      tier: "Explorer",
      minStake: "1,000 GTT",
      apy: "8%",
      benefits: ["Basic voting rights", "Yield generation", "Platform access"],
      color: "gray",
    },
    {
      tier: "Seeker",
      minStake: "10,000 GTT",
      apy: "10%",
      benefits: ["Enhanced voting weight", "Premium features", "Early access"],
      color: "blue",
    },
    {
      tier: "Creator",
      minStake: "50,000 GTT",
      apy: "12%",
      benefits: ["Creator tools", "Revenue sharing", "Custom verification"],
      color: "purple",
    },
    {
      tier: "Sovereign",
      minStake: "250,000 GTT",
      apy: "15%",
      benefits: [
        "Governance proposals",
        "Treasury access",
        "White-glove support",
      ],
      color: "gold",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "text-blue-500 bg-blue-50 dark:bg-blue-900/20",
      green: "text-green-500 bg-green-50 dark:bg-green-900/20",
      purple: "text-purple-500 bg-purple-50 dark:bg-purple-900/20",
      orange: "text-orange-500 bg-orange-50 dark:bg-orange-900/20",
      indigo: "text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20",
      red: "text-red-500 bg-red-50 dark:bg-red-900/20",
      gray: "text-gray-500 bg-gray-50 dark:bg-gray-900/20",
      gold: "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-32 bg-gray-200 dark:bg-gray-700 rounded"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Coins className="w-16 h-16 text-blue-500 mr-4" />
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
              GTT Tokenomics
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto">
            Discover the economic model powering GuardianChain's truth
            preservation ecosystem. Sustainable, deflationary, and
            community-driven.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm">
            {["overview", "distribution", "staking", "metrics"].map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "ghost"}
                onClick={() => setActiveTab(tab as any)}
                className="mx-1"
              >
                {tab === "overview" && <PieChart className="w-4 h-4 mr-2" />}
                {tab === "distribution" && <Target className="w-4 h-4 mr-2" />}
                {tab === "staking" && <Lock className="w-4 h-4 mr-2" />}
                {tab === "metrics" && <BarChart3 className="w-4 h-4 mr-2" />}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {keyMetrics.map((metric, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {metric.title}
                        </p>
                        <p className="text-2xl font-bold">{metric.value}</p>
                        <p
                          className={`text-sm ${getColorClasses(metric.color).split(" ")[0]}`}
                        >
                          {metric.change}
                        </p>
                      </div>
                      <div
                        className={`p-3 rounded-lg ${getColorClasses(metric.color)}`}
                      >
                        <metric.icon className="w-6 h-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Economic Model */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="w-5 h-5 mr-2" />
                  Economic Model Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Deflationary Mechanics
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-center">
                        <Flame className="w-4 h-4 text-red-500 mr-2" />
                        <span>0.1% of transaction fees burned</span>
                      </li>
                      <li className="flex items-center">
                        <Percent className="w-4 h-4 text-blue-500 mr-2" />
                        <span>Platform revenue used for buyback & burn</span>
                      </li>
                      <li className="flex items-center">
                        <Clock className="w-4 h-4 text-purple-500 mr-2" />
                        <span>Time-locked staking reduces supply</span>
                      </li>
                      <li className="flex items-center">
                        <Award className="w-4 h-4 text-green-500 mr-2" />
                        <span>Quality content rewards drive demand</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Value Accrual
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-center">
                        <Zap className="w-4 h-4 text-yellow-500 mr-2" />
                        <span>Governance voting power</span>
                      </li>
                      <li className="flex items-center">
                        <Lock className="w-4 h-4 text-indigo-500 mr-2" />
                        <span>Staking yield generation</span>
                      </li>
                      <li className="flex items-center">
                        <Users className="w-4 h-4 text-orange-500 mr-2" />
                        <span>Platform fee discounts</span>
                      </li>
                      <li className="flex items-center">
                        <TrendingUp className="w-4 h-4 text-teal-500 mr-2" />
                        <span>Revenue sharing from premium features</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Supply Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Token Supply Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Supply</span>
                    <span className="font-semibold">1,000,000,000 GTT</span>
                  </div>
                  <Progress
                    value={(data.circulatingSupply / data.totalSupply) * 100}
                    className="h-2"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>
                      Circulating:{" "}
                      {(data.circulatingSupply / 1000000).toFixed(0)}M GTT
                    </span>
                    <span>
                      Remaining:{" "}
                      {(
                        (data.totalSupply - data.circulatingSupply) /
                        1000000
                      ).toFixed(0)}
                      M GTT
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "distribution" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="w-5 h-5 mr-2" />
                  Token Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Distribution Chart */}
                  <div className="space-y-4">
                    {distributionData.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{item.label}</span>
                          <span className="text-sm font-semibold">
                            {item.percentage}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full ${item.color}`}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Vesting Schedule */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Vesting Schedule
                    </h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <h4 className="font-semibold mb-2">Team Tokens</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          25% of total supply with 4-year linear vesting and
                          1-year cliff
                        </p>
                        <Progress value={25} className="h-2" />
                      </div>

                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <h4 className="font-semibold mb-2">Investor Tokens</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          15% of total supply with 2-year linear vesting
                        </p>
                        <Progress value={60} className="h-2" />
                      </div>

                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <h4 className="font-semibold mb-2">
                          Community Rewards
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          40% distributed over 5 years based on platform
                          activity
                        </p>
                        <Progress value={35} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "staking" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="w-5 h-5 mr-2" />
                  Staking Tiers & Rewards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stakingTiers.map((tier, index) => (
                    <Card
                      key={index}
                      className={`border-2 hover:scale-105 transition-all ${
                        tier.color === "gold"
                          ? "border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20"
                          : tier.color === "purple"
                            ? "border-purple-300 bg-purple-50 dark:bg-purple-900/20"
                            : tier.color === "blue"
                              ? "border-blue-300 bg-blue-50 dark:bg-blue-900/20"
                              : "border-gray-300 bg-gray-50 dark:bg-gray-900/20"
                      }`}
                    >
                      <CardHeader className="text-center">
                        <CardTitle
                          className={`text-xl ${
                            tier.color === "gold"
                              ? "text-yellow-600"
                              : tier.color === "purple"
                                ? "text-purple-600"
                                : tier.color === "blue"
                                  ? "text-blue-600"
                                  : "text-gray-600"
                          }`}
                        >
                          {tier.tier}
                        </CardTitle>
                        <div className="text-2xl font-bold">{tier.apy}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {tier.minStake}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {tier.benefits.map((benefit, i) => (
                            <div key={i} className="flex items-center text-sm">
                              <Award className="w-3 h-3 mr-2 text-green-500" />
                              <span>{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Staking Calculator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="w-5 h-5 mr-2" />
                  Staking Calculator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Stake Amount (GTT)
                      </label>
                      <input
                        type="number"
                        placeholder="10000"
                        className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Staking Period
                      </label>
                      <select className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-600">
                        <option>30 days</option>
                        <option>90 days</option>
                        <option>180 days</option>
                        <option>365 days</option>
                      </select>
                    </div>
                    <Button className="w-full">Calculate Rewards</Button>
                  </div>

                  <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">
                      Projected Rewards
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Daily Rewards:</span>
                        <span className="font-semibold">~3.42 GTT</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly Rewards:</span>
                        <span className="font-semibold">~102.5 GTT</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Annual Rewards:</span>
                        <span className="font-semibold">~1,250 GTT</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total Value:</span>
                        <span className="text-green-600">~$9.38</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "metrics" && (
          <div className="space-y-6">
            {/* Real-time Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">+15.2%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    24h Price Change
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">12,847</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Token Holders
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <DollarSign className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">$156K</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    24h Volume
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Lock className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">50%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Staked Supply
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Token Utility Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Token Utility Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-500 mb-2">
                      45%
                    </div>
                    <div className="text-sm font-medium">Governance Voting</div>
                    <div className="text-xs text-gray-500">
                      Active participation in DAO decisions
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-500 mb-2">
                      35%
                    </div>
                    <div className="text-sm font-medium">Platform Fees</div>
                    <div className="text-xs text-gray-500">
                      Verification, minting, premium features
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-500 mb-2">
                      20%
                    </div>
                    <div className="text-sm font-medium">Yield Generation</div>
                    <div className="text-xs text-gray-500">
                      Staking rewards and grief score bonuses
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
