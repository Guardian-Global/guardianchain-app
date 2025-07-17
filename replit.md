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