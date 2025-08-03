import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, Crown, Zap, Users, BarChart3, Globe,
  Brain, Lock, TrendingUp, Star, Award, Rocket,
  Database, Cloud, Settings, FileText, Eye,
  Target, Layers, Code, Workflow, Bot
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface EnterpriseMetrics {
  totalUsers: number;
  activeUsers: number;
  totalTransactions: number;
  networkUptime: number;
  securityScore: number;
  complianceStatus: string;
  aiAccuracy: number;
  blockchainSynced: boolean;
}

export default function EnterpriseFeatures() {
  const [selectedView, setSelectedView] = useState("overview");

  const { data: metrics, isLoading } = useQuery<EnterpriseMetrics>({
    queryKey: ["/api/enterprise/metrics"],
  });

  if (isLoading || !metrics) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Enterprise Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Enterprise Command Center
          </h1>
          <p className="text-muted-foreground mt-1">
            Advanced sovereign infrastructure management and analytics
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
            System Healthy
          </Badge>
          <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
            Enterprise Tier
          </Badge>
        </div>
      </div>

      {/* Key Enterprise Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-pink-500/5">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-600/10"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-3xl font-bold text-purple-400">{metrics.totalUsers.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-500">+24.3%</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-blue-500/5">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-600/10"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Network Uptime</p>
                <p className="text-3xl font-bold text-cyan-400">{metrics.networkUptime}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <Shield className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-500">Enterprise SLA</span>
                </div>
              </div>
              <Globe className="h-8 w-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-green-500/20 bg-gradient-to-br from-green-500/5 to-emerald-500/5">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-600/10"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">AI Accuracy</p>
                <p className="text-3xl font-bold text-green-400">{metrics.aiAccuracy}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <Brain className="h-3 w-3 text-blue-500" />
                  <span className="text-xs text-blue-500">GPT-4o Enhanced</span>
                </div>
              </div>
              <Bot className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-red-500/5">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-600/10"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Security Score</p>
                <p className="text-3xl font-bold text-orange-400">{metrics.securityScore}/100</p>
                <div className="flex items-center gap-1 mt-1">
                  <Lock className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-500">SOC 2 Compliant</span>
                </div>
              </div>
              <Shield className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enterprise Feature Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            Enterprise Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="infrastructure" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
              <TabsTrigger value="ai">AI Systems</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
              <TabsTrigger value="apis">Developer APIs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="infrastructure" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Cloud className="h-6 w-6 text-blue-400" />
                    <h4 className="font-medium">Cloud Infrastructure</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Multi-region deployment</span>
                      <Badge variant="secondary" className="text-xs">Active</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Auto-scaling enabled</span>
                      <Badge variant="secondary" className="text-xs">99.99%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Load balancing</span>
                      <Badge variant="secondary" className="text-xs">Optimized</Badge>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Database className="h-6 w-6 text-green-400" />
                    <h4 className="font-medium">Data Management</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Real-time sync</span>
                      <Badge variant="secondary" className="text-xs">Active</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Backup frequency</span>
                      <Badge variant="secondary" className="text-xs">Every 5min</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Data retention</span>
                      <Badge variant="secondary" className="text-xs">Unlimited</Badge>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Workflow className="h-6 w-6 text-purple-400" />
                    <h4 className="font-medium">Process Automation</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Truth verification</span>
                      <Badge variant="secondary" className="text-xs">Automated</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Yield distribution</span>
                      <Badge variant="secondary" className="text-xs">Real-time</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Compliance checks</span>
                      <Badge variant="secondary" className="text-xs">Continuous</Badge>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="ai" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="p-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Brain className="h-4 w-4 text-blue-400" />
                    AI Truth Analysis Engine
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">GPT-4o Integration</span>
                      <Badge variant="secondary" className="bg-green-500/10 text-green-400">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Emotion Detection</span>
                      <Badge variant="secondary">98.7% Accuracy</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Truth Genome Analysis</span>
                      <Badge variant="secondary">Advanced</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Content Moderation</span>
                      <Badge variant="secondary">Real-time</Badge>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4 text-green-400" />
                    Predictive Analytics
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Viral Content Prediction</span>
                      <Badge variant="secondary">85% Accuracy</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Yield Optimization</span>
                      <Badge variant="secondary" className="bg-blue-500/10 text-blue-400">AI-Powered</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Risk Assessment</span>
                      <Badge variant="secondary">Continuous</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Market Analysis</span>
                      <Badge variant="secondary">Real-time</Badge>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="security" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="p-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Lock className="h-4 w-4 text-red-400" />
                    Encryption & Privacy
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="p-2 bg-green-500/10 rounded border border-green-500/20">
                      <p className="text-green-400 font-medium">AES-256 Encryption</p>
                      <p className="text-xs text-muted-foreground">End-to-end encryption enabled</p>
                    </div>
                    <div className="p-2 bg-blue-500/10 rounded border border-blue-500/20">
                      <p className="text-blue-400 font-medium">Lit Protocol Integration</p>
                      <p className="text-xs text-muted-foreground">Decentralized key management</p>
                    </div>
                    <div className="p-2 bg-purple-500/10 rounded border border-purple-500/20">
                      <p className="text-purple-400 font-medium">Zero-Knowledge Proofs</p>
                      <p className="text-xs text-muted-foreground">Privacy-preserving verification</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Eye className="h-4 w-4 text-yellow-400" />
                    Monitoring & Alerts
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Threat Detection</span>
                      <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-400">
                        No Threats
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Access Logs</span>
                      <Badge variant="secondary" className="text-xs">Real-time</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Anomaly Detection</span>
                      <Badge variant="secondary" className="text-xs">AI-Powered</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Incident Response</span>
                      <Badge variant="secondary" className="text-xs">&lt; 1 min</Badge>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Award className="h-4 w-4 text-green-400" />
                    Certifications
                  </h4>
                  <div className="space-y-2">
                    {['SOC 2 Type II', 'ISO 27001', 'GDPR Compliant', 'CCPA Compliant'].map((cert) => (
                      <div key={cert} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                        <span className="text-sm">{cert}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="compliance" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="p-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-400" />
                    Regulatory Compliance
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-green-500/10 rounded border border-green-500/20">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-green-400">GDPR Compliance</span>
                        <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400">
                          100% Compliant
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Data processing, consent management, and right to erasure fully implemented
                      </p>
                    </div>
                    <div className="p-3 bg-blue-500/10 rounded border border-blue-500/20">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-blue-400">SEC Compliance</span>
                        <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-400">
                          Enterprise Ready
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Financial reporting and token compliance frameworks active
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Settings className="h-4 w-4 text-purple-400" />
                    Audit Trail
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Transaction Logging</span>
                      <Badge variant="secondary" className="text-xs">Immutable</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>User Activity</span>
                      <Badge variant="secondary" className="text-xs">Complete</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Data Access</span>
                      <Badge variant="secondary" className="text-xs">Tracked</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>System Changes</span>
                      <Badge variant="secondary" className="text-xs">Versioned</Badge>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="apis" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="p-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Code className="h-4 w-4 text-cyan-400" />
                    Developer API Suite
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-cyan-500/10 rounded border border-cyan-500/20">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-cyan-400">Truth API</span>
                        <Badge variant="secondary" className="text-xs">v2.1</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Create, verify, and manage truth capsules programmatically
                      </p>
                    </div>
                    <div className="p-3 bg-green-500/10 rounded border border-green-500/20">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-green-400">Analytics API</span>
                        <Badge variant="secondary" className="text-xs">v1.8</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Access comprehensive analytics and insights data
                      </p>
                    </div>
                    <div className="p-3 bg-purple-500/10 rounded border border-purple-500/20">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-purple-400">Blockchain API</span>
                        <Badge variant="secondary" className="text-xs">v3.0</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Multi-chain transaction and smart contract interactions
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Layers className="h-4 w-4 text-yellow-400" />
                    API Usage & Limits
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Monthly Calls</span>
                      <Badge variant="secondary">100K / 100K</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Rate Limit</span>
                      <Badge variant="secondary">1000/min</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Response Time</span>
                      <Badge variant="secondary" className="bg-green-500/10 text-green-400">
                        &lt;45ms avg
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Uptime SLA</span>
                      <Badge variant="secondary" className="bg-blue-500/10 text-blue-400">
                        99.99%
                      </Badge>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Enterprise Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Enterprise Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-4">
            <Button className="h-auto p-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <div className="text-center">
                <Rocket className="h-6 w-6 mx-auto mb-2" />
                <p className="text-sm">Deploy Infrastructure</p>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4">
              <div className="text-center">
                <Settings className="h-6 w-6 mx-auto mb-2" />
                <p className="text-sm">System Configuration</p>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4">
              <div className="text-center">
                <BarChart3 className="h-6 w-6 mx-auto mb-2" />
                <p className="text-sm">Advanced Analytics</p>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4">
              <div className="text-center">
                <Users className="h-6 w-6 mx-auto mb-2" />
                <p className="text-sm">User Management</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}