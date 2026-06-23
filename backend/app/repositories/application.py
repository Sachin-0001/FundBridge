from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List, Optional
from app.models.application import Application, ApplicationStatus
from app.models.business import BusinessProfile
from app.models.bank import BankProfile

class ApplicationRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_application(self, business_id: int, bank_id: int, amount_requested: float, purpose: str) -> Application:
        application = Application(
            business_id=business_id,
            bank_id=bank_id,
            amount_requested=amount_requested,
            purpose=purpose,
            status=ApplicationStatus.PENDING
        )
        self.session.add(application)
        await self.session.commit()
        await self.session.refresh(application)
        return application

    async def get_by_id(self, application_id: int) -> Optional[Application]:
        result = await self.session.execute(
            select(Application)
            .options(selectinload(Application.business), selectinload(Application.bank))
            .where(Application.id == application_id)
        )
        return result.scalars().first()

    async def get_by_business_id(self, business_id: int) -> List[Application]:
        result = await self.session.execute(
            select(Application)
            .options(selectinload(Application.bank))
            .where(Application.business_id == business_id)
            .order_by(Application.created_at.desc())
        )
        return list(result.scalars().all())

    async def get_by_bank_id(self, bank_id: int) -> List[Application]:
        result = await self.session.execute(
            select(Application)
            .options(selectinload(Application.business))
            .where(Application.bank_id == bank_id)
            .order_by(Application.created_at.desc())
        )
        return list(result.scalars().all())

    async def update_status(self, application_id: int, status: ApplicationStatus) -> Optional[Application]:
        application = await self.get_by_id(application_id)
        if application:
            application.status = status
            await self.session.commit()
            await self.session.refresh(application)
        return application
