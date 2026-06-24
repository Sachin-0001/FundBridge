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

from app.models.application import DocumentType, DocumentStatus

class DocumentBase(BaseModel):
    document_type: DocumentType

class DocumentCreate(DocumentBase):
    pass

class DocumentResponse(DocumentBase):
    id: int
    business_id: int
    file_name: str
    mime_type: str
    file_size: int
    status: DocumentStatus
    verified_at: Optional[datetime] = None
    uploaded_at: datetime

    class Config:
        from_attributes = True


class DocumentDownloadResponse(BaseModel):
    """Response for document download endpoint"""
    file_name: str
    mime_type: str
    file_size: int
    file_data: bytes

    class Config:
        from_attributes = True
