import asyncio
from app.schemas.business import BusinessProfileCreate, BusinessType, FundingPurpose, LoanType

data = {
  "company_name": "Test Co",
  "industry": "Tech",
  "business_type": BusinessType.PRIVATE_LIMITED,
  "years_in_operation": 5,
  "funding_goal": 500000,
  "funding_purpose": FundingPurpose.WORKING_CAPITAL,
  "loan_type": LoanType.TERM_LOAN,
  "annual_revenue": 1000000,
  "annual_net_profit": 200000,
  "existing_debt": 0,
  "monthly_cash_flow": 50000,
  "business_credit_score": 750,
  "employee_count": 25,
  "country": "USA",
  "state": "CA",
  "city": "SF",
  "gst_registered": True
}
profile = BusinessProfileCreate(**data)
print("Pydantic validation passed")
