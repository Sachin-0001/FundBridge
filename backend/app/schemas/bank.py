from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class BankRequirementsBase(BaseModel):
    min_revenue: Optional[float] = None
    max_debt_to_revenue_ratio: Optional[float] = None
    min_years_in_business: Optional[int] = None
    min_readiness_score: Optional[int] = None
    preferred_industries: Optional[List[str]] = None
    preferred_locations: Optional[List[str]] = None
    gst_registered_only: Optional[bool] = False

class BankProfileBase(BaseModel):
    institution_name: str
    institution_type: str
    country: str
    city: str
    loan_products: List[str]
    min_interest_rate: Optional[float] = None
    max_interest_rate: Optional[float] = None
    min_loan_amount: Optional[float] = None
    max_loan_amount: Optional[float] = None
    contact_email: Optional[str] = None

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
