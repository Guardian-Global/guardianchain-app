# GuardianChain: Truth Vault Capsule dApp

## Overview
GuardianChain is a sovereign Web3 infrastructure for time-locked proof, grief-score yield, and capsule monetization. It enables users to mint Veritas Capsules, earn $GTT yield based on GriefScore™, and submit legacy, trauma, or testimony. The platform allows for replay, verification, and unlocking of time-sealed capsules via an integrated Veritas Certificate Engine. The project aims to establish institutional-grade memory infrastructure for sealing truth and unlocking value through blockchain technology and AI-powered verification, with a strategic focus on expanding into the Base Network for ultra-low fee transactions.

## User Preferences
Preferred communication style: Simple, everyday language.

**Design Philosophy**: Strong preference for clean, minimal Next.js template structure approach:
- Clean layout with Head component structure
- max-w-4xl container with proper spacing
- **CRITICAL: ALL white colors must be replaced with cyberpunk color scheme**
- Cyberpunk cyan (#00ffe1), magenta (#ff00d4), and purple (#7c3aed) color palette
- High-contrast text visibility with hsl(180, 100%, 90%) for maximum readability
- Dark cyberpunk backgrounds with hsl(218, 54%, 9%) surface colors
- Professional presentation for investor materials
- Minimal, focused design without unnecessary complexity
- **COMPLETED: Comprehensive CSS override system implemented for all white color replacements**

## System Architecture

### Frontend
- **Frameworks & Libraries**: React with TypeScript, Wouter, Tailwind CSS (with custom design system, Radix UI, shadcn/ui), React Query, React Hook Form with Zod, Framer Motion.
- **UI/UX**: Quantum-themed design with dark/light mode, advanced micro-interactions, gamification, holographic glass morphism, and responsive design. Features a comprehensive design token system, advanced animations (morphic pulse, prismatic shift, data stream effects), and NFT avatar customization.
- **Global RTL & Multilingual System**: Supports 29 RTL languages with auto-layout switching and 22 languages via LanguageSelector component, including auto-translation API.
- **Enhanced Voice Interface**: A complete voice ecosystem supporting summary playback, professional recording with AI transcription, emotional analysis, and grief scoring, along with auto-translation and LABELS-based localization.
- **PWA Capabilities**: Full Progressive Web App functionality with offline support and installability.

### Backend
- **Runtime & Language**: Node.js with Express.js, TypeScript.
- **API Design**: RESTful API with structured error handling.
- **Authentication**: Debug authentication system with OAuth integration (Google/GitHub via Passport.js) for enterprise-grade user authentication and tier-based access control.
- **Object Storage**: Google Cloud Storage integration for protected file uploading and public asset serving.
- **Multi-Chain Infrastructure**: Integration with Base Network for ultra-low fee transactions and cross-chain capsule filtering.
- **Data Flow**: Automated IPFS integration for content storage, community verification, and GTT token reward distribution.

### Database & ORM
- **Database**: PostgreSQL (configured for Neon serverless).
- **ORM**: Drizzle ORM.
- **Schema Management**: Drizzle Kit.
- **Lineage Infrastructure**: Capsule inheritance tracking with lineage table, grief flow, and influence scoring system.

### Core Entities & Features
- **Users & Authentication**: Streamlined authentication with a four-tier access system (EXPLORER/SEEKER/CREATOR/SOVEREIGN) and subscription management.
- **Capsules**: Truth submissions via specialized portals (14 types) with content validation, AI-powered analysis (emotional resonance, auto-tagging), and integrated NFT minting. Includes advanced encryption via Lit Protocol for time-locked and token-gated content, and a redemption system for unlocking time-sealed capsules for GTT rewards.
- **Truth Auctions**: Sealed disclosure capsule system with GTT smart contract funding, live countdowns, and unlock functionality.
- **Truth Lineage Protocol**: Advanced lineage tracking with grief flow analytics and influence scoring.
- **Eternal Contracts**: Immutable declarations with AI verification and permanent blockchain sealing.
- **Verifications**: Community voting and professional Veritas tools (Veritas Seal, Truth Bounty).
- **NFT System**: ERC-721 implementation with real blockchain minting, grief scoring, and metadata storage.
- **DAO Governance**: GTT-weighted voting system, advanced DAO vault disbursement with automated weekly distribution, validator reward pools, and comprehensive incentive programs, including multichain staking.
- **Financial Engine**: Tier management, treasury monitoring, AI business intelligence, compliance, and a donation platform, with sophisticated validator rewards tracking.
- **Enhanced Analytics**: Dynamic capsule analytics dashboard with yield tracking, emotional resonance scoring, AI-powered insights, and an EnhancedEmotionHeatmap for community emotion visualization. Includes AI-powered capsule clustering.
- **GTT Rewards System**: Comprehensive token economics with engagement + velocity × 1.5 yield calculation, live leaderboards showing theme performance rankings, real-time reward distribution tracking across emotional clusters, and sovereign metrics dashboard for platform analytics.
- **Metrics Dashboard**: Real-time platform analytics showing capsule counts, yield velocity, active users, GTT distribution, engagement scores, and platform health monitoring with 99.8% uptime tracking.
- **Real-time Updates**: Live data synchronization system for rewards leaderboard and analytics with connection status indicators and manual refresh capabilities.
- **Multichain Staking**: Advanced staking hub supporting Ethereum, Polygon, Base, and Arbitrum networks with cross-chain attestation synchronization and performance tracking.
- **DAO Audit System**: Comprehensive audit trail with metadata logging, severity classification, and real-time monitoring of all DAO operations and multisig transactions.
- **Advanced AI Integration**: GPT-4o powered ecosystem for intelligent content generation (EnhancedCapsuleAIComposer), real-time transcription and emotional analysis (EnhancedVoiceCapsuleRecorder), recommendation engines, and content verification.
- **Navigation**: Next-generation navigation with quantum-enhanced visual effects, floating sidebar, mobile bottom bar, role-based menu visibility, and real-time notifications.
- **Reels System**: Curation of named capsule collections with voice summaries and multilingual support.
- **Sovereign Social Profiles**: Full-featured profiles with TruthGenomeCard, CapsuleWallToggle, public sharing, and AI-powered memory recall.
- **Guardian Map**: Interactive global network visualization of guardians with real-time locations, reputation, and activity levels.
- **Smart Contract Suite**: Production-ready ERC-721 implementation with yield mechanics and validation systems (CapsuleNFT, GTTYieldVault, TruthNotarization.sol).
- **Backup & Archive System**: Complete capsule backup/restore with encryption and professional archive certificate generation (PDF/PNG/SVG).
- **Enterprise CLI Tools**: Advanced validator tools for reward tracking, leaderboard generation, and data export.

## External Dependencies

### Blockchain & Web3
- **Ethereum Integration**: ethers.js.
- **Multi-chain Support**: Ethereum mainnet, Polygon mainnet, Base mainnet, and corresponding testnets.
- **Wallet Providers**: MetaMask, Coinbase Wallet.
- **Development**: Hardhat.
- **Web3 Integration**: Wagmi/Viem.

### Third-party Services
- **Payment Processing**: Stripe.
- **Decentralized Storage**: IPFS, Pinata.
- **Document Verification**: DocuSign.
- **Database**: Supabase.
- **Encryption**: Lit Protocol.
- **AI Services**: OpenAI (GPT-4o), Anthropic (Claude).
- **Email/Notifications**: Resend.
- **Typography**: Google Fonts.
- **Icons**: Lucide React.
- **UI Primitives**: Radix UI.
- **Styling**: Tailwind CSS.
- **Communication**: Twilio.
- **Streaming**: Cloudflare.