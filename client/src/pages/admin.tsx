// client/src/pages/admin.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserTier } from '@/hooks/useUserTier';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  Users, 
  FileText, 
  Coins, 
  Activity, 
  AlertTriangle,
  Eye,
  Lock,
  Unlock,
  TrendingUp,
  Database
} from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  totalCapsules: number;
  totalUnlocks: number;
  totalRevenue: number;
  recentActivity: ActivityItem[];
  topCapsules: CapsuleStats[];
  userTierDistribution: TierStats[];
}

interface ActivityItem {
  id: string;
  type: 'capsule_created' | 'capsule_unlocked' | 'user_registered' | 'capsule_minted';
  user: string;
  details: string;
  timestamp: string;
}

interface CapsuleStats {
  id: string;
  title: string;
  creator: string;
  unlocks: number;
  revenue: number;
  grief_score: number;
}

interface TierStats {
  tier: string;
  count: number;
  percentage: number;
}

const AdminPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { tier } = useUserTier();
  const { toast } = useToast();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchUser, setSearchUser] = useState('');
  const [impersonateEmail, setImpersonateEmail] = useState('');

  // Check if user has admin access
  const hasAdminAccess = tier === 'GUARDIAN' || tier === 'TITAN';

  useEffect(() => {
    if (!isAuthenticated || !hasAdminAccess) {
      return;
    }

    fetchAdminStats();
  }, [isAuthenticated, hasAdminAccess]);

  const fetchAdminStats = async () => {
    try {
      const response = await fetch('/api/admin/stats', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch admin stats');
      }

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      toast({
        title: "Failed to load admin data",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImpersonate = async () => {
    if (!impersonateEmail.trim()) {
      toast({
        title: "Email required",
        description: "Please enter a user email to impersonate",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/admin/impersonate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email: impersonateEmail }),
      });

      if (!response.ok) {
        throw new Error('Impersonation failed');
      }

      toast({
        title: "Impersonation started",
        description: `Now viewing as ${impersonateEmail}`,
      });

      // Reload page to reflect impersonation
      window.location.reload();
    } catch (error) {
      toast({
        title: "Impersonation failed",
        description: "Please check the email and try again",
        variant: "destructive",
      });
    }
  };

  const stopImpersonation = async () => {
    try {
      await fetch('/api/admin/stop-impersonate', {
        method: 'POST',
        credentials: 'include',
      });

      toast({
        title: "Impersonation stopped",
        description: "Returned to your admin account",
      });

      window.location.reload();
    } catch (error) {
      toast({
        title: "Error stopping impersonation",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <Lock className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium">Authentication Required</h3>
            <p className="text-gray-500">Please log in to access the admin panel</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!hasAdminAccess) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
            <h3 className="mt-2 text-lg font-medium">Access Denied</h3>
            <p className="text-gray-500">
              Admin access requires GUARDIAN or TITAN tier membership
            </p>
            <Badge variant="outline" className="mt-2">
              Current Tier: {tier}
            </Badge>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading admin dashboard...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-6 w-6" />
              Admin Dashboard
            </CardTitle>
            <CardDescription>
              System oversight and user management for GuardianChain
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                    <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Capsules</p>
                    <p className="text-2xl font-bold">{stats.totalCapsules.toLocaleString()}</p>
                  </div>
                  <FileText className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Unlocks</p>
                    <p className="text-2xl font-bold">{stats.totalUnlocks.toLocaleString()}</p>
                  </div>
                  <Unlock className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenue</p>
                    <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
                  </div>
                  <Coins className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <Tabs defaultValue="activity" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="capsules">Top Capsules</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent System Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats?.recentActivity?.length ? (
                  <div className="space-y-3">
                    {stats.recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {activity.type === 'capsule_created' && <FileText className="h-4 w-4 text-green-500" />}
                          {activity.type === 'capsule_unlocked' && <Unlock className="h-4 w-4 text-orange-500" />}
                          {activity.type === 'user_registered' && <Users className="h-4 w-4 text-blue-500" />}
                          {activity.type === 'capsule_minted' && <Coins className="h-4 w-4 text-purple-500" />}
                          
                          <div>
                            <p className="font-medium">{activity.details}</p>
                            <p className="text-sm text-gray-500">by {activity.user}</p>
                          </div>
                        </div>
                        
                        <span className="text-sm text-gray-500">
                          {new Date(activity.timestamp).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">No recent activity</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="capsules" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Top Performing Capsules
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats?.topCapsules?.length ? (
                  <div className="space-y-3">
                    {stats.topCapsules.map((capsule) => (
                      <div key={capsule.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{capsule.title}</h4>
                          <p className="text-sm text-gray-500">by {capsule.creator}</p>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm">
                          <div className="text-center">
                            <p className="font-medium">{capsule.unlocks}</p>
                            <p className="text-gray-500">Unlocks</p>
                          </div>
                          <div className="text-center">
                            <p className="font-medium">${capsule.revenue}</p>
                            <p className="text-gray-500">Revenue</p>
                          </div>
                          <Badge variant="outline">
                            Grief: {capsule.grief_score}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">No capsule data available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* User Search */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Search users by email..."
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                    data-testid="input-search-user"
                  />
                  <Button variant="outline" data-testid="button-search-user">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>

                {/* User Impersonation */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">User Impersonation</h4>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter user email to impersonate..."
                      value={impersonateEmail}
                      onChange={(e) => setImpersonateEmail(e.target.value)}
                      data-testid="input-impersonate-email"
                    />
                    <Button onClick={handleImpersonate} data-testid="button-impersonate">
                      Impersonate
                    </Button>
                    <Button variant="outline" onClick={stopImpersonation} data-testid="button-stop-impersonate">
                      Stop
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Allows viewing the platform from another user's perspective
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  User Tier Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats?.userTierDistribution?.length ? (
                  <div className="space-y-3">
                    {stats.userTierDistribution.map((tierStat) => (
                      <div key={tierStat.tier} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{tierStat.tier}</Badge>
                          <span className="font-medium">{tierStat.count} users</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {tierStat.percentage.toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">No tier distribution data</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;