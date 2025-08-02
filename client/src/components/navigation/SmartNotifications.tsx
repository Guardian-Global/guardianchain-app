import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  X,
  Star,
  TrendingUp,
  Users,
  Coins,
  Shield,
  Zap,
  Gift,
  Clock,
  Target,
} from "lucide-react";

interface SmartNotification {
  id: string;
  type:
    | "achievement"
    | "milestone"
    | "social"
    | "economic"
    | "reminder"
    | "opportunity";
  title: string;
  message: string;
  action?: {
    label: string;
    path: string;
  };
  priority: "low" | "medium" | "high" | "urgent";
  timestamp: string;
  read: boolean;
  expires?: string;
  triggers: string[];
}

const notificationTemplates: Partial<Record<string, SmartNotification[]>> = {
  "/": [
    {
      id: "welcome_back",
      type: "achievement",
      title: "Welcome Back, Guardian!",
      message:
        "Your truth vault awaits. Check your yield earnings and recent capsule performance.",
      action: { label: "View Dashboard", path: "/dashboard" },
      priority: "medium",
      timestamp: new Date().toISOString(),
      read: false,
      triggers: ["return_user", "daily_first_visit"],
    },
  ],
  "/dashboard": [
    {
      id: "yield_opportunity",
      type: "economic",
      title: "Yield Optimization Available",
      message: "Your capsules could earn 23% more GTT with strategic staking.",
      action: { label: "Optimize Yield", path: "/dashboard/yield" },
      priority: "high",
      timestamp: new Date().toISOString(),
      read: false,
      triggers: ["low_yield_efficiency"],
    },
  ],
  "/create": [
    {
      id: "first_capsule_tips",
      type: "opportunity",
      title: "Maximize Your First Capsule",
      message:
        "Personal memories with emotional depth typically earn 40% higher grief scores.",
      priority: "medium",
      timestamp: new Date().toISOString(),
      read: false,
      triggers: ["first_time_creator"],
    },
  ],
};

export default function SmartNotifications() {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<SmartNotification[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load context-aware notifications
  useEffect(() => {
    if (!isAuthenticated) return;

    const contextNotifications = notificationTemplates[location] || [];
    const globalNotifications = generateGlobalNotifications();

    const allNotifications = [...contextNotifications, ...globalNotifications];
    setNotifications(allNotifications);
    setUnreadCount(allNotifications.filter((n) => !n.read).length);
  }, [location, isAuthenticated]);

  // Generate dynamic notifications based on user behavior
  const generateGlobalNotifications = (): SmartNotification[] => {
    const notifications: SmartNotification[] = [];

    // Time-based notifications
    const hour = new Date().getHours();
    if (hour >= 18 && hour <= 22) {
      notifications.push({
        id: "evening_reflection",
        type: "reminder",
        title: "Evening Reflection Time",
        message:
          "Perfect time to capture today's thoughts in an eternal capsule.",
        action: { label: "Create Capsule", path: "/create" },
        priority: "low",
        timestamp: new Date().toISOString(),
        read: false,
        triggers: ["evening_hours"],
      });
    }

    // Social engagement notifications
    if (Math.random() > 0.7) {
      notifications.push({
        id: "community_activity",
        type: "social",
        title: "Community Spotlight",
        message:
          "127 Guardians are actively creating capsules right now. Join the movement!",
        action: { label: "View Activity", path: "/guardian-map" },
        priority: "medium",
        timestamp: new Date().toISOString(),
        read: false,
        triggers: ["high_community_activity"],
      });
    }

    // Economic opportunities
    notifications.push({
      id: "gtt_surge",
      type: "economic",
      title: "GTT Value Surge",
      message: "GTT is up 12% today. Consider increasing your capsule staking.",
      action: { label: "View Yields", path: "/dashboard/yield" },
      priority: "high",
      timestamp: new Date().toISOString(),
      read: false,
      triggers: ["token_price_increase"],
    });

    return notifications;
  };

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const dismissNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const handleNotificationAction = (notification: SmartNotification) => {
    if (notification.action) {
      markAsRead(notification.id);
      window.location.href = notification.action.path;
    }
  };

  const getNotificationIcon = (type: SmartNotification["type"]) => {
    switch (type) {
      case "achievement":
        return <Star className="h-4 w-4 text-brand-accent" />;
      case "milestone":
        return <Target className="h-4 w-4 text-brand-primary" />;
      case "social":
        return <Users className="h-4 w-4 text-blue-400" />;
      case "economic":
        return <Coins className="h-4 w-4 text-green-400" />;
      case "reminder":
        return <Clock className="h-4 w-4 text-orange-400" />;
      case "opportunity":
        return <Zap className="h-4 w-4 text-purple-400" />;
      default:
        return <Bell className="h-4 w-4 text-slate-400" />;
    }
  };

  const getPriorityColor = (priority: SmartNotification["priority"]) => {
    switch (priority) {
      case "urgent":
        return "border-red-500 bg-red-500/10";
      case "high":
        return "border-orange-500 bg-orange-500/10";
      case "medium":
        return "border-blue-500 bg-blue-500/10";
      default:
        return "border-slate-500 bg-slate-500/10";
    }
  };

  if (!isAuthenticated) return null;

  return (
    <>
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="sm"
        className="relative"
        onClick={() => setIsVisible(!isVisible)}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs">
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notifications Panel */}
      {isVisible && (
        <Card className="absolute top-full right-0 mt-2 w-80 max-h-96 overflow-y-auto z-50 bg-slate-800/95 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-0">
            <div className="p-3 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-medium">Notifications</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsVisible(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-slate-400">
                  No notifications right now
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 border-l-2 ${getPriorityColor(notification.priority)} ${
                      !notification.read ? "bg-slate-700/30" : ""
                    } border-b border-slate-700/50 last:border-b-0`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-white text-sm font-medium leading-tight">
                            {notification.title}
                          </h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 opacity-50 hover:opacity-100"
                            onClick={() => dismissNotification(notification.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                          {notification.message}
                        </p>
                        {notification.action && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-2 h-6 text-xs"
                            onClick={() =>
                              handleNotificationAction(notification)
                            }
                          >
                            {notification.action.label}
                          </Button>
                        )}
                        <div className="text-slate-500 text-xs mt-1">
                          {new Date(
                            notification.timestamp,
                          ).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
