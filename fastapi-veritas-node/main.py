from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import asyncpg
import os
from datetime import datetime
import json

app = FastAPI(title="Veritas Node API", version="1.0.0")

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection
DATABASE_URL = os.getenv("DATABASE_URL")

async def get_db_connection():
    if not DATABASE_URL:
        raise HTTPException(status_code=500, detail="Database URL not configured")
    return await asyncpg.connect(DATABASE_URL)

# Pydantic models
class CapsuleCreate(BaseModel):
    title: str
    content: str
    author: str
    grief_tier: int = 1
    category: str = "memory"
    is_sealed: bool = False

class CapsuleResponse(BaseModel):
    id: str
    title: str
    content: str
    author: str
    grief_tier: int
    category: str
    is_sealed: bool
    created_at: datetime
    replays: int = 0
    yield_earned: float = 0.0

class VeritasValidation(BaseModel):
    capsule_id: str
    validator_address: str
    validation_score: float
    validation_notes: Optional[str] = None

class GTTYieldDistribution(BaseModel):
    capsule_id: str
    recipient: str
    amount: float
    yield_type: str  # "replay", "validation", "staking"

# Health check endpoint
@app.get("/")
async def root():
    return {
        "message": "Veritas Node API v1.0.0",
        "status": "active",
        "timestamp": datetime.now().isoformat()
    }

# Capsule management endpoints
@app.get("/capsules", response_model=List[CapsuleResponse])
async def get_capsules(limit: int = 50, offset: int = 0):
    """Get all capsules with pagination"""
    try:
        conn = await get_db_connection()
        try:
            query = """
                SELECT id, title, content, author, grief_tier, category, 
                       is_sealed, created_at, replays, yield_earned
                FROM capsules 
                ORDER BY created_at DESC 
                LIMIT $1 OFFSET $2
            """
            rows = await conn.fetch(query, limit, offset)
            
            capsules = []
            for row in rows:
                capsules.append(CapsuleResponse(
                    id=row['id'],
                    title=row['title'],
                    content=row['content'],
                    author=row['author'],
                    grief_tier=row['grief_tier'],
                    category=row['category'],
                    is_sealed=row['is_sealed'],
                    created_at=row['created_at'],
                    replays=row['replays'] or 0,
                    yield_earned=float(row['yield_earned'] or 0.0)
                ))
            
            return capsules
        finally:
            await conn.close()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.get("/capsules/{capsule_id}", response_model=CapsuleResponse)
async def get_capsule(capsule_id: str):
    """Get a specific capsule by ID"""
    try:
        conn = await get_db_connection()
        try:
            query = """
                SELECT id, title, content, author, grief_tier, category, 
                       is_sealed, created_at, replays, yield_earned
                FROM capsules 
                WHERE id = $1
            """
            row = await conn.fetchrow(query, capsule_id)
            
            if not row:
                raise HTTPException(status_code=404, detail="Capsule not found")
            
            return CapsuleResponse(
                id=row['id'],
                title=row['title'],
                content=row['content'],
                author=row['author'],
                grief_tier=row['grief_tier'],
                category=row['category'],
                is_sealed=row['is_sealed'],
                created_at=row['created_at'],
                replays=row['replays'] or 0,
                yield_earned=float(row['yield_earned'] or 0.0)
            )
        finally:
            await conn.close()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.post("/capsules/{capsule_id}/replay")
async def replay_capsule(capsule_id: str, emotional_response: float):
    """Record a capsule replay and calculate yield"""
    try:
        if not (0 <= emotional_response <= 100):
            raise HTTPException(status_code=400, detail="Emotional response must be between 0 and 100")
        
        conn = await get_db_connection()
        try:
            # Get capsule details
            capsule_query = "SELECT grief_tier, replays, yield_earned FROM capsules WHERE id = $1"
            capsule = await conn.fetchrow(capsule_query, capsule_id)
            
            if not capsule:
                raise HTTPException(status_code=404, detail="Capsule not found")
            
            # Calculate yield (base 10 GTT * grief tier * emotional multiplier)
            base_yield = 10.0
            grief_multiplier = capsule['grief_tier']
            emotional_multiplier = max(0.5, emotional_response / 100)
            yield_amount = base_yield * grief_multiplier * emotional_multiplier
            
            # Update capsule stats
            new_replays = (capsule['replays'] or 0) + 1
            new_yield = float(capsule['yield_earned'] or 0.0) + yield_amount
            
            update_query = """
                UPDATE capsules 
                SET replays = $1, yield_earned = $2, updated_at = NOW()
                WHERE id = $3
            """
            await conn.execute(update_query, new_replays, new_yield, capsule_id)
            
            # Record the replay event
            replay_query = """
                INSERT INTO capsule_replays (capsule_id, emotional_response, yield_amount, created_at)
                VALUES ($1, $2, $3, NOW())
            """
            await conn.execute(replay_query, capsule_id, emotional_response, yield_amount)
            
            return {
                "success": True,
                "capsule_id": capsule_id,
                "yield_amount": yield_amount,
                "emotional_response": emotional_response,
                "total_replays": new_replays,
                "total_yield": new_yield
            }
        finally:
            await conn.close()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Replay processing error: {str(e)}")

@app.post("/capsules/{capsule_id}/validate")
async def validate_capsule(capsule_id: str, validation: VeritasValidation):
    """Submit Veritas validation for a capsule"""
    try:
        conn = await get_db_connection()
        try:
            # Check if capsule exists
            capsule_check = "SELECT id FROM capsules WHERE id = $1"
            capsule = await conn.fetchrow(capsule_check, capsule_id)
            
            if not capsule:
                raise HTTPException(status_code=404, detail="Capsule not found")
            
            # Record validation
            validation_query = """
                INSERT INTO veritas_validations 
                (capsule_id, validator_address, validation_score, validation_notes, created_at)
                VALUES ($1, $2, $3, $4, NOW())
                RETURNING id
            """
            validation_id = await conn.fetchval(
                validation_query,
                capsule_id,
                validation.validator_address,
                validation.validation_score,
                validation.validation_notes
            )
            
            # Calculate validator reward (5% of capsule's total yield)
            capsule_yield_query = "SELECT yield_earned FROM capsules WHERE id = $1"
            capsule_yield = await conn.fetchval(capsule_yield_query, capsule_id)
            validator_reward = float(capsule_yield or 0.0) * 0.05
            
            return {
                "success": True,
                "validation_id": validation_id,
                "capsule_id": capsule_id,
                "validator_reward": validator_reward,
                "validation_score": validation.validation_score
            }
        finally:
            await conn.close()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Validation error: {str(e)}")

@app.get("/stats")
async def get_veritas_stats():
    """Get Veritas node statistics"""
    try:
        conn = await get_db_connection()
        try:
            # Get various statistics
            stats_queries = {
                "total_capsules": "SELECT COUNT(*) FROM capsules",
                "total_replays": "SELECT SUM(replays) FROM capsules",
                "total_yield_distributed": "SELECT SUM(yield_earned) FROM capsules",
                "active_validators": "SELECT COUNT(DISTINCT validator_address) FROM veritas_validations WHERE created_at > NOW() - INTERVAL '30 days'",
                "avg_grief_tier": "SELECT AVG(grief_tier) FROM capsules",
                "sealed_capsules": "SELECT COUNT(*) FROM capsules WHERE is_sealed = true"
            }
            
            stats = {}
            for key, query in stats_queries.items():
                result = await conn.fetchval(query)
                stats[key] = float(result) if result else 0.0
            
            return {
                "status": "active",
                "timestamp": datetime.now().isoformat(),
                "statistics": stats
            }
        finally:
            await conn.close()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Stats error: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring"""
    try:
        conn = await get_db_connection()
        await conn.fetchval("SELECT 1")
        await conn.close()
        
        return {
            "status": "healthy",
            "database": "connected",
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)