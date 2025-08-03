from fastapi import FastAPI
from routes import capsules, reels, market

app = FastAPI(title="GuardianChain Capsule Sync Node")

app.include_router(capsules.router)
app.include_router(reels.router)
app.include_router(market.router)

@app.get("/")
def root():
    return {"status": "GuardianChain Sync Node running"}
