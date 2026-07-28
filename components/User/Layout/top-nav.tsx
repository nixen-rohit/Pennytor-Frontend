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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Link from "next/link";
import { AuthService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

export default function TopNav() {
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
            href="/dashboard"
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

      {/* Center - Search (hidden on mobile) */}
      <div className="hidden md:flex flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-10 bg-gray-800 border-gray-700"
          />
        </div>
      </div>

      {/* Right side - Actions and Profile */}
      <div className="flex items-center space-x-5">
        {/* Mobile Search */}
        <Button variant="ghost" size="sm" className="md:hidden p-2">
          <Search className="h-4 w-4" />
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative p-2">
          <Bell className="h-4 w-4" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white">
            3
          </Badge>
        </Button>

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
            <DropdownMenuItem
              asChild
              className=" hover:bg-neutral-800 text-white "
            >
              <Link href="/profile">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              className=" hover:bg-neutral-800   text-white"
            >
              <Link href="/profile/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="border-b border-white/20" />
            <DropdownMenuItem
              className="text-red-600/70 hover:bg-red-600 hover:text-white cursor-pointer text-sm"
              onClick={async () => {
                await AuthService.logout({ all: true }).catch(() => {});
                clearAuth();
                router.push("/login");
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
