import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  DollarSign,
  Users,
  Shield,
  Flame,
  Target,
  Zap,
  Lock,
  BarChart3,
  PieChart,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

const TokenomicsEngine: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState("revenue");

  const tokenomicsData = {
    totalSupply: "1,000,000,000", // PLAN B: 1B optimized supply
    circulatingSupply: "250,000,000",
    marketCap: "$10,500,000,000",
    protocolRevenue: "$125,000,000", // 8% fee structure revenue
    burnRate: "2.5%", // Strategic burn mechanism
    stakingAPY: "15.2%",
    treasuryValue: "$850,000,000",
  };

  const distributionData = [
    {
      category: "Community Rewards",
      percentage: 40,
      amount: "400M GTT",
      color: "bg-blue-500",
    },
    {
      category: "Protocol Development",
      percentage: 25,
      amount: "250M GTT",
      color: "bg-green-500",
    },
    {
      category: "Enterprise Partnerships",
      percentage: 15,
      amount: "150M GTT",
      color: "bg-purple-500",
    },
    {
      category: "Team & Advisors",
      percentage: 10,
      amount: "100M GTT",
      color: "bg-yellow-500",
    },
    {
      category: "Treasury Reserve",
      percentage: 10,
      amount: "100M GTT",
      color: "bg-red-500",
    },
  ];

  const revenueStreams = [
    {
      source: "Enterprise API Licensing",
      monthly: "$15M",
      annual: "$180M",
      growth: "+45%",
      icon: <Shield className="w-5 h-5" />,
    },
    {
      source: "Transaction Fees",
      monthly: "$8M",
      annual: "$96M",
      growth: "+62%",
      icon: <DollarSign className="w-5 h-5" />,
    },
    {
      source: "NFT Marketplace Commission",
      monthly: "$5M",
      annual: "$60M",
      growth: "+38%",
      icon: <Target className="w-5 h-5" />,
    },
    {
      source: "Staking Protocol Fees",
      monthly: "$3M",
      annual: "$36M",
      growth: "+28%",
      icon: <Lock className="w-5 h-5" />,
    },
  ];

  const valueCaptureMetrics = [
    {
      metric: "Protocol Revenue",
      value: "$125M",
      change: "+156%",
      description:
        "Annual recurring revenue from enterprise clients and transaction fees",
    },
    {
      metric: "Token Burns",
      value: "12.5M GTT",
      change: "+89%",
      description:
        "Quarterly token burns reducing circulating supply and increasing scarcity",
    },
    {
      metric: "Staking Rewards",
      value: "15.2% APY",
      change: "+3.2%",
      description:
        "Competitive staking yields driving long-term token holding behavior",
    },
    {
      metric: "Treasury Growth",
      value: "$850M",
      change: "+234%",
      description: "Protocol-owned liquidity and diversified treasury assets",
    },
  ];

  const deflatinaryMechanisms = [
    {
      mechanism: "Transaction Fee Burns",
      description: "50% of all transaction fees automatically burned",
      impact: "1.2M GTT/month",
      status: "active",
    },
    {
      mechanism: "Enterprise License Burns",
      description:
        "25% of enterprise licensing revenue used for token buyback and burn",
      impact: "3.8M GTT/month",
      status: "active",
    },
    {
      mechanism: "Governance Vote Burns",
      description:
        "Failed proposals result in deposited GTT being permanently burned",
      impact: "150K GTT/month",
      status: "active",
    },
    {
      mechanism: "Premium Feature Access",
      description:
        "Advanced features require GTT payment which is immediately burned",
      impact: "500K GTT/month",
      status: "active",
    },
  ];

  return (
    <div className="w-full space-y-8">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center">
              <BarChart3 className="w-6 h-6 mr-2 text-green-400" />
              Advanced Tokenomics Engine
            </div>
            <Badge className="bg-green-600">Revenue-Backed</Badge>
          </CardTitle>
          <p className="text-slate-300">
            Sustainable tokenomics designed for billion-dollar protocol
            valuation with real revenue backing and deflationary mechanisms.
          </p>
        </CardHeader>
      </Card>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700 text-center">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-400">
              {tokenomicsData.marketCap}
            </div>
            <div className="text-sm text-slate-400">Market Cap</div>
            <div className="flex items-center justify-center mt-1">
              <ArrowUp className="w-3 h-3 text-green-400 mr-1" />
              <span className="text-xs text-green-400">+127%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 text-center">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-400">
              {tokenomicsData.protocolRevenue}
            </div>
            <div className="text-sm text-slate-400">Annual Revenue</div>
            <div className="flex items-center justify-center mt-1">
              <ArrowUp className="w-3 h-3 text-green-400 mr-1" />
              <span className="text-xs text-green-400">+156%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 text-center">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-red-400">
              {tokenomicsData.burnRate}
            </div>
            <div className="text-sm text-slate-400">Monthly Burn Rate</div>
            <div className="flex items-center justify-center mt-1">
              <Flame className="w-3 h-3 text-red-400 mr-1" />
              <span className="text-xs text-red-400">Deflationary</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 text-center">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-purple-400">
              {tokenomicsData.stakingAPY}
            </div>
            <div className="text-sm text-slate-400">Staking APY</div>
            <div className="flex items-center justify-center mt-1">
              <Lock className="w-3 h-3 text-purple-400 mr-1" />
              <span className="text-xs text-purple-400">Sustainable</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Token Distribution */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-blue-400" />
            Token Distribution Strategy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {distributionData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded ${item.color}`}></div>
                  <span className="text-white font-medium">
                    {item.category}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold">{item.amount}</div>
                  <div className="text-slate-400 text-sm">
                    {item.percentage}%
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <div className="text-lg font-bold text-white">
                {tokenomicsData.totalSupply}
              </div>
              <div className="text-sm text-slate-400">Total Supply</div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <div className="text-lg font-bold text-blue-400">
                {tokenomicsData.circulatingSupply}
              </div>
              <div className="text-sm text-slate-400">Circulating Supply</div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <div className="text-lg font-bold text-green-400">
                {tokenomicsData.treasuryValue}
              </div>
              <div className="text-sm text-slate-400">Treasury Value</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Streams */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
            Revenue Streams Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {revenueStreams.map((stream, index) => (
              <Card key={index} className="bg-slate-700/50 border-slate-600">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-600 rounded-lg mr-3">
                        {stream.icon}
                      </div>
                      <div>
                        <div className="text-white font-medium">
                          {stream.source}
                        </div>
                        <div className="text-slate-400 text-sm">
                          Annual: {stream.annual}
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-green-600">{stream.growth}</Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-400">
                      {stream.monthly}
                    </div>
                    <div className="text-sm text-slate-400">
                      Monthly Revenue
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Value Capture Mechanisms */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Target className="w-5 h-5 mr-2 text-purple-400" />
            Value Capture Mechanisms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {valueCaptureMetrics.map((metric, index) => (
              <div key={index} className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-semibold">{metric.metric}</h3>
                  <Badge className="bg-green-600">{metric.change}</Badge>
                </div>
                <div className="text-2xl font-bold text-blue-400 mb-2">
                  {metric.value}
                </div>
                <p className="text-slate-300 text-sm">{metric.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Deflationary Mechanisms */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Flame className="w-5 h-5 mr-2 text-red-400" />
            Deflationary Burn Mechanisms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deflatinaryMechanisms.map((mechanism, index) => (
              <div key={index} className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-semibold">
                    {mechanism.mechanism}
                  </h3>
                  <Badge className="bg-red-600">
                    {mechanism.status === "active" ? "Active" : "Pending"}
                  </Badge>
                </div>
                <p className="text-slate-300 text-sm mb-3">
                  {mechanism.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">
                    Monthly Impact:
                  </span>
                  <span className="text-red-400 font-bold">
                    {mechanism.impact}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-red-900/20 border border-red-700 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Flame className="w-5 h-5 text-red-400 mr-2" />
              <h3 className="text-white font-semibold">
                Total Monthly Burn Rate
              </h3>
            </div>
            <div className="text-2xl font-bold text-red-400 mb-2">
              6.15M GTT
            </div>
            <p className="text-slate-300 text-sm">
              Approximately 2.5% of circulating supply burned monthly, creating
              sustained deflationary pressure and value accrual for long-term
              holders.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Future Projections */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-400" />
            2025 Protocol Projections
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                $100B+
              </div>
              <div className="text-slate-400 mb-2">Target Market Cap</div>
              <Progress value={42} className="h-2" />
              <div className="text-xs text-slate-500 mt-1">42% to target</div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">$1B+</div>
              <div className="text-slate-400 mb-2">Annual Protocol Revenue</div>
              <Progress value={12} className="h-2" />
              <div className="text-xs text-slate-500 mt-1">12% to target</div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                100M
              </div>
              <div className="text-slate-400 mb-2">Active Users</div>
              <Progress value={8} className="h-2" />
              <div className="text-xs text-slate-500 mt-1">8% to target</div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <TrendingUp className="w-4 h-4 mr-2" />
              View Full Financial Model
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TokenomicsEngine;
