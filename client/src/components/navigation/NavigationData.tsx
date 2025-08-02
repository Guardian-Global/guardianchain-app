import { 
  Home, Shield, Clock, Globe, TrendingUp, Users, 
  Settings, Plus, Search, Trophy, Star, Lock,
  Brain, Heart, FileText, Video, Image, Archive,
  DollarSign, BarChart3, Gavel, Flag, Mail,
  Map, Eye, Database, Code, Zap, Crown,
  Target, Rocket, Gift, UserPlus, Coffee
} from 'lucide-react';

export interface NavigationItem {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: any;
  category: string;
  tier?: string[];
  adminOnly?: boolean;
  daoOnly?: boolean;
  validatorOnly?: boolean;
  isNew?: boolean;
  isPopular?: boolean;
  badges?: string[];
}

export const navigationItems: NavigationItem[] = [
  // Core Platform
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Your truth vault command center',
    path: '/dashboard',
    icon: Home,
    category: 'Core',
    isPopular: true
  },
  {
    id: 'create-capsule',
    title: 'Create Capsule',
    description: 'Preserve your truth forever',
    path: '/create',
    icon: Plus,
    category: 'Creation',
    isPopular: true
  },
  {
    id: 'eternal-contracts',
    title: 'Eternal Contracts',
    description: 'Immutable declarations and wills',
    path: '/eternal-contracts',
    icon: Lock,
    category: 'Creation',
    tier: ['SEEKER', 'CREATOR', 'SOVEREIGN'],
    isNew: true
  },
  {
    id: 'explorer',
    title: 'Truth Explorer',
    description: 'Discover verified capsules',
    path: '/explorer',
    icon: Search,
    category: 'Core'
  },
  {
    id: 'guardian-map',
    title: 'Guardian Map',
    description: 'Global network visualization',
    path: '/guardian-map',
    icon: Map,
    category: 'Network',
    isNew: true
  },

  // Capsule Types
  {
    id: 'family-legacy',
    title: 'Family Legacy',
    description: 'Preserve family memories and stories',
    path: '/family-legacy',
    icon: Heart,
    category: 'Capsules'
  },
  {
    id: 'whistleblower-sanctuary',
    title: 'Whistleblower Sanctuary',
    description: 'Protected truth revelation',
    path: '/whistleblower-sanctuary',
    icon: Flag,
    category: 'Capsules',
    tier: ['CREATOR', 'SOVEREIGN']
  },
  {
    id: 'conspiracy-capsule',
    title: 'Conspiracy Capsule',
    description: 'Investigate and expose truth',
    path: '/conspiracy-capsule',
    icon: Eye,
    category: 'Capsules',
    tier: ['SEEKER', 'CREATOR', 'SOVEREIGN']
  },
  {
    id: 'time-messages',
    title: 'Time Messages',
    description: 'Future-locked communications',
    path: '/time-messages',
    icon: Clock,
    category: 'Capsules'
  },

  // Governance & DAO
  {
    id: 'dao-governance',
    title: 'DAO Governance',
    description: 'Participate in platform decisions',
    path: '/dao',
    icon: Gavel,
    category: 'Governance',
    daoOnly: true
  },
  {
    id: 'dao-proposals',
    title: 'Active Proposals',
    description: 'Vote on community proposals',
    path: '/dao/proposals',
    icon: FileText,
    category: 'Governance',
    daoOnly: true,
    badges: ['new-proposal']
  },
  {
    id: 'jury-voting',
    title: 'Jury Panel',
    description: 'Truth verification voting',
    path: '/jury',
    icon: Users,
    category: 'Governance',
    tier: ['CREATOR', 'SOVEREIGN']
  },

  // Analytics & Yield
  {
    id: 'analytics',
    title: 'Analytics Hub',
    description: 'Truth impact and yield metrics',
    path: '/analytics',
    icon: BarChart3,
    category: 'Analytics',
    tier: ['SEEKER', 'CREATOR', 'SOVEREIGN']
  },
  {
    id: 'yield-calculator',
    title: 'Yield Calculator',
    description: 'GTT earnings and projections',
    path: '/yield',
    icon: TrendingUp,
    category: 'Analytics',
    badges: ['unclaimed-yield']
  },
  {
    id: 'smri-rankings',
    title: 'SMRI Rankings',
    description: 'Sovereign Memory Reputation Index',
    path: '/smri',
    icon: Trophy,
    category: 'Analytics'
  },
  {
    id: 'treasury',
    title: 'Treasury Monitor',
    description: 'Platform treasury analytics',
    path: '/treasury',
    icon: DollarSign,
    category: 'Analytics',
    tier: ['SOVEREIGN'],
    adminOnly: true
  },

  // Validator & Admin Tools
  {
    id: 'validator-dashboard',
    title: 'Validator Dashboard',
    description: 'Network validation tools',
    path: '/validator',
    icon: Shield,
    category: 'Tools',
    validatorOnly: true,
    badges: ['pending-review']
  },
  {
    id: 'admin-panel',
    title: 'Admin Panel',
    description: 'Platform administration',
    path: '/admin',
    icon: Settings,
    category: 'Tools',
    adminOnly: true
  },
  {
    id: 'system-validation',
    title: 'System Validation',
    description: 'Platform health monitoring',
    path: '/system-validation',
    icon: Database,
    category: 'Tools',
    adminOnly: true
  },

  // Advanced Features
  {
    id: 'lineage-graph',
    title: 'Truth Lineage',
    description: 'Capsule connection visualization',
    path: '/lineage',
    icon: Globe,
    category: 'Advanced',
    tier: ['CREATOR', 'SOVEREIGN']
  },
  {
    id: 'ai-advisor',
    title: 'AI Advisor',
    description: 'Intelligent content guidance',
    path: '/ai-advisor',
    icon: Brain,
    category: 'Advanced',
    tier: ['SEEKER', 'CREATOR', 'SOVEREIGN'],
    isNew: true
  },
  {
    id: 'blockchain-playground',
    title: 'Blockchain Playground',
    description: 'Smart contract interaction',
    path: '/blockchain-playground',
    icon: Code,
    category: 'Advanced',
    tier: ['SOVEREIGN']
  },

  // Platform Tools
  {
    id: 'capsule-gallery',
    title: 'NFT Gallery',
    description: 'Your truth capsule collection',
    path: '/capsules/gallery',
    icon: Image,
    category: 'Platform'
  },
  {
    id: 'profile-dashboard',
    title: 'Profile Center',
    description: 'Manage your guardian profile',
    path: '/profile',
    icon: Users,
    category: 'Platform'
  },
  {
    id: 'referral-program',
    title: 'Referral Program',
    description: 'Earn through community growth',
    path: '/referral',
    icon: UserPlus,
    category: 'Platform'
  },
  {
    id: 'whitepapers',
    title: 'Documentation',
    description: 'Technical papers and guides',
    path: '/whitepapers',
    icon: FileText,
    category: 'Platform'
  }
];

// Helper function to get visible navigation based on user permissions
export function getVisibleNavigation(user: any): NavigationItem[] {
  if (!user) return navigationItems.filter(item => 
    !item.tier && !item.adminOnly && !item.daoOnly && !item.validatorOnly
  );

  return navigationItems.filter(item => {
    // Check tier requirements
    if (item.tier && item.tier.length > 0) {
      const userTier = user.tier || 'EXPLORER';
      const tierHierarchy = ['EXPLORER', 'SEEKER', 'CREATOR', 'SOVEREIGN'];
      const userTierIndex = tierHierarchy.indexOf(userTier);
      const hasRequiredTier = item.tier.some(requiredTier => {
        const requiredIndex = tierHierarchy.indexOf(requiredTier);
        return userTierIndex >= requiredIndex;
      });
      if (!hasRequiredTier) return false;
    }

    // Check admin permissions
    if (item.adminOnly) {
      const isAdmin = user.email === 'founder@guardianchain.app' || 
                     user.email === 'master@guardianchain.app' ||
                     user.tier === 'ADMIN';
      if (!isAdmin) return false;
    }

    // Check DAO membership
    if (item.daoOnly) {
      const isDaoMember = user.tier === 'CREATOR' || 
                         user.tier === 'SOVEREIGN' ||
                         user.gttBalance > 1000;
      if (!isDaoMember) return false;
    }

    // Check validator status
    if (item.validatorOnly) {
      const isValidator = user.email === 'founder@guardianchain.app' || 
                         user.email === 'master@guardianchain.app' ||
                         user.isValidator === true;
      if (!isValidator) return false;
    }

    return true;
  });
}

// Category metadata
export const categoryInfo = {
  'Core': {
    title: 'Core Platform',
    description: 'Essential platform features',
    icon: Home,
    color: 'blue'
  },
  'Creation': {
    title: 'Content Creation',
    description: 'Create and preserve truth',
    icon: Plus,
    color: 'green'
  },
  'Capsules': {
    title: 'Capsule Types',
    description: 'Specialized truth containers',
    icon: Archive,
    color: 'purple'
  },
  'Governance': {
    title: 'DAO Governance',
    description: 'Community decision making',
    icon: Gavel,
    color: 'orange'
  },
  'Analytics': {
    title: 'Analytics & Yield',
    description: 'Performance and earnings',
    icon: BarChart3,
    color: 'indigo'
  },
  'Tools': {
    title: 'Admin Tools',
    description: 'Platform management',
    icon: Settings,
    color: 'red'
  },
  'Advanced': {
    title: 'Advanced Features',
    description: 'Power user capabilities',
    icon: Zap,
    color: 'yellow'
  },
  'Platform': {
    title: 'Platform Features',
    description: 'General platform tools',
    icon: Globe,
    color: 'gray'
  },
  'Network': {
    title: 'Network Tools',
    description: 'Guardian network features',
    icon: Map,
    color: 'teal'
  }
};