from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.models.business import BusinessProfile
from app.schemas.business import BusinessProfileCreate
from app.models.user import User

class BusinessRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_business(self, user_id: int, business_data: BusinessProfileCreate) -> BusinessProfile:
        db_obj = BusinessProfile(
            user_id=user_id,
            **business_data.model_dump()
        )
        self.session.add(db_obj)
        await self.session.commit()
        await self.session.refresh(db_obj)
        return await self.get_by_id(db_obj.id)

    async def get_by_user_id(self, user_id: int) -> BusinessProfile | None:
        result = await self.session.execute(
            select(BusinessProfile)
            .options(selectinload(BusinessProfile.documents))
            .where(BusinessProfile.user_id == user_id)
        )
        return result.scalars().first()

    async def get_by_id(self, id: int) -> BusinessProfile | None:
        result = await self.session.execute(
            select(BusinessProfile)
            .options(selectinload(BusinessProfile.documents))
            .where(BusinessProfile.id == id)
        )
        return result.scalars().first()
        
    async def get_all(self):
        result = await self.session.execute(
            select(BusinessProfile)
            .options(selectinload(BusinessProfile.documents))
        )
        return result.scalars().all()
