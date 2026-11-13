import { Check } from "lucide-react";

import { HIGHLIGHTS } from "./data";

export function AboutSection() {
  return (
    <section
      aria-labelledby="smart-class-about-heading"
      className="mt-6 rounded-3xl border border-white/10 bg-[#111217] p-6 shadow-xl sm:p-8 lg:p-10"
    >
      <div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:gap-14">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-400">
            The Pennytor approach
          </p>
          <h2
            id="smart-class-about-heading"
            className="mt-4 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl"
          >
            Financial knowledge,
            <span className="text-zinc-500"> made easier.</span>
          </h2>
        </div>

        <div>
          <p className="text-base leading-8 text-zinc-400">
            The stock market can feel complicated when you are just starting.
            Pennytor Smart Class is designed to make the learning journey more
            approachable with structured lessons, practical illustrations and
            opportunities to interact during live sessions.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            {HIGHLIGHTS.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.03] px-4 py-2 text-sm text-zinc-300"
              >
                <Check className="h-4 w-4 text-amber-400" aria-hidden="true" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}