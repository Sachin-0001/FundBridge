import { api } from './api';

export interface ApplicationCreate {
  bank_id: number;
  amount_requested: number;
  purpose: string;
}

export interface ApplicationResponse {
  id: number;
  business_id: number;
  bank_id: number;
  amount_requested: number;
  purpose: string;
  status: string;
  created_at: string;
  business?: any;
  bank?: any;
}

export const applicationService = {
  createApplication: async (data: ApplicationCreate): Promise<ApplicationResponse> => {
    const token = localStorage.getItem('token');
    const response = await api.post('/applications/', data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
  
  getBusinessApplications: async (): Promise<ApplicationResponse[]> => {
    const token = localStorage.getItem('token');
    const response = await api.get('/applications/business', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  getBankApplications: async (): Promise<ApplicationResponse[]> => {
    const token = localStorage.getItem('token');
    const response = await api.get('/applications/bank', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  updateApplicationStatus: async (applicationId: number, status: string): Promise<ApplicationResponse> => {
    const token = localStorage.getItem('token');
    const response = await api.put(`/applications/${applicationId}/status`, { status }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  withdrawApplication: async (applicationId: number): Promise<ApplicationResponse> => {
    const token = localStorage.getItem('token');
    const response = await api.put(`/applications/${applicationId}/withdraw`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};
