import {
  Wallet,
  CreditCard,
  LucideIcon,
  Mail,
  ListTodo,
  LayoutDashboard,
  FileText,
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
        icon: Mail,
      },
    ],
  },

  {
    id: "Accounts",
    label: "Accounts Request",
    items: [
      {
        id: "kyc-applications",
        label: "KYC Applications",
        href: "/admin/kyc/applications",
        icon: MdOutlineVerified,
        isNew: true,
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
        href: "/admin/finance/deposite-request",

        icon: Wallet,
      },
      {
        id: "widthdrawal",
        label: "Withdrawal",
        href: "/admin/finance/widthdrawal-request",
        icon: CreditCard,
      },
      {
        id: "finance-report",
        label: "Finance Report",
        href: "/admin/finance/reports",
        icon: FileText,
        isNew: true,
      },
    ],
  },
   
];
