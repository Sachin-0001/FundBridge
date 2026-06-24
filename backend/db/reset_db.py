import asyncio
from app.database.session import engine, Base
from app.models import user, business, bank, application

async def reset():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        print("Dropped all tables")

if __name__ == "__main__":
    asyncio.run(reset())
