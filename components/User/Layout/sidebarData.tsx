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
} from "lucide-react";
import { MdOutlineVerified } from "react-icons/md";

interface SubMenuItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  isNew?: boolean;
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
    ],
  },
  {
    id: "Investment",
    label: "Investment",
    items: [
      {
        id: "all-schemes",
        label: "All Schemes",
        href: "/",
        icon: ClipboardList,
        badge: "4",
        children: [
          {
            id: "gullak",
            label: "Gullak Schemes",
            href: "/investment/all-schemes/gullak-scheme",
            icon: PiggyBank,
          },
          {
            id: "sip",
            label: "SIP Schemes",
            href: "/investment/all-schemes/sip-investment",
            icon: School,
          },
          {
            id: "fixed-deposite",
            label: "Fixed Deposite",
            href: "/investment/all-schemes/fixed-deposite",
            icon: CalendarClock,
          },
          {
            id: "investment-fund-scheme",
            label: "Investment Fund Scheme",
            href: "/investment/all-schemes/investment-fund",
            icon: Landmark,
          },
        ],
      },

      {
        id: "stocks",
        label: "Stocks",
        href: "/investment/stocks",
        icon: Mail,
        isNew: true,
      },
      {
        id: "Insurance",
        label: "Insurance",
        href: "/investment/insurance",
        icon: MessageCircleQuestionMark,
        isNew: true,
      },
      {
        id: "Loan",
        label: "Loan",
        href: "/investment/loan",
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
