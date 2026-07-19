// components/data/tabbedNavData.tsx
import type { IconType } from "react-icons";
import { insuranceProducts } from "./navdata";

export interface TabbedGridItem {
  label: string;
  href: string;
  icon?: IconType;
  color?: string;
}

export interface TabbedSidebarSection {
  label: string;          // e.g. "Equity Funds"
  items: TabbedGridItem[]; // grid content shown when this sidebar item is active
}

export interface TabbedMegaTab {
  label: string;                  // top tab e.g. "Health Insurance"
  sidebar?: TabbedSidebarSection[]; // optional left nav (Dhan "Markets" style)
  items?: TabbedGridItem[];         // used directly if no sidebar
}

export interface TabbedMegaMenuData {
  tabs: TabbedMegaTab[];
}

// Convert existing Services data (Health/Life/Home) into tabs — no sidebar needed,
// each tab shows its items directly as a grid, same as Dhan does when a tab has
// no further sub-categories.
export const servicesTabbed: TabbedMegaMenuData = {
  tabs: insuranceProducts.map((col) => ({
    label: col.heading,
    items: col.items.map((item) => ({
      label: item.label,
      href: item.href,
      icon: item.icon,
      color: item.color,
    })),
  })),
};