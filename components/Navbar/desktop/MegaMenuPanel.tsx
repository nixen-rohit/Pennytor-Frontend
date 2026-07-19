// components/header/desktop/MegaMenuPanel.tsx
import Link from "next/link";
import { cn } from "@/lib/utils";
import { RiExternalLinkLine } from "react-icons/ri";
import { MegaMenuData, MegaLink } from "../../data/navdata";

interface MegaMenuPanelProps {
  mega: MegaMenuData;
  align?: "left" | "right" | "center";
  serviceWidth?: number | string;
  expertiseWidth?: number | string;
}

function IconItem({ link }: { link: MegaLink }) {
  return (
    <Link
      href={link.href}
      target={link.redirect ? "_blank" : undefined}
      rel={link.redirect ? "noopener noreferrer" : undefined}
      className="group/link flex items-start gap-3 rounded-xl px-2.5 py-2.5 hover:bg-gray-50 transition-colors duration-100"
    >
      {link.icon && (
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[16px] transition-transform group-hover/link:scale-105",
            link.color ?? "bg-gray-100 text-gray-600",
          )}
        >
          <link.icon />
        </span>
      )}
      <span className="flex flex-col gap-0.5 min-w-0 flex-1">
        <span className="flex items-center gap-1 text-[13.5px] font-semibold text-gray-800 group-hover/link:text-blue-600 transition-colors leading-tight">
          {link.label}
          {link.redirect && (
            <RiExternalLinkLine className="text-[11px] text-gray-400 group-hover/link:text-blue-600 transition-colors shrink-0" />
          )}
        </span>
        {link.description && (
          <span className="text-[11.5px] text-gray-500 leading-snug">
            {link.description}
          </span>
        )}
      </span>
    </Link>
  );
}

export function MegaMenuPanel({
  mega,
  align = "left",
  serviceWidth,
  expertiseWidth,
}: MegaMenuPanelProps) {
  const colCount = mega.columns.length;
  const isSingleSection = colCount === 1; // Dhan "Investments"-style: one heading, 2-col icon grid

  const alignClass =
    align === "right" ? "right-0" : align === "center" ? "left-1/2 -translate-x-1/2" : "left-0";

  const minWidth = isSingleSection
    ? (expertiseWidth ?? 480)
    : (expertiseWidth || serviceWidth || Math.min(colCount * 240, 920));

  return (
    <div
      className={cn(
        "absolute top-full z-50",
        alignClass,
        "font-inter bg-white rounded-2xl border border-gray-200 shadow-xl",
        "p-5 opacity-0 translate-y-2 scale-[0.98] pointer-events-none",
        "group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 group-hover:pointer-events-auto",
        "transition-all duration-200 ease-out origin-top",
      )}
      style={{
        minWidth: `${minWidth}px`,
        maxWidth: serviceWidth ? `${serviceWidth}px` : "920px",
      }}
    >
      {isSingleSection ? (
        // Dhan "Investments" style — single 2-column icon grid, no heading dividers
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          {mega.columns[0].links.map((link, li) => (
            <IconItem key={li} link={link} />
          ))}
        </div>
      ) : (
        // Dhan "More" style — multiple headings side by side, each a vertical icon list
        <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${colCount}, 1fr)` }}>
          {mega.columns.map((col, ci) => (
            <div
              key={ci}
              className={cn(
                "pr-5",
                ci > 0 && "border-l border-gray-100 pl-5",
                ci === mega.columns.length - 1 && "pr-0",
              )}
            >
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2 pb-2 border-b border-gray-100">
                {col.heading}
              </p>
              <div className="flex flex-col gap-0.5">
                {col.links.map((link, li) => (
                  <IconItem key={li} link={link} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}