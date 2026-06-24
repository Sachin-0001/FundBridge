import asyncio
import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from app.database.session import engine
from sqlalchemy import text

async def alter_table():
    async with engine.begin() as conn:
        try:
            await conn.execute(text("ALTER TABLE business_profiles ADD COLUMN ai_business_advice VARCHAR;"))
            print("Successfully added ai_business_advice column.")
        except Exception as e:
            print(f"Column might already exist or error occurred: {e}")

if __name__ == "__main__":
    asyncio.run(alter_table())
