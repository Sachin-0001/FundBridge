from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.schemas.business import BusinessProfileCreate, BusinessProfileResponse
from app.services.business import BusinessService
from app.api import deps
from app.models.user import User

router = APIRouter()

@router.post("/register", response_model=dict)
async def register_business(
    data: BusinessProfileCreate, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    try:
        service = BusinessService(db)
        business = await service.register_business(current_user.id, data)
        return {"success": True, "message": "Business registered successfully", "data": business}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

from app.schemas.match import MatchResponse
from typing import List

@router.get("/dashboard", response_model=dict)
async def get_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    service = BusinessService(db)
    business = await service.get_dashboard(current_user.id)
    if not business:
        raise HTTPException(status_code=404, detail="Business profile not found")
    return {"success": True, "message": "Dashboard data retrieved", "data": business}

@router.get("/matches", response_model=dict)
async def get_matches(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    service = BusinessService(db)
    business = await service.get_dashboard(current_user.id)
    if not business:
        raise HTTPException(status_code=404, detail="Business profile not found")
        
    from app.repositories.match import MatchRepository
    match_repo = MatchRepository(db)
    matches = await match_repo.get_by_business_id(business.id)
    
    matches_data = [MatchResponse.model_validate(m).model_dump() for m in matches]
    return {"success": True, "message": "Matches retrieved successfully", "data": matches_data}

import os
from groq import AsyncGroq
from dotenv import load_dotenv

@router.post("/generate-report", response_model=dict)
async def generate_ai_report(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    service = BusinessService(db)
    business = await service.get_dashboard(current_user.id)
    if not business:
        raise HTTPException(status_code=404, detail="Business profile not found")

    load_dotenv()
    groq_api_key = os.getenv("GROQ_API_KEY")
    if not groq_api_key:
        raise HTTPException(status_code=500, detail="GROQ API key not configured")

    client = AsyncGroq(api_key=groq_api_key)

    prompt = f"""
    Generate a comprehensive, structured funding readiness report for the following business:
    Company Name: {business.company_name}
    Industry: {business.industry}
    Years in Operation: {business.years_in_operation}
    Annual Revenue: ${business.annual_revenue}
    Annual Net Profit: ${business.annual_net_profit}
    Existing Debt: ${business.existing_debt}
    Monthly Cash Flow: ${business.monthly_cash_flow}
    Credit Score: {business.business_credit_score}
    Funding Goal: ${business.funding_goal}
    Funding Purpose: {business.funding_purpose}
    Loan Type: {business.loan_type}

    Provide the report in Markdown format with the following sections:
    1. Executive Summary
    2. Financial Health Analysis
    3. Funding Readiness Assessment
    4. Key Strengths & Risk Factors
    5. Actionable Recommendations to Improve Funding Chances
    """

    try:
        chat_completion = await client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert financial advisor and lending analyst who helps businesses optimize their profiles for bank loans."
                },
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="llama-3.1-8b-instant",
        )
        report_content = chat_completion.choices[0].message.content
        
        db_business = await service.repo.get_by_user_id(current_user.id)
        if db_business:
            db_business.ai_report = report_content
            await db.commit()
            
        return {"success": True, "data": {"report": report_content}}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from pydantic import BaseModel
from typing import List, Dict

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage] = []

@router.post("/chat", response_model=dict)
async def chat_with_ai(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    service = BusinessService(db)
    business = await service.get_dashboard(current_user.id)
    if not business:
        raise HTTPException(status_code=404, detail="Business profile not found")

    load_dotenv()
    groq_api_key = os.getenv("GROQ_API_KEY")
    if not groq_api_key:
        raise HTTPException(status_code=500, detail="GROQ API key not configured")

    client = AsyncGroq(api_key=groq_api_key)

    system_prompt = f"""
    You are an AI Funding Advisor for FundBridge, talking directly to a business owner.
    Use this business profile context to answer their questions accurately and helpfully.
    Keep your answers concise, professional, and directly relevant to their funding situation.
    Do NOT use markdown headers unless necessary. Use bullet points and paragraphs.

    Business Context:
    Company: {business.company_name} ({business.industry})
    Years in Operation: {business.years_in_operation}
    Revenue: ${business.annual_revenue} | Profit: ${business.annual_net_profit}
    Debt: ${business.existing_debt} | Cash Flow: ${business.monthly_cash_flow}
    Credit Score: {business.business_credit_score}
    Goal: ${business.funding_goal} for {business.funding_purpose} ({business.loan_type})
    """

    messages = [{"role": "system", "content": system_prompt}]
    
    for msg in request.history:
        messages.append({"role": msg.role, "content": msg.content})
        
    messages.append({"role": "user", "content": request.message})

    try:
        chat_completion = await client.chat.completions.create(
            messages=messages,
            model="llama-3.1-8b-instant",
            temperature=0.7,
            max_tokens=500
        )
        reply = chat_completion.choices[0].message.content
        return {"success": True, "reply": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


