import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  Eye, 
  FileText, 
  Lock, 
  Shield, 
  Star,
  Users,
  Trophy,
  Heart
} from "lucide-react";
import { Link } from "wouter";
import { getActivityTimeline } from "@/lib/profile-api";

interface ActivityTimelineProps {
  userId: string;
}

export default function ActivityTimeline({ userId }: ActivityTimelineProps) {
  const { data: timelineEvents = [], isLoading } = useQuery({
    queryKey: [`/api/profile/${userId}/activity-timeline`],
    queryFn: () => getActivityTimeline(userId),
  });

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

  const getEventColor = (type: string) => {
    switch (type) {
      case "capsule_created":
        return "text-blue-400 border-blue-500";
      case "capsule_verified":
        return "text-green-400 border-green-500";
      case "badge_earned":
        return "text-yellow-400 border-yellow-500";
      case "friend_added":
        return "text-purple-400 border-purple-500";
      default:
        return "text-brand-accent border-brand-accent";
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  if (timelineEvents.length === 0) {
    return (
      <Card className="bg-brand-secondary border-brand-surface">
        <CardContent className="p-8 text-center">
          <Clock className="w-12 h-12 text-brand-light/30 mx-auto mb-4" />
          <p className="text-brand-light/60">No recent activity</p>
          <p className="text-xs text-brand-light/40 mt-2">
            Your activities will appear here as you use the platform
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {timelineEvents.map((event, index) => (
        <Card
          key={event.id}
          className="bg-brand-secondary border-brand-surface hover:border-brand-accent/50 transition-all duration-200"
          data-testid={`activity-event-${index}`}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-brand-surface border border-brand-light/20 rounded-full flex items-center justify-center">
                {getEventIcon(event.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-brand-light">
                    {event.description}
                  </p>
                  <span className="text-xs text-brand-light/50 ml-2">
                    {formatDate(event.timestamp)}
                  </span>
                </div>
                
                <div className="mt-2">
                  <Badge
                    variant="outline"
                    className={`${getEventColor(event.type)} text-xs`}
                  >
                    {event.type.replace("_", " ")}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <Card className="bg-brand-secondary border-brand-surface">
        <CardContent className="p-4 text-center">
          <Button
            variant="outline"
            size="sm"
            className="border-brand-light/20 hover:bg-brand-light/10 text-brand-light"
            data-testid="button-view-all-activity"
          >
            <Eye className="w-3 h-3 mr-2" />
            View Full Activity History
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}