import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export function Logo({ size = "md" }: { size?: "sm" | "md" }) {
  const w = size === "sm" ? 132 : 176;
  return (
    <Image
      src="/logo.png"
      alt="Square Toiletries Limited"
      width={w}
      height={Math.round((w * 237) / 422)}
      priority
      className="h-auto"
    />
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionHeading({
  title,
  hint,
}: {
  title: string;
  hint?: string;
}) {
  return (
    <div className="mb-4 border-b border-slate-200 pb-2">
      <h3 className="text-sm font-semibold tracking-wide text-brand-700 uppercase">
        {title}
      </h3>
      {hint ? <p className="mt-1 text-xs text-ink-500">{hint}</p> : null}
    </div>
  );
}

export function Badge({
  children,
  tone = "slate",
}: {
  children: ReactNode;
  tone?: "slate" | "blue" | "green" | "amber" | "red" | "violet";
}) {
  const tones: Record<string, string> = {
    slate: "bg-slate-100 text-slate-700 ring-slate-200",
    blue: "bg-brand-50 text-brand-700 ring-brand-200",
    green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    amber: "bg-amber-50 text-amber-700 ring-amber-200",
    red: "bg-red-50 text-red-700 ring-red-200",
    violet: "bg-violet-50 text-violet-700 ring-violet-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function statusTone(
  status: string,
): "slate" | "blue" | "green" | "amber" | "red" | "violet" {
  switch (status) {
    case "SUBMITTED":
      return "slate";
    case "SHORTLISTED":
      return "blue";
    case "INTERVIEWED":
      return "violet";
    case "SELECTED":
      return "green";
    case "REJECTED":
      return "red";
    default:
      return "slate";
  }
}

export function DataRow({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-slate-100 py-2 last:border-0 sm:flex-row sm:gap-4">
      <dt className="w-full shrink-0 text-xs font-medium text-ink-500 sm:w-56">
        {label}
      </dt>
      <dd className="text-sm text-ink-900">{value || "—"}</dd>
    </div>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-ink-500">
      {children}
    </p>
  );
}

export function AppHeader({
  subtitle,
  right,
}: {
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Logo size="sm" />
          {subtitle ? (
            <span className="hidden border-l border-slate-200 pl-3 text-sm font-medium text-ink-500 sm:block">
              {subtitle}
            </span>
          ) : null}
        </Link>
        {right}
      </div>
    </header>
  );
}
