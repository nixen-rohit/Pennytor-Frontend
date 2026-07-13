import { fetchApi } from './api';

export const OtpService = {
  verifyOtp: async (data: { email: string; otp: string }) => {
    return fetchApi('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  resendOtp: async (data: { email: string }) => {
    return fetchApi('/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
