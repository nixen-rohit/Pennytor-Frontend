import {
  User,
  Settings,
  LogOut,
  UserCog,
  type LucideIcon,
} from "lucide-react";

interface TopbarMenuItem {
  id: string;
  label: string;
  href?: string;
  icon: LucideIcon;
  type?: "link" | "logout";
}

interface TopbarConfig {
  homeHref?: string;
  menuItems: TopbarMenuItem[];
}

export const adminTopbar: TopbarConfig = {
  homeHref: "/admin",
  menuItems: [
    {
      id: "profile",
      label: "Profile",
      href: "/admin/profile",
      icon: UserCog,
    },
    {
      id: "settings",
      label: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
    { id: "logout", label: "Log out", icon: LogOut, type: "logout" },
  ],
};