# GuardianChain: Truth Vault Capsule dApp

## Overview
GuardianChain is a sovereign Web3 infrastructure for time-locked proof, grief-score yield, and capsule monetization. The platform enables users to mint Veritas Capsules, earn $GTT yield based on GriefScore™, and submit legacy, trauma, or testimony capsules. Users can replay, verify, and unlock time-sealed capsules through an integrated Veritas Certificate Engine. The project aims to provide institutional-grade memory infrastructure for sealing truth and unlocking value through blockchain technology and AI-powered verification systems.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Frameworks & Libraries**: React with TypeScript, Wouter for routing, Tailwind CSS (with custom design system, Radix UI, shadcn/ui) for styling, React Query for server state, React Hook Form with Zod for forms, Framer Motion for micro-interactions.
- **Build Tool**: Vite.
- **UI/UX**: Supports dark/light mode, incorporates playful micro-interactions and gamification elements, professional branding, responsive design, and enterprise-grade UI/UX standards. Features a comprehensive design token system integrated with Figma style guides, premium visual identity, and PWA offline capabilities.

### Backend
- **Runtime & Language**: Node.js with Express.js, TypeScript.
- **API Design**: RESTful API with structured error handling.
- **Middleware**: Custom logging, JSON parsing, and error handling.
- **Authentication**: Debug authentication system with OAuth integration (Google/GitHub via Passport.js) providing enterprise-grade user authentication, complete user profiles, tier-based access control.
- **Object Storage**: Google Cloud Storage integration with protected file uploading, public asset serving, and ACL policy management.
- **Data Flow**: Automated IPFS integration for content storage, community-driven verification, and GTT token reward distribution.

### Database & ORM
- **Database**: PostgreSQL (configured for Neon serverless).
- **ORM**: Drizzle ORM.
- **Schema Management**: Drizzle Kit.
- **Connection**: Neon serverless database adapter.

### Core Entities & Features
- **Users**: Streamlined debug authentication with comprehensive tier-based access system (EXPLORER/SEEKER/CREATOR/SOVEREIGN), subscription management, and optimized API endpoints for user data and tier management.
- **Authentication System**: Full-featured tiered access control with TierGate component for feature gating, SubscriptionManager for billing, and role-based Dashboard routing.
- **Subscription Tiers**: Four-tier system (Explorer, Seeker, Creator, Sovereign) with progressive feature unlocking and usage limits.
- **Dashboard Flows**: Comprehensive authenticated user experience with Overview, Subscription, Creator Tools, and Sovereign tabs, real-time usage tracking, and tier progress monitoring.
- **Capsules**: Truth submissions through specialized portals, including 14 types, with content validation and verification status. Includes a CapsuleDrawer component with a 3-step workflow (Create → Moderate → Mint) and AI-powered content analysis.
- **Verifications**: Community voting and professional-grade Veritas tools (Veritas Seal, Truth Bounty, Truth Redemption, Conspiracy Capsule).
- **Transactions**: GTT token transfers and reward tracking.
- **NFT System**: ERC-721 implementation for truth capsules with metadata storage, grief scoring, and an NFT evolution engine.
- **DAO Governance**: GTT-weighted voting system for proposals with a dedicated governance interface.
- **Financial Engine**: Tier management, real-time treasury monitoring, AI business intelligence, compliance oversight, and a donation platform.
- **Analytics**: Dynamic capsule analytics dashboard with yield tracking, emotional resonance scoring, embeddable widgets, and AI-powered insights.
- **AI Integration**: GPT-4o powered recommendation engine, AI-assisted onboarding, financial intelligence, emotional content classification, and hallucination guard for content verification. Includes comprehensive AI-powered content analysis with emotion detection and contextual summary generation.
- **PWA Capabilities**: Full Progressive Web App functionality with service worker, offline support, install button, and enhanced manifest.
- **Navigation**: Comprehensive navigation system including a centralized ROUTES schema with role-based filtering, professional sidebar, command palette, breadcrumb navigation, and mobile drawer.
- **Smart Contract Suite**: Production-ready ERC-721 implementation with yield mechanics and validation systems (CapsuleNFT and GTTYieldVault).

## External Dependencies

### Blockchain & Web3
- **Ethereum Integration**: ethers.js.
- **Multi-chain Support**: Ethereum mainnet, Polygon, and testnets.
- **Wallet Providers**: MetaMask.
- **Development**: Hardhat for smart contract development.
- **Web3 Integration**: Wagmi/Viem for wallet connection, contract interaction, and transaction monitoring.

### Third-party Services
- **Payment Processing**: Stripe.
- **Decentralized Storage**: IPFS.
- **Document Verification**: DocuSign (for Veritas Seal).
- **Database**: Neon (serverless PostgreSQL).
- **Asset Storage & Security**: Supabase.
- **AI Services**: OpenAI (GPT-4o), Anthropic (Claude).
- **Email/Notifications**: ProtonMail (SMTP), Resend.
- **Typography**: Google Fonts (Inter, Fira Code).
- **Icons**: Lucide React.
- **UI Primitives**: Radix UI.
- **Styling**: Tailwind CSS.
- **Communication**: Twilio (for messaging and calling).
- **Streaming**: Cloudflare (for live streaming).
- **IPFS Pinning**: Pinata.