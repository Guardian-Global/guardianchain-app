import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useEnhancedAuth } from "@/hooks/useEnhancedAuth";
import {
  RefreshCw,
  User,
  Shield,
  Settings,
  Database,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Bug,
  Zap,
} from "lucide-react";

export default function AuthDebugPanel() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading, refetch } = useEnhancedAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Debug endpoint queries
  const { data: debugUser, isLoading: debugLoading } = useQuery({
    queryKey: ["/api/debug/user"],
    queryFn: async () => {
      const response = await fetch("/api/debug/user");
      if (!response.ok) throw new Error("Debug user fetch failed");
      return response.json();
    },
    retry: false,
  });

  const { data: authStatus, isLoading: statusLoading } = useQuery({
    queryKey: ["/api/auth/status"],
    queryFn: async () => {
      const token = localStorage.getItem('gc_jwt');
      const response = await fetch("/api/auth/status", {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        credentials: 'include'
      });
      if (!response.ok) throw new Error("Auth status fetch failed");
      return response.json();
    },
    retry: false,
  });

  const { data: subscriptionPlans, isLoading: plansLoading } = useQuery({
    queryKey: ["/api/subscription/plans"],
    queryFn: async () => {
      const response = await fetch("/api/subscription/plans");
      if (!response.ok) throw new Error("Subscription plans fetch failed");
      return response.json();
    },
    retry: false,
  });

  const handleRefreshAuth = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast({
        title: "Authentication Refreshed",
        description: "User data has been reloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh authentication data.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const getStatusIcon = (status: boolean | undefined) => {
    if (status === true) return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (status === false) return <XCircle className="w-4 h-4 text-red-500" />;
    return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
  };

  const getStatusColor = (status: boolean | undefined) => {
    if (status === true) return "bg-green-500/20 text-green-300 border-green-500/50";
    if (status === false) return "bg-red-500/20 text-red-300 border-red-500/50";
    return "bg-yellow-500/20 text-yellow-300 border-yellow-500/50";
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="bg-slate-800/95 border-slate-700 backdrop-blur-sm w-96 max-h-96 overflow-y-auto">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2 text-sm">
            <Bug className="w-4 h-4 text-cyan-400" />
            Auth Debug Panel
            <Button
              size="sm"
              variant="ghost"
              onClick={handleRefreshAuth}
              disabled={isRefreshing}
              className="ml-auto h-6 w-6 p-0"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4 text-xs">
          {/* Authentication Status */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span className="text-white font-medium">Authentication Status</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Badge className={`${getStatusColor(isAuthenticated)} justify-center`}>
                {getStatusIcon(isAuthenticated)}
                <span className="ml-1">{isAuthenticated ? "Authenticated" : "Not Auth"}</span>
              </Badge>
              <Badge className={`${getStatusColor(!isLoading)} justify-center`}>
                {getStatusIcon(!isLoading)}
                <span className="ml-1">{isLoading ? "Loading" : "Ready"}</span>
              </Badge>
            </div>
          </div>

          {/* User Information */}
          {user && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-cyan-400" />
                <span className="text-white font-medium">User Info</span>
              </div>
              
              <div className="bg-slate-900/50 rounded p-2 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">ID:</span>
                  <span className="text-white">{user.id.substring(0, 12)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Email:</span>
                  <span className="text-white">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tier:</span>
                  <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                    {user.tier}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Onboarding:</span>
                  <Badge className={getStatusColor(user.onboardingCompleted)}>
                    {user.onboardingCompleted ? "Complete" : "Incomplete"}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {/* Debug User Comparison */}
          {debugUser && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" />
                <span className="text-white font-medium">Debug User</span>
              </div>
              
              <div className="bg-slate-900/50 rounded p-2 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Debug ID:</span>
                  <span className="text-white">{debugUser.id?.substring(0, 12)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">System:</span>
                  <Badge variant="outline" className="border-cyan-500/50 text-cyan-300">
                    Debug Mode
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {/* Subscription Status */}
            {/* Subscription section removed: not available in EnhancedUser shape */}

          {/* Subscription Plans Available */}
          {subscriptionPlans && !plansLoading && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span className="text-white font-medium">Available Plans</span>
              </div>
              
              <div className="grid grid-cols-2 gap-1">
                {Array.isArray(subscriptionPlans) && subscriptionPlans.slice(0, 4).map((plan: any) => (
                  <Badge
                    key={plan.tier}
                    variant="outline"
                    className="border-slate-600 text-slate-300 justify-center text-xs"
                  >
                    {plan.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-cyan-400" />
              <span className="text-white font-medium">Quick Actions</span>
            </div>
            
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 h-7 text-xs border-slate-600 text-slate-300"
                onClick={() => window.location.href = "/enhanced-onboarding"}
              >
                Onboarding
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 h-7 text-xs border-slate-600 text-slate-300"
                onClick={() => window.location.href = "/dashboard"}
              >
                Dashboard
              </Button>
            </div>
          </div>

          {/* System Health */}
          <div className="pt-2 border-t border-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">System Health</span>
              <div className="flex gap-1">
                <div className={`w-2 h-2 rounded-full ${isAuthenticated ? "bg-green-500" : "bg-red-500"}`} />
                <div className={`w-2 h-2 rounded-full ${user ? "bg-green-500" : "bg-yellow-500"}`} />
                <div className={`w-2 h-2 rounded-full ${subscriptionPlans ? "bg-green-500" : "bg-yellow-500"}`} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}