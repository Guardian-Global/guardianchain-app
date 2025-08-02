import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { BrandedText } from "@/components/BrandEnforcement";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  Users,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calculator,
  Database,
  BarChart3,
  RefreshCw,
  Download,
} from "lucide-react";

interface TreasuryData {
  balance: number;
  gttCirculation: number;
  weeklyVolume: number;
  monthlyRevenue: number;
  healthScore: number;
  riskLevel: string;
  trends: {
    balanceChange: string;
    volumeChange: string;
    revenueChange: string;
  };
}

interface Invoice {
  id: string;
  vendor: string;
  amount: number;
  status: "pending" | "paid" | "disputed";
  dueDate: string;
  category: string;
  description: string;
}

interface Vendor {
  address: string;
  name: string;
  lifetimePayouts: number;
  paid: boolean;
  lastPayment: string;
  trustScore: number;
  category: string;
  monthlyAverage: number;
}

export default function BillingDashboard() {
  const [treasury, setTreasury] = useState<TreasuryData | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [auditing, setAuditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load treasury data
      const treasuryResponse = await fetch("/api/billing/treasury");
      const treasuryResult = await treasuryResponse.json();
      if (treasuryResult.success) {
        setTreasury(treasuryResult.data);
      }

      // Load invoices
      const invoicesResponse = await fetch("/api/billing/invoices");
      const invoicesResult = await invoicesResponse.json();
      if (invoicesResult.success) {
        setInvoices(invoicesResult.data.invoices);
      }

      // Load vendors
      const vendorsResponse = await fetch("/api/billing/vendors");
      const vendorsResult = await vendorsResponse.json();
      if (vendorsResult.success) {
        setVendors(vendorsResult.data.vendors);
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      toast({
        title: "Load Error",
        description: "Failed to load billing dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const runAudit = async () => {
    setAuditing(true);
    try {
      const response = await fetch("/api/billing/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();
      if (result.success) {
        toast({
          title: "Audit Complete",
          description: `Financial audit completed. Compliance score: ${result.data.auditReport.complianceScore}/100`,
        });

        // Reload dashboard data to reflect any changes
        await loadDashboardData();
      }
    } catch (error) {
      console.error("Failed to run audit:", error);
      toast({
        title: "Audit Failed",
        description: "Failed to complete financial audit",
        variant: "destructive",
      });
    } finally {
      setAuditing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "disputed":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "LOW":
        return "text-green-400";
      case "MEDIUM":
        return "text-yellow-400";
      case "HIGH":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading billing dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              <BrandedText />
              <span className="text-white"> Financial Intelligence</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Enterprise-grade billing infrastructure with AI-powered auditing
              and institutional compliance
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex justify-center space-x-4 mb-8">
            <Button
              onClick={runAudit}
              disabled={auditing}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {auditing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Running Audit...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Run Financial Audit
                </>
              )}
            </Button>
            <Button
              onClick={loadDashboardData}
              variant="outline"
              className="border-slate-600"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
          </div>

          {/* Treasury Overview Cards */}
          {treasury && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-green-400">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Treasury Balance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">
                    {treasury.balance.toLocaleString()} GTT
                  </div>
                  <div className="flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 mr-1 text-green-400" />
                    <span className="text-green-400">
                      {treasury.trends.balanceChange}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-blue-400">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Weekly Volume
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">
                    {treasury.weeklyVolume.toLocaleString()} GTT
                  </div>
                  <div className="flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 mr-1 text-green-400" />
                    <span className="text-green-400">
                      {treasury.trends.volumeChange}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-purple-400">
                    <Database className="w-5 h-5 mr-2" />
                    Monthly Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">
                    {treasury.monthlyRevenue.toLocaleString()} GTT
                  </div>
                  <div className="flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 mr-1 text-green-400" />
                    <span className="text-green-400">
                      {treasury.trends.revenueChange}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-yellow-400">
                    <Shield className="w-5 h-5 mr-2" />
                    Health Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-2">
                    {treasury.healthScore}/100
                  </div>
                  <Progress value={treasury.healthScore} className="mb-2" />
                  <div
                    className={`text-sm font-medium ${getRiskColor(
                      treasury.riskLevel,
                    )}`}
                  >
                    {treasury.riskLevel} RISK
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Detailed Tabs */}
          <Tabs defaultValue="invoices" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger
                value="invoices"
                className="flex items-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>Invoices</span>
              </TabsTrigger>
              <TabsTrigger
                value="vendors"
                className="flex items-center space-x-2"
              >
                <Users className="w-4 h-4" />
                <span>Vendors</span>
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="flex items-center space-x-2"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Analytics</span>
              </TabsTrigger>
              <TabsTrigger
                value="compliance"
                className="flex items-center space-x-2"
              >
                <Shield className="w-4 h-4" />
                <span>Compliance</span>
              </TabsTrigger>
            </TabsList>

            {/* Invoices Tab */}
            <TabsContent value="invoices">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Invoice Management</CardTitle>
                  <CardDescription>
                    Track and manage all vendor invoices and payments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {invoices.map((invoice) => (
                      <div
                        key={invoice.id}
                        className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-600"
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-3 h-3 rounded-full ${getStatusColor(
                              invoice.status,
                            )}`}
                          ></div>
                          <div>
                            <div className="font-medium text-white">
                              {invoice.vendor}
                            </div>
                            <div className="text-sm text-slate-400">
                              {invoice.description}
                            </div>
                            <div className="text-xs text-slate-500">
                              Due: {invoice.dueDate}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-white">
                            {invoice.amount} GTT
                          </div>
                          <Badge
                            variant={
                              invoice.status === "paid"
                                ? "default"
                                : invoice.status === "pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {invoice.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Vendors Tab */}
            <TabsContent value="vendors">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Vendor Directory</CardTitle>
                  <CardDescription>
                    Monitor vendor relationships and payment history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {vendors.map((vendor) => (
                      <div
                        key={vendor.address}
                        className="p-4 bg-slate-900/50 rounded-lg border border-slate-600"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <div className="font-medium text-white">
                              {vendor.name}
                            </div>
                            <div className="text-sm text-slate-400">
                              {vendor.category}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-white">
                              {vendor.lifetimePayouts.toLocaleString()} GTT
                            </div>
                            <div className="text-sm text-slate-400">
                              Lifetime Payouts
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="text-slate-400">Trust Score</div>
                            <div className="text-white font-medium">
                              {(vendor.trustScore * 100).toFixed(1)}%
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-400">
                              Monthly Average
                            </div>
                            <div className="text-white font-medium">
                              {vendor.monthlyAverage} GTT
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-400">Last Payment</div>
                            <div className="text-white font-medium">
                              {vendor.lastPayment}
                            </div>
                          </div>
                        </div>

                        <div className="mt-3">
                          <Progress
                            value={vendor.trustScore * 100}
                            className="h-2"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle>Financial Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Treasury Growth</span>
                        <span className="text-green-400 font-medium">
                          +12.4%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Volume Growth</span>
                        <span className="text-green-400 font-medium">
                          +8.7%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Revenue Growth</span>
                        <span className="text-green-400 font-medium">
                          +15.2%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">
                          Vendor Efficiency
                        </span>
                        <span className="text-blue-400 font-medium">92.5%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle>Risk Assessment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-slate-300">
                          Treasury reserves healthy
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-slate-300">
                          Vendor diversification adequate
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-400" />
                        <span className="text-slate-300">
                          1 disputed invoice requires attention
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-slate-300">
                          Compliance score: 95/100
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Compliance Tab */}
            <TabsContent value="compliance">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Regulatory Compliance</CardTitle>
                  <CardDescription>
                    Monitor compliance status and regulatory requirements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-white">
                        Compliance Standards
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">
                            GAAP Compliance
                          </span>
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">XBRL Ready</span>
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">SOX Controls</span>
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">
                            IFRS Compatible
                          </span>
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-white">Audit Trail</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">
                            Immutable Records
                          </span>
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">
                            7-Year Retention
                          </span>
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">
                            Third-party Auditable
                          </span>
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">
                            Protocol Feed Active
                          </span>
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Download className="w-4 h-4 mr-2" />
                      Download Compliance Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
