import asyncio
import os
import sys

# Ensure backend root is in pythonpath
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database.session import AsyncSessionLocal
from app.models.business import BusinessProfile
from app.services.ai import AIService
from app.services.matching import MatchingService
from sqlalchemy.future import select

async def main():
    if not os.environ.get("GROQ_API_KEY"):
        print("Error: GROQ_API_KEY is not set in your environment or .env file.")
        print("Please add GROQ_API_KEY to your .env file or export it, then run this script again.")
        sys.exit(1)

    print("Starting AI recalculation for existing businesses...")
    ai_service = AIService()

    async with AsyncSessionLocal() as db:
        matching_service = MatchingService(db)
        
        # Fetch all businesses
        result = await db.execute(select(BusinessProfile))
        businesses = result.scalars().all()
        
        print(f"Found {len(businesses)} businesses to re-evaluate.")
        
        for business in businesses:
            print(f"Analyzing {business.company_name}...")
            
            # Serialize business data for the prompt
            b_data = {
                "company_name": business.company_name,
                "industry": business.industry,
                "years_in_operation": business.years_in_operation,
                "annual_revenue": business.annual_revenue,
                "annual_net_profit": business.annual_net_profit,
                "existing_debt": business.existing_debt,
                "monthly_cash_flow": business.monthly_cash_flow,
                "business_credit_score": business.business_credit_score,
                "gst_registered": business.gst_registered,
                "funding_purpose": business.funding_purpose,
                "loan_type": business.loan_type
            }
            
            analysis = await ai_service.analyze_business(b_data)
            
            # Update the database
            business.readiness_score = analysis.get("readiness_score", 60)
            business.ai_summary = analysis.get("ai_summary", "Analyzed profile.")
            business.ai_business_advice = analysis.get("ai_business_advice", "Keep updating your profile to see advice.")
            print(f" -> Score: {business.readiness_score}")
            print(f" -> Summary: {business.ai_summary}")
            print(f" -> Advice: {business.ai_business_advice}")
            
            db.add(business)
        
        await db.commit()
        
        print("\nRecomputing all bank matches with the new AI scores...")
        await matching_service.recompute_all_matches()
        
        print("\nAll done! Databases and matches are fully updated with real AI insights.")

if __name__ == "__main__":
    asyncio.run(main())
