from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
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
        return db_obj

    async def get_by_user_id(self, user_id: int) -> BusinessProfile | None:
        result = await self.session.execute(
            select(BusinessProfile).where(BusinessProfile.user_id == user_id)
        )
        return result.scalars().first()
        
    async def get_all(self):
        result = await self.session.execute(select(BusinessProfile))
        return result.scalars().all()
