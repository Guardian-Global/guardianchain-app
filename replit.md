# GuardianChain - Replit Deployment Guide

## Overview

GuardianChain is a Web3 truth verification platform that enables users to create immutable "truth capsules" - content submissions that can be verified by the community and sealed using DocuSign's Veritas technology. The platform combines blockchain technology with traditional verification methods to create a decentralized truth ecosystem where users earn GTT (Guardian Truth Token) rewards for accurate submissions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router alternative)
- **Styling**: Tailwind CSS with custom design system using CSS variables
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state management
- **Web3 Integration**: Wagmi v2 for Ethereum interactions
- **Build Tool**: Vite with hot module replacement
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with structured error handling and logging middleware
- **Authentication**: Auth0 integration (configured but not fully implemented)
- **External Integrations**: DocuSign for Veritas sealing, Stripe for payments

### Blockchain Integration
- **Smart Contracts**: Solidity contracts deployed with Hardhat
- **Networks**: Local Hardhat (deployed), Sepolia testnet (ready), Polygon Amoy (configured)
- **Key Contracts**:
  - GTTToken: ERC-20 token for governance and rewards
  - TruthVault: Permanent capsule sealing and yield claiming
  - CapsuleFactory: On-chain capsule creation and management

## Key Components

### Core Entities (Database Schema)
1. **Users**: Auth0 integration, wallet addresses, reputation scoring, GTT balances
2. **Capsules**: Truth submissions with content, metadata, verification status, and rewards
3. **Verifications**: Community voting system for truth validation
4. **Transactions**: GTT token transfers and reward tracking
5. **Achievements**: Gamification system for user engagement

### Smart Contract System
- **GTTToken Contract**: ERC-20 token with minting capabilities for rewards
- **TruthVault Contract**: Handles capsule sealing, yield calculations, and claim processing
- **CapsuleFactory Contract**: On-chain capsule creation and metadata management

### Frontend Pages
- **Home**: Hero section with stats, featured capsules, and explainer video
- **Create Capsule**: Form for submitting new truth claims with evidence
- **Explore**: Capsule discovery with filtering, search, and categorization
- **Dashboard**: Operator view for monitoring capsule activity and grief analytics
- **Commander**: Admin control panel for GTT minting and protocol management
- **Contract Demo**: Interactive smart contract testing interface
- **Governance**: DAO voting and proposal management
- **Private Feed**: Friend-only capsule sharing system

## Data Flow

### Capsule Lifecycle
1. **Creation**: User submits capsule via form → stored in PostgreSQL → optional blockchain registration
2. **Verification**: Community votes on truth claims → grief score calculation → status updates
3. **Sealing**: High-quality capsules → DocuSign Veritas sealing → immutable PDF certificate
4. **Rewards**: Yield calculation based on engagement → GTT token distribution → blockchain claims
5. **Minting**: Verified capsules → NFT minting → permanent blockchain record

### Truth Yield Calculation
- **Base Metrics**: Views (0.5x), shares (1.5x), verifications (3.0x)
- **Bonus Multipliers**: Minting (+10.0), Veritas sealing (+5.0), community votes (+2.0)
- **Grief Score Impact**: Higher grief scores reduce yield (1 - grief × 0.1 multiplier)
- **GTT Conversion**: 1 yield point = 0.1 GTT base rate with reputation bonuses

## External Dependencies

### Database & Storage
- **PostgreSQL**: Primary database via Neon serverless connection
- **Drizzle ORM**: TypeScript-first database toolkit with migrations
- **Supabase**: File storage for media assets and metadata

### Blockchain Infrastructure
- **Hardhat**: Smart contract development and local testing
- **Wagmi**: React hooks for Ethereum interactions
- **MetaMask**: Primary wallet connection method
- **Alchemy/Infura**: RPC providers for mainnet/testnet connections

### Third-Party Services
- **DocuSign**: Veritas technology for legal document sealing
- **Auth0**: User authentication and identity management
- **Stripe**: Payment processing for premium features
- **OpenAI**: Potential AI integration for content analysis

### Development Tools
- **TypeScript**: Full-stack type safety
- **ESBuild**: Fast backend compilation
- **Vite**: Frontend development server with HMR
- **Tailwind CSS**: Utility-first styling approach

## Deployment Strategy

### Current Status
- **Local Development**: Fully functional with deployed smart contracts on Hardhat network
- **Smart Contracts**: Deployed locally (GTTToken, TruthVault, CapsuleFactory)
- **Database**: Connected to Neon PostgreSQL with Drizzle schema
- **Environment**: All secrets configured for DocuSign, Stripe, and database

### Testnet Deployment
1. **Sepolia Deployment**: Contracts ready for deployment with wallet funding needed
2. **Frontend Updates**: Contract addresses automatically updated via constants.ts
3. **Verification**: Block explorer verification for transparency

### Production Considerations
- **Environment Variables**: All secrets properly configured for production
- **Database Migrations**: Drizzle migrations ready for production deployment
- **Smart Contract Security**: OpenZeppelin contracts for security standards
- **API Rate Limiting**: Consider implementing for DocuSign and blockchain calls
- **File Upload**: Implement IPFS integration for decentralized storage

The application is production-ready for testnet deployment and includes comprehensive testing interfaces for validating all Web3 functionality.