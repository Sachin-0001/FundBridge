from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.models.bank import BankProfile, BankRequirements
from app.schemas.bank import BankProfileCreate

class BankRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_bank(self, user_id: int, bank_data: BankProfileCreate) -> BankProfile:
        data_dict = bank_data.model_dump(exclude={"requirements"})
        db_obj = BankProfile(
            user_id=user_id,
            **data_dict
        )
        self.session.add(db_obj)
        await self.session.flush()

        if bank_data.requirements:
            req_obj = BankRequirements(
                bank_id=db_obj.id,
                **bank_data.requirements.model_dump()
            )
            self.session.add(req_obj)

        await self.session.commit()
        await self.session.refresh(db_obj)
        
        # Load requirements
        result = await self.session.execute(
            select(BankProfile).options(selectinload(BankProfile.requirements)).where(BankProfile.id == db_obj.id)
        )
        return result.scalars().first()

    async def get_by_user_id(self, user_id: int) -> BankProfile | None:
        result = await self.session.execute(
            select(BankProfile).options(selectinload(BankProfile.requirements)).where(BankProfile.user_id == user_id)
        )
        return result.scalars().first()

    async def get_by_id(self, id: int) -> BankProfile | None:
        result = await self.session.execute(
            select(BankProfile).options(selectinload(BankProfile.requirements)).where(BankProfile.id == id)
        )
        return result.scalars().first()

    async def get_all(self):
        result = await self.session.execute(
            select(BankProfile).options(selectinload(BankProfile.requirements))
        )
        return result.scalars().all()
