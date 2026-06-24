import asyncio
from app.database.session import AsyncSessionLocal
from app.repositories.application import ApplicationRepository

async def test():
    async with AsyncSessionLocal() as db:
        repo = ApplicationRepository(db)
        apps = await repo.get_by_bank_id(1)
        print([app.status for app in apps])

asyncio.run(test())
