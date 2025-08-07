import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Monitor, 
  Smartphone, 
  Tablet, 
  Clock,
  AlertCircle,
  Shield
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface LoginLog {
  id: string;
  ipAddress: string;
  city: string;
  region: string;
  country: string;
  device: string;
  success: boolean;
  loginTime: string;
}

interface LoginSession {
  id: string;
  ipAddress: string;
  userAgent: string;
  isActive: boolean;
  createdAt: string;
  expiresAt: string;
}

export default function LoginActivity() {
  const { toast } = useToast();

  const { data: loginHistory, isLoading: historyLoading } = useQuery({
    queryKey: ['/api/auth/login-history'],
  });

  const { data: activeSessions, isLoading: sessionsLoading, refetch: refetchSessions } = useQuery({
    queryKey: ['/api/auth/sessions'],
  });

  const getDeviceIcon = (userAgent: string) => {
    const ua = userAgent.toLowerCase();
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
      return <Smartphone className="w-4 h-4" />;
    }
    if (ua.includes('tablet') || ua.includes('ipad')) {
      return <Tablet className="w-4 h-4" />;
    }
    return <Monitor className="w-4 h-4" />;
  };

  const terminateSession = async (sessionId: string) => {
    try {
      await apiRequest(`/api/auth/sessions/${sessionId}`, "DELETE");
      toast({
        title: "Session Terminated",
        description: "The selected session has been logged out",
      });
      refetchSessions();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to terminate session",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatLocation = (city: string, region: string, country: string) => {
    const parts = [city, region, country].filter(Boolean);
    return parts.join(', ') || 'Unknown Location';
  };

  return (
    <div className="space-y-6">
      {/* Active Sessions */}
      <Card className="bg-slate-800/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="flex items-center text-cyan-400">
            <Shield className="w-5 h-5 mr-2" />
            Active Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sessionsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse bg-slate-700/50 h-16 rounded-lg"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-3" data-testid="active-sessions">
              {activeSessions?.map((session: LoginSession) => (
                <div 
                  key={session.id}
                  className="p-4 bg-slate-900/50 rounded-lg border border-slate-700 flex items-center justify-between"
                  data-testid={`session-${session.id}`}
                >
                  <div className="flex items-center space-x-3">
                    {getDeviceIcon(session.userAgent)}
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-white">
                          {session.ipAddress}
                        </p>
                        {session.isActive ? (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/40">
                            Active
                          </Badge>
                        ) : (
                          <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/40">
                            Inactive
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">
                        Started: {formatDate(session.createdAt)}
                      </p>
                      <p className="text-xs text-slate-400">
                        Expires: {formatDate(session.expiresAt)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => terminateSession(session.id)}
                    className="border-red-500/40 text-red-400 hover:bg-red-500/20"
                    data-testid={`button-terminate-${session.id}`}
                  >
                    Terminate
                  </Button>
                </div>
              ))}
              {!activeSessions?.length && (
                <p className="text-slate-400 text-center py-8">No active sessions found</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Login History */}
      <Card className="bg-slate-800/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="flex items-center text-cyan-400">
            <Clock className="w-5 h-5 mr-2" />
            Recent Login Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {historyLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="animate-pulse bg-slate-700/50 h-12 rounded-lg"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-2" data-testid="login-history">
              {loginHistory?.map((log: LoginLog) => (
                <div 
                  key={log.id}
                  className="flex items-center justify-between p-3 bg-slate-900/30 rounded-lg border border-slate-700/50"
                  data-testid={`login-${log.id}`}
                >
                  <div className="flex items-center space-x-3">
                    {log.success ? (
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-400" />
                    )}
                    <div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span className="text-sm text-white">
                          {formatLocation(log.city, log.region, log.country)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono">
                        {log.ipAddress} • {log.device}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">
                      {formatDate(log.loginTime)}
                    </p>
                    <Badge 
                      className={log.success 
                        ? "bg-green-500/20 text-green-400 border-green-500/40" 
                        : "bg-red-500/20 text-red-400 border-red-500/40"
                      }
                    >
                      {log.success ? "Success" : "Failed"}
                    </Badge>
                  </div>
                </div>
              ))}
              {!loginHistory?.length && (
                <p className="text-slate-400 text-center py-8">No login history available</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}