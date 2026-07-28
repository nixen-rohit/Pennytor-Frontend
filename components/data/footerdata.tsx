// components/data/footerdata.tsx
import type { IconType } from "react-icons";
import {
  FaXTwitter,
  FaTelegram,
  FaLinkedinIn,
  FaYoutube,
  FaInstagram,
  FaFacebookF,
} from "react-icons/fa6";

export interface FooterLink {
  label: string;
  href: string;
  redirect?: boolean;
}

export interface FooterColumnData {
  heading: string;
  links: FooterLink[];
}

export interface SocialLink {
  icon: IconType;
  href: string;
  label: string;
}

export interface FooterBrandData {
  name: string;
  description: string; 
  logo: string;
}

export const footerBrand: FooterBrandData = {
  name: "Pennytor",
  logo: "/logos/Graphic.jpeg",
  description:"Empowering investors with transparent, secure, and intelligent wealth management solutions.",    
};

export const socialLinks: SocialLink[] = [
  {
    icon: FaXTwitter,
    href: "https://twitter.com/pennytor",
    label: "X (Twitter)",
  },
  { icon: FaTelegram, href: "https://t.me/pennytor", label: "Telegram" },
  {
    icon: FaLinkedinIn,
    href: "https://linkedin.com/company/pennytor",
    label: "LinkedIn",
  },
  { icon: FaYoutube, href: "https://youtube.com/@pennytor", label: "YouTube" },
  {
    icon: FaInstagram,
    href: "https://instagram.com/pennytor",
    label: "Instagram",
  },
  {
    icon: FaFacebookF,
    href: "https://facebook.com/pennytor",
    label: "Facebook",
  },
];

export const footerColumns: FooterColumnData[] = [
  
  {
    heading: "Our Products",
    links: [
      { label: "Health Insurance", href: "/insurance/health/individual" },
      { label: "Term Insurance", href: "/insurance/life/term" },
      { label: "Home Insurance", href: "/insurance/home/home" },
      { label: "ULIP Plans", href: "/insurance/life/ulip" },
      {
        label: "Guaranteed Income Plans",
        href: "/insurance/life/guaranteed-income",
      },
      { label: "Annuity Plans", href: "/insurance/life/annuity" },
      { label: "Group Life Insurance", href: "/insurance/life/group" },
      { label: "Shopkeeper Insurance", href: "/insurance/home/shopkeeper" },
    ],
  },
  {
    heading: "Quick Links",
    links: [
      { label: "Get a Quote", href: "/get-quote" },
      { label: "Renew Your Policy", href: "/renew/policy-number" },
      { label: "Track Claim Status", href: "/claim/track" },
      { label: "Download Forms", href: "/support/forms" },
      { label: "Premium Calculator", href: "/calculators/premium-calculator" },
      { label: "Insurance Glossary", href: "/insurance-glossary" },
      { label: "Blog", href: "/blog" },
      { label: "FAQs", href: "/support/faqs" },
    ],
  },
  {
    heading: "Partner with us",
    links: [
      { label: "Become a Partner", href: "/partner/become-a-partner" },
      { label: "Partner Dashboard", href: "/partner/dashboard" },
      { label: "Code of Conduct", href: "/partner/code-of-conduct" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Pricing", href: "/pricing" },
      { label: "Careers", href: "/careers" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
];

export const footerBottomLinks: FooterLink[] = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-services" },
];

export const footerCopyright = `© ${new Date().getFullYear()} Pennytor. All rights reserved.`;
