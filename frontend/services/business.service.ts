import { api } from './api';

export enum BusinessType {
  PROPRIETORSHIP = "Proprietorship",
  PARTNERSHIP = "Partnership",
  LLP = "LLP",
  PRIVATE_LIMITED = "Private Limited",
  PUBLIC_LIMITED = "Public Limited"
}

export enum FundingPurpose {
  WORKING_CAPITAL = "Working Capital",
  BUSINESS_EXPANSION = "Business Expansion",
  EQUIPMENT_PURCHASE = "Equipment Purchase",
  INVENTORY = "Inventory",
  MARKETING = "Marketing",
  HIRING = "Hiring",
  TECHNOLOGY = "Technology",
  OTHER = "Other"
}

export enum LoanType {
  TERM_LOAN = "Term Loan",
  WORKING_CAPITAL_LOAN = "Working Capital Loan",
  LINE_OF_CREDIT = "Line of Credit",
  INVOICE_FINANCING = "Invoice Financing"
}

export interface BusinessRegistrationData {
  // Step 1
  company_name: string;
  industry: string;
  business_type: BusinessType;
  years_in_operation: number;
  
  // Step 2
  funding_goal: number;
  funding_purpose: FundingPurpose;
  loan_type: LoanType;
  
  // Step 3
  annual_revenue: number;
  annual_net_profit: number;
  existing_debt: number;
  monthly_cash_flow: number;
  business_credit_score: number;
  
  // Step 4
  employee_count: number;
  country: string;
  state: string;
  city: string;
  gst_registered: boolean;
}

export const BusinessService = {
  async register(data: BusinessRegistrationData) {
    const response = await api.post('/business/register', data);
    return response.data;
  },
  
  async getDashboard() {
    const response = await api.get('/business/dashboard');
    return response.data;
  },

  getMatches: async (): Promise<any> => {
    const token = localStorage.getItem('token');
    const response = await api.get('/business/matches', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  generateAiReport: async (): Promise<any> => {
    const token = localStorage.getItem('token');
    const response = await api.post('/business/generate-report', {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};
