import type { RegisterFormValues, RegisterFieldErrors } from "./RegisterTypes";

export function validateRegisterForm(
  values: RegisterFormValues,
): RegisterFieldErrors {
  const errors: RegisterFieldErrors = {};

  if (!values.firstName.trim()) {
    errors.firstName = "First name is required";
  }

  if (!values.lastName.trim()) {
    errors.lastName = "Last name is required";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!values.password) {
    errors.password = "Password is required";
  } else if (values.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (values.referralCode && values.referralCode.trim().length > 0 && values.referralCode.trim().length < 4) {
    errors.referralCode = "Referral code must be at least 4 characters";
  }

  if (!values.agreeToTerms) {
    errors.agreeToTerms = "You must agree to the terms and privacy policy";
  }

  return errors;
}

export function hasErrors(errors: RegisterFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}
