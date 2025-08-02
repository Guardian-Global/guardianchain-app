import React, { useState, useEffect } from "react";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { DynamicBadge } from "./DynamicBadgeSystem";
import { RoleBasedAccess } from "./RoleBasedAccess";
import { navigationItems, getVisibleNavigation } from "./NavigationData";

interface MobileNavigationProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export function MobileNavigation({
  isOpen,
  onToggle,
  onClose,
}: MobileNavigationProps) {
  const [location] = useLocation();
  const { user } = useAuth();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  );

  // Auto-close on route change
  useEffect(() => {
    onClose();
  }, [location, onClose]);

  // Get visible navigation items for current user
  const visibleItems = getVisibleNavigation(user);

  // Group navigation items by category
  const groupedItems = visibleItems.reduce(
    (groups: Record<string, any[]>, item: any) => {
      const category = item.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item);
      return groups;
    },
    {} as Record<string, any[]>,
  );

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "core":
        return "🏛️";
      case "creation":
        return "✍️";
      case "governance":
        return "🗳️";
      case "analytics":
        return "📊";
      case "tools":
        return "🛠️";
      case "network":
        return "🌐";
      default:
        return "📁";
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Mobile Sidebar */}
      <div className="fixed inset-y-0 left-0 w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-50 lg:hidden overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">G</span>
            </div>
            <h2 className="font-bold text-lg text-gray-900 dark:text-white">
              GuardianChain
            </h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* User Info */}
        {user && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                  {(user as any)?.firstName?.charAt(0) || "U"}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {(user as any)?.firstName} {(user as any)?.lastName}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {(user as any)?.tier} Tier
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <div className="p-4 space-y-2">
          {Object.entries(groupedItems).map(
            ([category, items]: [string, any]) => (
              <div key={category} className="space-y-1">
                {/* Category Header */}
                <Button
                  variant="ghost"
                  className="w-full justify-between p-2 h-auto"
                  onClick={() => toggleCategory(category)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getCategoryIcon(category)}</span>
                    <span className="font-medium capitalize">{category}</span>
                  </div>
                  {expandedCategories.has(category) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </Button>

                {/* Category Items */}
                {expandedCategories.has(category) && (
                  <div className="pl-4 space-y-1">
                    {(items as any[]).map((item: any) => (
                      <Link key={item.id} href={item.path}>
                        <div
                          className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                            location === item.path
                              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                              : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className="w-5 h-5" />
                            <div>
                              <p className="font-medium">{item.title}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                                {item.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <DynamicBadge routeId={item.id} />
                            {item.isNew && (
                              <Badge
                                variant="secondary"
                                className="bg-green-100 text-green-700 text-xs"
                              >
                                New
                              </Badge>
                            )}
                            {item.isPopular && (
                              <Badge
                                variant="secondary"
                                className="bg-purple-100 text-purple-700 text-xs"
                              >
                                Popular
                              </Badge>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ),
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
          <div className="text-center text-xs text-gray-500 dark:text-gray-400">
            GuardianChain v2.0
            <br />
            Truth. Preserved. Forever.
          </div>
        </div>
      </div>
    </>
  );
}

// Mobile Header Component
export function MobileHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="lg:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center">
            <span className="text-white text-xs font-bold">G</span>
          </div>
          <span className="font-bold text-gray-900 dark:text-white">
            GuardianChain
          </span>
        </div>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      {/* Mobile Navigation */}
      <MobileNavigation
        isOpen={isMobileMenuOpen}
        onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}
