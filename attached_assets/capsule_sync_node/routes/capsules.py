from fastapi import APIRouter
router = APIRouter(prefix="/capsules")

@router.post("/submit")
def submit_capsule():
    return {"status": "Capsule submitted"}

@router.post("/pin")
def pin_capsule():
    return {"status": "Capsule pinned"}
