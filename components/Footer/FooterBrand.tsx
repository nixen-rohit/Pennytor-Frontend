// components/Footer/FooterBrand.tsx
import Link from "next/link";
import { footerBrand, socialLinks } from "@/components/Footer/footerdata";
import Image from "next/image";
export function FooterBrand() {
  return (
    <div className="flex flex-col gap-3  lg:w-[200px] shrink-0">
      {/* Logo */}
      <Link href="/" aria-label="Pennytor Home">
        <div className="flex justify-center items-center">
          <Image
            className="object-contain "
            src={footerBrand.logo}
            alt={footerBrand.name}
            width={100}
            height={100}
          />
        </div>
      </Link>
      <h1 className="text-foreground text-2xl font-serif text-center">
        {footerBrand.name}
      </h1>
      <p className="text-gray-300 text-sm text-start">
        {footerBrand.description}
      </p>
    </div>
  );
}
