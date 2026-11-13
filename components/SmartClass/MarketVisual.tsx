import { BookOpen, ShieldCheck, TrendingUp, Zap } from "lucide-react";

import { MARKET_BARS } from "./data";

/**
 * Illustrative (not real) market chart used as the hero visual.
 * Decorative by design: hidden from assistive tech because the numbers
 * are placeholder art, not data.
 */
export function MarketVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[560px]">
      <div
        aria-hidden="true"
        className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-br from-amber-400/15 via-orange-500/5 to-transparent blur-2xl"
      />

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#111217] p-5 shadow-2xl sm:p-6">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Market learning dashboard
            </p>
            <p className="mt-1 text-base font-bold text-white sm:text-lg">
              Understand the bigger picture
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-300">
            Learn
          </span>
        </div>

        <div className="mt-6 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs text-zinc-500">
              A visual introduction to market charts
            </p>
            <p className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
              Market basics
            </p>
          </div>
          <TrendingUp
            className="mb-1 h-7 w-7 shrink-0 text-amber-400"
            aria-hidden="true"
          />
        </div>

        <div
          className="relative mt-6 h-52 overflow-hidden rounded-xl border border-white/5 bg-[#090a0f] p-4 sm:h-60"
          aria-hidden="true"
        >
          <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(to_right,rgba(255,255,255,.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.07)_1px,transparent_1px)] [background-size:42px_42px]" />

          <div className="absolute inset-x-4 bottom-5 top-5 flex items-end justify-between gap-1.5">
            {MARKET_BARS.map((height, index) => (
              <div key={index} className="relative flex h-full flex-1 items-end">
                <span
                  className={`w-full rounded-t-sm ${
                    index % 4 === 1 ? "bg-orange-400" : "bg-amber-400"
                  }`}
                  style={{
                    height: `${Math.min(height, 95)}%`,
                    opacity: 0.55 + (index % 3) * 0.15,
                  }}
                />
              </div>
            ))}
          </div>

          <svg
            viewBox="0 0 500 180"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
          >
            <defs>
              <linearGradient id="smartclass-market-line" x1="0" x2="1">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#fb923c" />
              </linearGradient>
            </defs>
            <path
              d="M8 150 C45 142 50 128 82 135 S130 105 158 116 S200 92 225 103 S265 72 295 86 S330 55 360 67 S405 32 430 42 S470 12 492 16"
              fill="none"
              stroke="url(#smartclass-market-line)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M8 150 C45 142 50 128 82 135 S130 105 158 116 S200 92 225 103 S265 72 295 86 S330 55 360 67 S405 32 430 42 S470 12 492 16 L492 180 L8 180Z"
              fill="url(#smartclass-market-line)"
              opacity=".08"
            />
          </svg>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/10 bg-white/[.03] p-4">
            <BookOpen className="h-5 w-5 text-amber-400" aria-hidden="true" />
            <p className="mt-3 text-sm font-bold text-white">
              Learn the concepts
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              Build a strong foundation
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[.03] p-4">
            <ShieldCheck
              className="h-5 w-5 text-orange-400"
              aria-hidden="true"
            />
            <p className="mt-3 text-sm font-bold text-white">Know the risks</p>
            <p className="mt-1 text-xs text-zinc-500">
              Put risk awareness first
            </p>
          </div>
        </div>
      </div>

       
    </div>
  );
}