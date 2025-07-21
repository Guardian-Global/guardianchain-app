import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Shield, 
  Users, 
  Activity, 
  Database, 
  Settings, 
  UserPlus,
  Eye,
  EyeOff,
  Crown,
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react";

interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

interface AdminStats {
  totalCapsules: number;
  verifiedTruths: number;
  totalRewards: string;
  activeUsers: number;
  adminUsers: number;
  activeAdmins: number;
  lastActivity: string;
}

export default function AdminDashboard() {
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current admin user
  const { data: currentAdmin, isLoading: adminLoading } = useQuery({
    queryKey: ["/api/admin/me"],
    queryFn: async () => {
      const token = localStorage.getItem("admin_token");
      if (!token) throw new Error("No admin token");
      
      const response = await fetch("/api/admin/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error("Failed to fetch admin user");
      return response.json();
    },
  });

  // Get admin stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
    queryFn: async () => {
      const token = localStorage.getItem("admin_token");
      if (!token) throw new Error("No admin token");
      
      const response = await fetch("/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error("Failed to fetch stats");
      const result = await response.json();
      return result.stats as AdminStats;
    },
  });

  // Role hierarchy for permission checks
  const roleHierarchy = {
    USER: 0,
    MODERATOR: 1,
    ADMIN: 2,
    SUPER_ADMIN: 3,
    MASTER_ADMIN: 4
  };

  const hasPermission = (requiredRole: string) => {
    if (!currentAdmin?.roles) return false;
    const userMaxRole = Math.max(
      ...currentAdmin.roles.map(role => roleHierarchy[role as keyof typeof roleHierarchy] || 0)
    );
    return userMaxRole >= (roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0);
  };

  const getRoleColor = (roles: string[]) => {
    if (roles.includes('MASTER_ADMIN')) return 'bg-purple-600';
    if (roles.includes('SUPER_ADMIN')) return 'bg-red-600';
    if (roles.includes('ADMIN')) return 'bg-blue-600';
    if (roles.includes('MODERATOR')) return 'bg-green-600';
    return 'bg-gray-600';
  };

  const getHighestRole = (roles: string[]) => {
    const sortedRoles = roles.sort((a, b) => 
      (roleHierarchy[b as keyof typeof roleHierarchy] || 0) - 
      (roleHierarchy[a as keyof typeof roleHierarchy] || 0)
    );
    return sortedRoles[0] || 'USER';
  };

  if (adminLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-purple-400 mx-auto mb-4 animate-pulse" />
          <p className="text-slate-400">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!currentAdmin) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-slate-400 mb-4">Please log in to access the admin dashboard</p>
          <Button onClick={() => window.location.href = '/admin/login'}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
              GUARDIANCHAIN Admin Portal
            </h1>
            <p className="text-slate-400 mt-2">
              Welcome back, {currentAdmin.firstName} {currentAdmin.lastName}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className={`${getRoleColor(currentAdmin.roles)} text-white`}>
              <Crown className="h-3 w-3 mr-1" />
              {getHighestRole(currentAdmin.roles)}
            </Badge>
            <div className="text-right text-sm text-slate-400">
              <p>{currentAdmin.email}</p>
              <p>Last login: {currentAdmin.lastLoginAt ? new Date(currentAdmin.lastLoginAt).toLocaleDateString() : 'Never'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Total Capsules</CardTitle>
            <Database className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {statsLoading ? '...' : stats?.totalCapsules.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-slate-400">Truth capsules created</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Active Users</CardTitle>
            <Users className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {statsLoading ? '...' : stats?.activeUsers.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-slate-400">Registered users</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Verified Truths</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {statsLoading ? '...' : stats?.verifiedTruths.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-slate-400">Community verified</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Admin Users</CardTitle>
            <Shield className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">
              {statsLoading ? '...' : stats?.adminUsers.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-slate-400">Administrative accounts</p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Controls */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">
            <Activity className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          {hasPermission('ADMIN') && (
            <TabsTrigger value="users" className="data-[state=active]:bg-purple-600">
              <Users className="h-4 w-4 mr-2" />
              User Management
            </TabsTrigger>
          )}
          {hasPermission('MASTER_ADMIN') && (
            <TabsTrigger value="admins" className="data-[state=active]:bg-purple-600">
              <Shield className="h-4 w-4 mr-2" />
              Admin Management
            </TabsTrigger>
          )}
          <TabsTrigger value="settings" className="data-[state=active]:bg-purple-600">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">System Overview</CardTitle>
              <CardDescription className="text-slate-400">
                Real-time system health and activity monitoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">System Status</span>
                  <Badge className="bg-green-600 text-white">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Operational
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Database</span>
                  <Badge className="bg-green-600 text-white">Connected</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Authentication</span>
                  <Badge className="bg-green-600 text-white">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Last Activity</span>
                  <span className="text-slate-400">
                    {stats?.lastActivity ? new Date(stats.lastActivity).toLocaleString() : 'Unknown'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {hasPermission('ADMIN') && (
          <TabsContent value="users" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">User Management</CardTitle>
                <CardDescription className="text-slate-400">
                  Manage user accounts and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-400">User management interface coming soon</p>
                  <p className="text-sm text-slate-500 mt-2">
                    This will allow you to view, activate, and manage user accounts
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {hasPermission('MASTER_ADMIN') && (
          <TabsContent value="admins" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Admin Management</CardTitle>
                    <CardDescription className="text-slate-400">
                      Manage administrative users and roles
                    </CardDescription>
                  </div>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite Admin
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                  <p className="text-slate-400">Admin management interface coming soon</p>
                  <p className="text-sm text-slate-500 mt-2">
                    This will allow you to create, manage, and assign roles to admin users
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Admin Settings</CardTitle>
              <CardDescription className="text-slate-400">
                Configure admin account preferences and security
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Change Password</h4>
                    <p className="text-sm text-slate-400">Update your admin password</p>
                  </div>
                  <Button variant="outline" className="border-slate-600 text-slate-300">
                    Change Password
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-slate-400">Add extra security to your account</p>
                  </div>
                  <Button variant="outline" className="border-slate-600 text-slate-300">
                    Enable 2FA
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Session Management</h4>
                    <p className="text-sm text-slate-400">View and manage active sessions</p>
                  </div>
                  <Button variant="outline" className="border-slate-600 text-slate-300">
                    Manage Sessions
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}