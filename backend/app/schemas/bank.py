from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.models.application import DocumentType

class BankRequirementsBase(BaseModel):
    min_revenue: Optional[float] = None
    max_debt_to_revenue_ratio: Optional[float] = None
    min_years_in_business: Optional[int] = None
    preferred_industries: Optional[List[str]] = None
    preferred_locations: Optional[List[str]] = None
    gst_registered_only: Optional[bool] = False

class BankProfileBase(BaseModel):
    institution_name: str
    institution_type: str
    city: str
    loan_products: List[str]
    min_interest_rate: Optional[float] = None
    max_interest_rate: Optional[float] = None
    min_loan_amount: Optional[float] = None
    max_loan_amount: Optional[float] = None
    min_loan_tenor: Optional[int] = None
    max_loan_tenor: Optional[int] = None
    contact_email: Optional[str] = None

class BankProfileCreate(BankProfileBase):
    requirements: Optional[BankRequirementsBase] = None
    document_requirements: Optional[List[DocumentType]] = None

class BankRequirementsResponse(BankRequirementsBase):
    id: int
    bank_id: int

    class Config:
        from_attributes = True



class DocumentRequirementBase(BaseModel):
    document_type: DocumentType
    required: bool

class DocumentRequirementResponse(DocumentRequirementBase):
    id: int
    bank_id: int

    class Config:
        from_attributes = True

class BankProfileResponse(BankProfileBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    requirements: Optional[BankRequirementsResponse] = None
    document_requirements: Optional[List[DocumentRequirementResponse]] = []

    class Config:
        from_attributes = True
