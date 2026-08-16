"use client";
import { usePathname, useRouter } from "next/navigation";

import {
  Menu,
  Search,
  Bell,
  Settings,
  User,
  ChevronDown,
  Home,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Link from "next/link";
import { AuthService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

export interface TopbarMenuItem {
  id: string;
  label: string;
  href?: string;
  icon: LucideIcon;
  type?: "link" | "logout";
}

export interface TopbarConfig {
  homeHref?: string;
  menuItems: TopbarMenuItem[];
}

const defaultConfig: TopbarConfig = {
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

export default function TopNav({ config = defaultConfig }: { config?: TopbarConfig }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const pathSegments = pathname
    .split("/")
    .filter(Boolean)
    .map((segment) =>
      segment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
    );
  const handleMenuToggle = () => {
    if (typeof window !== "undefined" && (window as any).toggleMenuState) {
      (window as any).toggleMenuState();
    }
  };

  const handleMobileMenuToggle = () => {
    if (typeof window !== "undefined" && (window as any).setIsMobileMenuOpen) {
      const currentState = (window as any).isMobileMenuOpen || false;
      (window as any).setIsMobileMenuOpen(!currentState);
    }
  };

  const handleLogout = async () => {
    useAuthStore.getState().setLogoutRedirect("/");
    await AuthService.logout().catch(() => {});
    clearAuth();
    router.push("/");
  };

  return (
    <div className="flex items-center justify-between h-full px-4 lg:px-6">
      {/* Left side - Menu toggle and Breadcrumbs */}
      <div className="flex items-center space-x-4">
        {/* Desktop Menu Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleMenuToggle}
          className="hidden lg:flex p-2"
          title="Toggle Menu"
        >
          <Menu className="h-4 w-4" />
        </Button>

        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleMobileMenuToggle}
          className="lg:hidden p-2"
          title="Toggle Mobile Menu"
        >
          <Menu className="h-4 w-4" />
        </Button>

        {/* Breadcrumbs */}
        <nav className="hidden sm:flex items-center space-x-2 text-sm text-gray-300">
          <Link
            href={config.homeHref || "/dashboard"}
            className="flex items-center hover:text-white"
          >
            <Home className="h-4 w-4 mr-1" />
            Home
          </Link>

          {pathSegments.map((segment, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span>/</span>

              <span
                className={
                  index === pathSegments.length - 1
                    ? "text-white font-medium"
                    : ""
                }
              >
                {segment}
              </span>
            </div>
          ))}
        </nav>
      </div>

       

      {/* Right side - Actions and Profile */}
      <div className="flex items-center space-x-5">
         

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center space-x-2 p-2 "
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="/img/profile.png" alt="User" />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="hidden lg:flex flex-col items-start">
                <span className="text-sm font-medium text-white">
                  {user?.firstName} {user?.lastName}
                </span>
                <span className="text-xs text-gray-400">
                  {user?.role === "ADMIN" ? "Administrator" : "User"}
                </span>
              </div>
              <ChevronDown className="hidden lg:block h-4 w-4 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-black border border-white/20 "
          >
            {config.menuItems.map((item, index) => (
              <span key={item.id}>
                {item.type === "logout" && index > 0 && (
                  <DropdownMenuSeparator className="border-b border-white/20" />
                )}
                {item.type === "logout" ? (
                  <DropdownMenuItem
                    className="text-red-600/70 hover:bg-red-600 hover:text-white cursor-pointer text-sm"
                    onClick={handleLogout}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    asChild
                    className=" hover:bg-neutral-800 text-white "
                  >
                    <Link href={item.href || "#"}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                )}
              </span>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}