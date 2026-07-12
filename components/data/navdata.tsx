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
} from "react-icons/fa";
 
export interface NavLink {
  label: string;
  href: string;
  icon?: IconType;
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

export interface BrandType {
  icon: string;
  name: string;
}

export interface MegaLink {
  label: string;
  href: string;
  icon?: IconType;
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

export interface PromoCardData {
  badge: string;
  headline: string;
  description: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  learnMoreLabel: string;
  learnMoreHref: string;
}

export const insuranceProducts: ProductColumn[] = [
  {
    heading: "Health Insurance",
    icon: FaHeartbeat,
    items: [
      { label: "Individual Health Insurance", href: "/insurance/health/individual", description: "Comprehensive coverage tailored for individuals" },
      { label: "Family Floater Plan", href: "/insurance/health/family-floater", description: "Protect your entire family with a single plan" },
      { label: "COVID-19 Health Cover", href: "/insurance/health/covid", description: "Pandemic-specific health protection" },
      { label: "Health Insurance for NRIs", href: "/insurance/health/nri", description: "Health cover designed for non-resident Indians" },
      { label: "Compare Health Insurance", href: "/insurance/health/compare", description: "Side-by-side comparison of top health plans" },
    ],
  },
  {
    heading: "Life Insurance",
    icon: FaUserShield,
    items: [
      { label: "Term Insurance", href: "/insurance/life/term", description: "High life cover at affordable premiums" },
      { label: "ULIP Plans", href: "/insurance/life/ulip", description: "Investment-linked insurance for wealth growth" },
      { label: "Endowment Plans", href: "/insurance/life/endowment", description: "Savings plus life protection combined" },
      { label: "e-Term Insurance", href: "/insurance/life/e-term", description: "Fully digital term plan with instant approval" },
      { label: "Tax Saving Plans", href: "/insurance/life/tax-saving", description: "Save taxes under Section 80C and 10(10D)" },
      { label: "Guaranteed Income Plans", href: "/insurance/life/guaranteed-income", description: "Assured regular income streams" },
      { label: "Annuity Plans", href: "/insurance/life/annuity", description: "Steady post-retirement pension payouts" },
      { label: "Group Life Insurance", href: "/insurance/life/group", description: "Life cover for corporate and group members" },
      { label: "Single Premium Plans", href: "/insurance/life/single-premium", description: "One-time payment with full life coverage" },
    ],
  },
  
   
  {
    heading: "Home & Other Insurance",
    icon: FaHome,
    items: [
      { label: "Home Insurance", href: "/insurance/home/home", description: "Protect your home and belongings" },
      { label: "Fire Insurance", href: "/insurance/home/fire", description: "Coverage against fire damage" },
      { label: "Shopkeeper Insurance", href: "/insurance/home/shopkeeper", description: "Protection for retail businesses" },
      { label: "Rural Insurance", href: "/insurance/home/rural", description: "Insurance solutions for rural areas" },
      { label: "Weather Insurance", href: "/insurance/home/weather", description: "Coverage against weather-related losses" },
      { label: "Compare Home Insurance", href: "/insurance/home/compare", description: "Compare home insurance policies" },
      { label: "Landlord Insurance", href: "/insurance/home/landlord", description: "Protection for property owners" },
    ],
  },
];

export const renewPolicy: NavMenu = {
  label: "Renew Your Policy",
  icon: FaRedo,
  items: [
    { label: "Car Insurance Renewal", href: "/renew/car", description: "Renew your car policy in minutes" },
    { label: "Bike Insurance Renewal", href: "/renew/bike", description: "Instant two-wheeler policy renewal" },
    { label: "Health Insurance Renewal", href: "/renew/health", description: "Continue your health coverage seamlessly" },
    { label: "Life Insurance Renewal", href: "/renew/life", description: "Keep your life cover active" },
    { label: "Travel Insurance Renewal", href: "/renew/travel", description: "Renew travel insurance before trips" },
    { label: "Renew via Policy Number", href: "/renew/policy-number", description: "Quick renewal using your policy number" },
  ],
};

export const claim: NavMenu = {
  label: "Claim",
  icon: FaFileInvoice,
  items: [
    { label: "Motor Insurance Claim", href: "/claim/motor", description: "File a car or bike insurance claim" },
    { label: "Health Insurance Claim", href: "/claim/health", description: "Cashless or reimbursement claim" },
    { label: "Life Insurance Claim", href: "/claim/life", description: "Nominee claim assistance" },
    { label: "Travel Insurance Claim", href: "/claim/travel", description: "Claim for trip-related losses" },
    { label: "Track Claim Status", href: "/claim/track", description: "Check your claim progress" },
  ],
};

export const support: NavMenu = {
  label: "Support",
  icon: FaHeadset,
  items: [
    { label: "FAQs", href: "/support/faqs", description: "Find answers to common questions" },
    { label: "Contact Us", href: "/support/contact", description: "Get in touch with our team" },
    { label: "Branch Locator", href: "/support/branch-locator", description: "Find a branch near you" },
    { label: "Grievance Redressal", href: "/support/grievance", description: "Lodge a complaint or feedback" },
    { label: "Download Forms", href: "/support/forms", description: "Download insurance forms" },
    { label: "Policy Wording", href: "/support/policy-wording", description: "View detailed policy documents" },
  ],
};

export const talkToExpert: NavMenu = {
  label: "Talk to Expert",
  icon: FaComments,
  items: [
    { label: "Call Us", href: "tel:18001234567", icon: FaPhoneAlt, description: "Speak to an agent right now" },
    { label: "Chat on WhatsApp", href: "https://wa.me/911234567890", icon: FaWhatsapp, description: "Quick support via WhatsApp" },
    { label: "Schedule a Callback", href: "/talk-to-expert/callback", icon: FaCalendarCheck, description: "We'll call you at your convenience" },
  ],
};


export const promoCard: PromoCardData = {
  badge: "Special Offer",
  headline: "Get up to 85% discount on Car Insurance",
  description: "Protect your vehicle with our comprehensive insurance plans starting at just ₹2,072/year.",
  features: [
    "Instant Policy Issuance",
    "Zero Paperwork",
    "Trusted by 10M+ Customers",
  ],
  ctaLabel: "Get Quote",
  ctaHref: "/get-quote",
  learnMoreLabel: "Learn More",
  learnMoreHref: "/insurance/motor/car",
};



export const CTA: CTAType = {
  label: "Sign Up",
  href: "/login",
};
 

export const NAV: NavItem[] = [
  {
    label: "Services",
    mega: {
      columns: insuranceProducts.map((col) => ({
        heading: col.heading,
        links: col.items.map((item) => ({
          label: item.label,
          href: item.href,
          description: item.description,
        })),
      })),
    },
  },
  {
    label: "Renew Your Policy",
    mega: {
      columns: [
        {
          heading: "Renewal Options",
          links: renewPolicy.items,
        },
      ],
    },
  },
  {
    label: "Claim",
    mega: {
      columns: [
        {
          heading: "Claims",
          links: claim.items,
        },
      ],
    },
  },
  {
    label: "Support",
    mega: {
      columns: [
        {
          heading: "Help & Support",
          links: support.items,
        },
      ],
    },
  },
  {
    label: "Contact Us",
    mega: {
      columns: [
        {
          heading: "Get in Touch",
          links: talkToExpert.items,
        },
      ],
    },
  },
];
