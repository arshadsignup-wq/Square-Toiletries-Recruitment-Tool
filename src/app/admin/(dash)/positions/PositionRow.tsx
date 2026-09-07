"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { Badge, Card } from "@/components/ui";
import { deletePosition, togglePosition } from "@/app/admin/actions";

export default function PositionRow({
  id,
  title,
  department,
  isOpen,
  applicationCount,
}: {
  id: string;
  title: string;
  department: string | null;
  isOpen: boolean;
  applicationCount: number;
}) {
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => setOrigin(window.location.origin), []);

  const applyPath = `/apply?pos=${encodeURIComponent(title)}`;
  const applyUrl = origin ? `${origin}${applyPath}` : applyPath;

  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-medium text-ink-900">{title}</h3>
            <Badge tone={isOpen ? "green" : "slate"}>
              {isOpen ? "Open" : "Closed"}
            </Badge>
          </div>
          <p className="mt-0.5 text-xs text-ink-500">
            {department ? `${department} · ` : ""}
            <Link
              href={`/admin?position=${encodeURIComponent(title)}`}
              className="text-brand-700 hover:underline"
            >
              {applicationCount}{" "}
              {applicationCount === 1 ? "application" : "applications"}
            </Link>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={async () => {
              await navigator.clipboard.writeText(applyUrl);
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1800);
            }}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-ink-700 transition hover:border-brand-400 hover:text-brand-700"
          >
            {copied ? "Link copied" : "Copy apply link"}
          </button>
          <Link
            href={applyPath}
            target="_blank"
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-ink-700 transition hover:border-brand-400 hover:text-brand-700"
          >
            Preview
          </Link>
          <button
            type="button"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                await togglePosition(id, !isOpen);
              })
            }
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-ink-700 transition hover:border-brand-400 disabled:opacity-60"
          >
            {isOpen ? "Close" : "Reopen"}
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                await deletePosition(id);
              })
            }
            className="rounded-lg px-2 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
          >
            Delete
          </button>
        </div>
      </div>

      <p className="mt-3 truncate rounded-md bg-slate-50 px-3 py-2 font-mono text-xs text-ink-500">
        {applyUrl}
      </p>
    </Card>
  );
}
