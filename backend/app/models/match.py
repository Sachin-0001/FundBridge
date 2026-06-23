from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, Enum as SQLEnum, JSON, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.database.session import Base

class MatchStatus(str, enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    DECLINED = "declined"

class Match(Base):
    __tablename__ = "matches"

    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("business_profiles.id"), nullable=False)
    bank_id = Column(Integer, ForeignKey("bank_profiles.id"), nullable=False)
    
    compatibility_score = Column(Float, nullable=False)
    passed_rules = Column(JSON, default=list)
    failed_rules = Column(JSON, default=list)
    recommendation = Column(String)
    status = Column(SQLEnum(MatchStatus), default=MatchStatus.PENDING)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    business = relationship("BusinessProfile", back_populates="matches")
    bank = relationship("BankProfile", back_populates="matches")
