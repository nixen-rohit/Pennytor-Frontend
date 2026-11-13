import { ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";

import { AboutSection } from "./AboutSection";
import { CurriculumSection } from "./CurriculumSection";
import { EnrollSection } from "./EnrollSection";
import { FeatureStrip } from "./FeatureStrip";
import { Hero } from "./Hero";
import type { SmartClassProps } from "./types";

export default function SmartClass({
  onContact,
  className = "",
}: SmartClassProps) {
  return (
    <section
      aria-labelledby="smart-class-heading"
      className={cn(
        "w-full bg-[#09090b] px-4 py-12 text-white sm:px-6 lg:px-8",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-7xl">
        <Hero onContact={onContact} />
        <FeatureStrip />
        <AboutSection />
        <CurriculumSection />
        <EnrollSection onContact={onContact} />

        <div className="mt-5 flex items-start gap-2 rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3 text-xs leading-5 text-zinc-500">
          <ShieldCheck
            className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400"
            aria-hidden="true"
          />
          <p>
            Educational content only. Smart Class does not provide investment
            advice, stock recommendations or a promise of returns. Market
            investments are subject to risk; learn and make decisions
            responsibly.
          </p>
        </div>
      </div>
    </section>
  );
}