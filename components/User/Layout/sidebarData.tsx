import {
  Home,
  FileText,
  Wallet,
  HandCoins,
  ClipboardList,
  Mail,
  LucideIcon,
  PiggyBank,
  Landmark,
  CalendarClock,
  MessageSquareWarning,
  MessageCircleQuestionMark,
  GraduationCap,
  UserStar,
  UserCheck,
  ChartNoAxesCombined,
  School,
  Bell,
  CornerDownRight,
} from "lucide-react";
import { MdOutlineVerified } from "react-icons/md";
import { ListTodo } from 'lucide-react';

interface SubMenuItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  isNew?: boolean;
  isSoon?: boolean;
  External?: boolean;
  children?: SubMenuItem[];
}

interface MenuItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<any>;
  badge?: string;
  isNew?: boolean;
  isSoon?: boolean;
  External?: boolean;
  children?: SubMenuItem[];
}

interface MenuSection {
  id: string;
  label: string;
  items: MenuItem[];
}

export const menuData: MenuSection[] = [
  {
    id: "Dashboard",
    label: "Dashboard",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        href: "/dashboard",
        icon: Home,
      },
      {
        id: "notifications",
        label: "Notifications",
        href: "/notifications",
        badge: "4",
        icon: Bell,
      },
      {
        id: "to-do",
        label: "Task List",
        href: "/task-list",        
        icon: ListTodo,
      },
    ],
  },
  {
    id: "Investment",
    label: "Investment",
    items: [
      {
        id: "gullak",
        label: "Gullak ",
        href: "#",
        isSoon: true,
        icon: PiggyBank,
        children: [
          {
            id: "gullak",
            label: "Details",
            icon: CornerDownRight,
            href: "/investment/all-schemes/gullak-scheme",
          },
        ],
      },
      {
        id: "sip",
        label: "SIP For Child",
        href: "#",

        icon: School,

        isNew: true,
        children: [
          {
            id: "sip-details",
            label: "Details",
            href: "/investment/all-schemes/sip-for-child",
            icon: CornerDownRight,
          },
          {
            id: "sip-progress",
            label: "Progress",
            href: "/investment/all-schemes/sip-for-child/progress",
            icon: CornerDownRight,
          },
          {
            id: "sip-report",
            label: "Report",
            href: "/investment/all-schemes/sip-for-child/reports",
            icon: CornerDownRight,
          },
        ],
      },

      {
        id: "fixed-deposite",
        label: "Fixed Deposite",
        href: "#",

        icon: CalendarClock,
        isNew: true,
        children: [
          {
            id: "fixed-deposite",
            label: "Details",
            href: "/investment/all-schemes/fixed-deposite",
            icon: CornerDownRight,
          },
        ],
      },

      {
        id: "investment-fund-scheme",
        label: "Investment Fund ",
        href: "#",

        icon: Landmark,
        isNew: true,
        children: [
          {
            id: "investment-fund-scheme-details",
            label: "Details",
            href: "/investment/all-schemes/investment-fund",
            icon: CornerDownRight,
          },
          {
            id: "investment-fund-scheme-progress",
            label: "Progress",
            href: "/investment/all-schemes/investment-fund/progress",
            icon: CornerDownRight,
          },
          {
            id: "investment-fund-scheme-report",
            label: "Report",
            href: "/investment/all-schemes/investment-fund/reports",
            icon: CornerDownRight,
          },
        ],
      },

      {
        id: "stocks",
        label: "Stocks",
        href: "/investment/stocks",
        icon: Mail,
        isSoon: true,
      },
      {
        id: "Insurance",
        label: "Insurance",
        href: "/investment/insurance",
        icon: MessageCircleQuestionMark,
        isSoon: true,
      },
      {
        id: "Loan",
        label: "Loan",
        href: "/investment/loan",
        isSoon: true,
        icon: MessageSquareWarning,
      },
    ],
  },
  {
    id: "commission",
    label: "Commission ",
    items: [
      {
        id: "referral ",
        label: "Referral ",
        href: "/commission/referral",
        icon: GraduationCap,
      },
      {
        id: "referral-chain",
        label: "Referral Network",
        href: "/commission/referral-chain",
        icon: UserStar,
      },
    ],
  },
  {
    id: "Accounts",
    label: "Accounts",
    items: [
      {
        id: "profile",
        label: "Profile",
        href: "/profile",
        icon: MdOutlineVerified,
      },
      {
        id: "account-kyc",
        label: "Account ",
        href: "/account-kyc",
        icon: UserCheck,
      },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    items: [
      {
        id: "my-investment",
        label: "My Investment",
        href: "/funds",
        icon: ChartNoAxesCombined,
      },

      {
        id: "Deposite",
        label: "Deposite ",
        href: "/funds/deposite",
        icon: Wallet,
      },
      {
        id: "widthdrawal",
        label: "Withdrawal",
        href: "/funds/withdrawal",
        icon: HandCoins,
      },

      {
        id: "transaction",
        label: "Transaction",
        href: "/funds/transactions",
        icon: FileText,
      },
    ],
  },
];
