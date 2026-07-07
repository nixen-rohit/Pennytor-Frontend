"use client";

import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaStar,
  FaShieldAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { AnimatePresence } from "framer-motion";
import type {
  PromoCardData,
  ProductColumn,
  NavMenu,
} from "@/components/Data/Navbardata";
import {
  promo,
  categoryContentVariants,
  itemVariants,
} from "../navbar/navbar-config";

/* ------------------------------------------------------------------ */
/* PromoCard                                                            */
/* ------------------------------------------------------------------ */

export function PromoCard({ data }: { data: PromoCardData }) {
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

/* ------------------------------------------------------------------ */
/* CategorySidebar                                                      */
/* ------------------------------------------------------------------ */

export function CategorySidebar({
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
                ? "bg-blue-50 text-foreground shadow-sm"
                : "text-mainground hover:bg-mainground/60 hover:text-foreground"
            }`}
          >
            <Icon
              className={`h-4 w-4 shrink-0 ${
                isActive ? "text-foreground" : "text-mainground"
              }`}
            />
            <span>{cat.heading}</span>
            {isActive && (
              <motion.div
                layoutId="activeIndicator"
                className="ml-auto h-1.5 w-1.5 rounded-full bg-foreground"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ProductsMegaPanel                                                     */
/* ------------------------------------------------------------------ */

export function ProductsMegaPanel({
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
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-foreground transition-colors group-hover:bg-blue-100">
                        <selectedColumn.icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 text-sm font-medium text-slate-800 group-hover:text-foreground">
                          {item.label}
                          <FaArrowRight className="h-2.5 w-2.5 shrink-0 text-mainground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
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

      <div className="hidden w-[260px] shrink-0 border-l border-slate-100 p-4 lg:block xl:w-[280px]">
        <PromoCard data={promo} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SimpleMegaPanel                                                       */
/* ------------------------------------------------------------------ */

export function SimpleMegaPanel({ menu }: { menu: NavMenu }) {
  const hasIcons = menu.items.some((item) => item.icon);

  return (
    <div className="flex min-h-[260px]">
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

      <div className="hidden w-[260px] shrink-0 border-l border-slate-100 p-4 lg:block xl:w-[280px]">
        <PromoCard data={promo} />
      </div>
    </div>
  );
}
