import { ArrowRight, GraduationCap, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";

type EnrollSectionProps = {
  onContact?: () => void;
};

export function EnrollSection({ onContact }: EnrollSectionProps) {
  return (
    <section
      id="enroll"
      aria-labelledby="smart-class-enroll-heading"
      className="mt-6 scroll-mt-24"
    >
      <div className="relative overflow-hidden rounded-3xl border border-amber-400/25 bg-gradient-to-br from-[#242018] via-[#171513] to-[#101112] px-6 py-12 text-center shadow-2xl sm:px-12 sm:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl"
        />

        <div className="relative">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-amber-400 text-black">
            <GraduationCap className="h-6 w-6" aria-hidden="true" />
          </span>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.22em] text-amber-400">
            Start your learning journey
          </p>

          <h2
            id="smart-class-enroll-heading"
            className="mx-auto mt-4 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            Learn the market. Build your understanding.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
            Join Pennytor Smart Class for live online share market education in
            Hindi and English.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              className="h-12 bg-amber-400 px-7 font-bold text-black hover:bg-amber-300"
            >
              <a href="#curriculum">
                View the curriculum
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>

            {onContact ? (
              <Button
                type="button"
                variant="outline"
                onClick={onContact}
                className="h-12 border-amber-400/20 bg-amber-400/10 px-7 font-semibold text-amber-300 hover:bg-amber-400/20 hover:text-amber-200"
              >
                <Phone className="mr-2 h-4 w-4" />
                Enquire about classes
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}