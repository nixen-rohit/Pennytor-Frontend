// components/header/Header.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { RiMenuLine, } from "react-icons/ri";
import { CTA, NAV } from "@/components/Navbar/navdata";
import { DesktopNav } from "@/components/Navbar/desktop/DesktopNav";
import { MobileNav } from "@/components/Navbar/mobile/MobileNav";


export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);


  // Scroll shadow
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Lock body scroll when mobile nav is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  

  return (
    <>
      
      <header
        className={cn(
          "  fixed top-0 left-0 right-0 z-60  font-normal transition-all duration-300  ",
          scrolled
            ? "bg-white/95 border-b border-gray-200/70 shadow-lg"
            : "bg-white/95 border-b border-gray-200/60",
        )}
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-1.5">
          <div className="flex items-center justify-between h-[58px] gap-4 lg:gap-6">
            {/* ── Logo ── */}
            <Link
              href="/"
              className="flex items-center   p-4"
              aria-label="Pennytor Home"
            >
              <Image
                src="/logos/Logo.jpeg"
                alt="Pennytor"
                width={100}
                height={100}
                className="h-auto w-auto"
                priority
              />
            </Link>

            {/* ── Desktop Navigation ── */}
            <DesktopNav navItems={NAV} className="hidden lg:flex" />

            {/* ── Right Actions ── */}
            <div className="flex items-center gap-1 shrink-0"> 
              

              {/* CTA */}

              <Link
                href={CTA.href}
                className=" inline-flex items-center justify-center rounded-full text-white bg-foreground px-6 py-3 text-sm font-semibold    cursor-pointer transition-all duration-300  hover:bg-mainground  hover:-translate-y-0.5"
              >
                {CTA.label}
              </Link>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden h-9 w-9 flex items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors"
                aria-label="Open navigation menu"
              >
                <RiMenuLine className="text-[20px]" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <MobileNav
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navItems={NAV}
      />

      {/* Spacer so page content doesn't hide behind fixed header */}
      <div className="h-[58px]" aria-hidden="true" />
    </>
  );
}
