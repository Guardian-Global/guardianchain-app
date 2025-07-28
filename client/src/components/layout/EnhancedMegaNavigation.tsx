import { useState, useMemo } from "react";
import { Link, useLocation } from "wouter";
import {
  Shield,
  Menu,
  X,
  Search,
  ChevronDown,
  Home,
  User,
  Settings,
  TrendingUp,
  Zap,
  Database,
  Coins,
  Target,
  Brain,
  Globe,
  Lock,
  Award,
  Users,
  BarChart3,
  PieChart,
  FileText,
  Briefcase,
  DollarSign,
  Crown,
  Layers,
  Sparkles,
  Eye,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/components/web3/theme-provider";
import { AuthButton } from "@/components/auth/AuthButton";
import { useAuth } from "@/hooks/useAuth";
import { LogoDisplay } from "@/components/assets/LogoDisplay";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGTTLiveData } from "@/lib/gttLiveData";

// Comprehensive page organization system
const pageCategories = {
  core: {
    title: "Core Platform",
    icon: Home,
    color: "text-blue-400",
    pages: [
      { name: "Home", href: "/", icon: Home },
      { name: "Explore", href: "/explore", icon: Globe },
      { name: "Create Capsule", href: "/create", icon: Sparkles },
      { name: "Leaderboard", href: "/leaderboard", icon: Award },
      { name: "Governance", href: "/governance", icon: Users },
    ],
  },
  trading: {
    title: "Trading & Finance",
    icon: TrendingUp,
    color: "text-green-400",
    pages: [
      { name: "Token Launch", href: "/token-launch", icon: Coins },
      {
        name: "Simple Token Launch",
        href: "/simple-token-launch",
        icon: Target,
      },
      { name: "Staking", href: "/stake", icon: DollarSign },
      { name: "Treasury", href: "/treasury", icon: Database },
      {
        name: "Financial Dashboard",
        href: "/financial-dashboard",
        icon: PieChart,
      },
      {
        name: "Billing Dashboard",
        href: "/billing-dashboard",
        icon: Briefcase,
      },
    ],
  },
  profile: {
    title: "Profile & Listings",
    icon: User,
    color: "text-purple-400",
    pages: [
      { name: "My Profile", href: "/profile", icon: User },
      { name: "My Listings", href: "/my-listings", icon: Eye },
      { name: "Enhanced Profile", href: "/enhanced-profile", icon: Crown },
      {
        name: "Profile Dashboard",
        href: "/profile-dashboard",
        icon: BarChart3,
      },
      {
        name: "Profile Customization",
        href: "/profile-customization",
        icon: Settings,
      },
      {
        name: "Enhanced Leaderboard",
        href: "/enhanced-leaderboard",
        icon: Award,
      },
    ],
  },
  analytics: {
    title: "Analytics & Insights",
    icon: BarChart3,
    color: "text-cyan-400",
    pages: [
      { name: "Capsule Analytics", href: "/capsule-analytics", icon: PieChart },
      { name: "Yield Tracker", href: "/yield-tracker", icon: TrendingUp },
      { name: "Insights", href: "/insight", icon: Brain },
      { name: "Explorer", href: "/explorer", icon: Eye },
      { name: "Reporting", href: "/reporting", icon: FileText },
    ],
  },
  advanced: {
    title: "Advanced Features",
    icon: Zap,
    color: "text-orange-400",
    pages: [
      {
        name: "Blockchain Playground",
        href: "/blockchain-playground",
        icon: Layers,
      },
      { name: "Viral Tools", href: "/viral-tools", icon: Sparkles },
      { name: "AI Advisor", href: "/ai-advisor", icon: Brain },
      { name: "Asset Integration", href: "/asset-integration", icon: Database },
      { name: "Enterprise Suite", href: "/enterprise-suite", icon: Briefcase },
      { name: "Premium Features", href: "/premium-features", icon: Crown },
    ],
  },
  specialized: {
    title: "Specialized Tools",
    icon: Target,
    color: "text-red-400",
    pages: [
      { name: "Specialized Intake", href: "/specialized-intake", icon: Target },
      {
        name: "Whistleblower Sanctuary",
        href: "/whistleblower-sanctuary",
        icon: Lock,
      },
      { name: "Category Discovery", href: "/category-discovery", icon: Globe },
      { name: "Capsule Forge", href: "/capsule-forge", icon: Sparkles },
      { name: "Certify", href: "/certify", icon: Award },
    ],
  },
  admin: {
    title: "Administration",
    icon: Settings,
    color: "text-gray-400",
    pages: [
      { name: "Admin Dashboard", href: "/admin", icon: Settings },
      { name: "Master Admin", href: "/master-admin", icon: Crown },
      { name: "Commander", href: "/commander", icon: Shield },
      { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
      { name: "Config", href: "/config", icon: Settings },
      { name: "Compliance", href: "/compliance", icon: Lock },
      { name: "Security Center", href: "/supabase-security", icon: Shield },
    ],
  },
};

// GTT Token Quick Access Component
const GTTQuickAccess = () => {
  const { data: gttData, isLoading, refreshData } = useGTTLiveData();

  return (
    <div className="bg-gradient-to-r from-purple-900/20 to-green-900/20 border border-purple-500/30 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-purple-400">
          GTT LIVE DATA
        </span>
        <Badge
          variant="outline"
          className={`${
            (gttData?.change24hPercent || 0) > 0
              ? "text-green-400 border-green-400"
              : "text-red-400 border-red-400"
          }`}
        >
          {isLoading ? "..." : gttData?.change24h || "+0.00%"}
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <div className="text-gray-400">Price</div>
          <div className="font-bold text-white">
            {isLoading ? "..." : gttData?.price || "$0.00"}
          </div>
        </div>
        <div>
          <div className="text-gray-400">Balance</div>
          <div className="font-bold text-white">
            {isLoading ? "..." : `${gttData?.balance || "0"} GTT`}
          </div>
        </div>
      </div>
      <div className="mt-2 pt-2 border-t border-gray-700">
        <div className="text-gray-400 text-xs">Daily Yield</div>
        <div className="font-bold text-green-400">
          {isLoading ? "..." : `${gttData?.dailyYield || "0"} GTT`}
        </div>
      </div>
      {gttData?.listings && gttData.listings.length > 0 && (
        <div className="mt-2 pt-2 border-t border-gray-700">
          <div className="text-gray-400 text-xs">Active Listings</div>
          <div className="font-bold text-blue-400">
            {gttData.listings.filter((l) => l.status === "active").length}
          </div>
        </div>
      )}
    </div>
  );
};

export default function EnhancedMegaNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, user } = useAuth();

  // Search functionality across all pages
  const searchResults = useMemo(() => {
    if (!searchTerm) return [];

    const allPages = Object.values(pageCategories).flatMap((category) =>
      category.pages.map((page) => ({ ...page, category: category.title }))
    );

    return allPages.filter(
      (page) =>
        page.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        page.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const CategoryDropdown = ({
    category,
    data,
  }: {
    category: string;
    data: any;
  }) => {
    const IconComponent = data.icon;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`${data.color} hover:text-white transition-colors flex items-center gap-1`}
          >
            <IconComponent size={16} />
            {data.title}
            <ChevronDown size={14} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-slate-900 border-slate-800 min-w-[200px]">
          <DropdownMenuLabel className={data.color}>
            {data.title}
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-slate-700" />
          {data.pages.map((page: any) => {
            const PageIcon = page.icon;
            return (
              <DropdownMenuItem key={page.href} asChild>
                <Link href={page.href}>
                  <div className="flex items-center gap-2 w-full text-slate-300 hover:text-white">
                    <PageIcon size={16} />
                    {page.name}
                  </div>
                </Link>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <LogoDisplay
                size="lg"
                variant="icon"
                className="w-8 h-8"
                fallback={
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-green-600 rounded-lg flex items-center justify-center">
                    <Shield className="text-white h-5 w-5" />
                  </div>
                }
              />
              <span className="text-xl font-bold">
                <span className="text-purple-400">GUARDIAN</span>
                <span className="text-green-400">CHAIN</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {Object.entries(pageCategories).map(([key, data]) => (
              <CategoryDropdown key={key} category={key} data={data} />
            ))}
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex relative max-w-sm flex-1 mx-4">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <Input
              type="text"
              placeholder="Search all pages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder-gray-400"
            />
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-slate-900 border border-slate-700 rounded-b-lg shadow-xl max-h-64 overflow-y-auto">
                {searchResults.map((result) => (
                  <Link key={result.href} href={result.href}>
                    <div className="p-2 hover:bg-slate-800 flex items-center gap-2 text-slate-300 hover:text-white">
                      <result.icon size={16} />
                      <div>
                        <div className="font-medium">{result.name}</div>
                        <div className="text-xs text-gray-400">
                          {result.category}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* GTT Quick Access & Theme Toggle */}
          <div className="flex items-center space-x-4">
            <div className="hidden xl:block">
              <GTTQuickAccess />
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-slate-400 hover:text-white"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white"
                >
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="bg-slate-900 border-slate-800 w-80"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-lg font-bold">
                      <span className="text-purple-400">GUARDIAN</span>
                      <span className="text-green-400">CHAIN</span>
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X size={20} />
                    </Button>
                  </div>

                  <div className="mb-4">
                    <GTTQuickAccess />
                  </div>

                  <div className="relative mb-4">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={16}
                    />
                    <Input
                      type="text"
                      placeholder="Search all pages..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-slate-800/50 border-slate-700"
                    />
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-4">
                    {Object.entries(pageCategories).map(([key, data]) => {
                      const IconComponent = data.icon;
                      return (
                        <div key={key} className="space-y-2">
                          <div
                            className={`flex items-center gap-2 text-sm font-medium ${data.color}`}
                          >
                            <IconComponent size={16} />
                            {data.title}
                          </div>
                          <div className="ml-4 space-y-1">
                            {data.pages.map((page: any) => {
                              const PageIcon = page.icon;
                              return (
                                <Link key={page.href} href={page.href}>
                                  <div className="flex items-center gap-2 p-2 rounded hover:bg-slate-800 text-slate-300 hover:text-white text-sm">
                                    <PageIcon size={14} />
                                    {page.name}
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Auth Controls in Mobile */}
                  <div className="mt-6 pt-6 border-t border-slate-800">
                    <AuthButton />
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Desktop Auth Button */}
            <div className="hidden lg:flex">
              <AuthButton />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
