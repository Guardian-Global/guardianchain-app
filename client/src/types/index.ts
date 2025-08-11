// Re-export schema types for convenience
export type {
  User,
  InsertUser,
  Capsule,
  InsertCapsule,
  Proposal,
  InsertProposal,
  Vote,
  InsertVote,
  Subscription,
  InsertSubscription,
  SelectUser,
  SelectCapsule,
  SelectProposal,
  SelectVote,
  SelectSubscription
} from "./schema";

// Frontend-specific types
export interface WalletState {
  isConnected: boolean;
  account: string | null;
  balance: string | null;
  chainId: string | null;
  isConnecting: boolean;
}

export interface Theme {
  mode: "light" | "dark" | "system";
}

export interface UserPreferences {
  theme: Theme["mode"];
  notifications: {
    email: boolean;
    browser: boolean;
    mobile: boolean;
  };
  privacy: {
    profileVisible: boolean;
    activityVisible: boolean;
    walletVisible: boolean;
  };
  display: {
    language: string;
    currency: string;
    timezone: string;
  };
}

export interface PlatformStats {
  totalCapsules: number;
  verifiedTruths: number;
  totalRewards: string;
  activeUsers: number;
  totalTransactions: number;
  averageGriefScore: number;
}

export interface CapsuleFilters {
  status?: string;
  category?: string;
  creatorId?: number;
  isPublic?: boolean;
  sortBy?: "newest" | "oldest" | "score" | "trending";
  limit?: number;
  offset?: number;
}

export interface SearchFilters {
  query: string;
  category: string;
  status: string;
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  griefScoreRange: {
    min: number;
    max: number;
  };
}

export interface NotificationSettings {
  capsuleVerified: boolean;
  capsuleRejected: boolean;
  newFollower: boolean;
  mentionInComment: boolean;
  weeklyDigest: boolean;
  securityAlerts: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface UploadProgress {
  progress: number;
  status: "idle" | "uploading" | "success" | "error";
  error?: string;
}

export interface Web3TransactionResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  external_url?: string;
}

export interface VerificationEvidence {
  type: "link" | "document" | "image" | "video" | "other";
  url: string;
  description: string;
  hash?: string;
}

export interface CapsuleMetadata {
  tags?: string[];
  references?: string[];
  methodology?: string;
  confidence?: number;
  evidence?: VerificationEvidence[];
  collaborators?: number[];
}

export interface LeaderboardEntry {
  rank: number;
  user: User;
  score: number;
  change: number; // Position change from previous period
  trend: "up" | "down" | "same";
}

export interface ActivityLog {
  id: string;
  userId: number;
  type:
    | "capsule_created"
    | "capsule_verified"
    | "verification_submitted"
    | "reward_earned"
    | "achievement_unlocked";
  description: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

export interface RecentSearch {
  query: string;
  timestamp: Date;
  resultCount: number;
}

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
  duration?: number;
}

export interface NetworkInfo {
  chainId: string;
  chainName: string;
  rpcUrls: string[];
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorerUrls: string[];
}

export interface WalletError {
  code: number;
  message: string;
  data?: any;
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Form types
export interface CreateCapsuleForm {
  title: string;
  description: string;
  content: string;
  category: string;
  isPublic: boolean;
  tags?: string[];
  evidence?: VerificationEvidence[];
}

export interface VerificationForm {
  capsuleId: number;
  vote: "verify" | "reject" | "dispute";
  comment?: string;
  evidence?: string;
  reputationStake?: number;
}

export interface ProfileUpdateForm {
  username?: string;
  email?: string;
  bio?: string;
  website?: string;
  twitter?: string;
  github?: string;
}

// Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LoadingProps extends BaseComponentProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

export interface ErrorProps extends BaseComponentProps {
  error: Error | string;
  retry?: () => void;
}

export interface EmptyStateProps extends BaseComponentProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
}
