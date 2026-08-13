import { User, Upload, Landmark, Users, FileCheck } from "lucide-react";

export const PHASES = [
  { step: 1, title: "Identity data", icon: User },
  { step: 2, title: "Identity documents", icon: Upload },
  { step: 3, title: "Bank details", icon: Landmark },
  { step: 4, title: "Nominee details", icon: Users },
  { step: 5, title: "Final Review", icon: FileCheck },
] as const;

export interface FormState {
  fullName: string;
  phone: string;
  dob: Date | null;
  gender: string;
  maritalStatus: string;

  selfieFile: File | null;

  aadhaarNumber: string;
  aadhaarFrontFile: File | null;
  aadhaarBackFile: File | null;

  panNumber: string;
  panFile: File | null;

  signatureFile: File | null;

  accountHolderName: string;
  accountNumber: string;
  confirmAccountNumber: string;
  ifscCode: string;
  bankName: string;
  branchName: string;
  accountType: string;
  branchAddress: string;

  nomineeName: string;
  nomineeDob: Date | null;
  nomineePhone: string;
  nomineeAadhaar: string;
}

export const initialFormState: FormState = {
  fullName: "",
  phone: "",
  dob: null,
  gender: "",
  maritalStatus: "",

  selfieFile: null,

  aadhaarNumber: "",
  aadhaarFrontFile: null,
  aadhaarBackFile: null,

  panNumber: "",
  panFile: null,

  signatureFile: null,

  accountHolderName: "",
  accountNumber: "",
  confirmAccountNumber: "",
  ifscCode: "",
  bankName: "",
  branchName: "",
  accountType: "",
  branchAddress: "",

  nomineeName: "",
  nomineeDob: null,
  nomineePhone: "",
  nomineeAadhaar: "",
};
