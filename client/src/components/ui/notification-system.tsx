import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertTriangle, Info, AlertCircle, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info" | "quantum";
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  persistent?: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
};

const NotificationItem: React.FC<{
  notification: Notification;
  onRemove: (id: string) => void;
}> = ({ notification, onRemove }) => {
  const { id, type, title, message, action, persistent } = notification;

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
    quantum: Zap
  };

  const styles = {
    success: {
      bg: "bg-gradient-to-r from-green-500/20 to-emerald-500/20",
      border: "border-green-400/30",
      icon: "text-green-400"
    },
    error: {
      bg: "bg-gradient-to-r from-red-500/20 to-pink-500/20",
      border: "border-red-400/30",
      icon: "text-red-400"
    },
    warning: {
      bg: "bg-gradient-to-r from-yellow-500/20 to-orange-500/20",
      border: "border-yellow-400/30",
      icon: "text-yellow-400"
    },
    info: {
      bg: "bg-gradient-to-r from-blue-500/20 to-cyan-500/20",
      border: "border-blue-400/30",
      icon: "text-blue-400"
    },
    quantum: {
      bg: "bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-yellow-500/20",
      border: "border-purple-400/30",
      icon: "text-purple-400"
    }
  };

  const Icon = icons[type];
  const style = styles[type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.5 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "relative overflow-hidden rounded-lg border backdrop-blur-md shadow-lg max-w-sm w-full",
        style.bg,
        style.border
      )}
    >
      {/* Quantum shimmer effect */}
      {type === "quantum" && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] animate-[shimmer_2s_infinite]" />
      )}

      <div className="p-4">
        <div className="flex items-start gap-3">
          <Icon className={cn("w-5 h-5 mt-0.5 flex-shrink-0", style.icon)} />
          
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-white">{title}</h4>
            {message && (
              <p className="mt-1 text-sm text-gray-300">{message}</p>
            )}
            
            {action && (
              <button
                onClick={action.onClick}
                className="mt-3 px-3 py-1 text-xs font-medium bg-white/10 hover:bg-white/20 rounded-md transition-colors text-white"
              >
                {action.label}
              </button>
            )}
          </div>

          {!persistent && (
            <button
              onClick={() => onRemove(id)}
              className="p-1 hover:bg-white/10 rounded-md transition-colors text-gray-400 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Progress bar for auto-dismiss */}
      {!persistent && (
        <motion.div
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: notification.duration || 5, ease: "linear" }}
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 origin-left"
        />
      )}
    </motion.div>
  );
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newNotification: Notification = {
      id,
      duration: 5000,
      ...notification
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Auto-remove after duration if not persistent
    if (!newNotification.persistent) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      removeNotification,
      clearAll
    }}>
      {children}
      
      {/* Notification Container */}
      <div className="fixed top-4 right-4 z-[100] space-y-2 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {notifications.map(notification => (
            <div key={notification.id} className="pointer-events-auto">
              <NotificationItem
                notification={notification}
                onRemove={removeNotification}
              />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};

// Convenience hooks for different notification types
export const useNotificationHelpers = () => {
  const { addNotification } = useNotifications();

  return {
    notifySuccess: (title: string, message?: string) =>
      addNotification({ type: "success", title, message }),
    
    notifyError: (title: string, message?: string) =>
      addNotification({ type: "error", title, message }),
    
    notifyWarning: (title: string, message?: string) =>
      addNotification({ type: "warning", title, message }),
    
    notifyInfo: (title: string, message?: string) =>
      addNotification({ type: "info", title, message }),
    
    notifyQuantum: (title: string, message?: string) =>
      addNotification({ type: "quantum", title, message }),
  };
};