from fastapi import APIRouter
router = APIRouter(prefix="/reels")

@router.get("/feed")
def reels_feed():
    return {"reels": []}
