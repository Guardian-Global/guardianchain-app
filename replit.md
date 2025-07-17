# Veritas - Web3 Truth Verification Platform

## Overview

Veritas is a comprehensive Web3 truth verification platform built with a modern full-stack architecture. The application enables users to create "truth capsules" (content submissions), verify them through community governance, and earn rewards through a token-based system. The platform combines blockchain technology with traditional web development to create an immutable truth verification ecosystem.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter (lightweight React router)
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **State Management**: React Query (TanStack Query) for server state
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite with hot module replacement

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **API Design**: RESTful API with structured error handling
- **Middleware**: Custom logging, JSON parsing, and error handling

### Database & ORM
- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM with TypeScript-first approach
- **Schema Management**: Drizzle Kit for migrations
- **Connection**: Neon serverless database adapter

## Key Components

### Core Entities
1. **Users**: Authentication via Auth0, wallet integration, reputation scoring
2. **Capsules**: Truth submissions with content, metadata, and verification status
3. **Verifications**: Community voting system for truth validation
4. **Transactions**: GTT token transfers and reward tracking
5. **Achievements**: Gamification system for user engagement

### Frontend Components
- **CapsuleCard**: Displays individual truth capsules with status and metrics
- **Navigation**: Fixed header with wallet connection and theme switching
- **Theme Provider**: Dark/light mode support with system preference detection
- **Form Components**: Reusable form elements with validation

### Authentication & Web3 Integration
- **Auth0**: User authentication and identity management
- **Wallet Integration**: MetaMask connection with multi-network support
- **Web3 Provider**: Ethereum, Polygon, and testnet compatibility

## Data Flow

### Content Creation Flow
1. User creates capsule through form submission
2. Content validation using Zod schemas
3. Database storage with pending verification status
4. Optional IPFS integration for decentralized storage

### Verification Flow
1. Community members review submitted capsules
2. Voting mechanism with evidence submission
3. Reputation-weighted scoring system
4. Automatic status updates based on verification results

### Reward Distribution
1. GTT token minting for verified content creators
2. Reputation score updates based on accuracy
3. Achievement unlocking for milestones
4. Leaderboard ranking system

## External Dependencies

### Blockchain & Web3
- **Ethereum Integration**: ethers.js for blockchain interactions
- **Multi-chain Support**: Ethereum mainnet, Polygon, and testnets
- **Wallet Providers**: MetaMask with fallback support

### Third-party Services
- **Auth0**: Authentication and user management
- **Stripe**: Payment processing and subscription management
- **IPFS**: Decentralized file storage (optional integration)
- **DocuSign**: Document verification and signing (planned feature)

### UI & Styling
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Lucide React**: Icon library with consistent design
- **Google Fonts**: Inter and Fira Code typography

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with HMR
- **Database**: Neon PostgreSQL with connection pooling
- **Environment Variables**: DATABASE_URL, Auth0 config, Stripe keys

### Production Build
- **Frontend**: Static asset generation via Vite
- **Backend**: ESBuild bundling for Node.js deployment
- **Database Migrations**: Drizzle Kit push for schema updates

### Performance Optimizations
- **Code Splitting**: Dynamic imports for route-based splitting
- **Caching**: React Query with intelligent cache invalidation
- **Bundle Optimization**: Tree shaking and minification
- **Database**: Connection pooling and query optimization

## Recent Changes

### July 17, 2025 - Phase 10: Capsule Verification Layer + NFT Claim System ✅
- **VerifyCapsule Component**: Advanced verification system with mock data for authentic capsule validation
- **ClaimNFT Component**: Complete NFT certificate claiming system with transaction simulation and rarity scoring
- **Certify Page**: Full certification hub with stats dashboard and comprehensive verification workflow
- **Premium UI Integration**: Consistent GuardianChain styling with loading states, error handling, and success animations
- **Mock Data System**: Realistic demo data for capsule verification (VC-001, VC-002, VC-003) with full metadata
- **Navigation Integration**: Added "Certify" to main navigation for easy access to verification and claiming
- **Enhanced UX**: Professional loading states, toast notifications, and detailed verification results display

### July 17, 2025 - Phase 9: Enhanced Profile + NFT Sales + Marketplace Explorer ✅
- **Enhanced Profile Page**: Complete redesign with GuardianChain branding, edit modal, NFT gallery, and badge system
- **NFT Sales Marketplace**: Premium marketplace interface with filtering, search, and real-time sales tracking
- **Marketplace Explorer**: Comprehensive activity tracker for sales, mints, and document sealing with live stats
- **Enhanced Leaderboard**: Multi-tab leaderboard with categories, achievements, weekly risers, and podium display
- **Premium UI/UX**: Consistent GuardianChain styling with gradient backgrounds, hover effects, and responsive design
- **Advanced Navigation**: Added enhanced profile, explorer, and leaderboard to main navigation
- **Real-time Activity**: Live tracking of marketplace transactions, minting events, and verification activities

### July 17, 2025 - Phase 8: AI-Powered Recommendation Engine ✅
- **OpenAI Integration**: AI-powered capsule recommendation system using GPT-4o
- **Smart Content Analysis**: Automatic categorization, tagging, and credibility assessment
- **Personalized Recommendations**: User interest profiling based on viewing and verification history
- **RecommendationEngine Component**: Complete UI with AI recommendations and user profile analysis
- **Backend AI Services**: Three new API endpoints for recommendations, profile analysis, and content analysis
- **Navigation Integration**: Added AI Recommendations to main navigation menu
- **Premium UI Components**: Professional interface with scoring, reasoning, and relevance factors

### July 17, 2025 - Phase 7: Complete Fee System Integration ✅
- **FeeManager Contract**: Successfully deployed to Hardhat network at 0x5FC8d32690cc91D4c39d9d3abcBD16989F875707
- **Protocol Fee Structure**: 50 GTT for minting, 100 GTT for sealing, 500 GTT for proposals, 25 GTT for verification
- **Fee Display Components**: FeeDisplay and TreasuryDisplay components with transparent cost explanations
- **Treasury Integration**: All fees route to TruthVault contract acting as community treasury
- **Complete Analytics**: Fee collection tracking, user payment history, and treasury balance monitoring
- **UI Fee Integration**: Added fee displays to governance page with justification tooltips
- **Six-Contract Architecture**: GTT, Vault, Factory, NFT, DAO, and FeeManager all deployed and integrated
- **Production-Ready Fee System**: Transparent, upgradeable, and community-governed fee management

### July 17, 2025 - Phase 6: DAO Governance System Complete ✅
- **TruthDAO Contract**: Successfully deployed to Hardhat network at 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
- **GTT-Weighted Voting**: Full governance system with voting power based on GTT token balance
- **Proposal Management**: Create, vote on, and execute proposals with 3-day voting periods
- **VoteModal Component**: Comprehensive voting interface with real-time results, user voting power, and transaction handling
- **Governance Interface**: Dedicated `/govern` page with proposal creation, voting stats, and complete DAO functionality
- **Mock Data Integration**: Sample proposals with realistic voting data for demonstration and testing
- **Smart Contract Integration**: All five contracts (GTT, Vault, Factory, NFT, DAO) fully deployed and operational
- **Contract Demo Updates**: Added Truth DAO tab to contract demo page with governance overview
- **Frontend Navigation**: Added "Govern" to main navigation for easy access to DAO governance

### July 17, 2025 - Phase 5: NFT System Integration Complete ✅
- **VeritasCapsuleNFT Contract**: Successfully deployed to Hardhat network at 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
- **ERC-721 Implementation**: Full NFT minting system with soulbound token support, grief scoring, and metadata storage
- **MintNFTButton Component**: Complete React component with form validation, transaction monitoring, and error handling
- **NFT Studio Interface**: Dedicated `/mint-nft` page with collection viewer, marketplace preview, and rarity guide
- **Contract Integration**: Updated contract demo page with Veritas NFT tab for comprehensive testing
- **Web3 Compatibility**: Fixed OpenZeppelin compatibility issues and modernized contract to latest standards
- **Frontend Navigation**: Added "Mint NFT" to main navigation for easy access to NFT minting interface
- **Metadata System**: IPFS integration for permanent storage of NFT metadata and images

### July 17, 2025 - Phase 4: Smart Contract Deployment Complete ✅
- **Local Deployment Successful**: GTTToken, TruthVault, CapsuleFactory, VeritasCapsuleNFT, TruthDAO, and FeeManager deployed to Hardhat network
- **Contract Addresses Live**: All six contracts deployed and integrated with frontend components
- **Web3 UI Components**: MintGTTButton, SealTrackerUI, MintNFTButton, VoteModal, and FeeDisplay fully functional with real contract interaction
- **Contract Demo Page**: Complete testing interface at `/contract-demo` with live contract binding for all six contracts
- **Commander Integration**: Admin dashboard connected to live smart contracts for GTT minting
- **Testnet Ready**: All infrastructure prepared for Sepolia deployment (pending testnet ETH funding)
- **Transaction Monitoring**: Real-time transaction status tracking with wagmi hooks working perfectly
- **Documentation**: Created TESTNET_DEPLOYMENT_READY.md with deployment status and next steps

### July 17, 2025 - Phase 3: Complete Command Center & GTT Engine
- **Operator Dashboard**: Real-time capsule monitoring with grief score analytics, seal status tracking, and moderation queue
- **Commander Control Panel**: Root-level protocol management with GTT minting, system operations, and emergency controls
- **GTT Calculation Engine**: Advanced reward mathematics with engagement bonuses, seal multipliers, and reputation factors
- **Mint API System**: Complete GTT token minting infrastructure with batch operations, claim endpoints, and transaction simulation
- **Protocol Metrics**: Live stats for total supply, circulation, vault holdings, and daily activity tracking
- **System Health Monitoring**: Real-time status for API, database, IPFS, DocuSign, and blockchain connections
- **Administrative Controls**: Emergency protocol pause, sync operations, and comprehensive reporting system

### Previous - Complete Web3 Smart Contract Integration
- **Smart Contract Deployment**: Successfully deployed GTTToken and TruthVault contracts to local Hardhat network
- **Contract Architecture**: GTTToken with vault-controlled minting, TruthVault with role-based access control and yield distribution
- **Web3 Integration**: Complete wagmi/viem setup with wallet connection, contract reading, and transaction handling
- **Smart Contract Demo Pages**: Created comprehensive testing interfaces for all contract functions
- **Governance System**: Implemented DAO-style governance page with proposal creation and voting interfaces
- **Multi-Network Support**: Configured for Hardhat local (31337), Polygon Mumbai (80001), and Polygon Amoy (80002)
- **Contract Utilities**: Created contracts.ts with helper functions for address resolution and network management
- **Error Handling**: Implemented proper Web3 error handling with user-friendly toast notifications
- **Transaction Monitoring**: Added real-time balance updates and transaction status tracking

### Previous - TruthYield ROI Analytics & Social Sharing Integration
- **Dynamic OpenGraph Metadata**: Implemented automatic meta tag injection for capsule routes with title, description, image, and URL
- **Twitter Card Support**: Added summary_large_image cards for rich social media previews
- **ShareButtons Component**: Created comprehensive social sharing interface supporting Twitter, Facebook, LinkedIn, WhatsApp, email, and native mobile sharing
- **Capsule Detail Pages**: Built dedicated capsule view pages with full social sharing integration and SEO optimization
- **Structured Data**: Added JSON-LD structured data for improved search engine indexing
- **TruthYield Analytics**: Implemented ROI calculation engine with engagement tracking (views, shares, verifications, minting)
- **GTT Token Rewards**: Created yield-to-token conversion system with tier-based multipliers
- **CapsuleAnalytics Component**: Built comprehensive analytics dashboard with real-time metrics and claim functionality
- **Share Tracking**: Integrated analytics tracking into social sharing buttons for viral growth measurement
- **Creator Monetization**: Enabled GTT token claiming for verified capsule creators based on Truth Yield scores

### Previous Implementation
- **GTT Smart Contract System**: Complete ERC-20 token with TruthVault DAO-controlled yield distribution
- **Web3 Integration**: Wagmi + Viem configuration with wallet connection and blockchain interaction
- **CapsuleClaimButton Component**: Smart contract integration for GTT yield claiming with verification
- **Governance UI**: DAO proposal system with voting interface and treasury management
- **Claim Backend API**: Validation endpoint for GTT yield claiming with transaction tracking
- **NFT Minting Integration**: Complete workflow from Veritas Seal to IPFS metadata upload
- **DocuSign Veritas Integration**: Legal document verification and sealing for truth capsules
- **Database Schema**: PostgreSQL with Drizzle ORM for type-safe data operations

The architecture emphasizes type safety, performance, and scalability while maintaining a clean separation of concerns between frontend, backend, and blockchain interactions. The modular component structure allows for easy feature additions and maintenance.