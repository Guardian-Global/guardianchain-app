import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Crown,
  Shield,
  Zap,
  BarChart3,
  Settings,
  Database,
  DollarSign,
  Users,
  Coins,
  AlertTriangle,
  CheckCircle,
  Activity,
  TrendingUp,
  Lock,
  Globe
} from "lucide-react";
import { useCompleteAuth } from "@/hooks/useCompleteAuth";
import EnhancedLogoDisplay from "@/components/assets/EnhancedLogoDisplay";
import SupabaseHeroBackground from "@/components/assets/SupabaseHeroBackground";
import SupabaseImageGallery from "@/components/assets/SupabaseImageGallery";
import AuthGuard from "@/components/auth/AuthGuard";

export function EnhancedCommanderDashboard() {
  const { user } = useCompleteAuth();

  const systemStats = {
    totalUsers: 15247,
    activeCapsules: 8932,
    gttCirculation: "2.5B",
    treasuryBalance: "$2.8M",
    networkStatus: "Operational",
    systemUptime: "99.98%",
    dailyTransactions: 45623,
    protocolRevenue: "$125,847"
  };

  const recentActivities = [
    { action: "GTT Minted", amount: "50,000 GTT", user: "Enterprise Client", time: "2 min ago", status: "success" },
    { action: "Capsule Sealed", id: "CAP-8492", verifier: "Truth Oracle", time: "5 min ago", status: "pending" },
    { action: "Treasury Deposit", amount: "$10,000", source: "Subscription", time: "8 min ago", status: "success" },
    { action: "System Alert", message: "High traffic detected", level: "warning", time: "12 min ago", status: "warning" },
    { action: "User Upgraded", tier: "ENTERPRISE", user: "TechCorp Ltd", time: "15 min ago", status: "success" }
  ];

  const quickActions = [
    { title: "Mint GTT Tokens", description: "Create new GTT tokens for distribution", action: "mint-gtt", icon: Coins, color: "from-green-600 to-green-800" },
    { title: "Seal Capsules", description: "Verify and seal pending truth capsules", action: "seal-capsules", icon: Shield, color: "from-blue-600 to-blue-800" },
    { title: "Treasury Operations", description: "Manage protocol treasury and funds", action: "treasury", icon: DollarSign, color: "from-purple-600 to-purple-800" },
    { title: "System Configuration", description: "Update protocol parameters", action: "config", icon: Settings, color: "from-orange-600 to-orange-800" },
    { title: "User Management", description: "Manage user tiers and permissions", action: "users", icon: Users, color: "from-red-600 to-red-800" },
    { title: "Emergency Controls", description: "Access emergency protocol functions", action: "emergency", icon: AlertTriangle, color: "from-red-700 to-red-900" }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case "pending":
        return <Activity className="h-4 w-4 text-blue-400" />;
      default:
        return <Activity className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <AuthGuard requiredRoles={["commander", "master"]}>
      <SupabaseHeroBackground overlay={true} className="min-h-screen">
        <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <EnhancedLogoDisplay size="lg" variant="full" className="justify-center" />
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                COMMANDER CONTROL CENTER
              </h1>
              <p className="text-xl text-slate-300">
                Protocol Management Dashboard • Welcome, {user?.firstName}
              </p>
            </div>
          </div>

          {/* System Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                <div className="text-2xl font-bold text-white">{systemStats.totalUsers.toLocaleString()}</div>
                <div className="text-sm text-slate-400">Total Users</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4 text-center">
                <Shield className="h-8 w-8 mx-auto mb-2 text-green-400" />
                <div className="text-2xl font-bold text-white">{systemStats.activeCapsules.toLocaleString()}</div>
                <div className="text-sm text-slate-400">Active Capsules</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4 text-center">
                <Coins className="h-8 w-8 mx-auto mb-2 text-yellow-400" />
                <div className="text-2xl font-bold text-white">{systemStats.gttCirculation}</div>
                <div className="text-sm text-slate-400">GTT Circulation</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4 text-center">
                <DollarSign className="h-8 w-8 mx-auto mb-2 text-purple-400" />
                <div className="text-2xl font-bold text-white">{systemStats.treasuryBalance}</div>
                <div className="text-sm text-slate-400">Treasury Balance</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 bg-slate-800">
              <TabsTrigger value="overview" className="text-white">Overview</TabsTrigger>
              <TabsTrigger value="operations" className="text-white">Operations</TabsTrigger>
              <TabsTrigger value="monitoring" className="text-white">Monitoring</TabsTrigger>
              <TabsTrigger value="treasury" className="text-white">Treasury</TabsTrigger>
              <TabsTrigger value="emergency" className="text-white">Emergency</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Quick Actions */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Crown className="h-5 w-5 mr-2 text-purple-400" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {quickActions.map((action) => (
                      <div
                        key={action.action}
                        className={`p-4 rounded-lg bg-gradient-to-r ${action.color} cursor-pointer hover:opacity-90 transition-opacity`}
                      >
                        <div className="flex items-center space-x-3">
                          <action.icon className="h-6 w-6 text-white" />
                          <div>
                            <h3 className="font-semibold text-white">{action.title}</h3>
                            <p className="text-sm text-white/80">{action.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-green-400" />
                    Recent Protocol Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(activity.status)}
                          <div>
                            <div className="text-white font-medium">{activity.action}</div>
                            <div className="text-sm text-slate-400">
                              {activity.amount && `Amount: ${activity.amount} • `}
                              {activity.user && `User: ${activity.user} • `}
                              {activity.id && `ID: ${activity.id} • `}
                              {activity.message && `${activity.message} • `}
                              {activity.time}
                            </div>
                          </div>
                        </div>
                        <Badge variant={activity.status === "success" ? "default" : "secondary"}>
                          {activity.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="operations" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* GTT Minting */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Coins className="h-5 w-5 mr-2 text-yellow-400" />
                      GTT Token Operations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full bg-gradient-to-r from-yellow-600 to-orange-600">
                      Mint GTT Tokens
                    </Button>
                    <Button variant="outline" className="w-full">
                      View Minting History
                    </Button>
                    <div className="text-sm text-slate-400">
                      Last mint: 50,000 GTT (2 hours ago)
                    </div>
                  </CardContent>
                </Card>

                {/* Capsule Management */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-blue-400" />
                      Capsule Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                      Seal Pending Capsules
                    </Button>
                    <Button variant="outline" className="w-full">
                      Review Flagged Content
                    </Button>
                    <div className="text-sm text-slate-400">
                      Pending: 23 capsules awaiting seal
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="monitoring" className="space-y-6">
              {/* System Health */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Globe className="h-5 w-5 mr-2 text-green-400" />
                      Network Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Status:</span>
                        <Badge className="bg-green-600">{systemStats.networkStatus}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Uptime:</span>
                        <span className="text-white">{systemStats.systemUptime}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-purple-400" />
                      Daily Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Transactions:</span>
                        <span className="text-white">{systemStats.dailyTransactions.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Revenue:</span>
                        <span className="text-white">{systemStats.protocolRevenue}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Lock className="h-5 w-5 mr-2 text-red-400" />
                      Security Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Badge className="bg-green-600">All Systems Secure</Badge>
                      <div className="text-sm text-slate-400">
                        Last security scan: 1 hour ago
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="treasury" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Treasury Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-3xl font-bold text-green-400">{systemStats.treasuryBalance}</div>
                    <div className="text-sm text-slate-400">Total Treasury Balance</div>
                    <Button className="w-full">View Detailed Report</Button>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Revenue Streams</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Subscriptions:</span>
                        <span className="text-white">$85,420</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Transaction Fees:</span>
                        <span className="text-white">$28,540</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Enterprise:</span>
                        <span className="text-white">$11,887</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="emergency" className="space-y-6">
              <Card className="bg-red-900/20 border-red-500">
                <CardHeader>
                  <CardTitle className="text-red-400 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Emergency Protocol Controls
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                      Emergency Stop Protocol
                    </Button>
                    <Button variant="outline" className="border-yellow-500 text-yellow-400">
                      Pause New Registrations
                    </Button>
                    <Button variant="outline" className="border-orange-500 text-orange-400">
                      Lock Treasury Operations
                    </Button>
                    <Button variant="outline" className="border-purple-500 text-purple-400">
                      Emergency Contact Team
                    </Button>
                  </div>
                  <div className="text-sm text-red-300 p-3 bg-red-900/30 rounded">
                    ⚠️ Emergency controls should only be used in critical situations. All actions are logged and audited.
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          </div>
        </div>
      </SupabaseHeroBackground>
    </AuthGuard>
  );
}

export default EnhancedCommanderDashboard;