import asyncio
from app.database.session import AsyncSessionLocal
from sqlalchemy import text

async def drop_schema():
    async with AsyncSessionLocal() as session:
        await session.execute(text("DROP SCHEMA public CASCADE"))
        await session.execute(text("CREATE SCHEMA public"))
        await session.commit()
        print("Schema dropped and recreated")

asyncio.run(drop_schema())
