"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { applicationSchema } from "@/lib/application-schema";
import { Card } from "@/components/ui";
import StepCompensation from "./StepCompensation";
import StepDisclosure from "./StepDisclosure";
import StepEducation from "./StepEducation";
import StepExperience from "./StepExperience";
import StepPersonal from "./StepPersonal";
import {
  FIELD_STEP,
  STEP_LABELS,
  initialValues,
  type FormValues,
} from "./form-state";

const DRAFT_KEY = "st-application-draft-v1";

type Errors = Record<string, string>;

/** GPA fields hold just the number while the candidate types; the scale is
 *  reattached on submit so results are stored self-describing ("4.83/5"),
 *  matching how they were recorded on the previous form. */
function withScale(value: string, scale: number): string {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  const n = Number(trimmed);
  return Number.isFinite(n) ? `${n.toFixed(2)}/${scale}` : trimmed;
}

function toPayload(v: FormValues) {
  return {
    ...v,
    sscResult: withScale(v.sscResult, 5),
    hscResult: withScale(v.hscResult, 5),
    dependents: v.dependents.filter((d) => d.name.trim()),
    siblings: v.siblings.filter((s) => s.name.trim()),
    higherEducations: v.higherEducations.filter(
      (h) => h.degreeType || h.institution,
    ),
    experiences:
      v.experienceStatus === "Experienced"
        ? v.experiences.filter((e) => e.orgName.trim() || e.designation.trim())
        : [],
    squareRelations:
      v.relationInSquare === "Yes"
        ? v.squareRelations.filter((r) => r.name.trim())
        : [],
    otherBenefits: v.otherBenefits.filter((b) => b.trim()),
  };
}

export default function ApplyForm({ defaultPosition }: { defaultPosition: string }) {
  const [values, setValues] = useState<FormValues>(() =>
    initialValues(defaultPosition),
  );
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<{ applicationNo: string } | null>(null);
  const [draftRestored, setDraftRestored] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  // Restore any half-finished application so a dropped connection or an
  // accidental tab close does not cost the candidate their typing.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as Partial<FormValues>;
      setValues((current) => ({
        ...current,
        ...saved,
        positionAppliedFor: defaultPosition || saved.positionAppliedFor || "",
      }));
      setDraftRestored(true);
    } catch {
      /* a corrupt draft should never block the form */
    }
  }, [defaultPosition]);

  useEffect(() => {
    if (result) return;
    const id = window.setTimeout(() => {
      try {
        window.localStorage.setItem(DRAFT_KEY, JSON.stringify(values));
      } catch {
        /* out of quota — drafts are a convenience, not a requirement */
      }
    }, 600);
    return () => window.clearTimeout(id);
  }, [values, result]);

  const set = useCallback(
    <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
      setValues((current) => ({ ...current, [key]: value }));
      setErrors((current) => {
        if (!(key in current)) return current;
        const next = { ...current };
        delete next[key as string];
        return next;
      });
    },
    [],
  );

  const err = useCallback((path: string) => errors[path], [errors]);

  const validateAll = useCallback((): Errors => {
    const parsed = applicationSchema.safeParse(toPayload(values));
    if (parsed.success) return {};
    const collected: Errors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".");
      if (!collected[key]) collected[key] = issue.message;
      const root = String(issue.path[0] ?? "");
      if (root && !collected[root]) collected[root] = issue.message;
    }
    return collected;
  }, [values]);

  const scrollToTop = () =>
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const goNext = () => {
    const all = validateAll();
    const stepErrors: Errors = Object.fromEntries(
      Object.entries(all).filter(([key]) => {
        const root = key.split(".")[0];
        return FIELD_STEP[root] === step;
      }),
    );
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) {
      scrollToTop();
      return;
    }
    setStep((s) => Math.min(s + 1, STEP_LABELS.length - 1));
    scrollToTop();
  };

  const goBack = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
    scrollToTop();
  };

  const submit = async () => {
    const all = validateAll();
    if (Object.keys(all).length > 0) {
      setErrors(all);
      const firstStep = Math.min(
        ...Object.keys(all).map((k) => FIELD_STEP[k.split(".")[0]] ?? 99),
      );
      if (Number.isFinite(firstStep) && firstStep < STEP_LABELS.length) {
        setStep(firstStep);
      }
      scrollToTop();
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toPayload(values)),
      });
      const data = await response.json();
      if (!response.ok) {
        if (data?.fieldErrors) setErrors(data.fieldErrors as Errors);
        throw new Error(data?.message ?? "Your application could not be submitted.");
      }
      window.localStorage.removeItem(DRAFT_KEY);
      setResult({ applicationNo: data.applicationNo });
      scrollToTop();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Your application could not be submitted.",
      );
      scrollToTop();
    } finally {
      setSubmitting(false);
    }
  };

  const stepProps = useMemo(() => ({ v: values, set, err }), [values, set, err]);

  if (result) {
    return (
      <div ref={topRef}>
        <Card className="p-8 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-emerald-50 text-3xl text-emerald-600">
            ✓
          </div>
          <h2 className="text-xl font-semibold text-ink-900">Application submitted</h2>
          <p className="mt-2 text-sm text-ink-500">
            Thank you for applying to Square Toiletries Limited. Our HR team will get in
            touch if you are shortlisted.
          </p>
          <div className="mx-auto mt-6 inline-block rounded-lg border border-slate-200 bg-slate-50 px-6 py-4">
            <p className="text-xs text-ink-500">Your application number</p>
            <p className="mt-1 font-mono text-lg font-semibold tracking-wide text-brand-700">
              {result.applicationNo}
            </p>
          </div>
          <p className="mt-4 text-xs text-ink-500">
            Please keep this number for future reference.
          </p>
        </Card>
      </div>
    );
  }

  const errorCount = Object.keys(errors).length;

  return (
    <div ref={topRef} className="space-y-5">
      <Stepper current={step} onSelect={(i) => i < step && setStep(i)} />

      {draftRestored ? (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-900">
          <span>We restored your unfinished application from this device.</span>
          <button
            type="button"
            className="shrink-0 text-xs font-medium underline"
            onClick={() => {
              window.localStorage.removeItem(DRAFT_KEY);
              setValues(initialValues(defaultPosition));
              setDraftRestored(false);
              setStep(0);
            }}
          >
            Start fresh
          </button>
        </div>
      ) : null}

      {submitError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {submitError}
        </div>
      ) : null}

      {errorCount > 0 ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          Please correct {errorCount === 1 ? "the highlighted field" : `the ${errorCount} highlighted fields`} below.
        </div>
      ) : null}

      <Card className="p-5 sm:p-7">
        {step === 0 ? <StepPersonal {...stepProps} /> : null}
        {step === 1 ? <StepEducation {...stepProps} /> : null}
        {step === 2 ? <StepExperience {...stepProps} /> : null}
        {step === 3 ? <StepCompensation {...stepProps} /> : null}
        {step === 4 ? <StepDisclosure {...stepProps} /> : null}
      </Card>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 0}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-ink-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>

        {step < STEP_LABELS.length - 1 ? (
          <button
            type="button"
            onClick={goNext}
            className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Next: {STEP_LABELS[step + 1]}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => void submit()}
            disabled={submitting}
            className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
          >
            {submitting ? "Submitting…" : "Submit Application"}
          </button>
        )}
      </div>
    </div>
  );
}

function Stepper({
  current,
  onSelect,
}: {
  current: number;
  onSelect: (index: number) => void;
}) {
  return (
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      {STEP_LABELS.map((label, i) => {
        const state = i === current ? "current" : i < current ? "done" : "todo";
        return (
          <li key={label} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onSelect(i)}
              disabled={i >= current}
              className="flex items-center gap-2 disabled:cursor-default"
            >
              <span
                className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition ${
                  state === "current"
                    ? "bg-brand-600 text-white"
                    : state === "done"
                      ? "bg-brand-100 text-brand-700"
                      : "bg-slate-100 text-slate-400"
                }`}
              >
                {state === "done" ? "✓" : i + 1}
              </span>
              <span
                className={`text-xs font-medium sm:text-sm ${
                  state === "current"
                    ? "text-brand-700"
                    : state === "done"
                      ? "text-ink-700"
                      : "text-slate-400"
                }`}
              >
                {label}
              </span>
            </button>
            {i < STEP_LABELS.length - 1 ? (
              <span className="hidden h-px w-6 bg-slate-200 sm:block" />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
