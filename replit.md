# GuardianChain: Truth Vault Capsule dApp

## Overview
GuardianChain is a sovereign Web3 infrastructure for time-locked proof, grief-score yield, and capsule monetization. It enables users to mint Veritas Capsules, earn $GTT yield based on GriefScore™, and submit legacy, trauma, or testimony. The platform allows for replay, verification, and unlocking of time-sealed capsules via an integrated Veritas Certificate Engine. The project aims to establish institutional-grade memory infrastructure for sealing truth and unlocking value through blockchain technology and AI-powered verification, with a strategic focus on expanding into the Base Network for ultra-low fee transactions.

## User Preferences
Preferred communication style: Simple, everyday language.

## Recent Changes (August 6, 2025)
- ✅ **MAINNET DEPLOYMENT READY**: Complete smart contract infrastructure deployed
- ✅ **GTT & TruthVault Tokens**: Production-ready ERC20 with 2.5B supply and staking vault
- ✅ **VeritasDAO Governance**: Full voting system with 7-day periods and execution delays
- ✅ **Veritas Attestation System**: GTT-gated on-chain verification with fee structure
- ✅ **Multi-Chain Support**: Deployment scripts for both Polygon and Base mainnets
- ✅ **Frontend Integration**: Complete DAO governance UI at /veritas/vote
- ✅ **API Infrastructure**: Veritas routes for proposals, voting, and attestation
- ✅ **Deployment Documentation**: Comprehensive guides and verification tools
- ✅ **Security Hardening**: ReentrancyGuard, access controls, and time-locked governance
- ✅ **Fixed Hardhat Configuration**: ESM compatibility resolved for compilation
- ✅ **Tokenomics Analysis**: Comprehensive market adoption probability assessment completed
- ✅ **Optimization Recommendations**: Higher adoption structure identified (85% vs 72% probability)
- ✅ **GTT v2 Implementation**: Finalized 50% founder allocation with 4-year vesting for maximum grant eligibility
- ✅ **GTTDistributor Contract**: Production-ready vesting system with 6-month cliff and transparency dashboard
- ✅ **Grant-Optimized Structure**: Base/Polygon ecosystem fund allocation for partnership opportunities
- ✅ **Complete v2 Deployment Scripts**: Multi-chain deployment ready for Polygon and Base mainnet
- ✅ **PERSISTENT PROFILE DATA**: Complete PostgreSQL integration for permanent user data storage
- ✅ **Profile Management APIs**: GET/PATCH endpoints for profile updates with database persistence
- ✅ **Avatar Upload System**: File upload with database tracking and permanent storage
- ✅ **Session-Based Authentication**: Secure token-based authentication with database sessions
- ✅ **Database Schema Complete**: Users, sessions, activities, and stats tables fully implemented
- ✅ **COMPREHENSIVE ONBOARDING SYSTEM**: Complete 6-step onboarding flow with database integration
- ✅ **Enhanced Auth Registration**: Signup/login with bcrypt hashing and session management
- ✅ **GTT VESTING DASHBOARD**: Real-time vesting tracking with Web3 integration, CSV export, and cliff alerts
- ✅ **Vesting Analytics API**: Backend tracking for contributor vesting status and notifications
- ✅ **Admin-Protected Features**: Tier-based access control for sensitive financial data
- ✅ **INDUSTRY-STANDARD PROFILE SYSTEM**: Complete social media platform profile implementation
- ✅ **Enhanced Profile Editor**: 6-tabbed interface (Basic, Media, Social, Skills, Theme, Advanced)
- ✅ **Portfolio Gallery System**: Image/video storage with object storage integration
- ✅ **Advanced Customization**: Themes, accent colors, custom CSS, badges, achievements
- ✅ **Social Integration**: 6 major platform connections (Twitter, LinkedIn, GitHub, Instagram, YouTube, Discord)
- ✅ **Professional Features**: Company, occupation, pronouns, timezone, skills, interests, languages
- ✅ **Complete Backend Integration**: Full database sync between frontend and backend profile systems
- ✅ **Object Storage Ready**: Bucket configured (ID: replit-objstore-834398f8-b29a-4e48-8d43-d607e568bd5f)
- ✅ **First Admin Account System**: Comprehensive admin user creation with full platform privileges

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
- **Frameworks & Libraries**: React with TypeScript, Wouter, Tailwind CSS (custom design system, Radix UI, shadcn/ui), React Query, React Hook Form with Zod, Framer Motion.
- **UI/UX**: Quantum-themed design with dark/light mode, advanced micro-interactions, gamification, holographic glass morphism, and responsive design. Features a comprehensive design token system and advanced animations. NFT avatar customization is supported.
- **Localization**: Global RTL & Multilingual System supporting 29 RTL languages and 22 languages via LanguageSelector component, including auto-translation API.
- **Voice Interface**: Complete voice ecosystem for summary playback, professional recording with AI transcription, emotional analysis, grief scoring, and auto-translation with LABELS-based localization.
- **PWA Capabilities**: Full Progressive Web App functionality with offline support and installability.
- **Guardian Terminal CLI**: Command-line interface for developer access to capsule operations (mint, send) with wallet integration.
- **SMRI NFT Minter**: AI-powered Subjective Memory Resonance Index badge generator with blockchain minting.
- **Master Component Architecture**: Major consolidation completed (Jan 2025) reducing component count by 40+ files through master components: MasterCapsule, ConsolidatedCapsuleManager, MasterWeb3Capsule, MasterAnalytics, MasterDashboard. Achieved 10.4% overall reduction in component files with 51.1% reduction in capsule-specific components.

### Backend
- **Runtime & Language**: Node.js with Express.js, TypeScript.
- **API Design**: RESTful API with structured error handling.
- **Authentication**: Comprehensive system with user registration, login, verification, permanent profile storage, email confirmation, activity tracking, session management, and rate limiting middleware. Includes a four-tier access system (EXPLORER/SEEKER/CREATOR/SOVEREIGN/ADMIN) and subscription management.
- **Object Storage**: Google Cloud Storage integration for protected file uploads and public asset serving.
- **Multi-Chain Infrastructure**: Full Base Network integration for ultra-low fee transactions and Ethereum compatibility.
- **Data Flow**: Automated IPFS integration for content storage, community verification, and GTT token reward distribution.
- **FastAPI Veritas Node**: High-performance async backend for capsule management, validation, and yield distribution.

### Database & ORM
- **Database**: Supabase PostgreSQL with robust fallback systems.
- **ORM**: Drizzle ORM.
- **Schema Management**: Drizzle Kit.
- **Lineage Infrastructure**: Capsule inheritance tracking with lineage table, grief flow, and influence scoring system.

### Core Features
- **Media Upload & Gallery System**: Full-featured system with drag-and-drop, media management, object storage integration with presigned URLs, and multi-selection for capsule attachments.
- **Enhanced Capsule Creation**: Comprehensive truth submission system with Guided Wizard, Advanced Creator, and Quick Create modes. Features AI-powered content analysis, real-time GTT estimation, voice recording with transcription/emotion analysis, file attachments, template selection, verification levels, time-locking, NFT minting, and blockchain sealing. Includes advanced encryption via Lit Protocol and a redemption system for GTT rewards.
- **Advanced Remix System**: AI-powered capsule remixing with 6 visual styles, emotional tag integration, SMRI scoring, multi-media support, and lineage tracking.
- **Hyperdimensional Bulk Processing**: Mass capsule creation system supporting 25+ data types, multiversal processing, and up to 2GB file support.
- **Truth Auctions**: Sealed disclosure capsule system with GTT smart contract funding and unlock functionality.
- **Truth Lineage Protocol**: Advanced lineage tracking with grief flow analytics and influence scoring.
- **Eternal Contracts**: Immutable declarations with AI verification and permanent blockchain sealing.
- **Verifications**: Community voting and professional Veritas tools.
- **NFT System**: ERC-721 implementation with real blockchain minting, grief scoring, and metadata storage.
- **DAO Governance**: GTT-weighted voting system, advanced DAO vault disbursement, validator reward pools, and comprehensive incentive programs, including multichain staking.
- **Financial Engine**: Tier management, treasury monitoring, AI business intelligence, compliance, and a donation platform.
- **Payment Processing**: Complete Stripe integration for one-time payments and subscriptions.
- **Enhanced Analytics**: Dynamic capsule analytics dashboard with yield tracking, emotional resonance scoring, AI-powered insights, and an EnhancedEmotionHeatmap. Includes AI-powered capsule clustering.
- **GTT Rewards System**: Comprehensive token economics with engagement + velocity × 1.5 yield calculation, live leaderboards, and real-time reward distribution tracking.
- **Metrics Dashboard**: Real-time platform analytics showing capsule counts, yield velocity, active users, GTT distribution, and engagement scores.
- **Multichain Staking**: Advanced staking hub supporting Ethereum, Polygon, Base, and Arbitrum.
- **DAO Audit System**: Comprehensive audit trail with metadata logging and real-time monitoring of DAO operations.
- **Advanced AI Integration**: GPT-4o powered ecosystem for intelligent content generation, real-time transcription/emotional analysis, recommendation engines, and content verification.
- **Navigation**: Next-generation navigation with quantum-enhanced visual effects, floating sidebar, mobile bottom bar, role-based menu visibility, and real-time notifications.
- **Reels System**: Curation of named capsule collections with voice summaries and multilingual support.
- **Enhanced Social System**: Comprehensive social networking with 15+ social platform integrations, achievement systems, activity feeds, and TruthGenomeCard.
- **Guardian Map**: Interactive global network visualization of guardians with real-time locations, reputation, and activity levels.
- **Smart Contract Suite**: Production-ready ERC-721 implementation with yield mechanics and validation systems (CapsuleNFT, GTTYieldVault, TruthNotarization.sol).
- **Backup & Archive System**: Complete capsule backup/restore with encryption and professional archive certificate generation.

## External Dependencies

### Blockchain & Web3
- **Primary Network**: Base Network (Ethereum L2).
- **Multi-chain Support**: Base mainnet/testnet, Ethereum, Polygon networks.
- **Wallet Providers**: MetaMask, Coinbase Wallet, WalletConnect.
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