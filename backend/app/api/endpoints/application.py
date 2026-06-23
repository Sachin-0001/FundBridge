from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.database.session import get_db
from app.schemas.application import ApplicationCreate, ApplicationResponse, ApplicationUpdateStatus
from app.services.application import ApplicationService
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/", response_model=ApplicationResponse)
async def create_application(
    data: ApplicationCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = ApplicationService(db)
    return await service.create_application(current_user.id, data)

@router.get("/business", response_model=List[ApplicationResponse])
async def get_business_applications(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = ApplicationService(db)
    return await service.get_business_applications(current_user.id)

@router.get("/bank", response_model=List[ApplicationResponse])
async def get_bank_applications(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = ApplicationService(db)
    return await service.get_bank_applications(current_user.id)

@router.put("/{application_id}/status", response_model=ApplicationResponse)
async def update_application_status(
    application_id: int,
    data: ApplicationUpdateStatus,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = ApplicationService(db)
    return await service.update_status(current_user.id, application_id, data.status)

@router.put("/{application_id}/withdraw", response_model=ApplicationResponse)
async def withdraw_application(
    application_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = ApplicationService(db)
    return await service.withdraw_application(current_user.id, application_id)

