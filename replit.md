# Veritas - Web3 Truth Verification Platform

## Overview
Veritas (formerly GUARDIANCHAIN) is a Web3 truth verification platform designed to establish an immutable ecosystem for verifying information. It allows users to create "truth capsules," verify them through community governance, and earn GTT token rewards. The platform integrates blockchain technology with traditional web development to offer specialized tools for professional truth authentication, crowdsourced investigations, public accountability, and secure whistleblowing. Its business vision includes leveraging AI and DeFi for market impact, aiming for substantial annual revenue through transaction fees and enterprise API subscriptions. The project seeks to become critical infrastructure for preserving reality against AI alteration.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Frameworks & Libraries**: React with TypeScript, Wouter for routing, Tailwind CSS (with custom design system, Radix UI, shadcn/ui) for styling, React Query for server state, React Hook Form with Zod for forms, Framer Motion for micro-interactions.
- **Build Tool**: Vite.
- **UI/UX**: Supports dark/light mode, incorporates playful micro-interactions and gamification elements, professional branding, responsive design, and enterprise-grade UI/UX standards.

### Backend
- **Runtime & Language**: Node.js with Express.js, TypeScript.
- **API Design**: RESTful API with structured error handling.
- **Middleware**: Custom logging, JSON parsing, and error handling.
- **Authentication**: Fully integrated Replit Auth with OpenID Connect, database session storage, object storage ACL controls, and tier-based access management.
- **Object Storage**: Google Cloud Storage integration with protected file uploading, public asset serving, and ACL policy management.
- **Data Flow**: Automated IPFS integration for content storage, community-driven verification, and GTT token reward distribution.

### Database & ORM
- **Database**: PostgreSQL (configured for Neon serverless).
- **ORM**: Drizzle ORM.
- **Schema Management**: Drizzle Kit.
- **Connection**: Neon serverless database adapter.

### Core Entities & Features
- **Users**: Complete Replit Auth integration with OpenID Connect, database user management, session storage, and tier-based access (EXPLORER/SEEKER/CREATOR/SOVEREIGN).
- **Capsules**: Truth submissions through specialized portals, including 14 types, with content validation and verification status.
- **Verifications**: Community voting and professional-grade Veritas tools (Veritas Seal, Truth Bounty, Truth Redemption, Conspiracy Capsule).
- **Transactions**: GTT token transfers and reward tracking.
- **Achievements**: Gamification for user engagement.
- **Veritas Tools**: Professional suite for legal verification, crowdsourced investigations, public accountability, and secure whistleblowing.
- **NFT System**: ERC-721 implementation for truth capsules with soulbound tokens, grief scoring, metadata storage, and an NFT evolution engine.
- **DAO Governance**: GTT-weighted voting system for proposals with a dedicated governance interface.
- **Financial Engine**: Tier management, real-time treasury monitoring, AI business intelligence, compliance oversight, and a donation platform.
- **Analytics**: Dynamic capsule analytics dashboard with yield tracking, emotional resonance scoring, embeddable widgets, and AI-powered insights.
- **AI Integration**: GPT-4o powered recommendation engine, AI-assisted onboarding, financial intelligence, emotional content classification, and hallucination guard for content verification.
- **Micro-Interactions**: Integrated playful micro-interactions and an onboarding mascot.
- **Legal Compliance**: Comprehensive Terms of Service, Privacy Policy, and Security Policy pages for Web3, blockchain transactions, and data protection.
- **Communication & Streaming**: User-to-user messaging, voice/video calling, and live capsule streaming platform.
- **Validator Tools**: Professional validator dashboard, real-time node monitoring, capsule queue management, and performance analytics.
- **Enterprise Analytics**: Queue performance metrics, emotional content classification, therapeutic value scoring, and batch processing capabilities.
- **Live Broadcasting**: Real-time node uplink system with network health monitoring and live activity feeds.
- **Public Ledger Tools**: Comprehensive data export capabilities with compliance reporting and transparency features.
- **Press Kit Generation**: Professional PDF documentation suite for media, investors, and technical audiences.
- **Smart Contract Suite**: Production-ready ERC-721 implementation with yield mechanics and validation systems.
- **Capsule Creation System**: Complete truth capsule authoring with grief scoring, yield calculation, and blockchain integration.
- **Standardized Data Schema**: Comprehensive capsule data structures with IPFS metadata, validation tracking, and yield mechanics.
- **Launch Announcement**: Professional launch page with press kit integration and founder messaging.
- **System Validation Suite**: Comprehensive testing framework for all platform functionality areas.

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