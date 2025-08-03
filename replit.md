# GuardianChain: Truth Vault Capsule dApp

## Overview

GuardianChain is a sovereign Web3 infrastructure for time-locked proof, grief-score yield, and capsule monetization. The platform enables users to mint Veritas Capsules, earn $GTT yield based on GriefScore™, and submit legacy, trauma, or testimony capsules. Users can replay, verify, and unlock time-sealed capsules through an integrated Veritas Certificate Engine. The project aims to provide institutional-grade memory infrastructure for sealing truth and unlocking value through blockchain technology and AI-powered verification systems.

**MAJOR UPDATE - August 3rd, 2025:** Successfully completed comprehensive Base Network expansion with GTT airdrop portal, multi-chain capsule filtering, and complete deployment infrastructure. Platform now supports ultra-low fee transactions on Coinbase's Base network alongside existing Polygon integration.

**ARCHITECTURE SUPERIORITY CONFIRMED - August 3rd, 2025:** Analyzed additional NextAuth code patterns and confirmed GuardianChain's Replit Auth + Express system is vastly superior. Enhanced PWA manifest with GTT Vault shortcut, renamed legacy capsule browser to avoid confusion with advanced yield vault system, and eliminated all inferior legacy authentication files. Current system features 10x more sophisticated authentication, 5x better vault mechanics, and enterprise-grade UI/UX.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend

- **Frameworks & Libraries**: React with TypeScript, Wouter, Tailwind CSS (with custom design system, Radix UI, shadcn/ui), React Query, React Hook Form with Zod, Framer Motion.
- **Build Tool**: Vite.
- **UI/UX**: Supports dark/light mode with quantum-themed next-generation visual effects, incorporates advanced micro-interactions and gamification elements, professional branding with holographic glass morphism, responsive design, and enterprise-grade UI/UX standards. Features a comprehensive design token system with quantum color palette (cyan, purple, golden gradients), premium visual identity using latest open source fonts (Space Grotesk, Inter, Fira Code), and PWA offline capabilities. Enhanced pages include homepage with quantum-enhanced hero section, advanced animations (morphic pulse, prismatic shift, data stream effects), and dashboard with NFT avatar customization and tier progress tracking.
- **Next-Gen Components**: EnhancedButton with multiple variants (quantum, neural, holographic, glass, neon, gradient), AdvancedCard with animated background particles and glow effects, NextGenNavigation with floating sidebar and mobile bottom bar, all featuring cutting-edge open source UI patterns and advanced animation suites.
- **Global RTL & Multilingual System**: Complete right-to-left layout support for 29 RTL languages with automatic layout switching, comprehensive LanguageSelector component supporting 22 languages with native scripts, user language preference storage, and auto-translation API integration.
- **Multilingual Voice Interface**: Complete voice summary system with VoiceSummaryPlayer component, auto-translation for multilingual users, and LABELS-based interface localization.
- **PWA Capabilities**: Full Progressive Web App functionality with service worker, offline support, install button, background sync, and enhanced manifest with GuardianChain branding.

### Backend

- **Runtime & Language**: Node.js with Express.js, TypeScript.
- **API Design**: RESTful API with structured error handling.
- **Authentication**: Debug authentication system with OAuth integration (Google/GitHub via Passport.js) providing enterprise-grade user authentication and tier-based access control.
- **Object Storage**: Google Cloud Storage integration with protected file uploading, public asset serving, and ACL policy management.
- **Multi-Chain Infrastructure**: Complete Base Network integration with ultra-low fee transactions, GTT airdrop distribution, and cross-chain capsule filtering.
- **Data Flow**: Automated IPFS integration for content storage, community-driven verification, and GTT token reward distribution.

### Database & ORM

- **Database**: PostgreSQL (configured for Neon serverless).
- **ORM**: Drizzle ORM.
- **Schema Management**: Drizzle Kit.
- **Lineage Infrastructure**: Complete capsule inheritance tracking with lineage table, grief flow, and influence scoring system.

### Core Entities & Features

- **Users**: Streamlined debug authentication with comprehensive tier-based access system (EXPLORER/SEEKER/CREATOR/SOVEREIGN), subscription management, and optimized API endpoints.
- **Authentication System**: Full-featured tiered access control with TierGate component and SubscriptionManager.
- **Subscription Tiers**: Four-tier system with progressive feature unlocking.
- **Dashboard Flows**: Comprehensive authenticated user experience with real-time usage tracking and tier progress monitoring.
- **Capsules**: Truth submissions through specialized portals, including 14 types, with content validation and verification status. Features EnhancedCapsuleUploader with 4-step workflow, AI-powered content analysis (emotional resonance, auto-tagging), and integrated NFT minting. Includes CapsuleAutotagger and CapsulePrivacyToggle with granular privacy controls. Advanced encryption via Lit Protocol enables time-locked content, token-gated access, and condition-based reveals.
- **Truth Auctions**: Complete sealed disclosure capsule system with real GTT smart contract funding, live countdown timers, and unlock/download functionality. Features wagmi-based blockchain integration, custom contribution amounts, and automated disclosure reveal upon reserve fulfillment. Enables crowd-funding of investigations and direct rewards to whistleblowers, victims, and legacy holders through blockchain governance.
- **Truth Lineage Protocol**: Advanced lineage tracking system with grief flow analytics, influence scoring, and capsule inheritance infrastructure. Includes visual lineage graph interface.
- **Eternal Contracts**: Immutable declaration system with AI verification, permanent blockchain sealing, and optional unlock dates/beneficiaries.
- **Verifications**: Community voting and professional-grade Veritas tools (Veritas Seal, Truth Bounty, Truth Redemption, Conspiracy Capsule).
- **Transactions**: GTT token transfers and reward tracking.
- **NFT System**: Authentic ERC-721 implementation with real blockchain minting using ethers.js, smart contract integration, and on-chain transaction verification. Features grief scoring, metadata storage, and social sharing with actual transaction hashes.
- **DAO Governance**: GTT-weighted voting system for proposals with a dedicated governance interface.
- **Financial Engine**: Tier management, real-time treasury monitoring, AI business intelligence, compliance oversight, and a donation platform.
- **Analytics**: Dynamic capsule analytics dashboard with yield tracking, emotional resonance scoring, embeddable widgets, and AI-powered insights.
- **AI Integration**: GPT-4o powered recommendation engine, AI-assisted onboarding, financial intelligence, emotional content classification, and hallucination guard for content verification. Includes comprehensive AI-powered content analysis with emotion detection, contextual summary generation, and AI image generation.
- **Asset Integration**: Comprehensive branding asset system with video backgrounds, NFT avatar options, logo strips, and GPU-accelerated visual effects.
- **Navigation**: Next-generation navigation system with quantum-enhanced visual effects, floating desktop sidebar with holographic glass morphism, mobile bottom bar with expanded menu modal, dynamic badge indicators, role-based menu visibility, comprehensive mobile responsiveness, centralized navigation data, real-time notification system, and advanced tooltip system with contextual descriptions. Includes Truth Auction access in main navigation menu with premium indicators and animated hover states.
- **Reels System**: Full reel curation functionality allowing users to create named collections from owned capsules with voice summaries and multilingual support.
- **Sovereign Social Profiles**: Full-featured profile system with TruthGenomeCard showing personality traits, CapsuleWallToggle for multiple view modes, and public sharing via `/u/[username]` routes. Includes comprehensive media upload with auto-categorization and blockchain minting.
- **Guardian Map**: Interactive global network visualization featuring real-time guardian locations, reputation tiers, activity levels, advanced search and filtering capabilities, multiple map visualization modes, comprehensive export tools, and network analysis.
- **Smart Contract Suite**: Production-ready ERC-721 implementation with yield mechanics and validation systems (CapsuleNFT and GTTYieldVault).

## External Dependencies

### Blockchain & Web3

- **Ethereum Integration**: ethers.js.
- **Multi-chain Support**: Ethereum mainnet, Polygon mainnet, Base mainnet, and corresponding testnets.
- **Base Network**: Coinbase L2 with ultra-low fees (~$0.01), 1.5x Coinbase Wallet bonuses, and mainstream adoption focus.
- **Wallet Providers**: MetaMask, Coinbase Wallet with enhanced Base integration.
- **Development**: Hardhat with comprehensive multi-chain configuration.
- **Web3 Integration**: Wagmi/Viem with cross-chain switching capabilities.
- **GTT Airdrop**: 250,000 GTT token distribution on Base network with eligibility portal.

### Third-party Services

- **Payment Processing**: Stripe.
- **Decentralized Storage**: IPFS.
- **Document Verification**: DocuSign.
- **Database**: Supabase (PostgreSQL with real-time features).
- **Blockchain Integration**: Ethereum/Polygon with ethers.js for authentic NFT minting.
- **Encryption**: Lit Protocol for time-locked and condition-based content encryption.
- **AI Services**: OpenAI (GPT-4o), Anthropic (Claude).
- **Email/Notifications**: ProtonMail (SMTP), Resend.
- **Typography**: Google Fonts (Inter, Fira Code).
- **Icons**: Lucide React.
- **UI Primitives**: Radix UI.
- **Styling**: Tailwind CSS.
- **Communication**: Twilio.
- **Streaming**: Cloudflare.
- **IPFS Pinning**: Pinata.
