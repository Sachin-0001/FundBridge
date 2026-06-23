from pydantic import BaseModel
from typing import Optional
from enum import Enum
from datetime import datetime

class BusinessType(str, Enum):
    PROPRIETORSHIP = "Proprietorship"
    PARTNERSHIP = "Partnership"
    LLP = "LLP"
    PRIVATE_LIMITED = "Private Limited"
    PUBLIC_LIMITED = "Public Limited"

class FundingPurpose(str, Enum):
    WORKING_CAPITAL = "Working Capital"
    BUSINESS_EXPANSION = "Business Expansion"
    EQUIPMENT_PURCHASE = "Equipment Purchase"
    INVENTORY = "Inventory"
    MARKETING = "Marketing"
    HIRING = "Hiring"
    TECHNOLOGY = "Technology"
    OTHER = "Other"

class LoanType(str, Enum):
    TERM_LOAN = "Term Loan"
    WORKING_CAPITAL_LOAN = "Working Capital Loan"
    LINE_OF_CREDIT = "Line of Credit"
    INVOICE_FINANCING = "Invoice Financing"

class BusinessProfileBase(BaseModel):
    # Step 1
    company_name: str
    industry: str
    business_type: BusinessType
    years_in_operation: int
    
    # Step 2
    funding_goal: float
    funding_purpose: FundingPurpose
    loan_type: LoanType
    
    # Step 3
    annual_revenue: float
    annual_net_profit: float
    existing_debt: float
    monthly_cash_flow: float
    business_credit_score: int
    
    # Step 4
    employee_count: int
    country: str
    state: str
    city: str
    gst_registered: bool

class BusinessProfileCreate(BusinessProfileBase):
    pass

class BusinessProfileUpdate(BusinessProfileBase):
    company_name: Optional[str] = None
    industry: Optional[str] = None
    business_type: Optional[BusinessType] = None
    years_in_operation: Optional[int] = None
    funding_goal: Optional[float] = None
    funding_purpose: Optional[FundingPurpose] = None
    loan_type: Optional[LoanType] = None
    annual_revenue: Optional[float] = None
    annual_net_profit: Optional[float] = None
    existing_debt: Optional[float] = None
    monthly_cash_flow: Optional[float] = None
    business_credit_score: Optional[int] = None
    employee_count: Optional[int] = None
    country: Optional[str] = None
    state: Optional[str] = None
    city: Optional[str] = None
    gst_registered: Optional[bool] = None

class BusinessProfileResponse(BusinessProfileBase):
    id: int
    user_id: int
    readiness_score: int
    profile_completion: int
    registration_status: str
    ai_summary: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
