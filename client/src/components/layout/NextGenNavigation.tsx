import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { 
  Home, 
  Vault, 
  Wallet, 
  ShieldCheck, 
  Trophy, 
  Settings, 
  User, 
  Menu, 
  X,
  Zap,
  Globe,
  Database,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EnhancedButton } from "../ui/enhanced-button";
import { useAuth } from "@/hooks/useAuth";

const navigationItems = [
  { href: "/", label: "Home", icon: Home, badge: null },
  { href: "/dashboard", label: "Dashboard", icon: Database, badge: null },
  { href: "/vault", label: "Vault", icon: Vault, badge: "NEW" },
  { href: "/auctions", label: "Truth Auctions", icon: Trophy, badge: "HOT" },
  { href: "/profile", label: "Profile", icon: User, badge: null },
  { href: "/analytics", label: "Analytics", icon: TrendingUp, badge: null },
  { href: "/settings", label: "Settings", icon: Settings, badge: null },
];

interface NavigationItemProps {
  href: string;
  label: string;
  icon: React.ComponentType<any>;
  badge?: string | null;
  isActive: boolean;
  isMobile?: boolean;
  onClick?: () => void;
}

const NavigationItem: React.FC<NavigationItemProps> = ({ 
  href, 
  label, 
  icon: Icon, 
  badge, 
  isActive, 
  isMobile = false,
  onClick 
}) => {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={cn(
          "relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group cursor-pointer",
          isActive 
            ? "bg-gradient-to-r from-yellow-400/20 to-orange-500/20 text-yellow-600 border border-yellow-400/30" 
            : "hover:bg-white/10 text-gray-300 hover:text-white",
          isMobile ? "w-full justify-start" : "justify-center lg:justify-start"
        )}
      >
        {/* Active indicator */}
        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-r-full"
            initial={false}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
        
        {/* Icon with glow effect */}
        <div className={cn(
          "relative",
          isActive && "text-yellow-500"
        )}>
          <Icon size={20} />
          {isActive && (
            <div className="absolute inset-0 text-yellow-500 animate-pulse opacity-50">
              <Icon size={20} />
            </div>
          )}
        </div>
        
        {/* Label - hidden on desktop for sidebar, shown on mobile */}
        <span className={cn(
          "font-medium transition-all duration-300",
          !isMobile && "hidden lg:block"
        )}>
          {label}
        </span>
        
        {/* Badge */}
        {badge && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="px-2 py-1 text-xs bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full font-bold ml-auto"
          >
            {badge}
          </motion.span>
        )}
        
        {/* Hover glow effect */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-yellow-400/0 to-orange-500/0 group-hover:from-yellow-400/10 group-hover:to-orange-500/10 transition-all duration-300" />
      </motion.div>
    </Link>
  );
};

const DesktopSidebar: React.FC = () => {
  const [location] = useLocation();
  const { user } = useAuth();

  return (
    <motion.nav
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-0 top-0 h-full w-16 lg:w-64 bg-black/90 backdrop-blur-xl border-r border-white/10 z-50 flex flex-col"
    >
      {/* Logo Section */}
      <div className="p-4 border-b border-white/10">
        <Link href="/">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
              <ShieldCheck className="text-black" size={20} />
            </div>
            <div className="hidden lg:block">
              <h1 className="text-lg font-bold text-white">GuardianChain</h1>
              <p className="text-xs text-gray-400">Truth Protocol</p>
            </div>
          </motion.div>
        </Link>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => (
          <NavigationItem
            key={item.href}
            {...item}
            isActive={location === item.href}
          />
        ))}
      </div>

      {/* User Section */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-medium text-white truncate">
              {user?.firstName || "Guardian"}
            </p>
            <p className="text-xs text-gray-400">{user?.tier || "Explorer"}</p>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

const MobileNavigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  return (
    <>
      {/* Mobile Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 h-16 bg-black/90 backdrop-blur-xl border-b border-white/10 z-50 flex items-center justify-between px-4 lg:hidden"
      >
        <Link href="/">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
              <ShieldCheck className="text-black" size={20} />
            </div>
            <span className="text-lg font-bold text-white">GuardianChain</span>
          </div>
        </Link>

        <EnhancedButton
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="text-white"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </EnhancedButton>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-16 bottom-0 w-80 bg-black/95 backdrop-blur-xl border-l border-white/10 z-50 p-4 space-y-2 lg:hidden"
          >
            {navigationItems.map((item) => (
              <NavigationItem
                key={item.href}
                {...item}
                isActive={location === item.href}
                isMobile={true}
                onClick={() => setIsOpen(false)}
              />
            ))}
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Bar */}
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 h-16 bg-black/90 backdrop-blur-xl border-t border-white/10 z-50 flex items-center justify-around px-4 lg:hidden"
      >
        {navigationItems.slice(0, 5).map((item) => (
          <Link key={item.href} href={item.href}>
            <motion.div
              whileTap={{ scale: 0.9 }}
              className={cn(
                "relative flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
                location === item.href ? "text-yellow-500" : "text-gray-400"
              )}
            >
              <item.icon size={20} />
              <span className="text-xs font-medium">{item.label}</span>
              {item.badge && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </motion.div>
          </Link>
        ))}
      </motion.nav>
    </>
  );
};

export const NextGenNavigation: React.FC = () => {
  return (
    <>
      {/* Temporarily disable desktop sidebar to fix layout overlap */}
      {/* <div className="hidden lg:block">
        <DesktopSidebar />
      </div> */}
      <div className="lg:hidden">
        <MobileNavigation />
      </div>
    </>
  );
};

export default NextGenNavigation;