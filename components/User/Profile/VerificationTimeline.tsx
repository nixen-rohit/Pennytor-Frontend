import { useMemo } from "react";
import { KycProfile, STATE_STYLES } from "@/components/User/Profile/types";
import { StateIcon } from "@/components/User/Profile/icons";

interface VerificationTimelineProps {
  profile: KycProfile;
}

export function VerificationTimeline({ profile }: VerificationTimelineProps) {
  const completedCount = useMemo(
    () => profile.items.filter((i) => i.state === "verified").length,
    [profile.items],
  );

  return (
    <section className="rounded-2xl border border-white/[0.08] p-8">
      <div className="mb-8 flex items-baseline justify-between">
        <h3 className="text-lg font-medium text-white/95">
          Verification Status
        </h3>
        <span className="text-xs text-white/35">
          {completedCount}/{profile.items.length} complete
        </span>
      </div>

      <ol className="relative">
        {profile.items.map((item, idx) => {
          const style = STATE_STYLES[item.state];
          const isLast = idx === profile.items.length - 1;
          return (
            <li
              key={item.id}
              className="relative flex gap-5 pb-9 last:pb-0"
            >
              {!isLast && (
                <span
                  className="absolute left-[19px] top-10 w-px bg-gradient-to-b from-white/15 to-white/[0.03]"
                  style={{ height: "calc(100% - 2.25rem)" }}
                  aria-hidden
                />
              )}

              <span
                className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-1 ${style.ring} ${style.bg} ${style.text}`}
              >
                <StateIcon state={item.state} />
              </span>

              <div className="flex flex-1 flex-col gap-1.5 pt-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-white/90">
                    {item.label}
                  </p>
                  <p className="mt-0.5 text-xs text-white/40">
                    {item.description}
                  </p>
                </div>
                <span
                  className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${style.bg} ${style.text}`}
                >
                  <span
                    className={`mr-1.5 h-1.5 w-1.5 rounded-full ${style.dot}`}
                  />
                  {style.label}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
