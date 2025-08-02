/**
 * GUARDIANCHAIN MODULE REGISTRY v1.0.0
 * Auto-generated documentation of all logic modules for grants and technical documentation
 * Generated: August 2, 2025
 */

export interface ModuleInfo {
  name: string;
  path: string;
  description: string;
  category: 'core' | 'auth' | 'ui' | 'web3' | 'api' | 'utils' | 'features';
  dependencies: string[];
  exportedTypes?: string[];
  grantRelevance: 'high' | 'medium' | 'low';
}

export const GUARDIANCHAIN_MODULES: ModuleInfo[] = [
  // Core Authentication System
  {
    name: 'Debug Authentication',
    path: 'server/middleware/debugAuth.ts',
    description: 'Production-ready debug authentication system with tier-based access control',
    category: 'auth',
    dependencies: ['express', 'jsonwebtoken'],
    exportedTypes: ['DebugUser', 'UserTier'],
    grantRelevance: 'high'
  },
  {
    name: 'Auth Hooks',
    path: 'client/src/hooks/useAuth.ts',
    description: 'React hooks for authentication state management',
    category: 'auth',
    dependencies: ['react', '@tanstack/react-query'],
    exportedTypes: ['AuthUser', 'AuthState'],
    grantRelevance: 'high'
  },
  {
    name: 'Tier Management',
    path: 'client/src/hooks/useUserTier.ts',
    description: 'User subscription tier management and access control',
    category: 'auth',
    dependencies: ['react', 'useAuth'],
    exportedTypes: ['UserTier', 'TierLimits'],
    grantRelevance: 'high'
  },

  // Web3 Integration
  {
    name: 'Web3 Provider',
    path: 'client/src/context/Web3Context.tsx',
    description: 'Ethereum and Polygon blockchain integration',
    category: 'web3',
    dependencies: ['ethers', 'wagmi', 'viem'],
    exportedTypes: ['Web3State', 'NetworkConfig'],
    grantRelevance: 'high'
  },
  {
    name: 'GTT Token Contract',
    path: 'contracts/GTTToken.sol',
    description: 'ERC-20 token with staking and governance features',
    category: 'web3',
    dependencies: ['@openzeppelin/contracts'],
    exportedTypes: ['GTTToken'],
    grantRelevance: 'high'
  },
  {
    name: 'Truth Vault Contract',
    path: 'contracts/TruthVault.sol',
    description: 'NFT contract for truth capsule storage and verification',
    category: 'web3',
    dependencies: ['@openzeppelin/contracts'],
    exportedTypes: ['TruthVault', 'CapsuleMetadata'],
    grantRelevance: 'high'
  },

  // Core Features
  {
    name: 'Capsule System',
    path: 'client/src/features/capsules',
    description: 'Truth capsule creation, verification, and management system',
    category: 'features',
    dependencies: ['react', 'zod', 'ipfs'],
    exportedTypes: ['Capsule', 'CapsuleType', 'VerificationStatus'],
    grantRelevance: 'high'
  },
  {
    name: 'Dashboard Analytics',
    path: 'client/src/features/dashboard',
    description: 'User dashboard with analytics and tier management',
    category: 'features',
    dependencies: ['react', 'recharts', 'framer-motion'],
    exportedTypes: ['DashboardData', 'AnalyticsMetrics'],
    grantRelevance: 'medium'
  },
  {
    name: 'Veritas Tools',
    path: 'client/src/features/veritas',
    description: 'Professional verification tools for legal and enterprise use',
    category: 'features',
    dependencies: ['react', 'docusign', 'pdf-lib'],
    exportedTypes: ['VeritasSeal', 'TruthBounty'],
    grantRelevance: 'high'
  },

  // API Layer
  {
    name: 'Server Routes',
    path: 'server/routes.ts',
    description: 'RESTful API endpoints with authentication and validation',
    category: 'api',
    dependencies: ['express', 'zod', 'drizzle-orm'],
    exportedTypes: ['ApiResponse', 'ErrorResponse'],
    grantRelevance: 'medium'
  },
  {
    name: 'Database Schema',
    path: 'shared/schema.ts',
    description: 'Drizzle ORM schema definitions for all data models',
    category: 'core',
    dependencies: ['drizzle-orm', 'zod'],
    exportedTypes: ['User', 'Capsule', 'Transaction', 'Achievement'],
    grantRelevance: 'medium'
  },

  // UI Components
  {
    name: 'UI Components',
    path: 'client/src/components/ui',
    description: 'Reusable UI components built with Radix and Tailwind',
    category: 'ui',
    dependencies: ['@radix-ui/react', 'tailwindcss', 'framer-motion'],
    exportedTypes: ['ButtonProps', 'CardProps', 'DialogProps'],
    grantRelevance: 'low'
  },
  {
    name: 'Theme Provider',
    path: 'client/src/context/ThemeContext.tsx',
    description: 'Dark/light theme management with persistent storage',
    category: 'ui',
    dependencies: ['react', 'tailwindcss'],
    exportedTypes: ['ThemeState', 'ThemeConfig'],
    grantRelevance: 'low'
  },

  // Utilities
  {
    name: 'IPFS Integration',
    path: 'lib/ipfs.ts',
    description: 'Decentralized storage for capsule content and metadata',
    category: 'utils',
    dependencies: ['ipfs-http-client'],
    exportedTypes: ['IPFSConfig', 'UploadResult'],
    grantRelevance: 'high'
  },
  {
    name: 'Encryption Utils',
    path: 'lib/encryption.ts',
    description: 'AES encryption for sensitive capsule data',
    category: 'utils',
    dependencies: ['crypto'],
    exportedTypes: ['EncryptionConfig', 'DecryptionResult'],
    grantRelevance: 'high'
  }
];

/**
 * Module statistics for grant applications
 */
export const MODULE_STATS = {
  total: GUARDIANCHAIN_MODULES.length,
  byCategory: GUARDIANCHAIN_MODULES.reduce((acc, module) => {
    acc[module.category] = (acc[module.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>),
  highPriority: GUARDIANCHAIN_MODULES.filter(m => m.grantRelevance === 'high').length,
  coreModules: GUARDIANCHAIN_MODULES.filter(m => m.category === 'core' || m.category === 'auth').length
};

/**
 * Generate documentation for specific module category
 */
export function getModulesByCategory(category: ModuleInfo['category']): ModuleInfo[] {
  return GUARDIANCHAIN_MODULES.filter(module => module.category === category);
}

/**
 * Generate grant-relevant module summary
 */
export function getGrantRelevantModules(): ModuleInfo[] {
  return GUARDIANCHAIN_MODULES.filter(module => module.grantRelevance === 'high');
}