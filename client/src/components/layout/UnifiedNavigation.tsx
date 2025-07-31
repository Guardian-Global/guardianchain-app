import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/components/web3/theme-provider';
import { 
  BarChart3, 
  FileText, 
  Eye, 
  User, 
  Target, 
  Mic, 
  Palette, 
  Beaker, 
  Music, 
  Crown, 
  TrendingUp, 
  Users, 
  Award, 
  Zap, 
  Globe, 
  Shield, 
  Settings, 
  LogOut, 
  Menu,
  X,
  ChevronDown,
  Coins,
  BookOpen,
  Database,
  BarChart2,
  Network,
  Lock,
  MessageSquare,
  Search,
  Bell,
  Moon,
  Sun,
  Home,
  Bookmark,
  UserPlus,
  Wallet,
  Vault,
  Clock,
  Infinity,
  Heart,
  Rocket,
  Building2,
  Sparkles,
  Timer,
} from 'lucide-react';

// Navigation section interface
interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  description?: string;
  tier?: string[];
  badge?: string;
}

interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

export default function UnifiedNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();

  // Main navigation sections organized by functionality
  const navigationSections: NavigationSection[] = [
    {
      title: "Core Platform",
      items: [
        { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
        { name: "Create Capsule", href: "/create-capsule", icon: FileText },
        { name: "All Capsules", href: "/capsules", icon: Eye },
        { name: "Profile", href: "/profile", icon: User },
        { name: "Onboarding Guide", href: "/gamified-onboarding", icon: Target, badge: "NEW" },
      ],
    },
    {
      title: "Memory Vault System",
      items: [
        { 
          name: "Memory Capsule Creator", 
          href: "/memory-vault", 
          icon: Vault, 
          description: "Transform any data into eternal digital assets",
          badge: "NEW"
        },
        { 
          name: "100-Year Staking", 
          href: "/eternal-staking", 
          icon: Clock, 
          tier: ["pro", "enterprise"],
          description: "Stake memory capsules for generational wealth",
          badge: "YIELD"
        },
        { 
          name: "Family Legacy Hub", 
          href: "/family-legacy", 
          icon: Users, 
          description: "Secure family memories forever"
        },
        { 
          name: "Time-Lock Messages", 
          href: "/time-messages", 
          icon: MessageSquare, 
          description: "Send messages centuries into the future"
        },
        { 
          name: "Infinite Recovery", 
          href: "/infinite-recovery", 
          icon: Infinity, 
          description: "Ultimate security and infinite recoverability"
        },
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
      title: "Revenue Features",
      items: [
        { 
          name: "Upgrade to Pro", 
          href: "/upgrade", 
          icon: Crown, 
          description: "Unlock premium features"
        },
        { 
          name: "GTT Staking", 
          href: "/stake", 
          icon: Target, 
          tier: ["pro", "enterprise"],
          description: "Earn rewards by staking GTT"
        },
        { 
          name: "Premium Analytics", 
          href: "/analytics",
          icon: BarChart2, 
          tier: ["pro", "enterprise"]
        },
        { 
          name: "Token Launch", 
          href: "/token-launch", 
          icon: Coins, 
          badge: "LIVE"
        },
        { 
          name: "Subscription Plans", 
          href: "/pricing", 
          icon: Crown 
        },
        { 
          name: "Wallet Connect", 
          href: "/wallet", 
          icon: Wallet 
        },
        { 
          name: "Earning Dashboard", 
          href: "/earnings", 
          icon: TrendingUp, 
          tier: ["pro", "enterprise"]
        },
      ],
    },
    {
      title: "Analytics & Data",
      items: [
        { name: "Leaderboard", href: "/leaderboard", icon: Award },
        { name: "Community", href: "/community", icon: Users },
        { name: "Referral Program", href: "/referrals", icon: UserPlus, tier: ["pro", "enterprise"] },
        { name: "Performance Analytics", href: "/capsule-analytics", icon: BarChart2 },
        { name: "Viral Tools", href: "/viral-tools", icon: Zap },
        { name: "Revenue Dashboard", href: "/revenue-dashboard", icon: Database },
        { name: "Top Revenue Drivers", href: "/top-revenue-drivers", icon: TrendingUp, badge: "STRATEGIC" },
        { name: "Cross-Chain Trading", href: "/cross-trading", icon: Network, badge: "BETA" },
        { name: "Redemption System", href: "/redemption-capsule", icon: Shield, badge: "NEW" },
        { name: "Launch Dashboard", href: "/launch-dashboard", icon: Rocket, badge: "LIVE" },
        { name: "Exchange Listings", href: "/exchange-listings", icon: Building2, badge: "ACTIVE" },
        { name: "Micro-Interactions", href: "/micro-interactions", icon: Sparkles, badge: "FUN" },
      ],
    },
    {
      title: "Administration",
      items: [
        { name: "API Status", href: "/api-status", icon: Network },
        { name: "Security Center", href: "/supabase-security", icon: Shield },
        { name: "Teams Upgrades", href: "/teams-upgrades", icon: Globe },
        { name: "Asset Manager", href: "/asset-manager", icon: Database },
        { name: "Settings", href: "/settings", icon: Settings },
      ],
    },
  ];

  const renderNavigationSection = (section: NavigationSection) => (
    <div key={section.title} className="space-y-2">
      <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider px-3 py-2">
        {section.title}
      </h3>
      <div className="space-y-1">
        {section.items.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full justify-start space-x-3 h-auto p-3 ${
                  isActive 
                    ? "bg-purple-600/20 text-purple-300 border-purple-500/50" 
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.name}</span>
                    {item.badge && (
                      <Badge 
                        variant="secondary" 
                        className={`ml-2 text-xs ${
                          item.badge === 'NEW' ? 'bg-green-600/20 text-green-400' :
                          item.badge === 'LIVE' ? 'bg-red-600/20 text-red-400' :
                          item.badge === 'YIELD' ? 'bg-yellow-600/20 text-yellow-400' :
                          'bg-blue-600/20 text-blue-400'
                        }`}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-xs text-slate-400 mt-1">{item.description}</p>
                  )}
                </div>
              </Button>
            </Link>
          );
        })}
      </div>
    </div>
  );

  return (
    <header className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-green-600 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">GUARDIANCHAIN</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Memory Vault System Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-slate-300 hover:text-white">
                  <Vault className="h-4 w-4 mr-2" />
                  Memory Vault
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 bg-slate-800 border-slate-700">
                <DropdownMenuLabel className="text-slate-300">Memory Vault System</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-700" />
                {navigationSections.find(s => s.title === "Memory Vault System")?.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link href={item.href} className="flex items-center space-x-3 p-3">
                        <Icon className="h-5 w-5 text-purple-400" />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-white font-medium">{item.name}</span>
                            {item.badge && (
                              <Badge variant="secondary" className="text-xs bg-purple-600/20 text-purple-400">
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-slate-400 text-xs mt-1">{item.description}</p>
                          )}
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Quick Navigation Links */}
            <Link href="/create-capsule">
              <Button variant="ghost" className="text-slate-300 hover:text-white">
                <FileText className="h-4 w-4 mr-2" />
                Create
              </Button>
            </Link>

            <Link href="/eternal-staking">
              <Button variant="ghost" className="text-slate-300 hover:text-white">
                <Clock className="h-4 w-4 mr-2" />
                Stake
                <Badge className="ml-2 bg-yellow-600/20 text-yellow-400 text-xs">YIELD</Badge>
              </Button>
            </Link>

            <Link href="/family-legacy">
              <Button variant="ghost" className="text-slate-300 hover:text-white">
                <Heart className="h-4 w-4 mr-2" />
                Legacy
              </Button>
            </Link>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="text-slate-300 hover:text-white"
            >
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>

            {/* Profile/Login */}
            <Link href="/login">
              <Button className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700">
                <User className="h-4 w-4 mr-2" />
                Login
              </Button>
            </Link>
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="text-slate-300">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-slate-900 border-slate-800 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-lg font-bold text-white">GUARDIANCHAIN</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-slate-300"
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>

                {/* Mobile Navigation Sections */}
                <div className="space-y-6">
                  {navigationSections.map(renderNavigationSection)}
                </div>

                {/* Mobile Footer */}
                <div className="mt-8 pt-6 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                      className="text-slate-300"
                    >
                      {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                    </Button>
                    <Link href="/login">
                      <Button size="sm" className="bg-gradient-to-r from-purple-600 to-green-600">
                        Login
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}