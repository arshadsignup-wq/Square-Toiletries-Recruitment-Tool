"use client";

import { SectionHeading } from "@/components/ui";
import {
  BOARDS,
  HIGHER_DEGREES,
  HSC_GROUPS,
  HSC_TYPES,
  SSC_GROUPS,
  SSC_TYPES,
  passingYears,
} from "@/lib/options";
import { AddButton, Check, Gpa, RepeatableCard, Select, Text } from "./fields";
import { emptyHigherEducation } from "./form-state";
import type { StepProps } from "./step-props";

const YEARS = passingYears();

const degreeTypeOptions = (types: string[]) =>
  types.map((t) => ({
    value: t,
    label: t === "Manual Entry" ? "Other (Entry Manually)" : t,
  }));

const boardOptions = BOARDS.map((b) => ({
  value: b,
  label: b === "Other" ? "Other (Entry Manually)" : b,
}));

const LETTER_GRADED = new Set(["O Level", "A Level", "Manual Entry"]);

export default function StepEducation({ v, set, err }: StepProps) {
  return (
    <div className="space-y-8">
      <section>
        <SectionHeading title="SSC / Dakhil / O Level or Equivalent" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Select
            label="Select Degree Type"
            name="sscType"
            required
            options={degreeTypeOptions(SSC_TYPES)}
            placeholder="Select Degree Type"
            value={v.sscType}
            onChange={(e) => set("sscType", e.target.value)}
            error={err("sscType")}
          />
          {v.sscType === "Manual Entry" ? (
            <Text
              label="Enter Degree Type"
              name="sscTypeManual"
              value={v.sscTypeManual}
              onChange={(e) => set("sscTypeManual", e.target.value)}
              placeholder="Enter Degree Type"
            />
          ) : null}
          <Select
            label="Group/Major"
            name="sscGroup"
            required
            options={SSC_GROUPS}
            placeholder="Select Group/Major"
            value={v.sscGroup}
            onChange={(e) => set("sscGroup", e.target.value)}
            error={err("sscGroup")}
          />
          {v.sscGroup === "Other" ? (
            <Text
              label="Enter Group/Major"
              name="sscGroupManual"
              value={v.sscGroupManual}
              onChange={(e) => set("sscGroupManual", e.target.value)}
              placeholder="Enter Group/Major"
            />
          ) : null}
          <Text
            label="Institution Name"
            name="sscInstitution"
            required
            value={v.sscInstitution}
            onChange={(e) => set("sscInstitution", e.target.value)}
            placeholder="e.g., ABC School"
            error={err("sscInstitution")}
          />
          <Select
            label="Board"
            name="sscBoard"
            required
            options={boardOptions}
            placeholder="Select Board"
            value={v.sscBoard}
            onChange={(e) => set("sscBoard", e.target.value)}
            error={err("sscBoard")}
          />
          {v.sscBoard === "Other" ? (
            <Text
              label="Enter Board Name"
              name="sscBoardManual"
              value={v.sscBoardManual}
              onChange={(e) => set("sscBoardManual", e.target.value)}
              placeholder="Enter Board Name"
            />
          ) : null}
          {LETTER_GRADED.has(v.sscType) ? (
            <Text
              label="Result"
              name="sscResult"
              required
              value={v.sscResult}
              onChange={(e) => set("sscResult", e.target.value)}
              placeholder="e.g., 5 A's, or your grades"
              error={err("sscResult")}
            />
          ) : (
            <Gpa
              label="Result (GPA)"
              name="sscResult"
              required
              scale={5}
              value={v.sscResult}
              onChange={(next) => set("sscResult", next)}
              error={err("sscResult")}
            />
          )}
          <Select
            label="Passing Year"
            name="sscYear"
            required
            options={YEARS}
            placeholder="Passing Year"
            value={v.sscYear}
            onChange={(e) => set("sscYear", e.target.value)}
            error={err("sscYear")}
          />
        </div>
      </section>

      <section>
        <SectionHeading title="HSC / Alim / A Level / Diploma or Equivalent" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Select
            label="Select Degree Type"
            name="hscType"
            options={degreeTypeOptions(HSC_TYPES)}
            placeholder="Select Degree Type"
            value={v.hscType}
            onChange={(e) => set("hscType", e.target.value)}
          />
          {v.hscType === "Manual Entry" ? (
            <Text
              label="Enter Degree Type"
              name="hscTypeManual"
              value={v.hscTypeManual}
              onChange={(e) => set("hscTypeManual", e.target.value)}
              placeholder="Enter Degree Type"
            />
          ) : null}
          <Select
            label="Group/Major"
            name="hscGroup"
            options={HSC_GROUPS}
            placeholder="Select Group/Major"
            value={v.hscGroup}
            onChange={(e) => set("hscGroup", e.target.value)}
          />
          {v.hscGroup === "Other" ? (
            <Text
              label="Enter Group/Major"
              name="hscGroupManual"
              value={v.hscGroupManual}
              onChange={(e) => set("hscGroupManual", e.target.value)}
              placeholder="Enter Group/Major"
            />
          ) : null}
          <Text
            label="Institution/College Name"
            name="hscInstitution"
            value={v.hscInstitution}
            onChange={(e) => set("hscInstitution", e.target.value)}
            placeholder="e.g., ABC College"
          />
          <Select
            label="Board"
            name="hscBoard"
            options={boardOptions}
            placeholder="Select Board"
            value={v.hscBoard}
            onChange={(e) => set("hscBoard", e.target.value)}
          />
          {v.hscBoard === "Other" ? (
            <Text
              label="Enter Board Name"
              name="hscBoardManual"
              value={v.hscBoardManual}
              onChange={(e) => set("hscBoardManual", e.target.value)}
              placeholder="Enter Board Name"
            />
          ) : null}
          {LETTER_GRADED.has(v.hscType) || v.hscType === "Diploma Equivalent" ? (
            <Text
              label="Result"
              name="hscResult"
              value={v.hscResult}
              onChange={(e) => set("hscResult", e.target.value)}
              placeholder="e.g., 4 A's, or your grades"
            />
          ) : (
            <Gpa
              label="Result (GPA)"
              name="hscResult"
              scale={5}
              value={v.hscResult}
              onChange={(next) => set("hscResult", next)}
            />
          )}
          <Select
            label="Passing Year"
            name="hscYear"
            options={YEARS}
            placeholder="Passing Year"
            value={v.hscYear}
            onChange={(e) => set("hscYear", e.target.value)}
          />
        </div>
      </section>

      <section>
        <SectionHeading
          title="Higher Education"
          hint="Add your graduation, post-graduation and any other higher qualifications."
        />
        <div className="space-y-3">
          {v.higherEducations.map((h, i) => {
            const update = (patch: Partial<typeof h>) => {
              const next = [...v.higherEducations];
              next[i] = { ...h, ...patch };
              set("higherEducations", next);
            };
            return (
              <RepeatableCard
                key={i}
                title={`Higher Qualification ${i + 1}`}
                onRemove={() =>
                  set(
                    "higherEducations",
                    v.higherEducations.filter((_, idx) => idx !== i),
                  )
                }
              >
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Select
                    label="Select Degree"
                    options={degreeTypeOptions(HIGHER_DEGREES)}
                    placeholder="Select Degree"
                    value={h.degreeType}
                    onChange={(e) => update({ degreeType: e.target.value })}
                  />
                  {h.degreeType === "Manual Entry" ? (
                    <Text
                      label="Enter Degree Type"
                      value={h.degreeTypeManual}
                      onChange={(e) => update({ degreeTypeManual: e.target.value })}
                      placeholder="Enter Degree Type"
                    />
                  ) : null}
                  <Text
                    label="Major/Department"
                    value={h.major}
                    onChange={(e) => update({ major: e.target.value })}
                    placeholder="Major/Department"
                  />
                  <Text
                    label="Institution/College Name"
                    value={h.institution}
                    onChange={(e) => update({ institution: e.target.value })}
                    placeholder="Institution/College Name"
                  />
                  <Text
                    label="Result"
                    value={h.result}
                    onChange={(e) => update({ result: e.target.value })}
                    placeholder="Result (e.g., 3.62/4)"
                  />
                  <Select
                    label="Passing Year"
                    options={YEARS}
                    placeholder="Passing Year"
                    value={h.passingYear}
                    onChange={(e) => update({ passingYear: e.target.value })}
                  />
                </div>
                <div className="mt-3">
                  <Check
                    label="Affiliated with a university"
                    checked={h.isAffiliated}
                    onChange={(on) => update({ isAffiliated: on })}
                  />
                  {h.isAffiliated ? (
                    <div className="mt-3 sm:max-w-md">
                      <Text
                        label="Affiliated University Name"
                        value={h.affiliatedUniversity}
                        onChange={(e) =>
                          update({ affiliatedUniversity: e.target.value })
                        }
                        placeholder="Enter Affiliated University Name"
                      />
                    </div>
                  ) : null}
                </div>
              </RepeatableCard>
            );
          })}
          <AddButton
            onClick={() =>
              set("higherEducations", [...v.higherEducations, emptyHigherEducation()])
            }
          >
            Add Higher Education
          </AddButton>
        </div>
      </section>
    </div>
  );
}
