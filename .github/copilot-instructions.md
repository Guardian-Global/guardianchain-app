# GUARDIANCHAIN Protocol Development Guide

**CRITICAL**: Always follow these instructions first and only fallback to additional search and context gathering if the information here is incomplete or found to be in error.

GUARDIANCHAIN is a Web3 platform for sovereign memory infrastructure with truth tokenization, built on React + TypeScript + Express.js + PostgreSQL + Hardhat smart contracts.

## Bootstrap and Setup

**NEVER CANCEL any long-running commands. All timing expectations include safety margins.**

### Install Dependencies
```bash
npm install
```
- Takes ~4 minutes to complete. NEVER CANCEL. Set timeout to 10+ minutes.
- Expect deprecation warnings from WalletConnect and other Web3 dependencies.
- 32 vulnerabilities are expected and known (mainly from Web3 libraries).

### TypeScript Status
```bash
npm run check
```
- **EXPECTED TO FAIL** with 1000+ errors (case sensitivity, type mismatches).
- DO NOT attempt to fix all TypeScript errors - focus only on syntax errors that prevent builds.
- The build process works despite TypeScript check failures.

### Build Application
```bash
npm run build
```
- Takes ~23 seconds. NEVER CANCEL. Set timeout to 5+ minutes.
- Builds both frontend (Vite) and backend (esbuild) successfully.
- Warnings about large chunks (>500kB) are expected due to Web3 dependencies.
- Output directory: `./dist/`

## Environment Configuration

**CRITICAL**: The application requires environment variables to run.

### Required Environment Variables
Create `.env` or `.env.local` file with:
```bash
# Database (Required for dev server)
DATABASE_URL=postgresql://user:password@host:port/database

# Session Security
SESSION_SECRET=your_secure_session_secret_change_in_production

# Blockchain Configuration (Optional for basic development)
PRIVATE_KEY=your_deployer_wallet_private_key_without_0x
POLYGON_RPC_URL=https://polygon-rpc.com
BASE_RPC_URL=https://mainnet.base.org

# API Keys (Optional)
POLYGONSCAN_API_KEY=your_polygonscan_api_key
BASESCAN_API_KEY=your_basescan_api_key
```

### Database Setup
```bash
npm run db:push
```
- Pushes schema to PostgreSQL database using Drizzle ORM.
- FAILS without valid DATABASE_URL environment variable.
- Uses Neon serverless PostgreSQL in configuration.

## Development Server

### Start Development Server
```bash
# Set environment variables directly (dotenv not configured in server)
DATABASE_URL=postgresql://user:pass@host:port/db npm run dev
```
- **REQUIRES DATABASE_URL** environment variable or will fail immediately.
- Server does NOT automatically load `.env` files - must set environment variables directly.
- Runs on Node.js with tsx for TypeScript execution.
- Frontend served by Vite, backend by Express.js.
- NEVER CANCEL - development server runs indefinitely.

### Production Server
```bash
npm run start
```
- Runs the built production version from `./dist/index.js`.
- Requires successful `npm run build` first.

## Smart Contract Development

### Compile Contracts
```bash
npx hardhat compile
```
- **CURRENTLY FAILS** due to outdated OpenZeppelin imports.
- Known issues: 
  - `@openzeppelin/contracts/security/ReentrancyGuard.sol` → moved to `utils/`
  - `@openzeppelin/contracts/utils/Counters.sol` → deprecated in v5+
- DO NOT attempt smart contract deployment until compilation is fixed.
- Hardhat config supports Polygon, Base, and testnets.

### Smart Contract Configuration
- Main contracts in `./contracts/` directory
- Hardhat configuration: `hardhat.config.cjs`
- Supports multiple networks: Polygon, Base, Mumbai, Base Sepolia
- Gas optimization enabled with 200 runs

## Additional Components

### Terminal CLI
```bash
cd terminal
npx tsx guardian-terminal.ts
```
- Interactive command-line interface for capsule operations.
- Demo available: `./terminal/demo.sh`
- Requires API authentication tokens.

### FastAPI Veritas Node
```bash
cd fastapi-veritas-node
pip install -r requirements.txt
uvicorn main:app --reload --port=5000 --host=0.0.0.0
```
- Takes ~30 seconds to install dependencies.
- Python backend for high-performance capsule operations.
- Requires separate DATABASE_URL for PostgreSQL connection.

## Architecture Overview

### Frontend Stack
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS + Radix UI components
- **State Management**: React Query for server state
- **Web3**: Wagmi + Ethers.js for blockchain interaction

### Backend Stack  
- **Server**: Express.js + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Express sessions + JWT
- **Storage**: IPFS for decentralized content
- **APIs**: RESTful endpoints + WebSocket support

### Blockchain Stack
- **Development**: Hardhat framework
- **Networks**: Polygon + Base (mainnet and testnets)
- **Standards**: ERC-721 NFTs, custom governance tokens
- **Storage**: Smart contract metadata on IPFS

## Common Issues and Solutions

### Build Issues
- **TypeScript errors**: Build works despite `npm run check` failures.
- **Large bundle warnings**: Expected due to Web3 dependencies.
- **Asset resolution warnings**: Do not affect functionality.

### Development Server Issues
- **"DATABASE_URL must be set"**: Add valid PostgreSQL connection string to `.env`.
- **Port conflicts**: Default development runs on Express.js port.

### Smart Contract Issues  
- **OpenZeppelin import errors**: Contracts need updating for v5+ compatibility.
- **Compilation failures**: DO NOT deploy until imports are fixed.

## Validation Checklist

Always verify these steps after making changes:

### Basic Validation
- [ ] `npm install` completes without critical errors (4+ minutes)
- [ ] `npm run build` succeeds and generates `./dist/` (30+ seconds)  
- [ ] Environment variables configured for development needs
- [ ] Database connection available if testing backend

### Extended Validation
- [ ] Frontend builds and assets are generated correctly
- [ ] Backend compiles to `./dist/index.js` successfully
- [ ] Smart contract imports resolved (currently requires fixes)
- [ ] Terminal CLI demo runs: `./terminal/demo.sh`

## File Structure Reference

### Key Configuration Files
- `package.json` - Dependencies and scripts
- `vite.config.ts` - Frontend build configuration  
- `hardhat.config.cjs` - Smart contract configuration
- `drizzle.config.json` - Database schema configuration
- `tsconfig.json` - TypeScript configuration

### Important Directories  
- `client/src/` - React frontend source code
- `server/` - Express.js backend source code
- `contracts/` - Solidity smart contracts
- `shared/` - Shared TypeScript types and schemas
- `terminal/` - CLI interface implementation
- `fastapi-veritas-node/` - Python FastAPI backend

### Generated/Build Directories
- `dist/` - Production build output
- `node_modules/` - NPM dependencies
- `artifacts/` - Hardhat contract compilation output

## Security and Best Practices

- Never commit real environment variables or private keys to the repository.
- Use `.env.local` for local development secrets.
- All API endpoints require authentication in production.
- Smart contract deployment requires proper private key management.
- Database connections should use SSL in production environments.

---

**REMEMBER**: GUARDIANCHAIN must always be written in ALL CAPS (never GuardianChain or Guardian Chain). This is enforced across all code, documentation, and user interfaces.