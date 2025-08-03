# GuardianChain: Truth Vault Capsule dApp

## Overview

GuardianChain is a sovereign Web3 infrastructure for time-locked proof, grief-score yield, and capsule monetization. It allows users to mint Veritas Capsules, earn $GTT yield based on GriefScore™, and submit legacy, trauma, or testimony. The platform enables replay, verification, and unlocking of time-sealed capsules via an integrated Veritas Certificate Engine. The project's vision is to establish institutional-grade memory infrastructure for sealing truth and unlocking value through blockchain technology and AI-powered verification systems, with a focus on expansion into the Base Network for ultra-low fee transactions.

## User Preferences

Preferred communication style: Simple, everyday language.

**Design Philosophy**: Strong preference for clean, minimal Next.js template structure approach:
- Clean layout with Head component structure
- max-w-4xl container with proper spacing
- Yellow-400 titles, purple-300 headings, blue-400 links
- White/5 background cards with border styling
- Professional presentation for investor materials
- Minimal, focused design without unnecessary complexity

## System Architecture

### Frontend

- **Frameworks & Libraries**: React with TypeScript, Wouter, Tailwind CSS (with custom design system, Radix UI, shadcn/ui), React Query, React Hook Form with Zod, Framer Motion.
- **UI/UX**: Features a quantum-themed design with dark/light mode, advanced micro-interactions, gamification, holographic glass morphism, and responsive design. Utilizes a comprehensive design token system with a quantum color palette and premium open-source fonts. Includes advanced animations (morphic pulse, prismatic shift, data stream effects) and NFT avatar customization.
- **Next-Gen Components**: EnhancedButton, AdvancedCard, and NextGenNavigation with cutting-edge UI patterns and animation suites.
- **Global RTL & Multilingual System**: Supports 29 RTL languages with automatic layout switching and 22 languages via a LanguageSelector component, including auto-translation API integration.
- **Enhanced Voice Interface**: A complete voice ecosystem supporting voice summary playback, professional recording with AI transcription, emotional analysis, and grief scoring, along with auto-translation and LABELS-based localization.
- **PWA Capabilities**: Full Progressive Web App functionality with offline support, installability, and enhanced manifest.

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
- **Capsules**: Truth submissions via specialized portals (14 types) with content validation, AI-powered analysis (emotional resonance, auto-tagging), and integrated NFT minting. Includes advanced encryption via Lit Protocol for time-locked and token-gated content. Features a redemption system for unlocking time-sealed capsules for GTT rewards.
- **Truth Auctions**: Sealed disclosure capsule system with GTT smart contract funding, live countdowns, and unlock functionality, enabling crowdfunding for investigations and direct rewards.
- **Truth Lineage Protocol**: Advanced lineage tracking with grief flow analytics and influence scoring.
- **Eternal Contracts**: Immutable declarations with AI verification and permanent blockchain sealing.
- **Verifications**: Community voting and professional Veritas tools (Veritas Seal, Truth Bounty).
- **NFT System**: ERC-721 implementation with real blockchain minting, grief scoring, and metadata storage.
- **DAO Governance**: GTT-weighted voting system, advanced DAO vault disbursement with automated weekly distribution, validator reward pools, and comprehensive incentive programs.
- **Financial Engine**: Tier management, treasury monitoring, AI business intelligence, compliance, and a donation platform, with sophisticated validator rewards tracking.
- **Enhanced Analytics**: Dynamic capsule analytics dashboard with yield tracking, emotional resonance scoring, AI-powered insights, and an EnhancedEmotionHeatmap for community emotion visualization.
- **Advanced AI Integration**: GPT-4o powered ecosystem for intelligent content generation (EnhancedCapsuleAIComposer), real-time transcription and emotional analysis (EnhancedVoiceCapsuleRecorder), recommendation engines, and content verification.
- **Navigation**: Next-generation navigation with quantum-enhanced visual effects, floating sidebar, mobile bottom bar, role-based menu visibility, and real-time notifications.
- **Reels System**: Curation of named capsule collections with voice summaries and multilingual support.
- **Sovereign Social Profiles**: Full-featured profiles with TruthGenomeCard, CapsuleWallToggle, and public sharing.
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
- **Decentralized Storage**: IPFS, Pinata (for IPFS pinning).
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

## Enhancement History

**FINAL ENHANCEMENT BUNDLE COMPLETION - August 3rd, 2025:** Completed integration of final enhancement bundles including advanced capsule license verification system with commercial/exclusive/creative commons licensing, sophisticated payout queue management with automated processing and multisig approval requirements, enhanced VaultDashboard component with comprehensive statistics and health monitoring, enterprise-grade multisig security gates with transaction validation and multi-signature authorization, and cryptographic redemption signature verification system with challenge-response authentication. Added /explorer/verifiers route with license verification interface, payout queue statistics, and verifier analytics. Enhanced server API with 20+ additional endpoints for license management, payout processing, multisig operations, and signature verification.

**PARTNERS PAGE INTEGRATION - August 3rd, 2025:** Successfully implemented comprehensive Partners & Grants page (/partners) with professional design, PDF revenue explainer access, contact information for investors and grant organizations, and full navigation integration. Added Partners link to EliteNavbar with "Revenue" badge, homepage promotional button, and mobile navigation support. Revenue explainer PDFs now accessible at /GuardianChain_Revenue_Explainer_Deck.pdf and /GuardianChain_Revenue_Share_Summary.pdf for investor outreach and partnership development. Enhanced with GTT token overview, partnership areas, and interactive elements while maintaining clean Next.js-style design approach.

**PLATFORM SYNCHRONIZATION ENHANCEMENT - August 3rd, 2025:** Completed comprehensive platform synchronization ensuring all enhancement features work seamlessly together. Updated Partners page to match exact Next.js template structure while maintaining React Helmet integration. All advanced systems including license verification, payout queues, multisig security gates, and signature verification systems are fully integrated and operational. Navigation remains consistent across all platform components with professional presentation for investors and partners.

**MULTICHAIN STAKING & AUDIT INTEGRATION - August 3rd, 2025:** Enhanced DAO governance system with comprehensive multichain staking capabilities and transparent audit logging. Added MultichainStaking component with cross-chain GTT staking interface supporting Ethereum, Polygon, Base, and Arbitrum networks. Implemented AuditLogs component with real-time blockchain transaction monitoring, event filtering, and security audit trails. Expanded DAO page to 10 comprehensive tabs including new Staking and Audit sections. Added 30+ API endpoints for multichain performance tracking, staking statistics, validator rewards, and audit log management. All components maintain professional Next.js template design with live data integration and enhanced security monitoring.