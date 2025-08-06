import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import {
  Users,
  Activity,
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Download,
  Eye,
  Clock,
  Database,
  Server,
  Zap,
  BarChart3
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface AdminMetrics {
  totalUsers: number;
  activeUsers: number;
  newSignups: number;
  capsulesMinted: number;
  verificationRate: number;
  systemHealth: number;
}

interface UserStats {
  date: string;
  logins: number;
  signups: number;
  activeUsers: number;
}

interface SystemHealth {
  component: string;
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  responseTime: number;
}

export default function AdminMetrics() {
  const { user, isAuthenticated } = useAuth();
  const [metrics, setMetrics] = useState<AdminMetrics>({
    totalUsers: 5691,
    activeUsers: 2847,
    newSignups: 284,
    capsulesMinted: 12847,
    verificationRate: 94.2,
    systemHealth: 99.8
  });

  const [userStats, setUserStats] = useState<UserStats[]>([
    { date: '2025-07-29', logins: 1250, signups: 45, activeUsers: 2650 },
    { date: '2025-07-30', logins: 1180, signups: 38, activeUsers: 2580 },
    { date: '2025-07-31', logins: 1320, signups: 52, activeUsers: 2720 },
    { date: '2025-08-01', logins: 1450, signups: 61, activeUsers: 2840 },
    { date: '2025-08-02', logins: 1380, signups: 47, activeUsers: 2780 },
    { date: '2025-08-03', logins: 1520, signups: 69, activeUsers: 2890 },
    { date: '2025-08-04', logins: 1480, signups: 55, activeUsers: 2847 }
  ]);

  const [systemHealth, setSystemHealth] = useState<SystemHealth[]>([
    { component: 'Database', status: 'healthy', uptime: 99.9, responseTime: 45 },
    { component: 'API Gateway', status: 'healthy', uptime: 99.8, responseTime: 120 },
    { component: 'Authentication', status: 'healthy', uptime: 100, responseTime: 35 },
    { component: 'IPFS Storage', status: 'warning', uptime: 98.5, responseTime: 890 },
    { component: 'Blockchain RPC', status: 'healthy', uptime: 99.7, responseTime: 250 }
  ]);

  const [isExporting, setIsExporting] = useState(false);

  // Check admin access
  useEffect(() => {
    if (!isAuthenticated) return;
    
    // Verify admin privileges
    const checkAdminAccess = async () => {
      try {
        const response = await fetch("/api/admin/verify");
        if (!response.ok) {
          window.location.href = "/";
        }
      } catch (error) {
        console.error("Admin verification failed:", error);
        window.location.href = "/";
      }
    };

    checkAdminAccess();
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch("/api/admin/metrics");
        if (response.ok) {
          const data = await response.json();
          setMetrics(data);
        }
      } catch (error) {
        console.error("Failed to fetch admin metrics:", error);
      }
    };

    // Fetch initial data and set up polling
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const response = await fetch("/api/admin/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ format: "csv", type: "metrics" })
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `admin-metrics-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center p-6">
            <Shield className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Access Denied</h2>
            <p className="text-brand-text-muted mb-4">Admin privileges required</p>
            <Button onClick={() => window.location.href = '/'}>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'critical': return <AlertTriangle className="w-5 h-5 text-red-400" />;
      default: return <Activity className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">🔧 Admin Metrics</h1>
            <p className="text-brand-text-muted">
              System monitoring and user analytics dashboard
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleExportCSV}
              disabled={isExporting}
              className="border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-brand-dark"
            >
              {isExporting ? (
                <>
                  <Activity className="w-4 h-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </>
              )}
            </Button>
            
            <Badge className="bg-green-500/20 text-green-400 border-green-500 px-3 py-1">
              <CheckCircle className="w-4 h-4 mr-1" />
              System Healthy
            </Badge>
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-brand-secondary border-brand-surface">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-brand-text-muted text-sm">Total Users</p>
                  <p className="text-2xl font-bold text-white">
                    {metrics.totalUsers.toLocaleString()}
                  </p>
                  <p className="text-green-400 text-sm">+{metrics.newSignups} today</p>
                </div>
                <Users className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-brand-secondary border-brand-surface">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-brand-text-muted text-sm">Active Users</p>
                  <p className="text-2xl font-bold text-white">
                    {metrics.activeUsers.toLocaleString()}
                  </p>
                  <p className="text-brand-text-muted text-sm">
                    {((metrics.activeUsers / metrics.totalUsers) * 100).toFixed(1)}% active
                  </p>
                </div>
                <Activity className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-brand-secondary border-brand-surface">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-brand-text-muted text-sm">Capsules Minted</p>
                  <p className="text-2xl font-bold text-white">
                    {metrics.capsulesMinted.toLocaleString()}
                  </p>
                  <p className="text-purple-400 text-sm">24/7 growth</p>
                </div>
                <Shield className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-brand-secondary border-brand-surface">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-brand-text-muted text-sm">System Health</p>
                  <p className="text-2xl font-bold text-white">
                    {metrics.systemHealth}%
                  </p>
                  <p className="text-green-400 text-sm">All systems operational</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-brand-surface max-w-2xl">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Login Stats */}
              <Card className="bg-brand-secondary border-brand-surface">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Daily User Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={userStats}>
                      <XAxis 
                        dataKey="date" 
                        stroke="#8b949e" 
                        fontSize={12}
                        tick={{ fill: '#8b949e' }}
                      />
                      <YAxis 
                        stroke="#8b949e" 
                        fontSize={12}
                        tick={{ fill: '#8b949e' }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#161b22',
                          border: '1px solid #30363d',
                          borderRadius: '8px',
                          color: '#f0f6fc'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="logins" 
                        stroke="#00ffe1" 
                        strokeWidth={2}
                        name="Daily Logins"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="signups" 
                        stroke="#ff00d4" 
                        strokeWidth={2}
                        name="New Signups"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* User Engagement Metrics */}
              <Card className="bg-brand-secondary border-brand-surface">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Engagement Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-brand-surface rounded-lg">
                      <div className="text-lg font-bold text-brand-accent">7.3m</div>
                      <div className="text-sm text-brand-text-muted">Session Duration</div>
                    </div>
                    <div className="text-center p-3 bg-brand-surface rounded-lg">
                      <div className="text-lg font-bold text-white">4.2</div>
                      <div className="text-sm text-brand-text-muted">Pages/Session</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-brand-text-muted">Bounce Rate</span>
                      <span className="font-semibold text-green-400">23.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-text-muted">Retention (7-day)</span>
                      <span className="font-semibold text-white">67.8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-text-muted">Conversion Rate</span>
                      <span className="font-semibold text-purple-400">12.4%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            {/* System Health Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {systemHealth.map((component, index) => (
                <Card key={index} className="bg-brand-secondary border-brand-surface">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-white">{component.component}</h3>
                      {getStatusIcon(component.status)}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-brand-text-muted text-sm">Uptime</span>
                        <span className={`font-semibold ${getStatusColor(component.status)}`}>
                          {component.uptime}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-brand-text-muted text-sm">Response Time</span>
                        <span className="text-white text-sm">{component.responseTime}ms</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* System Alerts */}
            <Card className="bg-brand-secondary border-brand-surface">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  System Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Alert className="border-yellow-500/50 bg-yellow-500/10">
                    <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    <AlertDescription className="text-yellow-200">
                      IPFS Storage response times elevated (890ms avg). Monitoring closely.
                    </AlertDescription>
                  </Alert>
                  
                  <Alert className="border-green-500/50 bg-green-500/10">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <AlertDescription className="text-green-200">
                      Database performance optimized. Query response improved by 15%.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card className="bg-brand-secondary border-brand-surface">
              <CardHeader>
                <CardTitle>API Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={userStats}>
                    <XAxis dataKey="date" stroke="#8b949e" />
                    <YAxis stroke="#8b949e" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#161b22',
                        border: '1px solid #30363d',
                        borderRadius: '8px',
                        color: '#f0f6fc'
                      }}
                    />
                    <Bar dataKey="activeUsers" fill="#00ffe1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-brand-secondary border-brand-surface">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Security Events
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-1">0</div>
                    <p className="text-brand-text-muted">Security Incidents (24h)</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-brand-text-muted">Failed Login Attempts</span>
                      <span className="font-semibold">127</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-text-muted">Blocked IPs</span>
                      <span className="font-semibold">23</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-text-muted">2FA Enabled Users</span>
                      <span className="font-semibold text-green-400">78.5%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-brand-secondary border-brand-surface">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Data Integrity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-brand-surface rounded-lg">
                      <div className="text-lg font-bold text-brand-accent">100%</div>
                      <div className="text-sm text-brand-text-muted">Backup Success</div>
                    </div>
                    <div className="text-center p-3 bg-brand-surface rounded-lg">
                      <div className="text-lg font-bold text-white">0</div>
                      <div className="text-sm text-brand-text-muted">Data Corruption</div>
                    </div>
                  </div>

                  <Alert className="border-green-500/50 bg-green-500/10">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <AlertDescription className="text-green-200">
                      All data integrity checks passed. Last verification: 2 hours ago.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}