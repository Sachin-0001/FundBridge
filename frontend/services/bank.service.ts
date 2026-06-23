import { api } from './api';

export interface BankRequirementsData {
  min_revenue?: number;
  max_loan_amount?: number;
  preferred_industries?: string[];
}

export interface BankRegistrationData {
  institution_name: string;
  website?: string;
  contact_email: string;
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
  }
};
