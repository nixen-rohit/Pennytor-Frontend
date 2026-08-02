// data/sideData.tsx

import {
  Home,
  FileText,
  Wallet,
  CreditCard,
  ClipboardList,
  Mail,
  LucideIcon,
  History,
  Phone,
  CalendarClock,
  MessageSquareWarning,
  MessageCircleQuestionMark,
  GraduationCap,
  UserStar,
  UserCheck,
  FileBarChart,
  Building2Icon,
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
    ],
  },
  {
    id: "Investment",
    label: "Investment",
    items: [
      {
        id: "Futures Plans",
        label: "Futures Plans",
        href: "/comming-soon",
        icon: ClipboardList,
        badge: "4",
        children: [
          {
            id: "all-plans",
            label: "All Plans",
            href: "/",
            icon: History,
          },
          {
            id: "fixed-return",
            label: "Fixed Returns",
            href: "/",
            icon: Phone,
          },
          {
            id: "percentage-based",
            label: "Percentage Based",
            href: "/",
            icon: CalendarClock,
          },
          {
            id: "gulak",
            label: "Gulak",
            href: "/",
            icon: CalendarClock,
          },
        ],
      },

      {
        id: "stock",
        label: "Stock",
        href: "/comming-soon",
        icon: Mail,
        isNew: true,
      },
      {
        id: "Insurance",
        label: "Insurance",
        href: "/comming-soon",
        icon: MessageCircleQuestionMark,
        isNew: true,
      },
      {
        id: "Loan",
        label: "Loan",
        href: "/comming-soon",
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
        icon: Building2Icon,
      },

      {
        id: "fund",
        label: "Add Funds",
        href: "/funds/add-fund",
        icon: Wallet,
      },
      {
        id: "widthdrawal",
        label: "Withdrawal",
        href: "/funds/withdrawal-fund",
        icon: CreditCard,
      },

      {
        id: "transaction",
        label: "Transaction",
        href: "/funds/transactions",
        icon: FileText,
      },
    ],
  },

  {
    id: "reports",
    label: "Reports",
    items: [
      {
        id: "report",
        label: "Report",
        href: "/comming-soon",
        icon: FileBarChart,
      },
    ],
  },
];
