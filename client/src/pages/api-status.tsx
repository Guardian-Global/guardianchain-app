import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Database,
  Key,
  Server,
  Globe,
} from "lucide-react";

interface ApiDiagnostics {
  timestamp: string;
  environment: string;
  endpoints: Record<string, { status: string; method: string }>;
  vendor_apis: Record<string, { configured: boolean; status: string }>;
  system_health: Record<string, string>;
}

const ApiStatus: React.FC = () => {
  const [diagnostics, setDiagnostics] = useState<ApiDiagnostics | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchDiagnostics = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/diagnostics");
      const result = await response.json();
      if (result.success) {
        setDiagnostics(result.data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error("Failed to fetch diagnostics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagnostics();
    const interval = setInterval(fetchDiagnostics, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
      case "connected":
      case "configured":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "missing":
      case "missing keys":
      case "not configured":
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
      case "connected":
      case "configured":
        return "bg-green-600";
      case "missing":
      case "missing keys":
      case "not configured":
        return "bg-red-600";
      default:
        return "bg-yellow-600";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin text-purple-400" />
            <h1 className="text-2xl font-bold">Loading API Status...</h1>
          </div>
        </div>
      </div>
    );
  }

  const healthyEndpoints = diagnostics
    ? Object.values(diagnostics.endpoints).filter(
        (e) => e.status === "Configured",
      ).length
    : 0;
  const totalEndpoints = diagnostics
    ? Object.keys(diagnostics.endpoints).length
    : 0;
  const healthyVendors = diagnostics
    ? Object.values(diagnostics.vendor_apis).filter((v) => v.configured).length
    : 0;
  const totalVendors = diagnostics
    ? Object.keys(diagnostics.vendor_apis).length
    : 0;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            GUARDIANCHAIN API Status
          </h1>
          <p className="text-xl text-slate-300">
            Real-time monitoring of all API endpoints and vendor integrations
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Button onClick={fetchDiagnostics} disabled={loading}>
              <RefreshCw
                className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh Status
            </Button>
            {lastUpdated && (
              <span className="text-sm text-slate-400">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <Server className="w-8 h-8 mx-auto mb-2 text-blue-400" />
              <div className="text-2xl font-bold text-white">
                {totalEndpoints}
              </div>
              <div className="text-sm text-slate-400">Total Endpoints</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-400" />
              <div className="text-2xl font-bold text-green-400">
                {healthyEndpoints}
              </div>
              <div className="text-sm text-slate-400">Healthy Endpoints</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <Key className="w-8 h-8 mx-auto mb-2 text-purple-400" />
              <div className="text-2xl font-bold text-white">
                {totalVendors}
              </div>
              <div className="text-sm text-slate-400">Vendor APIs</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <Globe className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
              <div className="text-2xl font-bold text-yellow-400">
                {healthyVendors}
              </div>
              <div className="text-sm text-slate-400">Configured APIs</div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Status */}
        <Tabs defaultValue="endpoints" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800">
            <TabsTrigger value="endpoints" className="text-white">
              API Endpoints
            </TabsTrigger>
            <TabsTrigger value="vendors" className="text-white">
              Vendor APIs
            </TabsTrigger>
            <TabsTrigger value="system" className="text-white">
              System Health
            </TabsTrigger>
          </TabsList>

          <TabsContent value="endpoints" className="space-y-4">
            <div className="grid gap-4">
              {diagnostics &&
                Object.entries(diagnostics.endpoints).map(
                  ([endpoint, info]) => (
                    <Card
                      key={endpoint}
                      className="bg-slate-800/50 border-slate-700"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(info.status)}
                            <div>
                              <div className="font-mono text-white">
                                {endpoint}
                              </div>
                              <div className="text-sm text-slate-400">
                                {info.method} method
                              </div>
                            </div>
                          </div>
                          <Badge
                            className={`${getStatusColor(info.status)} text-white`}
                          >
                            {info.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ),
                )}
            </div>
          </TabsContent>

          <TabsContent value="vendors" className="space-y-4">
            <div className="grid gap-4">
              {diagnostics &&
                Object.entries(diagnostics.vendor_apis).map(
                  ([vendor, info]) => (
                    <Card
                      key={vendor}
                      className="bg-slate-800/50 border-slate-700"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(info.status)}
                            <div>
                              <div className="font-semibold text-white">
                                {vendor}
                              </div>
                              <div className="text-sm text-slate-400">
                                {vendor.includes("SUPABASE")
                                  ? "Database & Storage Service"
                                  : vendor.includes("OPENAI")
                                    ? "AI Language Model"
                                    : vendor.includes("ANTHROPIC")
                                      ? "AI Assistant"
                                      : vendor.includes("STRIPE")
                                        ? "Payment Processing"
                                        : vendor.includes("ALCHEMY")
                                          ? "Blockchain Infrastructure"
                                          : vendor.includes("DATABASE")
                                            ? "PostgreSQL Database"
                                            : "API Service"}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge
                              className={`${getStatusColor(info.status)} text-white mb-1`}
                            >
                              {info.status}
                            </Badge>
                            <div className="text-xs text-slate-400">
                              {info.configured
                                ? "Configured"
                                : "Not Configured"}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ),
                )}
            </div>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <div className="grid gap-4">
              {diagnostics &&
                Object.entries(diagnostics.system_health).map(
                  ([system, status]) => (
                    <Card
                      key={system}
                      className="bg-slate-800/50 border-slate-700"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(status)}
                            <div>
                              <div className="font-semibold text-white capitalize">
                                {system}
                              </div>
                              <div className="text-sm text-slate-400">
                                System Component
                              </div>
                            </div>
                          </div>
                          <Badge
                            className={`${getStatusColor(status)} text-white`}
                          >
                            {status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ),
                )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Environment Info */}
        {diagnostics && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">
                Environment Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Environment:</span>
                  <span className="ml-2 text-white font-mono">
                    {diagnostics.environment}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Last Check:</span>
                  <span className="ml-2 text-white font-mono">
                    {new Date(diagnostics.timestamp).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Uptime:</span>
                  <span className="ml-2 text-green-400 font-mono">Running</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ApiStatus;
