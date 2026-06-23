from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.business import BusinessRepository
from app.schemas.business import BusinessProfileCreate, BusinessProfileResponse
from sqlalchemy.future import select

class BusinessService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.repo = BusinessRepository(session)

    async def register_business(self, user_id: int, data: BusinessProfileCreate) -> BusinessProfileResponse:
        existing = await self.repo.get_by_user_id(user_id)
        if existing:
            for key, value in data.model_dump().items():
                setattr(existing, key, value)
            score = 60
            if existing.annual_net_profit > 0:
                score += 10
            if existing.business_credit_score > 700:
                score += 15
            if existing.years_in_operation > 2:
                score += 10
            existing.readiness_score = min(score, 100)
            existing.profile_completion = 100
            existing.registration_status = "Approved"
            existing.ai_summary = f"{data.company_name} is seeking {data.funding_purpose.value} via {data.loan_type.value}. With {data.years_in_operation} years in business and a {data.business_credit_score} credit score, the profile looks robust."
            await self.session.commit()
            await self.session.refresh(existing)
            return BusinessProfileResponse.model_validate(existing)

        business = await self.repo.create_business(user_id=user_id, business_data=data)
        
        score = 60
        if business.annual_net_profit > 0:
            score += 10
        if business.business_credit_score > 700:
            score += 15
        if business.years_in_operation > 2:
            score += 10
            
        business.readiness_score = min(score, 100)
        business.profile_completion = 100
        business.registration_status = "Approved"
        business.ai_summary = f"{data.company_name} is seeking {data.funding_purpose.value} via {data.loan_type.value}. With {data.years_in_operation} years in business and a {data.business_credit_score} credit score, the profile looks robust."
        await self.session.commit()
        await self.session.refresh(business)
        
        return BusinessProfileResponse.model_validate(business)

    async def get_dashboard(self, user_id: int) -> BusinessProfileResponse | None:
        business = await self.repo.get_by_user_id(user_id)
        if not business:
            return None
        return BusinessProfileResponse.model_validate(business)
