import { ArrowDownRight, Check } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { CURRICULUM } from "./data";

export function CurriculumSection() {
  return (
    <section
      id="curriculum"
      aria-labelledby="smart-class-curriculum-heading"
      className="mt-6 scroll-mt-24 rounded-3xl border border-white/10 bg-[#111217] p-6 shadow-xl sm:p-8 lg:p-10"
    >
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-400">
            Your learning path
          </p>
          <h2
            id="smart-class-curriculum-heading"
            className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            What you&apos;ll learn
          </h2>
        </div>
        <p className="max-w-md text-sm leading-7 text-zinc-500">
          Explore the essential building blocks of share market education, from
          first principles to risk-aware decision making.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {CURRICULUM.map((topic) => (
          <Card
            key={topic.number}
            className="group border-white/10 bg-[#09090b] text-white shadow-none transition hover:-translate-y-1 hover:border-amber-400/40"
          >
            <CardContent className="p-6 sm:p-7">
              <div className="flex items-start justify-between">
                <span className="text-sm font-black tracking-widest text-amber-400">
                  {topic.number}
                </span>
                <ArrowDownRight
                  className="h-5 w-5 text-zinc-600 transition group-hover:text-amber-400"
                  aria-hidden="true"
                />
              </div>

              <h3 className="mt-6 text-lg font-bold text-white">
                {topic.title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-zinc-500">
                {topic.detail}
              </p>

              <ul className="mt-5 space-y-2">
                {topic.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-center gap-2 text-sm text-zinc-400"
                  >
                    <Check
                      className="h-4 w-4 shrink-0 text-amber-400"
                      aria-hidden="true"
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}