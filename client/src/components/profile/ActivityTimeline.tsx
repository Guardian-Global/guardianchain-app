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

  if (isLoading) {
    return (
      <Card className="bg-brand-secondary border-brand-surface">
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-6 h-6 border-4 border-brand-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-brand-light/60">Loading activity timeline...</p>
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
          {events.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-brand-light/30 mx-auto mb-4" />
              <p className="text-brand-light/60">No activity recorded yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event: TimelineEvent) => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-brand-surface border border-brand-light/10 hover:border-brand-light/20 transition-colors"
                  data-testid={`timeline-event-${event.type}`}
                >
                  <div className="flex-shrink-0 mt-1">
                    {getEventIcon(event.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant="outline"
                        className={getEventColor(event.type)}
                      >
                        {event.type.replace("_", " ")}
                      </Badge>
                      <span className="text-xs text-brand-light/50">
                        {new Date(event.timestamp).toLocaleString()}
                      </span>
                    </div>
                    
                    <p className="text-sm text-brand-light/80">
                      {event.description}
                    </p>
                    
                    {event.metadata && (
                      <div className="mt-2 text-xs text-brand-light/60">
                        {Object.entries(event.metadata).map(([key, value]) => (
                          <span key={key} className="mr-3">
                            <span className="font-medium">{key}:</span> {String(value)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}