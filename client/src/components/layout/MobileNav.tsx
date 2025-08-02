import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  LayoutDashboard,
  FileText,
  Plus,
  TrendingUp,
  Users,
  Settings,
  Shield,
  Crown,
  Zap,
} from "lucide-react";

interface Route {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
  badge?: string;
}

const routes: Route[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["guest", "member", "moderator", "admin", "dao-owner"],
  },
  {
    name: "Admin Panel",
    href: "/admin",
    icon: Settings,
    roles: ["admin", "dao-owner"],
    badge: "ADMIN",
  },
  {
    name: "Capsules",
    href: "/vault",
    icon: FileText,
    roles: ["guest", "member", "moderator", "admin", "dao-owner"],
  },
  {
    name: "Create",
    href: "/create",
    icon: Plus,
    roles: ["member", "moderator", "admin", "dao-owner"],
  },
  {
    name: "Staking",
    href: "/staking",
    icon: TrendingUp,
    roles: ["member", "moderator", "admin", "dao-owner"],
  },
  {
    name: "DAO",
    href: "/dao",
    icon: Crown,
    roles: ["dao-owner"],
    badge: "DAO",
  },
  {
    name: "Validator",
    href: "/validator",
    icon: Shield,
    roles: ["moderator", "admin", "dao-owner"],
    badge: "MOD+",
  },
];

const tierHierarchy = {
  guest: 0,
  member: 1,
  moderator: 2,
  admin: 3,
  "dao-owner": 4,
};

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const currentTier = (user as any)?.tier?.toLowerCase() || "guest";
  const currentTierLevel =
    tierHierarchy[currentTier as keyof typeof tierHierarchy] ?? 0;

  const availableRoutes = routes.filter((route) => {
    return route.roles.some((role) => {
      const roleLevel = tierHierarchy[role as keyof typeof tierHierarchy] ?? 0;
      return currentTierLevel >= roleLevel;
    });
  });

  return (
    <>
      {/* Mobile menu button - only visible on mobile */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="bg-slate-800/80 text-white hover:bg-slate-700/80 backdrop-blur-sm"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile navigation overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Slide-out menu */}
          <div className="fixed left-0 top-0 h-full w-80 max-w-[90vw] bg-slate-800 border-r border-slate-700 transform transition-transform duration-300 ease-in-out">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-blue-400" />
                <h1 className="font-bold text-lg text-white">GuardianChain</h1>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* User info */}
            <div className="p-4 border-b border-slate-700">
              <div className="text-sm font-medium text-white mb-1">
                {(user as any)?.firstName || "Debug"}{" "}
                {(user as any)?.lastName || "User"}
              </div>
              <div className="text-xs text-slate-400 mb-2">
                {(user as any)?.email || "debug@guardianchain.app"}
              </div>
              <Badge variant="outline" className="text-xs">
                {currentTier.toUpperCase()}
              </Badge>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-2">
              {availableRoutes.map((route) => {
                const Icon = route.icon;
                return (
                  <Link key={route.name} href={route.href}>
                    <div
                      className="flex items-center gap-3 px-3 py-3 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors group cursor-pointer"
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="h-5 w-5 text-slate-400 group-hover:text-blue-400" />
                      <span className="font-medium flex-1">{route.name}</span>
                      {route.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {route.badge}
                        </Badge>
                      )}
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* Tier upgrade prompt */}
            {currentTierLevel < 2 && (
              <div className="m-4 p-4 bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-lg border border-purple-500/20">
                <h3 className="text-sm font-semibold text-purple-200 mb-2">
                  Unlock More Features
                </h3>
                <p className="text-xs text-slate-400 mb-3">
                  Upgrade your tier to access advanced tools
                </p>
                <Link href="/tier-access">
                  <div
                    className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-md transition-colors cursor-pointer inline-block"
                    onClick={() => setIsOpen(false)}
                  >
                    View Tiers
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNav;
