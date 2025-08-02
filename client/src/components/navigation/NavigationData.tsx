import { 
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
  Brain,
  Gavel,
  Calculator
} from 'lucide-react';

export interface NavigationItem {
  id: string;
  title: string;
  path: string;
  icon: React.ComponentType<any>;
  description: string;
  tier?: string[];
  category: string;
  isNew?: boolean;
  isPopular?: boolean;
  adminOnly?: boolean;
  daoOnly?: boolean;
  validatorOnly?: boolean;
  badge?: {
    text: string;
    type: 'new' | 'warning' | 'success' | 'info' | 'urgent';
    count?: number;
  };
}

export const navigationItems: NavigationItem[] = [
  // Core Platform
  {
    id: 'dashboard',
    title: 'Dashboard',
    path: '/dashboard',
    icon: Home,
    description: 'Your personal command center',
    category: 'core',
    isPopular: true
  },
  {
    id: 'capsules',
    title: 'Truth Capsules',
    path: '/capsules',
    icon: Package,
    description: 'Manage your preserved memories',
    category: 'core'
  },
  {
    id: 'guardian-map',
    title: 'Guardian Map',
    path: '/guardian-map',
    icon: Map,
    description: 'Global network visualization',
    category: 'core',
    isNew: true
  },

  // Creation Tools
  {
    id: 'create-capsule',
    title: 'Create Capsule',
    path: '/create',
    icon: Shield,
    description: 'Preserve truth for eternity',
    category: 'creation',
    tier: ['SEEKER', 'CREATOR', 'SOVEREIGN']
  },
  {
    id: 'eternal-contracts',
    title: 'Eternal Contracts',
    path: '/eternal-contracts',
    icon: FileText,
    description: 'Immutable declarations & wills',
    category: 'creation',
    tier: ['CREATOR', 'SOVEREIGN'],
    isNew: true
  },
  {
    id: 'capsule-gallery',
    title: 'NFT Gallery',
    path: '/capsules/gallery',
    icon: Eye,
    description: 'Browse minted truth capsules',
    category: 'creation'
  },

  // Governance & DAO
  {
    id: 'dao-governance',
    title: 'DAO Governance',
    path: '/dao',
    icon: Gavel,
    description: 'Participate in protocol decisions',
    category: 'governance',
    daoOnly: true
  },
  {
    id: 'dao-proposals',
    title: 'Proposals',
    path: '/dao/proposals',
    icon: MessageSquare,
    description: 'Vote on community proposals',
    category: 'governance',
    daoOnly: true
  },
  {
    id: 'validator-dashboard',
    title: 'Validator Dashboard',
    path: '/validator',
    icon: Crown,
    description: 'Truth validation & rewards',
    category: 'governance',
    validatorOnly: true
  },

  // Analytics & Insights
  {
    id: 'analytics',
    title: 'Analytics',
    path: '/analytics',
    icon: BarChart3,
    description: 'Performance metrics & insights',
    category: 'analytics',
    tier: ['SEEKER', 'CREATOR', 'SOVEREIGN']
  },
  {
    id: 'tokenomics',
    title: 'Tokenomics',
    path: '/tokenomics',
    icon: Coins,
    description: 'GTT token economics & yields',
    category: 'analytics'
  },
  {
    id: 'yield-calculator',
    title: 'Yield Calculator',
    path: '/calculator',
    icon: Calculator,
    description: 'Calculate potential GTT yields',
    category: 'analytics'
  },

  // Tools & Utilities
  {
    id: 'search',
    title: 'Global Search',
    path: '/search',
    icon: Search,
    description: 'Find capsules across the network',
    category: 'tools'
  },
  {
    id: 'ai-assistant',
    title: 'AI Assistant',
    path: '/ai-assistant',
    icon: Brain,
    description: 'AI-powered content analysis',
    category: 'tools',
    tier: ['CREATOR', 'SOVEREIGN'],
    isNew: true
  },
  {
    id: 'reputation',
    title: 'SMRI Leaderboard',
    path: '/reputation',
    icon: Trophy,
    description: 'Sovereign Memory Reputation Index',
    category: 'tools'
  },

  // Network & Community
  {
    id: 'network',
    title: 'Network Status',
    path: '/network',
    icon: Globe,
    description: 'Real-time network health',
    category: 'network'
  },
  {
    id: 'community',
    title: 'Community',
    path: '/community',
    icon: Users,
    description: 'Connect with other guardians',
    category: 'network'
  },
  {
    id: 'notifications',
    title: 'Notifications',
    path: '/notifications',
    icon: Bell,
    description: 'Stay updated on network activity',
    category: 'network'
  },

  // Account & Settings
  {
    id: 'profile',
    title: 'Profile',
    path: '/profile',
    icon: User,
    description: 'Manage your guardian profile',
    category: 'account'
  },
  {
    id: 'settings',
    title: 'Settings',
    path: '/settings',
    icon: Settings,
    description: 'Configure your preferences',
    category: 'account'
  },
  {
    id: 'subscription',
    title: 'Subscription',
    path: '/subscription',
    icon: Crown,
    description: 'Manage your tier & billing',
    category: 'account'
  },

  // Admin Only
  {
    id: 'admin-dashboard',
    title: 'Admin Dashboard',
    path: '/admin',
    icon: Shield,
    description: 'System administration',
    category: 'admin',
    adminOnly: true
  },
  {
    id: 'admin-config',
    title: 'System Config',
    path: '/admin/config',
    icon: Settings,
    description: 'Configure system parameters',
    category: 'admin',
    adminOnly: true
  },

  // Help & Support
  {
    id: 'help',
    title: 'Help Center',
    path: '/help',
    icon: HelpCircle,
    description: 'Documentation & support',
    category: 'support'
  },
  {
    id: 'documentation',
    title: 'Documentation',
    path: '/docs',
    icon: FileText,
    description: 'Technical documentation',
    category: 'support'
  },
  {
    id: 'tutorials',
    title: 'Tutorials',
    path: '/tutorials',
    icon: PlayCircle,
    description: 'Learn how to use GuardianChain',
    category: 'support'
  }
];

// Helper functions for filtering navigation items
export const getNavigationByCategory = (category: string) => {
  return navigationItems.filter(item => item.category === category);
};

export const getNavigationByTier = (userTier: string) => {
  const tierHierarchy = ['EXPLORER', 'SEEKER', 'CREATOR', 'SOVEREIGN', 'ADMIN'];
  const userTierIndex = tierHierarchy.indexOf(userTier);
  
  return navigationItems.filter(item => {
    if (!item.tier) return true; // No tier requirement
    
    return item.tier.some(requiredTier => {
      const requiredTierIndex = tierHierarchy.indexOf(requiredTier);
      return userTierIndex >= requiredTierIndex;
    });
  });
};

export const getVisibleNavigation = (user: any) => {
  if (!user) {
    return navigationItems.filter(item => 
      !item.tier && !item.adminOnly && !item.daoOnly && !item.validatorOnly
    );
  }

  const userTier = user.tier || 'EXPLORER';
  const isAdmin = user.email === 'admin@guardianchain.app' || userTier === 'ADMIN';
  const isDaoMember = ['CREATOR', 'SOVEREIGN', 'ADMIN'].includes(userTier);
  const isValidator = user.isValidator || userTier === 'SOVEREIGN' || isAdmin;

  return navigationItems.filter(item => {
    // Check admin access
    if (item.adminOnly && !isAdmin) return false;
    
    // Check DAO access
    if (item.daoOnly && !isDaoMember) return false;
    
    // Check validator access
    if (item.validatorOnly && !isValidator) return false;
    
    // Check tier access
    if (item.tier) {
      const tierHierarchy = ['EXPLORER', 'SEEKER', 'CREATOR', 'SOVEREIGN', 'ADMIN'];
      const userTierIndex = tierHierarchy.indexOf(userTier);
      
      const hasAccess = item.tier.some(requiredTier => {
        const requiredTierIndex = tierHierarchy.indexOf(requiredTier);
        return userTierIndex >= requiredTierIndex;
      });
      
      if (!hasAccess) return false;
    }
    
    return true;
  });
};