// Client-safe schema types - no server dependencies
// This file contains only type definitions for use in the client

export interface User {
  id: string;
  email: string;
  username?: string;
  displayName?: string;
  bio?: string;
  location?: string;
  website?: string;
  company?: string;
  occupation?: string;
  pronouns?: string;
  timezone?: string;
  profileImage?: string;
  coverImage?: string;
  profileVideo?: string;
  portfolioImages?: string[];
  portfolioVideos?: string[];
  profileMusic?: string;
  customCSS?: string;
  socialLinks?: Record<string, string>;
  isVerified: boolean;
  role: 'admin' | 'mod' | 'user';
  tier: 'free' | 'premium' | 'enterprise';
  gttBalance: string;
  stakingBalance: string;
  unlockedBalance: string;
  lockedBalance: string;
  totalRewards: string;
  referralCode?: string;
  referredBy?: string;
  hashedPassword?: string;
  googleId?: string;
  githubId?: string;
  walletAddress?: string;
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Capsule {
  id: string;
  title: string;
  description?: string;
  content?: any;
  contentType: 'text' | 'image' | 'video' | 'audio' | 'document' | 'mixed';
  ipfsHash?: string;
  blockchainHash?: string;
  isPrivate: boolean;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  category?: string;
  viewCount: number;
  verificationStatus: 'pending' | 'verified' | 'disputed' | 'rejected';
  trustScore: string;
  stakeAmount: string;
  rewardEarned: string;
  isEncrypted: boolean;
  encryptionKey?: string;
  accessLevel: 'public' | 'restricted' | 'private';
  collaborators?: string[];
  version: number;
  parentId?: string;
  derivedFrom?: string[];
  likeCount: number;
  commentCount: number;
  shareCount: number;
  downloadCount: number;
  reportCount: number;
  featuredAt?: Date;
  archivedAt?: Date;
  contractAddress?: string;
  tokenId?: string;
  royaltyPercentage: string;
  isOriginal: boolean;
  sourceUrl?: string;
  sourcePlatform?: string;
  licenseType?: string;
  commercialUse: boolean;
  derivativeAllowed: boolean;
  attributionRequired: boolean;
  geolocation?: any;
  deviceFingerprint?: string;
  creationContext?: any;
  technicalMetadata?: any;
  socialMetrics?: any;
  aiAnalysis?: any;
  blockchainEvents?: any;
  accessHistory?: any;
  verificationHistory?: any;
  moderationHistory?: any;
  analyticsData?: any;
  performance?: any;
  monetization?: any;
  collaboration?: any;
  lifecycle?: any;
  compliance?: any;
  integration?: any;
  customFields?: any;
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  type: 'governance' | 'treasury' | 'technical' | 'community';
  status: 'draft' | 'active' | 'passed' | 'rejected' | 'executed' | 'cancelled';
  proposerId: string;
  startDate: Date;
  endDate: Date;
  executionDate?: Date;
  votesFor: string;
  votesAgainst: string;
  votesAbstain: string;
  totalVotes: string;
  participationRate: string;
  quorumRequired: string;
  passingThreshold: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: any;
  discussionHash?: string;
  implementationDetails?: any;
  budgetRequested?: string;
  timeline?: any;
  risks?: any;
  benefits?: any;
  alternatives?: any;
  technicalSpecs?: any;
  legalConsiderations?: any;
  communityFeedback?: any;
  expertReviews?: any;
  implementationProgress?: any;
  postExecutionReport?: any;
}

export interface Vote {
  id: string;
  proposalId: string;
  voterId: string;
  voteChoice: 'for' | 'against' | 'abstain';
  votingPower: string;
  reason?: string;
  timestamp: Date;
  transactionHash?: string;
  blockNumber?: number;
  delegatedFrom?: string;
  isDelegate: boolean;
  confidence: number;
  metadata?: any;
}

export interface Subscription {
  id: string;
  userId: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  tier: 'free' | 'premium' | 'enterprise';
  status: 'active' | 'inactive' | 'cancelled' | 'past_due' | 'unpaid';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt?: Date;
  trialStart?: Date;
  trialEnd?: Date;
  createdAt: Date;
  updatedAt: Date;
  metadata?: any;
  features?: string[];
  usage?: any;
  billing?: any;
  support?: any;
  customization?: any;
}

// Insert and Select schema types
export type InsertUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type SelectUser = User;

export type InsertCapsule = Omit<Capsule, 'id' | 'createdAt' | 'updatedAt'>;
export type SelectCapsule = Capsule;

export type InsertProposal = Omit<Proposal, 'id' | 'createdAt' | 'updatedAt'>;
export type SelectProposal = Proposal;

export type InsertVote = Omit<Vote, 'id'>;
export type SelectVote = Vote;

export type InsertSubscription = Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>;
export type SelectSubscription = Subscription;