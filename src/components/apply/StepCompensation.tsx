"use client";

import { SectionHeading } from "@/components/ui";
import { BENEFITS, BONUS_COUNTS, NOTICE_PERIODS } from "@/lib/options";
import { AddButton, CheckGroup, Select, Text } from "./fields";
import type { StepProps } from "./step-props";

export default function StepCompensation({ v, set, err }: StepProps) {
  const bonusSelected = v.benefits.includes("Bonus/Incentive");

  return (
    <div className="space-y-8">
      <section>
        <SectionHeading title="Compensation" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Text
            label="Monthly Current Salary"
            name="currentSalary"
            type="number"
            min={0}
            value={v.currentSalary}
            onChange={(e) => set("currentSalary", e.target.value)}
            placeholder="50000"
            hint="Leave blank if you are a fresher."
          />
          <Text
            label="Monthly Expected Salary"
            name="expectedSalary"
            type="number"
            min={0}
            required
            value={v.expectedSalary}
            onChange={(e) => set("expectedSalary", e.target.value)}
            placeholder="50000"
            error={err("expectedSalary")}
          />
        </div>
      </section>

      <section>
        <SectionHeading
          title="Additional Benefits from Current Organization"
          hint="Tick everything you currently receive."
        />
        <CheckGroup
          options={BENEFITS}
          value={v.benefits}
          onChange={(next) => set("benefits", next)}
          columns={4}
        />

        {bonusSelected ? (
          <div className="mt-4 sm:max-w-xs">
            <Select
              label="Number of Bonuses per Year"
              name="bonusCount"
              options={BONUS_COUNTS}
              placeholder="Select count"
              value={v.bonusCount}
              onChange={(e) => set("bonusCount", e.target.value)}
            />
          </div>
        ) : null}

        <div className="mt-5">
          <p className="mb-2 text-xs font-medium text-ink-700">Other Benefits</p>
          <div className="space-y-2">
            {v.otherBenefits.map((b, i) => (
              <div key={i} className="flex items-start gap-2 sm:max-w-lg">
                <Text
                  wrapperClassName="flex-1"
                  value={b}
                  onChange={(e) => {
                    const next = [...v.otherBenefits];
                    next[i] = e.target.value;
                    set("otherBenefits", next);
                  }}
                  placeholder="e.g., Housing Allowance"
                />
                <button
                  type="button"
                  onClick={() =>
                    set(
                      "otherBenefits",
                      v.otherBenefits.filter((_, idx) => idx !== i),
                    )
                  }
                  className="rounded-md px-2 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
            ))}
            <AddButton onClick={() => set("otherBenefits", [...v.otherBenefits, ""])}>
              Add Benefit
            </AddButton>
          </div>
        </div>
      </section>

      <section>
        <SectionHeading title="Notice Period" />
        <div className="sm:max-w-xs">
          <Select
            label="Notice Period / Availability"
            name="noticePeriod"
            required
            options={NOTICE_PERIODS}
            placeholder="Select Notice Period"
            value={v.noticePeriod}
            onChange={(e) => set("noticePeriod", e.target.value)}
            error={err("noticePeriod")}
          />
        </div>
      </section>
    </div>
  );
}
