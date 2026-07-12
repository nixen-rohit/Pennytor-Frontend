export interface LoginFormValues {
  email: string;
  password: string;
}

export interface LoginFieldErrors {
  email?: string;
  password?: string;
}

export interface LoginState {
  formLoading: boolean;
  errorMsg: string;
  showPassword: boolean;
  keepSignedIn: boolean;
}
