import * as React from "react";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Theme-matched date input.
 *
 * - Always displays **dd/mm/yyyy** (native `type="date"` follows the OS locale).
 * - Typing is masked: `19062026` → `19/06/2026`.
 * - A small calendar button opens a month/year picker, themed for the dark UI.
 *
 * The value is a **date-only** `Date` pinned to UTC midnight. Working entirely
 * in UTC means the chosen calendar day never shifts when it is converted to an
 * ISO string and stored, regardless of the browser's timezone.
 *
 * Form state stays `Date | null`. A complete, in-range date is emitted
 * immediately; anything else emits `null` so existing validation shows.
 */

const MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

/** Builds a date-only value pinned to 00:00 UTC. */
export function utcDate(year: number, monthIndex: number, day: number): Date {
  return new Date(Date.UTC(year, monthIndex, day));
}

/** Reads the calendar parts of a date-only UTC value. */
function utcParts(date: Date) {
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth(),
    day: date.getUTCDate(),
  };
}

export function formatDateDisplay(date: Date | null | undefined): string {
  if (!date) return "";
  const { year, month, day } = utcParts(date);
  return `${String(day).padStart(2, "0")}/${String(month + 1).padStart(2, "0")}/${year}`;
}

/** Parses a complete dd/mm/yyyy string; returns null when invalid. */
export function parseDateDisplay(value: string): Date | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const date = utcDate(year, month - 1, day);
  const parts = utcParts(date);
  if (parts.year !== year || parts.month !== month - 1 || parts.day !== day) {
    return null;
  }
  return date;
}

/** Digits only → dd/mm/yyyy, inserting separators as the user types. */
function maskDate(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);
  return [day, month, year].filter(Boolean).join("/");
}

function sameDay(a: Date, b: Date): boolean {
  const pa = utcParts(a);
  const pb = utcParts(b);
  return pa.year === pb.year && pa.month === pb.month && pa.day === pb.day;
}

export interface DateInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "value" | "onChange"
  > {
  value: Date | null | undefined;
  onChange: (date: Date | null) => void;
  /** Optional bounds — out-of-range dates are rejected (emit null). */
  minDate?: Date;
  maxDate?: Date;
}

const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  (
    { className, value, onChange, minDate, maxDate, placeholder, ...props },
    ref,
  ) => {
    const [text, setText] = React.useState(() => formatDateDisplay(value));
    const [open, setOpen] = React.useState(false);

    const initial = value ?? maxDate ?? new Date();
    const initialParts = utcParts(initial);
    const [viewYear, setViewYear] = React.useState(initialParts.year);
    const [viewMonth, setViewMonth] = React.useState(initialParts.month);

    const wrapperRef = React.useRef<HTMLDivElement>(null);

    // Sync the visible text when the form value changes externally.
    const valueKey = value ? value.getTime() : 0;
    React.useEffect(() => {
      setText(formatDateDisplay(value));
      if (value) {
        const parts = utcParts(value);
        setViewYear(parts.year);
        setViewMonth(parts.month);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [valueKey]);

    // Close on outside click / Escape.
    React.useEffect(() => {
      if (!open) return;
      const onPointerDown = (event: MouseEvent) => {
        if (
          wrapperRef.current &&
          !wrapperRef.current.contains(event.target as Node)
        ) {
          setOpen(false);
        }
      };
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") setOpen(false);
      };
      document.addEventListener("mousedown", onPointerDown);
      document.addEventListener("keydown", onKeyDown);
      return () => {
        document.removeEventListener("mousedown", onPointerDown);
        document.removeEventListener("keydown", onKeyDown);
      };
    }, [open]);

    const commit = (nextText: string) => {
      setText(nextText);
      const parsed = parseDateDisplay(nextText);
      if (!parsed) {
        onChange(null);
        return;
      }
      if (minDate && parsed < minDate) {
        onChange(null);
        return;
      }
      if (maxDate && parsed > maxDate) {
        onChange(null);
        return;
      }
      onChange(parsed);
    };

    const isDisabled = (date: Date) =>
      Boolean(minDate && date < minDate) || Boolean(maxDate && date > maxDate);

    const pickDay = (day: number) => {
      const selected = utcDate(viewYear, viewMonth, day);
      if (isDisabled(selected)) return;
      onChange(selected);
      setText(formatDateDisplay(selected));
      setOpen(false);
    };

    const shiftMonth = (delta: number) => {
      const next = utcDate(viewYear, viewMonth + delta, 1);
      const parts = utcParts(next);
      setViewYear(parts.year);
      setViewMonth(parts.month);
    };

    const firstWeekday = utcDate(viewYear, viewMonth, 1).getUTCDay();
    const daysInMonth = utcDate(viewYear, viewMonth + 1, 0).getUTCDate();

    // "Today" is only used for the ring highlight — the local calendar day is
    // the right thing to compare against a date-only value.
    const now = new Date();
    const today = utcDate(now.getFullYear(), now.getMonth(), now.getDate());

    const minYear = minDate ? utcParts(minDate).year : 1900;
    const maxYear = maxDate ? utcParts(maxDate).year : now.getFullYear();
    const years: number[] = [];
    for (let y = maxYear; y >= minYear; y -= 1) years.push(y);

    return (
      <div ref={wrapperRef} className="relative">
        <input
          ref={ref}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={text}
          onChange={(e) => commit(maskDate(e.target.value))}
          placeholder={placeholder ?? "dd/mm/yyyy"}
          maxLength={10}
          className={cn(
            "flex h-10 w-full rounded-md border border-white/30 bg-neutral-950 px-3 py-2 pr-10 text-sm text-slate-100 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Open date picker"
          className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-white/10 hover:text-slate-100"
        >
          <CalendarIcon className="h-4 w-4" />
        </button>

        {open ? (
          <div className="absolute left-0 top-full z-50 mt-2 w-72 rounded-md border border-neutral-700 bg-neutral-950 p-3 shadow-xl">
            <div className="mb-2 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => shiftMonth(-1)}
                aria-label="Previous month"
                className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-white/10 hover:text-slate-100"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>

              <div className="flex flex-1 items-center justify-center gap-1">
                <select
                  value={viewMonth}
                  onChange={(e) => setViewMonth(Number(e.target.value))}
                  className="h-7 rounded-md border border-neutral-700 bg-neutral-900 px-1 text-xs text-slate-100 focus:outline-none"
                >
                  {MONTH_LABELS.map((label, index) => (
                    <option key={label} value={index}>
                      {label}
                    </option>
                  ))}
                </select>
                <select
                  value={viewYear}
                  onChange={(e) => setViewYear(Number(e.target.value))}
                  className="h-7 rounded-md border border-neutral-700 bg-neutral-900 px-1 text-xs text-slate-100 focus:outline-none"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => shiftMonth(1)}
                aria-label="Next month"
                className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-white/10 hover:text-slate-100"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-1 grid grid-cols-7 gap-1">
              {WEEKDAYS.map((label) => (
                <div
                  key={label}
                  className="py-1 text-center text-[0.7rem] text-slate-500"
                >
                  {label}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstWeekday }).map((_, index) => (
                <div key={`blank-${index}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                const date = utcDate(viewYear, viewMonth, day);
                const selected = value ? sameDay(date, value) : false;
                const isToday = sameDay(date, today);
                const disabled = isDisabled(date);
                return (
                  <button
                    key={day}
                    type="button"
                    disabled={disabled}
                    onClick={() => pickDay(day)}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-md text-xs transition-colors",
                      disabled
                        ? "cursor-not-allowed text-slate-700"
                        : "text-slate-200 hover:bg-white/10",
                      selected && "bg-indigo-600 text-white hover:bg-indigo-600",
                      !selected &&
                        isToday &&
                        "border border-indigo-500/60 text-indigo-300",
                    )}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    );
  },
);
DateInput.displayName = "DateInput";

export { DateInput };
