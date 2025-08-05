import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  Shield, 
  User, 
  Settings, 
  Menu, 
  X, 
  Coins,
  BarChart3,
  Globe,
  Zap,
  Crown,
  FileText,
  Award,
  Users,
  TrendingUp,
  Lock
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { AdvancedCard } from "@/components/ui/advanced-card";
import EnhancedGuardianLogo from "@/components/EnhancedGuardianLogo";

interface NavigationItem {
  path: string;
  label: string;
  icon: React.ComponentType<any>;
  badge?: string;
  tier?: "EXPLORER" | "SEEKER" | "CREATOR" | "SOVEREIGN";
  color?: string;
}

const EnhancedNavigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();

  const navigationItems: NavigationItem[] = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: Home,
      color: "text-cyan-400"
    },
    {
      path: "/create",
      label: "Create Capsule",
      icon: Shield,
      color: "text-purple-400"
    },
    {
      path: "/vault",
      label: "Truth Vault",
      icon: Lock,
      color: "text-yellow-400"
    },
    {
      path: "/profile",
      label: "Profile",
      icon: User,
      color: "text-green-400"
    },
    {
      path: "/leaderboard",
      label: "Leaderboard",
      icon: TrendingUp,
      color: "text-orange-400"
    },
    {
      path: "/governance",
      label: "DAO",
      icon: Users,
      color: "text-blue-400",
      tier: "SEEKER"
    },
    {
      path: "/analytics",
      label: "Analytics",
      icon: BarChart3,
      color: "text-indigo-400",
      tier: "CREATOR"
    },
    {
      path: "/commander",
      label: "Commander",
      icon: Crown,
      color: "text-red-400",
      tier: "SOVEREIGN",
      badge: "ADMIN"
    }
  ];

  // Filter items based on user tier
  const getFilteredItems = () => {
    if (!user?.tier) return navigationItems.slice(0, 4); // Basic items

    const tierHierarchy = ["EXPLORER", "SEEKER", "CREATOR", "SOVEREIGN"];
    const userTierIndex = tierHierarchy.indexOf(user.tier);

    return navigationItems.filter(item => {
      if (!item.tier) return true;
      const itemTierIndex = tierHierarchy.indexOf(item.tier);
      return userTierIndex >= itemTierIndex;
    });
  };

  const filteredItems = getFilteredItems();

  const NavItem: React.FC<{ item: NavigationItem; mobile?: boolean }> = ({ item, mobile = false }) => {
    const isActive = location === item.path;
    const Icon = item.icon;

    return (
      <Link href={item.path}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 cursor-pointer group",
            mobile ? "w-full" : "",
            isActive 
              ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30" 
              : "hover:bg-white/10 border border-transparent"
          )}
          onClick={() => mobile && setIsMobileMenuOpen(false)}
        >
          <Icon 
            size={20} 
            className={cn(
              "transition-colors",
              isActive ? item.color : "text-gray-400 group-hover:text-white"
            )}
          />
          <span className={cn(
            "font-medium transition-colors",
            isActive ? "text-white" : "text-gray-300 group-hover:text-white"
          )}>
            {item.label}
          </span>
          
          {item.badge && (
            <span className="px-2 py-1 text-xs font-bold bg-red-500 text-white rounded-full">
              {item.badge}
            </span>
          )}

          {isActive && (
            <motion.div
              layoutId="activeIndicator"
              className="absolute left-0 w-1 h-8 bg-gradient-to-b from-cyan-400 to-purple-500 rounded-r-full"
            />
          )}
        </motion.div>
      </Link>
    );
  };

  if (!isAuthenticated) return null;

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="hidden lg:flex fixed left-4 top-4 bottom-4 w-64 z-40"
      >
        <AdvancedCard variant="glass" className="w-full p-6 flex flex-col">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <EnhancedGuardianLogo size="md" variant="full" animated={true} />
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-white">GuardianChain</h2>
                <p className="text-xs text-gray-400">Sovereign Memory</p>
              </div>
            </div>
            
            {/* User Info */}
            <div className="p-3 bg-black/20 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-blue-500" />
                <span className="text-sm font-medium text-white">
                  {user?.firstName || "Guardian"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded-full">
                  {user?.tier || "EXPLORER"}
                </span>
                <Coins className="w-3 h-3 text-yellow-400" />
                <span className="text-xs text-yellow-400">GTT</span>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 space-y-2">
            {filteredItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-white/10">
            <Link href="/settings">
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                <Settings size={20} className="text-gray-400" />
                <span className="text-gray-300">Settings</span>
              </div>
            </Link>
            
            <div className="mt-3 p-3 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium text-white">GTT Rewards</span>
              </div>
              <p className="text-xs text-gray-400">
                Earn tokens by sealing truth
              </p>
            </div>
          </div>
        </AdvancedCard>
      </motion.nav>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10"
        >
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <EnhancedGuardianLogo size="sm" variant="full" animated={true} />
            </div>

            <EnhancedButton
              variant="quantum"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </EnhancedButton>
          </div>
        </motion.header>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-black/95 backdrop-blur-md border-l border-white/10 z-40 p-6"
            >
              <div className="mt-16 space-y-3">
                {filteredItems.map((item) => (
                  <NavItem key={item.path} item={item} mobile />
                ))}
                
                <div className="pt-4 border-t border-white/10">
                  <NavItem 
                    item={{
                      path: "/settings",
                      label: "Settings",
                      icon: Settings,
                      color: "text-gray-400"
                    }}
                    mobile 
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Backdrop */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default EnhancedNavigation;