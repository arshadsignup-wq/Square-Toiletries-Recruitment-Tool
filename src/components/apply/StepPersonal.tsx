"use client";

import { SectionHeading } from "@/components/ui";
import {
  ACCOMMODATION_TYPES,
  BLOOD_GROUPS,
  GENDERS,
  LIVING_WITH,
  MARITAL_STATUSES,
  RELIGIONS,
} from "@/lib/options";
import {
  AddButton,
  Check,
  CheckGroup,
  RepeatableCard,
  Select,
  Text,
} from "./fields";
import { emptyDependent, emptySibling } from "./form-state";
import type { StepProps } from "./step-props";

export default function StepPersonal({ v, set, err }: StepProps) {
  const married = v.maritalStatus === "Married";

  /** Keeping the permanent address mirrored while the box is ticked means the
   *  candidate never has to retype it, and unticking leaves the copy in place
   *  so they can edit just the parts that differ. */
  const syncPermanent = (checked: boolean) => {
    set("sameAsPresent", checked);
    if (checked) {
      set("permanentVillage", v.presentVillage);
      set("permanentPO", v.presentPO);
      set("permanentPS", v.presentPS);
      set("permanentDistrict", v.presentDistrict);
    }
  };

  const setPresent = (key: "Village" | "PO" | "PS" | "District", value: string) => {
    set(`present${key}` as keyof typeof v, value as never);
    if (v.sameAsPresent) set(`permanent${key}` as keyof typeof v, value as never);
  };

  return (
    <div className="space-y-8">
      <section>
        <SectionHeading title="Basic Information" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Text
            label="Position Applied For"
            name="positionAppliedFor"
            required
            value={v.positionAppliedFor}
            onChange={(e) => set("positionAppliedFor", e.target.value)}
            placeholder="e.g., Executive - Internal Audit"
            error={err("positionAppliedFor")}
          />
          <Text
            label="Full Name (As per NID)"
            name="fullName"
            required
            value={v.fullName}
            onChange={(e) => set("fullName", e.target.value)}
            placeholder="e.g., Md. Masud Rana"
            error={err("fullName")}
          />
          <Text
            label="Mobile Number"
            name="mobileNumber"
            type="tel"
            required
            value={v.mobileNumber}
            onChange={(e) => set("mobileNumber", e.target.value)}
            placeholder="e.g., 0188XXXXXXX"
            error={err("mobileNumber")}
          />
          <Text
            label="Email Address"
            name="email"
            type="email"
            required
            value={v.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="candidate@example.com"
            error={err("email")}
          />
          <Text
            label="Date of Birth"
            name="dob"
            type="date"
            required
            value={v.dob}
            onChange={(e) => set("dob", e.target.value)}
            error={err("dob")}
          />
          <Text
            label="Home Town (District)"
            name="homeTown"
            required
            value={v.homeTown}
            onChange={(e) => set("homeTown", e.target.value)}
            placeholder="e.g., Pabna"
            error={err("homeTown")}
          />
          <Text
            label="Nationality"
            name="nationality"
            required
            value={v.nationality}
            onChange={(e) => set("nationality", e.target.value)}
            placeholder="Bangladeshi"
            error={err("nationality")}
          />
          <Select
            label="Religion"
            name="religion"
            required
            options={RELIGIONS.map((r) => ({
              value: r,
              label: r === "Other" ? "Other (Specify)" : r,
            }))}
            placeholder="Select Religion"
            value={v.religion}
            onChange={(e) => set("religion", e.target.value)}
            error={err("religion")}
          />
          {v.religion === "Other" ? (
            <Text
              label="Specify Religion"
              name="religionManual"
              required
              value={v.religionManual}
              onChange={(e) => set("religionManual", e.target.value)}
              placeholder="Enter Religion"
              error={err("religionManual")}
            />
          ) : null}
          <Select
            label="Gender"
            name="gender"
            required
            options={GENDERS}
            value={v.gender}
            onChange={(e) => set("gender", e.target.value)}
            error={err("gender")}
          />
          <Select
            label="Blood Group"
            name="bloodGroup"
            required
            options={BLOOD_GROUPS}
            placeholder="Select Group"
            value={v.bloodGroup}
            onChange={(e) => set("bloodGroup", e.target.value)}
            error={err("bloodGroup")}
          />
          <Select
            label="Marital Status"
            name="maritalStatus"
            required
            options={MARITAL_STATUSES}
            placeholder="Select Status"
            value={v.maritalStatus}
            onChange={(e) => set("maritalStatus", e.target.value)}
            error={err("maritalStatus")}
          />
        </div>

        {married ? (
          <div className="mt-4 grid gap-4 rounded-lg border border-slate-200 bg-slate-50/60 p-4 sm:grid-cols-2 lg:grid-cols-3">
            <Text
              label="Spouse's Name"
              name="spouseName"
              required
              value={v.spouseName}
              onChange={(e) => set("spouseName", e.target.value)}
              placeholder="Spouse's Name"
              error={err("spouseName")}
            />
            <Text
              label="Spouse's Occupation"
              name="spouseOccupation"
              value={v.spouseOccupation}
              onChange={(e) => set("spouseOccupation", e.target.value)}
              placeholder="Spouse's Occupation"
            />
            <Text
              label="Spouse Mobile No."
              name="spouseMobile"
              type="tel"
              value={v.spouseMobile}
              onChange={(e) => set("spouseMobile", e.target.value)}
              placeholder="Spouse Mobile"
            />
            <Text
              label="Number of Male Children"
              name="maleChildrenCount"
              type="number"
              min={0}
              value={v.maleChildrenCount}
              onChange={(e) => set("maleChildrenCount", e.target.value)}
              placeholder="0"
            />
            <Text
              label="Number of Female Children"
              name="femaleChildrenCount"
              type="number"
              min={0}
              value={v.femaleChildrenCount}
              onChange={(e) => set("femaleChildrenCount", e.target.value)}
              placeholder="0"
            />
          </div>
        ) : null}
      </section>

      <section>
        <SectionHeading title="Parental Details" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Text
            label="Father's Name"
            name="fatherName"
            required
            value={v.fatherName}
            onChange={(e) => set("fatherName", e.target.value)}
            placeholder="Father's Name"
            error={err("fatherName")}
          />
          <Text
            label="Father's Occupation"
            name="fatherOccupation"
            value={v.fatherOccupation}
            onChange={(e) => set("fatherOccupation", e.target.value)}
            placeholder="Occupation"
          />
          <Text
            label="Father's Tel No."
            name="fatherTelNo"
            type="tel"
            value={v.fatherTelNo}
            onChange={(e) => set("fatherTelNo", e.target.value)}
            placeholder="Telephone Number"
          />
          <Text
            label="Mother's Name"
            name="motherName"
            required
            value={v.motherName}
            onChange={(e) => set("motherName", e.target.value)}
            placeholder="Mother's Name"
            error={err("motherName")}
          />
          <Text
            label="Mother's Occupation"
            name="motherOccupation"
            value={v.motherOccupation}
            onChange={(e) => set("motherOccupation", e.target.value)}
            placeholder="Occupation"
          />
          <Text
            label="Mother's Tel No."
            name="motherTelNo"
            type="tel"
            value={v.motherTelNo}
            onChange={(e) => set("motherTelNo", e.target.value)}
            placeholder="Telephone Number"
          />
        </div>
      </section>

      <section>
        <SectionHeading title="Address Details" />
        <p className="mb-2 text-xs font-medium text-ink-700">
          Present Address <span className="text-red-600">*</span>
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Text
            name="presentVillage"
            value={v.presentVillage}
            onChange={(e) => setPresent("Village", e.target.value)}
            placeholder="House/Vill/City"
            error={err("presentVillage")}
          />
          <Text
            name="presentPO"
            value={v.presentPO}
            onChange={(e) => setPresent("PO", e.target.value)}
            placeholder="Post Office"
            error={err("presentPO")}
          />
          <Text
            name="presentPS"
            value={v.presentPS}
            onChange={(e) => setPresent("PS", e.target.value)}
            placeholder="Police Station"
            error={err("presentPS")}
          />
          <Text
            name="presentDistrict"
            value={v.presentDistrict}
            onChange={(e) => setPresent("District", e.target.value)}
            placeholder="District"
            error={err("presentDistrict")}
          />
        </div>

        <div className="mt-4">
          <Check
            id="sameAsPresent"
            label="Permanent Address is Same as Present Address"
            checked={v.sameAsPresent}
            onChange={syncPermanent}
          />
        </div>

        <p className="mt-4 mb-2 text-xs font-medium text-ink-700">
          Permanent Address <span className="text-red-600">*</span>
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Text
            name="permanentVillage"
            value={v.permanentVillage}
            disabled={v.sameAsPresent}
            onChange={(e) => set("permanentVillage", e.target.value)}
            placeholder="House/Vill/City"
            error={err("permanentVillage")}
          />
          <Text
            name="permanentPO"
            value={v.permanentPO}
            disabled={v.sameAsPresent}
            onChange={(e) => set("permanentPO", e.target.value)}
            placeholder="Post Office"
            error={err("permanentPO")}
          />
          <Text
            name="permanentPS"
            value={v.permanentPS}
            disabled={v.sameAsPresent}
            onChange={(e) => set("permanentPS", e.target.value)}
            placeholder="Police Station"
            error={err("permanentPS")}
          />
          <Text
            name="permanentDistrict"
            value={v.permanentDistrict}
            disabled={v.sameAsPresent}
            onChange={(e) => set("permanentDistrict", e.target.value)}
            placeholder="District"
            error={err("permanentDistrict")}
          />
        </div>
      </section>

      <section>
        <SectionHeading title="Housing Status" />
        <div className="grid gap-4 lg:grid-cols-2">
          <CheckGroup
            label="Type of accommodation"
            options={ACCOMMODATION_TYPES}
            value={v.accommodationType}
            onChange={(next) => set("accommodationType", next)}
            columns={2}
          />
          <CheckGroup
            label="Living with"
            options={LIVING_WITH}
            value={v.livingWith}
            onChange={(next) => set("livingWith", next)}
            columns={2}
          />
        </div>
      </section>

      <section>
        <SectionHeading title="Other Information" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Text
            label="NID Number"
            name="nidNumber"
            value={v.nidNumber}
            onChange={(e) => set("nidNumber", e.target.value)}
            placeholder="National ID Number"
            hint="Needed later if you are selected — please enter it if you have it."
          />
          <Text
            label="Driving License (if any)"
            name="drivingLicenseNumber"
            value={v.drivingLicenseNumber}
            onChange={(e) => set("drivingLicenseNumber", e.target.value)}
            placeholder="License Number"
          />
          <Text
            label="Passport No. (if any)"
            name="passportNo"
            value={v.passportNo}
            onChange={(e) => set("passportNo", e.target.value)}
            placeholder="Passport Number"
          />
          <Text
            label="Place of Issue (Passport)"
            name="passportIssuePlace"
            value={v.passportIssuePlace}
            onChange={(e) => set("passportIssuePlace", e.target.value)}
            placeholder="Place of Issue"
          />
          <Text
            label="Date of Issue (Passport)"
            name="passportIssueDate"
            type="date"
            value={v.passportIssueDate}
            onChange={(e) => set("passportIssueDate", e.target.value)}
          />
          <Text
            label="Date of Expiry (Passport)"
            name="passportExpireDate"
            type="date"
            value={v.passportExpireDate}
            onChange={(e) => set("passportExpireDate", e.target.value)}
          />
          <Text
            label="Hobby"
            name="hobby"
            value={v.hobby}
            onChange={(e) => set("hobby", e.target.value)}
            placeholder="e.g., Reading"
          />
        </div>
      </section>

      <section>
        <SectionHeading
          title="Emergency Contact Person"
          hint="Please provide details of someone other than your spouse or parents, whom we can contact in case of emergency."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Text
            label="Name"
            name="emergencyContactName"
            required
            value={v.emergencyContactName}
            onChange={(e) => set("emergencyContactName", e.target.value)}
            placeholder="Contact Person Name"
            error={err("emergencyContactName")}
          />
          <Text
            label="Relationship with You"
            name="emergencyContactTitle"
            required
            value={v.emergencyContactTitle}
            onChange={(e) => set("emergencyContactTitle", e.target.value)}
            placeholder="Title or Relationship"
            error={err("emergencyContactTitle")}
          />
          <Text
            label="Telephone No."
            name="emergencyContactTelNo"
            type="tel"
            required
            value={v.emergencyContactTelNo}
            onChange={(e) => set("emergencyContactTelNo", e.target.value)}
            placeholder="Telephone Number"
            error={err("emergencyContactTelNo")}
          />
        </div>
      </section>

      <section>
        <SectionHeading
          title="Dependents"
          hint="Individuals who rely on you financially for their living expenses."
        />
        <div className="space-y-3">
          {v.dependents.map((d, i) => (
            <RepeatableCard
              key={i}
              title={`Dependent ${i + 1}`}
              onRemove={() =>
                set(
                  "dependents",
                  v.dependents.filter((_, idx) => idx !== i),
                )
              }
            >
              <div className="grid gap-4 sm:grid-cols-3">
                <Text
                  placeholder="Name"
                  value={d.name}
                  onChange={(e) => {
                    const next = [...v.dependents];
                    next[i] = { ...d, name: e.target.value };
                    set("dependents", next);
                  }}
                />
                <Text
                  type="number"
                  min={0}
                  placeholder="Age"
                  value={d.age}
                  onChange={(e) => {
                    const next = [...v.dependents];
                    next[i] = { ...d, age: e.target.value };
                    set("dependents", next);
                  }}
                />
                <Text
                  placeholder="Relationship with you"
                  value={d.relationship}
                  onChange={(e) => {
                    const next = [...v.dependents];
                    next[i] = { ...d, relationship: e.target.value };
                    set("dependents", next);
                  }}
                />
              </div>
            </RepeatableCard>
          ))}
          <AddButton
            onClick={() => set("dependents", [...v.dependents, emptyDependent()])}
          >
            Add Dependent
          </AddButton>
        </div>
      </section>

      <section>
        <SectionHeading title="Brothers & Sisters" />
        <div className="space-y-3">
          {v.siblings.map((s, i) => (
            <RepeatableCard
              key={i}
              title={`Brother/Sister ${i + 1}`}
              onRemove={() =>
                set(
                  "siblings",
                  v.siblings.filter((_, idx) => idx !== i),
                )
              }
            >
              <div className="grid gap-4 sm:grid-cols-3">
                <Text
                  placeholder="Name"
                  value={s.name}
                  onChange={(e) => {
                    const next = [...v.siblings];
                    next[i] = { ...s, name: e.target.value };
                    set("siblings", next);
                  }}
                />
                <Text
                  type="number"
                  min={0}
                  placeholder="Age"
                  value={s.age}
                  onChange={(e) => {
                    const next = [...v.siblings];
                    next[i] = { ...s, age: e.target.value };
                    set("siblings", next);
                  }}
                />
                <Text
                  placeholder="Occupation"
                  value={s.occupation}
                  onChange={(e) => {
                    const next = [...v.siblings];
                    next[i] = { ...s, occupation: e.target.value };
                    set("siblings", next);
                  }}
                />
              </div>
            </RepeatableCard>
          ))}
          <AddButton onClick={() => set("siblings", [...v.siblings, emptySibling()])}>
            Add Brother/Sister
          </AddButton>
        </div>
      </section>
    </div>
  );
}
