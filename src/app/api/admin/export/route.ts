import type { Prisma } from "@/generated/prisma";
import { isAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateAge, fullAddress, parseList } from "@/lib/utils";

export const runtime = "nodejs";

function csvCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

const COLUMNS = [
  "Application No",
  "Status",
  "Submitted At",
  "Position Applied For",
  "Full Name",
  "Mobile",
  "Email",
  "Date of Birth",
  "Age",
  "Gender",
  "Blood Group",
  "Religion",
  "Marital Status",
  "Spouse Name",
  "Father's Name",
  "Father's Occupation",
  "Mother's Name",
  "Mother's Occupation",
  "Home Town",
  "Present Address",
  "Permanent Address",
  "NID Number",
  "Passport No",
  "Emergency Contact",
  "Emergency Relationship",
  "Emergency Tel",
  "SSC Institution",
  "SSC Result",
  "SSC Year",
  "HSC Institution",
  "HSC Result",
  "HSC Year",
  "Highest Degree",
  "Highest Degree Institution",
  "Highest Degree Result",
  "Experience Status",
  "Current/Last Organization",
  "Current/Last Designation",
  "Current Salary",
  "Expected Salary",
  "Notice Period",
  "Benefits",
  "Relation in SQUARE",
  "Source",
  "Proposals Issued",
  "Proposed Designation",
  "Proposed Salary",
  "Proposed Joining Date",
];

export async function GET(request: Request) {
  if (!(await isAuthenticated())) {
    return new Response("Not signed in.", { status: 401 });
  }

  const url = new URL(request.url);
  const where: Prisma.ApplicationWhereInput = {};

  const q = url.searchParams.get("q")?.trim();
  if (q) {
    where.OR = [
      { fullName: { contains: q } },
      { email: { contains: q } },
      { mobileNumber: { contains: q } },
      { applicationNo: { contains: q } },
      { nidNumber: { contains: q } },
    ];
  }
  const position = url.searchParams.get("position")?.trim();
  if (position) where.positionAppliedFor = position;
  const status = url.searchParams.get("status")?.trim();
  if (status) where.status = status;

  const submittedAt: Prisma.DateTimeFilter = {};
  const from = url.searchParams.get("from");
  if (from) {
    const d = new Date(from);
    if (!Number.isNaN(d.getTime())) submittedAt.gte = d;
  }
  const to = url.searchParams.get("to");
  if (to) {
    const d = new Date(to);
    if (!Number.isNaN(d.getTime())) {
      d.setHours(23, 59, 59, 999);
      submittedAt.lte = d;
    }
  }
  if (submittedAt.gte || submittedAt.lte) where.submittedAt = submittedAt;

  const applications = await prisma.application.findMany({
    where,
    orderBy: { submittedAt: "desc" },
    include: {
      higherEducations: { orderBy: { sortOrder: "desc" }, take: 1 },
      experiences: { orderBy: { sortOrder: "asc" }, take: 1 },
      proposals: { orderBy: { issuedAt: "desc" }, take: 1 },
    },
  });

  const lines = [COLUMNS.join(",")];
  for (const a of applications) {
    const top = a.higherEducations[0];
    const job = a.experiences[0];
    const proposal = a.proposals[0];

    lines.push(
      [
        a.applicationNo,
        a.status,
        a.submittedAt.toISOString(),
        a.positionAppliedFor,
        a.fullName,
        a.mobileNumber,
        a.email,
        a.dob.toISOString().slice(0, 10),
        calculateAge(a.dob),
        a.gender,
        a.bloodGroup,
        a.religion === "Other" ? a.religionManual : a.religion,
        a.maritalStatus,
        a.spouseName,
        a.fatherName,
        a.fatherOccupation,
        a.motherName,
        a.motherOccupation,
        a.homeTown,
        fullAddress({
          village: a.presentVillage,
          po: a.presentPO,
          ps: a.presentPS,
          district: a.presentDistrict,
        }),
        fullAddress({
          village: a.permanentVillage,
          po: a.permanentPO,
          ps: a.permanentPS,
          district: a.permanentDistrict,
        }),
        a.nidNumber,
        a.passportNo,
        a.emergencyContactName,
        a.emergencyContactTitle,
        a.emergencyContactTelNo,
        a.sscInstitution,
        a.sscResult,
        a.sscYear,
        a.hscInstitution,
        a.hscResult,
        a.hscYear,
        top?.degreeType === "Manual Entry" ? top?.degreeTypeManual : top?.degreeType,
        top?.institution,
        top?.result,
        a.experienceStatus,
        job?.orgName,
        job?.designation,
        a.currentSalary,
        a.expectedSalary,
        a.noticePeriod,
        parseList(a.benefits).join("; "),
        a.relationInSquare,
        a.source === "Others" ? a.sourceManual : a.source,
        a.proposals.length,
        proposal?.designation,
        proposal?.salary,
        proposal?.joiningDate.toISOString().slice(0, 10),
      ]
        .map(csvCell)
        .join(","),
    );
  }

  const stamp = new Date().toISOString().slice(0, 10);
  // The BOM keeps Excel from mangling names when it opens the file.
  return new Response("﻿" + lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="applications-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
