import api from '@/lib/axios';

// Users
export const getUsersMe = async () => {
  const { data } = await api.get('/users/me');
  return data;
};

// Auth
export const login = async (formData: FormData) => {
  const { data } = await api.post('/login/access-token', formData);
  return data;
};

// Examples for future extensions:
// export const getLoans = async () => ...
// export const createLoan = async (loanData) => ...
