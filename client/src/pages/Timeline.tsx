import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Eye, Heart, MessageCircle, Share2, Filter } from "lucide-react";
import { useState } from "react";

interface TimelineEvent {
  id: string;
  type:
    | "capsule_created"
    | "capsule_verified"
    | "capsule_liked"
    | "comment_added"
    | "capsule_shared";
  timestamp: string;
  capsule: {
    id: string;
    title: string;
    content: string;
    author: string;
    category: string;
    verificationStatus: "verified" | "pending" | "rejected";
    griefScore: number;
    stats: {
      views: number;
      likes: number;
      comments: number;
      shares: number;
    };
  };
  actor?: string;
  metadata?: Record<string, any>;
}

interface TimelineData {
  events: TimelineEvent[];
  totalEvents: number;
  hasMore: boolean;
}

const eventIcons = {
  capsule_created: "🆕",
  capsule_verified: "✅",
  capsule_liked: "❤️",
  comment_added: "💬",
  capsule_shared: "🔄",
};

const eventLabels = {
  capsule_created: "Capsule Created",
  capsule_verified: "Verification Complete",
  capsule_liked: "Capsule Liked",
  comment_added: "Comment Added",
  capsule_shared: "Capsule Shared",
};

export default function Timeline() {
  const [filter, setFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  const { data: timeline, isLoading } = useQuery<TimelineData>({
    queryKey: ["/api/capsules/timeline", { filter, page }],
  });

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const eventTime = new Date(timestamp);
    const diffInHours = Math.floor(
      (now.getTime() - eventTime.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return `${Math.floor(diffInHours / 168)}w ago`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-gray-200 dark:bg-gray-700 rounded"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Capsule Timeline
        </h1>

        <div className="flex items-center gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className="text-xs"
          >
            All Events
          </Button>
          <Button
            variant={filter === "capsule_created" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("capsule_created")}
            className="text-xs"
          >
            New Capsules
          </Button>
          <Button
            variant={filter === "capsule_verified" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("capsule_verified")}
            className="text-xs"
          >
            Verified
          </Button>
          <Filter className="w-4 h-4 text-gray-500" />
        </div>
      </div>

      <div className="space-y-4">
        {timeline?.events.map((event, index) => (
          <Card
            key={event.id}
            className="bg-white dark:bg-gray-800 transition-all hover:shadow-lg"
          >
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                {/* Event Icon */}
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-lg">
                  {eventIcons[event.type]}
                </div>

                {/* Event Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        {eventLabels[event.type]}
                      </Badge>
                      <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTimeAgo(event.timestamp)}
                      </span>
                    </div>
                    <Badge
                      variant={
                        event.capsule.verificationStatus === "verified"
                          ? "default"
                          : event.capsule.verificationStatus === "pending"
                            ? "secondary"
                            : "destructive"
                      }
                      className="text-xs"
                    >
                      {event.capsule.verificationStatus}
                    </Badge>
                  </div>

                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 truncate">
                    {event.capsule.title}
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {event.capsule.content}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                      <span>by {event.capsule.author}</span>
                      <span>•</span>
                      <span>{event.capsule.category}</span>
                      <span>•</span>
                      <span>Grief Score: {event.capsule.griefScore}</span>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {event.capsule.stats.views}
                      </span>
                      <span className="flex items-center">
                        <Heart className="w-4 h-4 mr-1" />
                        {event.capsule.stats.likes}
                      </span>
                      <span className="flex items-center">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        {event.capsule.stats.comments}
                      </span>
                      <span className="flex items-center">
                        <Share2 className="w-4 h-4 mr-1" />
                        {event.capsule.stats.shares}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      {timeline?.hasMore && (
        <div className="flex justify-center pt-6">
          <Button
            variant="outline"
            onClick={() => setPage((prev) => prev + 1)}
            className="w-full sm:w-auto"
          >
            Load More Events
          </Button>
        </div>
      )}

      {timeline?.events.length === 0 && (
        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="text-center py-12">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Timeline Events
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Timeline events will appear here as capsules are created and
              interactions occur.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
