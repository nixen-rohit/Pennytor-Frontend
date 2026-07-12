"use client";

import { CheckCircle2, Circle } from "lucide-react";

function Requirement({ met, label }: { met: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {met ? (
        <CheckCircle2 className="h-4 w-4 text-green-600" />
      ) : (
        <Circle className="h-4 w-4 text-muted-foreground" />
      )}
      <span className={met ? "text-green-700" : "text-muted-foreground"}>
        {label}
      </span>
    </div>
  );
}

/**
 * Drop this anywhere you already have the current password value in state.
 * Example:
 *   const [password, setPassword] = useState("");
 *   <PasswordRequirements password={password} />
 */
export default function PasswordRequirements({
  password,
}: {
  password: string;
}) {
  return (
    <div className="rounded-xl border bg-slate-50 p-4">
      <h4 className="mb-3 font-medium text-slate-900">
        Password Requirements
      </h4>

      <div className="space-y-2 text-gray-600">
        <Requirement
          met={password.length >= 8}
          label="At least 8 characters"
        />
        <Requirement
          met={/[A-Z]/.test(password)}
          label="One uppercase letter"
        />
        <Requirement
          met={/[a-z]/.test(password)}
          label="One lowercase letter"
        />
        <Requirement met={/[0-9]/.test(password)} label="One number" />
        <Requirement
          met={/[^A-Za-z0-9]/.test(password)}
          label="One special character"
        />
      </div>
    </div>
  );
}