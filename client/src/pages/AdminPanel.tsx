import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
// Table component not available, using div-based layout instead
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Users, Activity, Settings, Crown, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface AdminStats {
  totalUsers: number;
  totalCapsules: number;
  recentUsers: any[];
  usersByTier: any[];
}

interface User {
  id: string;
  email: string;
  tier: 'EXPLORER' | 'SEEKER' | 'CREATOR' | 'SOVEREIGN' | 'ADMIN';
  role: string;
  createdAt: string;
  lastLoginAt?: string;
  isActive: boolean;
}

export default function AdminPanel() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isAuthenticated && ((user as any)?.tier === 'ADMIN' || (user as any)?.tier === 'SOVEREIGN')) {
      fetchAdminData();
    } else {
      setError('Admin access required');
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      const [statsResponse, usersResponse] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/users')
      ]);

      if (!statsResponse.ok || !usersResponse.ok) {
        throw new Error('Failed to fetch admin data');
      }

      const statsData = await statsResponse.json();
      const usersData = await usersResponse.json();

      setStats(statsData);
      setUsers(usersData.users);
    } catch (error) {
      console.error('Admin data fetch error:', error);
      setError(error instanceof Error ? error.message : 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const updateUserTier = async (userId: string, newTier: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/tier`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tier: newTier }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update user tier');
      }

      const result = await response.json();
      
      toast({
        title: "Tier Updated",
        description: `User tier updated to ${newTier}`,
      });

      // Refresh user data
      fetchAdminData();
    } catch (error) {
      console.error('Update tier error:', error);
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : 'Failed to update user tier',
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>Please log in to access the admin panel.</AlertDescription>
        </Alert>
      </div>
    );
  }

  if ((user as any)?.tier !== 'ADMIN' && (user as any)?.tier !== 'SOVEREIGN') {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <Shield className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            Admin or Sovereign tier required. Current tier: {user?.tier || 'Unknown'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            Admin Panel
          </h1>
          <p className="text-muted-foreground">
            Manage users, monitor system health, and oversee platform operations
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <Crown className="h-3 w-3" />
          {user?.tier}
        </Badge>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Capsules</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCapsules}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Users</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.recentUsers.length}</div>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Healthy</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          {user?.tier === 'SOVEREIGN' && (
            <TabsTrigger value="system">System</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage user accounts, tiers, and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Input placeholder="Search users..." className="flex-1" />
                  <Select>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tiers</SelectItem>
                      <SelectItem value="EXPLORER">Explorer</SelectItem>
                      <SelectItem value="SEEKER">Seeker</SelectItem>
                      <SelectItem value="CREATOR">Creator</SelectItem>
                      <SelectItem value="SOVEREIGN">Sovereign</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="grid grid-cols-6 gap-4 p-3 bg-muted rounded-lg font-semibold text-sm">
                    <div>Email</div>
                    <div>Tier</div>
                    <div>Role</div>
                    <div>Status</div>
                    <div>Last Login</div>
                    <div>Actions</div>
                  </div>
                  {users.map((user) => (
                    <div key={user.id} className="grid grid-cols-6 gap-4 p-3 border rounded-lg">
                      <div className="text-sm">{user.email}</div>
                      <div>
                        <Badge variant={
                          user.tier === 'SOVEREIGN' ? 'default' :
                          user.tier === 'ADMIN' ? 'destructive' :
                          user.tier === 'CREATOR' ? 'secondary' :
                          'outline'
                        }>
                          {user.tier}
                        </Badge>
                      </div>
                      <div className="text-sm">{user.role}</div>
                      <div>
                        <Badge variant={user.isActive ? 'default' : 'secondary'}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="text-sm">
                        {user.lastLoginAt 
                          ? new Date(user.lastLoginAt).toLocaleDateString()
                          : 'Never'
                        }
                      </div>
                      <div>
                        <Select 
                          onValueChange={(newTier) => updateUserTier(user.id, newTier)}
                          defaultValue={user.tier}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="EXPLORER">Explorer</SelectItem>
                            <SelectItem value="SEEKER">Seeker</SelectItem>
                            <SelectItem value="CREATOR">Creator</SelectItem>
                            <SelectItem value="SOVEREIGN">Sovereign</SelectItem>
                            {user?.tier === 'SOVEREIGN' && (
                              <SelectItem value="ADMIN">Admin</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Platform Analytics</CardTitle>
              <CardDescription>
                Monitor platform usage and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.usersByTier && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Users by Tier</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {stats.usersByTier.map((tierData) => (
                        <Card key={tierData.tier}>
                          <CardContent className="p-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold">{tierData.count}</div>
                              <div className="text-sm text-muted-foreground">{tierData.tier}</div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Monitor security events and configure protection settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Security Status: Active</AlertTitle>
                  <AlertDescription>
                    Rate limiting, authentication middleware, and admin protection are active.
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Rate Limiting</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Login: 10 attempts/15min<br/>
                        API: 100 requests/min<br/>
                        Admin: 20 requests/5min<br/>
                        Mint: 5 attempts/10min
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Authentication</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        JWT tokens<br/>
                        Session management<br/>
                        Admin middleware<br/>
                        Tier verification
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {user?.tier === 'SOVEREIGN' && (
          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle>System Administration</CardTitle>
                <CardDescription>
                  System-level controls and monitoring (Sovereign only)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert>
                    <Crown className="h-4 w-4" />
                    <AlertTitle>Sovereign Access</AlertTitle>
                    <AlertDescription>
                      You have the highest level of system access. Use these controls carefully.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="flex gap-4">
                    <Button variant="outline">View System Logs</Button>
                    <Button variant="outline">Database Health</Button>
                    <Button variant="outline">Performance Metrics</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}