import { FormState } from "@/components/User/KYC/types";
import {
  containsUnsafe,
  ACCOUNT_NUMBER_PATTERN,
  AADHAAR_PATTERN,
  IFSC_PATTERN,
  PAN_PATTERN,
  PHONE_PATTERN,
} from "@/utils/validation";

export type FieldErrors = Partial<Record<keyof FormState, string>>;

export function validateStep(step: number, data: FormState): FieldErrors {
  switch (step) {
    case 1: {
      const errs: FieldErrors = {};
      if (!data.fullName.trim()) errs.fullName = "Full name is required.";
      else if (containsUnsafe(data.fullName))
        errs.fullName = "Name contains invalid characters.";
      if (!data.dob) errs.dob = "Date of birth is required.";
      if (!PHONE_PATTERN.test(data.phone.replace(/\s/g, "")))
        errs.phone = "Enter a valid phone number.";
      if (data.selfieFile === null)
        errs.selfieFile = "Please upload your selfie photo.";
      return errs;
    }
    case 2: {
      const errs: FieldErrors = {};
      const aadhaar = data.aadhaarNumber.replace(/\s/g, "");
      if (!AADHAAR_PATTERN.test(aadhaar))
        errs.aadhaarNumber = "Enter a valid 12-digit Aadhaar number.";
      if (!data.aadhaarFrontFile)
        errs.aadhaarFrontFile = "Upload your Aadhaar front image.";
      if (!data.aadhaarBackFile)
        errs.aadhaarBackFile = "Upload your Aadhaar back image.";
      if (containsUnsafe(data.panNumber))
        errs.panNumber = "PAN number contains invalid characters.";
      else if (!PAN_PATTERN.test(data.panNumber.toUpperCase()))
        errs.panNumber = "Enter a valid PAN number.";
      if (!data.panFile) errs.panFile = "Upload your PAN card image.";
      if (!data.signatureFile)
        errs.signatureFile = "Upload your signature image.";
      return errs;
    }
    case 3: {
      const errs: FieldErrors = {};
      if (containsUnsafe(data.accountHolderName))
        errs.accountHolderName =
          "Account holder name contains invalid characters.";
      if (!ACCOUNT_NUMBER_PATTERN.test(data.accountNumber))
        errs.accountNumber = "Enter a valid 9–18 digit account number.";
      if (data.accountNumber !== data.confirmAccountNumber)
        errs.confirmAccountNumber = "Account numbers do not match.";
      if (containsUnsafe(data.ifscCode))
        errs.ifscCode = "IFSC code contains invalid characters.";
      else if (!IFSC_PATTERN.test(data.ifscCode.toUpperCase()))
        errs.ifscCode = "Enter a valid 11-character IFSC code.";
      if (containsUnsafe(data.bankName))
        errs.bankName = "Bank name contains invalid characters.";
      if (containsUnsafe(data.branchName))
        errs.branchName = "Branch name contains invalid characters.";
      return errs;
    }
    case 4: {
      const errs: FieldErrors = {};
      if (!data.nomineeName.trim()) errs.nomineeName = "Nominee name is required.";
      else if (containsUnsafe(data.nomineeName))
        errs.nomineeName = "Nominee name contains invalid characters.";
      if (!data.nomineeDob)
        errs.nomineeDob = "Nominee date of birth is required.";
      const aadhaar = data.nomineeAadhaar.replace(/\s/g, "");
      if (!AADHAAR_PATTERN.test(aadhaar))
        errs.nomineeAadhaar =
          "Enter a valid 12-digit nominee Aadhaar number.";
      return errs;
    }
    default:
      return {};
  }
}
