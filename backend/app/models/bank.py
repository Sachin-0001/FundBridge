from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.session import Base

class BankProfile(Base):
    __tablename__ = "bank_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    institution_name = Column(String, index=True, nullable=False)
    website = Column(String)
    contact_email = Column(String, nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", backref="bank_profile")
    requirements = relationship("BankRequirements", back_populates="bank", uselist=False)
    matches = relationship("Match", back_populates="bank")

class BankRequirements(Base):
    __tablename__ = "bank_requirements"

    id = Column(Integer, primary_key=True, index=True)
    bank_id = Column(Integer, ForeignKey("bank_profiles.id"), unique=True, nullable=False)
    
    min_revenue = Column(Float)
    max_loan_amount = Column(Float)
    preferred_industries = Column(JSON)  # List of strings
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    bank = relationship("BankProfile", back_populates="requirements")
