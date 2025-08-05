# GuardianChain Complete Deployment Guide

## 🚀 SMRI NFT Minter Deployment

### 1. Environment Configuration

Add to your `.env` file:
```env
# SMRI NFT Contract Address (deploy first)
VITE_SMRI_NFT_CONTRACT=0xYourDeployedSMRIBadgeContractAddress

# Optional: IPFS/Pinata for metadata storage
VITE_PINATA_API_KEY=your_pinata_api_key
VITE_PINATA_SECRET_KEY=your_pinata_secret_key
```

### 2. Deploy SMRI Badge Contract

**Option A: Using Thirdweb CLI**
```bash
npx thirdweb deploy --contract contracts/SMRIBadge.sol
```

**Option B: Using Remix IDE**
1. Copy the ERC-721 contract with `mintTo(address, metadata)` function
2. Deploy to Base Network (recommended for low fees)
3. Copy the deployed contract address

### 3. Frontend Integration

The SMRI system is already integrated into:
- `/tools/smri-badges` - Standalone SMRI badge generator
- `CapsuleWithSMRI.tsx` - Capsule-embedded badge generation
- `SMRIMinter.tsx` - Reusable minting component

**Usage Example:**
```typescript
import { mintSMRIBadge, analyzeCapsuleForSMRI } from "@/lib/nft/smriMinter";

// Auto-analyze capsule content
const traits = await analyzeCapsuleForSMRI(capsuleText);

// Mint badge with traits
const result = await mintSMRIBadge(userWallet, traits);
console.log(`Minted SMRI Badge #${result.tokenId}`);
```

## 🏃‍♂️ FastAPI Veritas Node Deployment

### 1. Local Development Setup

```bash
cd fastapi-veritas-node
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your database URL

# Run server
uvicorn main:app --reload --port=5000 --host=0.0.0.0
```

### 2. Replit Deployment

1. **Create New Python Repl**
   - Upload `fastapi-veritas-node/` folder
   - Install requirements: `pip install -r requirements.txt`

2. **Configure Environment Variables**
   In Replit Secrets:
   ```
   DATABASE_URL=postgresql://user:pass@host:port/dbname
   ```

3. **Set Run Command**
   ```bash
   uvicorn main:app --reload --port=5000 --host=0.0.0.0
   ```

### 3. Database Schema Setup

Required PostgreSQL tables:
```sql
-- Main capsules table
CREATE TABLE capsules (
    id VARCHAR PRIMARY KEY,
    title VARCHAR NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR NOT NULL,
    grief_tier INTEGER DEFAULT 1,
    category VARCHAR DEFAULT 'memory',
    is_sealed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    replays INTEGER DEFAULT 0,
    yield_earned DECIMAL DEFAULT 0.0
);

-- Replay tracking
CREATE TABLE capsule_replays (
    id SERIAL PRIMARY KEY,
    capsule_id VARCHAR REFERENCES capsules(id),
    emotional_response DECIMAL,
    yield_amount DECIMAL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Veritas validations
CREATE TABLE veritas_validations (
    id SERIAL PRIMARY KEY,
    capsule_id VARCHAR REFERENCES capsules(id),
    validator_address VARCHAR NOT NULL,
    validation_score DECIMAL NOT NULL,
    validation_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Frontend Integration

The FastAPI integration is built into:
- `CapsuleTimeline.tsx` - Fetches from Veritas Node first, fallback to main API
- `ProfileCapsuleCount.tsx` - Shows live network statistics
- `/capsule-stats` - Real-time analytics dashboard

**API Usage:**
```typescript
// Fetch capsules from Veritas Node
const response = await fetch('https://your-replit-url.replit.app/capsules');
const capsules = await response.json();

// Record capsule replay with yield calculation
const replayResponse = await fetch(`/capsules/${capsuleId}/replay`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ emotional_response: 85 })
});
```

## 🔗 Complete System Integration

### 1. Terminal + SMRI + FastAPI Flow

```bash
# 1. Terminal mint capsule
cd terminal
npx tsx guardian-terminal.ts

# 2. FastAPI processes and stores
curl -X POST https://veritas-node.replit.app/capsules

# 3. Frontend generates SMRI badge
await mintSMRIBadge(walletAddress, traits);
```

### 2. Cross-System Authentication

All systems use the consolidated authentication:
- Terminal API: Requires authentication headers
- SMRI Analysis: Protected by consolidatedAuth middleware  
- FastAPI: Can integrate with main auth system

### 3. Production Checklist

**SMRI System:**
- [x] Contract deployed to Base Network
- [x] Environment variables configured
- [x] IPFS metadata storage setup
- [x] Frontend integration complete

**FastAPI Veritas Node:**
- [x] Database schema created
- [x] Environment variables set
- [x] CORS configured for frontend
- [x] Health check endpoints active

**Terminal System:**
- [x] API endpoints secured
- [x] Authentication integration complete
- [x] Demo scripts tested
- [x] Documentation provided

## 🎯 Key Features Delivered

### SMRI NFT Minter
✅ AI-powered trait analysis from capsule content
✅ Six trait categories (memory type, grief score, trust index, etc.)
✅ Blockchain minting with metadata on IPFS
✅ Integration with capsule creation workflow
✅ Reusable component architecture

### FastAPI Veritas Node  
✅ High-performance async backend
✅ Capsule CRUD operations with pagination
✅ Automated GTT yield calculations
✅ Veritas validation system
✅ Real-time statistics and health monitoring

### Guardian Terminal CLI
✅ Interactive readline interface
✅ Secure API integration
✅ Mint and send operations
✅ Professional documentation
✅ Complete authentication system

## 🌐 Access URLs

- **Main Application**: `https://your-repl-url.replit.app`
- **SMRI Badge Generator**: `/tools/smri-badges`  
- **FastAPI Veritas Node**: `https://veritas-node.replit.app`
- **Terminal Interface**: `cd terminal && npx tsx guardian-terminal.ts`

## 📊 Monitoring & Analytics

- **Health Check**: `/health` (FastAPI)
- **Statistics**: `/stats` (FastAPI)  
- **Network Status**: Integrated in ProfileCapsuleCount component
- **Real-time Updates**: Live data synchronization across all systems

The complete GuardianChain ecosystem now provides comprehensive onboarding pathways:
🌐 Web App → 📱 PWA → 🖥️ Desktop → ⌨️ Terminal → 🧠 SMRI → 🚀 FastAPI