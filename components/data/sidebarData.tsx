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
        id: "Discover Plans",
        label: "Discover Plans",
        href: "/discover-plans",
        icon: ClipboardList,
        badge: "4",
        children: [
          {
            id: "all-plans",
            label: "All Plans",
            href: "/all-plans",
            icon: History,
          },
          {
            id: "fixed-return",
            label: "Fixed Returns",
            href: "/fixed-return",
            icon: Phone,
          },
          {
            id: "percentage-based",
            label: "Percentage Based",
            href: "/percentage-based",
            icon: CalendarClock,
          },
          {
            id: "gulak",
            label: "Gulak",
            href: "/gulak",
            icon: CalendarClock,
          },
        ],
      },

      {
        id: "stock",
        label: "Stock",
        href: "/stock",
        icon: Mail,
        isNew: true,
      },
      {
        id: "Insurance",
        label: "Insurance",
        href: "/insurance",
        icon: MessageCircleQuestionMark,
        isNew: true,
      },
      {
        id: "Loan",
        label: "Loan",
        href: "/loan",
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
        label: "Referral Chain",
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
    label: "Finance & Accounts",
    items: [
      {
        id: "my-investment",
        label: "My Investment",
        href: "/investment/my-investment",
        icon: Building2Icon,
      },

      {
        id: "add-fund",
        label: "Add Fund",
        href: "/fund/add-fund",
        icon: Wallet,
      },
      {
        id: "widthdrawal",
        label: "Withdrawal",
        href: "/fund/widthdrawal",
        icon: CreditCard,
      },

      {
        id: "transaction",
        label: "Transaction",
        href: "/fund/transaction",
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
        href: "/reports",
        icon: FileBarChart,
      },
    ],
  },
];
