"use client";

import { SectionHeading } from "@/components/ui";
import { SOURCES } from "@/lib/options";
import { AddButton, Check, RadioGroup, RepeatableCard, Text, TextArea } from "./fields";
import { emptySquareRelation } from "./form-state";
import PhotoUpload from "./PhotoUpload";
import type { StepProps } from "./step-props";

export default function StepDisclosure({ v, set, err }: StepProps) {
  return (
    <div className="space-y-8">
      <section>
        <SectionHeading title="Medical History" />
        <div className="lg:max-w-2xl">
          <TextArea
            name="medicalHistory"
            value={v.medicalHistory}
            onChange={(e) => set("medicalHistory", e.target.value)}
            placeholder="Enter details or 'None'"
          />
        </div>
      </section>

      <section>
        <SectionHeading title="Disability Declaration" />
        <Check
          label="Disclosure is voluntary and will be used only to support workplace accommodations."
          checked={v.hasDisability}
          onChange={(on) => set("hasDisability", on)}
        />
        {v.hasDisability ? (
          <div className="mt-3 lg:max-w-2xl">
            <Text
              name="disabilityDetails"
              value={v.disabilityDetails}
              onChange={(e) => set("disabilityDetails", e.target.value)}
              placeholder="Please specify details regarding your disability"
            />
          </div>
        ) : null}
      </section>

      <section>
        <SectionHeading
          title="References within SQUARE"
          hint="Declaration about relatives (father, mother, brother, sister, spouse, uncle, aunt, cousin, nephew, niece etc.) working in SQUARE."
        />
        <div className="sm:max-w-xs">
          <RadioGroup
            label="Any relation in Square Group?"
            name="relationInSquare"
            options={["Yes", "No"]}
            value={v.relationInSquare}
            onChange={(next) => set("relationInSquare", next)}
            columns={2}
          />
        </div>

        {v.relationInSquare === "Yes" ? (
          <div className="mt-4 space-y-3">
            {err("squareRelations") ? (
              <p className="text-xs text-red-600">{err("squareRelations")}</p>
            ) : null}
            {v.squareRelations.map((r, i) => {
              const update = (patch: Partial<typeof r>) => {
                const next = [...v.squareRelations];
                next[i] = { ...r, ...patch };
                set("squareRelations", next);
              };
              return (
                <RepeatableCard
                  key={i}
                  title={`Relative ${i + 1}`}
                  onRemove={() =>
                    set(
                      "squareRelations",
                      v.squareRelations.filter((_, idx) => idx !== i),
                    )
                  }
                >
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Text
                      label="Name"
                      value={r.name}
                      onChange={(e) => update({ name: e.target.value })}
                      placeholder="Name"
                    />
                    <Text
                      label="Designation"
                      value={r.designation}
                      onChange={(e) => update({ designation: e.target.value })}
                      placeholder="Designation"
                    />
                    <Text
                      label="Department"
                      value={r.department}
                      onChange={(e) => update({ department: e.target.value })}
                      placeholder="Department"
                    />
                    <Text
                      label="Company"
                      value={r.company}
                      onChange={(e) => update({ company: e.target.value })}
                      placeholder="Company"
                    />
                    <Text
                      label="Relationship"
                      value={r.relationship}
                      onChange={(e) => update({ relationship: e.target.value })}
                      placeholder="Relationship"
                    />
                    <Text
                      label="Mobile No"
                      value={r.mobile}
                      onChange={(e) => update({ mobile: e.target.value })}
                      placeholder="Mobile"
                    />
                  </div>
                </RepeatableCard>
              );
            })}
            <AddButton
              onClick={() =>
                set("squareRelations", [...v.squareRelations, emptySquareRelation()])
              }
            >
              Add Reference
            </AddButton>
          </div>
        ) : null}
      </section>

      <section>
        <SectionHeading title="How did you hear about us?" />
        <RadioGroup
          name="source"
          required
          options={SOURCES}
          value={v.source}
          onChange={(next) => set("source", next)}
          error={err("source")}
          columns={3}
        />
        {v.source === "Others" ? (
          <div className="mt-3 sm:max-w-md">
            <Text
              name="sourceManual"
              value={v.sourceManual}
              onChange={(e) => set("sourceManual", e.target.value)}
              placeholder="Specify where you heard about us"
              error={err("sourceManual")}
            />
          </div>
        ) : null}
      </section>

      <section>
        <SectionHeading title="Photograph" />
        <PhotoUpload
          value={v.photoData}
          onChange={(dataUrl) => set("photoData", dataUrl)}
          error={err("photoData")}
        />
      </section>

      <section>
        <SectionHeading title="Acknowledgement" />
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <Check
            label={
              <span>
                I hereby declare that all information provided above is true, complete,
                and accurate to the best of my knowledge. If any information is found to
                be inaccurate and I am unable to provide valid supporting evidence, I
                agree to abide by the company&rsquo;s decision.
                <span className="ml-0.5 text-red-600">*</span>
              </span>
            }
            checked={v.declaration}
            onChange={(on) => set("declaration", on)}
          />
          {err("declaration") ? (
            <p className="mt-2 text-xs text-red-600">{err("declaration")}</p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
