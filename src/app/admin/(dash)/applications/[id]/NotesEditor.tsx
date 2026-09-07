"use client";

import { useState, useTransition } from "react";
import { saveNotes } from "@/app/admin/actions";

export default function NotesEditor({
  applicationId,
  initialNotes,
}: {
  applicationId: string;
  initialNotes: string;
}) {
  const [notes, setNotes] = useState(initialNotes);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-3">
      <textarea
        className="field-control"
        rows={4}
        value={notes}
        placeholder="Interview feedback, agreed terms, follow-up actions…"
        onChange={(e) => {
          setNotes(e.target.value);
          setSaved(false);
        }}
      />
      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              await saveNotes(applicationId, notes);
              setSaved(true);
            })
          }
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save notes"}
        </button>
        {saved && !pending ? (
          <span className="text-xs text-emerald-700">Saved.</span>
        ) : null}
      </div>
    </div>
  );
}
