import asyncio
from app.database.session import AsyncSessionLocal
from app.repositories.application import ApplicationRepository
from sqlalchemy.future import select
from app.models.application import Application

async def test():
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(Application))
        apps = result.scalars().all()
        print([app.status for app in apps])

asyncio.run(test())
