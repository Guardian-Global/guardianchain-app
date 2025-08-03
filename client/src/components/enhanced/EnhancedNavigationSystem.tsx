import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { 
  Home, 
  Shield, 
  Globe, 
  Microscope, 
  Network, 
  FileText, 
  Users, 
  Settings, 
  Search,
  Bell,
  User,
  ChevronDown,
  Menu,
  X,
  Zap,
  Target,
  Award,
  Layers,
  Database,
  Lock,
  Eye,
  Trending,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";

interface NavigationItem {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  description: string;
  category: string;
  tier: string[];
  isNew?: boolean;
  isPremium?: boolean;
  badge?: string;
}

const navigationItems: NavigationItem[] = [
  // Core Platform
  {
    id: "dashboard",
    title: "Command Center",
    icon: Home,
    path: "/dashboard",
    description: "Your personalized truth vault dashboard",
    category: "Core",
    tier: ["EXPLORER", "SEEKER", "CREATOR", "SOVEREIGN"]
  },
  {
    id: "create",
    title: "Capsule Creation",
    icon: Shield,
    path: "/create",
    description: "Create and seal truth capsules",
    category: "Core",
    tier: ["SEEKER", "CREATOR", "SOVEREIGN"],
    isNew: true
  },
  {
    id: "profile",
    title: "Sovereign Profile",
    icon: User,
    path: "/profile",
    description: "Manage your truth identity",
    category: "Core",
    tier: ["EXPLORER", "SEEKER", "CREATOR", "SOVEREIGN"]
  },

  // Truth Analytics
  {
    id: "truth-genome",
    title: "Truth Genome",
    icon: Microscope,
    path: "/truth-genome",
    description: "AI-powered emotional fingerprinting",
    category: "Analytics",
    tier: ["CREATOR", "SOVEREIGN"],
    isPremium: true
  },
  {
    id: "truth-net",
    title: "Truth Network",
    icon: Network,
    path: "/truth-net",
    description: "Global truth network visualization",
    category: "Analytics",
    tier: ["SEEKER", "CREATOR", "SOVEREIGN"]
  },
  {
    id: "explorer",
    title: "Public Explorer",
    icon: Globe,
    path: "/explorer",
    description: "Explore verified truth capsules",
    category: "Analytics",
    tier: ["EXPLORER", "SEEKER", "CREATOR", "SOVEREIGN"]
  },

  // Legal & Verification
  {
    id: "notarization",
    title: "Legal Notarization",
    icon: FileText,
    path: "/notarization",
    description: "Blockchain notarization & certificates",
    category: "Legal",
    tier: ["CREATOR", "SOVEREIGN"],
    isPremium: true,
    badge: "Legal"
  },
  {
    id: "verification",
    title: "Truth Verification",
    icon: Award,
    path: "/verification",
    description: "Community verification system",
    category: "Legal",
    tier: ["SEEKER", "CREATOR", "SOVEREIGN"]
  },
  {
    id: "vault",
    title: "Truth Vault",
    icon: Database,
    path: "/vault",
    description: "Secure encrypted storage",
    category: "Legal",
    tier: ["CREATOR", "SOVEREIGN"],
    isPremium: true
  },

  // Advanced Features
  {
    id: "ai-composer",
    title: "AI Composer",
    icon: Zap,
    path: "/ai-composer",
    description: "AI-powered content creation",
    category: "Advanced",
    tier: ["SOVEREIGN"],
    isPremium: true,
    isNew: true
  },
  {
    id: "voice-analysis",
    title: "Voice Analysis",
    icon: Target,
    path: "/voice-analysis",
    description: "Emotional voice fingerprinting",
    category: "Advanced",
    tier: ["CREATOR", "SOVEREIGN"],
    isPremium: true
  },
  {
    id: "lineage-tracker",
    title: "Lineage Tracker",
    icon: Layers,
    path: "/lineage",
    description: "Truth genealogy and connections",
    category: "Advanced",
    tier: ["CREATOR", "SOVEREIGN"],
    isPremium: true
  },

  // Community
  {
    id: "guardians",
    title: "Guardian Network",
    icon: Users,
    path: "/guardians",
    description: "Connect with truth guardians",
    category: "Community",
    tier: ["SEEKER", "CREATOR", "SOVEREIGN"]
  },
  {
    id: "auctions",
    title: "Truth Auctions",
    icon: Trending,
    path: "/auctions",
    description: "Crowdfunded truth revelations",
    category: "Community",
    tier: ["SEEKER", "CREATOR", "SOVEREIGN"],
    badge: "Live"
  },
  {
    id: "governance",
    title: "DAO Governance",
    icon: Star,
    path: "/governance",
    description: "Participate in platform decisions",
    category: "Community",
    tier: ["CREATOR", "SOVEREIGN"],
    isPremium: true
  }
];

export default function EnhancedNavigationSystem() {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Core");
  const [notifications, setNotifications] = useState(3);

  const userTier = user?.tier || "EXPLORER";
  const categories = ["Core", "Analytics", "Legal", "Advanced", "Community"];

  // Filter items based on user tier and search
  const filteredItems = navigationItems.filter(item => {
    const tierAccess = item.tier.includes(userTier);
    const matchesSearch = searchQuery === "" || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return tierAccess && matchesSearch;
  });

  const itemsByCategory = categories.reduce((acc, category) => {
    acc[category] = filteredItems.filter(item => item.category === category);
    return acc;
  }, {} as Record<string, NavigationItem[]>);

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="bg-slate-800/90 backdrop-blur-md border-purple-500/30"
        >
          {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
      </div>

      {/* Desktop Navigation Sidebar */}
      <div className="hidden lg:flex fixed left-0 top-0 h-full w-80 bg-gradient-to-b from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-xl border-r border-purple-500/20 z-40">
        <div className="flex flex-col w-full">
          {/* Header */}
          <div className="p-6 border-b border-purple-500/20">
            <Link href="/">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    GuardianChain
                  </h1>
                  <p className="text-xs text-gray-400">Truth Vault Platform</p>
                </div>
              </div>
            </Link>
          </div>

          {/* User Info */}
          {isAuthenticated && (
            <div className="p-4 border-b border-purple-500/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{user?.firstName} {user?.lastName}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {userTier}
                    </Badge>
                    {notifications > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {notifications}
                      </Badge>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Bell className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Search */}
          <div className="p-4 border-b border-purple-500/20">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800/50 border-purple-500/30"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="px-4 py-2 border-b border-purple-500/20">
            <div className="flex gap-1 overflow-x-auto">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveCategory(category)}
                  className="whitespace-nowrap text-xs"
                >
                  {category}
                  {itemsByCategory[category]?.length > 0 && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {itemsByCategory[category].length}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {itemsByCategory[activeCategory]?.map((item) => (
                <Link key={item.id} href={item.path}>
                  <div className={`group relative p-3 rounded-xl transition-all duration-200 hover:bg-purple-500/10 ${
                    location === item.path ? 'bg-purple-500/20 border border-purple-500/30' : ''
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        location === item.path ? 'bg-purple-500' : 'bg-slate-700/50'
                      }`}>
                        <item.icon className={`w-4 h-4 ${
                          location === item.path ? 'text-white' : 'text-purple-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-medium text-white">{item.title}</h3>
                          {item.isNew && (
                            <Badge variant="secondary" className="text-xs">New</Badge>
                          )}
                          {item.isPremium && (
                            <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-400">
                              Pro
                            </Badge>
                          )}
                          {item.badge && (
                            <Badge variant="destructive" className="text-xs animate-pulse">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-400">{item.description}</p>
                      </div>
                    </div>

                    {/* Tier Lock Indicator */}
                    {!item.tier.includes(userTier) && (
                      <div className="absolute inset-0 bg-slate-900/80 rounded-xl flex items-center justify-center">
                        <div className="text-center">
                          <Lock className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                          <p className="text-xs text-gray-400">Upgrade Required</p>
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-purple-500/20">
            <Link href="/settings">
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Mobile Menu */}
          <div className="absolute left-0 top-0 h-full w-80 bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 overflow-y-auto">
            {/* Mobile Header */}
            <div className="p-4 border-b border-purple-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  GuardianChain
                </h1>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Mobile User Info */}
            {isAuthenticated && (
              <div className="p-4 border-b border-purple-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{user?.firstName} {user?.lastName}</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {userTier}
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Search */}
            <div className="p-4 border-b border-purple-500/20">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search features..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-800/50 border-purple-500/30"
                />
              </div>
            </div>

            {/* Mobile Navigation Items */}
            <div className="p-4">
              {categories.map((category) => (
                <div key={category} className="mb-6">
                  <h3 className="text-sm font-semibold text-purple-400 mb-3 uppercase tracking-wider">
                    {category}
                  </h3>
                  <div className="space-y-1">
                    {itemsByCategory[category]?.map((item) => (
                      <Link key={item.id} href={item.path}>
                        <div 
                          className={`p-3 rounded-lg transition-colors ${
                            location === item.path ? 'bg-purple-500/20' : 'hover:bg-slate-800/50'
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className="w-5 h-5 text-purple-400" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-white font-medium">{item.title}</span>
                                {item.isNew && (
                                  <Badge variant="secondary" className="text-xs">New</Badge>
                                )}
                                {item.isPremium && (
                                  <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-400">
                                    Pro
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-gray-400 mt-1">{item.description}</p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}