"use client";

import { useTransition } from "react";
import { APPLICATION_STATUSES } from "@/lib/options";
import { updateStatus } from "@/app/admin/actions";

export default function StatusControl({
  applicationId,
  status,
}: {
  applicationId: string;
  status: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="w-full sm:w-48">
      <label className="mb-1 block text-xs font-medium text-ink-700">Status</label>
      <select
        className="field-control"
        value={status}
        disabled={pending}
        onChange={(e) => {
          const next = e.target.value;
          startTransition(async () => {
            await updateStatus(applicationId, next);
          });
        }}
      >
        {APPLICATION_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      {pending ? <p className="mt-1 text-xs text-ink-500">Saving…</p> : null}
    </div>
  );
}
