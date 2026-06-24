import { api } from './api';

export interface BankRequirementsData {
  min_revenue?: number;
  max_debt_to_revenue_ratio?: number;
  min_years_in_business?: number;
  preferred_industries?: string[];
  preferred_locations?: string[];
  gst_registered_only?: boolean;
}

export interface BankRegistrationData {
  institution_name: string;
  institution_type: string;
  city: string;
  loan_products: string[];
  min_interest_rate?: number;
  max_interest_rate?: number;
  min_loan_amount?: number;
  max_loan_amount?: number;
  min_loan_tenor?: number;
  max_loan_tenor?: number;
  requirements?: BankRequirementsData;
  document_requirements?: string[];
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
  },

  async downloadBusinessDocument(businessId: number, documentId: number, fileName: string) {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:8000/api/v1/bank/business/${businessId}/documents/${documentId}/download`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to download document');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
};
