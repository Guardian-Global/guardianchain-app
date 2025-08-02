// Commander Dashboard: Live financials, yield, AI business suggestions, compliance alerts

import React, { useEffect, useState } from "react";
import {
  getTreasurySummary,
  aiBusinessIntelligence,
  complianceCheck,
} from "@/lib/veritus.engine";
import {
  fetchGTTPrice,
  fetchGTTPriceChange,
  fetchGTTMarketData,
} from "@/lib/gttPrice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Shield,
  DollarSign,
  AlertTriangle,
  Zap,
  Users,
} from "lucide-react";
import { BRAND_COLORS, BRAND_NAME } from "@/lib/constants";

export default function FinancialDashboard() {
  const [treasury, setTreasury] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<string>("");
  const [compliance, setCompliance] = useState<any>(null);
  const [gttPrice, setGttPrice] = useState<number>(0);
  const [priceChange, setPriceChange] = useState<any>(null);
  const [marketData, setMarketData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const [
          treasuryData,
          complianceData,
          priceData,
          changeData,
          marketInfo,
        ] = await Promise.all([
          getTreasurySummary(),
          complianceCheck(),
          fetchGTTPrice(),
          fetchGTTPriceChange(),
          fetchGTTMarketData(),
        ]);

        setTreasury(treasuryData);
        setCompliance(complianceData);
        setGttPrice(priceData || 0);
        setPriceChange(changeData);
        setMarketData(marketInfo);

        if (treasuryData) {
          const bizSuggestions = await aiBusinessIntelligence(treasuryData);
          setSuggestions(bizSuggestions || "");
        }
      } catch (error) {
        console.error("Dashboard load error:", error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <section className="pt-20 pb-8 bg-gradient-to-br from-purple-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              🛡️ Veritus Financial Command Center
            </h1>
            <p className="text-xl text-slate-300 mb-6">
              Live treasury monitoring, AI business intelligence, and compliance
              oversight
            </p>
            <Badge className="bg-green-600 text-white px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              All Systems Operational
            </Badge>
          </div>
        </div>
      </section>

      {/* Treasury Overview */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <DollarSign className="w-6 h-6 mr-3" style={{ color: "#10B981" }} />
            Treasury Summary
          </h2>

          {treasury ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-slate-400">
                    Total GTT Balance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-white">
                    {treasury.total_balance?.toLocaleString() || "0"}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">GTT Tokens</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-slate-400">
                    Yield Paid
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: "#10B981" }}
                  >
                    {treasury.yield_paid?.toLocaleString() || "0"}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">24h Period</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-slate-400">
                    Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: BRAND_COLORS.GUARDIAN }}
                  >
                    {treasury.revenue?.toLocaleString() || "0"}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Platform Fees</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-slate-400">
                    Expenses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-red-400">
                    {treasury.expenses?.toLocaleString() || "0"}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Operational Costs
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-slate-400">
                    GTT Price
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-white">
                    ${gttPrice?.toFixed(4) || "0.0000"}
                  </p>
                  {priceChange?.change && (
                    <p
                      className={`text-xs mt-1 ${
                        priceChange.isPositive
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {priceChange.isPositive ? "+" : ""}
                      {priceChange?.change?.toFixed(2) || "0.00"}% 24h
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <p className="text-slate-400">Loading treasury data...</p>
          )}
        </div>
      </section>

      {/* AI Business Intelligence */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Zap className="w-6 h-6 mr-3" style={{ color: "#8B5CF6" }} />
            AI Business Intelligence
          </h2>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Strategic Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-700/50 p-4 rounded-lg">
                {suggestions ? (
                  <div className="whitespace-pre-line text-slate-300">
                    {suggestions}
                  </div>
                ) : (
                  <p className="text-slate-400">Generating AI insights...</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Compliance Status */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Shield
              className="w-6 h-6 mr-3"
              style={{ color: BRAND_COLORS.SUCCESS }}
            />
            Compliance Status
          </h2>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">
                Real-time Compliance Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              {compliance ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Status:</span>
                    <Badge
                      className={
                        compliance.status === "compliant"
                          ? "bg-green-600"
                          : "bg-red-600"
                      }
                    >
                      {compliance.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Checks Passed:</span>
                    <span className="text-green-400 font-semibold">
                      {compliance.checks_passed}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Checks Failed:</span>
                    <span className="text-red-400 font-semibold">
                      {compliance.checks_failed}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Regions Monitored:</span>
                    <span className="text-slate-400">
                      {compliance.regions_monitored?.join(", ")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Last Check:</span>
                    <span className="text-slate-400 text-sm">
                      {new Date(compliance.last_check).toLocaleString()}
                    </span>
                  </div>

                  {compliance.alerts?.length > 0 && (
                    <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
                      <div className="flex items-center mb-2">
                        <AlertTriangle className="w-4 h-4 mr-2 text-yellow-500" />
                        <span className="text-yellow-500 font-medium">
                          Active Alerts
                        </span>
                      </div>
                      {compliance.alerts.map((alert: string, index: number) => (
                        <p key={index} className="text-yellow-300 text-sm">
                          {alert}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-slate-400">Loading compliance data...</p>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-8 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Users
              className="w-6 h-6 mr-3"
              style={{ color: BRAND_COLORS.GUARDIAN }}
            />
            Financial Operations
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Tier Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-sm mb-4">
                  Monitor and adjust user subscription tiers
                </p>
                <Button
                  className="w-full"
                  style={{ backgroundColor: BRAND_COLORS.GUARDIAN }}
                  onClick={() => (window.location.href = "/tiers")}
                >
                  Manage Tiers
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Donation Center</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-sm mb-4">
                  Review capsule credit donations and distributions
                </p>
                <Button
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                  onClick={() => (window.location.href = "/donate-access")}
                >
                  View Donations
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Sync Operations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-sm mb-4">
                  Manually trigger yield sync and reports
                </p>
                <Button
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Force Sync
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
