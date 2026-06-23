import asyncio
import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from app.database.session import engine, Base
from sqlalchemy import text
from app.models.application import Application

async def reset_applications_table():
    async with engine.begin() as conn:
        try:
            await conn.execute(text("DROP TABLE IF EXISTS applications CASCADE;"))
            await conn.execute(text("DROP TYPE IF EXISTS applicationstatus CASCADE;"))
            print("Dropped applications table and types.")
        except Exception as e:
            print(f"Error dropping: {e}")
            
    # Now recreate it
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        print("Recreated applications table.")

if __name__ == "__main__":
    asyncio.run(reset_applications_table())
