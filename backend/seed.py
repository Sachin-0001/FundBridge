import asyncio
import os
import sys

# Ensure app is in path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database.session import AsyncSessionLocal
from app.models.user import User, UserRole
from app.schemas.business import BusinessProfileCreate, BusinessType, FundingPurpose, LoanType
from app.schemas.bank import BankProfileCreate, BankRequirementsBase
from app.services.business import BusinessService
from app.services.bank import BankService
from app.core.security import get_password_hash
from sqlalchemy.future import select

async def seed():
    async with AsyncSessionLocal() as db:
        # Create Users first
        print("Seeding Users...")
        pwd_hash = get_password_hash("12345678")
        
        businesses = [
            {
                "email": "business1a@gmail.com",
                "role": UserRole.BUSINESS,
                "profile": BusinessProfileCreate(
                    company_name="TechNova Solutions",
                    industry="Technology",
                    business_type=BusinessType.PRIVATE_LIMITED,
                    years_in_operation=5,
                    funding_goal=250000.0,
                    funding_purpose=FundingPurpose.WORKING_CAPITAL,
                    loan_type=LoanType.TERM_LOAN,
                    annual_revenue=1500000.0,
                    annual_net_profit=300000.0,
                    existing_debt=100000.0,
                    monthly_cash_flow=45000.0,
                    business_credit_score=750,
                    employee_count=45,
                    country="USA",
                    state="CA",
                    city="San Francisco",
                    gst_registered=True
                )
            },
            {
                "email": "business2a@gmail.com",
                "role": UserRole.BUSINESS,
                "profile": BusinessProfileCreate(
                    company_name="Atlas Manufacturing",
                    industry="Manufacturing",
                    business_type=BusinessType.PUBLIC_LIMITED,
                    years_in_operation=12,
                    funding_goal=1200000.0,
                    funding_purpose=FundingPurpose.EQUIPMENT_PURCHASE,
                    loan_type=LoanType.TERM_LOAN,
                    annual_revenue=8000000.0,
                    annual_net_profit=900000.0,
                    existing_debt=2000000.0,
                    monthly_cash_flow=200000.0,
                    business_credit_score=680,
                    employee_count=120,
                    country="USA",
                    state="TX",
                    city="Houston",
                    gst_registered=True
                )
            },
            {
                "email": "business3a@gmail.com",
                "role": UserRole.BUSINESS,
                "profile": BusinessProfileCreate(
                    company_name="Zenith Retail",
                    industry="Retail",
                    business_type=BusinessType.LLP,
                    years_in_operation=2,
                    funding_goal=500000.0,
                    funding_purpose=FundingPurpose.INVENTORY,
                    loan_type=LoanType.LINE_OF_CREDIT,
                    annual_revenue=900000.0,
                    annual_net_profit=50000.0,
                    existing_debt=300000.0,
                    monthly_cash_flow=15000.0,
                    business_credit_score=620,
                    employee_count=15,
                    country="USA",
                    state="NY",
                    city="New York",
                    gst_registered=False
                )
            }
        ]

        bank_data = {
            "email": "bank1@gmail.com",
            "role": UserRole.BANK,
            "profile": BankProfileCreate(
                institution_name="Global Finance Partners",
                institution_type="Commercial Bank",
                country="USA",
                city="New York",
                loan_products=["Term Loan", "Line of Credit", "Equipment Financing"],
                min_interest_rate=5.5,
                max_interest_rate=14.0,
                min_loan_amount=100000.0,
                max_loan_amount=5000000.0,
                requirements=BankRequirementsBase(
                    min_revenue=1000000.0,
                    max_debt_to_revenue_ratio=0.4,
                    min_years_in_business=3,
                    min_readiness_score=60,
                    preferred_industries=["Technology", "Manufacturing", "Healthcare"],
                    preferred_locations=["San Francisco", "New York", "Houston", "USA"],
                    gst_registered_only=True
                )
            )
        }

        # Seed Businesses
        for b in businesses:
            result = await db.execute(select(User).where(User.email == b["email"]))
            user = result.scalars().first()
            if not user:
                user = User(email=b["email"], password_hash=pwd_hash, role=b["role"], is_verified=True)
                db.add(user)
                await db.commit()
                await db.refresh(user)
            
            # Register profile
            b_svc = BusinessService(db)
            try:
                await b_svc.register_business(user.id, b["profile"])
                print(f"Registered business profile for {b['email']}")
            except Exception as e:
                print(f"Skipping profile for {b['email']}: {e}")

        # Seed Bank
        result = await db.execute(select(User).where(User.email == bank_data["email"]))
        user = result.scalars().first()
        if not user:
            user = User(email=bank_data["email"], password_hash=pwd_hash, role=bank_data["role"], is_verified=True)
            db.add(user)
            await db.commit()
            await db.refresh(user)
            
        bank_svc = BankService(db)
        try:
            await bank_svc.register_bank(user.id, bank_data["profile"])
            print(f"Registered bank profile for {bank_data['email']}")
        except Exception as e:
            print(f"Skipping profile for {bank_data['email']}: {e}")
            
        print("Done seeding.")

if __name__ == "__main__":
    asyncio.run(seed())
