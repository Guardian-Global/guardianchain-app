import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import {
  Shield,
  Users,
  Activity,
  TrendingUp,
  Database,
  Server,
  AlertTriangle,
  CheckCircle,
  Download,
  RefreshCw,
  Eye,
  Clock,
  Zap,
  Target,
  BarChart3,
  Settings,
  Crown,
  UserCheck
} from "lucide-react";

interface AdminMetrics {
  totalUsers: number;
  activeUsers: number;
  newSignups: number;
  capsulesCreated: number;
  verificationRate: number;
  systemHealth: number;
  lastUpdated: string;
}

interface UserTierData {
  tier: string;
  count: number;
  color: string;
}

interface ActivityData {
  date: string;
  logins: number;
  capsules: number;
  verifications: number;
}

export default function AdminMetrics() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [userTierData, setUserTierData] = useState<UserTierData[]>([
    { tier: 'EXPLORER', count: 2847, color: '#3B82F6' },
    { tier: 'SEEKER', count: 1925, color: '#8B5CF6' },
    { tier: 'CREATOR', count: 682, color: '#06B6D4' },
    { tier: 'SOVEREIGN', count: 237, color: '#10B981' },
    { tier: 'ADMIN', count: 12, color: '#F59E0B' }
  ]);
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const { toast } = useToast();

  // Verify admin access on component mount
  useEffect(() => {
    verifyAdminAccess();
  }, []);

  const verifyAdminAccess = async () => {
    try {
      const response = await fetch('/api/admin/verify');
      if (response.ok) {
        setIsAdmin(true);
        fetchMetrics();
      } else {
        toast({
          title: "Access Denied",
          description: "Admin privileges required to view this page",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error verifying admin access:', error);
      toast({
        title: "Error",
        description: "Failed to verify admin access",
        variant: "destructive"
      });
    }
  };

  const fetchMetrics = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/admin/metrics');
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
        
        // Generate mock activity data for chart
        const mockActivityData = Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          logins: Math.floor(Math.random() * 500) + 200,
          capsules: Math.floor(Math.random() * 100) + 50,
          verifications: Math.floor(Math.random() * 80) + 30
        }));
        setActivityData(mockActivityData);
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
      toast({
        title: "Error",
        description: "Failed to fetch admin metrics",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportMetrics = async (format: string) => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/admin/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ format, type: 'metrics' })
      });

      if (response.ok) {
        if (format === 'csv') {
          const csvData = await response.text();
          const blob = new Blob([csvData], { type: 'text/csv' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'admin-metrics.csv';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }
        
        toast({
          title: "Export Successful",
          description: `Metrics exported as ${format.toUpperCase()}`,
        });
      }
    } catch (error) {
      console.error('Error exporting metrics:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export metrics",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-cyan-100 flex items-center justify-center">
        <Card className="bg-slate-800/50 border-red-500/30 p-8">
          <div className="text-center space-y-4">
            <Shield className="w-16 h-16 text-red-400 mx-auto" />
            <h2 className="text-2xl font-bold text-red-100">Access Denied</h2>
            <p className="text-red-300">Admin privileges required to view this page</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-cyan-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <RefreshCw className="w-16 h-16 text-cyan-400 mx-auto animate-spin" />
          <p className="text-cyan-300">Loading admin metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-cyan-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Admin Metrics Dashboard
            </h1>
            <p className="text-cyan-200 mt-2">
              System health monitoring and user analytics
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-cyan-400 border-cyan-400">
              <Crown className="w-3 h-3 mr-1" />
              ADMIN ACCESS
            </Badge>
            <Button
              onClick={() => fetchMetrics()}
              disabled={isLoading}
              variant="outline"
              className="border-cyan-500/30 text-cyan-100"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="bg-slate-800/50 border-cyan-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cyan-300 text-sm">Total Users</p>
                  <p className="text-2xl font-bold text-cyan-100">{metrics.totalUsers.toLocaleString()}</p>
                </div>
                <Users className="w-6 h-6 text-cyan-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-emerald-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-300 text-sm">Active Users</p>
                  <p className="text-2xl font-bold text-emerald-100">{metrics.activeUsers.toLocaleString()}</p>
                </div>
                <Activity className="w-6 h-6 text-emerald-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-purple-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-300 text-sm">New Signups</p>
                  <p className="text-2xl font-bold text-purple-100">{metrics.newSignups.toLocaleString()}</p>
                </div>
                <UserCheck className="w-6 h-6 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-blue-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-300 text-sm">Capsules</p>
                  <p className="text-2xl font-bold text-blue-100">{metrics.capsulesCreated.toLocaleString()}</p>
                </div>
                <Database className="w-6 h-6 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-yellow-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-300 text-sm">Verification Rate</p>
                  <p className="text-2xl font-bold text-yellow-100">{metrics.verificationRate.toFixed(1)}%</p>
                </div>
                <CheckCircle className="w-6 h-6 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-300 text-sm">System Health</p>
                  <p className="text-2xl font-bold text-green-100">{metrics.systemHealth.toFixed(1)}%</p>
                </div>
                <Server className="w-6 h-6 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">User Analytics</TabsTrigger>
            <TabsTrigger value="activity">Activity Trends</TabsTrigger>
            <TabsTrigger value="export">Export Data</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* System Status */}
              <Card className="bg-slate-800/50 border-cyan-500/30">
                <CardHeader>
                  <CardTitle className="text-cyan-100 flex items-center gap-2">
                    <Server className="w-5 h-5" />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-cyan-100">Server Status</span>
                    </div>
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      Healthy
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-cyan-100">Database</span>
                    </div>
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      Connected
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-cyan-100">Authentication</span>
                    </div>
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      Active
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                      <span className="text-cyan-100">API Rate Limit</span>
                    </div>
                    <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                      Normal
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-purple-100 flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Recent Admin Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                      <Eye className="w-4 h-4 text-cyan-400" />
                      <div className="flex-1">
                        <p className="text-cyan-100 text-sm">System metrics viewed</p>
                        <p className="text-cyan-300 text-xs">2 minutes ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                      <UserCheck className="w-4 h-4 text-emerald-400" />
                      <div className="flex-1">
                        <p className="text-emerald-100 text-sm">User tier updated</p>
                        <p className="text-emerald-300 text-xs">15 minutes ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                      <Download className="w-4 h-4 text-purple-400" />
                      <div className="flex-1">
                        <p className="text-purple-100 text-sm">Metrics exported</p>
                        <p className="text-purple-300 text-xs">1 hour ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                      <Settings className="w-4 h-4 text-yellow-400" />
                      <div className="flex-1">
                        <p className="text-yellow-100 text-sm">System configuration updated</p>
                        <p className="text-yellow-300 text-xs">3 hours ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* User Analytics Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Tier Distribution */}
              <Card className="bg-slate-800/50 border-cyan-500/30">
                <CardHeader>
                  <CardTitle className="text-cyan-100 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    User Tier Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={userTierData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="count"
                        label={({ tier, count }) => `${tier}: ${count}`}
                      >
                        {userTierData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#1e293b',
                          border: '1px solid #06b6d4',
                          borderRadius: '8px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* User Statistics */}
              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-purple-100 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    User Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userTierData.map((tier) => (
                    <div key={tier.tier} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-cyan-100 font-medium">{tier.tier}</span>
                        <span className="text-cyan-300">{tier.count.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ 
                            backgroundColor: tier.color,
                            width: `${(tier.count / userTierData.reduce((sum, t) => sum + t.count, 0)) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Activity Trends Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card className="bg-slate-800/50 border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-cyan-100 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  7-Day Activity Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" tick={{fill: '#a5b4fc'}} />
                    <YAxis tick={{fill: '#a5b4fc'}} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #06b6d4',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="logins" 
                      stroke="#06b6d4" 
                      strokeWidth={2}
                      name="User Logins"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="capsules" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      name="Capsules Created"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="verifications" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      name="Verifications"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Export Data Tab */}
          <TabsContent value="export" className="space-y-6">
            <Card className="bg-slate-800/50 border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-cyan-100 flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Export Admin Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-cyan-200">
                  Export comprehensive admin metrics and analytics data in various formats.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => exportMetrics('csv')}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export as CSV
                  </Button>
                  
                  <Button
                    onClick={() => exportMetrics('json')}
                    disabled={isLoading}
                    variant="outline"
                    className="border-purple-500/30 text-purple-100"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export as JSON
                  </Button>
                </div>

                <div className="p-4 bg-slate-700/30 rounded-lg">
                  <h4 className="text-cyan-100 font-medium mb-2">Export Includes:</h4>
                  <ul className="text-cyan-300 text-sm space-y-1">
                    <li>• User registration and activity data</li>
                    <li>• Capsule creation and verification metrics</li>
                    <li>• System health and performance data</li>
                    <li>• User tier distribution analytics</li>
                    <li>• Authentication and security logs</li>
                  </ul>
                </div>

                <div className="text-center text-cyan-300 text-sm">
                  Last Updated: {new Date(metrics.lastUpdated).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}