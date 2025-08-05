# Veritas Node - FastAPI Backend

A high-performance FastAPI backend for GuardianChain's Veritas system, providing capsule management, validation, and yield distribution services.

## Features

- 🚀 **High Performance**: Async/await with uvicorn ASGI server
- 📊 **Capsule Management**: Full CRUD operations for truth capsules
- ✅ **Veritas Validation**: Professional validation system with scoring
- 💰 **GTT Yield Distribution**: Automated reward calculations
- 📈 **Analytics & Stats**: Real-time platform statistics
- 🔄 **CORS Support**: Frontend integration ready
- 💾 **PostgreSQL Integration**: Robust database connectivity

## Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Environment Setup

Copy `.env.example` to `.env` and configure:

```env
DATABASE_URL=postgresql://user:password@host:port/database_name
```

For Supabase:
```env
DATABASE_URL=postgresql://postgres.xxxxxxxxxxxxxxxxxxxx:your_password@aws-0-us-west-1.pooler.supabase.com:6543/postgres
```

### 3. Run the Server

```bash
uvicorn main:app --reload --port=5000 --host=0.0.0.0
```

### 4. Deploy to Replit

1. Create new Python Repl
2. Upload project files
3. Set environment variables in Secrets
4. Configure run command: `uvicorn main:app --reload --port=5000 --host=0.0.0.0`

## API Endpoints

### Health & Status
- `GET /` - Root endpoint with node status
- `GET /health` - Health check with database connectivity
- `GET /stats` - Platform statistics and metrics

### Capsule Management
- `GET /capsules` - List all capsules with pagination
- `GET /capsules/{capsule_id}` - Get specific capsule details
- `POST /capsules/{capsule_id}/replay` - Record capsule replay and yield

### Veritas Validation
- `POST /capsules/{capsule_id}/validate` - Submit validation for capsule

## Database Schema

Required tables:

```sql
-- Capsules table
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

-- Capsule replays tracking
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

## Frontend Integration

### React/TypeScript Integration

```typescript
// Fetch capsules
const response = await fetch('https://your-replit-url.replit.app/capsules');
const capsules = await response.json();

// Record replay
const replayResponse = await fetch(`/capsules/${capsuleId}/replay`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ emotional_response: 85 })
});
```

### Use in Components

- `CapsuleTimeline.tsx` - Display capsule feed
- `ProfileCapsuleCount.tsx` - Show user capsule statistics
- `/capsule-stats` - Analytics dashboard

## Performance Features

- **Async Processing**: All database operations are async
- **Connection Pooling**: Efficient PostgreSQL connections
- **Pagination**: Built-in pagination for large datasets
- **Error Handling**: Comprehensive error responses
- **Validation**: Pydantic models for request/response validation

## Production Deployment

### Environment Variables
```env
DATABASE_URL=postgresql://production_url
DEBUG=false
API_VERSION=1.0.0
```

### Monitoring
- Health check endpoint: `/health`
- Statistics endpoint: `/stats`
- Automatic database connectivity testing

## Development

### Local Development
```bash
# Install dependencies
pip install -r requirements.txt

# Run with auto-reload
uvicorn main:app --reload --host=127.0.0.1 --port=8000
```

### Testing
```bash
# Test health endpoint
curl http://localhost:5000/health

# Test capsules endpoint
curl http://localhost:5000/capsules
```

## License

Part of the GuardianChain ecosystem. See main project for license details.