// components/header/desktop/TabbedMegaMenu.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { TabbedMegaMenuData, TabbedGridItem } from "../../data/tabbedNavData";

interface TabbedMegaMenuProps {
  data: TabbedMegaMenuData;
  align?: "left" | "right" | "center";
  width?: number | string;
}

export function TabbedMegaMenu({ data, align = "left", width = 720 }: TabbedMegaMenuProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [activeSidebar, setActiveSidebar] = useState(0);

  const tab = data.tabs[activeTab];
  const hasSidebar = !!tab.sidebar?.length;

  // Reset sidebar selection whenever the top tab changes
  useEffect(() => {
    setActiveSidebar(0);
  }, [activeTab]);

  const gridItems: TabbedGridItem[] = hasSidebar
    ? tab.sidebar![activeSidebar].items
    : tab.items ?? [];

  const alignClass =
    align === "right" ? "right-0" : align === "center" ? "left-1/2 -translate-x-1/2" : "left-0";

  return (
    <div
      className={cn(
        "absolute top-full z-50",
        alignClass,
        "font-inter bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden",
        "opacity-0 translate-y-2 scale-[0.98] pointer-events-none",
        "group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 group-hover:pointer-events-auto",
        "transition-all duration-200 ease-out origin-top",
      )}
      style={{ minWidth: `${width}px`, maxWidth: `${width}px` }}
    >
      {/* Top tab bar — Dhan "Indices / Stocks / F&O / Mutual Funds..." row */}
      <div className="flex items-center gap-1 border-b border-gray-100 px-4 pt-3 pb-2 overflow-x-auto">
        {data.tabs.map((t, i) => (
          <button
            key={t.label}
            onMouseEnter={() => setActiveTab(i)}
            onClick={() => setActiveTab(i)}
            className={cn(
              "whitespace-nowrap rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors",
              i === activeTab
                ? "bg-orange-500 text-white"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-700",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className={cn("flex", hasSidebar ? "min-h-[280px]" : "min-h-[auto]")}>
        {/* Left sidebar — Dhan "Equity Funds / Debt Funds / Hybrid Funds..." list */}
        {hasSidebar && (
          <div className="w-[170px] shrink-0 border-r border-gray-100 py-3">
            {tab.sidebar!.map((section, si) => (
              <button
                key={section.label}
                onMouseEnter={() => setActiveSidebar(si)}
                onClick={() => setActiveSidebar(si)}
                className={cn(
                  "flex w-full items-center justify-between px-4 py-2 text-left text-[13px] font-medium transition-colors",
                  si === activeSidebar
                    ? "text-orange-600 bg-orange-50 border-r-2 border-orange-500"
                    : "text-gray-600 hover:bg-gray-50",
                )}
              >
                {section.label}
              </button>
            ))}
          </div>
        )}

        {/* Right content grid — icon + label items */}
        <div className="flex-1 p-4">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {gridItems.map((item, li) => (
              <Link
                key={li}
                href={item.href}
                className="group/link flex items-center gap-3 rounded-lg px-2.5 py-2.5 hover:bg-gray-50 transition-colors"
              >
                {item.icon && (
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[15px]",
                      item.color ?? "bg-gray-100 text-gray-600",
                    )}
                  >
                    <item.icon />
                  </span>
                )}
                <span className="text-[13px] font-semibold text-gray-800 group-hover/link:text-blue-600 transition-colors">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}