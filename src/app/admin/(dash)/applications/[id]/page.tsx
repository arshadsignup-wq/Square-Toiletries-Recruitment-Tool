import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Card, DataRow, EmptyState, SectionHeading, statusTone } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import {
  calculateAge,
  formatBDT,
  formatDate,
  formatDateTime,
  formatMonth,
  fullAddress,
  monthSpan,
  parseList,
} from "@/lib/utils";
import NotesEditor from "./NotesEditor";
import ProposalPanel from "./ProposalPanel";
import StatusControl from "./StatusControl";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const a = await prisma.application.findUnique({
    where: { id },
    select: { fullName: true, applicationNo: true },
  });
  return {
    title: a ? `${a.fullName} (${a.applicationNo}) — HR Dashboard` : "Application — HR Dashboard",
  };
}

export default async function ApplicationDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const a = await prisma.application.findUnique({
    where: { id },
    include: {
      dependents: { orderBy: { sortOrder: "asc" } },
      siblings: { orderBy: { sortOrder: "asc" } },
      higherEducations: { orderBy: { sortOrder: "asc" } },
      experiences: {
        orderBy: { sortOrder: "asc" },
        include: { promotions: { orderBy: { sortOrder: "asc" } } },
      },
      squareRelations: { orderBy: { sortOrder: "asc" } },
      proposals: { orderBy: { issuedAt: "desc" } },
    },
  });

  if (!a) notFound();

  const age = calculateAge(a.dob);
  const presentAddress = fullAddress({
    village: a.presentVillage,
    po: a.presentPO,
    ps: a.presentPS,
    district: a.presentDistrict,
  });
  const permanentAddress = fullAddress({
    village: a.permanentVillage,
    po: a.permanentPO,
    ps: a.permanentPS,
    district: a.permanentDistrict,
  });

  const currentRole = a.experiences[0];
  const benefits = parseList(a.benefits);
  const otherBenefits = parseList(a.otherBenefits);

  return (
    <div className="space-y-5">
      <Link
        href="/admin"
        className="inline-block text-sm font-medium text-brand-700 hover:underline"
      >
        ← Back to applications
      </Link>

      <Card className="p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
            {a.photoData ? (
              // Stored as a data URL — next/image cannot optimise these.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={a.photoData}
                alt={a.fullName}
                className="size-full object-cover"
              />
            ) : (
              <span className="text-xs text-ink-500">No photo</span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold text-ink-900">{a.fullName}</h1>
              <Badge tone={statusTone(a.status)}>{a.status}</Badge>
            </div>
            <p className="mt-1 text-sm text-ink-700">{a.positionAppliedFor}</p>
            <dl className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2 lg:grid-cols-3">
              <Meta label="Application no." value={a.applicationNo} mono />
              <Meta label="Submitted" value={formatDateTime(a.submittedAt)} />
              <Meta label="Age" value={`${age} years`} />
              <Meta label="Mobile" value={a.mobileNumber} />
              <Meta label="Email" value={a.email} />
              <Meta label="NID" value={a.nidNumber ?? "Not provided"} />
              <Meta label="Expected salary" value={formatBDT(a.expectedSalary)} />
              <Meta label="Notice period" value={a.noticePeriod} />
              <Meta label="Experience" value={a.experienceStatus} />
            </dl>
          </div>

          <div className="shrink-0">
            <StatusControl applicationId={a.id} status={a.status} />
          </div>
        </div>
      </Card>

      <ProposalPanel
        applicationId={a.id}
        defaults={{
          candidateName: a.fullName,
          designation: a.positionAppliedFor,
          age,
          nidNumber: a.nidNumber ?? "",
          address: presentAddress,
          salary: a.expectedSalary,
        }}
        proposals={a.proposals.map((p) => ({
          id: p.id,
          referenceNo: p.referenceNo,
          designation: p.designation,
          salary: p.salary,
          joiningDate: p.joiningDate.toISOString(),
          issuedAt: p.issuedAt.toISOString(),
        }))}
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="p-5">
          <SectionHeading title="Basic Information" />
          <dl>
            <DataRow label="Full name (as per NID)" value={a.fullName} />
            <DataRow label="Date of birth" value={`${formatDate(a.dob)} (${age} years)`} />
            <DataRow label="Gender" value={a.gender} />
            <DataRow label="Blood group" value={a.bloodGroup} />
            <DataRow
              label="Religion"
              value={a.religion === "Other" ? a.religionManual : a.religion}
            />
            <DataRow label="Nationality" value={a.nationality} />
            <DataRow label="Home town" value={a.homeTown} />
            <DataRow label="Marital status" value={a.maritalStatus} />
            {a.maritalStatus === "Married" ? (
              <>
                <DataRow label="Spouse's name" value={a.spouseName} />
                <DataRow label="Spouse's occupation" value={a.spouseOccupation} />
                <DataRow label="Spouse mobile" value={a.spouseMobile} />
                <DataRow
                  label="Children"
                  value={`${a.maleChildrenCount ?? 0} male, ${a.femaleChildrenCount ?? 0} female`}
                />
              </>
            ) : null}
            <DataRow label="Hobby" value={a.hobby} />
          </dl>
        </Card>

        <Card className="p-5">
          <SectionHeading title="Parental Details" />
          <dl>
            <DataRow label="Father's name" value={a.fatherName} />
            <DataRow label="Father's occupation" value={a.fatherOccupation} />
            <DataRow label="Father's tel no." value={a.fatherTelNo} />
            <DataRow label="Mother's name" value={a.motherName} />
            <DataRow label="Mother's occupation" value={a.motherOccupation} />
            <DataRow label="Mother's tel no." value={a.motherTelNo} />
          </dl>
        </Card>

        <Card className="p-5">
          <SectionHeading title="Address & Housing" />
          <dl>
            <DataRow label="Present address" value={presentAddress} />
            <DataRow label="Permanent address" value={permanentAddress} />
            <DataRow
              label="Accommodation"
              value={parseList(a.accommodationType).join(", ")}
            />
            <DataRow label="Living with" value={parseList(a.livingWith).join(", ")} />
          </dl>
        </Card>

        <Card className="p-5">
          <SectionHeading title="Identification & Emergency Contact" />
          <dl>
            <DataRow label="NID number" value={a.nidNumber} />
            <DataRow label="Driving license" value={a.drivingLicenseNumber} />
            <DataRow label="Passport no." value={a.passportNo} />
            <DataRow label="Passport place of issue" value={a.passportIssuePlace} />
            <DataRow
              label="Passport validity"
              value={
                a.passportIssueDate || a.passportExpireDate
                  ? `${formatDate(a.passportIssueDate)} → ${formatDate(a.passportExpireDate)}`
                  : null
              }
            />
            <DataRow label="Emergency contact" value={a.emergencyContactName} />
            <DataRow label="Relationship" value={a.emergencyContactTitle} />
            <DataRow label="Emergency tel no." value={a.emergencyContactTelNo} />
          </dl>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="p-5">
          <SectionHeading title="Dependents" />
          {a.dependents.length === 0 ? (
            <EmptyState>None listed.</EmptyState>
          ) : (
            <MiniTable
              head={["Name", "Age", "Relationship"]}
              rows={a.dependents.map((d) => [d.name, d.age ?? "—", d.relationship ?? "—"])}
            />
          )}
        </Card>

        <Card className="p-5">
          <SectionHeading title="Brothers & Sisters" />
          {a.siblings.length === 0 ? (
            <EmptyState>None listed.</EmptyState>
          ) : (
            <MiniTable
              head={["Name", "Age", "Occupation"]}
              rows={a.siblings.map((s) => [s.name, s.age ?? "—", s.occupation ?? "—"])}
            />
          )}
        </Card>
      </div>

      <Card className="p-5">
        <SectionHeading title="Education" />
        <MiniTable
          head={["Level", "Group / Major", "Institution", "Board / University", "Result", "Year"]}
          rows={[
            [
              a.sscType === "Manual Entry" ? (a.sscTypeManual ?? "—") : a.sscType,
              a.sscGroup === "Other" ? (a.sscGroupManual ?? "—") : a.sscGroup,
              a.sscInstitution,
              a.sscBoard === "Other" ? (a.sscBoardManual ?? "—") : a.sscBoard,
              a.sscResult,
              a.sscYear,
            ],
            ...(a.hscType || a.hscInstitution
              ? [
                  [
                    a.hscType === "Manual Entry" ? (a.hscTypeManual ?? "—") : (a.hscType ?? "—"),
                    a.hscGroup === "Other" ? (a.hscGroupManual ?? "—") : (a.hscGroup ?? "—"),
                    a.hscInstitution ?? "—",
                    a.hscBoard === "Other" ? (a.hscBoardManual ?? "—") : (a.hscBoard ?? "—"),
                    a.hscResult ?? "—",
                    a.hscYear ?? "—",
                  ],
                ]
              : []),
            ...a.higherEducations.map((h) => [
              h.degreeType === "Manual Entry"
                ? (h.degreeTypeManual ?? "—")
                : (h.degreeType ?? "—"),
              h.major ?? "—",
              h.institution ?? "—",
              h.isAffiliated ? (h.affiliatedUniversity ?? "—") : "—",
              h.result ?? "—",
              h.passingYear ?? "—",
            ]),
          ]}
        />
      </Card>

      <Card className="p-5">
        <SectionHeading title="Work Experience" />
        {a.experienceStatus === "Fresher" || a.experiences.length === 0 ? (
          <EmptyState>Fresher — no employment history submitted.</EmptyState>
        ) : (
          <div className="space-y-4">
            {a.experiences.map((e, i) => (
              <div
                key={e.id}
                className="rounded-lg border border-slate-200 bg-slate-50/60 p-4"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h4 className="text-sm font-semibold text-ink-900">
                    {e.designation ?? "—"} · {e.orgName ?? "—"}
                  </h4>
                  <span className="text-xs text-ink-500">
                    {formatMonth(e.fromDate)} →{" "}
                    {e.currentlyWorking ? "Present" : formatMonth(e.toDate)} (
                    {monthSpan(e.fromDate, e.currentlyWorking ? null : e.toDate)})
                    {i === 0 && e.currentlyWorking ? " · Current" : ""}
                  </span>
                </div>
                <dl className="mt-3 grid gap-x-6 sm:grid-cols-2">
                  <DataRow label="Joining salary" value={formatBDT(e.salaryStart)} />
                  <DataRow label="Leaving salary" value={formatBDT(e.salaryEnd)} />
                  <DataRow label="Supervisor" value={e.superiorName} />
                  <DataRow label="Supervisor title" value={e.superiorTitle} />
                  <DataRow label="Supervisor tel no." value={e.superiorTelNo} />
                  <DataRow label="Reason for leaving" value={e.reasonForLeaving} />
                </dl>
                {e.promotions.length > 0 ? (
                  <div className="mt-3">
                    <p className="mb-1.5 text-xs font-medium text-ink-500">
                      Previous designations in this organization
                    </p>
                    <MiniTable
                      head={["Designation", "From", "To"]}
                      rows={e.promotions.map((p) => [
                        p.designation ?? "—",
                        formatMonth(p.fromDate),
                        formatMonth(p.toDate),
                      ])}
                    />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="p-5">
          <SectionHeading title="Compensation" />
          <dl>
            <DataRow label="Current salary" value={formatBDT(a.currentSalary)} />
            <DataRow label="Expected salary" value={formatBDT(a.expectedSalary)} />
            <DataRow
              label="Current role"
              value={
                currentRole
                  ? `${currentRole.designation ?? "—"} at ${currentRole.orgName ?? "—"}`
                  : null
              }
            />
            <DataRow label="Benefits received" value={benefits.join(", ")} />
            <DataRow label="Bonuses per year" value={a.bonusCount} />
            <DataRow label="Other benefits" value={otherBenefits.join(", ")} />
            <DataRow label="Notice period" value={a.noticePeriod} />
          </dl>
        </Card>

        <Card className="p-5">
          <SectionHeading title="Disclosure" />
          <dl>
            <DataRow label="Medical history" value={a.medicalHistory} />
            <DataRow
              label="Disability disclosed"
              value={a.hasDisability ? (a.disabilityDetails || "Yes") : "No"}
            />
            <DataRow label="Relation in SQUARE" value={a.relationInSquare} />
            <DataRow
              label="Heard about us via"
              value={a.source === "Others" ? a.sourceManual : a.source}
            />
            <DataRow
              label="Declaration accepted"
              value={a.declaration ? "Yes" : "No"}
            />
          </dl>
          {a.squareRelations.length > 0 ? (
            <div className="mt-4">
              <p className="mb-1.5 text-xs font-medium text-ink-500">
                Relatives working in SQUARE
              </p>
              <MiniTable
                head={["Name", "Designation", "Department", "Company", "Relationship", "Mobile"]}
                rows={a.squareRelations.map((r) => [
                  r.name,
                  r.designation ?? "—",
                  r.department ?? "—",
                  r.company ?? "—",
                  r.relationship ?? "—",
                  r.mobile ?? "—",
                ])}
              />
            </div>
          ) : null}
        </Card>
      </div>

      <Card className="p-5">
        <SectionHeading title="HR Notes" hint="Visible only to the HR team." />
        <NotesEditor applicationId={a.id} initialNotes={a.hrNotes ?? ""} />
      </Card>
    </div>
  );
}

function Meta({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className="text-xs text-ink-500">{label}</dt>
      <dd className={`text-ink-900 ${mono ? "font-mono text-xs" : ""}`}>{value}</dd>
    </div>
  );
}

function MiniTable({
  head,
  rows,
}: {
  head: string[];
  rows: Array<Array<string | number>>;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[32rem] text-sm">
        <thead className="text-left text-xs text-ink-500 uppercase">
          <tr className="border-b border-slate-200">
            {head.map((h) => (
              <th key={h} className="py-2 pr-4 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className="py-2 pr-4 text-ink-700">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
