"use client";

import { motion } from "framer-motion";
import { Check, Lock, TrendingUp } from "lucide-react";

interface CommissionLevel {
  level: number;
  description: string;
}

const levels: CommissionLevel[] = [
  {
    level: 1,
    description: "Requires an investment in any scheme",
  },
  {
    level: 2,
    description:
      "At least 3 direct referrals must make an investment in any scheme",
  },
  {
    level: 3,
    description:
      "At least 6 direct referrals must make an investment in any scheme",
  },
  {
    level: 4,
    description: "At least 9 direct referrals are required",
  },
  {
    level: 5,
    description: "At least 12 direct referrals are required",
  },
];

// Change this according to the user's actual referrals
const currentReferrals = 7;

export default function Commission() {
  const currentLevel =
    currentReferrals >= 12
      ? 5
      : currentReferrals >= 9
        ? 4
        : currentReferrals >= 6
          ? 3
          : currentReferrals >= 3
            ? 2
            : currentReferrals >= 1
              ? 1
              : 0;

  const isMaxLevel = currentLevel === 5;

  const progress =
    currentLevel === 0 ? 0 : Math.min((currentReferrals / 12) * 100, 100);

  const radius = 105;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <main className="h-full px-4  text-white md:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className=" rounded-[32px] px-6 py-10 text-center">
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

          <div className="relative grid items-center gap-12 lg:grid-cols-2">
            {/* Circular Progress */}
            <div className="flex flex-col items-center">
              <div className="relative h-[280px] w-[280px]">
                {/* Outer glow */}
                <div className="absolute inset-6 rounded-full bg-orange-400/10 blur-2xl" />

                <svg
                  className="relative h-full w-full -rotate-90"
                  viewBox="0 0 240 240"
                >
                  {/* Background circle */}
                  <circle
                    cx="120"
                    cy="120"
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    className="text-white/10"
                  />

                  {/* Animated progress circle */}
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
                    initial={{
                      strokeDashoffset: circumference,
                    }}
                    animate={{
                      strokeDashoffset,
                    }}
                    transition={{
                      duration: 1.8,
                      ease: "easeInOut",
                    }}
                  />
                </svg>

                {/* Center */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.div
                    key={currentLevel}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-4xl font-black text-white"
                  >
                    Level {currentLevel || 0}
                  </motion.div>

                  <p className="mt-1 text-sm font-semibold uppercase tracking-widest text-orange-400">
                    Current Level
                  </p>
                </div>
              </div>

              {/* Progress text */}
              <div className="mt-6 text-center">
                <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-400 md:text-lg">
                  Grow your direct referrals and unlock higher commission levels
                  as your network expands.
                </p>
              </div>
            </div>

            {/* Levels */}
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold">Reward Levels</h2>
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
                      transition={{
                        delay: index * 0.1,
                        duration: 0.5,
                      }}
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
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold">Level {item.level}</h3>

                          {current && (
                            <span className="rounded-full bg-orange-400/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-300">
                              Current
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-sm text-zinc-400">
                          {item.description}
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
          className="mt-8 rounded-[32px] border border-white/10 bg-[#111113] p-6 md:p-10 "
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

          <div className="grid gap-4 md:grid-cols-2  ">
            {/* Rule 1 */}
            <Rule
              number="01"
              title="Investment Required"
              text="Unless one makes his investment, he is not eligible to get any kind of commission."
            />

            {/* Rule 2 */}
            <Rule
              number="02"
              title="Level 1 Commission"
              text="After making his investment, he can take commission on his direct reference or Level 1."
            />

            {/* Rule 3 */}
            <Rule
              number="03"
              title="Level 2 Commission"
              text="To earn Level 2 Commission, it is mandatory for the individual to secure investments from at least three clients through direct referrals."
            />

            {/* Rule 4 */}
            <Rule
              number="04"
              title="Level 3 Commission"
              text="To earn the Level 3 commission, it is mandatory to have investments from at least 6 direct referrals."
            />

            {/* Rule 5 */}
            <Rule
              number="05"
              title="Level 4 Commission"
              text="To receive the Level 4 commission, a minimum of 9 direct referrals is required."
            />

            {/* Rule 6 */}
            <Rule
              number="06"
              title="Level 5 Commission"
              text="To receive the Level 5 commission, a minimum of 12 direct referrals is required."
            />

            {/* Rule 7 */}
            <div className="md:col-span-2">
              <Rule
                number="07"
                title="Monthly Commission"
                text="Everybody will receive all commissions every month for as long as your customers' investment remains with us."
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
