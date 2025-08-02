import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Users, 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  Eye,
  Ban,
  Crown,
  DollarSign,
  Activity,
  TrendingUp,
  Database,
  Server,
  Wifi,
  Lock,
  UserCheck,
  FileText,
  Clock,
  Search,
  Filter,
  Download,
  RefreshCw,
  Settings,
  Bell
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface ModerationItem {
  id: string;
  type: 'capsule' | 'user' | 'comment';
  title: string;
  author: string;
  flagReason: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'approved' | 'rejected';
  reportedAt: string;
  reportedBy: string;
  content?: string;
}

interface UserManagement {
  id: string;
  username: string;
  email: string;
  tier: 'EXPLORER' | 'SEEKER' | 'CREATOR' | 'SOVEREIGN';
  status: 'active' | 'suspended' | 'banned';
  joinDate: string;
  lastActive: string;
  capsuleCount: number;
  truthScore: number;
  violations: number;
}

interface PlatformHealth {
  serverStatus: 'healthy' | 'warning' | 'critical';
  uptime: number;
  activeUsers: number;
  totalRequests: number;
  errorRate: number;
  responseTime: number;
  databaseHealth: 'good' | 'slow' | 'error';
  diskUsage: number;
  memoryUsage: number;
  cpuUsage: number;
}

interface FinancialMetrics {
  dailyRevenue: number;
  monthlyRevenue: number;
  subscriptionRevenue: number;
  transactionFees: number;
  gttYieldDistributed: number;
  activePaidUsers: number;
  churnRate: number;
  ltv: number;
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'moderation' | 'users' | 'health' | 'finance'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const { data: moderationQueue, isLoading: moderationLoading } = useQuery<ModerationItem[]>({
    queryKey: ['/api/admin/moderation-queue'],
    refetchInterval: 30000,
  });

  const { data: userManagement, isLoading: usersLoading } = useQuery<UserManagement[]>({
    queryKey: ['/api/admin/users'],
  });

  const { data: platformHealth, isLoading: healthLoading } = useQuery<PlatformHealth>({
    queryKey: ['/api/admin/platform-health'],
    refetchInterval: 10000,
  });

  const { data: financialMetrics, isLoading: financeLoading } = useQuery<FinancialMetrics>({
    queryKey: ['/api/admin/financial-metrics'],
  });

  // Mock data for demonstration
  const mockModerationQueue: ModerationItem[] = [
    {
      id: '1',
      type: 'capsule',
      title: 'Controversial Political Statement',
      author: 'user123',
      flagReason: 'Hate speech',
      severity: 'high',
      status: 'pending',
      reportedAt: '2025-08-02T10:30:00Z',
      reportedBy: 'moderator1',
      content: 'Content that may violate community guidelines...'
    },
    {
      id: '2',
      type: 'user',
      title: 'Spam Account Activity',
      author: 'spammer456',
      flagReason: 'Automated behavior',
      severity: 'medium',
      status: 'pending',
      reportedAt: '2025-08-02T09:15:00Z',
      reportedBy: 'system'
    }
  ];

  const mockUserManagement: UserManagement[] = [
    {
      id: '1',
      username: 'truthkeeper',
      email: 'user@example.com',
      tier: 'CREATOR',
      status: 'active',
      joinDate: '2025-06-15',
      lastActive: '2025-08-02T08:30:00Z',
      capsuleCount: 45,
      truthScore: 892,
      violations: 0
    },
    {
      id: '2',
      username: 'questioner',
      email: 'questioner@example.com',
      tier: 'SEEKER',
      status: 'suspended',
      joinDate: '2025-07-01',
      lastActive: '2025-08-01T15:20:00Z',
      capsuleCount: 12,
      truthScore: 234,
      violations: 2
    }
  ];

  const mockPlatformHealth: PlatformHealth = {
    serverStatus: 'healthy',
    uptime: 99.8,
    activeUsers: 1247,
    totalRequests: 45678,
    errorRate: 0.2,
    responseTime: 145,
    databaseHealth: 'good',
    diskUsage: 65,
    memoryUsage: 72,
    cpuUsage: 28
  };

  const mockFinancialMetrics: FinancialMetrics = {
    dailyRevenue: 5670,
    monthlyRevenue: 156780,
    subscriptionRevenue: 134560,
    transactionFees: 22220,
    gttYieldDistributed: 89450,
    activePaidUsers: 3456,
    churnRate: 2.8,
    ltv: 450
  };

  const displayModerationQueue = moderationQueue || mockModerationQueue;
  const displayUserManagement = userManagement || mockUserManagement;
  const displayPlatformHealth = platformHealth || mockPlatformHealth;
  const displayFinancialMetrics = financialMetrics || mockFinancialMetrics;

  const moderationMutation = useMutation({
    mutationFn: async ({ itemId, action }: { itemId: string; action: 'approve' | 'reject' }) => {
      return apiRequest('POST', `/api/admin/moderate/${itemId}`, { action });
    },
    onSuccess: (_, { action }) => {
      toast({
        title: 'Action Completed',
        description: `Item has been ${action}d successfully.`,
      });
    }
  });

  const userActionMutation = useMutation({
    mutationFn: async ({ userId, action }: { userId: string; action: 'suspend' | 'ban' | 'activate' }) => {
      return apiRequest('POST', `/api/admin/users/${userId}`, { action });
    },
    onSuccess: (_, { action }) => {
      toast({
        title: 'User Action Completed',
        description: `User has been ${action}d successfully.`,
      });
    }
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': case 'healthy': case 'approved': return 'bg-green-100 text-green-800';
      case 'suspended': case 'warning': case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'banned': case 'critical': case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center mb-2">
              <Shield className="w-8 h-8 text-red-500 mr-3" />
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Platform management, moderation tools, and system monitoring
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white dark:bg-gray-800 rounded-lg p-1">
          {[
            { key: 'overview', label: 'Overview', icon: Activity },
            { key: 'moderation', label: 'Moderation', icon: Shield },
            { key: 'users', label: 'Users', icon: Users },
            { key: 'health', label: 'System Health', icon: Server },
            { key: 'finance', label: 'Finance', icon: DollarSign }
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant={activeTab === key ? 'default' : 'ghost'}
              onClick={() => setActiveTab(key as any)}
              className="flex-1"
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </Button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Pending Moderation</p>
                      <p className="text-2xl font-bold text-red-600">
                        {displayModerationQueue.filter(item => item.status === 'pending').length}
                      </p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
                      <p className="text-2xl font-bold">{formatNumber(displayPlatformHealth.activeUsers)}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">System Uptime</p>
                      <p className="text-2xl font-bold text-green-600">
                        {displayPlatformHealth.uptime}%
                      </p>
                    </div>
                    <Server className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Daily Revenue</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {formatCurrency(displayFinancialMetrics.dailyRevenue)}
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="w-5 h-5 mr-2" />
                    Recent Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { type: 'warning', message: 'High CPU usage detected', time: '5 minutes ago' },
                      { type: 'info', message: 'Database backup completed', time: '1 hour ago' },
                      { type: 'error', message: 'Failed login attempts spike', time: '2 hours ago' }
                    ].map((alert, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className={`p-1 rounded-full ${
                          alert.type === 'error' ? 'bg-red-100 text-red-600' :
                          alert.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{alert.message}</p>
                          <p className="text-xs text-gray-500">{alert.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Platform Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>User Growth</span>
                        <span className="text-green-600">+12.5%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Content Creation</span>
                        <span className="text-green-600">+8.3%</span>
                      </div>
                      <Progress value={68} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Revenue Growth</span>
                        <span className="text-green-600">+15.7%</span>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Moderation Tab */}
        {activeTab === 'moderation' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Content Moderation Queue</h2>
              <div className="flex items-center space-x-4">
                <Input
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-800"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {displayModerationQueue.map((item) => (
                <Card key={item.id} className="border-l-4 border-l-orange-400">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge variant="outline">
                            {item.type.toUpperCase()}
                          </Badge>
                          <Badge className={getSeverityColor(item.severity)}>
                            {item.severity.toUpperCase()}
                          </Badge>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status.toUpperCase()}
                          </Badge>
                        </div>
                        
                        <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                          <div>
                            <span className="font-medium">Author:</span> {item.author}
                          </div>
                          <div>
                            <span className="font-medium">Reported by:</span> {item.reportedBy}
                          </div>
                          <div>
                            <span className="font-medium">Reason:</span> {item.flagReason}
                          </div>
                          <div>
                            <span className="font-medium">Reported:</span> {new Date(item.reportedAt).toLocaleString()}
                          </div>
                        </div>

                        {item.content && (
                          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-4">
                            <p className="text-sm">{item.content}</p>
                          </div>
                        )}
                      </div>

                      {item.status === 'pending' && (
                        <div className="flex space-x-2 ml-4">
                          <Button
                            size="sm"
                            onClick={() => moderationMutation.mutate({ itemId: item.id, action: 'approve' })}
                            disabled={moderationMutation.isPending}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => moderationMutation.mutate({ itemId: item.id, action: 'reject' })}
                            disabled={moderationMutation.isPending}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Review
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">User Management</h2>
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3">User</th>
                        <th className="text-left py-3">Tier</th>
                        <th className="text-left py-3">Status</th>
                        <th className="text-left py-3">Truth Score</th>
                        <th className="text-left py-3">Violations</th>
                        <th className="text-left py-3">Last Active</th>
                        <th className="text-left py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayUserManagement.map((user) => (
                        <tr key={user.id} className="border-b">
                          <td className="py-4">
                            <div>
                              <div className="font-medium">{user.username}</div>
                              <div className="text-sm text-gray-600">{user.email}</div>
                            </div>
                          </td>
                          <td className="py-4">
                            <Badge variant="outline">{user.tier}</Badge>
                          </td>
                          <td className="py-4">
                            <Badge className={getStatusColor(user.status)}>
                              {user.status.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="py-4">
                            <span className="font-medium">{user.truthScore}</span>
                          </td>
                          <td className="py-4">
                            <span className={user.violations > 0 ? 'text-red-600' : 'text-green-600'}>
                              {user.violations}
                            </span>
                          </td>
                          <td className="py-4">
                            <span className="text-sm">
                              {new Date(user.lastActive).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="py-4">
                            <div className="flex space-x-2">
                              {user.status === 'active' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => userActionMutation.mutate({ userId: user.id, action: 'suspend' })}
                                >
                                  <Ban className="w-4 h-4" />
                                </Button>
                              )}
                              {user.status === 'suspended' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => userActionMutation.mutate({ userId: user.id, action: 'activate' })}
                                >
                                  <UserCheck className="w-4 h-4" />
                                </Button>
                              )}
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* System Health Tab */}
        {activeTab === 'health' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">System Health Monitoring</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Server className="w-5 h-5 mr-2" />
                    Server Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Status</span>
                      <Badge className={getStatusColor(displayPlatformHealth.serverStatus)}>
                        {displayPlatformHealth.serverStatus.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Uptime</span>
                      <span className="font-medium">{displayPlatformHealth.uptime}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Response Time</span>
                      <span className="font-medium">{displayPlatformHealth.responseTime}ms</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Error Rate</span>
                      <span className="font-medium">{displayPlatformHealth.errorRate}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="w-5 h-5 mr-2" />
                    Database Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Status</span>
                      <Badge className={getStatusColor(displayPlatformHealth.databaseHealth)}>
                        {displayPlatformHealth.databaseHealth.toUpperCase()}
                      </Badge>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Disk Usage</span>
                        <span>{displayPlatformHealth.diskUsage}%</span>
                      </div>
                      <Progress value={displayPlatformHealth.diskUsage} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Memory Usage</span>
                        <span>{displayPlatformHealth.memoryUsage}%</span>
                      </div>
                      <Progress value={displayPlatformHealth.memoryUsage} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>CPU Usage</span>
                        <span>{displayPlatformHealth.cpuUsage}%</span>
                      </div>
                      <Progress value={displayPlatformHealth.cpuUsage} className="h-2" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Active Users</span>
                      <span className="font-medium">{formatNumber(displayPlatformHealth.activeUsers)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Total Requests</span>
                      <span className="font-medium">{formatNumber(displayPlatformHealth.totalRequests)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Finance Tab */}
        {activeTab === 'finance' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Financial Metrics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Daily Revenue</p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(displayFinancialMetrics.dailyRevenue)}
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Revenue</p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(displayFinancialMetrics.monthlyRevenue)}
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Active Paid Users</p>
                      <p className="text-2xl font-bold">
                        {formatNumber(displayFinancialMetrics.activePaidUsers)}
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Customer LTV</p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(displayFinancialMetrics.ltv)}
                      </p>
                    </div>
                    <Crown className="w-8 h-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Subscription Revenue</span>
                      <span className="font-medium">
                        {formatCurrency(displayFinancialMetrics.subscriptionRevenue)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Transaction Fees</span>
                      <span className="font-medium">
                        {formatCurrency(displayFinancialMetrics.transactionFees)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>GTT Yield Distributed</span>
                      <span className="font-medium">
                        {formatCurrency(displayFinancialMetrics.gttYieldDistributed)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Key Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Churn Rate</span>
                        <span className="text-red-600">{displayFinancialMetrics.churnRate}%</span>
                      </div>
                      <Progress value={displayFinancialMetrics.churnRate} className="h-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-3 bg-green-50 dark:bg-green-900 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">↑ 15%</div>
                        <div className="text-sm">Revenue Growth</div>
                      </div>
                      <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">↑ 8%</div>
                        <div className="text-sm">User Growth</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}