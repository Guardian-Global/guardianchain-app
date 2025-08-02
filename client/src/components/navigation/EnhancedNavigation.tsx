import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronDown, 
  ChevronRight, 
  Home, 
  Shield, 
  Package, 
  Crown, 
  Map, 
  TrendingUp, 
  Settings, 
  User, 
  HelpCircle, 
  Search,
  Globe,
  Zap,
  Target,
  Trophy,
  Bookmark,
  Archive,
  FileText,
  Calendar,
  BarChart3,
  Users,
  Coins,
  Lock,
  Eye,
  Lightbulb,
  Compass,
  MessageSquare,
  Star,
  PlayCircle,
  CheckCircle2,
  Bell,
  Brain
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import SmartNotifications from './SmartNotifications';
import PersonalizationEngine from './PersonalizationEngine';
import EngagementTracker from './EngagementTracker';

interface NavigationItem {
  id: string;
  title: string;
  path: string;
  icon: React.ComponentType<any>;
  description: string;
  tier?: string[];
  category: string;
  isNew?: boolean;
  isPopular?: boolean;
  hasWalkthrough?: boolean;
  comingSoon?: boolean;
  badge?: string;
  children?: NavigationItem[];
}

interface WalkthroughStep {
  target: string;
  title: string;
  description: string;
  action?: string;
}

const navigationData: NavigationItem[] = [
  {
    id: 'home',
    title: 'Dashboard',
    path: '/',
    icon: Home,
    description: 'Your personalized overview and quick actions',
    category: 'main',
    hasWalkthrough: true
  },
  {
    id: 'capsules',
    title: 'Capsule Hub',
    path: '/capsules',
    icon: Package,
    description: 'Create, manage, and explore truth capsules',
    category: 'core',
    isPopular: true,
    hasWalkthrough: true,
    children: [
      {
        id: 'create-capsule',
        title: 'Create Capsule',
        path: '/create',
        icon: Zap,
        description: 'Start your truth preservation journey',
        category: 'creation',
        hasWalkthrough: true,
        badge: 'Start Here'
      },
      {
        id: 'capsule-gallery',
        title: 'NFT Gallery',
        path: '/capsules/gallery',
        icon: Trophy,
        description: 'Browse and discover verified capsules',
        category: 'discovery'
      },
      {
        id: 'my-capsules',
        title: 'My Capsules',
        path: '/capsules/mine',
        icon: Bookmark,
        description: 'Manage your capsule collection',
        category: 'management'
      }
    ]
  },
  {
    id: 'eternal-contracts',
    title: 'Eternal Contracts',
    path: '/eternal-contracts',
    icon: Lock,
    description: 'Immutable declarations and digital wills',
    category: 'advanced',
    tier: ['CREATOR', 'SOVEREIGN'],
    hasWalkthrough: true,
    isNew: true
  },
  {
    id: 'yield-vault',
    title: 'Yield Vault',
    path: '/dashboard/yield',
    icon: TrendingUp,
    description: 'Earn GTT rewards through truth preservation',
    category: 'financial',
    hasWalkthrough: true,
    isPopular: true
  },
  {
    id: 'guardian-map',
    title: 'Guardian Network',
    path: '/guardian-map',
    icon: Map,
    description: 'Explore the global truth guardian network',
    category: 'network',
    isPopular: true
  },
  {
    id: 'lineage',
    title: 'Truth Lineage',
    path: '/lineage',
    icon: Target,
    description: 'Track truth inheritance and influence',
    category: 'analytics',
    tier: ['SEEKER', 'CREATOR', 'SOVEREIGN']
  },
  {
    id: 'reputation',
    title: 'SMRI Leaderboard',
    path: '/reputation',
    icon: Crown,
    description: 'Sovereign Memory Reputation Index rankings',
    category: 'social'
  },
  {
    id: 'dao',
    title: 'DAO Governance',
    path: '/dao',
    icon: Users,
    description: 'Participate in protocol governance',
    category: 'governance',
    tier: ['CREATOR', 'SOVEREIGN']
  },
  {
    id: 'analytics',
    title: 'Analytics Hub',
    path: '/analytics',
    icon: BarChart3,
    description: 'Advanced insights and metrics',
    category: 'analytics',
    tier: ['SOVEREIGN'],
    children: [
      {
        id: 'capsule-analytics',
        title: 'Capsule Analytics',
        path: '/analytics/capsules',
        icon: Package,
        description: 'Deep dive into capsule performance',
        category: 'analytics'
      },
      {
        id: 'network-analytics',
        title: 'Network Analytics',
        path: '/analytics/network',
        icon: Globe,
        description: 'Guardian network insights',
        category: 'analytics'
      }
    ]
  },
  {
    id: 'marketplace',
    title: 'Truth Marketplace',
    path: '/marketplace',
    icon: Coins,
    description: 'Trade and monetize truth capsules',
    category: 'financial',
    comingSoon: true
  }
];

const walkthroughSteps: Record<string, WalkthroughStep[]> = {
  '/create': [
    {
      target: 'capsule-type-selector',
      title: 'Choose Your Capsule Type',
      description: 'Select the type of truth you want to preserve. Each type has unique properties and yield potential.',
      action: 'Select a capsule type to continue'
    },
    {
      target: 'content-editor',
      title: 'Share Your Truth',
      description: 'Write your story, testimony, or memory. Our AI will help optimize it for maximum impact.',
      action: 'Add your content'
    },
    {
      target: 'ai-analysis',
      title: 'AI Enhancement',
      description: 'Let our AI analyze your content for emotional resonance and truth verification.',
      action: 'Run AI analysis'
    },
    {
      target: 'mint-options',
      title: 'Mint Your NFT',
      description: 'Transform your truth into a valuable NFT with yield-generating capabilities.',
      action: 'Complete minting'
    }
  ],
  '/eternal-contracts': [
    {
      target: 'contract-builder',
      title: 'Create Eternal Declaration',
      description: 'Build an immutable contract that will exist forever on the blockchain.',
      action: 'Start building'
    },
    {
      target: 'beneficiary-settings',
      title: 'Set Beneficiaries',
      description: 'Choose who can access your contract and when it should be unlocked.',
      action: 'Configure access'
    },
    {
      target: 'verification-tools',
      title: 'Verify & Seal',
      description: 'Use our verification tools to ensure your contract meets eternal standards.',
      action: 'Verify and seal'
    }
  ],
  '/dashboard/yield': [
    {
      target: 'yield-overview',
      title: 'Your Earning Dashboard',
      description: 'Track your GTT earnings from all truth preservation activities.',
      action: 'Explore earnings'
    },
    {
      target: 'staking-options',
      title: 'Maximize Your Yield',
      description: 'Stake your GTT tokens for enhanced returns and voting power.',
      action: 'Start staking'
    },
    {
      target: 'performance-metrics',
      title: 'Performance Insights',
      description: 'Understand which capsules generate the most value and engagement.',
      action: 'Analyze performance'
    }
  ]
};

interface EnhancedNavigationProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  showWalkthrough?: boolean;
  onStartWalkthrough?: (path: string) => void;
}

export default function EnhancedNavigation({ 
  isCollapsed = false, 
  onToggleCollapse,
  showWalkthrough = true,
  onStartWalkthrough 
}: EnhancedNavigationProps) {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>(['capsules']);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeWalkthrough, setActiveWalkthrough] = useState<string | null>(null);
  const [language, setLanguage] = useState('en');

  const userTier = user?.tier || 'EXPLORER';

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const hasAccess = (item: NavigationItem) => {
    if (!item.tier) return true;
    return item.tier.includes(userTier);
  };

  const filteredNavigation = navigationData.filter(item => {
    if (!searchQuery) return true;
    return item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           item.description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const startWalkthrough = (path: string) => {
    setActiveWalkthrough(path);
    if (onStartWalkthrough) {
      onStartWalkthrough(path);
    }
  };

  const getTooltipText = (item: NavigationItem) => {
    const translations = {
      en: item.description,
      es: `Descripción en español para ${item.title}`,
      fr: `Description en français pour ${item.title}`,
      de: `Deutsche Beschreibung für ${item.title}`,
      zh: `${item.title}的中文描述`,
      ja: `${item.title}の日本語説明`
    };
    return translations[language as keyof typeof translations] || item.description;
  };

  const renderNavigationItem = (item: NavigationItem, level = 0) => {
    const isActive = location === item.path;
    const isExpanded = expandedItems.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const canAccess = hasAccess(item);
    const hasSteps = walkthroughSteps[item.path];

    if (!canAccess && !item.comingSoon) return null;

    return (
      <div key={item.id} className="mb-1">
        <div className={`
          group relative flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200
          ${isActive 
            ? 'bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border-l-4 border-indigo-500' 
            : 'hover:bg-white/5'
          }
          ${level > 0 ? 'ml-4 border-l border-gray-700' : ''}
          ${!canAccess ? 'opacity-50' : ''}
        `}>
          <div className="flex items-center flex-1">
            {hasChildren && (
              <button
                onClick={() => toggleExpanded(item.id)}
                className="mr-2 p-1 hover:bg-white/10 rounded"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </button>
            )}
            
            <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-indigo-400' : 'text-gray-400'}`} />
            
            {!isCollapsed && (
              <div className="flex-1">
                <Link href={canAccess ? item.path : '#'}>
                  <div className="flex items-center justify-between group-hover:text-white transition-colors">
                    <div>
                      <div className="flex items-center">
                        <span className={`font-medium ${isActive ? 'text-white' : 'text-gray-300'}`}>
                          {item.title}
                        </span>
                        {item.isNew && (
                          <Badge variant="outline" className="ml-2 text-xs border-green-500 text-green-400">
                            New
                          </Badge>
                        )}
                        {item.isPopular && (
                          <Star className="w-3 h-3 ml-2 text-yellow-400" />
                        )}
                        {item.badge && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            {item.badge}
                          </Badge>
                        )}
                        {item.comingSoon && (
                          <Badge variant="outline" className="ml-2 text-xs border-yellow-500 text-yellow-400">
                            Soon
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                        {getTooltipText(item)}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Walkthrough Button */}
          {!isCollapsed && item.hasWalkthrough && hasSteps && showWalkthrough && canAccess && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => startWalkthrough(item.path)}
              className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 p-1 h-6 w-6"
              title="Start guided walkthrough"
            >
              <PlayCircle className="w-4 h-4 text-indigo-400" />
            </Button>
          )}

          {/* Tooltip for collapsed mode */}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-3 py-2 bg-black/90 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
              <div className="font-medium">{item.title}</div>
              <div className="text-xs text-gray-300 mt-1">{getTooltipText(item)}</div>
              {item.hasWalkthrough && (
                <div className="text-xs text-indigo-400 mt-1">📖 Walkthrough available</div>
              )}
            </div>
          )}
        </div>

        {/* Children */}
        {hasChildren && isExpanded && !isCollapsed && (
          <div className="mt-1">
            {item.children?.map(child => renderNavigationItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`
      h-full bg-black/20 backdrop-blur-xl border-r border-gray-800/50 flex flex-col
      ${isCollapsed ? 'w-16' : 'w-80'}
      transition-all duration-300 ease-in-out
    `}>
      
      {/* Header */}
      <div className="p-4 border-b border-gray-800/50">
        {!isCollapsed && (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Shield className="w-8 h-8 text-indigo-400 mr-2" />
                <div>
                  <h1 className="text-xl font-bold text-white">GuardianChain</h1>
                  <p className="text-xs text-gray-400">Truth Vault Protocol</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <SmartNotifications />
                </div>
                <div className="relative">
                  <PersonalizationEngine />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleCollapse}
                  className="p-2"
                >
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </Button>
              </div>
            </div>

            {/* User Info */}
            {isAuthenticated && user && (
              <Card className="bg-gradient-to-r from-indigo-600/10 to-purple-600/10 border-indigo-500/20 mb-4">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-white">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-gray-400">{userTier} Tier</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-indigo-400 text-indigo-300">
                      {userTier}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Language Selector */}
            <div className="mb-4">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-indigo-500 focus:outline-none text-sm"
              >
                <option value="en">🇺🇸 English</option>
                <option value="es">🇪🇸 Español</option>
                <option value="fr">🇫🇷 Français</option>
                <option value="de">🇩🇪 Deutsch</option>
                <option value="zh">🇨🇳 中文</option>
                <option value="ja">🇯🇵 日本語</option>
              </select>
            </div>
          </>
        )}
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredNavigation.map(item => renderNavigationItem(item))}
      </div>

      {/* Quick Actions */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-800/50">
          <div className="space-y-2">
            <Link href="/create">
              <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                <Zap className="w-4 h-4 mr-2" />
                Create Capsule
              </Button>
            </Link>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/help">
                <Button variant="outline" size="sm" className="w-full border-gray-600">
                  <HelpCircle className="w-4 h-4 mr-1" />
                  Help
                </Button>
              </Link>
              <Link href="/settings">
                <Button variant="outline" size="sm" className="w-full border-gray-600">
                  <Settings className="w-4 h-4 mr-1" />
                  Settings
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Engagement Tracker - Global Component */}
      <EngagementTracker />
    </div>
  );
}