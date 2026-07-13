export interface RegisteredOtpFormValues {
  otp: string;
}

export interface RegisteredOtpFieldErrors {
  otp?: string;
}

export interface RegisteredOtpState {
  formLoading: boolean;
  errorMsg: string;
}
