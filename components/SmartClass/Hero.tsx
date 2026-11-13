import { ArrowRight, GraduationCap, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";

import { STATS } from "./data";
import { MarketVisual } from "./MarketVisual";

type HeroProps = {
  onContact?: () => void;
};

export function Hero({ onContact }: HeroProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#181820] via-[#101116] to-[#090a0f] px-5 py-8 shadow-2xl sm:px-8 sm:py-10 lg:px-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-orange-500/5 blur-3xl"
      />

      <div className="relative grid items-center gap-12 lg:grid-cols-[1.02fr_.98fr] lg:gap-10">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
            <GraduationCap className="h-4 w-4" aria-hidden="true" />
            Share Market Education
          </div>

          <h2
            id="smart-class-heading"
            className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Smart <span className="text-amber-400">Class</span>
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
            Build your understanding of the share market through live online
            classes, practical examples and clear explanations — in Hindi and
            English.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              className="h-12 bg-amber-400 px-6 font-bold text-black hover:bg-amber-300"
            >
              <a href="#curriculum">
                Explore the curriculum
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            {onContact ? (
              <Button
                type="button"
                variant="outline"
                onClick={onContact}
                className="h-12 border-white/15 bg-white/5 px-6 font-semibold text-white hover:border-amber-400/60 hover:bg-white/10 hover:text-white"
              >
                <Phone className="mr-2 h-4 w-4" />
                Talk to us
              </Button>
            ) : null}
          </div>

          <div className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-white/10 pt-7">
            {STATS.map((stat) => (
              <div key={stat.value}>
                <p className="text-sm font-extrabold text-amber-300 sm:text-base">
                  {stat.value}
                </p>
                <p className="mt-1 text-[11px] leading-5 text-zinc-500 sm:text-xs">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <MarketVisual />
      </div>
    </div>
  );
}