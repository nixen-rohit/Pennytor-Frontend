import { KycProfile } from "@/components/User/Profile/types";

export const profile: KycProfile = {
  name: "Noelani Williams",
  email: "akotrjhvg@index-mail.com",
  client_id: "A86AS6529ZX",
  kyc_status: "pending",
  rejection_reason: null,
  items: [
    {
      id: "identity",
      label: "Identity",
      description: "Selfie match against your government ID",
      state: "not_started",
    },
    {
      id: "pan",
      label: "PAN Verification",
      description: "Permanent Account Number cross-check",
      state: "not_started",
    },
    {
      id: "aadhar",
      label: "Aadhar Verification",
      description: "UIDAI e-KYC confirmation",
      state: "not_started",
    },
    {
      id: "bank",
      label: "Bank Details",
      description: "Penny-drop verification on your linked account",
      state: "not_started",
    },
    {
      id: "status",
      label: "Verfication Status",
      description: "Check all your verification status",
      state: "not_started",
    },
  ],
};
