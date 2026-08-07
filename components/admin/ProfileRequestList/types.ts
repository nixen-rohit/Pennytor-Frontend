export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ProfileRequest {
  id: string;
  clientId: string;
  email: string;
  fullName: string;
  phone: string;
  submittedAt: Date;
  status: ReviewStatus;

  dob: string;
  gender: string;
  maritalStatus: string;
  selfie: string;

  aadhaarNumber: string;
  aadhaarFront: string;
  aadhaarBack: string;
  panNumber: string;
  panImage: string;
  signatureImage: string;

  accountHolderName: string;
  accountNumber: string;
  confirmAccountNumber: string;
  ifscCode: string;
  bankName: string;
  branchName: string;
  accountType: string;
  branchAddress: string;

  nomineeName: string;
  nomineeDob: string;
  nomineePhone: string;
  nomineeAadhaar: string;
}

export const initialProfileRequests: ProfileRequest[] = [
  {
    id: "1",
    clientId: "AB7K2M",
    email: "alok.rana@example.com",
    fullName: "ALOK KUMAR RANA",
    phone: "+91 98765 43210",
    submittedAt: new Date("2026-07-27T14:32:00"),
    status: "PENDING",
    dob: "15 Aug 1992",
    gender: "Male",
    maritalStatus: "Married",
    selfie: "/img/profile.png",
    aadhaarNumber: "4521 8963 7412",
    aadhaarFront: "/img/video-cover.png",
    aadhaarBack: "/img/cover.webp",
    panNumber: "ABCDE1234F",
    panImage: "/img/cover.webp",
    signatureImage: "/img/cover.webp",
    accountHolderName: "Alok Kumar Rana",
    accountNumber: "5020012456897",
    confirmAccountNumber: "5020012456897",
    ifscCode: "HDFC0001234",
    bankName: "HDFC Bank",
    branchName: "MG Road Branch",
    accountType: "Savings Account",
    branchAddress: "12 MG Road, Bengaluru, Karnataka - 560001",
    nomineeName: "Sangeeta Rana",
    nomineeDob: "22 Mar 1995",
    nomineePhone: "+91 91234 56780",
    nomineeAadhaar: "784512963014",
  },
  {
    id: "2",
    clientId: "QX9K3N8",
    email: "priya.sharma@example.com",
    fullName: "PRIYA SHARMA",
    phone: "+91 90045 11223",
    submittedAt: new Date("2026-07-26T09:15:00"),
    status: "PENDING",
    dob: "03 Jan 1998",
    gender: "Female",
    maritalStatus: "Single",
    selfie: "/img/profile.png",
    aadhaarNumber: "1123 4455 6789",
    aadhaarFront: "/img/video-cover.png",
    aadhaarBack: "/img/bankQr.png",
    panNumber: "RSTUV7890G",
    panImage: "/img/cover.webp",
    signatureImage: "/img/cover.webp",
    accountHolderName: "Priya Sharma",
    accountNumber: "30941278562",
    confirmAccountNumber: "30941278562",
    ifscCode: "SBIN0009876",
    bankName: "State Bank of India",
    branchName: "Park Street Branch",
    accountType: "Savings Account",
    branchAddress: "45 Park Street, Kolkata - 700016",
    nomineeName: "Ramesh Sharma",
    nomineeDob: "12 Apr 1968",
    nomineePhone: "+91 91234 89900",
    nomineeAadhaar: "2211 8899 4433",
  },
  {
    id: "3",
    clientId: "R4T7VW2",
    email: "rohit.verma@example.com",
    fullName: "ROHIT VERMA",
    phone: "+91 99887 66554",
    submittedAt: new Date("2026-07-25T16:45:00"),
    status: "APPROVED",
    dob: "22 Oct 1990",
    gender: "Male",
    maritalStatus: "Married",
    selfie: "/img/profile.png",
    aadhaarNumber: "7788 9900 1122",
    aadhaarFront: "/img/cover.webp",
    aadhaarBack: "/img/video-cover.png",
    panNumber: "PQRSW5678H",
    panImage: "/img/cover.webp",
    signatureImage: "/img/cover.webp",
    accountHolderName: "Rohit Verma",
    accountNumber: "40112233445",
    confirmAccountNumber: "40112233445",
    ifscCode: "ICIC0009988",
    bankName: "ICICI Bank",
    branchName: "Connaught Place",
    accountType: "Current Account",
    branchAddress: "Connaught Place, New Delhi - 110001",
    nomineeName: "Kavita Verma",
    nomineeDob: "05 Sep 1993",
    nomineePhone: "+91 95678 12345",
    nomineeAadhaar: "5566 7788 9910",
  },
  {
    id: "4",
    clientId: "M5N8P9",
    email: "ananya.patel@example.com",
    fullName: "ANANYA PATEL",
    phone: "+91 97765 43210",
    submittedAt: new Date("2026-07-24T11:20:00"),
    status: "REJECTED",
    dob: "17 May 1995",
    gender: "Female",
    maritalStatus: "Single",
    selfie: "/img/profile.png",
    aadhaarNumber: "3345 6678 9012",
    aadhaarFront: "/img/bankQr.png",
    aadhaarBack: "/img/cover.webp",
    panNumber: "MNOP2345J",
    panImage: "/img/cover.webp",
    signatureImage: "/img/cover.webp",
    accountHolderName: "Ananya Patel",
    accountNumber: "60011223344",
    confirmAccountNumber: "60011223344",
    ifscCode: "AXIS0007865",
    bankName: "Axis Bank",
    branchName: "Manek Chowk",
    accountType: "Current Account",
    branchAddress: "Manek Chowk, Ahmedabad",
    nomineeName: "Pankaj Patel",
    nomineeDob: "08 Nov 1965",
    nomineePhone: "+91 90123 45678",
    nomineeAadhaar: "6677 8899 0011",
  },
  {
    id: "5",
    clientId: "Z6X2Q4W",
    email: "vikram.singh@example.com",
    fullName: "VIKRAM SINGH",
    phone: "+91 98989 89898",
    submittedAt: new Date("2026-07-23T18:05:00"),
    status: "PENDING",
    dob: "29 Jan 1988",
    gender: "Male",
    maritalStatus: "Married",
    selfie: "/img/profile.png",
    aadhaarNumber: "2211 2233 4455",
    aadhaarFront: "/img/video-cover.png",
    aadhaarBack: "/img/cover.webp",
    panNumber: "DEFGH4567I",
    panImage: "/img/cover.webp",
    signatureImage: "/img/cover.webp",
    accountHolderName: "Vikram Singh",
    accountNumber: "44551236789",
    confirmAccountNumber: "44551236789",
    ifscCode: "PUNB0881234",
    bankName: "Punjab National Bank",
    branchName: "Sector 15",
    accountType: "Salary Account",
    branchAddress: "Sector 15, Chandigarh",
    nomineeName: "Meena Singh",
    nomineeDob: "02 Feb 1970",
    nomineePhone: "+91 94321 78899",
    nomineeAadhaar: "8899 0011 2233",
  },
];