import { fetchApi } from './api';

export const AuthService = {
  login: async (data: any) => {
    return fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  forgotPassword: async (data: any) => {
    return fetchApi('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  register: async (data: any) => {
    return fetchApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  resetPassword: async (data: any) => {
    return fetchApi('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
};
