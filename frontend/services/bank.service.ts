import { api } from './api';

export interface BankRequirementsData {
  min_revenue?: number;
  max_debt_to_revenue_ratio?: number;
  min_years_in_business?: number;
  min_readiness_score?: number;
  preferred_industries?: string[];
  preferred_locations?: string[];
  gst_registered_only?: boolean;
}

export interface BankRegistrationData {
  institution_name: string;
  institution_type: string;
  country: string;
  city: string;
  loan_products: string[];
  min_interest_rate?: number;
  max_interest_rate?: number;
  min_loan_amount?: number;
  max_loan_amount?: number;
  requirements?: BankRequirementsData;
}

export const BankService = {
  async register(data: BankRegistrationData) {
    const response = await api.post('/bank/register', data);
    return response.data;
  },
  
  async getDashboard() {
    const response = await api.get('/bank/dashboard');
    return response.data;
  },
  
  async getMatches() {
    const response = await api.get('/bank/matches');
    return response.data;
  }
};
