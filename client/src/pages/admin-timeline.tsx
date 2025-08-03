import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Eye, 
  FileText, 
  Shield, 
  Users, 
  Trophy,
  Clock,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getActivityTimeline } from "@/lib/profile-api";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

export default function AdminTimelineView() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [userId, setUserId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const { toast } = useToast();

  // Check admin access
  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/");
      return;
    }
    
    // For demo purposes, allow debug users admin access
    // In production, this would check for actual admin role
    if (user?.tier !== "CREATOR" && user?.tier !== "SOVEREIGN" && user?.email !== "debug@guardianchain.app") {
      toast({
        title: "Access Denied",
        description: "Admin access required for timeline inspection",
        variant: "destructive",
      });
      setLocation("/");
    }
  }, [isAuthenticated, user, setLocation, toast]);

  const { data: timelineLogs = [], isLoading, error } = useQuery({
    queryKey: [`/api/admin/timeline/${selectedUserId}`],
    queryFn: () => getActivityTimeline(selectedUserId),
    enabled: !!selectedUserId,
  });

  const handleLoadTimeline = () => {
    if (!userId.trim()) {
      toast({
        title: "User ID Required",
        description: "Please enter a user ID to inspect",
        variant: "destructive",
      });
      return;
    }
    setSelectedUserId(userId.trim());
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "capsule_created":
        return <FileText className="w-4 h-4 text-blue-400" />;
      case "capsule_verified":
        return <Shield className="w-4 h-4 text-green-400" />;
      case "badge_earned":
        return <Trophy className="w-4 h-4 text-yellow-400" />;
      case "friend_added":
        return <Users className="w-4 h-4 text-purple-400" />;
      default:
        return <Clock className="w-4 h-4 text-brand-accent" />;
    }
  };

  const getEventBadgeColor = (type: string) => {
    switch (type) {
      case "capsule_created":
        return "bg-blue-500/20 text-blue-300 border-blue-500";
      case "capsule_verified":
        return "bg-green-500/20 text-green-300 border-green-500";
      case "badge_earned":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500";
      case "friend_added":
        return "bg-purple-500/20 text-purple-300 border-purple-500";
      default:
        return "bg-brand-accent/20 text-brand-accent border-brand-accent";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-brand-dark">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <Card className="bg-brand-secondary border-brand-surface mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-brand-light flex items-center gap-3">
              <Eye className="w-6 h-6 text-brand-accent" />
              Admin Timeline Inspector
            </CardTitle>
            <p className="text-brand-light/60">
              Monitor user activity and system events for security and compliance
            </p>
          </CardHeader>
        </Card>

        {/* Search Interface */}
        <Card className="bg-brand-secondary border-brand-surface mb-6">
          <CardContent className="p-6">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-brand-light mb-2">
                  User ID to Inspect
                </label>
                <Input
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Enter user wallet address or ID..."
                  className="bg-brand-surface border-brand-light/20 text-brand-light"
                  onKeyPress={(e) => e.key === "Enter" && handleLoadTimeline()}
                  data-testid="input-user-id"
                />
              </div>
              <Button
                onClick={handleLoadTimeline}
                disabled={!userId.trim() || isLoading}
                className="bg-brand-primary hover:bg-brand-primary/80"
                data-testid="button-load-timeline"
              >
                {isLoading ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                ) : (
                  <Search className="w-4 h-4 mr-2" />
                )}
                Load Timeline
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {selectedUserId && (
          <Card className="bg-brand-secondary border-brand-surface">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-brand-light flex items-center gap-2">
                  <Clock className="w-5 h-5 text-brand-accent" />
                  Timeline for User: {selectedUserId}
                </CardTitle>
                <Badge variant="outline" className="text-brand-accent border-brand-accent">
                  {timelineLogs.length} Events
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {isLoading && (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-brand-light/60">Loading timeline data...</p>
                </div>
              )}

              {error && (
                <div className="text-center py-8">
                  <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                  <p className="text-red-400">Failed to load timeline data</p>
                  <p className="text-brand-light/60 text-sm mt-2">
                    Please check the user ID and try again
                  </p>
                </div>
              )}

              {!isLoading && !error && timelineLogs.length === 0 && (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-brand-light/30 mx-auto mb-4" />
                  <p className="text-brand-light/60">No timeline events found</p>
                  <p className="text-xs text-brand-light/40 mt-2">
                    This user may not have any recorded activity
                  </p>
                </div>
              )}

              {!isLoading && !error && timelineLogs.length > 0 && (
                <div className="space-y-3">
                  {timelineLogs.map((log, index) => (
                    <Card
                      key={log.id || index}
                      className="bg-brand-surface border-brand-light/10 hover:border-brand-accent/30 transition-all duration-200"
                      data-testid={`timeline-event-${index}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-10 h-10 bg-brand-secondary border border-brand-light/20 rounded-full flex items-center justify-center">
                            {getEventIcon(log.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <p className="text-brand-light font-medium">
                                  {log.description}
                                </p>
                                
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge
                                    variant="outline"
                                    className={`text-xs ${getEventBadgeColor(log.type)}`}
                                  >
                                    {log.type.replace("_", " ").toUpperCase()}
                                  </Badge>
                                </div>

                                {log.metadata && (
                                  <div className="mt-3 p-3 bg-brand-dark/30 rounded-lg">
                                    <p className="text-xs text-brand-light/70 mb-1">Metadata:</p>
                                    <pre className="text-xs text-brand-light/60 whitespace-pre-wrap">
                                      {JSON.stringify(log.metadata, null, 2)}
                                    </pre>
                                  </div>
                                )}
                              </div>
                              
                              <div className="text-right">
                                <div className="text-xs text-brand-light/50">
                                  {formatTimestamp(log.timestamp)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Admin Notes */}
        <Card className="bg-brand-secondary border-brand-surface mt-6">
          <CardContent className="p-4">
            <div className="text-xs text-brand-light/50 space-y-1">
              <p>• Admin timeline inspection for security monitoring and compliance</p>
              <p>• All timeline access is logged for audit purposes</p>
              <p>• Contact system administrator for elevated access requirements</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}