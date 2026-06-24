from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy.sql import func
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
            status=ApplicationStatus.PENDING_ADMIN_REVIEW
        )
        self.session.add(application)
        await self.session.commit()
        await self.session.refresh(application)
        return application

    async def get_pending_admin_applications(self) -> List[Application]:
        result = await self.session.execute(
            select(Application)
            .options(selectinload(Application.business), selectinload(Application.bank))
            .where(Application.status == ApplicationStatus.PENDING_ADMIN_REVIEW)
            .order_by(Application.created_at.desc())
        )
        return list(result.scalars().all())

    async def get_all_applications(self) -> List[Application]:
        result = await self.session.execute(
            select(Application)
            .options(selectinload(Application.business), selectinload(Application.bank))
            .order_by(Application.created_at.desc())
        )
        return list(result.scalars().all())

    async def forward_application(self, application_id: int, admin_id: int, notes: str | None = None) -> Optional[Application]:
        application = await self.get_by_id(application_id)
        if application:
            application.status = ApplicationStatus.FORWARDED_TO_BANK
            application.reviewed_by_admin = admin_id
            application.reviewed_at = func.now()
            application.admin_notes = notes
            application.forwarded_at = func.now()
            await self.session.commit()
            await self.session.refresh(application)
        return application

    async def block_application(self, application_id: int, admin_id: int, blocked_reason: str | None = None, notes: str | None = None) -> Optional[Application]:
        application = await self.get_by_id(application_id)
        if application:
            application.status = ApplicationStatus.REJECTED_BY_ADMIN
            application.reviewed_by_admin = admin_id
            application.reviewed_at = func.now()
            application.admin_notes = notes
            application.blocked_reason = blocked_reason
            await self.session.commit()
            await self.session.refresh(application)
        return application

    async def request_more_info(self, application_id: int, admin_id: int, notes: str | None = None) -> Optional[Application]:
        application = await self.get_by_id(application_id)
        if application:
            # keep status as pending admin review but record notes
            application.reviewed_by_admin = admin_id
            application.reviewed_at = func.now()
            application.admin_notes = notes
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
        # Only return applications that are visible to banks
        visible_statuses = [
            ApplicationStatus.FORWARDED_TO_BANK,
            ApplicationStatus.UNDER_BANK_REVIEW,
            ApplicationStatus.WAITLISTED,
            ApplicationStatus.APPROVED,
            ApplicationStatus.REJECTED_BY_BANK,
        ]
        result = await self.session.execute(
            select(Application)
            .options(selectinload(Application.business))
            .where(Application.bank_id == bank_id)
            .where(Application.status.in_(visible_statuses))
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
