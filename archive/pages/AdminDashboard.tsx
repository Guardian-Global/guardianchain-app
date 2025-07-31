import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Shield,
  Users,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  Trash2,
  Award,
  Settings,
  Activity,
  TrendingUp,
  Flag,
  Crown,
  Coins,
  FileText,
  Ban,
  Star,
} from "lucide-react";

interface AdminStats {
  totalCapsules: number;
  pendingCapsules: number;
  flaggedContent: number;
  totalUsers: number;
  activeUsers: number;
  gttDistributed: string;
  systemHealth: number;
}

interface CapsuleModerationItem {
  id: string;
  title: string;
  creator: string;
  content: string;
  status: "pending" | "approved" | "flagged" | "rejected";
  reportCount: number;
  createdAt: string;
  yieldAmount: string;
}

interface UserModerationItem {
  id: string;
  email: string;
  name: string;
  tier: string;
  reputation: number;
  capsulesCreated: number;
  flaggedContent: number;
  status: "active" | "warned" | "suspended" | "banned";
  joinedAt: string;
}

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCapsule, setSelectedCapsule] = useState<string>("");
  const [awardAmount, setAwardAmount] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  // Admin stats query
  const { data: stats, isLoading: statsLoading } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
    enabled: isAuthenticated,
  });

  // Pending capsules for moderation
  const { data: pendingCapsules = [], isLoading: capsulesLoading } = useQuery<
    CapsuleModerationItem[]
  >({
    queryKey: ["/api/admin/capsules/pending"],
    enabled: isAuthenticated,
  });

  // Flagged content
  const { data: flaggedContent = [], isLoading: flaggedLoading } = useQuery<
    CapsuleModerationItem[]
  >({
    queryKey: ["/api/admin/capsules/flagged"],
    enabled: isAuthenticated,
  });

  // User management
  const { data: users = [], isLoading: usersLoading } = useQuery<
    UserModerationItem[]
  >({
    queryKey: ["/api/admin/users"],
    enabled: isAuthenticated,
  });

  // Capsule moderation mutations
  const approveCapsuleMutation = useMutation({
    mutationFn: async (data: {
      capsuleId: string;
      yieldAmount?: string;
      notes?: string;
    }) => {
      return apiRequest("POST", "/api/admin/capsules/approve", data);
    },
    onSuccess: () => {
      toast({ title: "Capsule approved successfully" });
      queryClient.invalidateQueries({
        queryKey: ["/api/admin/capsules/pending"],
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error approving capsule",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const rejectCapsuleMutation = useMutation({
    mutationFn: async (data: { capsuleId: string; reason: string }) => {
      return apiRequest("POST", "/api/admin/capsules/reject", data);
    },
    onSuccess: () => {
      toast({ title: "Capsule rejected" });
      queryClient.invalidateQueries({
        queryKey: ["/api/admin/capsules/pending"],
      });
    },
  });

  const featureCapsuleMutation = useMutation({
    mutationFn: async (data: { capsuleId: string; featured: boolean }) => {
      return apiRequest("POST", "/api/admin/capsules/feature", data);
    },
    onSuccess: (_, variables) => {
      toast({
        title: variables.featured ? "Capsule featured" : "Capsule unfeatured",
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/admin/capsules/pending"],
      });
    },
  });

  const awardGTTMutation = useMutation({
    mutationFn: async (data: {
      capsuleId: string;
      amount: string;
      notes: string;
    }) => {
      return apiRequest("POST", "/api/admin/capsules/award-gtt", data);
    },
    onSuccess: () => {
      toast({ title: "GTT awarded successfully" });
      setAwardAmount("");
      setAdminNotes("");
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
    },
  });

  // User moderation mutations
  const moderateUserMutation = useMutation({
    mutationFn: async (data: {
      userId: string;
      action: string;
      reason?: string;
    }) => {
      return apiRequest("POST", "/api/admin/users/moderate", data);
    },
    onSuccess: (_, variables) => {
      toast({ title: `User ${variables.action} successfully` });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
  });

  const handleApproveCapsule = (capsuleId: string) => {
    approveCapsuleMutation.mutate({
      capsuleId,
      yieldAmount: awardAmount || undefined,
      notes: adminNotes || undefined,
    });
  };

  const handleRejectCapsule = (capsuleId: string, reason: string) => {
    rejectCapsuleMutation.mutate({ capsuleId, reason });
  };

  const handleFeatureCapsule = (capsuleId: string, featured: boolean) => {
    featureCapsuleMutation.mutate({ capsuleId, featured });
  };

  const handleAwardGTT = (capsuleId: string) => {
    if (!awardAmount || parseFloat(awardAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid GTT amount",
        variant: "destructive",
      });
      return;
    }

    awardGTTMutation.mutate({
      capsuleId,
      amount: awardAmount,
      notes: adminNotes,
    });
  };

  const handleModerateUser = (
    userId: string,
    action: string,
    reason?: string
  ) => {
    moderateUserMutation.mutate({ userId, action, reason });
  };

  // Check if user is admin
  if (!isAuthenticated || user?.email !== process.env.VITE_MASTER_ADMIN_EMAIL) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Shield className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
              <p className="text-muted-foreground">
                Administrative access required
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-purple-600" />
            Admin Command Center
          </h1>
          <p className="text-muted-foreground">
            GUARDIANCHAIN Protocol Management
          </p>
        </div>
        <Badge
          variant="outline"
          className="bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
        >
          Master Admin
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {stats?.totalCapsules || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Capsules
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {stats?.pendingCapsules || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  Pending Review
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {stats?.activeUsers || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  Active Users
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Coins className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {parseFloat(stats?.gttDistributed || "0").toFixed(0)}
                </div>
                <div className="text-sm text-muted-foreground">
                  GTT Distributed
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Admin Tabs */}
      <Tabs defaultValue="capsules" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="capsules">Capsule Moderation</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="system">System Health</TabsTrigger>
          <TabsTrigger value="awards">GTT Awards</TabsTrigger>
        </TabsList>

        <TabsContent value="capsules" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pending Capsules */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Pending Review ({pendingCapsules.length})
                </CardTitle>
                <CardDescription>
                  Capsules awaiting moderation approval
                </CardDescription>
              </CardHeader>
              <CardContent>
                {capsulesLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="h-20 bg-muted rounded animate-pulse"
                      />
                    ))}
                  </div>
                ) : pendingCapsules.length === 0 ? (
                  <div className="text-center py-6">
                    <CheckCircle className="mx-auto h-8 w-8 text-green-500 mb-2" />
                    <p className="text-muted-foreground">No pending capsules</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {pendingCapsules.map((capsule) => (
                      <div
                        key={capsule.id}
                        className="p-4 border rounded-lg space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold">{capsule.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              by {capsule.creator}
                            </p>
                            <p className="text-sm mt-1 line-clamp-2">
                              {capsule.content}
                            </p>
                          </div>
                          <Badge variant="secondary">
                            {capsule.yieldAmount} GTT
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApproveCapsule(capsule.id)}
                            disabled={approveCapsuleMutation.isPending}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleRejectCapsule(
                                capsule.id,
                                "Content policy violation"
                              )
                            }
                            disabled={rejectCapsuleMutation.isPending}
                          >
                            <EyeOff className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleFeatureCapsule(capsule.id, true)
                            }
                            disabled={featureCapsuleMutation.isPending}
                          >
                            <Star className="h-4 w-4 mr-1" />
                            Feature
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Flagged Content */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flag className="h-5 w-5 text-red-500" />
                  Flagged Content ({flaggedContent.length})
                </CardTitle>
                <CardDescription>
                  Community-reported content requiring review
                </CardDescription>
              </CardHeader>
              <CardContent>
                {flaggedLoading ? (
                  <div className="space-y-4">
                    {[...Array(2)].map((_, i) => (
                      <div
                        key={i}
                        className="h-20 bg-muted rounded animate-pulse"
                      />
                    ))}
                  </div>
                ) : flaggedContent.length === 0 ? (
                  <div className="text-center py-6">
                    <CheckCircle className="mx-auto h-8 w-8 text-green-500 mb-2" />
                    <p className="text-muted-foreground">No flagged content</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {flaggedContent.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 border border-red-200 rounded-lg space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold">{item.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {item.reportCount} reports • by {item.creator}
                            </p>
                          </div>
                          <Badge variant="destructive">Flagged</Badge>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApproveCapsule(item.id)}
                            disabled={approveCapsuleMutation.isPending}
                          >
                            Clear
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              handleRejectCapsule(
                                item.id,
                                "Confirmed policy violation"
                              )
                            }
                            disabled={rejectCapsuleMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management ({users.length})
              </CardTitle>
              <CardDescription>
                Manage user accounts and moderation actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {usersLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="h-16 bg-muted rounded animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {users.map((user) => (
                    <div key={user.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{user.name}</h4>
                            <Badge variant="outline">{user.tier}</Badge>
                            <Badge
                              variant={
                                user.status === "active"
                                  ? "default"
                                  : user.status === "warned"
                                  ? "secondary"
                                  : user.status === "suspended"
                                  ? "destructive"
                                  : "destructive"
                              }
                            >
                              {user.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                          <div className="text-xs text-muted-foreground mt-1">
                            {user.capsulesCreated} capsules • Reputation:{" "}
                            {user.reputation}
                            {user.flaggedContent > 0 &&
                              ` • ${user.flaggedContent} flags`}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {user.status === "active" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleModerateUser(
                                    user.id,
                                    "warn",
                                    "Community guidelines reminder"
                                  )
                                }
                              >
                                Warn
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                  handleModerateUser(
                                    user.id,
                                    "suspend",
                                    "Policy violation"
                                  )
                                }
                              >
                                Suspend
                              </Button>
                            </>
                          )}
                          {user.status === "suspended" && (
                            <Button
                              size="sm"
                              onClick={() =>
                                handleModerateUser(user.id, "activate")
                              }
                            >
                              Restore
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  System Health
                </CardTitle>
                <CardDescription>Real-time platform monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>API Health</span>
                    <Badge variant="default" className="bg-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Operational
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Database</span>
                    <Badge variant="default" className="bg-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Blockchain RPC</span>
                    <Badge variant="default" className="bg-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Mumbai Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Smart Contracts</span>
                    <Badge variant="default" className="bg-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Deployed
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>System Load</span>
                    <Badge variant="secondary">
                      {stats?.systemHealth || 95}% Normal
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Platform Metrics
                </CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Total Users</span>
                    <span className="font-bold">{stats?.totalUsers || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Daily Active Users</span>
                    <span className="font-bold">{stats?.activeUsers || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>GTT in Circulation</span>
                    <span className="font-bold">
                      {parseFloat(
                        stats?.gttDistributed || "0"
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Verification Rate</span>
                    <span className="font-bold">
                      {stats
                        ? Math.round(
                            ((stats.totalCapsules - stats.pendingCapsules) /
                              stats.totalCapsules) *
                              100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Platform Health</span>
                    <Badge variant="default" className="bg-green-600">
                      Excellent
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="awards" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                GTT Award System
              </CardTitle>
              <CardDescription>
                Award additional GTT tokens to exceptional content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">
                      Award Amount (GTT)
                    </label>
                    <Input
                      type="number"
                      placeholder="Enter GTT amount"
                      value={awardAmount}
                      onChange={(e) => setAwardAmount(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Capsule ID</label>
                    <Input
                      placeholder="Enter capsule ID"
                      value={selectedCapsule}
                      onChange={(e) => setSelectedCapsule(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Award Notes</label>
                  <Textarea
                    placeholder="Reason for award (e.g., exceptional content quality, community impact)"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                  />
                </div>

                <Button
                  onClick={() => handleAwardGTT(selectedCapsule)}
                  disabled={
                    !selectedCapsule ||
                    !awardAmount ||
                    awardGTTMutation.isPending
                  }
                  className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700"
                >
                  <Award className="h-4 w-4 mr-2" />
                  Award GTT Tokens
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
