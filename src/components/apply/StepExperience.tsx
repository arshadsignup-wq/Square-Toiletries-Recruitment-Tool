"use client";

import { SectionHeading } from "@/components/ui";
import { monthSpan } from "@/lib/utils";
import { AddButton, Check, RadioGroup, RepeatableCard, Text } from "./fields";
import { emptyExperience, emptyPromotion } from "./form-state";
import type { ExperienceValue } from "./form-state";
import type { StepProps } from "./step-props";

/** Total experience across every listed role, in whole months. */
function totalMonths(experiences: ExperienceValue[]): number {
  return experiences.reduce((sum, e) => {
    if (!e.fromDate) return sum;
    const [fy, fm] = e.fromDate.split("-").map(Number);
    const end = e.currentlyWorking || !e.toDate
      ? [new Date().getFullYear(), new Date().getMonth() + 1]
      : e.toDate.split("-").map(Number);
    if (!fy || !fm || !end[0] || !end[1]) return sum;
    const months = (end[0] - fy) * 12 + (end[1] - fm) + 1;
    return months > 0 ? sum + months : sum;
  }, 0);
}

function formatTotal(months: number): string {
  if (months <= 0) return "—";
  const y = Math.floor(months / 12);
  const m = months % 12;
  return [y ? `${y} yr` : "", m ? `${m} mo` : ""].filter(Boolean).join(" ");
}

export default function StepExperience({ v, set, err }: StepProps) {
  const experienced = v.experienceStatus === "Experienced";

  const update = (i: number, patch: Partial<ExperienceValue>) => {
    const next = [...v.experiences];
    next[i] = { ...next[i], ...patch };
    set("experiences", next);
  };

  return (
    <div className="space-y-8">
      <section>
        <SectionHeading title="Experience Status" />
        <div className="sm:max-w-sm">
          <RadioGroup
            label="Are you a Fresher or Experienced?"
            name="experienceStatus"
            required
            options={["Fresher", "Experienced"]}
            value={v.experienceStatus}
            onChange={(next) => set("experienceStatus", next)}
            error={err("experienceStatus")}
            columns={2}
          />
        </div>
      </section>

      {experienced ? (
        <section>
          <SectionHeading title="Employment History" />
          {err("experiences") ? (
            <p className="mb-3 text-xs text-red-600">{err("experiences")}</p>
          ) : null}

          <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-800">
            <span className="font-medium">Total experience:</span>
            <span>{formatTotal(totalMonths(v.experiences))}</span>
          </div>

          <div className="space-y-3">
            {v.experiences.map((e, i) => (
              <RepeatableCard
                key={i}
                title={
                  i === 0
                    ? "Experience 1 (Most Recent / Current)"
                    : `Previous Experience ${i + 1}`
                }
                onRemove={
                  v.experiences.length > 1
                    ? () =>
                        set(
                          "experiences",
                          v.experiences.filter((_, idx) => idx !== i),
                        )
                    : undefined
                }
              >
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Text
                    label="Organization Name"
                    value={e.orgName}
                    onChange={(ev) => update(i, { orgName: ev.target.value })}
                    placeholder="Organization Name"
                  />
                  <Text
                    label="Designation"
                    value={e.designation}
                    onChange={(ev) => update(i, { designation: ev.target.value })}
                    placeholder="Designation"
                  />
                  <Text
                    label="Duration"
                    value={
                      e.fromDate
                        ? monthSpan(e.fromDate, e.currentlyWorking ? null : e.toDate)
                        : ""
                    }
                    readOnly
                    disabled
                    placeholder="Calculated"
                  />
                  <Text
                    label="From"
                    type="month"
                    value={e.fromDate}
                    onChange={(ev) => update(i, { fromDate: ev.target.value })}
                  />
                  <Text
                    label="To"
                    type="month"
                    value={e.currentlyWorking ? "" : e.toDate}
                    disabled={e.currentlyWorking}
                    onChange={(ev) => update(i, { toDate: ev.target.value })}
                  />
                  <div className="flex items-end pb-2">
                    <Check
                      label="Currently Working"
                      checked={e.currentlyWorking}
                      onChange={(on) =>
                        update(i, { currentlyWorking: on, toDate: on ? "" : e.toDate })
                      }
                    />
                  </div>
                </div>

                <div className="mt-4 border-t border-slate-200 pt-4">
                  <Check
                    label="Any previous designation in this organization?"
                    checked={e.promotions.length > 0}
                    onChange={(on) =>
                      update(i, { promotions: on ? [emptyPromotion()] : [] })
                    }
                  />
                  {e.promotions.length > 0 ? (
                    <div className="mt-3 space-y-3">
                      {e.promotions.map((p, pi) => (
                        <div
                          key={pi}
                          className="grid gap-4 rounded-md border border-slate-200 bg-white p-3 sm:grid-cols-[2fr_1fr_1fr_auto]"
                        >
                          <Text
                            label="Previous Designation"
                            value={p.designation}
                            onChange={(ev) => {
                              const promos = [...e.promotions];
                              promos[pi] = { ...p, designation: ev.target.value };
                              update(i, { promotions: promos });
                            }}
                            placeholder="Designation"
                          />
                          <Text
                            label="From"
                            type="month"
                            value={p.fromDate}
                            onChange={(ev) => {
                              const promos = [...e.promotions];
                              promos[pi] = { ...p, fromDate: ev.target.value };
                              update(i, { promotions: promos });
                            }}
                          />
                          <Text
                            label="To"
                            type="month"
                            value={p.toDate}
                            onChange={(ev) => {
                              const promos = [...e.promotions];
                              promos[pi] = { ...p, toDate: ev.target.value };
                              update(i, { promotions: promos });
                            }}
                          />
                          <div className="flex items-end pb-1">
                            <button
                              type="button"
                              onClick={() =>
                                update(i, {
                                  promotions: e.promotions.filter(
                                    (_, idx) => idx !== pi,
                                  ),
                                })
                              }
                              className="rounded-md px-2 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                      <AddButton
                        onClick={() =>
                          update(i, { promotions: [...e.promotions, emptyPromotion()] })
                        }
                      >
                        Add Previous Designation
                      </AddButton>
                    </div>
                  ) : null}
                </div>

                <div className="mt-4 grid gap-4 border-t border-slate-200 pt-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Text
                    label="Supervisor Name"
                    value={e.superiorName}
                    onChange={(ev) => update(i, { superiorName: ev.target.value })}
                    placeholder="Supervisor Name"
                  />
                  <Text
                    label="Supervisor Title"
                    value={e.superiorTitle}
                    onChange={(ev) => update(i, { superiorTitle: ev.target.value })}
                    placeholder="Supervisor Title"
                  />
                  <Text
                    label="Supervisor Tel No."
                    type="tel"
                    value={e.superiorTelNo}
                    onChange={(ev) => update(i, { superiorTelNo: ev.target.value })}
                    placeholder="Supervisor Tel No."
                  />
                  <Text
                    label="Joining Salary"
                    type="number"
                    min={0}
                    value={e.salaryStart}
                    onChange={(ev) => update(i, { salaryStart: ev.target.value })}
                    placeholder="Start"
                  />
                  <Text
                    label="Leaving Salary"
                    type="number"
                    min={0}
                    value={e.salaryEnd}
                    onChange={(ev) => update(i, { salaryEnd: ev.target.value })}
                    placeholder="End"
                  />
                  <Text
                    label="Reason for Leaving"
                    value={e.reasonForLeaving}
                    onChange={(ev) => update(i, { reasonForLeaving: ev.target.value })}
                    placeholder="Brief reason for leaving"
                  />
                </div>
              </RepeatableCard>
            ))}
            <AddButton
              onClick={() => set("experiences", [...v.experiences, emptyExperience()])}
            >
              Add Previous Experience
            </AddButton>
          </div>
        </section>
      ) : v.experienceStatus === "Fresher" ? (
        <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-ink-500">
          No employment history needed — continue to the next step.
        </p>
      ) : null}
    </div>
  );
}
