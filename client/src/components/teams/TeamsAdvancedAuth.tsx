import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Shield,
  Key,
  Fingerprint,
  Smartphone,
  Building,
  Globe,
  Users,
  Lock,
  Zap,
  Crown,
  AlertTriangle,
  CheckCircle,
  Settings,
  Eye,
} from "lucide-react";

interface AuthProvider {
  id: string;
  name: string;
  type: "oauth" | "saml" | "biometric" | "enterprise";
  enabled: boolean;
  teamsOnly: boolean;
  userCount: number;
  securityLevel: "standard" | "high" | "enterprise";
  icon: React.ComponentType<any>;
}

interface SecurityPolicy {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  configurable: boolean;
  teamsExclusive: boolean;
  impact: "low" | "medium" | "high";
}

const TeamsAdvancedAuth: React.FC = () => {
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [ssoConfigured, setSsoConfigured] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [activeUsers, setActiveUsers] = useState(1247);
  const [securityScore, setSecurityScore] = useState(96);

  const authProviders: AuthProvider[] = [
    {
      id: "google-workspace",
      name: "Google Workspace",
      type: "oauth",
      enabled: true,
      teamsOnly: false,
      userCount: 456,
      securityLevel: "high",
      icon: Globe,
    },
    {
      id: "github-enterprise",
      name: "GitHub Enterprise",
      type: "oauth",
      enabled: true,
      teamsOnly: true,
      userCount: 234,
      securityLevel: "high",
      icon: Globe,
    },
    {
      id: "saml-sso",
      name: "SAML SSO",
      type: "saml",
      enabled: ssoConfigured,
      teamsOnly: true,
      userCount: 789,
      securityLevel: "enterprise",
      icon: Building,
    },
    {
      id: "biometric-auth",
      name: "WebAuthn Biometric",
      type: "biometric",
      enabled: biometricEnabled,
      teamsOnly: false,
      userCount: 567,
      securityLevel: "enterprise",
      icon: Fingerprint,
    },
    {
      id: "metamask-enterprise",
      name: "MetaMask Enterprise",
      type: "enterprise",
      enabled: true,
      teamsOnly: true,
      userCount: 123,
      securityLevel: "high",
      icon: Shield,
    },
    {
      id: "stripe-identity",
      name: "Stripe Identity Plus",
      type: "enterprise",
      enabled: true,
      teamsOnly: true,
      userCount: 89,
      securityLevel: "enterprise",
      icon: Key,
    },
  ];

  const securityPolicies: SecurityPolicy[] = [
    {
      id: "password-complexity",
      name: "Enhanced Password Requirements",
      description: "Enforce complex passwords with entropy scoring",
      enabled: true,
      configurable: true,
      teamsExclusive: false,
      impact: "medium",
    },
    {
      id: "session-timeout",
      name: "Adaptive Session Timeout",
      description: "Dynamic session timeouts based on user behavior",
      enabled: true,
      configurable: true,
      teamsExclusive: true,
      impact: "medium",
    },
    {
      id: "geo-restrictions",
      name: "Geographic Access Control",
      description: "Restrict access based on IP geolocation",
      enabled: false,
      configurable: true,
      teamsExclusive: true,
      impact: "high",
    },
    {
      id: "device-trust",
      name: "Device Trust Management",
      description: "Track and verify trusted devices per user",
      enabled: true,
      configurable: true,
      teamsExclusive: true,
      impact: "high",
    },
    {
      id: "concurrent-sessions",
      name: "Concurrent Session Limits",
      description: "Limit number of simultaneous user sessions",
      enabled: true,
      configurable: true,
      teamsExclusive: false,
      impact: "low",
    },
    {
      id: "anomaly-detection",
      name: "AI Anomaly Detection",
      description: "Machine learning-based suspicious activity detection",
      enabled: true,
      configurable: false,
      teamsExclusive: true,
      impact: "high",
    },
  ];

  const configureSAMLSSO = () => {
    setSsoConfigured(true);
    console.log("SAML SSO configuration initiated");
  };

  const toggleProvider = (providerId: string) => {
    console.log(`Toggling auth provider: ${providerId}`);
  };

  const togglePolicy = (policyId: string) => {
    console.log(`Toggling security policy: ${policyId}`);
  };

  const getSecurityLevelColor = (level: AuthProvider["securityLevel"]) => {
    switch (level) {
      case "enterprise":
        return "text-purple-400 bg-purple-500/20";
      case "high":
        return "text-green-400 bg-green-500/20";
      case "standard":
        return "text-blue-400 bg-blue-500/20";
      default:
        return "text-gray-400 bg-gray-500/20";
    }
  };

  const getImpactColor = (impact: SecurityPolicy["impact"]) => {
    switch (impact) {
      case "high":
        return "text-red-400 bg-red-500/20";
      case "medium":
        return "text-yellow-400 bg-yellow-500/20";
      case "low":
        return "text-green-400 bg-green-500/20";
      default:
        return "text-gray-400 bg-gray-500/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Authentication Overview */}
      <Card className="bg-gradient-to-br from-blue-900 to-slate-900 border-blue-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="w-6 h-6 mr-2 text-blue-400" />
              Teams Advanced Authentication
            </div>
            <Badge className="bg-blue-600 text-white">
              Enterprise Ready
            </Badge>
          </CardTitle>
          <p className="text-blue-100">
            Enterprise-grade authentication with Teams-exclusive features and enhanced security
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-1">
                {activeUsers.toLocaleString()}
              </div>
              <div className="text-blue-200 text-sm">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">
                {authProviders.filter(p => p.enabled).length}
              </div>
              <div className="text-blue-200 text-sm">Auth Methods</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-1">
                {securityScore}%
              </div>
              <div className="text-blue-200 text-sm">Security Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-1">24/7</div>
              <div className="text-blue-200 text-sm">Monitoring</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Authentication Tabs */}
      <Tabs defaultValue="providers" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800">
          <TabsTrigger value="providers" className="text-white">
            Auth Providers
          </TabsTrigger>
          <TabsTrigger value="policies" className="text-white">
            Security Policies
          </TabsTrigger>
          <TabsTrigger value="sso" className="text-white">
            SSO Setup
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="text-white">
            Monitoring
          </TabsTrigger>
        </TabsList>

        <TabsContent value="providers" className="space-y-4">
          <div className="grid gap-4">
            {authProviders.map((provider) => (
              <Card key={provider.id} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        provider.enabled 
                          ? "bg-blue-600/20 text-blue-400" 
                          : "bg-gray-600/20 text-gray-400"
                      }`}>
                        <provider.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium flex items-center">
                          {provider.name}
                          {provider.teamsOnly && (
                            <Crown className="w-4 h-4 ml-2 text-yellow-400" />
                          )}
                        </h3>
                        <p className="text-sm text-slate-400">
                          {provider.userCount.toLocaleString()} active users • {provider.type.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={`${getSecurityLevelColor(provider.securityLevel)} border-0`}>
                        {provider.securityLevel.toUpperCase()}
                      </Badge>
                      <Switch
                        checked={provider.enabled}
                        onCheckedChange={() => toggleProvider(provider.id)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="policies" className="space-y-4">
          <div className="grid gap-4">
            {securityPolicies.map((policy) => (
              <Card key={policy.id} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        policy.enabled 
                          ? "bg-green-600/20 text-green-400" 
                          : "bg-gray-600/20 text-gray-400"
                      }`}>
                        <Lock className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium flex items-center">
                          {policy.name}
                          {policy.teamsExclusive && (
                            <Crown className="w-4 h-4 ml-2 text-yellow-400" />
                          )}
                        </h3>
                        <p className="text-sm text-slate-400">
                          {policy.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={`${getImpactColor(policy.impact)} border-0`}>
                        {policy.impact.toUpperCase()}
                      </Badge>
                      {policy.configurable && (
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      )}
                      <Switch
                        checked={policy.enabled}
                        onCheckedChange={() => togglePolicy(policy.id)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sso" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Building className="w-5 h-5 mr-2 text-purple-400" />
                Enterprise SSO Configuration
              </CardTitle>
              <p className="text-slate-400">
                Configure SAML 2.0 single sign-on for your organization
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {!ssoConfigured ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="idp-url" className="text-white">
                        Identity Provider URL
                      </Label>
                      <Input
                        id="idp-url"
                        placeholder="https://your-idp.com/saml"
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="entity-id" className="text-white">
                        Entity ID
                      </Label>
                      <Input
                        id="entity-id"
                        placeholder="guardianchain-teams"
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="certificate" className="text-white">
                      X.509 Certificate
                    </Label>
                    <textarea
                      id="certificate"
                      placeholder="-----BEGIN CERTIFICATE-----"
                      className="w-full h-32 bg-slate-700 border-slate-600 text-white rounded-md p-3 font-mono text-sm"
                    />
                  </div>

                  <Button onClick={configureSAMLSSO} className="w-full bg-purple-600 hover:bg-purple-700">
                    <Building className="w-4 h-4 mr-2" />
                    Configure SAML SSO
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                      <div>
                        <h3 className="text-white font-medium">SAML SSO Configured</h3>
                        <p className="text-green-300 text-sm">Successfully integrated with your identity provider</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-400 mb-1">789</div>
                      <div className="text-slate-300 text-sm">SSO Users</div>
                    </div>
                    <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                      <div className="text-2xl font-bold text-green-400 mb-1">99.9%</div>
                      <div className="text-slate-300 text-sm">Uptime</div>
                    </div>
                    <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-400 mb-1">2.3s</div>
                      <div className="text-slate-300 text-sm">Avg Login</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-green-400" />
                  Authentication Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Successful Logins</span>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-1" />
                      <span className="text-green-400">4,567</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Failed Attempts</span>
                    <div className="flex items-center">
                      <AlertTriangle className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-yellow-400">23</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Blocked Users</span>
                    <div className="flex items-center">
                      <Lock className="w-4 h-4 text-red-400 mr-1" />
                      <span className="text-red-400">2</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Active Sessions</span>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-blue-400 mr-1" />
                      <span className="text-blue-400">1,247</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-purple-400" />
                  Security Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="p-2 bg-green-900/20 border border-green-500/30 rounded">
                    <div className="text-green-400 font-medium">MFA Setup Complete</div>
                    <div className="text-green-300">User enabled biometric authentication</div>
                    <div className="text-green-500/70 text-xs">2 minutes ago</div>
                  </div>
                  <div className="p-2 bg-yellow-900/20 border border-yellow-500/30 rounded">
                    <div className="text-yellow-400 font-medium">Suspicious Login Detected</div>
                    <div className="text-yellow-300">New device login from unusual location</div>
                    <div className="text-yellow-500/70 text-xs">15 minutes ago</div>
                  </div>
                  <div className="p-2 bg-blue-900/20 border border-blue-500/30 rounded">
                    <div className="text-blue-400 font-medium">SSO Configuration Updated</div>
                    <div className="text-blue-300">SAML settings modified by admin</div>
                    <div className="text-blue-500/70 text-xs">1 hour ago</div>
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

export default TeamsAdvancedAuth;