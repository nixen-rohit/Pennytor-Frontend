import { Users, TreePine } from "lucide-react";

 
export interface ReferralUser {
  id: string;
  fullName: string;
  email: string;
  isActive: boolean;
  isApproved: boolean;
  kycStatus: "Pending" | "Verified" | "Rejected" | "Not Submitted";
  createdAt: Date;
  commission: number;
  level: number;
}

export interface CommissionRecord {
  id: string;
  fromUser: string;
  amount: number;
  level: number;
  percentage: number;
  date: Date;
  status: "Pending" | "Cleared" | "Cancelled";
}

export interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  totalCommission: number;
  pendingCommission: number;
  clearedCommission: number;
  thisMonthReferrals: number;
  thisMonthCommission: number;
}

export interface ReferralTreeData {
  id: string;
  name: string;
  earnings: number;
  children?: ReferralTreeData[];
}

export interface ReferralState {
  stats: ReferralStats;
  referrals: ReferralUser[];
  commissions: CommissionRecord[];
  treeData: ReferralTreeData;
}

export const initialReferralState: ReferralState = {
  stats: {
    totalReferrals: 0,
    activeReferrals: 0,
    totalCommission: 0,
    pendingCommission: 0,
    clearedCommission: 0,
    thisMonthReferrals: 0,
    thisMonthCommission: 0,
  },
  referrals: [
    {
      id: "1",
      fullName: "Aarav Sharma",
      email: "aarav.sharma@example.com",
      isActive: true,
      isApproved: true,
      kycStatus: "Verified",
      createdAt: new Date("2026-01-12"),
      commission: 52,
      level: 1,
    },
    {
      id: "2",
      fullName: "Priya Nair",
      email: "priya.nair@example.com",
      isActive: true,
      isApproved: false,
      kycStatus: "Pending",
      createdAt: new Date("2026-02-03"),
      commission: 850,
      level: 1,
    },
    {
      id: "3",
      fullName: "Rohan Verma",
      email: "rohan.verma@example.com",
      isActive: false,
      isApproved: true,
      kycStatus: "Rejected",
      createdAt: new Date("2026-03-18"),
      commission: 0,
      level: 0,
    },
    {
      id: "4",
      fullName: "Sneha Iyer",
      email: "sneha.iyer@example.com",
      isActive: true,
      isApproved: true,
      kycStatus: "Not Submitted",
      createdAt: new Date("2026-04-25"),
      commission: 2100,
      level: 1,
    },
    {
      id: "5",
      fullName: "Kabir Mehta",
      email: "kabir.mehta@example.com",
      isActive: false,
      isApproved: false,
      kycStatus: "Pending",
      createdAt: new Date("2026-05-09"),
      commission: 450,
      level: 2,
    },
    {
      id: "6",
      fullName: "Ananya Gupta",
      email: "ananya.gupta@example.com",
      isActive: true,
      isApproved: true,
      kycStatus: "Verified",
      createdAt: new Date("2026-06-15"),
      commission: 3200,
      level: 1,
    },
    {
      id: "7",
      fullName: "Vikram Singh",
      email: "vikram.singh@example.com",
      isActive: true,
      isApproved: true,
      kycStatus: "Verified",
      createdAt: new Date("2026-07-01"),
      commission: 1780,
      level: 3,
    },
  ],
  commissions: [
    {
      id: "c1",
      fromUser: "Aarav Sharma",
      amount: 500,
      level: 1,
      percentage: 5,
      date: new Date("2026-07-15"),
      status: "Cleared",
    },
    {
      id: "c2",
      fromUser: "Priya Nair",
      amount: 350,
      level: 1,
      percentage: 5,
      date: new Date("2026-07-14"),
      status: "Pending",
    },
    {
      id: "c3",
      fromUser: "Ananya Gupta",
      amount: 1200,
      level: 1,
      percentage: 5,
      date: new Date("2026-07-10"),
      status: "Cleared",
    },
    {
      id: "c4",
      fromUser: "Vikram Singh (L2)",
      amount: 150,
      level: 2,
      percentage: 2,
      date: new Date("2026-07-08"),
      status: "Cleared",
    },
    {
      id: "c5",
      fromUser: "Sneha Iyer",
      amount: 800,
      level: 1,
      percentage: 5,
      date: new Date("2026-07-05"),
      status: "Pending",
    },
    {
      id: "c6",
      fromUser: "Kabir Mehta (L2)",
      amount: 200,
      level: 2,
      percentage: 2,
      date: new Date("2026-07-01"),
      status: "Cancelled",
    },
  ],
  treeData: {
    id: "root",
    name: "You",
    earnings: 0,
    children: [
      {
        id: "1",
        name: "Aarav Sharma",
        earnings: 1200,
        children: [
          {
            id: "3",
            name: "Rohan Verma",
            earnings: 0,
            children: [{ id: "7", name: "Vikram Singh", earnings: 1780 }],
          },
        ],
      },
      {
        id: "2",
        name: "Priya Nair",
        earnings: 850,
      },
      {
        id: "4",
        name: "Sneha Iyer",
        earnings: 2100,
      },
      {
        id: "6",
        name: "Ananya Gupta",
        earnings: 3200,
      },
    ],
  },
};
