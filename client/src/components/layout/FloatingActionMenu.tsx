import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Shield, 
  Upload, 
  MessageSquare, 
  Settings, 
  HelpCircle,
  X,
  Zap,
  Globe,
  Award
} from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { EnhancedButton } from "../ui/enhanced-button";

interface ActionItem {
  icon: React.ComponentType<any>;
  label: string;
  href?: string;
  onClick?: () => void;
  color: string;
  description: string;
}

const FloatingActionMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const actionItems: ActionItem[] = [
    {
      icon: Shield,
      label: "Create Capsule",
      href: "/create",
      color: "from-cyan-400 to-blue-500",
      description: "Seal your truth"
    },
    {
      icon: Upload,
      label: "Upload Media",
      href: "/upload",
      color: "from-purple-400 to-pink-500",
      description: "Add evidence"
    },
    {
      icon: MessageSquare,
      label: "Truth Auction",
      href: "/auctions/new",
      color: "from-yellow-400 to-orange-500",
      description: "Start investigation"
    },
    {
      icon: Globe,
      label: "Guardian Map",
      href: "/map",
      color: "from-green-400 to-emerald-500",
      description: "Explore network"
    },
    {
      icon: Award,
      label: "Verify Truth",
      href: "/verify",
      color: "from-indigo-400 to-purple-500",
      description: "Join verification"
    },
    {
      icon: HelpCircle,
      label: "Support",
      href: "/support",
      color: "from-gray-400 to-slate-500",
      description: "Get help"
    }
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Action Items */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-16 right-0 space-y-3"
          >
            {actionItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: 50, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 50, y: 20 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                {/* Tooltip */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className="bg-black/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-white/20 whitespace-nowrap"
                >
                  <div className="font-medium text-sm">{item.label}</div>
                  <div className="text-xs text-gray-400">{item.description}</div>
                </motion.div>

                {/* Action Button */}
                {item.href ? (
                  <Link href={item.href}>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300",
                        `bg-gradient-to-r ${item.color}`,
                        "text-white border border-white/20"
                      )}
                    >
                      <item.icon size={20} />
                    </motion.button>
                  </Link>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      item.onClick?.();
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300",
                      `bg-gradient-to-r ${item.color}`,
                      "text-white border border-white/20"
                    )}
                  >
                    <item.icon size={20} />
                  </motion.button>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        onClick={toggleMenu}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 relative overflow-hidden",
          isOpen 
            ? "bg-gradient-to-r from-red-500 to-pink-500" 
            : "bg-gradient-to-r from-cyan-500 via-purple-500 to-yellow-500"
        )}
      >
        {/* Animated background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-600 via-cyan-500 to-yellow-500"
          animate={{ rotate: isOpen ? 0 : 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Button content */}
        <div className="relative z-10 flex items-center justify-center w-full h-full bg-black/20 rounded-full backdrop-blur-sm">
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={24} className="text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="plus"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Plus size={24} className="text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-yellow-500 opacity-50 animate-pulse blur-sm" />
      </motion.button>

      {/* Background overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingActionMenu;