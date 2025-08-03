import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Activity, Zap, Shield, FileText, Users } from "lucide-react";
import { getActivityTimeline } from "@/lib/profile-api";

interface ActivityTimelineProps {
  userId: string;
}

interface TimelineEvent {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  metadata?: any;
}

export default function ActivityTimeline({ userId }: ActivityTimelineProps) {
  const { data: events = [], isLoading } = useQuery({
    queryKey: [`/api/profile/timeline/${userId}`],
    queryFn: () => getActivityTimeline(userId),
  });

  const getEventIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "capsule_created":
        return <FileText className="w-4 h-4 text-blue-400" />;
      case "capsule_verified":
        return <Shield className="w-4 h-4 text-green-400" />;
      case "friend_added":
        return <Users className="w-4 h-4 text-purple-400" />;
      case "badge_earned":
        return <Zap className="w-4 h-4 text-yellow-400" />;
      default:
        return <Activity className="w-4 h-4 text-brand-accent" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "capsule_created":
        return "text-blue-400 border-blue-500";
      case "capsule_verified":
        return "text-green-400 border-green-500";
      case "friend_added":
        return "text-purple-400 border-purple-500";
      case "badge_earned":
        return "text-yellow-400 border-yellow-500";
      default:
        return "text-brand-accent border-brand-accent";
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <Card className="bg-brand-secondary border-brand-surface">
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-brand-light/60">Loading activity timeline...</p>
        </CardContent>
      </Card>
    );
  }

  if (events.length === 0) {
    return (
      <Card className="bg-brand-secondary border-brand-surface">
        <CardContent className="p-8 text-center">
          <Activity className="w-12 h-12 text-brand-light/30 mx-auto mb-4" />
          <p className="text-brand-light/60">No recent activity</p>
          <p className="text-xs text-brand-light/40 mt-2">
            Your platform activities will appear here
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-brand-secondary border-brand-surface">
      <CardHeader>
        <CardTitle className="text-brand-light flex items-center gap-2">
          <Clock className="w-5 h-5 text-brand-accent" />
          Activity Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {events.map((event: TimelineEvent, index: number) => (
              <div
                key={event.id}
                className="flex items-start gap-4 p-3 bg-brand-surface rounded border border-brand-light/10 hover:border-brand-light/20 transition-colors"
                data-testid={`timeline-event-${index}`}
              >
                {/* Event Icon */}
                <div className="flex-shrink-0 w-10 h-10 bg-brand-secondary border border-brand-light/20 rounded-full flex items-center justify-center">
                  {getEventIcon(event.type)}
                </div>

                {/* Event Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-brand-light font-medium">
                        {event.description}
                      </p>
                      
                      {event.metadata && (
                        <div className="mt-2 space-y-1">
                          {event.metadata.capsuleTitle && (
                            <div className="text-xs text-brand-light/70">
                              Capsule: {event.metadata.capsuleTitle}
                            </div>
                          )}
                          {event.metadata.badgeName && (
                            <div className="text-xs text-brand-light/70">
                              Badge: {event.metadata.badgeName}
                            </div>
                          )}
                          {event.metadata.friendName && (
                            <div className="text-xs text-brand-light/70">
                              Friend: {event.metadata.friendName}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="ml-4 text-right">
                      <Badge
                        variant="outline"
                        className={getEventColor(event.type)}
                      >
                        {event.type.replace('_', ' ')}
                      </Badge>
                      <div className="text-xs text-brand-light/50 mt-1">
                        {formatTimeAgo(event.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}