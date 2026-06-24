import asyncio
from app.database.session import engine
from sqlalchemy import text

async def reset():
    async with engine.begin() as conn:
        await conn.execute(text("DROP TABLE IF EXISTS alembic_version CASCADE;"))
        print("Dropped alembic_version")

if __name__ == "__main__":
    asyncio.run(reset())
