import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma";
import { applicationSchema, type ApplicationParsed } from "@/lib/application-schema";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const orNull = (value: string | undefined | null) =>
  value && value.trim() ? value.trim() : null;

const dateOrNull = (value: string | undefined | null) => {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
};

/** Sequential, human-readable reference: STL-2026-0001. */
async function nextApplicationNo(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `STL-${year}-`;
  const latest = await prisma.application.findFirst({
    where: { applicationNo: { startsWith: prefix } },
    orderBy: { applicationNo: "desc" },
    select: { applicationNo: true },
  });
  const lastSeq = latest ? Number(latest.applicationNo.slice(prefix.length)) : 0;
  const next = (Number.isFinite(lastSeq) ? lastSeq : 0) + 1;
  return `${prefix}${String(next).padStart(4, "0")}`;
}

function buildData(
  data: ApplicationParsed,
  applicationNo: string,
): Prisma.ApplicationCreateInput {
  return {
    applicationNo,
    positionAppliedFor: data.positionAppliedFor,
    fullName: data.fullName,
    mobileNumber: data.mobileNumber,
    email: data.email.toLowerCase(),
    dob: new Date(data.dob),
    homeTown: data.homeTown,
    nationality: data.nationality,
    religion: data.religion,
    religionManual: orNull(data.religionManual),
    gender: data.gender,
    bloodGroup: data.bloodGroup,
    maritalStatus: data.maritalStatus,
    spouseName: orNull(data.spouseName),
    spouseOccupation: orNull(data.spouseOccupation),
    spouseMobile: orNull(data.spouseMobile),
    maleChildrenCount: data.maleChildrenCount,
    femaleChildrenCount: data.femaleChildrenCount,

    fatherName: data.fatherName,
    fatherOccupation: orNull(data.fatherOccupation),
    fatherTelNo: orNull(data.fatherTelNo),
    motherName: data.motherName,
    motherOccupation: orNull(data.motherOccupation),
    motherTelNo: orNull(data.motherTelNo),

    presentVillage: data.presentVillage,
    presentPO: data.presentPO,
    presentPS: data.presentPS,
    presentDistrict: data.presentDistrict,
    sameAsPresent: data.sameAsPresent,
    permanentVillage: data.permanentVillage,
    permanentPO: data.permanentPO,
    permanentPS: data.permanentPS,
    permanentDistrict: data.permanentDistrict,

    accommodationType: JSON.stringify(data.accommodationType),
    livingWith: JSON.stringify(data.livingWith),

    nidNumber: orNull(data.nidNumber),
    drivingLicenseNumber: orNull(data.drivingLicenseNumber),
    passportNo: orNull(data.passportNo),
    passportIssuePlace: orNull(data.passportIssuePlace),
    passportIssueDate: dateOrNull(data.passportIssueDate),
    passportExpireDate: dateOrNull(data.passportExpireDate),
    hobby: orNull(data.hobby),

    emergencyContactName: data.emergencyContactName,
    emergencyContactTitle: data.emergencyContactTitle,
    emergencyContactTelNo: data.emergencyContactTelNo,

    sscType: data.sscType,
    sscTypeManual: orNull(data.sscTypeManual),
    sscGroup: data.sscGroup,
    sscGroupManual: orNull(data.sscGroupManual),
    sscInstitution: data.sscInstitution,
    sscBoard: data.sscBoard,
    sscBoardManual: orNull(data.sscBoardManual),
    sscResult: data.sscResult,
    sscYear: data.sscYear,

    hscType: orNull(data.hscType),
    hscTypeManual: orNull(data.hscTypeManual),
    hscGroup: orNull(data.hscGroup),
    hscGroupManual: orNull(data.hscGroupManual),
    hscInstitution: orNull(data.hscInstitution),
    hscBoard: orNull(data.hscBoard),
    hscBoardManual: orNull(data.hscBoardManual),
    hscResult: orNull(data.hscResult),
    hscYear: orNull(data.hscYear),

    experienceStatus: data.experienceStatus,

    currentSalary: data.currentSalary,
    expectedSalary: data.expectedSalary,
    benefits: JSON.stringify(data.benefits),
    bonusCount: orNull(data.bonusCount),
    otherBenefits: JSON.stringify(data.otherBenefits),
    noticePeriod: data.noticePeriod,

    medicalHistory: orNull(data.medicalHistory),
    hasDisability: data.hasDisability,
    disabilityDetails: orNull(data.disabilityDetails),
    relationInSquare: orNull(data.relationInSquare),
    source: data.source,
    sourceManual: orNull(data.sourceManual),
    photoData: data.photoData,
    declaration: data.declaration,

    dependents: {
      create: data.dependents.map((d, i) => ({
        name: d.name,
        age: d.age,
        relationship: orNull(d.relationship),
        sortOrder: i,
      })),
    },
    siblings: {
      create: data.siblings.map((s, i) => ({
        name: s.name,
        age: s.age,
        occupation: orNull(s.occupation),
        sortOrder: i,
      })),
    },
    higherEducations: {
      create: data.higherEducations.map((h, i) => ({
        degreeType: orNull(h.degreeType),
        degreeTypeManual: orNull(h.degreeTypeManual),
        major: orNull(h.major),
        institution: orNull(h.institution),
        isAffiliated: h.isAffiliated,
        affiliatedUniversity: orNull(h.affiliatedUniversity),
        result: orNull(h.result),
        passingYear: orNull(h.passingYear),
        sortOrder: i,
      })),
    },
    experiences: {
      create: data.experiences.map((e, i) => ({
        orgName: orNull(e.orgName),
        designation: orNull(e.designation),
        fromDate: orNull(e.fromDate),
        toDate: e.currentlyWorking ? null : orNull(e.toDate),
        currentlyWorking: e.currentlyWorking,
        superiorName: orNull(e.superiorName),
        superiorTitle: orNull(e.superiorTitle),
        superiorTelNo: orNull(e.superiorTelNo),
        salaryStart: e.salaryStart,
        salaryEnd: e.salaryEnd,
        reasonForLeaving: orNull(e.reasonForLeaving),
        sortOrder: i,
        promotions: {
          create: e.promotions
            .filter((p) => p.designation)
            .map((p, pi) => ({
              designation: orNull(p.designation),
              fromDate: orNull(p.fromDate),
              toDate: orNull(p.toDate),
              sortOrder: pi,
            })),
        },
      })),
    },
    squareRelations: {
      create: data.squareRelations.map((r, i) => ({
        name: r.name,
        designation: orNull(r.designation),
        department: orNull(r.department),
        company: orNull(r.company),
        relationship: orNull(r.relationship),
        mobile: orNull(r.mobile),
        sortOrder: i,
      })),
    },
  };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "We could not read your submission. Please try again." },
      { status: 400 },
    );
  }

  const parsed = applicationSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return NextResponse.json(
      { message: "Some answers still need attention.", fieldErrors },
      { status: 422 },
    );
  }

  // The reference number is derived from the highest existing one, so two
  // simultaneous submissions can collide; retry on the unique constraint.
  for (let attempt = 0; attempt < 5; attempt++) {
    const applicationNo = await nextApplicationNo();
    try {
      const created = await prisma.application.create({
        data: buildData(parsed.data, applicationNo),
        select: { applicationNo: true },
      });
      return NextResponse.json({ applicationNo: created.applicationNo }, { status: 201 });
    } catch (error) {
      const isDuplicateRef =
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002";
      if (!isDuplicateRef) {
        console.error("Application submission failed", error);
        return NextResponse.json(
          { message: "Something went wrong while saving your application." },
          { status: 500 },
        );
      }
    }
  }

  return NextResponse.json(
    { message: "The system is busy right now. Please submit again in a moment." },
    { status: 503 },
  );
}
