"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { FaSearch, FaBars, FaSignInAlt } from "react-icons/fa";
import {
  navItems,
  menuMap,
  products,
  renew,
  claimMenu,
  supportMenu,
  expertMenu,
  ctaData,
  brandData,
  backdropVariants,
  panelVariants,
  type NavItemId,
} from "../navbar/navbar-config";
import { ProductsMegaPanel, SimpleMegaPanel } from "@/components/navbar/mega-panel";
import { MobileDrawer, MobileBottomNav } from "@/components/navbar/mobile-nav";

export default function Navbar() {
  const [activeMenu, setActiveMenu] = useState<NavItemId | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const headerRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const searchableItems = [
    ...products.flatMap((col) => col.items),
    ...renew.items,
    ...claimMenu.items,
    ...supportMenu.items,
    ...expertMenu.items,
  ];

  const results = searchableItems.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    if (activeMenu === "products" && !activeCategory) {
      setActiveCategory(products[0]?.heading ?? null);
    }
  }, [activeMenu, activeCategory]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        headerRef.current &&
        e.target instanceof Node &&
        !headerRef.current.contains(e.target)
      ) {
        setActiveMenu(null);
        setActiveCategory(null);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const cancelClose = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
      setActiveCategory(null);
    }, 200);
  }, [cancelClose]);

  const handleNavButtonEnter = useCallback(
    (id: NavItemId) => {
      cancelClose();
      setActiveMenu(id);
      if (id === "products") {
        setActiveCategory((prev) => prev ?? products[0]?.heading ?? null);
      }
    },
    [cancelClose],
  );

  const handleCategorySelect = useCallback((heading: string) => {
    setActiveCategory(heading);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setActiveMenu(null);
      setActiveCategory(null);
    }
  }, []);

  return (
    <header
      ref={headerRef}
      onKeyDown={handleKeyDown}
      className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white backdrop-blur"
    >
      <div
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
        className="relative"
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="/" className="flex items-center justify-center">
            <Image
              src={brandData.icon}
              alt={brandData.name}
              width={100}
              height={100}
            />
          </a>

          <div className="hidden lg:flex items-center gap-0.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onMouseEnter={() => handleNavButtonEnter(item.id as NavItemId)}
                className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  activeMenu === item.id
                    ? "text-blue-700 bg-blue-50"
                    : "text-slate-700 hover:text-blue-700 hover:bg-slate-50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="relative hidden lg:block">
              <FaSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-72 rounded-full border text-black border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none transition-all focus:border-slate-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
              {search && (
                <div className="absolute top-12 w-full rounded-xl border bg-white shadow-lg text-black">
                  {results.length > 0 ? (
                    results.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        className="block rounded-xl px-4 py-3 hover:bg-blue-50"
                        onClick={() => setSearch("")}
                      >
                        {item.label}
                      </a>
                    ))
                  ) : (
                    <p className="px-4 py-3 text-sm text-slate-500">
                      No results found
                    </p>
                  )}
                </div>
              )}
            </div>

            <a
              href={ctaData.href}
              className="hidden items-center gap-2 rounded-lg bg-blue-700 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-800 sm:flex sm:px-4"
            >
              <FaSignInAlt className="h-3.5 w-3.5" />
              {ctaData.label}
            </a>

            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-md p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
              aria-label="Open menu"
            >
              <FaBars className="h-5 w-5" />
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {activeMenu && (
            <motion.div
              key={activeMenu}
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute left-0 right-0 top-0 z-50"
              style={{ marginTop: "64px" }}
              onMouseEnter={cancelClose}
              onMouseLeave={scheduleClose}
            >
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-6">
                <motion.div
                  key={activeMenu}
                  variants={panelVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="rounded-2xl border border-slate-200/80 bg-white shadow-2xl ring-1 ring-slate-900/5 overflow-hidden"
                >
                  {activeMenu === "products" ? (
                    <ProductsMegaPanel
                      products={products}
                      activeCategory={activeCategory}
                      onCategorySelect={handleCategorySelect}
                    />
                  ) : (
                    <SimpleMegaPanel menu={menuMap[activeMenu]} />
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <MobileBottomNav onOpenDrawer={() => setMobileOpen(true)} />
    </header>
  );
}
