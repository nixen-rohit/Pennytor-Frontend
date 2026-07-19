import { fetchApi } from './api';

export const OtpService = {
  /**
   * Verify the OTP code sent to the user's email after registration.
   * Backend endpoint: POST /auth/verify-email
   */
  verifyOtp: async (data: { email: string; otp: string }) => {
    return fetchApi('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Resend a new OTP code to the user's email.
   * Backend endpoint: POST /auth/resend-otp
   */
  resendOtp: async (data: { email: string }) => {
    return fetchApi('/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
