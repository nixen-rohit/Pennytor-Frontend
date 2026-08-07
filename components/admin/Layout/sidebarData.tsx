import {
  FileText,
  Wallet,
  CreditCard,
  ClipboardList,
  LucideIcon,
  PiggyBank,
  Mail  ,
  CalendarClock,
  School,
  LayoutDashboard,
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

export const adminNav: MenuSection[] = [
  {
    id: "Dashboard",
    label: "Dashboard",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    id: "Contact",
    label: "Contact Us",
    items: [
      {
        id: "contact",
        label: "Contact",
        href: "/admin/contact-us",
        icon: Mail ,
      },
    ],
  },

  {
    id: "Accounts",
    label: "Accounts Kyc Request",
    items: [
      {
        id: "profile",
        label: "Profile",
        href: "/admin/request/profile",
        icon: MdOutlineVerified,
      },
    ],
  },
  {
    id: "finance",
    label: "Finance Request",
    items: [
      {
        id: " Deposite ",
        label: "Deposite",
        href: "/admin/request/deposite-fund",

        icon: Wallet,
      },
      {
        id: "widthdrawal",
        label: "Withdrawal",
        href: "/admin/request/withdrawal-fund",
        icon: CreditCard,
      },

      {
        id: "transaction",
        label: "Transaction",
        href: "/admin/request/transaction",
        icon: FileText,
      },
    ],
  },
];
