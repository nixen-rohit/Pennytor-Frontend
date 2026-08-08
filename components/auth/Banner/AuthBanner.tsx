"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface AuthBannerProps {
  title?: string;
  subtitle?: string;
  description?: string;
  footerText?: string;
  showWave?: boolean;
}

export default function AuthBanner({
  title = "Hello Welcome",
  subtitle = "to Pennytor !",
  description = "Trade stocks, start SIPs, get loans, and expert advice  all in one seamless platform. Start your financial journey today.",
  showWave = true,
}: AuthBannerProps) {
  return (
    <section className="hidden md:flex flex-1 flex-col justify-between p-12 relative overflow-hidden bg-linear-to-b from-foreground to-mainground  ">
      {/* Subtle Background Geometric Swirl Lines using CSS radial structures */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute -bottom-20 -left-20 w-[600px] h-[600px] rounded-full border border-white" />
        <div className="absolute -bottom-10 -left-10 w-[600px] h-[600px] rounded-full border border-white" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full border border-white" />
      </div>

      {/* Top-left Logo */}
      <Link href="/" aria-label="Go to Pennytor Home" className="relative z-10">
        <Image
          src="/logos/Logo.jpeg"
          alt="Pennytor"
          width={110}
          height={110}
          className="h-auto w-auto rounded-xl"
          priority
        />
      </Link>

      <div className="flex flex-col items-start justify-center my-auto max-w-md mx-auto">

        <h2 className="text-5xl font-bold tracking-tight text-white mb-2">
          {title}
        </h2>
        <h2 className="text-5xl font-bold tracking-tight text-white mb-6 flex items-center gap-2">
          {subtitle}
          {showWave && (
            <span className="inline-block animate-bounce text-4xl">
              👋
            </span>
          )}
        </h2>

        <p className="text-blue-100 text-lg leading-relaxed font-light">
          {description}
        </p>
      </div>

      {/* Footer info matching the source image bottom text */}
      <div className="text-center text-blue-200/60 text-sm font-light w-full">
        {new Date().getFullYear()} Pennytor  All rights reserved.
      </div>
    </section>
  );
}