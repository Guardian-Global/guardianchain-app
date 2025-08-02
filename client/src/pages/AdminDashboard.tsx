import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminConfigView from "@/components/admin/AdminConfigView";
import CapsuleAccessGuard from "@/components/auth/CapsuleAccessGuard";
import { 
  Settings, 
  Users, 
  Shield, 
  BarChart3, 
  Database,
  Activity
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <CapsuleAccessGuard requiredTier="admin">
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">
              Welcome back, {user?.firstName}. Manage GuardianChain platform settings and operations.
            </p>
          </div>

          <Tabs defaultValue="config" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 bg-slate-800/50">
              <TabsTrigger value="config" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Configuration
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="verification" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Verification
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="database" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Database
              </TabsTrigger>
              <TabsTrigger value="system" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                System
              </TabsTrigger>
            </TabsList>

            <TabsContent value="config" className="space-y-6">
              <AdminConfigView />
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-400">
                    User management features coming soon
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="verification" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Verification Queue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-400">
                    Verification management features coming soon
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Capsules</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">25,847</div>
                    <p className="text-xs text-green-400">+12% from last month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12,450</div>
                    <p className="text-xs text-green-400">+8% from last month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">GTT Distributed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$2.4M</div>
                    <p className="text-xs text-green-400">+15% from last month</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="database" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Database Operations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-400">
                    Database management features coming soon
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="system" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>API Server</span>
                      <span className="text-green-400">Online</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Database</span>
                      <span className="text-green-400">Connected</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Blockchain</span>
                      <span className="text-green-400">Synced</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>IPFS</span>
                      <span className="text-green-400">Online</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </CapsuleAccessGuard>
  );
}