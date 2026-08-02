// components/Footer/Footer.tsx
import { footerColumns } from "@/components/Footer/footerdata";
import { FooterBrand } from "@/components/Footer/FooterBrand";
import { FooterColumn } from "@/components/Footer/FooterColumn";
import { FooterBottom } from "@/components/Footer/FooterBottom";

export default function index() {
  return (
    <footer className="bg-mainground ">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-6">
          <FooterBrand />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 flex-1">
            {footerColumns.map((col) => (
              <FooterColumn
                key={col.heading}
                heading={col.heading}
                links={col.links}
              />
            ))}
          </div>
        </div>
      </div>
      <FooterBottom />
    </footer>
  );
}
