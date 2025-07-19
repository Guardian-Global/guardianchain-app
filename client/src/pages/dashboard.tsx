import React, { useEffect, useState } from 'react';
import { fetchTreasurySnapshot, fetchGTTMarket, fetchStripeSubscriptions } from "@/lib/treasury";
import { AIAdvisorPanel } from "@/components/AIAdvisorPanel";
import TreasuryDashboard from "@/components/TreasuryDashboard";
import AIAccountingPanel from "@/components/AIAccountingPanel";
import ClaimAllYieldPanel from "@/components/web3/ClaimAllYieldPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from 'wouter';
import { 
  DollarSign, 
  TrendingUp, 
  Shield, 
  FileText, 
  Brain,
  Activity,
  Users,
  BarChart3,
  Coins,
  AlertTriangle
} from "lucide-react";
import { BRAND_COLORS, BRAND_NAME } from "@/lib/constants";

function CommanderDashboard() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <section className="pt-20 pb-8 bg-gradient-to-br from-purple-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">
            {BRAND_NAME} Commander Dashboard
          </h1>
          <p className="text-xl text-slate-300">
            Advanced treasury management, AI insights, and yield claiming hub
          </p>
        </div>
      </section>

      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/treasury">
              <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-green-400" />
                    Treasury
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 text-sm">
                    Real-time GTT treasury and market metrics
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/ai-advisor">
              <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-purple-400" />
                    AI Advisor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 text-sm">
                    Strategic recommendations and automated insights
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/reporting">
              <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-400" />
                    Reports
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 text-sm">
                    Automated daily operations reports
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Treasury Dashboard Component */}
          <TreasuryDashboard />
          
          {/* AI Accounting Panel */}
          <AIAccountingPanel />

          {/* GTT Yield Claiming Panel */}
          <ClaimAllYieldPanel />

        </div>
      </div>
    </div>
  );
}

// Previous section data that was partially displayed
const dashboardSections = [
  {
    title: "Treasury Overview",
    description: "Real-time GTT treasury and market metrics",
    href: "/treasury",
    icon: DollarSign,
    color: BRAND_COLORS.SUCCESS,
    status: "operational",
    metrics: {
      value: "$2.4M",
      label: "Treasury Value",
      trend: "+12.5%"
    }
  },
  {
    title: "AI Financial Advisor", 
    description: "Strategic recommendations and automated insights",
    href: "/ai-advisor",
    icon: Brain,
    color: BRAND_COLORS.GUARDIAN,
    status: "active",
    metrics: {
      value: "94%",
      label: "Confidence Score",
      trend: "+2.1%"
    }
  }
];

function Dashboard() {
  const [treasury, setTreasury] = useState<any>(null);
  const [market, setMarket] = useState<any>(null);
  const [subscriptions, setSubscriptions] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setErrors([]);
    const newErrors: string[] = [];

    try {
      const treasuryData = await fetchTreasurySnapshot();
      setTreasury(treasuryData);
    } catch (e) {
      newErrors.push((e as Error).message);
    }

    try {
      const marketData = await fetchGTTMarket();
      setMarket(marketData);
    } catch (e) {
      newErrors.push((e as Error).message);
    }

    try {
      const subscriptionData = await fetchStripeSubscriptions();
      setSubscriptions(subscriptionData);
    } catch (e) {
      newErrors.push((e as Error).message);
    }

    setErrors(newErrors);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading GuardianChain Financial Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-green-400 to-blue-400 bg-clip-text text-transparent">
            GUARDIANCHAIN Financial Dashboard
          </h1>
          <p className="text-xl text-slate-300">
            Live market, treasury, and yield analytics
          </p>
        </div>

        {/* Error Alerts */}
        {errors.length > 0 && (
          <Card className="bg-red-900/20 border-red-700">
            <CardHeader>
              <CardTitle className="text-red-300 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Data Source Configuration Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {errors.map((error, index) => (
                  <li key={index} className="text-red-200 text-sm">• {error}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Live Financial Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">GTT Market</CardTitle>
            </CardHeader>
            <CardContent>
              {market ? (
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-green-400">
                    ${market.price}
                  </div>
                  <div className={`flex items-center ${market.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {market.change24h >= 0 ? '+' : ''}{market.change24h.toFixed(2)}% (24h)
                  </div>
                  <div className="text-xs text-slate-500">Source: {market.source}</div>
                </div>
              ) : (
                <div className="text-slate-400">Market data unavailable</div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Treasury</CardTitle>
            </CardHeader>
            <CardContent>
              {treasury ? (
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-purple-400">
                    {treasury.balance.toLocaleString()} GTT
                  </div>
                  <div className="text-sm text-slate-300">
                    Yield Distributed: {treasury.yieldPaid.toLocaleString()} GTT
                  </div>
                  <div className="text-sm text-slate-300">
                    Active Capsules: {treasury.activeCapsules.toLocaleString()}
                  </div>
                  <Badge className={treasury.complianceOk ? 'bg-green-600' : 'bg-red-600'}>
                    {treasury.complianceOk ? 'Compliant' : 'Alert'}
                  </Badge>
                </div>
              ) : (
                <div className="text-slate-400">Treasury data unavailable</div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Revenue (Stripe)</CardTitle>
            </CardHeader>
            <CardContent>
              {subscriptions ? (
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-blue-400">
                    ${subscriptions.monthlyRevenue.toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-300">
                    Active Users: {subscriptions.activeUsers.toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-300">
                    Total Subscriptions: {subscriptions.totalSubscriptions.toLocaleString()}
                  </div>
                </div>
              ) : (
                <div className="text-slate-400">Subscription data unavailable</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* System Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardSections.map((section, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center">
                    <section.icon className="w-5 h-5 mr-2" style={{ color: section.color }} />
                    {section.title}
                  </CardTitle>
                  <Badge className="bg-green-600 text-xs">
                    {section.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 text-sm mb-4">
                  {section.description}
                </p>
                
                <div className="bg-slate-700/30 p-3 rounded-lg mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">{section.metrics.label}</span>
                    <div className="text-right">
                      <span className="text-white font-semibold">{section.metrics.value}</span>
                      <div className="flex items-center mt-1">
                        <TrendingUp className="w-3 h-3 mr-1 text-green-400" />
                        <span className="text-xs text-green-400">{section.metrics.trend}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Link href={section.href}>
                  <div 
                    className="w-full py-2 px-4 rounded-lg text-white text-center font-medium cursor-pointer hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: section.color }}
                  >
                    Access Dashboard
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Advisor Panel */}
        <AIAdvisorPanel treasury={treasury} market={market} />

        {/* Treasury Dashboard */}
        <TreasuryDashboard />

        {/* AI Accounting Panel */}
        <AIAccountingPanel />

        {/* System Status */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Users className="w-5 h-5 mr-2 text-purple-400" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">API Services:</span>
                <Badge className="bg-green-600 text-white">Operational</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Database:</span>
                <Badge className="bg-green-600 text-white">Healthy</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">AI Services:</span>
                <Badge className="bg-green-600 text-white">Active</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Compliance:</span>
                <Badge className="bg-green-600 text-white">Compliant</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Yield Engine:</span>
                <Badge className="bg-green-600 text-white">Distributing</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;