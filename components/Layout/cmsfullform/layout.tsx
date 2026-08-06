"use client";

import type { ReactNode } from "react";
import Sidebar from "@/components/Layout/Sidebar/sidebar";
import TopNav, {
  type TopbarConfig,
} from "@/components/Layout/Topbar/top-nav";
import type { MenuSection } from "@/components/Layout/Sidebar/sidebar";

import { useEffect, useState } from "react";

interface LayoutProps {
  children: ReactNode;
  menuData: MenuSection[];
  topbar?: TopbarConfig;
}

export default function Layout({ children, menuData, topbar }: LayoutProps) {

  const [mounted, setMounted] = useState(false);
  const [menuState, setMenuState] = useState<"full" | "collapsed" | "hidden">(
    "full",
  );
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Listen for menu state changes and hover state
  useEffect(() => {
    const checkMenuState = () => {
      if (typeof window !== "undefined") {
        if ((window as any).menuState) {
          setMenuState((window as any).menuState);
        }
        if ((window as any).isHovered !== undefined) {
          setIsHovered((window as any).isHovered);
        }
        if ((window as any).isMobile !== undefined) {
          setIsMobile((window as any).isMobile);
        }
      }
    };

    // Check initial state
    checkMenuState();

    // Set up interval to check for changes
    const interval = setInterval(checkMenuState, 50); // More frequent updates for hover

    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return null;
  }

  // Calculate margin based on menu state and hover - only for desktop
  const getMarginLeft = () => {
    if (isMobile) {
      return "0"; // No margin on mobile, sidebar is overlay
    }
    if (menuState === "hidden") {
      return "0";
    }
    // If collapsed and hovered, expand temporarily
    if (menuState === "collapsed" && isHovered) {
      return "16rem"; // 256px - full width
    }
    if (menuState === "collapsed") {
      return "4rem"; // 64px - collapsed width
    }
    return "16rem"; // 256px - full width
  };

  return (
    <div className={`flex h-screen `}>
      <Sidebar menuData={menuData} />
      <div
        className="w-full flex flex-1 flex-col transition-all duration-300 ease-in-out min-w-0"
        style={{
          marginLeft: getMarginLeft(),
        }}
      >
        <header className="h-16 border-b border-[#1F1F23] shrink-0">
          <TopNav config={topbar} />
        </header>
        <main className="flex-1 overflow-auto p-3 sm:p-6 min-w-0">
          {children}
        </main>
      </div>

      
    </div>
  );
}