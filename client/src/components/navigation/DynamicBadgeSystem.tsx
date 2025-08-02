import React from "react";
import { Badge } from "@/components/ui/badge";
import { Bell, AlertTriangle, TrendingUp, Star, Gift, Zap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface BadgeData {
  id: string;
  type: "new" | "warning" | "success" | "info" | "urgent";
  text: string;
  icon?: React.ComponentType<any>;
  count?: number;
  expires?: string;
}

interface DynamicBadgeProps {
  routeId: string;
  className?: string;
}

export function DynamicBadge({ routeId, className = "" }: DynamicBadgeProps) {
  const { data: badges = [] } = useQuery({
    queryKey: ["/api/navigation/badges", routeId],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (!badges || badges.length === 0) return null;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {badges.map((badge: BadgeData) => (
        <BadgeIndicator key={badge.id} badge={badge} />
      ))}
    </div>
  );
}

function BadgeIndicator({ badge }: { badge: BadgeData }) {
  const getBadgeStyle = (type: string) => {
    switch (type) {
      case "new":
        return "bg-blue-500 text-white animate-pulse";
      case "warning":
        return "bg-yellow-500 text-black";
      case "success":
        return "bg-green-500 text-white";
      case "urgent":
        return "bg-red-500 text-white animate-bounce";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "new":
        return Star;
      case "warning":
        return AlertTriangle;
      case "success":
        return TrendingUp;
      case "urgent":
        return Bell;
      default:
        return null;
    }
  };

  const IconComponent = badge.icon || getIcon(badge.type);

  return (
    <Badge
      variant="secondary"
      className={`${getBadgeStyle(badge.type)} text-xs flex items-center gap-1`}
    >
      {IconComponent && <IconComponent className="w-3 h-3" />}
      <span>{badge.text}</span>
      {badge.count && badge.count > 1 && (
        <span className="ml-1 px-1 bg-white/20 rounded-full text-xs">
          {badge.count}
        </span>
      )}
    </Badge>
  );
}

// Hook for getting badge data
export function useDynamicBadges() {
  const { data: globalBadges = [] } = useQuery({
    queryKey: ["/api/navigation/global-badges"],
    refetchInterval: 30000,
  });

  return {
    getBadgesForRoute: (routeId: string) => {
      return (
        globalBadges?.filter(
          (badge: BadgeData) =>
            badge.id.includes(routeId) || badge.id === "global",
        ) || []
      );
    },
    globalBadges: globalBadges || [],
  };
}
