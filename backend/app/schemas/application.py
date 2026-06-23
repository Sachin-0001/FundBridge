from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.application import ApplicationStatus

class ApplicationCreate(BaseModel):
    bank_id: int
    amount_requested: float
    purpose: str

class ApplicationUpdateStatus(BaseModel):
    status: ApplicationStatus

class ApplicationResponse(BaseModel):
    id: int
    business_id: int
    bank_id: int
    amount_requested: float
    purpose: str
    status: ApplicationStatus
    created_at: datetime
    updated_at: Optional[datetime] = None

    # Optional relationships to be populated if loaded
    business: Optional[dict] = None
    bank: Optional[dict] = None

    class Config:
        from_attributes = True
