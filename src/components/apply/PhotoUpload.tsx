"use client";

import { useRef, useState } from "react";
import { FieldShell } from "./fields";

const MAX_WIDTH = 600;
const MAX_HEIGHT = 750;

/** Resizes in the browser so a 5 MB phone photo becomes a ~60 KB passport-size
 *  JPEG before it ever leaves the candidate's device. */
async function resizeToDataUrl(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const ratio = Math.min(MAX_WIDTH / bitmap.width, MAX_HEIGHT / bitmap.height, 1);
  const width = Math.round(bitmap.width * ratio);
  const height = Math.round(bitmap.height * ratio);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not process the image on this device.");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();

  return canvas.toDataURL("image/jpeg", 0.85);
}

export default function PhotoUpload({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (dataUrl: string) => void;
  error?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setLocalError(null);

    if (!file.type.startsWith("image/")) {
      setLocalError("Please choose an image file (JPG or PNG).");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setLocalError("That image is larger than 15 MB. Please choose a smaller one.");
      return;
    }

    setBusy(true);
    try {
      onChange(await resizeToDataUrl(file));
    } catch {
      setLocalError("Could not read that image. Please try another photo.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <FieldShell
      label="Upload Passport Size Photo"
      required
      error={error ?? localError ?? undefined}
      hint="JPG or PNG. The image is resized automatically before upload."
    >
      <div className="flex items-start gap-4">
        <div className="flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-300 bg-slate-50">
          {value ? (
            // Data URL preview — next/image cannot optimise these.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="Photo preview" className="size-full object-cover" />
          ) : (
            <span className="px-2 text-center text-xs text-ink-500">No photo</span>
          )}
        </div>

        <div className="space-y-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => void handleFile(e.target.files?.[0])}
          />
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-ink-700 transition hover:border-brand-400 hover:text-brand-700 disabled:opacity-60"
          >
            {busy ? "Processing…" : value ? "Change photo" : "Choose photo"}
          </button>
          {value ? (
            <button
              type="button"
              onClick={() => {
                onChange("");
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="block text-xs font-medium text-red-600 transition hover:underline"
            >
              Remove photo
            </button>
          ) : null}
        </div>
      </div>
    </FieldShell>
  );
}
