from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.database.session import Base

class BusinessType(str, enum.Enum):
    PROPRIETORSHIP = "Proprietorship"
    PARTNERSHIP = "Partnership"
    LLP = "LLP"
    PRIVATE_LIMITED = "Private Limited"
    PUBLIC_LIMITED = "Public Limited"

class FundingPurpose(str, enum.Enum):
    WORKING_CAPITAL = "Working Capital"
    BUSINESS_EXPANSION = "Business Expansion"
    EQUIPMENT_PURCHASE = "Equipment Purchase"
    INVENTORY = "Inventory"
    MARKETING = "Marketing"
    HIRING = "Hiring"
    TECHNOLOGY = "Technology"
    OTHER = "Other"

class LoanType(str, enum.Enum):
    TERM_LOAN = "Term Loan"
    WORKING_CAPITAL_LOAN = "Working Capital Loan"
    LINE_OF_CREDIT = "Line of Credit"
    INVOICE_FINANCING = "Invoice Financing"

class BusinessProfile(Base):
    __tablename__ = "business_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    # Step 1: Company Information
    company_name = Column(String, index=True, nullable=False)
    industry = Column(String, index=True, nullable=False)
    business_type = Column(SQLEnum(BusinessType), nullable=False)
    years_in_operation = Column(Integer, nullable=False)
    
    # Step 2: Funding Requirements
    funding_goal = Column(Float, nullable=False)
    funding_purpose = Column(SQLEnum(FundingPurpose), nullable=False)
    loan_type = Column(SQLEnum(LoanType), nullable=False)
    
    # Step 3: Financial Health
    annual_revenue = Column(Float, nullable=False)
    annual_net_profit = Column(Float, nullable=False)
    existing_debt = Column(Float, nullable=False)
    monthly_cash_flow = Column(Float, nullable=False)
    business_credit_score = Column(Integer, nullable=False)
    
    # Step 4: Business Profile
    employee_count = Column(Integer, nullable=False)
    country = Column(String, nullable=False)
    state = Column(String, nullable=False)
    city = Column(String, nullable=False)
    gst_registered = Column(Boolean, nullable=False)
    
    # Dashboard Fields
    readiness_score = Column(Integer, default=0)
    profile_completion = Column(Integer, default=100)
    registration_status = Column(String, default="Complete")
    ai_summary = Column(String)
    ai_business_advice = Column(String)
    ai_report = Column(String)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", backref="business_profile")
    applications = relationship("Application", back_populates="business")
    documents = relationship("Document", back_populates="business")
    matches = relationship("Match", back_populates="business")
