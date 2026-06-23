from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.match import MatchRepository
from app.repositories.business import BusinessRepository
from app.repositories.bank import BankRepository
from app.models.business import BusinessProfile
from app.models.bank import BankProfile

class MatchingService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.match_repo = MatchRepository(session)
        self.business_repo = BusinessRepository(session)
        self.bank_repo = BankRepository(session)

    def evaluate_match(self, business: BusinessProfile, bank: BankProfile):
        reqs = bank.requirements
        if not reqs:
            return 0, [], ["No bank requirements set"]

        score = 0
        passed_rules = []
        failed_rules = []

        # Revenue: 25
        if reqs.min_revenue is not None:
            if business.annual_revenue >= reqs.min_revenue:
                score += 25
                passed_rules.append(f"Revenue meets minimum of {reqs.min_revenue}")
            else:
                failed_rules.append(f"Revenue {business.annual_revenue} below minimum {reqs.min_revenue}")
        else:
            score += 25
            passed_rules.append("No minimum revenue requirement")

        # AI Readiness Score: 20
        # Check if readiness_score exists and min_readiness_score exists
        b_readiness = business.readiness_score or 0
        if reqs.min_readiness_score is not None:
            if b_readiness >= reqs.min_readiness_score:
                score += 20
                passed_rules.append(f"AI Score meets minimum of {reqs.min_readiness_score}")
            else:
                failed_rules.append(f"AI Score {b_readiness} below minimum {reqs.min_readiness_score}")
        else:
            score += 20
            passed_rules.append("No minimum AI score requirement")

        # Debt Ratio: 20
        # ratio = existing_debt / annual_revenue
        ratio = (business.existing_debt / business.annual_revenue) if business.annual_revenue and business.annual_revenue > 0 else 0
        if reqs.max_debt_to_revenue_ratio is not None:
            if ratio <= reqs.max_debt_to_revenue_ratio:
                score += 20
                passed_rules.append(f"Debt-to-Revenue Ratio {ratio:.2f} within limit {reqs.max_debt_to_revenue_ratio}")
            else:
                failed_rules.append(f"Debt-to-Revenue Ratio {ratio:.2f} exceeds limit {reqs.max_debt_to_revenue_ratio}")
        else:
            score += 20
            passed_rules.append("No maximum Debt-to-Revenue requirement")

        # Years: 15
        if reqs.min_years_in_business is not None:
            if business.years_in_operation >= reqs.min_years_in_business:
                score += 15
                passed_rules.append(f"Years in business meets minimum of {reqs.min_years_in_business}")
            else:
                failed_rules.append(f"Years in business {business.years_in_operation} below minimum {reqs.min_years_in_business}")
        else:
            score += 15
            passed_rules.append("No minimum years in business requirement")

        # Industry: 10
        if reqs.preferred_industries and len(reqs.preferred_industries) > 0:
            if business.industry in reqs.preferred_industries:
                score += 10
                passed_rules.append(f"Industry {business.industry} is preferred")
            else:
                failed_rules.append(f"Industry {business.industry} is not in preferred list")
        else:
            score += 10
            passed_rules.append("No industry preference")

        # Location: 5
        # Can match against city, state, or country
        b_locations = [business.city, business.state, business.country]
        if reqs.preferred_locations and len(reqs.preferred_locations) > 0:
            if any(loc in reqs.preferred_locations for loc in b_locations if loc):
                score += 5
                passed_rules.append(f"Location matches preferred list")
            else:
                failed_rules.append(f"Location does not match preferred list")
        else:
            score += 5
            passed_rules.append("No location preference")

        # GST: 5
        if reqs.gst_registered_only:
            if business.gst_registered:
                score += 5
                passed_rules.append("Business is GST registered")
            else:
                failed_rules.append("Business is not GST registered, which is required")
        else:
            # If bank doesn't strictly require it, we might still award points if the business has it, 
            # but to keep it simple, if no rule is set, they get the points.
            score += 5
            passed_rules.append("No strict GST requirement")

        recommendation = "Strong Match" if score >= 80 else "Good Match" if score >= 60 else "Poor Match"
        return score, passed_rules, failed_rules, recommendation

    async def compute_matches_for_business(self, business_id: int):
        business = await self.business_repo.get_by_id(business_id) 
        if not business:
            return
        
        banks = await self.bank_repo.get_all()
        for bank in banks:
            score, passed, failed, rec = self.evaluate_match(business, bank)
            await self.match_repo.upsert_match(business.id, bank.id, score, passed, failed, rec)

    async def compute_matches_for_bank(self, bank_id: int):
        bank = await self.bank_repo.get_by_id(bank_id) 
        if not bank:
            return
            
        businesses = await self.business_repo.get_all()
        for business in businesses:
            score, passed, failed, rec = self.evaluate_match(business, bank)
            await self.match_repo.upsert_match(business.id, bank.id, score, passed, failed, rec)

    async def recompute_all_matches(self):
        businesses = await self.business_repo.get_all()
        banks = await self.bank_repo.get_all()
        
        for business in businesses:
            for bank in banks:
                score, passed, failed, rec = self.evaluate_match(business, bank)
                await self.match_repo.upsert_match(business.id, bank.id, score, passed, failed, rec)
