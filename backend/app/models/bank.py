from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON, Boolean, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.database.session import Base

class InstitutionType(str, enum.Enum):
    COMMERCIAL_BANK = "Commercial Bank"
    NBFC = "NBFC"
    CREDIT_UNION = "Credit Union"
    VENTURE_DEBT = "Venture Debt"
    FINTECH_LENDER = "FinTech Lender"
    GOVERNMENT_INSTITUTION = "Government Institution"
    PRIVATE_LENDING_FIRM = "Private Lending Firm"

class LoanProductType(str, enum.Enum):
    WORKING_CAPITAL = "Working Capital"
    EQUIPMENT_FINANCING = "Equipment Financing"
    INVOICE_FINANCING = "Invoice Financing"
    BUSINESS_EXPANSION = "Business Expansion"
    MSME_LOAN = "MSME Loan"
    LINE_OF_CREDIT = "Line of Credit"
    TERM_LOAN = "Term Loan"

class BankProfile(Base):
    __tablename__ = "bank_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    # Step 1: Institution Details
    institution_name = Column(String, index=True, nullable=False)
    institution_type = Column(String, nullable=False, default=InstitutionType.COMMERCIAL_BANK.value)
    country = Column(String)
    city = Column(String)
    
    # Step 2: Lending Products
    loan_products = Column(JSON) # List of LoanProductType strings
    min_interest_rate = Column(Float)
    max_interest_rate = Column(Float)
    min_loan_amount = Column(Float)
    max_loan_amount = Column(Float)
    
    # Old field (retaining for compatibility or migration ease)
    contact_email = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", backref="bank_profile")
    requirements = relationship("BankRequirements", back_populates="bank", uselist=False, cascade="all, delete-orphan")
    matches = relationship("Match", back_populates="bank")
    applications = relationship("Application", back_populates="bank")

class BankRequirements(Base):
    __tablename__ = "bank_requirements"

    id = Column(Integer, primary_key=True, index=True)
    bank_id = Column(Integer, ForeignKey("bank_profiles.id"), unique=True, nullable=False)
    
    # Step 3: Eligibility Rules
    min_revenue = Column(Float)
    max_debt_to_revenue_ratio = Column(Float)
    min_years_in_business = Column(Integer)
    min_readiness_score = Column(Integer)
    
    # Step 4: Lending Preferences
    preferred_industries = Column(JSON)  # List of strings
    preferred_locations = Column(JSON)   # List of strings
    gst_registered_only = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    bank = relationship("BankProfile", back_populates="requirements")
