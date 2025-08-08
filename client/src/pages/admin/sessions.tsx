// pages/admin/sessions.tsx
"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ShieldCheck, MapPin, Globe, Users, Activity, AlertTriangle, Monitor } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { useToast } from "../../hooks/use-toast";
import { apiRequest } from "../../lib/queryClient";

interface SessionData {
  id: string;
  userId: string;
  email: string;
  sessionToken: string;
  ip: string;
  userAgent: string;
  country?: string;
  region?: string;
  city?: string;
  device?: string;
  browser?: string;
  os?: string;
  riskScore?: number;
  isActive: boolean;
  lastActivity: Date;
  createdAt: Date;
}

interface LoginActivity {
  id: string;
  userId: string;
  email: string;
  ip: string;
  success: boolean;
  country?: string;
  city?: string;
  device?: string;
  browser?: string;
  riskScore?: number;
  loginTime: Date;
}

export default function AdminSessionsPage() {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loginActivity, setLoginActivity] = useState<LoginActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSessions: 0,
    activeSessions: 0,
    uniqueLocations: 0,
    highRiskSessions: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchSessionData();
  }, []);

  const fetchSessionData = async () => {
    try {
      setLoading(true);
      
      // Fetch active sessions
      const sessionsResponse = await apiRequest("/api/admin/sessions", {
        method: "GET",
        headers: {
          "x-admin-key": "GUARDIAN_ADMIN_2025"
        }
      });

      // Fetch recent login activity
      const activityResponse = await apiRequest("/api/admin/login-activity?limit=50", {
        method: "GET",
        headers: {
          "x-admin-key": "GUARDIAN_ADMIN_2025"
        }
      });

      setSessions(sessionsResponse || []);
      setLoginActivity(activityResponse || []);

      // Calculate stats
      const totalSessions = sessionsResponse?.length || 0;
      const activeSessions = sessionsResponse?.filter((s: SessionData) => s.isActive).length || 0;
      const uniqueLocations = new Set(sessionsResponse?.map((s: SessionData) => `${s.city},${s.country}`)).size;
      const highRiskSessions = sessionsResponse?.filter((s: SessionData) => (s.riskScore || 0) > 50).length || 0;

      setStats({
        totalSessions,
        activeSessions,
        uniqueLocations,
        highRiskSessions
      });

    } catch (error) {
      console.error("Error fetching session data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch session data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const forceLogoutUser = async (userId: string) => {
    try {
      await apiRequest(`/api/admin/force-logout/${userId}`, {
        method: "POST",
        headers: {
          "x-admin-key": "GUARDIAN_ADMIN_2025"
        }
      });

      toast({
        title: "Success",
        description: "User logged out successfully",
      });

      // Refresh data
      fetchSessionData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout user",
        variant: "destructive",
      });
    }
  };

  const getRiskBadgeVariant = (riskScore: number = 0) => {
    if (riskScore >= 75) return "destructive";
    if (riskScore >= 50) return "secondary";
    if (riskScore >= 25) return "outline";
    return "default";
  };

  const getRiskLabel = (riskScore: number = 0) => {
    if (riskScore >= 75) return "High Risk";
    if (riskScore >= 50) return "Medium Risk";
    if (riskScore >= 25) return "Low Risk";
    return "Normal";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-hsl(218,54%,9%) via-hsl(220,39%,11%) to-hsl(222,47%,11%) flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-gradient-to-br from-hsl(218,54%,9%) via-hsl(220,39%,11%) to-hsl(222,47%,11%) min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-hsl(180,100%,90%) mb-2">🛡️ Live Session Monitor</h1>
          <p className="text-hsl(220,17%,64%)">Real-time session tracking and security monitoring</p>
        </div>
        <Button onClick={fetchSessionData} variant="outline" className="bg-hsl(222,47%,11%) border-hsl(215,20%,65%) text-hsl(180,100%,90%)">
          <Activity className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-hsl(222,47%,11%) border-hsl(215,20%,65%)">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-hsl(220,17%,64%)">Total Sessions</CardTitle>
            <Monitor className="h-4 w-4 text-hsl(220,17%,64%)" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-hsl(180,100%,90%)">{stats.totalSessions}</div>
          </CardContent>
        </Card>

        <Card className="bg-hsl(222,47%,11%) border-hsl(215,20%,65%)">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-hsl(220,17%,64%)">Active Sessions</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.activeSessions}</div>
          </CardContent>
        </Card>

        <Card className="bg-hsl(222,47%,11%) border-hsl(215,20%,65%)">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-hsl(220,17%,64%)">Unique Locations</CardTitle>
            <Globe className="h-4 w-4 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-500">{stats.uniqueLocations}</div>
          </CardContent>
        </Card>

        <Card className="bg-hsl(222,47%,11%) border-hsl(215,20%,65%)">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-hsl(220,17%,64%)">High Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.highRiskSessions}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Sessions */}
        <Card className="bg-hsl(222,47%,11%) border-hsl(215,20%,65%)">
          <CardHeader>
            <CardTitle className="text-hsl(180,100%,90%) flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              Active Sessions
            </CardTitle>
            <CardDescription className="text-hsl(220,17%,64%)">
              Currently logged in users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {sessions.filter(s => s.isActive).map((session) => (
                <div key={session.id} className="p-4 rounded-lg border border-hsl(215,20%,65%) bg-hsl(218,54%,9%)">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-hsl(180,100%,90%)">{session.email}</p>
                      <p className="text-sm text-hsl(220,17%,64%) flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {session.city}, {session.country}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={getRiskBadgeVariant(session.riskScore || 0)} className="text-xs">
                        {getRiskLabel(session.riskScore || 0)}
                      </Badge>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => forceLogoutUser(session.userId)}
                      >
                        Force Logout
                      </Button>
                    </div>
                  </div>
                  <div className="text-xs text-hsl(220,17%,64%) space-y-1">
                    <p>Device: {session.device} • Browser: {session.browser}</p>
                    <p>IP: {session.ip}</p>
                    <p>Last Active: {formatDistanceToNow(new Date(session.lastActivity), { addSuffix: true })}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Login Activity */}
        <Card className="bg-hsl(222,47%,11%) border-hsl(215,20%,65%)">
          <CardHeader>
            <CardTitle className="text-hsl(180,100%,90%) flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Login Activity
            </CardTitle>
            <CardDescription className="text-hsl(220,17%,64%)">
              Latest login attempts (success and failed)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {loginActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg border border-hsl(215,20%,65%) bg-hsl(218,54%,9%)">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${activity.success ? 'bg-green-500' : 'bg-red-500'}`} />
                    <div>
                      <p className="text-sm font-medium text-hsl(180,100%,90%)">{activity.email}</p>
                      <p className="text-xs text-hsl(220,17%,64%)">
                        {activity.city}, {activity.country} • {activity.device}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={getRiskBadgeVariant(activity.riskScore || 0)} className="text-xs mb-1">
                      Risk: {activity.riskScore || 0}
                    </Badge>
                    <p className="text-xs text-hsl(220,17%,64%)">
                      {formatDistanceToNow(new Date(activity.loginTime), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}