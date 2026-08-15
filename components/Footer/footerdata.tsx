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
  logo: string;
}

export const footerBrand: FooterBrandData = {
  name: "Pennytor",
  logo: "/logos/Graphic.jpeg",
  
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
      { label: "Gulak Scheme", href: "/schemes/gulak-scheme" },
      { label: "SIP Child Scheme", href: "/schemes/sip-child-scheme" },
      { label: "Fixed Deposit With SWP ", href: "/schemes/fixed-swp-scheme" },
      {
        label: "Investment Fund Scheme",
        href: "/schemes/investment-fund-scheme",
      },
    ],
  },
  {
    heading: "Quick Links",
    links: [
      { label: "Gulak Scheme", href: "/schemes/gulak-scheme" },
      { label: "SIP Child Scheme", href: "/schemes/sip-child-scheme" },
      { label: "Fixed Deposit With SWP ", href: "/schemes/fixed-swp-scheme" },
      {
        label: "Investment Fund Scheme",
        href: "/schemes/investment-fund-scheme",
      },
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
      { label: "Contact Us", href: "/contact-us" },
    ],
  },
];

export const footerBottomLinks: FooterLink[] = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-services" },
];

export const footerCopyright = `© ${new Date().getFullYear()} Pennytor. All rights reserved.`;
