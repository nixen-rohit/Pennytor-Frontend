import { Card, CardContent } from "@/components/ui/card";

import { FEATURES } from "./data";

export function FeatureStrip() {
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {FEATURES.map(({ icon: Icon, title, description }) => (
        <Card
          key={title}
          className="group border-white/10 bg-[#111217] text-white shadow-xl transition hover:-translate-y-1 hover:border-amber-400/30"
        >
          <CardContent className="p-5">
            <span className="grid h-12 w-12 place-items-center rounded-2xl border border-amber-400/20 bg-amber-400/10 text-amber-300 transition group-hover:bg-amber-400 group-hover:text-black">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-base font-bold text-white">{title}</h3>
            <p className="mt-1.5 text-sm leading-6 text-zinc-500">
              {description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}