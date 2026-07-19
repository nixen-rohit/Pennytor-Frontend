// components/Footer/FooterColumn.tsx
import Link from "next/link";
import { FooterColumnData } from "@/components/data/footerdata";

export function FooterColumn({ heading, links }: FooterColumnData) {
  return (
    <div className="flex flex-col gap-3 min-w-[140px]">
      <p className="text-white font-bold text-[14px]">{heading}</p>
      <ul className="flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              target={link.redirect ? "_blank" : undefined}
              rel={link.redirect ? "noopener noreferrer" : undefined}
              className="text-gray-400 text-[13px] hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}