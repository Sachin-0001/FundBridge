from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete
from app.models.match import Match
from sqlalchemy.orm import selectinload
from typing import List
class MatchRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def upsert_match(self, business_id: int, bank_id: int, score: float, passed: list, failed: list, recommendation: str) -> Match:
        result = await self.session.execute(
            select(Match).where(
                Match.business_id == business_id,
                Match.bank_id == bank_id
            )
        )
        existing = result.scalars().first()
        
        if existing:
            existing.compatibility_score = score
            existing.passed_rules = passed
            existing.failed_rules = failed
            existing.recommendation = recommendation
            await self.session.commit()
            await self.session.refresh(existing)
            return existing
        else:
            new_match = Match(
                business_id=business_id,
                bank_id=bank_id,
                compatibility_score=score,
                passed_rules=passed,
                failed_rules=failed,
                recommendation=recommendation
            )
            self.session.add(new_match)
            await self.session.commit()
            await self.session.refresh(new_match)
            return new_match

    async def get_by_business_id(self, business_id: int) -> List[Match]:
        from app.models.bank import BankProfile
        from app.models.business import BusinessProfile
        result = await self.session.execute(
            select(Match).options(
                selectinload(Match.business).selectinload(BusinessProfile.documents),
                selectinload(Match.bank).selectinload(BankProfile.requirements),
                selectinload(Match.bank).selectinload(BankProfile.document_requirements)
            ).where(Match.business_id == business_id).order_by(Match.compatibility_score.desc())
        )
        return list(result.scalars().all())

    async def get_by_bank_id(self, bank_id: int) -> List[Match]:
        from app.models.bank import BankProfile
        from app.models.business import BusinessProfile
        result = await self.session.execute(
            select(Match).options(
                selectinload(Match.business).selectinload(BusinessProfile.documents),
                selectinload(Match.bank).selectinload(BankProfile.requirements),
                selectinload(Match.bank).selectinload(BankProfile.document_requirements)
            ).where(Match.bank_id == bank_id).order_by(Match.compatibility_score.desc())
        )
        return list(result.scalars().all())
