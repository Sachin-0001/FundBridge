from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.schemas.business import BusinessProfileCreate, BusinessProfileResponse
from app.services.business import BusinessService
from app.api import deps
from app.models.user import User

router = APIRouter()

@router.post("/register", response_model=dict)
async def register_business(
    data: BusinessProfileCreate, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    try:
        service = BusinessService(db)
        business = await service.register_business(current_user.id, data)
        return {"success": True, "message": "Business registered successfully", "data": business}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/dashboard", response_model=dict)
async def get_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    service = BusinessService(db)
    business = await service.get_dashboard(current_user.id)
    if not business:
        raise HTTPException(status_code=404, detail="Business profile not found")
    return {"success": True, "message": "Dashboard data retrieved", "data": business}

