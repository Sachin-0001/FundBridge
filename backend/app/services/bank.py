from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.bank import BankRepository
from app.schemas.bank import BankProfileCreate, BankProfileResponse
from sqlalchemy.future import select
from app.services.matching import MatchingService

class BankService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.repo = BankRepository(session)
        self.matching_service = MatchingService(session)

    async def register_bank(self, user_id: int, data: BankProfileCreate) -> BankProfileResponse:
        existing = await self.repo.get_by_user_id(user_id)
        if existing:
            bank = await self.repo.update_bank(user_id, data)
            await self.matching_service.compute_matches_for_bank(bank.id)
            return BankProfileResponse.model_validate(bank)

        bank = await self.repo.create_bank(user_id=user_id, bank_data=data)
        await self.matching_service.compute_matches_for_bank(bank.id)
        return BankProfileResponse.model_validate(bank)

    async def get_dashboard(self, user_id: int) -> BankProfileResponse | None:
        bank = await self.repo.get_by_user_id(user_id)
        if not bank:
            return None
        return BankProfileResponse.model_validate(bank)
