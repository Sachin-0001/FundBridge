from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.database.session import get_db
from app.api.deps import get_current_user
from app.models.user import User, UserRole
from app.services.application import ApplicationService
from app.schemas.application import ApplicationResponse

router = APIRouter()


def ensure_admin(user: User):
    if user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admin access required")


@router.get("/applications/pending", response_model=List[ApplicationResponse])
async def get_pending_applications(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    ensure_admin(current_user)
    svc = ApplicationService(db)
    return await svc.get_pending_for_admin(current_user.id)


@router.get("/applications/all", response_model=List[ApplicationResponse])
async def get_all_applications(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    ensure_admin(current_user)
    svc = ApplicationService(db)
    return await svc.get_all_for_admin(current_user.id)


@router.post("/applications/{application_id}/forward")
async def forward_application(
    application_id: int,
    notes: dict | None = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    ensure_admin(current_user)
    svc = ApplicationService(db)
    return await svc.forward_application(current_user.id, application_id, notes.get("notes") if notes else None)


@router.post("/applications/{application_id}/block")
async def block_application(
    application_id: int,
    payload: dict,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    ensure_admin(current_user)
    blocked_reason = payload.get("blocked_reason")
    notes = payload.get("notes")
    svc = ApplicationService(db)
    return await svc.block_application(current_user.id, application_id, blocked_reason, notes)


@router.post("/applications/{application_id}/request-info")
async def request_info(
    application_id: int,
    payload: dict,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    ensure_admin(current_user)
    notes = payload.get("notes")
    svc = ApplicationService(db)
    return await svc.request_more_info(current_user.id, application_id, notes)


@router.get("/stats")
async def get_stats(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    ensure_admin(current_user)
    # Compute KPIs: pending reviews, forwarded, blocked, approved, total applications, total businesses, total banks
    # Use direct queries for accurate counts
    from sqlalchemy import select, func
    from app.models.application import Application, ApplicationStatus
    from app.models.business import BusinessProfile
    from app.models.bank import BankProfile

    pending_q = await db.execute(select(func.count()).select_from(Application).where(Application.status == ApplicationStatus.PENDING_ADMIN_REVIEW))
    pending_count = pending_q.scalar_one()

    forwarded_q = await db.execute(select(func.count()).select_from(Application).where(Application.status.in_([
        ApplicationStatus.FORWARDED_TO_BANK,
        ApplicationStatus.UNDER_BANK_REVIEW,
        ApplicationStatus.APPROVED,
        ApplicationStatus.WAITLISTED,
        ApplicationStatus.REJECTED_BY_BANK,
        ApplicationStatus.FUNDED
    ])))
    forwarded_count = forwarded_q.scalar_one()

    blocked_q = await db.execute(select(func.count()).select_from(Application).where(Application.status == ApplicationStatus.REJECTED_BY_ADMIN))
    blocked_count = blocked_q.scalar_one()

    approved_q = await db.execute(select(func.count()).select_from(Application).where(Application.status.in_([
        ApplicationStatus.APPROVED,
        ApplicationStatus.FUNDED
    ])))
    approved_count = approved_q.scalar_one()
    
    rejected_bank_q = await db.execute(select(func.count()).select_from(Application).where(Application.status == ApplicationStatus.REJECTED_BY_BANK))
    rejected_bank_count = rejected_bank_q.scalar_one()

    total_q = await db.execute(select(func.count()).select_from(Application))
    total_count = total_q.scalar_one()

    businesses_q = await db.execute(select(func.count()).select_from(BusinessProfile))
    total_businesses = businesses_q.scalar_one()

    banks_q = await db.execute(select(func.count()).select_from(BankProfile))
    total_banks = banks_q.scalar_one()

    return {
        "pending_reviews": int(pending_count),
        "applications_forwarded": int(forwarded_count),
        "applications_blocked": int(blocked_count),
        "applications_approved": int(approved_count),
        "applications_rejected_by_bank": int(rejected_bank_count),
        "total_applications": int(total_count),
        "total_businesses": int(total_businesses),
        "total_banks": int(total_banks),
    }
