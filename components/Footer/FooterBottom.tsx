// components/Footer/FooterBottom.tsx
import Link from "next/link";
import { footerBottomLinks, footerCopyright } from "@/components/data/footerdata";

export function FooterBottom() {
  return (
    <div className="border-t border-white/10">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-gray-400 text-[12.5px]">{footerCopyright}</p>
        <div className="flex items-center gap-6">
          {footerBottomLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-gray-400 text-[12.5px] hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}