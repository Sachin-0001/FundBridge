from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.schemas.bank import BankProfileCreate, BankProfileResponse
from app.services.bank import BankService
from app.api import deps
from app.models.user import User

router = APIRouter()

@router.post("/register", response_model=dict)
async def register_bank(
    data: BankProfileCreate, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    try:
        service = BankService(db)
        bank = await service.register_bank(current_user.id, data)
        return {"success": True, "message": "Bank registered successfully", "data": bank}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/dashboard", response_model=dict)
async def get_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    service = BankService(db)
    bank = await service.get_dashboard(current_user.id)
    if not bank:
        raise HTTPException(status_code=404, detail="Bank profile not found")
    return {"success": True, "message": "Dashboard data retrieved", "data": bank}
