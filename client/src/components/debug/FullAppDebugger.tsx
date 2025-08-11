import React, { useState, useEffect } from "react";
import { useEnhancedAuth } from "@/hooks/useEnhancedAuth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "lucide-react";

interface DebugInfo {
  timestamp: string;
  endpoint: string;
  status: number;
  data: any;
  error?: string;
}

export default function FullAppDebugger() {
  const { user, isAuthenticated, isLoading, needsOnboarding, refetch } = useEnhancedAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [debugLogs, setDebugLogs] = useState<DebugInfo[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Test various endpoints
  const { data: subscriptionPlans, isLoading: plansLoading, error: plansError } = useQuery({
    queryKey: ["/api/subscription/plans"],
    queryFn: async () => {
      const response = await fetch("/api/subscription/plans");
      const data = await response.json();
      
      // Log the debug info
      const debugInfo: DebugInfo = {
        timestamp: new Date().toISOString(),
        endpoint: "/api/subscription/plans",
        status: response.status,
        data,
        error: response.ok ? undefined : `HTTP ${response.status}`,
      };
      
      setDebugLogs(prev => [debugInfo, ...prev.slice(0, 19)]); // Keep last 20 logs
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return data;
    },
    refetchInterval: autoRefresh ? 5000 : false,
  });

  const { data: authStatus, isLoading: authLoading, error: authError } = useQuery({
    queryKey: ["/api/auth/status"],
    queryFn: async () => {
      const token = localStorage.getItem('gc_jwt');
      const response = await fetch("/api/auth/status", {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        credentials: 'include'
      });
      const data = await response.json();
      const debugInfo: DebugInfo = {
        timestamp: new Date().toISOString(),
        endpoint: "/api/auth/status",
        status: response.status,
        data,
        error: response.ok ? undefined : `HTTP ${response.status}`,
      };
      setDebugLogs(prev => [debugInfo, ...prev.slice(0, 19)]);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return data;
    },
    refetchInterval: autoRefresh ? 5000 : false,
  });

  const { data: debugUser, isLoading: debugUserLoading, error: debugUserError } = useQuery({
    queryKey: ["/api/debug/user"],
    queryFn: async () => {
      const response = await fetch("/api/debug/user");
      const data = await response.json();
      
      const debugInfo: DebugInfo = {
        timestamp: new Date().toISOString(),
        endpoint: "/api/debug/user",
        status: response.status,
        data,
        error: response.ok ? undefined : `HTTP ${response.status}`,
      };
      
      setDebugLogs(prev => [debugInfo, ...prev.slice(0, 19)]);
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return data;
    },
    refetchInterval: autoRefresh ? 5000 : false,
  });

  // Keyboard shortcut to toggle debugger
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'D') {
        setIsVisible(!isVisible);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isVisible]);

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          size="sm"
          className="bg-red-600 hover:bg-red-700 text-white shadow-lg"
        >
          <Bug className="w-4 h-4 mr-1" />
          Debug
        </Button>
      </div>
    );
  }

  const getStatusIcon = (status?: number, error?: string) => {
    if (error || (status && status >= 400)) {
      return <XCircle className="w-4 h-4 text-red-400" />;
    } else if (status && status >= 200 && status < 300) {
      return <CheckCircle className="w-4 h-4 text-green-400" />;
    } else {
      return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getStatusColor = (status?: number, error?: string) => {
    if (error || (status && status >= 400)) {
      return "border-red-500/50 bg-red-500/10";
    } else if (status && status >= 200 && status < 300) {
      return "border-green-500/50 bg-green-500/10";
    } else {
      return "border-yellow-500/50 bg-yellow-500/10";
    }
  };

  return (
    <div className="fixed inset-4 z-50 bg-slate-900/95 backdrop-blur-sm rounded-lg border border-slate-700 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800/50">
        <div className="flex items-center gap-2">
          <Bug className="w-5 h-5 text-red-400" />
          <h2 className="text-white font-semibold">GuardianChain Full App Debugger</h2>
          <Badge className="bg-red-500/20 text-red-300 border-red-500/50">
            DEVELOPMENT
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`border-slate-600 ${autoRefresh ? 'bg-green-500/20 text-green-300' : 'text-slate-300'}`}
          >
            <Activity className={`w-4 h-4 mr-1 ${autoRefresh ? 'animate-pulse' : ''}`} />
            Auto Refresh
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              refetch();
              setDebugLogs([]);
            }}
            className="border-slate-600 text-slate-300"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Refresh
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsVisible(false)}
            className="text-slate-400 hover:text-white"
          >
            <EyeOff className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="h-[calc(100vh-12rem)] overflow-y-auto">
        <Tabs defaultValue="auth" className="h-full">
          <TabsList className="grid w-full grid-cols-6 bg-slate-800/50 border-b border-slate-700">
            <TabsTrigger value="auth" className="data-[state=active]:bg-slate-700">
              <Shield className="w-4 h-4 mr-1" />
              Auth
            </TabsTrigger>
            <TabsTrigger value="user" className="data-[state=active]:bg-slate-700">
              <User className="w-4 h-4 mr-1" />
              User
            </TabsTrigger>
            <TabsTrigger value="subscription" className="data-[state=active]:bg-slate-700">
              <CreditCard className="w-4 h-4 mr-1" />
              Subscription
            </TabsTrigger>
            <TabsTrigger value="api" className="data-[state=active]:bg-slate-700">
              <Network className="w-4 h-4 mr-1" />
              API
            </TabsTrigger>
            <TabsTrigger value="logs" className="data-[state=active]:bg-slate-700">
              <Code className="w-4 h-4 mr-1" />
              Logs
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-slate-700">
              <Server className="w-4 h-4 mr-1" />
              System
            </TabsTrigger>
          </TabsList>

          {/* Authentication Tab */}
          <TabsContent value="auth" className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-sm flex items-center gap-2">
                    <Shield className="w-4 h-4 text-cyan-400" />
                    Authentication Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Authenticated:</span>
                    <Badge className={isAuthenticated ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}>
                      {isAuthenticated ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Loading:</span>
                    <Badge className={isLoading ? "bg-yellow-500/20 text-yellow-300" : "bg-slate-500/20 text-slate-300"}>
                      {isLoading ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Needs Onboarding:</span>
                    <Badge className={needsOnboarding ? "bg-orange-500/20 text-orange-300" : "bg-green-500/20 text-green-300"}>
                      {needsOnboarding ? "Yes" : "No"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-sm flex items-center gap-2">
                    <Database className="w-4 h-4 text-purple-400" />
                    Auth Endpoint Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className={`p-2 rounded border ${getStatusColor(authStatus?.status, authError?.message)}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-white text-sm">/api/auth/status</span>
                      {getStatusIcon(authStatus?.status, authError?.message)}
                    </div>
                    {authError && (
                      <div className="text-red-300 text-xs mt-1">{authError.message}</div>
                    )}
                  </div>
                  
                  <div className={`p-2 rounded border ${getStatusColor(200, user ? undefined : "No user data")}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-white text-sm">/api/auth/user</span>
                      {getStatusIcon(user ? 200 : 404, user ? undefined : "No user data")}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* User Tab */}
          <TabsContent value="user" className="p-4 space-y-4">
            {user && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-sm">User Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-400">ID:</span>
                          <span className="text-white font-mono">{user.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Email:</span>
                          <span className="text-white">{user.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Name:</span>
                          <span className="text-white">{user.firstName} {user.lastName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Tier:</span>
                          <Badge className="bg-cyan-500/20 text-cyan-300">{user.tier}</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Email Verified:</span>
                          <Badge className={user.emailVerified ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}>
                            {user.emailVerified ? "Yes" : "No"}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Wallet Verified:</span>
                          <Badge className={user.isWalletVerified ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}>
                            {user.isWalletVerified ? "Yes" : "No"}
                          </Badge>
                        </div>
                        {/* 2FA field removed for minimal JWT user */}
                        <div className="flex justify-between">
                          <span className="text-slate-400">Onboarding:</span>
                          <Badge className={user.onboardingCompleted ? "bg-green-500/20 text-green-300" : "bg-orange-500/20 text-orange-300"}>
                            {user.onboardingCompleted ? "Complete" : "Incomplete"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Usage statistics panel removed */}
          </TabsContent>

          {/* Subscription Tab */}
          <TabsContent value="subscription" className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Subscription Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {user && (
                    <>
                      <div className="text-slate-400 text-sm">No subscription data available (minimal auth mode)</div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Plans API Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`p-2 rounded border ${getStatusColor(200, plansError?.message)}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-white text-sm">/api/subscription/plans</span>
                      {getStatusIcon(plansError ? 500 : 200, plansError?.message)}
                    </div>
                    {plansError && (
                      <div className="text-red-300 text-xs mt-1">{plansError.message}</div>
                    )}
                    {subscriptionPlans && (
                      <div className="text-green-300 text-xs mt-1">
                        {subscriptionPlans.plans?.length || 0} plans loaded
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* API Tab */}
          <TabsContent value="api" className="p-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-sm">API Endpoint Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { endpoint: "/api/auth/user", status: user ? 200 : 404, error: user ? undefined : "No user data" },
                  { endpoint: "/api/auth/status", status: authStatus?.status, error: authError?.message },
                  { endpoint: "/api/debug/user", status: debugUser ? 200 : 404, error: debugUserError?.message },
                  { endpoint: "/api/subscription/plans", status: subscriptionPlans ? 200 : 500, error: plansError?.message },
                ].map((api, index) => (
                  <div key={index} className={`p-3 rounded border ${getStatusColor(api.status, api.error)}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-white font-mono text-sm">{api.endpoint}</span>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(api.status, api.error)}
                        <Badge className="bg-slate-700 text-slate-300 border-slate-600">
                          {api.status || "Unknown"}
                        </Badge>
                      </div>
                    </div>
                    {api.error && (
                      <div className="text-red-300 text-xs mt-2">{api.error}</div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs" className="p-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-sm">Recent API Calls</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {debugLogs.map((log, index) => (
                    <div key={index} className={`p-2 rounded border text-xs ${getStatusColor(log.status, log.error)}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white font-mono">{log.endpoint}</span>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(log.status, log.error)}
                          <span className="text-slate-300">{log.status}</span>
                          <span className="text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                      {log.error && (
                        <div className="text-red-300 mt-1">{log.error}</div>
                      )}
                    </div>
                  ))}
                  {debugLogs.length === 0 && (
                    <div className="text-slate-400 text-center py-4">No API calls logged yet</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="p-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-sm">System Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-slate-400 mb-2">Environment</div>
                    <Badge className="bg-blue-500/20 text-blue-300">Development</Badge>
                  </div>
                  <div>
                    <div className="text-slate-400 mb-2">Debug Mode</div>
                    <Badge className="bg-green-500/20 text-green-300">Active</Badge>
                  </div>
                </div>
                
                <div>
                  <div className="text-slate-400 mb-2">Keyboard Shortcuts</div>
                  <div className="space-y-1 text-xs">
                    <div className="text-slate-300">
                      <kbd className="bg-slate-700 px-1 rounded">Ctrl</kbd> + 
                      <kbd className="bg-slate-700 px-1 rounded ml-1">Shift</kbd> + 
                      <kbd className="bg-slate-700 px-1 rounded ml-1">D</kbd>
                      <span className="ml-2">Toggle Debugger</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}