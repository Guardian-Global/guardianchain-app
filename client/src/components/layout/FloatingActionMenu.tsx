import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { 
  Plus, 
  Shield, 
  Zap, 
  User, 
  Settings, 
  Lock,
  Coins,
  Crown,
  X
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { EnhancedButton } from "@/components/ui/enhanced-button";

interface ActionItem {
  path: string;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  tier?: "EXPLORER" | "SEEKER" | "CREATOR" | "SOVEREIGN";
}

const FloatingActionMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const actions: ActionItem[] = [
    {
      path: "/create",
      label: "Create Capsule",
      icon: Shield,
      color: "from-cyan-500 to-purple-500"
    },
    {
      path: "/vault",
      label: "Truth Vault",
      icon: Lock,
      color: "from-purple-500 to-pink-500"
    },
    {
      path: "/yield",
      label: "GTT Yield",
      icon: Coins,
      color: "from-yellow-500 to-orange-500"
    },
    {
      path: "/profile",
      label: "Profile",
      icon: User,
      color: "from-green-500 to-blue-500"
    },
    {
      path: "/governance",
      label: "DAO",
      icon: Crown,
      color: "from-indigo-500 to-purple-500",
      tier: "SEEKER"
    },
    {
      path: "/settings",
      label: "Settings",
      icon: Settings,
      color: "from-gray-500 to-slate-500"
    }
  ];

  // Filter actions based on user tier
  const getFilteredActions = () => {
    if (!user?.tier) return actions.slice(0, 4); // Basic actions

    const tierHierarchy = ["EXPLORER", "SEEKER", "CREATOR", "SOVEREIGN"];
    const userTierIndex = tierHierarchy.indexOf(user.tier);

    return actions.filter(action => {
      if (!action.tier) return true;
      const actionTierIndex = tierHierarchy.indexOf(action.tier);
      return userTierIndex >= actionTierIndex;
    });
  };

  const filteredActions = getFilteredActions();

  const containerVariants = {
    closed: {
      scale: 0.8,
      opacity: 0
    },
    open: {
      scale: 1,
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    closed: {
      scale: 0,
      opacity: 0,
      y: 20
    },
    open: {
      scale: 1,
      opacity: 1,
      y: 0
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Main Action Button */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative"
      >
        <EnhancedButton
          variant="quantum"
          size="lg"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-14 h-14 rounded-full shadow-lg",
            isOpen && "bg-red-500 hover:bg-red-600"
          )}
        >
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? <X size={24} /> : <Plus size={24} />}
          </motion.div>
        </EnhancedButton>

        {/* Pulse Effect */}
        {!isOpen && (
          <motion.div
            className="absolute inset-0 rounded-full bg-cyan-500/30"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </motion.div>

      {/* Action Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={containerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="absolute bottom-20 right-0 space-y-3"
          >
            {filteredActions.map((action, index) => {
              const Icon = action.icon;
              
              return (
                <motion.div
                  key={action.path}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, x: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href={action.path}>
                    <div
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg",
                        "bg-black/80 backdrop-blur-md border border-white/10",
                        "cursor-pointer group",
                        "hover:border-white/20 transition-all duration-300"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center",
                        action.color
                      )}>
                        <Icon size={20} className="text-white" />
                      </div>
                      
                      <div className="text-white">
                        <div className="font-medium text-sm">{action.label}</div>
                        {action.tier && (
                          <div className="text-xs text-gray-400">
                            Requires {action.tier}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
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