import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Clock, Eye, FileText, Lock, Shield, Star } from "lucide-react";
import { Link } from "wouter";

interface CapsuleTimelineEvent {
  id: string;
  title: string;
  description: string;
  type: string;
  timestamp: string;
  truthScore?: number;
  isSealed?: boolean;
  unlockDate?: string;
}

interface CapsuleVaultTimelineProps {
  userId: string;
  viewMode?: "grid" | "timeline" | "calendar" | "trending";
}

export function CapsuleVaultTimeline({ userId, viewMode = "timeline" }: CapsuleVaultTimelineProps) {
  const { data: timelineEvents = [], isLoading } = useQuery({
    queryKey: [`/api/profile/${userId}/timeline`],
    queryFn: async () => {
      // Mock timeline data for now
      return [
        {
          id: "timeline-1",
          title: "Family Memory Capsule Created",
          description: "Recorded precious family moments for future generations",
          type: "capsule_created",
          timestamp: "2025-08-03T18:00:00Z",
          truthScore: 92,
          isSealed: false,
        },
        {
          id: "timeline-2",
          title: "Legacy Time Capsule Sealed",
          description: "Important family documents sealed until 2030",
          type: "capsule_sealed",
          timestamp: "2025-08-02T15:30:00Z",
          truthScore: 95,
          isSealed: true,
          unlockDate: "2030-01-01",
        },
        {
          id: "timeline-3",
          title: "Community Verification Earned",
          description: "Memory capsule verified by community guardians",
          type: "capsule_verified",
          timestamp: "2025-08-01T10:15:00Z",
          truthScore: 88,
          isSealed: false,
        },
      ] as CapsuleTimelineEvent[];
    },
  });

  const getEventIcon = (type: string) => {
    switch (type) {
      case "capsule_created":
        return <FileText className="w-4 h-4 text-blue-400" />;
      case "capsule_verified":
        return <Shield className="w-4 h-4 text-green-400" />;
      case "capsule_sealed":
        return <Lock className="w-4 h-4 text-purple-400" />;
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
      case "capsule_sealed":
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
          <p className="text-brand-light/60">Loading timeline...</p>
        </CardContent>
      </Card>
    );
  }

  if (timelineEvents.length === 0) {
    return (
      <Card className="bg-brand-secondary border-brand-surface">
        <CardContent className="p-8 text-center">
          <Clock className="w-12 h-12 text-brand-light/30 mx-auto mb-4" />
          <p className="text-brand-light/60">No timeline events yet</p>
          <p className="text-xs text-brand-light/40 mt-2">
            Your capsule activities will appear here
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
          data-testid={`timeline-event-${index}`}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-brand-surface border border-brand-light/20 rounded-full flex items-center justify-center">
                  {getEventIcon(event.type)}
                </div>
                
                <div>
                  <CardTitle className="text-brand-light text-lg">
                    {event.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant="outline"
                      className={getEventColor(event.type)}
                    >
                      {event.type.replace("_", " ")}
                    </Badge>
                    {event.truthScore && (
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-brand-warning" />
                        <span className="text-xs text-brand-light/70">
                          {event.truthScore}% Truth Score
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-brand-light/50">
                  {formatDate(event.timestamp)}
                </div>
                {event.isSealed && (
                  <div className="flex items-center gap-1 mt-1">
                    <Lock className="w-3 h-3 text-brand-warning" />
                    <span className="text-xs text-brand-warning">Sealed</span>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-sm text-brand-light/70">
              {event.description}
            </p>

            {event.isSealed && event.unlockDate && (
              <div className="p-3 bg-brand-warning/10 border border-brand-warning/20 rounded">
                <div className="flex items-center gap-2 text-brand-warning text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Unlocks on {new Date(event.unlockDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="border-brand-light/20 hover:bg-brand-light/10 text-brand-light"
                data-testid={`button-view-event-${event.id}`}
              >
                <Link href={`/capsule/${event.id}`}>
                  <Eye className="w-3 h-3 mr-2" />
                  {event.isSealed ? "Preview" : "View"}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}