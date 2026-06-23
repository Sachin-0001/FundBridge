from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.database.session import Base

class ApplicationStatus(str, enum.Enum):
    PENDING = "pending"
    UNDER_REVIEW = "under_review"
    WAITLISTED = "waitlisted"
    APPROVED = "approved"
    REJECTED = "rejected"
    WITHDRAWN = "withdrawn"

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("business_profiles.id"), nullable=False)
    bank_id = Column(Integer, ForeignKey("bank_profiles.id"), nullable=False)
    
    amount_requested = Column(Float, nullable=False)
    purpose = Column(String, nullable=False)
    status = Column(SQLEnum(ApplicationStatus), default=ApplicationStatus.PENDING)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    business = relationship("BusinessProfile", back_populates="applications")
    bank = relationship("BankProfile", back_populates="applications")

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("business_profiles.id"), nullable=False)
    
    file_name = Column(String, nullable=False)
    file_url = Column(String, nullable=False)
    document_type = Column(String, nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    business = relationship("BusinessProfile", back_populates="documents")
