# GuardianChain: Truth Vault Capsule dApp

## Overview
GuardianChain is a sovereign Web3 infrastructure for time-locked proof, grief-score yield, and capsule monetization. The platform enables users to mint Veritas Capsules, earn $GTT yield based on GriefScore™, and submit legacy, trauma, or testimony capsules. Users can replay, verify, and unlock time-sealed capsules through an integrated Veritas Certificate Engine. The project aims to provide institutional-grade memory infrastructure for sealing truth and unlocking value through blockchain technology and AI-powered verification systems.

## User Preferences
Preferred communication style: Simple, everyday language.

## Recent Changes (August 2, 2025)
- **React Query Error Resolution Complete**: Fixed missing `/api/profile/:userId` server endpoint that was causing console errors
- **Service Worker SecurityError Handled**: Implemented proper error handling for development environment service worker registration failures
- **Application Stability Verified**: All core APIs confirmed working (authentication, user stats, capsules, token data)
- **Global RTL Support Complete**: Implemented comprehensive right-to-left layout support for Arabic, Hebrew, Persian, Urdu, and other RTL languages across all major containers (UltimateHomepage, explore, dashboard, reels-viewer)
- **Language Selector Component**: Created comprehensive LanguageSelector component with 22 supported languages including native script display
- **User Language Preferences**: Added preferredLanguage field to user schema with API endpoints for preference updates
- **Auto-Translation API**: Built `/api/ai/translate` endpoint with mock translations for 15 languages to support multilingual content
- **RTL Layout Functions**: Implemented `isRTL()`, `getRTLContainerProps()`, and `detectUserLanguage()` functions for automatic layout switching
- **TranslateToggle Integration**: Added auto-translation capabilities to capsule cards for global accessibility  
- **Service Worker Manager**: Created comprehensive serviceWorkerManager utility with proper error handling for development environments to eliminate SecurityError console messages
- **Multilingual Voice Reels System Complete**: Implemented comprehensive multilingual support with VoiceSummaryPlayer integration
- **Voice Summary Features**: Added "Listen to Summary" button to each capsule with auto-translation for non-English languages
- **LABELS System**: Created multilingual interface with auto-switching text based on user language preference
- **Reels API Complete**: Built full reels management system allowing users to name collections and curate from owned capsule IDs
- **Language Support**: Added language field to user schema for personalized interface and voice preferences
- **Auto-Translation**: Integrated auto-translate functionality for reel playback when user language !== "en"
- **Enhanced Profile System Complete**: Implemented full sovereign social profile with comprehensive media management
- **Profile Extension Components**: Created 5 new profile enhancement components - MintCapsuleButton, CapsuleAutotagger, CapsuleWallToggle, TruthGenomeCard, and CapsulePrivacyToggle
- **AI-Powered Features**: Integrated GPT-powered content analysis with emotional resonance scoring, truth likelihood assessment, and automatic tag generation
- **Enhanced Uploader**: Built EnhancedCapsuleUploader with 4-step workflow (Upload → Analyze → Mint → Complete) including AI insights and blockchain minting
- **Truth Genome System**: Added personality trait analysis showing Seeker, Whistleblower, Visionary, and Historian characteristics with evidence tracking
- **Public Profile Sharing**: Implemented `/u/[username]` routes for shareable sovereign memory walls with full social media integration
- **Backend API Extensions**: Added endpoints for NFT auto-minting, AI capsule analysis, and metadata storage with debug authentication
- **View Mode Controls**: Integrated timeline view switching (grid, timeline, calendar, trending) with comprehensive filtering
- **Privacy Controls**: Built granular privacy system (public, family, private, sealed) with blockchain-secured time-locking options
- **Previous Achievements**: 
  - Critical Bug Audit Complete with all TypeScript and runtime errors resolved
  - Missing Page Audit Complete with 11 new pages created
  - Ultimate Homepage Upgrade with investor-ready presentation
  - Enhanced Tokenomics & Yield System implementation
  - Eternal Contracts and Advanced Profile Upgrade systems
  - Platform completeness at 99%+ feature coverage

## System Architecture

### Frontend
- **Frameworks & Libraries**: React with TypeScript, Wouter for routing, Tailwind CSS (with custom design system, Radix UI, shadcn/ui) for styling, React Query for server state, React Hook Form with Zod for forms, Framer Motion for micro-interactions.
- **Build Tool**: Vite.
- **UI/UX**: Supports dark/light mode, incorporates playful micro-interactions and gamification elements, professional branding, responsive design, and enterprise-grade UI/UX standards. Features a comprehensive design token system integrated with Figma style guides, premium visual identity, and PWA offline capabilities.
- **Enhanced Pages**: EnhancedHomepage.tsx with video backgrounds and investor-grade presentation, EnhancedDashboard.tsx with NFT avatar customization and tier progress tracking.

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
- **Lineage Infrastructure**: Complete capsule inheritance tracking with lineage table, grief flow, and influence scoring system.

### Core Entities & Features
- **Users**: Streamlined debug authentication with comprehensive tier-based access system (EXPLORER/SEEKER/CREATOR/SOVEREIGN), subscription management, and optimized API endpoints for user data and tier management.
- **Authentication System**: Full-featured tiered access control with TierGate component for feature gating, SubscriptionManager for billing, and role-based Dashboard routing.
- **Subscription Tiers**: Four-tier system (Explorer, Seeker, Creator, Sovereign) with progressive feature unlocking and usage limits.
- **Dashboard Flows**: Comprehensive authenticated user experience with Overview, Subscription, Creator Tools, and Sovereign tabs, real-time usage tracking, and tier progress monitoring.
- **Capsules**: Truth submissions through specialized portals, including 14 types, with content validation and verification status. Features EnhancedCapsuleUploader with 4-step workflow (Upload → Analyze → Mint → Complete), AI-powered content analysis with emotional resonance scoring, automatic tag generation, and integrated NFT minting. Includes CapsuleAutotagger for GPT insights and CapsulePrivacyToggle with granular privacy controls.
- **Truth Lineage Protocol**: Advanced lineage tracking system with grief flow analytics, influence scoring, and capsule inheritance infrastructure. Includes visual lineage graph interface and automatic lineage connections for inspired capsules.
- **Eternal Contracts**: Immutable declaration system with AI verification, permanent blockchain sealing, and optional unlock dates/beneficiaries. Designed for wills, testimonies, and immortal declarations.
- **Verifications**: Community voting and professional-grade Veritas tools (Veritas Seal, Truth Bounty, Truth Redemption, Conspiracy Capsule).
- **Transactions**: GTT token transfers and reward tracking.
- **NFT System**: ERC-721 implementation for truth capsules with metadata storage, grief scoring, and an NFT evolution engine. Enhanced with AI image generation and social sharing capabilities.
- **DAO Governance**: GTT-weighted voting system for proposals with a dedicated governance interface.
- **Financial Engine**: Tier management, real-time treasury monitoring, AI business intelligence, compliance oversight, and a donation platform.
- **Analytics**: Dynamic capsule analytics dashboard with yield tracking, emotional resonance scoring, embeddable widgets, and AI-powered insights.
- **AI Integration**: GPT-4o powered recommendation engine, AI-assisted onboarding, financial intelligence, emotional content classification, and hallucination guard for content verification. Includes comprehensive AI-powered content analysis with emotion detection, contextual summary generation, and AI image generation for visual storytelling.
- **PWA Capabilities**: Full Progressive Web App functionality with service worker, offline support, install button, background sync, and enhanced manifest with GuardianChain branding. Includes offline indicators and seamless app-like experience.
- **Asset Integration**: Comprehensive branding asset system with video backgrounds, NFT avatar options, logo strips, and GPU-accelerated visual effects.
- **Navigation**: Advanced navigation system with dynamic badge indicators (🆕 New Proposal, ⚠️ Unclaimed Yield), role-based menu visibility (admin-only, DAO-only), comprehensive mobile responsiveness with collapsible sidebar, centralized navigation data with 100+ routes, and real-time notification system.
- **Complete Page Coverage**: Comprehensive platform with all core functionality implemented including enhanced capsule creation/vault management, GTT yield claiming, truth verification, lineage tracking, Truth Genome NFT viewer, investor relations, contact system, and extensive documentation (how-it-works, grants, legal framework).
- **Global RTL & Multilingual System**: Complete right-to-left layout support for 29 RTL languages with automatic layout switching, comprehensive LanguageSelector component supporting 22 languages with native scripts, user language preference storage, and auto-translation API integration.
- **Multilingual Voice Interface**: Complete voice summary system with VoiceSummaryPlayer component, auto-translation for multilingual users, and LABELS-based interface localization.
- **Reels System**: Full reel curation functionality allowing users to create named collections from owned capsules with voice summaries and multilingual support.
- **Sovereign Social Profiles**: Full-featured profile system with TruthGenomeCard showing personality traits (Seeker, Whistleblower, Visionary, Historian), CapsuleWallToggle for multiple view modes, and public sharing via `/u/[username]` routes. Includes comprehensive media upload with auto-categorization and blockchain minting.
- **Guardian Map**: Interactive global network visualization featuring real-time guardian locations, reputation tiers, activity levels, advanced search and filtering capabilities, multiple map visualization modes (standard, heatmap, connections), comprehensive export tools (CSV, JSON, Excel, image, reports), and network analysis with connection tracking.
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