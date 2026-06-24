from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum as SQLEnum, Boolean, LargeBinary
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.database.session import Base

class DocumentType(str, enum.Enum):
    GST_CERTIFICATE = "GST Certificate"
    PAN_CARD = "PAN Card"
    INCOME_TAX_RETURN = "Income Tax Return"
    BANK_STATEMENT = "Bank Statement"

class DocumentStatus(str, enum.Enum):
    UPLOADED = "Uploaded"
    VERIFIED = "Verified"
    REJECTED = "Rejected"
    MISSING = "Missing"

class ApplicationStatus(str, enum.Enum):
    PENDING_ADMIN_REVIEW = "PENDING_ADMIN_REVIEW"
    FORWARDED_TO_BANK = "FORWARDED_TO_BANK"
    UNDER_BANK_REVIEW = "UNDER_BANK_REVIEW"
    WAITLISTED = "WAITLISTED"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    REJECTED_BY_BANK = "REJECTED_BY_BANK"
    REJECTED_BY_ADMIN = "REJECTED_BY_ADMIN"
    WITHDRAWN = "WITHDRAWN"
    FUNDED = "FUNDED"

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("business_profiles.id"), nullable=False)
    bank_id = Column(Integer, ForeignKey("bank_profiles.id"), nullable=False)
    
    amount_requested = Column(Float, nullable=False)
    purpose = Column(String, nullable=False)
    status = Column(SQLEnum(ApplicationStatus), default=ApplicationStatus.PENDING_ADMIN_REVIEW)

    # Admin review metadata
    reviewed_by_admin = Column(Integer, ForeignKey("users.id"), nullable=True)
    reviewed_at = Column(DateTime(timezone=True), nullable=True)
    admin_notes = Column(String, nullable=True)
    blocked_reason = Column(String, nullable=True)
    forwarded_at = Column(DateTime(timezone=True), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    business = relationship("BusinessProfile", back_populates="applications")
    bank = relationship("BankProfile", back_populates="applications")

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("business_profiles.id"), nullable=False)
    
    file_name = Column(String, nullable=False)
    mime_type = Column(String, nullable=False)  # e.g., 'application/pdf', 'image/png'
    file_size = Column(Integer, nullable=False)  # File size in bytes
    file_data = Column(LargeBinary, nullable=False)  # Binary file content (BYTEA)
    document_type = Column(SQLEnum(DocumentType), nullable=False)
    status = Column(SQLEnum(DocumentStatus), default=DocumentStatus.UPLOADED)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
    verified_at = Column(DateTime(timezone=True), nullable=True)

    business = relationship("BusinessProfile", back_populates="documents")

class DocumentRequirement(Base):
    __tablename__ = "document_requirements"

    id = Column(Integer, primary_key=True, index=True)
    bank_id = Column(Integer, ForeignKey("bank_profiles.id"), nullable=False)
    document_type = Column(SQLEnum(DocumentType), nullable=False)
    required = Column(Boolean, default=True)

    bank = relationship("BankProfile", back_populates="document_requirements")
