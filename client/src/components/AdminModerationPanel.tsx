import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Check, X, Eye, Clock, Shield } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ModerationLog {
  id: string;
  content: string;
  user: string;
  reason: string;
  severity: number;
  flags: string[];
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  reviewed_at?: string;
  reviewer?: string;
}

interface ModerationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  todayTotal: number;
}

export default function AdminModerationPanel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch moderation logs
  const { data: logs = [], isLoading: logsLoading } = useQuery({
    queryKey: ["/api/moderation/logs"],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Fetch moderation statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/moderation/stats"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Moderation action mutation
  const moderationMutation = useMutation({
    mutationFn: async ({ logId, action, reviewerNotes }: {
      logId: string;
      action: 'approve' | 'reject';
      reviewerNotes?: string;
    }) => {
      return apiRequest("POST", `/api/moderation/review`, {
        logId,
        action,
        reviewerNotes
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/moderation/logs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/moderation/stats"] });
      toast({
        title: "Review Completed",
        description: "Moderation action has been recorded.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Review Failed",
        description: error.message || "Failed to process moderation action",
        variant: "destructive",
      });
    },
  });

  const handleModerationAction = (logId: string, action: 'approve' | 'reject') => {
    moderationMutation.mutate({ logId, action });
  };

  const getSeverityColor = (severity: number) => {
    if (severity >= 4) return "bg-red-100 text-red-800";
    if (severity >= 3) return "bg-yellow-100 text-yellow-800";
    if (severity >= 2) return "bg-blue-100 text-blue-800";
    return "bg-green-100 text-green-800";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <Check className="h-4 w-4 text-green-600" />;
      case 'rejected': return <X className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  if (logsLoading || statsLoading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const mockStats: ModerationStats = stats || {
    total: logs.length || 0,
    pending: logs.filter((log: ModerationLog) => log.status === 'pending').length || 0,
    approved: logs.filter((log: ModerationLog) => log.status === 'approved').length || 0,
    rejected: logs.filter((log: ModerationLog) => log.status === 'rejected').length || 0,
    todayTotal: logs.filter((log: ModerationLog) => 
      new Date(log.created_at).toDateString() === new Date().toDateString()
    ).length || 0,
  };

  const pendingLogs = logs.filter((log: ModerationLog) => log.status === 'pending' || !log.status);
  const reviewedLogs = logs.filter((log: ModerationLog) => log.status && log.status !== 'pending');

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.total}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{mockStats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <Check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{mockStats.approved}</div>
            <p className="text-xs text-muted-foreground">Content approved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Reviews</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.todayTotal}</div>
            <p className="text-xs text-muted-foreground">Reviews today</p>
          </CardContent>
        </Card>
      </div>

      {/* Moderation Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Content Moderation Dashboard
          </CardTitle>
          <CardDescription>
            Review and moderate user-submitted content for GuardianChain platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="space-y-4">
            <TabsList>
              <TabsTrigger value="pending">
                Pending ({mockStats.pending})
              </TabsTrigger>
              <TabsTrigger value="reviewed">
                Reviewed ({mockStats.approved + mockStats.rejected})
              </TabsTrigger>
              <TabsTrigger value="all">
                All Logs ({mockStats.total})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
              {pendingLogs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No pending content to review</p>
                </div>
              ) : (
                pendingLogs.map((log: ModerationLog) => (
                  <Card key={log.id} className="border-l-4 border-l-yellow-400">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">{log.user}</Badge>
                              <Badge className={getSeverityColor(log.severity)}>
                                Severity {log.severity}
                              </Badge>
                              {log.flags?.map(flag => (
                                <Badge key={flag} variant="outline">{flag}</Badge>
                              ))}
                            </div>
                            <p className="text-sm text-gray-600">
                              {new Date(log.created_at).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 border-green-300 hover:bg-green-50"
                              onClick={() => handleModerationAction(log.id, 'approve')}
                              disabled={moderationMutation.isPending}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-300 hover:bg-red-50"
                              onClick={() => handleModerationAction(log.id, 'reject')}
                              disabled={moderationMutation.isPending}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-sm font-medium mb-1">Content:</p>
                          <p className="text-sm">{log.content}</p>
                        </div>
                        
                        {log.reason && (
                          <div className="bg-red-50 p-3 rounded-md">
                            <p className="text-sm font-medium mb-1 text-red-800">Moderation Reason:</p>
                            <p className="text-sm text-red-700">{log.reason}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="reviewed" className="space-y-4">
              {reviewedLogs.map((log: ModerationLog) => (
                <Card key={log.id} className={`border-l-4 ${
                  log.status === 'approved' ? 'border-l-green-400' : 'border-l-red-400'
                }`}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(log.status)}
                          <Badge variant="secondary">{log.user}</Badge>
                          <Badge className={getSeverityColor(log.severity)}>
                            Severity {log.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Reviewed: {log.reviewed_at ? new Date(log.reviewed_at).toLocaleString() : 'Unknown'}
                        </p>
                      </div>
                      <Badge variant={log.status === 'approved' ? 'default' : 'destructive'}>
                        {log.status?.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="mt-4 bg-gray-50 p-3 rounded-md">
                      <p className="text-sm">{log.content}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="all" className="space-y-4">
              {logs.map((log: ModerationLog) => (
                <Card key={log.id} className="border-l-4 border-l-gray-300">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(log.status || 'pending')}
                          <Badge variant="secondary">{log.user}</Badge>
                          <Badge className={getSeverityColor(log.severity)}>
                            Severity {log.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {new Date(log.created_at).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant={
                        log.status === 'approved' ? 'default' : 
                        log.status === 'rejected' ? 'destructive' : 'secondary'
                      }>
                        {(log.status || 'PENDING').toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="mt-4 bg-gray-50 p-3 rounded-md">
                      <p className="text-sm">{log.content}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}