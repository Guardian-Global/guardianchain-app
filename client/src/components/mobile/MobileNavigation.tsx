import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import {
  Menu,
  X,
  Home,
  Shield,
  Users,
  Trophy,
  Settings,
  LogOut,
  User,
  Wallet,
  BarChart3,
  FileText,
  Coins,
} from "lucide-react";

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNavigation({
  isOpen,
  onClose,
}: MobileNavigationProps) {
  const { user, isAuthenticated } = useAuth();
  const [location] = useLocation();

  const navigationItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/dashboard", icon: BarChart3, label: "Dashboard" },
    { href: "/profile", icon: User, label: "Profile" },
    { href: "/create-capsule", icon: FileText, label: "Create Capsule" },
    { href: "/yield-tracker", icon: Coins, label: "Yield Tracker" },
    { href: "/governance", icon: Trophy, label: "Governance" },
  ];

  const adminItems = [
    { href: "/admin", icon: Shield, label: "Admin Panel" },
    { href: "/system-health", icon: Settings, label: "System Health" },
  ];

  const isCurrentPath = (path: string) => {
    return location === path || (path !== "/" && location.startsWith(path));
  };

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-80 p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b bg-gradient-to-r from-purple-600 to-green-600">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">GUARDIANCHAIN</h2>
                <p className="text-purple-100 text-sm">Truth Protocol</p>
              </div>
            </div>
          </div>

          {/* User Info */}
          {isAuthenticated && user && (
            <div className="p-4 border-b bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user.firstName?.[0]}
                    {user.lastName?.[0]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto">
            <nav className="p-4 space-y-2">
              {/* Main Navigation */}
              <div className="space-y-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleLinkClick}
                  >
                    <div
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        isCurrentPath(item.href)
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Admin Section */}
              {isAuthenticated && user?.roles?.includes("ADMIN") && (
                <div className="pt-4 mt-4 border-t">
                  <div className="mb-2 px-3">
                    <Badge variant="outline" className="text-xs">
                      Admin
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    {adminItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={handleLinkClick}
                      >
                        <div
                          className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                            isCurrentPath(item.href)
                              ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                              : "hover:bg-muted text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <item.icon className="h-5 w-5" />
                          <span className="font-medium">{item.label}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </nav>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t space-y-2">
            {isAuthenticated ? (
              <>
                <Link href="/profile" onClick={handleLinkClick}>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    window.location.href = "/api/logout";
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700"
                onClick={() => {
                  window.location.href = "/api/login";
                }}
              >
                <Users className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Mobile Header Component
export function MobileHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between p-4">
          <Link href="/">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-green-600 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg">GUARDIANCHAIN</span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            {!isAuthenticated && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => (window.location.href = "/api/login")}
              >
                Sign In
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <MobileNavigation
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Spacer for fixed header */}
      <div className="lg:hidden h-16" />
    </>
  );
}
