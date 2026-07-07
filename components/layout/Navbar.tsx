"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import {
  FaSearch,
  FaBars,
  FaTimes,
  FaSignInAlt,
  FaChevronRight,
  FaArrowRight,
  FaShieldAlt,
  FaStar,
  FaCheckCircle,
} from "react-icons/fa";
import {
  insuranceProducts,
  renewPolicy,
  claim,
  support,
  talkToExpert,
  CTA,
  brand,
  promoCard,
  type NavMenu,
  type ProductColumn,
  type PromoCardData,
} from "@/components/Data/Navbardata";

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */

const products = insuranceProducts;
const renew = renewPolicy;
const claimMenu = claim;
const supportMenu = support;
const expertMenu = talkToExpert;
const ctaData = CTA;
const brandData = brand;
const promo = promoCard;

const menuMap: Record<string, NavMenu> = {
  renew: renew,
  claims: claimMenu,
  support: supportMenu,
  expert: expertMenu,
};

const navItems = [
  { id: "products", label: "Insurance Products" },
  { id: "renew", label: "Renew Policy" },
  { id: "claims", label: "Claims" },
  { id: "support", label: "Support" },
  { id: "expert", label: "Talk to Expert" },
];

type NavItemId = (typeof navItems)[number]["id"];

/* ------------------------------------------------------------------ */
/* Animation variants                                                  */
/* ------------------------------------------------------------------ */

const panelVariants: Variants = {
  hidden: { opacity: 0, y: -6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.18, ease: "easeOut" } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.12, ease: "easeIn" } },
};

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

const categoryContentVariants = {
  hidden: { opacity: 0, x: -4 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, x: 4, transition: { duration: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.025, duration: 0.2 },
  }),
};

/* ------------------------------------------------------------------ */
/* Sub-components                                                       */
/* ------------------------------------------------------------------ */

function PromoCard({ data }: { data: PromoCardData }) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-5 text-white sm:p-6">
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
      <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-white/5" />

      <div className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider backdrop-blur-sm">
        <FaStar className="h-3 w-3 text-yellow-300" />
        {data.badge}
      </div>

      <FaShieldAlt className="mb-3 h-8 w-8 text-blue-200" />

      <h4 className="mb-1 text-lg font-bold leading-tight">{data.headline}</h4>
      <p className="mb-4 text-xs leading-relaxed text-blue-100">
        {data.description}
      </p>

      <ul className="mb-5 space-y-1.5">
        {data.features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-xs text-blue-100">
            <FaCheckCircle className="h-3 w-3 shrink-0 text-green-300" />
            {f}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-col gap-2">
        <a
          href={data.ctaHref}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 transition-all hover:bg-blue-50 hover:scale-[1.02] active:scale-[0.98]"
        >
          {data.ctaLabel}
          <FaArrowRight className="h-3 w-3" />
        </a>
        <a
          href={data.learnMoreHref}
          className="text-center text-xs font-medium text-blue-200 underline-offset-2 hover:underline"
        >
          {data.learnMoreLabel}
        </a>
      </div>
    </div>
  );
}

function CategorySidebar({
  categories,
  activeCategory,
  onSelect,
}: {
  categories: ProductColumn[];
  activeCategory: string | null;
  onSelect: (heading: string) => void;
}) {
  return (
    <div className="space-y-0.5">
      {categories.map((cat) => {
        const Icon = cat.icon;
        const isActive = activeCategory === cat.heading;
        return (
          <button
            key={cat.heading}
            onMouseEnter={() => onSelect(cat.heading)}
            onClick={() => onSelect(cat.heading)}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all ${
              isActive
                ? "bg-blue-50 text-blue-700 shadow-sm"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Icon
              className={`h-4 w-4 shrink-0 ${
                isActive ? "text-blue-600" : "text-slate-400"
              }`}
            />
            <span>{cat.heading}</span>
            {isActive && (
              <motion.div
                layoutId="activeIndicator"
                className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

function ProductsMegaPanel({
  products,
  activeCategory,
  onCategorySelect,
}: {
  products: ProductColumn[];
  activeCategory: string | null;
  onCategorySelect: (heading: string) => void;
}) {
  const selectedColumn = products.find((c) => c.heading === activeCategory);

  return (
    <div className="flex min-h-[340px]">
      {/* Left sidebar */}
      <div className="hidden w-[220px] shrink-0 border-r border-slate-100 bg-slate-50/50 p-4 md:block">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
          Categories
        </p>
        <CategorySidebar
          categories={products}
          activeCategory={activeCategory}
          onSelect={onCategorySelect}
        />
      </div>

      {/* Center content */}
      <div className="flex flex-1 flex-col p-4 md:p-5">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
          {selectedColumn?.heading ?? "Products"}
        </p>

        <AnimatePresence mode="wait">
          {selectedColumn && (
            <motion.div
              key={selectedColumn.heading}
              variants={categoryContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                {selectedColumn.items.map((item, i) => (
                  <motion.div
                    key={item.href}
                    custom={i}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <a
                      href={item.href}
                      className="group flex items-start gap-3 rounded-lg p-2.5 transition-all hover:bg-blue-50/60"
                    >
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100">
                        <selectedColumn.icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 text-sm font-medium text-slate-800 group-hover:text-blue-700">
                          {item.label}
                          <FaArrowRight className="h-2.5 w-2.5 shrink-0 text-slate-300 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                        </div>
                        {item.description && (
                          <p className="mt-0.5 text-xs leading-snug text-slate-500">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </a>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right promo card */}
      <div className="hidden w-[260px] shrink-0 border-l border-slate-100 p-4 lg:block xl:w-[280px]">
        <PromoCard data={promo} />
      </div>
    </div>
  );
}

function SimpleMegaPanel({ menu }: { menu: NavMenu }) {
  const hasIcons = menu.items.some((item) => item.icon);

  return (
    <div className="flex min-h-[260px]">
      {/* Left content area */}
      <div className="flex flex-1 flex-col p-4 md:p-5">
        <div className="mb-3 flex items-center gap-2">
          {menu.icon && <menu.icon className="h-4 w-4 text-blue-600" />}
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
            {menu.label}
          </p>
        </div>

        <div
          className={`grid gap-1 ${
            hasIcons ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
          }`}
        >
          {menu.items.map((item, i) => (
            <motion.div
              key={item.href}
              custom={i}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <a
                href={item.href}
                className="group flex items-center gap-3 rounded-lg p-2.5 transition-all hover:bg-blue-50/60"
              >
                {item.icon && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100">
                    <item.icon className="h-4 w-4" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-slate-800 group-hover:text-blue-700">
                    {item.label}
                    <FaArrowRight className="h-2.5 w-2.5 shrink-0 text-slate-300 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </div>
                  {item.description && (
                    <p className="mt-0.5 text-xs leading-snug text-slate-500">
                      {item.description}
                    </p>
                  )}
                </div>
              </a>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right promo card */}
      <div className="hidden w-[260px] shrink-0 border-l border-slate-100 p-4 lg:block xl:w-[280px]">
        <PromoCard data={promo} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile Components                                                    */
/* ------------------------------------------------------------------ */

interface MobileAccordionProps {
  label: string;
  icon?: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}

function MobileAccordion({
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

function MobileDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [subOpen, setSubOpen] = useState<string | null>(null);
  const simpleMenus: NavMenu[] = [renew, claimMenu, supportMenu];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-slate-900/40 lg:hidden"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            className="fixed right-0 top-0 z-50 h-full w-[88%] max-w-sm overflow-y-auto bg-white shadow-2xl lg:hidden"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
              <div className="flex min-w-0 items-center gap-2">
                <brandData.icon className="h-6 w-6 shrink-0 text-blue-700" />
                <span className="truncate font-bold text-slate-900">
                  {brandData.name}
                </span>
              </div>
              <button
                onClick={onClose}
                className="shrink-0 rounded-md p-2 text-slate-600 hover:bg-slate-100"
                aria-label="Close menu"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>

            <div className="px-2 py-3">
              {/* Insurance Products accordion */}
              <MobileAccordion
                label="Insurance Products"
                isOpen={subOpen === "products"}
                onToggle={() =>
                  setSubOpen((c) => (c === "products" ? null : "products"))
                }
              >
                {products.map((col) => (
                  <div key={col.heading} className="mb-3">
                    <div className="mb-1.5 flex items-center gap-2 px-3">
                      <col.icon className="h-3.5 w-3.5 shrink-0 text-blue-700" />
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {col.heading}
                      </span>
                    </div>
                    <ul>
                      {col.items.map((item) => (
                        <li key={item.href}>
                          <a
                            href={item.href}
                            className="block rounded-lg px-3 py-1.5 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                            onClick={onClose}
                          >
                            {item.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </MobileAccordion>

              {[...simpleMenus, expertMenu].map((menu) => (
                <MobileAccordion
                  key={menu.label}
                  label={menu.label}
                  icon={
                    menu.icon && <menu.icon className="h-3.5 w-3.5 text-blue-600" />
                  }
                  isOpen={subOpen === menu.label}
                  onToggle={() =>
                    setSubOpen((c) => (c === menu.label ? null : menu.label))
                  }
                >
                  <ul>
                    {menu.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <li key={item.href}>
                          <a
                            href={item.href}
                            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                            onClick={onClose}
                          >
                            {Icon && (
                              <Icon className="h-3.5 w-3.5 shrink-0" />
                            )}
                            {item.label}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </MobileAccordion>
              ))}

              <a
                href={ctaData.href}
                className="mx-3 mt-3 flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
                onClick={onClose}
              >
                <FaSignInAlt className="h-3.5 w-3.5" />
                {ctaData.label}
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/* Main Component                                                       */
/* ------------------------------------------------------------------ */

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

  // Set default category when products menu opens
  useEffect(() => {
    if (activeMenu === "products" && !activeCategory) {
      setActiveCategory(products[0]?.heading ?? null);
    }
  }, [activeMenu, activeCategory]);

  // Close menus on outside click
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

  // Lock body scroll on mobile drawer
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
      className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80"
    >
      <div
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
        className="relative"
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <a href="/" className="flex shrink-0 items-center gap-2">
            <brandData.icon className="h-6 w-6 shrink-0 text-blue-700 sm:h-7 sm:w-7" />
            <span className="truncate text-base font-bold tracking-tight text-slate-900 sm:text-lg">
              {brandData.name}
            </span>
          </a>

          {/* Desktop nav items */}
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

          {/* Right section */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {/* Desktop search */}
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
                <div className="absolute top-12 w-full rounded-xl border bg-white shadow-lg text-black ">
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

        {/* Mega Panel */}
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

      {/* Mobile drawer */}
      <MobileDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </header>
  );
}
