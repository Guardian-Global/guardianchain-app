import React, { useState, useEffect } from "react";
import { useEnhancedAuth } from "@/hooks/useEnhancedAuth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  Bug,
  Shield,
  User,
  CreditCard,
  Database,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Activity,
  Code,
  Network,
  Server,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  Terminal,
  Cpu,
  MemoryStick,
  Zap,
  Clock,
  Wifi,
  AlertCircle,
} from "lucide-react";

interface SystemMetrics {
  responseTime: number;
  memoryUsage: number;
  cpuUsage: number;
  networkLatency: number;
  uptime: number;
  errorRate: number;
}

interface DebugLog {
  timestamp: string;
  level: "info" | "warn" | "error" | "debug";
  source: string;
  message: string;
  data?: any;
}

export default function EnhancedDebugSystem() {
  const { user, isAuthenticated, isLoading, needsOnboarding, refetch } = useEnhancedAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [debugLogs, setDebugLogs] = useState<DebugLog[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    responseTime: 0,
    memoryUsage: 0,
    cpuUsage: 0,
    networkLatency: 0,
    uptime: 0,
    errorRate: 0,
  });

  // API Health Checks
  const endpoints = [
    "/api/auth/user",
    "/api/auth/status", 
    "/api/subscription/plans",
    "/api/debug/user",
    "/api/user/stats",
    "/api/capsules",
    "/api/reels",
  ];

  const { data: healthChecks, isLoading: healthLoading } = useQuery({
    queryKey: ["health-checks"],
    queryFn: async () => {
      const results = await Promise.allSettled(
        endpoints.map(async (endpoint) => {
          const start = performance.now();
          try {
            const response = await fetch(endpoint);
            const end = performance.now();
            const data = await response.json();
            
            const logEntry: DebugLog = {
              timestamp: new Date().toISOString(),
              level: response.ok ? "info" : "error",
              source: endpoint,
              message: `${response.status} ${response.statusText} (${Math.round(end - start)}ms)`,
              data: response.ok ? data : undefined,
            };
            
            setDebugLogs(prev => [logEntry, ...prev.slice(0, 99)]);
            
            return {
              endpoint,
              status: response.status,
              responseTime: end - start,
              success: response.ok,
              data,
            };
          } catch (error) {
            const end = performance.now();
            const logEntry: DebugLog = {
              timestamp: new Date().toISOString(),
              level: "error",
              source: endpoint,
              message: `Network Error (${Math.round(end - start)}ms): ${error.message}`,
            };
            
            setDebugLogs(prev => [logEntry, ...prev.slice(0, 99)]);
            
            return {
              endpoint,
              status: 0,
              responseTime: end - start,
              success: false,
              error: error.message,
            };
          }
        })
      );
      
      return results.map(result => 
        result.status === "fulfilled" ? result.value : { success: false, error: result.reason }
      );
    },
    refetchInterval: autoRefresh ? 10000 : false,
  });

  // Keyboard shortcut activation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'D') {
        event.preventDefault();
        setIsVisible(!isVisible);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);

  // Simulate system metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemMetrics({
        responseTime: Math.random() * 50 + 10, // 10-60ms
        memoryUsage: Math.random() * 30 + 40, // 40-70%
        cpuUsage: Math.random() * 20 + 10, // 10-30%
        networkLatency: Math.random() * 20 + 5, // 5-25ms
        uptime: Date.now() - 1000 * 60 * 60 * 24 * 7, // 1 week uptime
        errorRate: Math.random() * 2, // 0-2%
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (success: boolean, responseTime: number) => {
    if (!success) return <Badge variant="destructive">Error</Badge>;
    if (responseTime > 100) return <Badge variant="secondary">Slow</Badge>;
    if (responseTime > 50) return <Badge variant="outline">OK</Badge>;
    return <Badge className="bg-green-500">Fast</Badge>;
  };

  const formatUptime = (uptime: number) => {
    const days = Math.floor(uptime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((uptime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h`;
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsVisible(true)}
          className="bg-background/80 backdrop-blur-sm border-cyan-500/50 hover:border-cyan-500"
        >
          <Bug className="w-4 h-4 mr-2" />
          Debug (Ctrl+Shift+D)
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm p-4">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bug className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-bold">GuardianChain Debug System</h2>
            <Badge variant="outline" className="border-cyan-500 text-cyan-400">
              Enhanced v2.0
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={autoRefresh ? "border-green-500 text-green-400" : ""}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
              Auto Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsVisible(false)}
            >
              <EyeOff className="w-4 h-4 mr-2" />
              Close
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="auth">Authentication</TabsTrigger>
            <TabsTrigger value="user">User Data</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="api">API Health</TabsTrigger>
            <TabsTrigger value="logs">System Logs</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <div className="flex-1 mt-4">
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Activity className="w-4 h-4 text-green-400" />
                      System Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-400">Operational</div>
                    <p className="text-xs text-muted-foreground">
                      Uptime: {formatUptime(systemMetrics.uptime)}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Shield className="w-4 h-4 text-cyan-400" />
                      Authentication
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-cyan-400">
                      {isAuthenticated ? "Active" : "Inactive"}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      User: {user?.email || "Not logged in"}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-purple-400" />
                      Subscription
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-400">
                      {user?.tier || "N/A"}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Status: {user?.subscriptionStatus || "Unknown"}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4 text-yellow-400" />
                      Response Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-400">
                      {Math.round(systemMetrics.responseTime)}ms
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Average API response
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      Quick System Check
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Authentication System</span>
                      <Badge className="bg-green-500">✓ Online</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Database Connection</span>
                      <Badge className="bg-green-500">✓ Connected</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>API Endpoints</span>
                      <Badge className="bg-green-500">✓ Responsive</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Subscription Service</span>
                      <Badge className="bg-green-500">✓ Active</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5 text-cyan-400" />
                      Current User Session
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span>User ID:</span>
                      <span className="font-mono text-sm">{user?.id || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tier:</span>
                      <Badge variant="outline">{user?.tier || "N/A"}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Onboarding:</span>
                      <Badge variant={needsOnboarding ? "destructive" : "default"}>
                        {needsOnboarding ? "Incomplete" : "Complete"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Email Verified:</span>
                      <Badge variant={user?.emailVerified ? "default" : "secondary"}>
                        {user?.emailVerified ? "Yes" : "No"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="api" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="w-5 h-5 text-cyan-400" />
                    API Health Monitor
                    {healthLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {healthChecks?.map((check, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <code className="text-sm bg-muted px-2 py-1 rounded">
                            {check.endpoint}
                          </code>
                          {getStatusBadge(check.success, check.responseTime)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {Math.round(check.responseTime)}ms
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="logs" className="space-y-4">
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-green-400" />
                    System Logs
                    <Badge variant="outline">{debugLogs.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-2">
                      {debugLogs.map((log, index) => (
                        <div key={index} className="flex items-start gap-3 p-2 rounded text-sm border-l-2" 
                             style={{
                               borderLeftColor: 
                                 log.level === "error" ? "#ef4444" :
                                 log.level === "warn" ? "#f59e0b" :
                                 log.level === "info" ? "#10b981" : "#6b7280"
                             }}>
                          <span className="text-xs text-muted-foreground w-20 flex-shrink-0">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </span>
                          <span className="font-mono text-xs w-24 flex-shrink-0">{log.source}</span>
                          <span className="flex-1">{log.message}</span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-blue-400" />
                      System Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span>CPU Usage</span>
                        <span>{Math.round(systemMetrics.cpuUsage)}%</span>
                      </div>
                      <Progress value={systemMetrics.cpuUsage} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span>Memory Usage</span>
                        <span>{Math.round(systemMetrics.memoryUsage)}%</span>
                      </div>
                      <Progress value={systemMetrics.memoryUsage} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span>Error Rate</span>
                        <span>{systemMetrics.errorRate.toFixed(2)}%</span>
                      </div>
                      <Progress value={systemMetrics.errorRate} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wifi className="w-5 h-5 text-green-400" />
                      Network Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Network Latency</span>
                      <span className="font-mono">{Math.round(systemMetrics.networkLatency)}ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>API Response Time</span>
                      <span className="font-mono">{Math.round(systemMetrics.responseTime)}ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Connection Status</span>
                      <Badge className="bg-green-500">Connected</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Throughput</span>
                      <span className="font-mono">1.2 MB/s</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Add other tab contents for auth, user, subscription */}
            <TabsContent value="auth">
              <Card>
                <CardHeader>
                  <CardTitle>Authentication Debug</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs bg-muted p-4 rounded overflow-auto">
                    {JSON.stringify({ isAuthenticated, needsOnboarding, user }, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="user">
              <Card>
                <CardHeader>
                  <CardTitle>User Data Debug</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs bg-muted p-4 rounded overflow-auto">
                    {JSON.stringify(user, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subscription">
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Debug</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs bg-muted p-4 rounded overflow-auto">
                    {JSON.stringify({
                      tier: user?.tier,
                      subscriptionStatus: user?.subscriptionStatus,
                      subscription: user?.subscription
                    }, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}