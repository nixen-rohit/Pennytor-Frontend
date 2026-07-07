"use client";

import { useState, useRef, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import {
  FaSearch,
  FaTimes,
  FaChevronRight,
  FaSignInAlt,
  FaHome,
  FaThLarge,
  FaUser,
  FaPhoneAlt,
  FaWhatsapp,
  FaFileInvoice,
  FaHeadset,
  FaStar,
} from "react-icons/fa";
import type { NavMenu } from "@/components/Data/Navbardata";
import {
  brandData,
  products,
  renew,
  claimMenu,
  supportMenu,
  expertMenu,
  ctaData,
} from "../navbar/navbar-config";

/* ------------------------------------------------------------------ */
/* MobileBottomNav                                                       */
/* ------------------------------------------------------------------ */

export function MobileBottomNav({
  onOpenDrawer,
}: {
  onOpenDrawer: () => void;
}) {
  const tabs = [
    { label: "Home", icon: FaHome, href: "/" },
    { label: "Products", icon: FaThLarge, href: "#", onClick: onOpenDrawer },
    { label: "Claims", icon: FaFileInvoice, href: "/claim/track" },
    { label: "Support", icon: FaHeadset, href: "/support/contact" },
    { label: "Profile", icon: FaUser, href: "/login" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/80 backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-1">
        {tabs.map((tab) => (
          <a
            key={tab.label}
            href={tab.href}
            onClick={(e) => {
              if (tab.onClick) {
                e.preventDefault();
                tab.onClick();
              }
            }}
            className="flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-[10px] font-medium text-slate-500 transition-colors hover:text-blue-700 active:text-blue-800"
          >
            <tab.icon className="h-5 w-5" />
            <span>{tab.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* MobileAccordion                                                       */
/* ------------------------------------------------------------------ */

interface MobileAccordionProps {
  label: string;
  icon?: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}

export function MobileAccordion({
  label,
  icon,
  isOpen,
  onToggle,
  children,
}: MobileAccordionProps) {
  return (
    <div className="border-b border-slate-100">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-3 py-3 text-sm font-medium text-slate-800"
      >
        <span className="flex items-center gap-2">
          {icon}
          {label}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FaChevronRight className="h-3 w-3 text-slate-400" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pb-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* MobileDrawer                                                          */
/* ------------------------------------------------------------------ */

export function MobileDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [subOpen, setSubOpen] = useState<string | null>(null);
  const [mSearch, setMSearch] = useState("");
  const simpleMenus: NavMenu[] = [renew, claimMenu, supportMenu];
  const drawerRef = useRef<HTMLDivElement>(null);

  const mSearchableItems = [
    ...products.flatMap((col) => col.items),
    ...renew.items,
    ...claimMenu.items,
    ...supportMenu.items,
    ...expertMenu.items,
  ];

  const mResults = mSearchableItems.filter((item) =>
    item.label.toLowerCase().includes(mSearch.toLowerCase()),
  );

  const quickActions = [
    {
      label: "Call",
      icon: FaPhoneAlt,
      href: "tel:18001234567",
      bg: "bg-green-50 text-green-700 hover:bg-green-100",
    },
    {
      label: "WhatsApp",
      icon: FaWhatsapp,
      href: "https://wa.me/911234567890",
      bg: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
    },
    {
      label: "Get Quote",
      icon: FaStar,
      href: "/get-quote",
      bg: "bg-amber-50 text-amber-700 hover:bg-amber-100",
    },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          />
          <motion.div
            ref={drawerRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl lg:hidden"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-3">
              <div className="flex items-center gap-2">
                <Image
                  src={brandData.icon}
                  alt={brandData.name}
                  width={44}
                  height={44}
                  className="rounded-lg"
                />
                <span className="text-sm font-bold text-slate-800">
                  {brandData.name}
                </span>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close menu"
              >
                <FaTimes className="h-4 w-4" />
              </button>
            </div>

            <div className="shrink-0 px-4 pt-3 pb-1">
              <div className="relative">
                <FaSearch
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={14}
                />
                <input
                  type="text"
                  placeholder="Search policies, claims..."
                  value={mSearch}
                  onChange={(e) => setMSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm text-slate-800 outline-none transition-all focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>
              {mSearch && (
                <div className="mt-2 max-h-48 overflow-y-auto rounded-xl border border-slate-100 bg-white shadow-lg">
                  {mResults.length > 0 ? (
                    mResults.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        onClick={() => {
                          setMSearch("");
                          onClose();
                        }}
                        className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50"
                      >
                        {item.label}
                      </a>
                    ))
                  ) : (
                    <p className="px-4 py-3 text-sm text-slate-400">
                      No results found
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="shrink-0 px-4 py-2">
              <div className="flex gap-2">
                {quickActions.map((action) => (
                  <a
                    key={action.label}
                    href={action.href}
                    onClick={onClose}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-semibold transition-all active:scale-95 ${action.bg}`}
                  >
                    <action.icon className="h-3.5 w-3.5" />
                    {action.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-2 pb-4">
              <div className="mt-1 mb-2 px-2">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                  Menu
                </p>
              </div>

              <MobileAccordion
                label="Insurance Products"
                icon={<FaThLarge className="h-3.5 w-3.5 text-blue-600" />}
                isOpen={subOpen === "products"}
                onToggle={() =>
                  setSubOpen((c) => (c === "products" ? null : "products"))
                }
              >
                <div className="space-y-3 px-1">
                  {products.map((col) => (
                    <div key={col.heading}>
                      <div className="mb-1 flex items-center gap-2 px-2">
                        <col.icon className="h-3 w-3 shrink-0 text-blue-600" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          {col.heading}
                        </span>
                      </div>
                      <div className="space-y-0.5">
                        {col.items.map((item) => (
                          <a
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className="group flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-slate-600 transition-all hover:bg-blue-50 hover:text-blue-700"
                          >
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300 transition-colors group-hover:bg-blue-500" />
                            <span className="flex-1">{item.label}</span>
                            <FaChevronRight className="h-2.5 w-2.5 shrink-0 text-slate-300 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </MobileAccordion>

              {[...simpleMenus, expertMenu].map((menu) => (
                <MobileAccordion
                  key={menu.label}
                  label={menu.label}
                  icon={
                    menu.icon && (
                      <menu.icon className="h-3.5 w-3.5 text-blue-600" />
                    )
                  }
                  isOpen={subOpen === menu.label}
                  onToggle={() =>
                    setSubOpen((c) => (c === menu.label ? null : menu.label))
                  }
                >
                  <div className="space-y-0.5 px-1">
                    {menu.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <a
                          key={item.href}
                          href={item.href}
                          onClick={onClose}
                          className="group flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-slate-600 transition-all hover:bg-blue-50 hover:text-blue-700"
                        >
                          {Icon ? (
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100">
                              <Icon className="h-3.5 w-3.5" />
                            </div>
                          ) : (
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300 transition-colors group-hover:bg-blue-500" />
                          )}
                          <div className="min-w-0 flex-1">
                            <span className="block text-sm font-medium leading-tight">
                              {item.label}
                            </span>
                            {item.description && (
                              <span className="block text-[10px] leading-tight text-slate-400 truncate">
                                {item.description}
                              </span>
                            )}
                          </div>
                          <FaChevronRight className="h-2.5 w-2.5 shrink-0 text-slate-300 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                        </a>
                      );
                    })}
                  </div>
                </MobileAccordion>
              ))}
            </div>

            <div className="shrink-0 border-t border-slate-100 bg-gradient-to-t from-white via-white to-transparent px-4 py-3">
              <a
                href={ctaData.href}
                onClick={onClose}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-700/20 transition-all hover:from-blue-800 hover:to-indigo-800 active:scale-[0.98]"
              >
                <FaSignInAlt className="h-4 w-4" />
                {ctaData.label}
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
