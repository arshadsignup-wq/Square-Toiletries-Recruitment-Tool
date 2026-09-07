"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui";
import { APPLICATION_STATUSES } from "@/lib/options";

type Current = {
  q?: string;
  position?: string;
  status?: string;
  from?: string;
  to?: string;
};

export default function Filters({
  positions,
  current,
}: {
  positions: Array<{ title: string; count: number }>;
  current: Current;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(current.q ?? "");

  const apply = (patch: Record<string, string>) => {
    const next = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(patch)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    next.delete("page");
    router.push(`/admin?${next.toString()}`);
  };

  // Debounced so typing a name does not fire a query per keystroke.
  useEffect(() => {
    const id = window.setTimeout(() => {
      if ((current.q ?? "") !== q) apply({ q });
    }, 350);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const hasFilters = Boolean(
    current.q || current.position || current.status || current.from || current.to,
  );

  return (
    <Card className="p-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <label className="mb-1 block text-xs font-medium text-ink-700">Search</label>
          <input
            className="field-control"
            placeholder="Name, email, mobile, NID or application no."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-ink-700">Position</label>
          <select
            className="field-control"
            value={current.position ?? ""}
            onChange={(e) => apply({ position: e.target.value })}
          >
            <option value="">All positions</option>
            {positions.map((p) => (
              <option key={p.title} value={p.title}>
                {p.title} ({p.count})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-ink-700">Status</label>
          <select
            className="field-control"
            value={current.status ?? ""}
            onChange={(e) => apply({ status: e.target.value })}
          >
            <option value="">All statuses</option>
            {APPLICATION_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-700">From</label>
            <input
              type="date"
              className="field-control"
              value={current.from ?? ""}
              onChange={(e) => apply({ from: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-700">To</label>
            <input
              type="date"
              className="field-control"
              value={current.to ?? ""}
              onChange={(e) => apply({ to: e.target.value })}
            />
          </div>
        </div>
      </div>

      {hasFilters ? (
        <button
          type="button"
          onClick={() => {
            setQ("");
            router.push("/admin");
          }}
          className="mt-3 text-xs font-medium text-brand-700 hover:underline"
        >
          Clear all filters
        </button>
      ) : null}
    </Card>
  );
}
