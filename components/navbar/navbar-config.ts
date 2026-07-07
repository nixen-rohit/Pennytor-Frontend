import { type Variants } from "framer-motion";
import {
  insuranceProducts,
  renewPolicy,
  claim,
  support,
  talkToExpert,
  CTA,
  brand,
  promoCard,
  type NavMenu,
} from "@/components/Data/Navbardata";

export const products = insuranceProducts;
export const renew = renewPolicy;
export const claimMenu = claim;
export const supportMenu = support;
export const expertMenu = talkToExpert;
export const ctaData = CTA;
export const brandData = brand;
export const promo = promoCard;

export const menuMap: Record<string, NavMenu> = {
  renew: renew,
  claims: claimMenu,
  support: supportMenu,
  expert: expertMenu,
};

export const navItems = [
  { id: "products", label: "Insurance Products" },
  { id: "renew", label: "Renew Policy" },
  { id: "claims", label: "Claims" },
  { id: "support", label: "Support" },
  { id: "expert", label: "Talk to Expert" },
] as const;

export type NavItemId = (typeof navItems)[number]["id"];

export const panelVariants: Variants = {
  hidden: { opacity: 0, y: -6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.18, ease: "easeOut" },
  },
  exit: { opacity: 0, y: -6, transition: { duration: 0.12, ease: "easeIn" } },
};

export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

export const categoryContentVariants = {
  hidden: { opacity: 0, x: -4 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, x: 4, transition: { duration: 0.12 } },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.025, duration: 0.2 },
  }),
};
