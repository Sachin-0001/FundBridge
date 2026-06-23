from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class BankProfileBase(BaseModel):
    institution_name: str
    website: Optional[str] = None
    contact_email: str

class BankRequirementsBase(BaseModel):
    min_revenue: Optional[float] = None
    max_loan_amount: Optional[float] = None
    preferred_industries: Optional[List[str]] = None

class BankProfileCreate(BankProfileBase):
    requirements: Optional[BankRequirementsBase] = None

class BankRequirementsResponse(BankRequirementsBase):
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

    class Config:
        from_attributes = True
