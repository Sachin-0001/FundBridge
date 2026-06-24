from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.application import ApplicationRepository
from app.schemas.application import ApplicationCreate, ApplicationResponse
from app.models.application import ApplicationStatus
from app.repositories.business import BusinessRepository
from app.repositories.bank import BankRepository
from fastapi import HTTPException

class ApplicationService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.repo = ApplicationRepository(session)
        self.business_repo = BusinessRepository(session)
        self.bank_repo = BankRepository(session)

    async def create_application(self, user_id: int, data: ApplicationCreate) -> ApplicationResponse:
        # User must have a business profile
        business = await self.business_repo.get_by_user_id(user_id)
        if not business:
            raise HTTPException(status_code=404, detail="Business profile not found")

        # Bank must exist
        bank = await self.bank_repo.get_by_id(data.bank_id)
        if not bank:
            raise HTTPException(status_code=404, detail="Bank not found")

        application = await self.repo.create_application(
            business_id=business.id,
            bank_id=data.bank_id,
            amount_requested=data.amount_requested,
            purpose=data.purpose
        )

        return self._to_response(application)

    async def get_business_applications(self, user_id: int) -> list[ApplicationResponse]:
        business = await self.business_repo.get_by_user_id(user_id)
        if not business:
            return []
        
        apps = await self.repo.get_by_business_id(business.id)
        return [self._to_response(app) for app in apps]

    async def get_bank_applications(self, user_id: int) -> list[ApplicationResponse]:
        bank = await self.bank_repo.get_by_user_id(user_id)
        if not bank:
            return []
            
        apps = await self.repo.get_by_bank_id(bank.id)
        return [self._to_response(app) for app in apps]

    # Admin functions
    async def get_pending_for_admin(self, admin_user_id: int) -> list[ApplicationResponse]:
        # Admin user validation can be done in endpoint; repository returns pending apps
        apps = await self.repo.get_pending_admin_applications()
        return [self._to_response(app) for app in apps]

    async def get_all_for_admin(self, admin_user_id: int) -> list[ApplicationResponse]:
        apps = await self.repo.get_all_applications()
        return [self._to_response(app) for app in apps]

    async def forward_application(self, admin_user_id: int, application_id: int, notes: str | None = None) -> ApplicationResponse:
        # No extra permissions check here; endpoint should ensure admin
        app = await self.repo.forward_application(application_id, admin_user_id, notes)
        if not app:
            raise HTTPException(status_code=404, detail="Application not found")
        return self._to_response(app)

    async def block_application(self, admin_user_id: int, application_id: int, blocked_reason: str | None = None, notes: str | None = None) -> ApplicationResponse:
        app = await self.repo.block_application(application_id, admin_user_id, blocked_reason, notes)
        if not app:
            raise HTTPException(status_code=404, detail="Application not found")
        return self._to_response(app)

    async def request_more_info(self, admin_user_id: int, application_id: int, notes: str | None = None) -> ApplicationResponse:
        app = await self.repo.request_more_info(application_id, admin_user_id, notes)
        if not app:
            raise HTTPException(status_code=404, detail="Application not found")
        return self._to_response(app)

    async def update_status(self, bank_user_id: int, application_id: int, status: ApplicationStatus) -> ApplicationResponse:
        bank = await self.bank_repo.get_by_user_id(bank_user_id)
        if not bank:
            raise HTTPException(status_code=403, detail="Not authorized as a bank")

        application = await self.repo.get_by_id(application_id)
        if not application:
            raise HTTPException(status_code=404, detail="Application not found")

        if application.bank_id != bank.id:
            raise HTTPException(status_code=403, detail="Not authorized to update this application")

        updated_app = await self.repo.update_status(application_id, status)
        return self._to_response(updated_app)

    async def withdraw_application(self, business_user_id: int, application_id: int) -> ApplicationResponse:
        business = await self.business_repo.get_by_user_id(business_user_id)
        if not business:
            raise HTTPException(status_code=403, detail="Not authorized as a business")

        application = await self.repo.get_by_id(application_id)
        if not application:
            raise HTTPException(status_code=404, detail="Application not found")

        if application.business_id != business.id:
            raise HTTPException(status_code=403, detail="Not authorized to withdraw this application")

        updated_app = await self.repo.update_status(application_id, ApplicationStatus.WITHDRAWN)
        return self._to_response(updated_app)

    def _to_response(self, app) -> ApplicationResponse:
        # Convert ORM to dictionary representation for Pydantic to avoid MissingGreenlet
        app_dict = {
            "id": app.id,
            "business_id": app.business_id,
            "bank_id": app.bank_id,
            "amount_requested": app.amount_requested,
            "purpose": app.purpose,
            "status": app.status,
            "created_at": app.created_at,
            "updated_at": app.updated_at,
            "reviewed_by_admin": getattr(app, 'reviewed_by_admin', None),
            "reviewed_at": getattr(app, 'reviewed_at', None),
            "admin_notes": getattr(app, 'admin_notes', None),
            "blocked_reason": getattr(app, 'blocked_reason', None),
            "forwarded_at": getattr(app, 'forwarded_at', None),
        }
        
        # Load relationships if they were eager loaded
        if 'business' in app.__dict__:
            from app.schemas.business import BusinessProfileResponse
            b = app.business
            if b:
                app_dict["business"] = {
                    "id": b.id, "user_id": b.user_id, "company_name": b.company_name, "industry": b.industry,
                    "business_type": b.business_type, "years_in_operation": b.years_in_operation,
                    "funding_goal": b.funding_goal, "funding_purpose": b.funding_purpose, "loan_type": b.loan_type,
                    "annual_revenue": b.annual_revenue, "annual_net_profit": b.annual_net_profit,
                    "existing_debt": b.existing_debt, "monthly_cash_flow": b.monthly_cash_flow,
                    "business_credit_score": b.business_credit_score, "employee_count": b.employee_count,
                    "country": b.country, "state": b.state, "city": b.city, "gst_registered": b.gst_registered,
                    "readiness_score": b.readiness_score, "ai_summary": b.ai_summary, "ai_business_advice": b.ai_business_advice
                }
                
        if 'bank' in app.__dict__:
            bk = app.bank
            if bk:
                app_dict["bank"] = {
                    "id": bk.id,
                    "user_id": bk.user_id,
                    "institution_name": bk.institution_name,
                    "institution_type": bk.institution_type,
                    "country": getattr(bk, 'country', None),
                    "city": getattr(bk, 'city', None)
                }

        return ApplicationResponse.model_validate(app_dict)
