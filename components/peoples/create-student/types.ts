export interface FormState {
  admissionNo: string;
  admissionDate: Date;
  studentClass: string;
  rollNo: string;
  discount: string;

  aadharNo: string;
  penNumber: string;
  firstName: string;
  lastName: string;
  gender: string;
  dob: Date | undefined;
  bloodGroup: string;
  house: string;
  activity: string;
  religion: string;
  category: string;
  caste: string;
  nationality: string;
  isRte: boolean;
  hasSibling: boolean;

  primaryMobile: string;
  email: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;

  photoFile: File | null;
  docFile: File | null;
}
