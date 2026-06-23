import os
import json
from groq import AsyncGroq
import logging
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        # Initialize Groq client. It will automatically look for GROQ_API_KEY in the environment.
        # If not present, the user must set it.
        api_key = os.environ.get("GROQ_API_KEY")
        if not api_key:
            logger.warning("GROQ_API_KEY is not set. AI evaluation will return default values.")
            self.client = None
        else:
            self.client = AsyncGroq(api_key=api_key)

    async def analyze_business(self, business_data: dict) -> dict:
        """
        Analyzes the business profile and generates a readiness score and an AI summary.
        Returns a dict with 'readiness_score' and 'ai_summary'.
        """
        if not self.client:
            # Fallback if no API key is provided
            return {
                "readiness_score": 60,
                "ai_summary": "AI evaluation is disabled due to missing GROQ_API_KEY."
            }

        prompt = f"""
        You are an expert AI underwriting assistant for a business lending platform.
        Given the following business data, you must evaluate their "Funding Readiness Score" (0 to 100),
        provide a short 2-sentence summary (ai_summary) intended for lenders to read regarding their risk profile,
        and provide a short 2-sentence advice (ai_business_advice) intended for the business owner explaining where they stand and what could be done to increase their chances of getting more banks.

        Business Data:
        {json.dumps(business_data, indent=2)}

        Rules for Scoring:
        - High revenue, positive net profit, low debt, and more years in business should increase the score.
        - High debt, low revenue, or negative profit should decrease the score.
        - Being GST registered should give a small boost.
        
        Respond ONLY with a raw JSON object containing exactly three keys:
        - "readiness_score": an integer between 0 and 100
        - "ai_summary": a string containing the 2-sentence summary for lenders
        - "ai_business_advice": a string containing the 2-sentence advice for the business owner

        Do NOT wrap the JSON in Markdown formatting (no ```json ... ```). Output just the JSON.
        """

        try:
            response = await self.client.chat.completions.create(
                model="llama-3.1-8b-instant",  # Updated from decommissioned llama3-8b-8192
                messages=[
                    {"role": "system", "content": "You are a precise JSON-only financial API."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.1,
                max_tokens=256
            )
            
            result_text = response.choices[0].message.content.strip()
            
            # Clean up potential markdown formatting just in case
            if result_text.startswith("```json"):
                result_text = result_text[7:]
            if result_text.startswith("```"):
                result_text = result_text[3:]
            if result_text.endswith("```"):
                result_text = result_text[:-3]
                
            result_json = json.loads(result_text.strip())
            
            return {
                "readiness_score": int(result_json.get("readiness_score", 50)),
                "ai_summary": str(result_json.get("ai_summary", "Analyzed business profile.")),
                "ai_business_advice": str(result_json.get("ai_business_advice", "Consider reducing debt and increasing revenue to improve your chances of getting funded."))
            }
        except Exception as e:
            logger.error(f"Groq AI evaluation failed: {str(e)}")
            return {
                "readiness_score": 50,
                "ai_summary": "AI evaluation failed to complete.",
                "ai_business_advice": "AI evaluation failed. Keep your profile updated for better matches."
            }

    async def generate_full_report(self, business_data: dict) -> str:
        if not self.client:
            return "AI reporting is currently unavailable due to missing configuration."

        prompt = f"""
        Generate a comprehensive, structured funding readiness report for the following business:
        Company Name: {business_data.get('company_name')}
        Industry: {business_data.get('industry')}
        Years in Operation: {business_data.get('years_in_operation')}
        Annual Revenue: ${business_data.get('annual_revenue')}
        Annual Net Profit: ${business_data.get('annual_net_profit')}
        Existing Debt: ${business_data.get('existing_debt')}
        Monthly Cash Flow: ${business_data.get('monthly_cash_flow')}
        Credit Score: {business_data.get('business_credit_score')}
        Funding Goal: ${business_data.get('funding_goal')}
        Funding Purpose: {business_data.get('funding_purpose')}
        Loan Type: {business_data.get('loan_type')}

        Provide the report in Markdown format with the following sections:
        1. Executive Summary
        2. Financial Health Analysis
        3. Funding Readiness Assessment
        4. Key Strengths & Risk Factors
        5. Actionable Recommendations to Improve Funding Chances
        """
        try:
            response = await self.client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[
                    {"role": "system", "content": "You are an expert financial advisor and lending analyst who helps businesses optimize their profiles for bank loans."},
                    {"role": "user", "content": prompt}
                ]
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"Groq AI report generation failed: {str(e)}")
            return "Failed to generate report."
