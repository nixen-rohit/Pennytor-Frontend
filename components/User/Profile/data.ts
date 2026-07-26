import { KycProfile } from "@/components/User/Profile/types";

export const profile: KycProfile = {
  name: "Noelani Williams",
  email: "akotrjhvg@index-mail.com",
  initial: "N",
  kycPercent: 0,
  items: [
    {
      id: "identity",
      label: "Identity",
      description: "Selfie match against your government ID",
      state: "pending",
    },
    {
      id: "pan",
      label: "PAN Verification",
      description: "Permanent Account Number cross-check",
      state: "pending",
    },
    {
      id: "aadhar",
      label: "Aadhar Verification",
      description: "UIDAI e-KYC confirmation",
      state: "pending",
    },
    {
      id: "bank",
      label: "Bank Details",
      description: "Penny-drop verification on your linked account",
      state: "pending_approval",
    },
  ],
};
