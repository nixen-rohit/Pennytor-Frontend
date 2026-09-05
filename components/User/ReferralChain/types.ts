
export interface ReferralUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  ownReferralCode: string;
  userType: string;
  referralEligible: boolean;
  createdAt: string;
}

export interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  thisMonthReferrals: number;
}

export interface ReferralTreeData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  ownReferralCode: string;
  userType: string;
  referralEligible: boolean;
  createdAt: string;
  referrals: ReferralTreeData[];
}

export interface ReferralState {
  stats: ReferralStats;
  referrals: ReferralUser[];
  treeData: ReferralTreeData[];
  myCode: string;
}

export const initialReferralState: ReferralState = {
  stats: {
    totalReferrals: 0,
    activeReferrals: 0,
    thisMonthReferrals: 0,
  },
  referrals: [],
  treeData: [],
  myCode: "",
};
