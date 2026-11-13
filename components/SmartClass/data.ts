import {
  BarChart3,
  BookOpen,
  GraduationCap,
  Users,
} from "lucide-react";

import type { CourseFeature, CurriculumTopic, HeroStat } from "./types";

export const FEATURES: CourseFeature[] = [
  {
    icon: GraduationCap,
    title: "Step-by-step learning",
    description:
      "Start with the basics and build your market knowledge one concept at a time.",
  },
  {
    icon: BookOpen,
    title: "Practical examples",
    description:
      "Understand market ideas with relatable examples and guided explanations.",
  },
  {
    icon: BarChart3,
    title: "Market concepts",
    description:
      "Learn how charts, investing, trading and risk management fit together.",
  },
  {
    icon: Users,
    title: "Live interaction",
    description:
      "Ask questions, discuss concepts and learn with a supportive community.",
  },
];

export const STATS: HeroStat[] = [
  { value: "Live", label: "Instructor-led sessions" },
  { value: "Hindi + English", label: "Bilingual learning" },
  { value: "Beginner friendly", label: "Start with the basics" },
];

export const HIGHLIGHTS: string[] = [
  "Beginner-friendly lessons",
  "Hindi + English",
  "Live Q&A",
  "Practical examples",
];

export const CURRICULUM: CurriculumTopic[] = [
  {
    number: "01",
    title: "Stock market foundations",
    detail:
      "Exchanges, indices, shares, market participants and essential terminology.",
    points: ["How exchanges work", "Reading an index", "Common market terms"],
  },
  {
    number: "02",
    title: "Investing essentials",
    detail:
      "Long-term thinking, diversification, compounding and portfolio basics.",
    points: ["Goal-based investing", "Diversification", "Power of compounding"],
  },
  {
    number: "03",
    title: "Trading concepts",
    detail:
      "Reading charts, understanding trends and exploring common order types.",
    points: ["Chart reading", "Trends and levels", "Order types"],
  },
  {
    number: "04",
    title: "Risk management",
    detail:
      "Position sizing, risk-reward, discipline and protecting your capital.",
    points: ["Position sizing", "Risk-reward", "Staying disciplined"],
  },
];

/** Bar heights (%) for the illustrative market chart. */
export const MARKET_BARS: number[] = [
  30, 43, 37, 54, 47, 62, 50, 68, 60, 77, 69, 86, 74, 94, 82, 100, 91, 112,
  103, 124, 115, 137,
];
