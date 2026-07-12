export interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  agreeToTerms: boolean;
  subscribeNewsletter: boolean;
}

export interface RegisterFieldErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  agreeToTerms?: string;
}

export interface RegisterState {
  formLoading: boolean;
  errorMsg: string;
  showPassword: boolean;
}
