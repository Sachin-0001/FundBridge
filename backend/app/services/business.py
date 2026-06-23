from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.business import BusinessRepository
from app.schemas.business import BusinessProfileCreate, BusinessProfileResponse
from sqlalchemy.future import select
from app.services.matching import MatchingService
from app.services.ai import AIService

class BusinessService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.repo = BusinessRepository(session)
        self.matching_service = MatchingService(session)
        self.ai_service = AIService()

    async def register_business(self, user_id: int, data: BusinessProfileCreate) -> BusinessProfileResponse:
        existing = await self.repo.get_by_user_id(user_id)
        
        # 1. Ask AI to analyze the business profile
        analysis = await self.ai_service.analyze_business(data.model_dump())
        score = analysis.get("readiness_score", 60)
        summary = analysis.get("ai_summary", "Analyzed profile.")
        advice = analysis.get("ai_business_advice", "Consider reducing debt and increasing revenue.")

        if existing:
            for key, value in data.model_dump().items():
                setattr(existing, key, value)
                
            existing.readiness_score = score
            existing.profile_completion = 100
            existing.registration_status = "Approved"
            existing.ai_summary = summary
            existing.ai_business_advice = advice
            existing.ai_report = None
            
            await self.session.commit()
            await self.session.refresh(existing)
            await self.matching_service.compute_matches_for_business(existing.id)
            return BusinessProfileResponse.model_validate(existing)

        business = await self.repo.create_business(user_id=user_id, business_data=data)
        
        business.readiness_score = score
        business.profile_completion = 100
        business.registration_status = "Approved"
        business.ai_summary = summary
        business.ai_business_advice = advice
        
        await self.session.commit()
        await self.session.refresh(business)
        
        await self.matching_service.compute_matches_for_business(business.id)
        
        return BusinessProfileResponse.model_validate(business)

    async def get_dashboard(self, user_id: int) -> BusinessProfileResponse | None:
        business = await self.repo.get_by_user_id(user_id)
        if not business:
            return None

        return BusinessProfileResponse.model_validate(business)
