import * as React from "react";
import { AlertCircle } from "lucide-react";

import { cn } from "@/lib/utils";

type Tone = "light" | "dark";
type Variant = "text" | "box";

export interface ErrorMessageProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  /**
   * The surface the message sits on — `light` for white cards (auth pages),
   * `dark` for the near-black app shell (KYC, dashboard).
   */
  tone?: Tone;
  /**
   * `text` is a plain inline message (field errors), `box` is a bordered
   * banner (form-level / server errors).
   */
  variant?: Variant;
  /** Show the alert icon. Defaults to true for the `box` variant. */
  withIcon?: boolean;
}

const textTone: Record<Tone, string> = {
  light: "text-red-600",
  dark: "text-red-400",
};

const boxTone: Record<Tone, string> = {
  light: "border-red-200 bg-red-50 text-red-600",
  dark: "border-red-500/40 bg-red-500/10 text-red-300",
};

/**
 * The single way to render an error in this app.
 *
 * Before this existed every screen hardcoded its own red (`red-500` on auth
 * pages, `red-200`/`slate-300` in the dark KYC flow), so the same kind of
 * message looked red in one place and white in another.
 */
export const ErrorMessage = React.forwardRef<
  HTMLParagraphElement,
  ErrorMessageProps
>(
  (
    {
      tone = "light",
      variant = "text",
      withIcon,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    if (!children) return null;

    const box = variant === "box";
    const showIcon = withIcon ?? box;

    return (
      <p
        ref={ref}
        role="alert"
        className={cn(
          "text-sm font-medium",
          box && "flex items-start gap-2 rounded-lg border px-3 py-2",
          box ? boxTone[tone] : textTone[tone],
          className,
        )}
        {...props}
      >
        {showIcon && (
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        )}
        <span>{children}</span>
      </p>
    );
  },
);
ErrorMessage.displayName = "ErrorMessage";