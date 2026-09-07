"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Lock, TrendingUp, AlertCircle, ShieldCheck } from "lucide-react";
import { ReferralService, MyStatsResponse, KycStatus } from "@/services/referral.service";

/**
 * Commission Program page.
 *
 * Data-driven from `GET /referral/stats` (spec §26). The page shows:
 *   - the user's current commission level (1..5)
 *   - progress toward the next level, using the spec's
 *     verified-direct-referral thresholds (3 / 6 / 9 / 12 for
 *     L2 / L3 / L4 / L5 — L1 unlocks at 0; the only requirement for
 *     L1 is a verified investment of the user's own)
 *   - the per-level commission rates (L1 = 0.50%, L2–L5 = 0.25%)
 *
 * If the user has no qualifying investment yet, the page explains
 * what's needed to unlock L1 (spec §30: "Make an investment to
 * unlock your referral program").
 */

interface LevelView {
  level: number;
  /** Verified-direct-referral count required to unlock this level. */
  threshold: number;
  /** Commission rate as a percent (0.5 = 0.5%). */
  rate: number;
  /** Human description shown next to the level name. */
  description: string;
}

const MAX_LEVEL = 5;

const FALLBACK_LEVELS: LevelView[] = [
  {
    level: 1,
    threshold: 0,
    rate: 0.5,
    description: "Requires a verified investment in any scheme",
  },
  {
    level: 2,
    threshold: 3,
    rate: 0.25,
    description:
      "At least 3 verified direct referrals (referrals who themselves have a verified investment)",
  },
  {
    level: 3,
    threshold: 6,
    rate: 0.25,
    description:
      "At least 6 verified direct referrals",
  },
  {
    level: 4,
    threshold: 9,
    rate: 0.25,
    description: "At least 9 verified direct referrals",
  },
  {
    level: 5,
    threshold: 12,
    rate: 0.25,
    description: "At least 12 verified direct referrals",
  },
];

/** Format a percent like `0.5` as the human-readable "0.50%". */
function fmtRate(rate: number): string {
  return `${rate.toFixed(2)}%`;
}

export default function Commission() {
  const [stats, setStats] = useState<MyStatsResponse | null>(null);
  const [eligible, setEligible] = useState<boolean>(false);
  const [kycStatus, setKycStatus] = useState<KycStatus>("NOT_STARTED");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [elig, st] = await Promise.all([
        ReferralService.getEligibility(),
        ReferralService.getStats(),
      ]);
      setStats(st);
      setEligible(elig.canRefer);
      // Use KYC status from stats (primary) or eligibility (fallback)
      setKycStatus(st.kycStatus ?? elig.kycStatus);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load commission data",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <main className="h-full px-4 text-white md:px-8">
        <div className="mx-auto max-w-6xl py-20 text-center text-zinc-400">
          Loading commission data…
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="h-full px-4 text-white md:px-8">
        <div className="mx-auto max-w-6xl py-20 text-center">
          <p className="text-red-400">{error}</p>
        </div>
      </main>
    );
  }

  const s = stats!;
  const currentLevel = s.currentUnlockedLevel;

  // Build the per-level view from the live thresholds and rates
  // when available; fall back to the spec constants otherwise.
  const levels: LevelView[] = FALLBACK_LEVELS.map((lvl) => ({
    ...lvl,
    threshold:
      lvl.level === 2
        ? s.thresholds.l2
        : lvl.level === 3
          ? s.thresholds.l3
          : lvl.level === 4
            ? s.thresholds.l4
            : lvl.level === 5
              ? s.thresholds.l5
              : 0,
    rate: s.rates[`l${lvl.level}` as "l1" | "l2" | "l3" | "l4" | "l5"],
  }));

  const isMaxLevel = currentLevel >= MAX_LEVEL;

  // KYC gate: if not verified, show KYC step as the first requirement
  const kycVerified = kycStatus === "VERIFIED";

  // For the progress ring: 0% when KYC not verified or no eligibility, otherwise
  // (verifiedDirectReferrals / nextThreshold) capped at 100%.
  const nextThreshold =
    currentLevel >= MAX_LEVEL
      ? levels[MAX_LEVEL - 1].threshold
      : levels[currentLevel]?.threshold ?? 0;
  const progressPct = !kycVerified || !eligible
    ? 0
    : nextThreshold === 0
      ? 100
      : Math.min((s.verifiedDirectReferrals / nextThreshold) * 100, 100);

  const radius = 105;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPct / 100) * circumference;

  // Friendly "next milestone" text for the progress card.
  let nextMilestone: string;
  if (isMaxLevel) {
    nextMilestone = `You are at the top — Level ${MAX_LEVEL} (12+ verified direct referrals).`;
  } else if (!kycVerified) {
    const kycMessages: Record<KycStatus, string> = {
      NOT_STARTED:
        "Complete KYC verification to unlock the referral program. Once verified, make an investment to start at Level 1.",
      PENDING:
        "Your KYC application is under review. You'll be able to invest and unlock Level 1 once it's verified.",
      REJECTED:
        "Your KYC application was rejected. Contact support to resubmit before you can participate.",
      VERIFIED: "",
    };
    nextMilestone = kycMessages[kycStatus];
  } else if (!eligible) {
    nextMilestone =
      "Make an investment to unlock your referral program. Once your investment is verified, your referral code will be generated and you'll start at Level 1.";
  } else if (currentLevel === 0) {
    // Should not happen if eligible, but guard against it.
    nextMilestone = "Reach 3 verified direct referrals to unlock Level 2.";
  } else {
    const remaining = nextThreshold - s.verifiedDirectReferrals;
    nextMilestone = `${remaining} more verified direct referral${
      remaining === 1 ? "" : "s"
    } to unlock Level ${currentLevel + 1}.`;
  }

  return (
    <main className="h-full px-4 text-white md:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="rounded-[32px] px-6 py-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-orange-400">
              Reward Section
            </p>

            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Commission Program
            </h1>
          </motion.div>
        </div>

        {/* Main Level Card */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#111113] p-6 shadow-2xl md:p-12"
        >
          {/* Background decoration */}
          <div className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

          {/* KYC Status Banner */}
          {!kycVerified && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex flex-col sm:flex-row sm:items-center items-start gap-3 rounded-xl border p-4"
              style={
                kycStatus === "PENDING"
                  ? { borderColor: "rgba(251, 191, 36, 0.3)", backgroundColor: "rgba(251, 191, 36, 0.1)" }
                  : kycStatus === "REJECTED"
                    ? { borderColor: "rgba(239, 68, 68, 0.3)", backgroundColor: "rgba(239, 68, 68, 0.1)" }
                    : { borderColor: "rgba(148, 163, 184, 0.3)", backgroundColor: "rgba(148, 163, 184, 0.1)" }
              }
            >
              {kycStatus === "PENDING" && (
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-amber-400" />
              )}
              {kycStatus === "REJECTED" && (
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-400" />
              )}
              {kycStatus === "NOT_STARTED" && (
                <ShieldCheck className="h-5 w-5 flex-shrink-0 text-zinc-400" />
              )}
              <div className="flex-1">
                <p className="font-semibold text-white">
                  {kycStatus === "PENDING"
                    ? "KYC Under Review"
                    : kycStatus === "REJECTED"
                      ? "KYC Rejected"
                      : "KYC Required"}
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  {kycStatus === "PENDING"
                    ? "Your KYC application is being reviewed. You'll unlock the referral program once verified."
                    : kycStatus === "REJECTED"
                      ? "Your KYC application was rejected. Please contact support to resubmit."
                      : "Complete KYC verification before you can participate in the referral program and make investments."}
                </p>
              </div>
              <span className="mt-2 flex-shrink-0 self-start rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider sm:mt-0 sm:self-auto"
                style={
                  kycStatus === "PENDING"
                    ? { backgroundColor: "rgba(251, 191, 36, 0.2)", color: "#FBBF24" }
                    : kycStatus === "REJECTED"
                      ? { backgroundColor: "rgba(239, 68, 68, 0.2)", color: "#EF4444" }
                      : { backgroundColor: "rgba(148, 163, 184, 0.2)", color: "#94A3B8" }
                }
              >
                {kycStatus}
              </span>
            </motion.div>
          )}

          <div className="relative grid items-center gap-12 lg:grid-cols-2">
            {/* Circular Progress */}
            <div className="flex flex-col items-center">
              <div className="relative h-[240px] w-[240px] md:h-[280px] md:w-[280px]">
                <div className="absolute inset-6 rounded-full bg-orange-400/10 blur-2xl" />

                <svg
                  className="relative h-full w-full -rotate-90"
                  viewBox="0 0 240 240"
                >
                  <circle
                    cx="120"
                    cy="120"
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    className="text-white/10"
                  />

                  <motion.circle
                    cx="120"
                    cy="120"
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    strokeLinecap="round"
                    className={
                      isMaxLevel ? "text-emerald-400" : "text-orange-400"
                    }
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.8, ease: "easeInOut" }}
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.div
                    key={currentLevel}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-4xl font-black text-white"
                  >
                    Level {currentLevel}
                  </motion.div>

                  <p className="mt-1 text-sm font-semibold uppercase tracking-widest text-orange-400">
                    Current Level
                  </p>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-zinc-400">
                  {s.verifiedDirectReferrals} verified direct referral
                  {s.verifiedDirectReferrals === 1 ? "" : "s"}
                  {currentLevel < MAX_LEVEL && eligible ? (
                    <>
                      {" "}
                      / {nextThreshold} for Level {currentLevel + 1}
                    </>
                  ) : null}
                </p>
                <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-zinc-300 md:text-lg">
                  {nextMilestone}
                </p>
              </div>
            </div>

            {/* Levels */}
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold">Reward Levels</h2>
                <p className="mt-1 text-sm text-zinc-400">
                  {!kycVerified
                    ? "Complete KYC verification first, then make an investment to start at Level 1."
                    : eligible
                      ? "Each level you reach unlocks a deeper commission tree."
                      : "Make an investment to start earning commissions at Level 1."}
                </p>
              </div>

              <div className="space-y-3">
                {levels.map((item, index) => {
                  const unlocked = currentLevel >= item.level;
                  const current = currentLevel === item.level;

                  return (
                    <motion.div
                      key={item.level}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className={`relative flex items-center gap-4 rounded-2xl border p-4 transition-all ${
                        current
                          ? "border-orange-400/20 bg-orange-400/[0.04]"
                          : unlocked
                            ? "border-emerald-400/10 bg-emerald-400/[0.03] hover:bg-emerald-400/[0.06]"
                            : "border-white/10 bg-white/[0.02] hover:bg-white/5"
                      }`}
                    >
                      {/* Level circle */}
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 font-bold ${
                          current
                            ? "border-orange-400/20 bg-orange-400/10 text-orange-400"
                            : unlocked
                              ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-400"
                              : "border-white/10 bg-white/5 text-zinc-500"
                        }`}
                      >
                        {unlocked ? <Check size={20} /> : <Lock size={18} />}
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold">Level {item.level}</h3>

                          <span
                            className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              item.rate >= 0.5
                                ? "bg-orange-400/10 text-orange-300"
                                : "bg-emerald-400/10 text-emerald-300"
                            }`}
                            title={`Commission rate for this level`}
                          >
                            {fmtRate(item.rate)}
                          </span>

                          {current && (
                            <span className="rounded-full bg-orange-400/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-300">
                              Current
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-sm text-zinc-400">
                          {item.description}
                          {item.level > 1 ? (
                            <>
                              {" "}
                              <span className="text-zinc-500">
                                (min {item.threshold} verified direct refs)
                              </span>
                            </>
                          ) : null}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Rules */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-8 rounded-[32px] border border-white/10 bg-[#111113] p-6 md:p-10"
        >
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-400/10 text-orange-400">
              <TrendingUp size={24} />
            </div>

            <div>
              <h2 className="text-2xl font-bold">Commission Rules</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Important information about commission eligibility
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Rule
              number="01"
              title="KYC Verification Required"
              text="You must complete KYC verification before you can make any deposit or investment. Without verified KYC, you cannot participate in the referral program or earn commissions."
            />
            <Rule
              number="02"
              title="Investment Required"
              text="After KYC is verified, you must have a verified investment of your own to unlock your referral code and become eligible to earn any commission."
            />
            <Rule
              number="03"
              title="Level 1 Commission"
              text={`After your investment is verified, you earn ${
                s.rates.l1 ? fmtRate(s.rates.l1) : "0.50%"
              } on every verified direct (L1) referral's qualifying investment.`}
            />
            <Rule
              number="04"
              title="Level 2 Commission"
              text={`To earn Level 2 (${
                s.rates.l2 ? fmtRate(s.rates.l2) : "0.25%"
              }), you need at least ${
                s.thresholds.l2
              } verified direct referrals.`}
            />
            <Rule
              number="05"
              title="Level 3 Commission"
              text={`To earn Level 3 (${
                s.rates.l3 ? fmtRate(s.rates.l3) : "0.25%"
              }), you need at least ${
                s.thresholds.l3
              } verified direct referrals.`}
            />
            <Rule
              number="06"
              title="Level 4 Commission"
              text={`To earn Level 4 (${
                s.rates.l4 ? fmtRate(s.rates.l4) : "0.25%"
              }), you need at least ${
                s.thresholds.l4
              } verified direct referrals.`}
            />
            <Rule
              number="07"
              title="Level 5 Commission"
              text={`To earn Level 5 (${
                s.rates.l5 ? fmtRate(s.rates.l5) : "0.25%"
              }), you need at least ${
                s.thresholds.l5
              } verified direct referrals.`}
            />
            <div className="md:col-span-2">
              <Rule
                number="08"
                title="Monthly Commission"
                text="The commission scheduler runs once a month. Every commission is calculated atomically and stored as an immutable snapshot — the rate, amount and qualifying direct-referral count are frozen at the time of payment."
              />
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}

/* ---------------------------------- */
/* Rule Component                     */
/* ---------------------------------- */

function Rule({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-colors hover:bg-white/5"
    >
      <div className="flex gap-4">
        <span className="text-sm font-bold text-orange-400">{number}</span>

        <div>
          <h3 className="font-semibold text-white">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-zinc-400">{text}</p>
        </div>
      </div>
    </motion.div>
  );
}
