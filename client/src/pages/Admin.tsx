import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import AdminModerationPanel from "@/components/AdminModerationPanel";
import { Shield, BarChart3, Settings, Users } from "lucide-react";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Monitor and manage GuardianChain platform operations
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="moderation" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Moderation
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            System
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,847</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Capsules
                </CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15,742</div>
                <p className="text-xs text-muted-foreground">
                  +8% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  GTT Distributed
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">84,521</div>
                <p className="text-xs text-muted-foreground">
                  +15% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  System Health
                </CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">99.8%</div>
                <p className="text-xs text-muted-foreground">
                  Uptime this month
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest platform activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">New capsule minted</p>
                      <p className="text-sm text-gray-500">
                        Guardian Capsule #15742
                      </p>
                    </div>
                    <span className="text-xs text-gray-400">2 min ago</span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">GTT yield distributed</p>
                      <p className="text-sm text-gray-500">
                        30 GTT to user_abc123
                      </p>
                    </div>
                    <span className="text-xs text-gray-400">5 min ago</span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">Content moderated</p>
                      <p className="text-sm text-gray-500">
                        Capsule approved for publication
                      </p>
                    </div>
                    <span className="text-xs text-gray-400">12 min ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Current system health metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database</span>
                    <span className="text-sm text-green-600 font-medium">
                      Online
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Web3 Provider</span>
                    <span className="text-sm text-green-600 font-medium">
                      Connected
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">IPFS Gateway</span>
                    <span className="text-sm text-green-600 font-medium">
                      Operational
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">AI Moderation</span>
                    <span className="text-sm text-green-600 font-medium">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Content Delivery</span>
                    <span className="text-sm text-green-600 font-medium">
                      Optimized
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="moderation" className="space-y-6">
          <AdminModerationPanel />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <AnalyticsDashboard />
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>
                Platform settings and configuration options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Smart Contract Addresses</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>GTT Yield Vault:</span>
                      <code className="bg-gray-100 px-2 py-1 rounded">
                        0x0000...0000
                      </code>
                    </div>
                    <div className="flex justify-between">
                      <span>Capsule NFT:</span>
                      <code className="bg-gray-100 px-2 py-1 rounded">
                        0x0000...0000
                      </code>
                    </div>
                    <div className="flex justify-between">
                      <span>GTT Token:</span>
                      <code className="bg-gray-100 px-2 py-1 rounded">
                        0x0000...0000
                      </code>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Network Configuration</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Network:</span>
                      <span>Polygon (Chain ID: 137)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>RPC Endpoint:</span>
                      <span>https://polygon-rpc.com</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Explorer:</span>
                      <span>https://polygonscan.com</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Feature Flags</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>NFT Minting:</span>
                      <span className="text-green-600">Enabled</span>
                    </div>
                    <div className="flex justify-between">
                      <span>AI Moderation:</span>
                      <span className="text-green-600">Enabled</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Yield Distribution:</span>
                      <span className="text-green-600">Enabled</span>
                    </div>
                    <div className="flex justify-between">
                      <span>IPFS Storage:</span>
                      <span className="text-green-600">Enabled</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
