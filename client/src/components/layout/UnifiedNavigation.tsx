import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useUnifiedAuth } from "@/hooks/useUnifiedAuth";
import { useTierContext } from "@/context/TierContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  X,
  ChevronDown,
  Shield,
  Target,
  Heart,
  Gavel,
  Eye,
  Mic,
  Palette,
  Beaker,
  FileText,
  Music,
  User,
  Settings,
  Lock,
  Crown,
  BarChart3,
  Building,
  LogOut,
  AlertTriangle,
  Globe,
} from "lucide-react";
import { LogoDisplay } from "@/components/assets/LogoDisplay";
import WalletConnect from "@/components/web3/wallet-connect";
import { BRAND_COLORS } from "@/lib/constants";

interface NavigationItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
  tier?: string[];
  description?: string;
}

interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

export default function UnifiedNavigation() {
  const { user, isAuthenticated, logout } = useUnifiedAuth();
  const { userRole: tierRole, isLoading: tierLoading } = useTierContext();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Use TierContext for role-based navigation
  const userTier = tierRole || user?.tier || "guest";
  const userRole = user?.role || "USER";
  const isAdmin = userRole === "ADMIN" || userRole === "FOUNDER" || userRole === "MASTER_ADMIN";
  const isPro = ["pro", "enterprise", "CREATOR", "SOVEREIGN"].includes(userTier) || isAdmin;

  // Main navigation sections organized by functionality
  const navigationSections: NavigationSection[] = [
    {
      title: "Core Platform",
      items: [
        { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
        { name: "Create Capsule", href: "/create-capsule", icon: FileText },
        { name: "All Capsules", href: "/capsules", icon: Eye },
        { name: "Profile", href: "/profile", icon: User },
      ],
    },
    {
      title: "Capsule Types",
      items: [
        { name: "Podcaster", href: "/capsule/podcaster", icon: Mic },
        { name: "Artist", href: "/capsule/artist", icon: Palette },
        { name: "Scientist", href: "/capsule/scientist", icon: Beaker },
        { name: "Media", href: "/capsule/media", icon: FileText },
        { name: "Musician", href: "/capsule/musician", icon: Music },
        { name: "Conspiracy", href: "/capsule/conspiracy", icon: Eye },
      ],
    },
    {
      title: "Veritas Tools",
      items: [
        { 
          name: "Veritas Seal", 
          href: "/veritas-seal", 
          icon: Shield, 
          tier: ["CREATOR", "SOVEREIGN"],
          description: "DocuSign legal verification"
        },
        { 
          name: "Truth Bounty", 
          href: "/truth-bounty", 
          icon: Target, 
          tier: ["CREATOR", "SOVEREIGN"],
          description: "Crowdsource investigations"
        },
        { 
          name: "Truth Redemption", 
          href: "/truth-redemption", 
          icon: Heart, 
          tier: ["CREATOR", "SOVEREIGN"],
          description: "Public acknowledgments"
        },
        { 
          name: "Conspiracy Capsule", 
          href: "/conspiracy-capsule", 
          icon: Eye, 
          tier: ["CREATOR", "SOVEREIGN"],
          description: "Secure conspiracy disclosure"
        },
      ],
    },
    {
      title: "Specialized Portals",
      items: [
        { 
          name: "Whistleblower Sanctuary", 
          href: "/whistleblower-sanctuary", 
          icon: AlertTriangle, 
          description: "Secure truth disclosure portal"
        },
        { 
          name: "Specialized Intake", 
          href: "/specialized-intake", 
          icon: Target, 
          description: "11 specialized truth categories"
        },
        { 
          name: "Category Discovery", 
          href: "/category-discovery", 
          icon: Globe, 
          description: "Strategic truth verification analysis"
        },
      ],
    },
    {
      title: "Analytics & Data",
      items: [
        { name: "Analytics", href: "/analytics", icon: BarChart3, tier: ["CREATOR", "SOVEREIGN"] },
        { name: "Token Launch", href: "/token-launch", icon: Crown },
        { name: "Blockchain Playground", href: "/blockchain-playground", icon: Shield },
      ],
    },
  ];

  // Admin-only navigation
  const adminSection: NavigationSection = {
    title: "Administration",
    items: [
      { name: "User Management", href: "/admin/users", icon: User },
      { name: "Treasury", href: "/admin/treasury", icon: Building },
      { name: "Chain Audit", href: "/admin/chain-audit", icon: Shield },
      { name: "Master Access", href: "/master-access", icon: Crown },
    ],
  };

  const isCurrentPath = (href: string) => location === href;

  const canAccessItem = (item: NavigationItem) => {
    if (!item.tier) return true; // Public access
    if (isAdmin) return true; // Admins can access everything
    
    // Map tier levels for access control
    const tierMap: { [key: string]: string[] } = {
      "guest": [],
      "explorer": ["EXPLORER"],
      "pro": ["CREATOR", "SOVEREIGN", "pro"],
      "enterprise": ["CREATOR", "SOVEREIGN", "pro", "enterprise"],
      "admin": ["ADMIN", "CREATOR", "SOVEREIGN", "pro", "enterprise"]
    };
    
    const allowedTiers = tierMap[userTier] || [];
    return item.tier.some(tier => allowedTiers.includes(tier) || allowedTiers.includes(tier.toLowerCase()));
  };

  const renderNavigationItem = (item: NavigationItem, isMobile = false) => {
    const canAccess = canAccessItem(item);
    const Icon = item.icon;
    
    if (!canAccess) {
      return (
        <div
          key={item.name}
          className={`flex items-center gap-2 px-3 py-2 text-slate-400 cursor-not-allowed ${
            isMobile ? "w-full" : ""
          }`}
          title={`${item.tier?.join("/") || "Pro"} tier required`}
        >
          {Icon && <Icon className="w-4 h-4" />}
          <span className="flex-1">{item.name}</span>
          <Lock className="w-3 h-3" />
        </div>
      );
    }

    return (
      <Link key={item.name} href={item.href}>
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
            isCurrentPath(item.href)
              ? "bg-purple-600/20 text-purple-400"
              : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
          } ${isMobile ? "w-full" : ""}`}
        >
          {Icon && <Icon className="w-4 h-4" />}
          <span className="flex-1">{item.name}</span>
          {item.badge && (
            <Badge variant="outline" className="text-xs">
              {item.badge}
            </Badge>
          )}
        </div>
      </Link>
    );
  };

  const renderDesktopDropdown = (section: NavigationSection) => (
    <DropdownMenu key={section.title}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="text-slate-300 hover:text-white hover:bg-slate-700/50"
        >
          {section.title}
          <ChevronDown className="w-4 h-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700">
        {section.items.map((item) => {
          const canAccess = canAccessItem(item);
          const Icon = item.icon;
          
          if (!canAccess) {
            return (
              <DropdownMenuItem 
                key={item.name} 
                disabled
                className="text-slate-400 cursor-not-allowed"
              >
                {Icon && <Icon className="w-4 h-4 mr-2" />}
                {item.name}
                <Lock className="w-3 h-3 ml-auto" />
              </DropdownMenuItem>
            );
          }

          return (
            <DropdownMenuItem key={item.name} asChild>
              <Link href={item.href} className="flex items-center w-full">
                {Icon && <Icon className="w-4 h-4 mr-2" />}
                <div className="flex-1">
                  <div>{item.name}</div>
                  {item.description && (
                    <div className="text-xs text-slate-400">{item.description}</div>
                  )}
                </div>
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <LogoDisplay size="sm" type="guardianchain" />
              <span className="text-xl font-bold text-white">GUARDIANCHAIN</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationSections.map(renderDesktopDropdown)}
            {isAdmin && renderDesktopDropdown(adminSection)}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <WalletConnect />
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-slate-300 hover:text-white">
                    <User className="w-4 h-4 mr-2" />
                    {user?.firstName || "User"}
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-slate-800 border-slate-700">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center w-full">
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center w-full">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => logout()} className="text-red-400">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button>Login</Button>
              </Link>
            )}

            {/* Mobile Menu Trigger */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-slate-900 border-slate-800">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-white">Navigation</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                
                <div className="space-y-6">
                  {navigationSections.map((section) => (
                    <div key={section.title}>
                      <h3 className="text-sm font-medium text-slate-400 mb-2">
                        {section.title}
                      </h3>
                      <div className="space-y-1">
                        {section.items.map((item) => renderNavigationItem(item, true))}
                      </div>
                    </div>
                  ))}
                  
                  {isAdmin && (
                    <div>
                      <h3 className="text-sm font-medium text-slate-400 mb-2">
                        {adminSection.title}
                      </h3>
                      <div className="space-y-1">
                        {adminSection.items.map((item) => renderNavigationItem(item, true))}
                      </div>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      
      {/* Tier Indicator */}
      {isAuthenticated && (
        <div className="bg-slate-800/50 border-t border-slate-700 px-4 py-1">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <span>Current Tier:</span>
              <Badge 
                variant="outline" 
                className={`${
                  userTier === "SOVEREIGN" ? "text-gold-400 border-gold-600" :
                  userTier === "CREATOR" ? "text-purple-400 border-purple-600" :
                  userTier === "SEEKER" ? "text-blue-400 border-blue-600" :
                  "text-green-400 border-green-600"
                }`}
              >
                {userTier}
              </Badge>
            </div>
            {!isPro && (
              <Link href="/upgrade">
                <Button variant="outline" size="sm" className="text-xs border-purple-600 text-purple-400">
                  Upgrade for More Features
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}