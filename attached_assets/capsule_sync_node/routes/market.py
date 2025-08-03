from fastapi import APIRouter
router = APIRouter(prefix="/market")

@router.post("/offer")
def post_offer():
    return {"status": "Offer placed"}

@router.get("/offers")
def list_offers():
    return {"offers": []}
