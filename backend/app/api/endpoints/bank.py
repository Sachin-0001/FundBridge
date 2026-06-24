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

from app.schemas.match import MatchResponse
from typing import List

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

@router.get("/matches", response_model=dict)
async def get_matches(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    service = BankService(db)
    bank = await service.get_dashboard(current_user.id)
    if not bank:
        raise HTTPException(status_code=404, detail="Bank profile not found")
        
    from app.repositories.match import MatchRepository
    match_repo = MatchRepository(db)
    matches = await match_repo.get_by_bank_id(bank.id)
    
    matches_data = [MatchResponse.model_validate(m).model_dump() for m in matches]
    return {"success": True, "message": "Matches retrieved successfully", "data": matches_data}

from fastapi import Response
from sqlalchemy.future import select
from app.models.application import Document

@router.get("/business/{business_id}/documents/{document_id}/download", response_class=Response)
async def download_business_document(
    business_id: int,
    document_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    service = BankService(db)
    bank = await service.get_dashboard(current_user.id)
    if not bank:
        raise HTTPException(status_code=404, detail="Bank profile not found")
        
    result = await db.execute(select(Document).where(
        Document.id == document_id,
        Document.business_id == business_id
    ))
    doc = result.scalars().first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    return Response(
        content=doc.file_data,
        media_type=doc.mime_type,
        headers={"Content-Disposition": f"attachment; filename={doc.file_name}"}
    )
