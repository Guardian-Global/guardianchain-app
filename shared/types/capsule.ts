/**
 * GUARDIANCHAIN Capsule Data Types
 * Production-ready schema for truth capsule management
 */

export interface CapsuleData {
  capsuleId: string;                    // UUID or numeric ID
  veritasId: string;                    // Veritas certificate anchor (e.g., "VC-CAPSULE-00001")
  author: string;                       // Capsule author wallet address (0x...)
  griefScore: number;                   // Emotional weight (0–100)
  sealedAt: string;                     // ISO seal date (2025-07-30T18:44:00Z)
  yieldAmount: string;                  // GTT yield in decimals (e.g., "328.50")
  validatorWitness: string[];           // Array of validator wallet addresses
  metadataUri: string;                  // IPFS URI for capsule content
  proofHash: string;                    // Combined authorship + grief hash (0xSHA256...)
  minted: boolean;                      // NFT minting status
  claimable: boolean;                   // Yield claim eligibility
}

export interface ExtendedCapsuleData extends CapsuleData {
  title?: string;                       // Human-readable title
  description?: string;                 // Brief description
  category: string;                     // Content category
  verificationStatus: 'verified' | 'pending' | 'unverified';
  emotionalClassification?: {
    primary: string;
    confidence: number;
    therapeuticValue: number;
  };
  createdAt: string;                    // Creation timestamp
  updatedAt: string;                    // Last update timestamp
  viewCount: number;                    // Public view counter
  tags: string[];                       // Content tags
  location?: {
    country: string;
    region?: string;
    coordinates?: [number, number];     // [lat, lng]
  };
  privacyLevel: 'public' | 'restricted' | 'private';
  ancestryChain?: string[];             // Parent capsule IDs
  mediaAttachments: {
    type: 'image' | 'video' | 'audio' | 'document';
    ipfsHash: string;
    filename: string;
    size: number;
  }[];
}

export interface CapsuleValidation {
  validatorAddress: string;
  validationLevel: 1 | 2 | 3;          // Community, Professional, Sovereign
  validatedAt: string;
  validationHash: string;
  consensusWeight: number;              // Validator reputation weight
  validationNotes?: string;
}

export interface YieldClaim {
  capsuleId: string;
  claimerAddress: string;
  claimedAmount: string;
  claimedAt: string;
  transactionHash: string;
  gasUsed: number;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface CapsuleMetrics {
  totalCapsules: number;
  verifiedCapsules: number;
  pendingCapsules: number;
  totalYieldDistributed: string;
  averageGriefScore: number;
  topCategories: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  validatorStats: {
    totalValidators: number;
    activeValidators: number;
    averageValidationTime: number;      // in hours
  };
  geographicDistribution: Array<{
    country: string;
    count: number;
    verifiedCount: number;
  }>;
}

export interface CapsuleSearchFilters {
  category?: string;
  verificationStatus?: 'verified' | 'pending' | 'unverified' | 'all';
  griefScoreRange?: [number, number];
  dateRange?: {
    start: string;
    end: string;
  };
  author?: string;
  location?: string;
  tags?: string[];
  minYieldAmount?: number;
  sortBy: 'recent' | 'griefScore' | 'yieldAmount' | 'viewCount' | 'relevance';
  sortOrder: 'asc' | 'desc';
  limit: number;
  offset: number;
}

export interface CapsuleCreationRequest {
  title: string;
  description: string;
  content: string;                      // Main text content
  category: string;
  tags: string[];
  location?: {
    country: string;
    region?: string;
    coordinates?: [number, number];
  };
  privacyLevel: 'public' | 'restricted' | 'private';
  parentCapsuleId?: string;             // For ancestry linking
  mediaFiles?: Array<{
    file: File | Buffer;
    filename: string;
    type: 'image' | 'video' | 'audio' | 'document';
  }>;
  authorWalletAddress: string;
  expectedGriefScore?: number;          // Author's self-assessment
}

export interface BlockchainCapsuleData {
  tokenId: number;
  contractAddress: string;
  chainId: number;
  transactionHash: string;
  blockNumber: number;
  gasUsed: number;
  mintedAt: string;
  currentOwner: string;
  transferHistory: Array<{
    from: string;
    to: string;
    transactionHash: string;
    timestamp: string;
    gasUsed: number;
  }>;
}

// Utility types for API responses
export type CapsuleResponse = {
  success: boolean;
  data: ExtendedCapsuleData;
  blockchain?: BlockchainCapsuleData;
  validations: CapsuleValidation[];
  yieldClaims: YieldClaim[];
};

export type CapsuleListResponse = {
  success: boolean;
  data: ExtendedCapsuleData[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: CapsuleSearchFilters;
  metrics: Partial<CapsuleMetrics>;
};

// Constants
export const CAPSULE_CATEGORIES = [
  'personal-memory',
  'historical-evidence',
  'whistleblowing',
  'environmental',
  'social-justice',
  'family-legacy',
  'professional-testimony',
  'artistic-expression',
  'scientific-data',
  'legal-documentation',
  'cultural-preservation',
  'trauma-healing',
  'community-story',
  'institutional-accountability'
] as const;

export const VERIFICATION_LEVELS = {
  COMMUNITY: 1,
  PROFESSIONAL: 2,
  SOVEREIGN: 3
} as const;

export const PRIVACY_LEVELS = {
  PUBLIC: 'public',
  RESTRICTED: 'restricted',
  PRIVATE: 'private'
} as const;

export type CapsuleCategory = typeof CAPSULE_CATEGORIES[number];
export type VerificationLevel = typeof VERIFICATION_LEVELS[keyof typeof VERIFICATION_LEVELS];
export type PrivacyLevel = typeof PRIVACY_LEVELS[keyof typeof PRIVACY_LEVELS];