import React from "react";
import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import {
  Home,
  Shield,
  Users,
  Map,
  Trophy,
  FileText,
  GitBranch,
  Scroll,
  Star,
  Plus,
  Search,
  Settings,
  Menu,
  X,
  Zap,
  Globe,
  Crown,
} from "lucide-react";

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<any>;
  description: string;
  category: string;
  requiresAuth?: boolean;
  tier?: string;
  badge?: string;
}

const navigationItems: NavItem[] = [
  // Core Features
  {
    path: "/",
    label: "Dashboard",
    icon: Home,
    description: "Overview and main hub",
    category: "Core",
    requiresAuth: true,
  },
  {
    path: "/create",
    label: "Create Capsule",
    icon: Plus,
    description: "Quick capsule creation",
    category: "Core",
    requiresAuth: true,
  },
  {
    path: "/capsules",
    label: "My Capsules",
    icon: Shield,
    description: "View your truth capsules",
    category: "Core",
    requiresAuth: true,
  },

  // Advanced Features
  {
    path: "/eternal-contracts",
    label: "Eternal Contracts",
    icon: Scroll,
    description: "Immutable declarations",
    category: "Advanced",
    requiresAuth: true,
    tier: "Creator",
  },
  {
    path: "/lineage",
    label: "Truth Lineage",
    icon: GitBranch,
    description: "Memory inheritance tracking",
    category: "Advanced",
    requiresAuth: true,
    tier: "Seeker",
  },

  // Social & Discovery
  {
    path: "/guardian-map",
    label: "Guardian Map",
    icon: Map,
    description: "Global guardian network",
    category: "Social",
    badge: "New",
  },
  {
    path: "/smri-dashboard",
    label: "SMRI Dashboard",
    icon: Trophy,
    description: "Reputation leaderboards",
    category: "Social",
    badge: "Popular",
  },
  {
    path: "/reputation",
    label: "Reputation Index",
    icon: Crown,
    description: "Truth score lookup",
    category: "Social",
  },

  // Tools & Utilities
  {
    path: "/yield",
    label: "GTT Yield",
    icon: Zap,
    description: "Token rewards dashboard",
    category: "Tools",
    requiresAuth: true,
  },
  {
    path: "/dao",
    label: "DAO Governance",
    icon: Users,
    description: "Community voting",
    category: "Tools",
    tier: "Sovereign",
  },
  {
    path: "/search",
    label: "Truth Search",
    icon: Search,
    description: "Find capsules and content",
    category: "Tools",
  },
];

export default function NavigationMenu() {
  const [, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const userTier = (user as any)?.tier || "EXPLORER";

  const canAccessItem = (item: NavItem) => {
    if (item.requiresAuth && !isAuthenticated) return false;
    if (item.tier) {
      const tierOrder = ["EXPLORER", "SEEKER", "CREATOR", "SOVEREIGN"];
      const userTierIndex = tierOrder.indexOf(userTier);
      const requiredTierIndex = tierOrder.indexOf(item.tier.toUpperCase());
      return userTierIndex >= requiredTierIndex;
    }
    return true;
  };

  const groupedItems = navigationItems.reduce(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, NavItem[]>,
  );

  const handleNavigation = (path: string) => {
    setLocation(path);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-50 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg"
        size="sm"
      >
        <Menu className="w-5 h-5" />
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="flex justify-center items-start pt-8 px-4">
        <Card className="w-full max-w-4xl bg-black/90 backdrop-blur-xl border-purple-500/20">
          <CardContent className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-purple-300">
                  GuardianChain Navigation
                </h2>
                <p className="text-gray-400">
                  Explore the truth preservation ecosystem
                </p>
              </div>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* User Status */}
            {isAuthenticated && (
              <div className="bg-slate-800/50 rounded-lg p-3 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">
                      Welcome back, {(user as any)?.firstName || "Guardian"}
                    </p>
                    <p className="text-sm text-gray-400">Tier: {userTier}</p>
                  </div>
                  <Badge className="bg-purple-600 text-white border-none">
                    {userTier}
                  </Badge>
                </div>
              </div>
            )}

            {/* Navigation Categories */}
            <div className="space-y-6">
              {Object.entries(groupedItems).map(([category, items]) => (
                <div key={category}>
                  <h3 className="text-lg font-semibold text-gray-300 mb-3 flex items-center">
                    {category === "Core" && <Home className="w-5 h-5 mr-2" />}
                    {category === "Advanced" && (
                      <Star className="w-5 h-5 mr-2" />
                    )}
                    {category === "Social" && (
                      <Users className="w-5 h-5 mr-2" />
                    )}
                    {category === "Tools" && (
                      <Settings className="w-5 h-5 mr-2" />
                    )}
                    {category}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {items.map((item) => {
                      const accessible = canAccessItem(item);
                      const IconComponent = item.icon;

                      return (
                        <Button
                          key={item.path}
                          onClick={() =>
                            accessible ? handleNavigation(item.path) : null
                          }
                          variant="ghost"
                          className={`h-auto p-4 justify-start text-left ${
                            accessible
                              ? "text-white hover:bg-slate-800/50 hover:text-purple-300"
                              : "text-gray-500 cursor-not-allowed opacity-50"
                          }`}
                          disabled={!accessible}
                        >
                          <div className="flex items-start space-x-3 w-full">
                            <IconComponent
                              className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                                accessible ? "text-purple-400" : "text-gray-500"
                              }`}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">
                                  {item.label}
                                </span>
                                {item.badge && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs border-green-500/30 text-green-300"
                                  >
                                    {item.badge}
                                  </Badge>
                                )}
                                {item.tier && !accessible && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs border-orange-500/30 text-orange-300"
                                  >
                                    {item.tier}+
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-400 mt-1">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-8 pt-6 border-t border-gray-700">
              <h3 className="text-lg font-semibold text-gray-300 mb-3">
                Quick Actions
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => handleNavigation("/create")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={!isAuthenticated}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Capsule
                </Button>

                <Button
                  onClick={() => handleNavigation("/guardian-map")}
                  variant="outline"
                  className="border-green-500/30 text-green-300 hover:bg-green-500/10"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Explore Network
                </Button>

                <Button
                  onClick={() => handleNavigation("/smri-dashboard")}
                  variant="outline"
                  className="border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/10"
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  View Rankings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
