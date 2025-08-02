import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Bell,
  FileText,
  TrendingUp,
  Shield,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";

interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action?: {
    label: string;
    href: string;
  };
}

const mockNotifications: Notification[] = [
  {
    id: "notif_001",
    type: "success",
    title: "Capsule Verified",
    message:
      'Your truth capsule "Corporate Whistleblower Report" has been verified by the community.',
    timestamp: "2 hours ago",
    read: false,
    action: { label: "View Capsule", href: "/vault/cap_001" },
  },
  {
    id: "notif_002",
    type: "info",
    title: "GTT Yield Available",
    message:
      "You have earned 12.5 GTT tokens from your staked capsules. Claim your rewards now.",
    timestamp: "4 hours ago",
    read: false,
    action: { label: "Claim Rewards", href: "/staking" },
  },
  {
    id: "notif_003",
    type: "warning",
    title: "Validation Required",
    message:
      "New capsule requires your validation input as a community moderator.",
    timestamp: "1 day ago",
    read: true,
    action: { label: "Review", href: "/validator" },
  },
  {
    id: "notif_004",
    type: "info",
    title: "DAO Proposal Active",
    message:
      'New governance proposal: "Platform Fee Reduction" is now open for voting.',
    timestamp: "2 days ago",
    read: true,
    action: { label: "Vote Now", href: "/dao" },
  },
];

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-400" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      default:
        return <Info className="h-4 w-4 text-blue-400" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative text-slate-400 hover:text-white"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-80 p-0 bg-slate-800 border-slate-700"
        align="end"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h3 className="font-semibold text-white">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-blue-400 hover:text-blue-300 text-xs"
            >
              Mark all read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-slate-400">
              <Bell className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.map((notification, index) => (
                <div key={notification.id}>
                  <div
                    className={`p-4 hover:bg-slate-700/50 transition-colors cursor-pointer ${
                      !notification.read ? "bg-slate-700/30" : ""
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">{getIcon(notification.type)}</div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-medium text-white truncate">
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                          )}
                        </div>

                        <p className="text-xs text-slate-400 mb-2 leading-relaxed">
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Clock className="h-3 w-3" />
                            {notification.timestamp}
                          </div>

                          {notification.action && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs h-6 px-2 border-slate-600 text-blue-400 hover:bg-blue-600 hover:text-white"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.location.href =
                                  notification.action!.href;
                                setIsOpen(false);
                              }}
                            >
                              {notification.action.label}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {index < notifications.length - 1 && (
                    <Separator className="bg-slate-700" />
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="p-3 border-t border-slate-700">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-blue-400 hover:text-blue-300"
            onClick={() => {
              window.location.href = "/notifications";
              setIsOpen(false);
            }}
          >
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
