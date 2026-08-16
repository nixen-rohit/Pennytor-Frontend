// components/data/navdata.tsx

import type { IconType } from "react-icons";
import {
  FaHeartbeat,
  FaUserShield,
  FaHome,
  FaPhoneAlt,
  FaWhatsapp,
  FaCalendarCheck,
  FaRedo,
  FaFileInvoice,
  FaHeadset,
  FaComments,
  FaUserFriends,
  FaShieldVirus,
  FaGlobeAmericas,
  FaBalanceScale,
  FaChartLine,
  FaPiggyBank,
  FaBolt,
  FaMoneyCheckAlt,
  FaUsers,
  FaFileContract,
  FaHandHoldingUsd,
  FaLayerGroup,
  FaCarCrash,
  FaFireExtinguisher,
  FaStore,
  FaTractor,
  FaCloudSunRain,
  FaBalanceScaleLeft,
  FaKey,
  FaCarSide,
  FaMotorcycle,
  FaClinicMedical,
  FaSuitcaseRolling,
  FaSearchLocation,
  FaQuestionCircle,
  FaMapMarkerAlt,
  FaExclamationCircle,
  FaFileDownload,
  FaFileAlt,
  FaMapPin,
  FaListAlt,
  FaTrophy,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaCalculator } from "react-icons/fa";
import { BsFillPiggyBankFill } from "react-icons/bs";
import { FaHandHoldingHeart } from "react-icons/fa6";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { FaMoneyBillTrendUp } from "react-icons/fa6";

export interface NavLink {
  label: string;
  href: string;
  icon?: IconType;
  color?: string; // Tailwind bg + text pair, Dhan-style soft icon chip
  description?: string;
}

export interface NavMenu {
  label: string;
  items: NavLink[];
  icon?: IconType;
}

export interface ProductColumn {
  heading: string;
  icon: IconType;
  items: NavLink[];
}

export interface CTAType {
  href: string;
  label: string;
}

export interface MegaLink {
  label: string;
  href: string;
  icon?: IconType;
  color?: string;
  description?: string;
  redirect?: boolean;
}

export interface MegaMenuColumn {
  heading: string;
  links: MegaLink[];
}

export interface MegaMenuData {
  columns: MegaMenuColumn[];
}

export interface NavItem {
  label: string;
  href?: string;
  mega?: MegaMenuData;
  redirect?: boolean;
}

export const Schemes: NavMenu = {
  label: "Schemes",
  icon: FaFileInvoice,
  items: [
    {
      label: "Gullak Scheme",
      href: "/schemes/gullak-scheme",
      icon: BsFillPiggyBankFill,
      color: "bg-amber-50 text-amber-500",
      description: "For Daily Deposite",
    },
    {
      label: "SIP For Childrens",
     href: "/schemes/sip-child-scheme",
      icon: FaHandHoldingHeart,
      color: "bg-rose-50 text-rose-500",
      description: "Monthly Saving For Your Childrens",
    },
    {
      label: "Fixed Deposite (SWP)",
     href: "/schemes/fixed-swp-scheme",
      icon: RiMoneyRupeeCircleFill,
      color: "bg-green-50 text-green-500",
      description: " Save and Earn More",
    },
    {
      label: "Investment Fund",
      href: "/schemes/investment-fund-scheme",
      icon: FaMoneyBillTrendUp,
      color: "bg-teal-50 text-teal-500",
      description: "For long term Investment",
    },
     
  ],
};

export const insuranceProducts: ProductColumn[] = [
  {
    heading: "Health Insurance",
    icon: FaHeartbeat,
    items: [
      {
        label: "Individual Health Insurance",
        href: "/insurance/health/individual",
        icon: FaHeartbeat,
        color: "bg-rose-50 text-rose-500",
        description: "Comprehensive coverage tailored for individuals",
      },
      {
        label: "Family Floater Plan",
        href: "/insurance/health/family-floater",
        icon: FaUserFriends,
        color: "bg-orange-50 text-orange-500",
        description: "Protect your entire family with a single plan",
      },
      {
        label: "COVID-19 Health Cover",
        href: "/insurance/health/covid",
        icon: FaShieldVirus,
        color: "bg-emerald-50 text-emerald-500",
        description: "Pandemic-specific health protection",
      },
      {
        label: "Health Insurance for NRIs",
        href: "/insurance/health/nri",
        icon: FaGlobeAmericas,
        color: "bg-sky-50 text-sky-500",
        description: "Health cover designed for non-resident Indians",
      },
      {
        label: "Compare Health Insurance",
        href: "/insurance/health/compare",
        icon: FaBalanceScale,
        color: "bg-violet-50 text-violet-500",
        description: "Side-by-side comparison of top health plans",
      },
    ],
  },
  {
    heading: "Life Insurance",
    icon: FaUserShield,
    items: [
      {
        label: "Term Insurance",
        href: "/insurance/life/term",
        icon: FaUserShield,
        color: "bg-blue-50 text-blue-500",
        description: "High life cover at affordable premiums",
      },
      {
        label: "ULIP Plans",
        href: "/insurance/life/ulip",
        icon: FaChartLine,
        color: "bg-indigo-50 text-indigo-500",
        description: "Investment-linked insurance for wealth growth",
      },
      {
        label: "Endowment Plans",
        href: "/insurance/life/endowment",
        icon: FaPiggyBank,
        color: "bg-amber-50 text-amber-500",
        description: "Savings plus life protection combined",
      },
      {
        label: "e-Term Insurance",
        href: "/insurance/life/e-term",
        icon: FaBolt,
        color: "bg-yellow-50 text-yellow-600",
        description: "Fully digital term plan with instant approval",
      },
      {
        label: "Tax Saving Plans",
        href: "/insurance/life/tax-saving",
        icon: FaMoneyCheckAlt,
        color: "bg-teal-50 text-teal-500",
        description: "Save taxes under Section 80C and 10(10D)",
      },
      {
        label: "Guaranteed Income Plans",
        href: "/insurance/life/guaranteed-income",
        icon: FaHandHoldingUsd,
        color: "bg-lime-50 text-lime-600",
        description: "Assured regular income streams",
      },
      {
        label: "Annuity Plans",
        href: "/insurance/life/annuity",
        icon: FaFileContract,
        color: "bg-cyan-50 text-cyan-500",
        description: "Steady post-retirement pension payouts",
      },
      {
        label: "Group Life Insurance",
        href: "/insurance/life/group",
        icon: FaUsers,
        color: "bg-purple-50 text-purple-500",
        description: "Life cover for corporate and group members",
      },
      {
        label: "Single Premium Plans",
        href: "/insurance/life/single-premium",
        icon: FaLayerGroup,
        color: "bg-pink-50 text-pink-500",
        description: "One-time payment with full life coverage",
      },
    ],
  },
  {
    heading: "Home & Other Insurance",
    icon: FaHome,
    items: [
      {
        label: "Home Insurance",
        href: "/insurance/home/home",
        icon: FaHome,
        color: "bg-orange-50 text-orange-500",
        description: "Protect your home and belongings",
      },
      {
        label: "Fire Insurance",
        href: "/insurance/home/fire",
        icon: FaFireExtinguisher,
        color: "bg-red-50 text-red-500",
        description: "Coverage against fire damage",
      },
      {
        label: "Shopkeeper Insurance",
        href: "/insurance/home/shopkeeper",
        icon: FaStore,
        color: "bg-amber-50 text-amber-600",
        description: "Protection for retail businesses",
      },
      {
        label: "Rural Insurance",
        href: "/insurance/home/rural",
        icon: FaTractor,
        color: "bg-green-50 text-green-600",
        description: "Insurance solutions for rural areas",
      },
      {
        label: "Weather Insurance",
        href: "/insurance/home/weather",
        icon: FaCloudSunRain,
        color: "bg-sky-50 text-sky-500",
        description: "Coverage against weather-related losses",
      },
      {
        label: "Compare Home Insurance",
        href: "/insurance/home/compare",
        icon: FaBalanceScaleLeft,
        color: "bg-violet-50 text-violet-500",
        description: "Compare home insurance policies",
      },
      {
        label: "Landlord Insurance",
        href: "/insurance/home/landlord",
        icon: FaKey,
        color: "bg-indigo-50 text-indigo-500",
        description: "Protection for property owners",
      },
    ],
  },
];

export const renewPolicy: NavMenu = {
  label: "Renew Your Policy",
  icon: FaRedo,
  items: [
    {
      label: "Car Insurance Renewal",
      href: "/renew/car",
      icon: FaCarSide,
      color: "bg-blue-50 text-blue-500",
      description: "Renew your car policy in minutes",
    },
    {
      label: "Bike Insurance Renewal",
      href: "/renew/bike",
      icon: FaMotorcycle,
      color: "bg-orange-50 text-orange-500",
      description: "Instant two-wheeler policy renewal",
    },
    {
      label: "Health Insurance Renewal",
      href: "/renew/health",
      icon: FaClinicMedical,
      color: "bg-rose-50 text-rose-500",
      description: "Continue your health coverage seamlessly",
    },
    {
      label: "Life Insurance Renewal",
      href: "/renew/life",
      icon: FaUserShield,
      color: "bg-indigo-50 text-indigo-500",
      description: "Keep your life cover active",
    },
    {
      label: "Travel Insurance Renewal",
      href: "/renew/travel",
      icon: FaSuitcaseRolling,
      color: "bg-teal-50 text-teal-500",
      description: "Renew travel insurance before trips",
    },
    {
      label: "Renew via Policy Number",
      href: "/renew/policy-number",
      icon: FaSearchLocation,
      color: "bg-violet-50 text-violet-500",
      description: "Quick renewal using your policy number",
    },
  ],
};

export const claim: NavMenu = {
  label: "Claim",
  icon: FaFileInvoice,
  items: [
    {
      label: "Motor Insurance Claim",
      href: "/claim/motor",
      icon: FaCarCrash,
      color: "bg-red-50 text-red-500",
      description: "File a car or bike insurance claim",
    },
    {
      label: "Health Insurance Claim",
      href: "/claim/health",
      icon: FaHeartbeat,
      color: "bg-rose-50 text-rose-500",
      description: "Cashless or reimbursement claim",
    },
    {
      label: "Life Insurance Claim",
      href: "/claim/life",
      icon: FaUserShield,
      color: "bg-indigo-50 text-indigo-500",
      description: "Nominee claim assistance",
    },
    {
      label: "Travel Insurance Claim",
      href: "/claim/travel",
      icon: FaSuitcaseRolling,
      color: "bg-teal-50 text-teal-500",
      description: "Claim for trip-related losses",
    },
    {
      label: "Track Claim Status",
      href: "/claim/track",
      icon: FaMapMarkerAlt,
      color: "bg-amber-50 text-amber-600",
      description: "Check your claim progress",
    },
  ],
};

export const support: NavMenu = {
  label: "Support",
  icon: FaHeadset,
  items: [
    {
      label: "FAQs",
      href: "/support/faqs",
      icon: FaQuestionCircle,
      color: "bg-blue-50 text-blue-500",
      description: "Find answers to common questions",
    },
    {
      label: "Branch Locator",
      href: "/support/branch-locator",
      icon: FaMapPin,
      color: "bg-orange-50 text-orange-500",
      description: "Find a branch near you",
    },
    {
      label: "Grievance Redressal",
      href: "/support/grievance",
      icon: FaExclamationCircle,
      color: "bg-red-50 text-red-500",
      description: "Lodge a complaint or feedback",
    },
    {
      label: "Download Forms",
      href: "/support/forms",
      icon: FaFileDownload,
      color: "bg-violet-50 text-violet-500",
      description: "Download insurance forms",
    },
    {
      label: "Policy Wording",
      href: "/support/policy-wording",
      icon: FaFileAlt,
      color: "bg-teal-50 text-teal-500",
      description: "View detailed policy documents",
    },
  ],
};

const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER?.trim() || "";

const whatsappUrl = `https://wa.me/${phoneNumber}`;
export const talkToExpert: NavMenu = {
  label: "Talk to Expert",
  icon: FaComments,
  items: [
    {
      label: "Email Us",
      href: "/contact-us",
      icon: MdEmail,
      color: "bg-blue-50 text-blue-500",
      description: "Get in Touch within 24 Hours",
    },
    {
      label: "Call Us",
      href: whatsappUrl,
      icon: FaPhoneAlt,
      color: "bg-blue-50 text-blue-500",
      description: "Speak to an agent right now",
    },
    {
      label: "Chat on WhatsApp",
      href: whatsappUrl,
      icon: FaWhatsapp,
      color: "bg-green-50 text-green-600",
      description: "Quick support via WhatsApp",
    },
    {
      label: "Schedule a Callback",
      href: whatsappUrl,
      icon: FaCalendarCheck,
      color: "bg-amber-50 text-amber-600",
      description: "We'll call you at your convenience",
    },
  ],
};

export const CTA: CTAType = { label: "Sign Up", href: "/login" };

export const NAV: NavItem[] = [
  {
    label: "Schemes",
    mega: { columns: [{ heading: "Schemes", links: Schemes.items }] },
  },

  {
    label: "Services",
    mega: {
      columns: insuranceProducts.map((col) => ({
        heading: col.heading,
        links: col.items.map((item) => ({
          label: item.label,
          href: item.href,
          icon: item.icon,
          color: item.color,
          description: item.description,
        })),
      })),
    },
  },
  {
    label: "Renew Your Policy",
    mega: {
      columns: [{ heading: "Renewal Options", links: renewPolicy.items }],
    },
  },
  {
    label: "Claim",
    mega: { columns: [{ heading: "Claims", links: claim.items }] },
  },
  {
    label: "Support",
    mega: { columns: [{ heading: "Help & Support", links: support.items }] },
  },
  {
    label: "Contact Us",
    mega: { columns: [{ heading: "Get in Touch", links: talkToExpert.items }] },
  },
];
