"use client";

import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

type FieldShellProps = {
  label?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
};

export function FieldShell({
  label,
  required,
  error,
  hint,
  htmlFor,
  children,
  className = "",
}: FieldShellProps) {
  return (
    <div className={className}>
      {label ? (
        <label
          htmlFor={htmlFor}
          className="mb-1 block text-xs font-medium text-ink-700"
        >
          {label}
          {required ? <span className="ml-0.5 text-red-600">*</span> : null}
        </label>
      ) : null}
      {children}
      {hint && !error ? (
        <p className="mt-1 text-xs text-ink-500">{hint}</p>
      ) : null}
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

type TextProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
  wrapperClassName?: string;
};

export function Text({
  label,
  error,
  hint,
  required,
  wrapperClassName,
  id,
  ...rest
}: TextProps) {
  const fieldId = id ?? rest.name;
  return (
    <FieldShell
      label={label}
      required={required}
      error={error}
      hint={hint}
      htmlFor={fieldId}
      className={wrapperClassName}
    >
      <input
        id={fieldId}
        className="field-control"
        aria-invalid={error ? "true" : undefined}
        {...rest}
      />
    </FieldShell>
  );
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  hint?: string;
  placeholder?: string;
  options: Array<string | { value: string; label: string }>;
  wrapperClassName?: string;
};

export function Select({
  label,
  error,
  hint,
  required,
  options,
  placeholder = "Select",
  wrapperClassName,
  id,
  ...rest
}: SelectProps) {
  const fieldId = id ?? rest.name;
  return (
    <FieldShell
      label={label}
      required={required}
      error={error}
      hint={hint}
      htmlFor={fieldId}
      className={wrapperClassName}
    >
      <select
        id={fieldId}
        className="field-control"
        aria-invalid={error ? "true" : undefined}
        {...rest}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => {
          const value = typeof opt === "string" ? opt : opt.value;
          const text = typeof opt === "string" ? opt : opt.label;
          return (
            <option key={value} value={value}>
              {text}
            </option>
          );
        })}
      </select>
    </FieldShell>
  );
}

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
  hint?: string;
  wrapperClassName?: string;
};

export function TextArea({
  label,
  error,
  hint,
  required,
  wrapperClassName,
  id,
  ...rest
}: TextAreaProps) {
  const fieldId = id ?? rest.name;
  return (
    <FieldShell
      label={label}
      required={required}
      error={error}
      hint={hint}
      htmlFor={fieldId}
      className={wrapperClassName}
    >
      <textarea
        id={fieldId}
        className="field-control"
        aria-invalid={error ? "true" : undefined}
        {...rest}
      />
    </FieldShell>
  );
}

export function Check({
  label,
  checked,
  onChange,
  id,
}: {
  label: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
}) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start gap-2 text-sm text-ink-700"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 size-4 shrink-0 accent-brand-600"
      />
      <span>{label}</span>
    </label>
  );
}

export function CheckGroup({
  label,
  options,
  value,
  onChange,
  columns = 4,
}: {
  label?: string;
  options: string[];
  value: string[];
  onChange: (next: string[]) => void;
  columns?: number;
}) {
  const toggle = (opt: string, on: boolean) => {
    onChange(on ? [...value, opt] : value.filter((v) => v !== opt));
  };
  return (
    <FieldShell label={label}>
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {options.map((opt) => (
          <Check
            key={opt}
            id={`${label ?? "grp"}-${opt}`}
            label={opt}
            checked={value.includes(opt)}
            onChange={(on) => toggle(opt, on)}
          />
        ))}
      </div>
    </FieldShell>
  );
}

export function RadioGroup({
  label,
  name,
  options,
  value,
  onChange,
  required,
  error,
  columns = 3,
}: {
  label?: string;
  name: string;
  options: string[];
  value: string;
  onChange: (next: string) => void;
  required?: boolean;
  error?: string;
  columns?: number;
}) {
  return (
    <FieldShell label={label} required={required} error={error}>
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {options.map((opt) => (
          <label
            key={opt}
            className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
              value === opt
                ? "border-brand-500 bg-brand-50 text-brand-800"
                : "border-slate-300 bg-white text-ink-700 hover:border-slate-400"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={opt}
              checked={value === opt}
              onChange={() => onChange(opt)}
              className="size-4 accent-brand-600"
            />
            {opt}
          </label>
        ))}
      </div>
    </FieldShell>
  );
}

export function RepeatableCard({
  title,
  onRemove,
  children,
}: {
  title: string;
  onRemove?: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h4 className="text-sm font-semibold text-ink-700">{title}</h4>
        {onRemove ? (
          <button
            type="button"
            onClick={onRemove}
            className="rounded-md px-2 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50"
          >
            Remove
          </button>
        ) : null}
      </div>
      {children}
    </div>
  );
}

export function AddButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-brand-300 bg-brand-50/50 px-3 py-2 text-sm font-medium text-brand-700 transition hover:border-brand-500 hover:bg-brand-50"
    >
      <span className="text-base leading-none">+</span>
      {children}
    </button>
  );
}

/** GPA entry on a fixed scale — SSC/HSC in Bangladesh are marked out of 5.00.
 *  The scale is shown as a suffix rather than typed, so results arrive in one
 *  consistent shape instead of "4.83", "4.83/5" and "GPA 4.83" all at once. */
export function Gpa({
  label,
  value,
  onChange,
  scale,
  required,
  error,
  wrapperClassName,
  name,
}: {
  label?: string;
  value: string;
  onChange: (next: string) => void;
  scale: number;
  required?: boolean;
  error?: string;
  wrapperClassName?: string;
  name?: string;
}) {
  const handle = (raw: string) => {
    if (raw === "") return onChange("");
    const n = Number(raw);
    if (!Number.isFinite(n)) return;
    // Clamp rather than reject, so a stray keystroke cannot produce a GPA of 55.
    onChange(String(Math.min(Math.max(n, 0), scale)));
  };

  return (
    <FieldShell
      label={label}
      required={required}
      error={error}
      htmlFor={name}
      className={wrapperClassName}
    >
      <div className="relative">
        <input
          id={name}
          name={name}
          type="number"
          inputMode="decimal"
          step="0.01"
          min={0}
          max={scale}
          className="field-control pr-16"
          placeholder={scale.toFixed(2)}
          aria-invalid={error ? "true" : undefined}
          value={value}
          onChange={(e) => handle(e.target.value)}
        />
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-medium text-ink-500">
          out of {scale.toFixed(2)}
        </span>
      </div>
    </FieldShell>
  );
}
