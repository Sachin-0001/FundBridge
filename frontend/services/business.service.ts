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
  preferred_tenure_min?: number;
  preferred_tenure_max?: number;
  
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
  },

  sendChatMessage: async (message: string, history: any[]): Promise<any> => {
    const token = localStorage.getItem('token');
    const response = await api.post('/business/chat', { message, history }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  uploadDocument: async (documentType: string, file: File): Promise<any> => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('document_type', documentType);
    formData.append('file', file);
    const response = await api.post('/business/documents', formData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  replaceDocument: async (documentId: number, file: File): Promise<any> => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.put(`/business/documents/${documentId}`, formData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  deleteDocument: async (documentId: number): Promise<any> => {
    const token = localStorage.getItem('token');
    const response = await api.delete(`/business/documents/${documentId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  downloadDocument: async (documentId: number, fileName: string): Promise<void> => {
    const token = localStorage.getItem('token');
    const response = await api.get(`/business/documents/${documentId}/download`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob'
    });
    
    // Create a blob URL and download
    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
};
