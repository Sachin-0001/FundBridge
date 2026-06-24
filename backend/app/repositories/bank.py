from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.models.bank import BankProfile, BankRequirements
from app.models.application import DocumentRequirement
from app.schemas.bank import BankProfileCreate

class BankRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_bank(self, user_id: int, bank_data: BankProfileCreate) -> BankProfile:
        data_dict = bank_data.model_dump(exclude={"requirements", "document_requirements"})
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

        if bank_data.document_requirements:
            for doc_type in bank_data.document_requirements:
                doc_req_obj = DocumentRequirement(
                    bank_id=db_obj.id,
                    document_type=doc_type,
                    required=True
                )
                self.session.add(doc_req_obj)

        await self.session.commit()
        await self.session.refresh(db_obj)
        
        # Load requirements
        result = await self.session.execute(
            select(BankProfile)
            .options(selectinload(BankProfile.requirements))
            .options(selectinload(BankProfile.document_requirements))
            .where(BankProfile.id == db_obj.id)
        )
        return result.scalars().first()

    async def update_bank(self, user_id: int, bank_data: BankProfileCreate) -> BankProfile:
        existing = await self.get_by_user_id(user_id)
        if not existing:
            raise Exception("Bank profile not found")
        
        data_dict = bank_data.model_dump(exclude={"requirements", "document_requirements"}, exclude_unset=True)
        for key, value in data_dict.items():
            setattr(existing, key, value)
        
        if bank_data.requirements:
            req_data = bank_data.requirements.model_dump(exclude_unset=True)
            if existing.requirements:
                for key, value in req_data.items():
                    setattr(existing.requirements, key, value)
            else:
                req_obj = BankRequirements(
                    bank_id=existing.id,
                    **req_data
                )
                self.session.add(req_obj)

        if bank_data.document_requirements is not None:
            # Delete existing
            for doc_req in existing.document_requirements:
                await self.session.delete(doc_req)
            # Add new
            for doc_type in bank_data.document_requirements:
                doc_req_obj = DocumentRequirement(
                    bank_id=existing.id,
                    document_type=doc_type,
                    required=True
                )
                self.session.add(doc_req_obj)
        
        await self.session.commit()
        await self.session.refresh(existing)
        return await self.get_by_user_id(user_id)

    async def get_by_user_id(self, user_id: int) -> BankProfile | None:
        result = await self.session.execute(
            select(BankProfile)
            .options(selectinload(BankProfile.requirements))
            .options(selectinload(BankProfile.document_requirements))
            .where(BankProfile.user_id == user_id)
        )
        return result.scalars().first()

    async def get_by_id(self, id: int) -> BankProfile | None:
        result = await self.session.execute(
            select(BankProfile)
            .options(selectinload(BankProfile.requirements))
            .options(selectinload(BankProfile.document_requirements))
            .where(BankProfile.id == id)
        )
        return result.scalars().first()

    async def get_all(self):
        result = await self.session.execute(
            select(BankProfile)
            .options(selectinload(BankProfile.requirements))
            .options(selectinload(BankProfile.document_requirements))
        )
        return result.scalars().all()
