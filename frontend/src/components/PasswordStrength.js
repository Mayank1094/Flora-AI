import React from "react";

export function PasswordStrength({ password }) {
  const checks = [
    { label: "8+ characters", ok: password.length >= 8 },
    { label: "Uppercase letter", ok: /[A-Z]/.test(password) },
    { label: "Lowercase letter", ok: /[a-z]/.test(password) },
    { label: "Number", ok: /\d/.test(password) },
    { label: "Special character", ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const pct = (score / checks.length) * 100;
  const color =
    score <= 2 ? "bg-destructive" : score <= 4 ? "bg-[hsl(38_78%_56%)]" : "bg-primary";
  const label = score <= 2 ? "Weak" : score <= 4 ? "Good" : "Strong";

  if (!password) return null;

  return (
    <div className="space-y-2" data-testid="password-strength">
      <div className="flex items-center justify-between">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full rounded-full transition-all duration-300 ${color}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="ml-3 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      </div>
      <ul className="grid grid-cols-2 gap-x-3 gap-y-1">
        {checks.map((c) => (
          <li
            key={c.label}
            className={`flex items-center gap-1.5 text-[11px] ${
              c.ok ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <span
              className={`inline-block h-1.5 w-1.5 rounded-full ${
                c.ok ? "bg-primary" : "bg-muted-foreground/40"
              }`}
            />
            {c.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
