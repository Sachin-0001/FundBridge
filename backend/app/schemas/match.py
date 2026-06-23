from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime
from app.models.match import MatchStatus
from app.schemas.business import BusinessProfileResponse
from app.schemas.bank import BankProfileResponse

class MatchBase(BaseModel):
    compatibility_score: float
    passed_rules: List[str]
    failed_rules: List[str]
    recommendation: Optional[str] = None
    status: MatchStatus
    
class MatchResponse(MatchBase):
    id: int
    business_id: int
    bank_id: int
    business: Optional[BusinessProfileResponse] = None
    bank: Optional[BankProfileResponse] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
