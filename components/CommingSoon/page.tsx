
import { ArrowRight, FileText, Sparkles } from "lucide-react";
import Link from "next/link";

export default function ComingSoon() {
  return (
    <div className="relative flex min-h-[60vh] w-full items-center justify-center overflow-hidden bg-[#09090b] px-4 py-10 text-center sm:px-6 sm:py-12">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        {/* Main glow */}
        <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-500/10 blur-3xl sm:h-72 sm:w-72" />

        {/* Secondary glow */}
        <div className="absolute left-[15%] top-[20%] h-32 w-32 rounded-full bg-red-500/5 blur-3xl" />

        <div className="absolute right-[15%] bottom-[15%] h-40 w-40 rounded-full bg-orange-500/5 blur-3xl" />

        {/* Dots */}
        <div className="absolute left-[12%] top-[20%] h-1.5 w-1.5 rounded-full bg-yellow-400/50 sm:left-[20%] sm:top-[25%]" />

        <div className="absolute right-[12%] top-[30%] h-1.5 w-1.5 rounded-full bg-red-400/40 sm:right-[22%] sm:top-[35%]" />

        <div className="absolute bottom-[20%] left-[20%] h-1.5 w-1.5 rounded-full bg-orange-400/40 sm:bottom-[25%] sm:left-[30%]" />
      </div>

      <div className="relative z-10 flex w-full max-w-xl flex-col items-center">
        {/* Icon */}
        <div className="relative mb-6 sm:mb-7">
          <div className="absolute inset-0 rounded-2xl bg-yellow-500/20 blur-xl" />

          <div className="relative flex h-16 w-16 items-center justify-center rounded-xl border border-white/10 bg-[#18181b] shadow-2xl shadow-black/40 sm:h-20 sm:w-20 sm:rounded-2xl">
            <FileText className="h-7 w-7 text-indigo-300 sm:h-9 sm:w-9" />

            <div className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#09090b] bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 sm:-right-2 sm:-top-2 sm:h-7 sm:w-7">
              <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-300 sm:mb-4">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-400" />
          In development
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
          Coming Soon
        </h1>

        {/* Description */}
        <p className="mt-3 max-w-md px-2 text-sm leading-6 text-zinc-400 sm:mt-4 sm:px-0 sm:text-base">
          We're working on something new for you. This feature is currently
          under development and will be available soon.
        </p>

        {/* Card */}
        <div className="mt-7 w-full rounded-xl border border-white/10 bg-[#111113] p-4 shadow-xl shadow-black/20 sm:mt-8 sm:p-5">
          <div className="flex items-start gap-3 text-left sm:items-center sm:gap-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-indigo-500/10 bg-indigo-500/10 sm:h-10 sm:w-10">
              <Sparkles className="h-4 w-4 text-indigo-300 sm:h-5 sm:w-5" />
            </div>

            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-zinc-100">
                Something better is on the way
              </h3>

              <p className="mt-1 text-xs leading-5 text-zinc-500">
                We're putting the finishing touches on this feature.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <Link href="/dashboard">
          <button
            type="button"
            className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-indigo-400/20 bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-500/10 transition-all hover:bg-indigo-400 hover:shadow-indigo-500/20 sm:mt-7 sm:w-auto"
          >
            Back to Dashboard

            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </Link>
      </div>
    </div>
  );
}
