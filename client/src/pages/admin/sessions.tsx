"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MapPin, 
  Monitor, 
  Smartphone, 
  Shield, 
  AlertTriangle,
  Search,
  RefreshCw
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface SessionLog {
  id: string;
  userId: string;
  email: string;
  ip: string;
  city: string;
  country: string;
  region: string;
  device: string;
  browser: string;
  os: string;
  lastSeen: string;
  isActive: boolean;
  sessionToken: string;
  riskScore: number;
  loginAttempts: number;
}

export default function AdminSessions() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: sessionLogs, isLoading, refetch } = useQuery({
    queryKey: ['/api/admin/sessions'],
    enabled: user?.tier === 'ADMIN'
  });

  const filteredLogs = sessionLogs?.filter((log: SessionLog) =>
    log.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.ip.includes(searchTerm) ||
    log.city.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getDeviceIcon = (device: string) => {
    if (device.toLowerCase().includes('mobile') || device.toLowerCase().includes('phone')) {
      return <Smartphone className="w-4 h-4 text-blue-500" />;
    }
    return <Monitor className="w-4 h-4 text-green-500" />;
  };

  const getRiskBadge = (riskScore: number) => {
    if (riskScore >= 80) {
      return <Badge className="bg-red-500/20 text-red-400 border-red-500/40">High Risk</Badge>;
    } else if (riskScore >= 50) {
      return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/40">Medium Risk</Badge>;
    }
    return <Badge className="bg-green-500/20 text-green-400 border-green-500/40">Low Risk</Badge>;
  };

  if (user?.tier !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Card className="bg-slate-800/50 border-red-500/20">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-400 mb-2">Access Denied</h2>
            <p className="text-slate-400">Admin privileges required to view session logs</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-cyan-400" />
              <div>
                <h1 className="text-3xl font-bold text-white">Active Sessions & Geo Logs</h1>
                <p className="text-slate-400">Monitor user sessions and security events</p>
              </div>
            </div>
            <Button
              onClick={() => refetch()}
              className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border-cyan-500/40"
              data-testid="button-refresh-sessions"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Search and Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-cyan-500/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search sessions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-0 text-white placeholder-slate-400 focus-visible:ring-0"
                  data-testid="input-search-sessions"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-cyan-500/20">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">
                  {filteredLogs.filter((log: SessionLog) => log.isActive).length}
                </div>
                <div className="text-sm text-slate-400">Active Sessions</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-cyan-500/20">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {filteredLogs.filter((log: SessionLog) => log.riskScore >= 50).length}
                </div>
                <div className="text-sm text-slate-400">Risk Alerts</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-cyan-500/20">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {new Set(filteredLogs.map((log: SessionLog) => log.country)).size}
                </div>
                <div className="text-sm text-slate-400">Countries</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sessions Table */}
        <Card className="bg-slate-800/50 border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-cyan-400">Session Activity Log</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm" data-testid="table-sessions">
                  <thead className="border-b border-slate-700">
                    <tr>
                      <th className="p-3 text-left text-slate-200">User</th>
                      <th className="p-3 text-left text-slate-200">Location</th>
                      <th className="p-3 text-left text-slate-200">Device</th>
                      <th className="p-3 text-left text-slate-200">Status</th>
                      <th className="p-3 text-left text-slate-200">Risk</th>
                      <th className="p-3 text-left text-slate-200">Last Seen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((log: SessionLog, i: number) => (
                      <tr key={i} className="border-b border-slate-800 hover:bg-slate-800/30" data-testid={`row-session-${i}`}>
                        <td className="p-3">
                          <div>
                            <div className="text-white font-medium">{log.email}</div>
                            <div className="text-xs text-slate-400">{log.ip}</div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-cyan-400" />
                            <div>
                              <div className="text-slate-200">{log.city}, {log.region}</div>
                              <div className="text-xs text-slate-400">{log.country}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center space-x-2">
                            {getDeviceIcon(log.device)}
                            <div>
                              <div className="text-slate-200">{log.browser}</div>
                              <div className="text-xs text-slate-400">{log.os}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          {log.isActive ? (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/40">
                              Active
                            </Badge>
                          ) : (
                            <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/40">
                              Inactive
                            </Badge>
                          )}
                        </td>
                        <td className="p-3">
                          {getRiskBadge(log.riskScore)}
                        </td>
                        <td className="p-3 text-slate-200">
                          {new Date(log.lastSeen).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredLogs.length === 0 && !isLoading && (
                  <div className="text-center py-8 text-slate-400">
                    No session logs found
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}