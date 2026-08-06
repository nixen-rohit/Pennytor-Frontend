import { User, Settings, LogOut, type LucideIcon } from "lucide-react";

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

export const userTopbar: TopbarConfig = {
  homeHref: "/dashboard",
  menuItems: [
    { id: "profile", label: "Profile", href: "/profile", icon: User },
    {
      id: "settings",
      label: "Settings",
      href: "/profile/settings",
      icon: Settings,
    },
    { id: "logout", label: "Log out", icon: LogOut, type: "logout" },
  ],
};