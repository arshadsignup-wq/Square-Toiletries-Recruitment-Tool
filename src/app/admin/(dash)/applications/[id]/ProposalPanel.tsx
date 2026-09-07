"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge, Card, SectionHeading } from "@/components/ui";
import { formatBDT, formatDate } from "@/lib/utils";

type Defaults = {
  candidateName: string;
  designation: string;
  age: number;
  nidNumber: string;
  address: string;
  salary: number;
};

type IssuedProposal = {
  id: string;
  referenceNo: string;
  designation: string;
  salary: number;
  joiningDate: string;
  issuedAt: string;
};

export default function ProposalPanel({
  applicationId,
  defaults,
  proposals,
}: {
  applicationId: string;
  defaults: Defaults;
  proposals: IssuedProposal[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(proposals.length === 0);
  const [designation, setDesignation] = useState(defaults.designation);
  const [department, setDepartment] = useState("");
  const [salary, setSalary] = useState(String(defaults.salary));
  const [joiningDate, setJoiningDate] = useState("");
  const [nidNumber, setNidNumber] = useState(defaults.nidNumber);
  const [address, setAddress] = useState(defaults.address);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const generate = async () => {
    setBusy(true);
    setErrors({});
    setMessage(null);
    try {
      const response = await fetch("/api/admin/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId,
          designation,
          department,
          salary,
          joiningDate,
          nidNumber,
          address,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        if (data?.fieldErrors) setErrors(data.fieldErrors);
        throw new Error(data?.message ?? "Could not generate the proposal.");
      }
      // Content-Disposition: attachment, so this downloads without navigating.
      window.location.href = `/api/admin/proposals/${data.id}/pdf`;
      router.refresh();
      setOpen(false);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not generate the proposal.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-brand-700 uppercase">
            Appointment Proposal
          </h2>
          <p className="mt-1 text-xs text-ink-500">
            Confirm the agreed terms and download a signed-ready PDF proposal.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-ink-700 transition hover:border-brand-400 hover:text-brand-700"
        >
          {open ? "Hide" : proposals.length ? "Issue another" : "Make proposal"}
        </button>
      </div>

      {proposals.length > 0 ? (
        <div className="mt-4 space-y-2">
          {proposals.map((p) => (
            <div
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/60 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="font-mono text-xs text-brand-700">{p.referenceNo}</p>
                <p className="text-sm text-ink-900">
                  {p.designation} · {formatBDT(p.salary)}/month · joining{" "}
                  {formatDate(p.joiningDate)}
                </p>
                <p className="text-xs text-ink-500">
                  Issued {formatDate(p.issuedAt)}
                </p>
              </div>
              <a
                href={`/api/admin/proposals/${p.id}/pdf`}
                className="shrink-0 rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                Download PDF
              </a>
            </div>
          ))}
        </div>
      ) : null}

      {open ? (
        <div className="mt-5 border-t border-slate-200 pt-5">
          <SectionHeading title="Proposal terms" />
          {message ? (
            <p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
              {message}
            </p>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Input
              label="Designation"
              required
              value={designation}
              onChange={setDesignation}
              error={errors.designation}
            />
            <Input
              label="Department"
              value={department}
              onChange={setDepartment}
              placeholder="Optional"
            />
            <Input
              label="Agreed monthly salary (BDT)"
              required
              type="number"
              value={salary}
              onChange={setSalary}
              error={errors.salary}
            />
            <Input
              label="Joining date"
              required
              type="date"
              value={joiningDate}
              onChange={setJoiningDate}
              error={errors.joiningDate}
            />
            <Input
              label="NID number"
              value={nidNumber}
              onChange={setNidNumber}
              placeholder="From the application"
              error={errors.nidNumber}
            />
            <Input
              label="Address"
              required
              value={address}
              onChange={setAddress}
              error={errors.address}
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={busy}
              onClick={() => void generate()}
              className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
            >
              {busy ? "Generating…" : "Generate & download proposal"}
            </button>
            <Badge tone="blue">
              Age on joining date is calculated automatically
            </Badge>
          </div>
        </div>
      ) : null}
    </Card>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  error?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-ink-700">
        {label}
        {required ? <span className="ml-0.5 text-red-600">*</span> : null}
      </label>
      <input
        type={type}
        className="field-control"
        value={value}
        placeholder={placeholder}
        aria-invalid={error ? "true" : undefined}
        onChange={(e) => onChange(e.target.value)}
      />
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
