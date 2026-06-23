import app.models
import asyncio
from app.database.session import AsyncSessionLocal
from app.schemas.business import BusinessProfileCreate
from app.services.business import BusinessService

async def main():
    async with AsyncSessionLocal() as db:
        service = BusinessService(db)
        data = BusinessProfileCreate(company_name="Test", annual_revenue=100, funding_goal=1000, employee_count=5)
        try:
            res = await service.register_business(data)
            print("SUCCESS", res)
        except Exception as e:
            import traceback
            traceback.print_exc()

asyncio.run(main())
