import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  Lock,
  Eye,
  AlertTriangle,
  CheckCircle,
  Zap,
  Crown,
  Globe,
  Server,
  Database,
  Key,
  Fingerprint,
} from "lucide-react";

interface SecurityMetric {
  name: string;
  value: number;
  max: number;
  status: "excellent" | "good" | "warning" | "critical";
  description: string;
}

interface SecurityFeature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  teamsOnly: boolean;
  impact: "high" | "medium" | "low";
  icon: React.ComponentType<any>;
}

const TeamsEnhancedSecurity: React.FC = () => {
  const [securityScore, setSecurityScore] = useState(94);
  const [isScanning, setIsScanning] = useState(false);
  const [activeThreats, setActiveThreats] = useState(0);

  const securityMetrics: SecurityMetric[] = [
    {
      name: "Authentication Security",
      value: 98,
      max: 100,
      status: "excellent",
      description:
        "Multi-provider enterprise authentication with biometric support",
    },
    {
      name: "API Protection",
      value: 95,
      max: 100,
      status: "excellent",
      description: "Rate limiting, CORS, input validation, and request signing",
    },
    {
      name: "Data Encryption",
      value: 92,
      max: 100,
      status: "excellent",
      description:
        "End-to-end encryption for sensitive data and communications",
    },
    {
      name: "Access Control",
      value: 89,
      max: 100,
      status: "good",
      description: "Role-based permissions with tier-based feature gating",
    },
    {
      name: "Infrastructure Security",
      value: 96,
      max: 100,
      status: "excellent",
      description: "Secure deployment with private networking and monitoring",
    },
  ];

  const teamsSecurityFeatures: SecurityFeature[] = [
    {
      id: "private-deployment",
      name: "Private Deployments",
      description: "Restrict access to organization members only",
      enabled: true,
      teamsOnly: true,
      impact: "high",
      icon: Lock,
    },
    {
      id: "saml-sso",
      name: "SAML SSO Integration",
      description: "Enterprise single sign-on with your identity provider",
      enabled: true,
      teamsOnly: true,
      impact: "high",
      icon: Key,
    },
    {
      id: "advanced-audit",
      name: "Advanced Audit Logging",
      description: "Comprehensive security event tracking and analysis",
      enabled: true,
      teamsOnly: true,
      impact: "medium",
      icon: Eye,
    },
    {
      id: "threat-detection",
      name: "Real-time Threat Detection",
      description: "AI-powered anomaly detection and automated response",
      enabled: true,
      teamsOnly: true,
      impact: "high",
      icon: Shield,
    },
    {
      id: "biometric-auth",
      name: "Enhanced Biometric Auth",
      description: "WebAuthn with Teams-exclusive features",
      enabled: true,
      teamsOnly: false,
      impact: "medium",
      icon: Fingerprint,
    },
    {
      id: "geo-restrictions",
      name: "Geographic Access Control",
      description: "Restrict access by geographic location",
      enabled: false,
      teamsOnly: true,
      impact: "medium",
      icon: Globe,
    },
  ];

  const performSecurityScan = async () => {
    setIsScanning(true);
    // Simulate security scan
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setSecurityScore(
      Math.min(97, securityScore + Math.floor(Math.random() * 3)),
    );
    setActiveThreats(Math.floor(Math.random() * 2));
    setIsScanning(false);
  };

  const toggleFeature = (featureId: string) => {
    // In real implementation, this would call an API
    console.log(`Toggling security feature: ${featureId}`);
  };

  const getStatusColor = (status: SecurityMetric["status"]) => {
    switch (status) {
      case "excellent":
        return "text-green-400";
      case "good":
        return "text-blue-400";
      case "warning":
        return "text-yellow-400";
      case "critical":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusBg = (status: SecurityMetric["status"]) => {
    switch (status) {
      case "excellent":
        return "bg-green-500/20";
      case "good":
        return "bg-blue-500/20";
      case "warning":
        return "bg-yellow-500/20";
      case "critical":
        return "bg-red-500/20";
      default:
        return "bg-gray-500/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Security Score Overview */}
      <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="w-6 h-6 mr-2 text-green-400" />
              GUARDIANCHAIN Security Center
            </div>
            <Badge className="bg-green-600 text-white">Teams Enhanced</Badge>
          </CardTitle>
          <p className="text-slate-300">
            Enterprise-grade security monitoring and control for your Teams
            deployment
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">
                {securityScore}%
              </div>
              <div className="text-slate-300">Security Score</div>
              <div className="text-sm text-slate-400">Excellent Rating</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">
                {activeThreats}
              </div>
              <div className="text-slate-300">Active Threats</div>
              <div className="text-sm text-slate-400">Monitored & Blocked</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">
                24/7
              </div>
              <div className="text-slate-300">Monitoring</div>
              <div className="text-sm text-slate-400">Always Protected</div>
            </div>
          </div>

          <Button
            onClick={performSecurityScan}
            disabled={isScanning}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {isScanning ? (
              <div className="flex items-center">
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                Scanning Security...
              </div>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Run Security Scan
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Security Features Tabs */}
      <Tabs defaultValue="metrics" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800">
          <TabsTrigger value="metrics" className="text-white">
            Security Metrics
          </TabsTrigger>
          <TabsTrigger value="features" className="text-white">
            Teams Features
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="text-white">
            Live Monitoring
          </TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
          {securityMetrics.map((metric, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-medium">{metric.name}</h3>
                  <Badge
                    className={`${getStatusBg(metric.status)} ${getStatusColor(metric.status)} border-0`}
                  >
                    {metric.value}%
                  </Badge>
                </div>
                <Progress
                  value={metric.value}
                  className="mb-2"
                  style={{
                    backgroundColor: "rgb(51, 65, 85)",
                  }}
                />
                <p className="text-sm text-slate-400">{metric.description}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <div className="grid gap-4">
            {teamsSecurityFeatures.map((feature) => (
              <Card
                key={feature.id}
                className="bg-slate-800/50 border-slate-700"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-lg ${
                          feature.enabled
                            ? "bg-green-600/20 text-green-400"
                            : "bg-gray-600/20 text-gray-400"
                        }`}
                      >
                        <feature.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium flex items-center">
                          {feature.name}
                          {feature.teamsOnly && (
                            <Crown className="w-4 h-4 ml-2 text-yellow-400" />
                          )}
                        </h3>
                        <p className="text-sm text-slate-400">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          feature.impact === "high"
                            ? "destructive"
                            : feature.impact === "medium"
                              ? "secondary"
                              : "outline"
                        }
                        className="text-xs"
                      >
                        {feature.impact.toUpperCase()}
                      </Badge>
                      <Button
                        variant={feature.enabled ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => toggleFeature(feature.id)}
                      >
                        {feature.enabled ? "Enabled" : "Enable"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Server className="w-5 h-5 mr-2 text-blue-400" />
                  Infrastructure Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">API Gateway</span>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-1" />
                      <span className="text-green-400">Healthy</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Database</span>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-1" />
                      <span className="text-green-400">Healthy</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">WebSocket</span>
                    <div className="flex items-center">
                      <AlertTriangle className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-yellow-400">Reconnecting</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Auth Services</span>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-1" />
                      <span className="text-green-400">Healthy</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Database className="w-5 h-5 mr-2 text-purple-400" />
                  Security Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Successful Logins</span>
                    <span className="text-green-400">2,847</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Failed Attempts</span>
                    <span className="text-yellow-400">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Blocked IPs</span>
                    <span className="text-red-400">3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">API Calls</span>
                    <span className="text-blue-400">45,892</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamsEnhancedSecurity;
