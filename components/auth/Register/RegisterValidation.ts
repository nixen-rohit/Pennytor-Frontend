import type { RegisterFormValues, RegisterFieldErrors } from "./RegisterTypes";

export function validateRegisterForm(
  values: RegisterFormValues,
): RegisterFieldErrors {
  const errors: RegisterFieldErrors = {};

  // First Name
  if (!values.firstName.trim()) {
    errors.firstName = "First name is required.";
  } else if (values.firstName.trim().length < 2) {
    errors.firstName = "First name must be at least 2 characters.";
  } else if (values.firstName.trim().length > 50) {
    errors.firstName = "First name must not exceed 50 characters.";
  }

  // Last Name
  if (!values.lastName.trim()) {
    errors.lastName = "Last name is required.";
  } else if (values.lastName.trim().length < 2) {
    errors.lastName = "Last name must be at least 2 characters.";
  } else if (values.lastName.trim().length > 50) {
    errors.lastName = "Last name must not exceed 50 characters.";
  }

  // Email
  if (!values.email.trim()) {
    errors.email = "Email address is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Please enter a valid email address (e.g. user@example.com).";
  }

  // Password — min 8 chars, uppercase, lowercase, number, special char
  if (!values.password) {
    errors.password = "Password is required.";
  } else if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters long.";
  } else if (!/[A-Z]/.test(values.password)) {
    errors.password = "Password must include at least one uppercase letter (A–Z).";
  } else if (!/[a-z]/.test(values.password)) {
    errors.password = "Password must include at least one lowercase letter (a–z).";
  } else if (!/[0-9]/.test(values.password)) {
    errors.password = "Password must include at least one number (0–9).";
  } else if (!/[!@#$%^&*()\-_=+\[\]{};:'",.<>/?\\|`~]/.test(values.password)) {
    errors.password = "Password must include at least one special character (e.g. @, #, $, !).";
  }

  // Referral Code (optional — only validate if filled in)
  if (values.referralCode && values.referralCode.trim().length > 0 && values.referralCode.trim().length < 4) {
    errors.referralCode = "Referral code must be at least 4 characters.";
  }

  // Terms & Conditions
  if (!values.agreeToTerms) {
    errors.agreeToTerms = "You must accept the Terms of Service and Privacy Policy to continue.";
  }

  return errors;
}

export function hasErrors(errors: RegisterFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}
