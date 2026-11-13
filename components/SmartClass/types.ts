import type { LucideIcon } from "lucide-react";

/** A single "why Pennytor" capability shown in the feature strip. */
export type CourseFeature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

/** One module in the learning path. */
export type CurriculumTopic = {
  number: string;
  title: string;
  detail: string;
  points: string[];
};

/** Short proof point rendered under the hero copy. */
export type HeroStat = {
  value: string;
  label: string;
};

export type SmartClassProps = {
  /** Called by the enquiry CTAs. Defaults to the contact page when omitted. */
  onContact?: () => void;
  className?: string;
};
