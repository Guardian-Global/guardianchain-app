import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Calendar,
  Shield,
  Coins,
  TrendingUp,
  Users,
  Share,
  Lock,
  Globe,
  Filter,
} from "lucide-react";

interface TimelineEvent {
  id: string;
  type:
    | "capsule_created"
    | "capsule_verified"
    | "yield_received"
    | "verification_performed"
    | "achievement_unlocked";
  title: string;
  description: string;
  timestamp: string;
  metadata: {
    gttAmount?: number;
    capsuleTitle?: string;
    verificationCount?: number;
    achievementName?: string;
    privacy: "public" | "private";
  };
}

interface TimelineManagerProps {
  isPublic: boolean;
}

export default function TimelineManager({ isPublic }: TimelineManagerProps) {
  const [showPrivateEvents, setShowPrivateEvents] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");

  const timelineEvents: TimelineEvent[] = [
    {
      id: "1",
      type: "yield_received",
      title: "Yield Payment Received",
      description:
        "Received GTT yield from Climate Research Data Verification capsule",
      timestamp: "2024-12-19T10:30:00Z",
      metadata: {
        gttAmount: 127.5,
        capsuleTitle: "Climate Research Data Verification",
        privacy: "public",
      },
    },
    {
      id: "2",
      type: "capsule_verified",
      title: "Capsule Verified by Community",
      description:
        "Legal Document Authentication capsule received 5 new verifications",
      timestamp: "2024-12-18T15:45:00Z",
      metadata: {
        capsuleTitle: "Legal Document Authentication",
        verificationCount: 5,
        privacy: "public",
      },
    },
    {
      id: "3",
      type: "verification_performed",
      title: "Verified Community Capsules",
      description:
        "Performed verification on 3 community capsules, earned reputation points",
      timestamp: "2024-12-17T09:20:00Z",
      metadata: {
        verificationCount: 3,
        privacy: "public",
      },
    },
    {
      id: "4",
      type: "capsule_created",
      title: "Personal Medical Records Sealed",
      description: "Created private capsule for personal medical documentation",
      timestamp: "2024-12-16T14:15:00Z",
      metadata: {
        capsuleTitle: "Personal Medical Records",
        privacy: "private",
      },
    },
    {
      id: "5",
      type: "achievement_unlocked",
      title: "Achievement Unlocked: Truth Guardian",
      description:
        "Reached 150 total verifications and earned Truth Guardian badge",
      timestamp: "2024-12-15T11:30:00Z",
      metadata: {
        achievementName: "Truth Guardian",
        privacy: "public",
      },
    },
    {
      id: "6",
      type: "capsule_created",
      title: "AI Training Data Integrity Capsule",
      description:
        "Created and sealed comprehensive AI training dataset verification",
      timestamp: "2024-12-10T16:45:00Z",
      metadata: {
        capsuleTitle: "AI Training Data Integrity",
        privacy: "public",
      },
    },
  ];

  const getEventIcon = (type: string) => {
    const icons = {
      capsule_created: Shield,
      capsule_verified: Users,
      yield_received: Coins,
      verification_performed: TrendingUp,
      achievement_unlocked: Badge,
    };
    return icons[type as keyof typeof icons] || Calendar;
  };

  const getEventColor = (type: string) => {
    const colors = {
      capsule_created: "text-blue-400",
      capsule_verified: "text-green-400",
      yield_received: "text-amber-400",
      verification_performed: "text-purple-400",
      achievement_unlocked: "text-pink-400",
    };
    return colors[type as keyof typeof colors] || "text-gray-400";
  };

  const filteredEvents = timelineEvents.filter((event) => {
    const matchesPrivacy =
      showPrivateEvents || event.metadata.privacy === "public";
    const matchesType = filterType === "all" || event.type === filterType;
    return matchesPrivacy && matchesType;
  });

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Timeline Controls */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Activity Timeline</span>
            <div className="flex items-center space-x-2">
              {isPublic ? (
                <Globe className="w-4 h-4 text-green-400" />
              ) : (
                <Lock className="w-4 h-4 text-red-400" />
              )}
              <span className="text-sm text-slate-400">
                {isPublic ? "Public Timeline" : "Private Timeline"}
              </span>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={showPrivateEvents}
                  onCheckedChange={setShowPrivateEvents}
                  id="show-private"
                />
                <label
                  htmlFor="show-private"
                  className="text-sm text-slate-400"
                >
                  Show private events
                </label>
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
              >
                <option value="all">All Events</option>
                <option value="capsule_created">Capsules Created</option>
                <option value="capsule_verified">Verifications</option>
                <option value="yield_received">Yield Received</option>
                <option value="verification_performed">
                  Verifications Performed
                </option>
                <option value="achievement_unlocked">Achievements</option>
              </select>
            </div>

            <Button variant="outline" size="sm">
              <Share className="w-4 h-4 mr-2" />
              Share Timeline
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Timeline Events */}
      <div className="space-y-4">
        {filteredEvents.map((event, index) => {
          const EventIcon = getEventIcon(event.type);
          const eventColor = getEventColor(event.type);

          return (
            <Card key={event.id} className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Timeline indicator */}
                  <div className="relative">
                    <div
                      className={`w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center ${eventColor}`}
                    >
                      <EventIcon className="w-5 h-5" />
                    </div>

                    {index !== filteredEvents.length - 1 && (
                      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-slate-600"></div>
                    )}
                  </div>

                  {/* Event content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-white mb-1">
                          {event.title}
                        </h3>
                        <p className="text-slate-400 text-sm mb-2">
                          {event.description}
                        </p>

                        {/* Event metadata */}
                        <div className="flex items-center space-x-4 text-xs text-slate-500">
                          <span>{formatDate(event.timestamp)}</span>

                          {event.metadata.gttAmount && (
                            <>
                              <span>•</span>
                              <span className="text-amber-400">
                                +{event.metadata.gttAmount} GTT
                              </span>
                            </>
                          )}

                          {event.metadata.verificationCount && (
                            <>
                              <span>•</span>
                              <span className="text-blue-400">
                                {event.metadata.verificationCount} verifications
                              </span>
                            </>
                          )}

                          {event.metadata.achievementName && (
                            <>
                              <span>•</span>
                              <span className="text-pink-400">
                                {event.metadata.achievementName}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <Badge
                          variant="outline"
                          className={`${
                            event.metadata.privacy === "private"
                              ? "border-red-400 text-red-400"
                              : "border-green-400 text-green-400"
                          }`}
                        >
                          {event.metadata.privacy === "private" ? (
                            <Lock className="w-3 h-3 mr-1" />
                          ) : (
                            <Globe className="w-3 h-3 mr-1" />
                          )}
                          {event.metadata.privacy}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredEvents.length === 0 && (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-12 text-center">
            <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              No timeline events
            </h3>
            <p className="text-slate-400 mb-4">
              {filterType !== "all" || !showPrivateEvents
                ? "Try adjusting your filter settings to see more events."
                : "Your activity timeline will appear here as you use GUARDIANCHAIN."}
            </p>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Shield className="w-4 h-4 mr-2" />
              Create First Capsule
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
