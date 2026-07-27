import { User, Upload, Landmark, Users } from "lucide-react";

export const PHASES = [
  { step: 1, title: "Personal Info", icon: User },
  { step: 2, title: "Upload Document", icon: Upload },
  { step: 3, title: "Bank Details", icon: Landmark },
  { step: 4, title: "Nominee", icon: Users },
] as const;

export interface FormState {
  fullName: string;
  dob: string;
  gender: string;
  maritalStatus: string;

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
  nomineeRelation: string;
  nomineeDob: string;
  nomineePhone: string;
  nomineeAadhaar: string;
  nomineeAllocation: string;
}

export const initialFormState: FormState = {
  fullName: "",
  dob: "",
  gender: "",
  maritalStatus: "",

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
  nomineeRelation: "",
  nomineeDob: "",
  nomineePhone: "",
  nomineeAadhaar: "",
  nomineeAllocation: "",
};
