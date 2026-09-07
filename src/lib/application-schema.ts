import { z } from "zod";

const optionalText = z.string().trim().optional().default("");
const requiredText = (label: string) =>
  z.string().trim().min(1, { message: `${label} is required` });

const optionalNumber = z
  .union([z.number(), z.string()])
  .optional()
  .transform((v) => {
    if (v === undefined || v === null || v === "") return null;
    const n = typeof v === "number" ? v : Number(v);
    return Number.isFinite(n) ? n : null;
  });

export const dependentSchema = z.object({
  name: z.string().trim().default(""),
  age: optionalNumber,
  relationship: optionalText,
});

export const siblingSchema = z.object({
  name: z.string().trim().default(""),
  age: optionalNumber,
  occupation: optionalText,
});

export const higherEducationSchema = z.object({
  degreeType: optionalText,
  degreeTypeManual: optionalText,
  major: optionalText,
  institution: optionalText,
  isAffiliated: z.boolean().default(false),
  affiliatedUniversity: optionalText,
  result: optionalText,
  passingYear: optionalText,
});

export const promotionSchema = z.object({
  designation: optionalText,
  fromDate: optionalText,
  toDate: optionalText,
});

export const experienceSchema = z.object({
  orgName: optionalText,
  designation: optionalText,
  fromDate: optionalText,
  toDate: optionalText,
  currentlyWorking: z.boolean().default(false),
  superiorName: optionalText,
  superiorTitle: optionalText,
  superiorTelNo: optionalText,
  salaryStart: optionalNumber,
  salaryEnd: optionalNumber,
  reasonForLeaving: optionalText,
  promotions: z.array(promotionSchema).default([]),
});

export const squareRelationSchema = z.object({
  name: z.string().trim().default(""),
  designation: optionalText,
  department: optionalText,
  company: optionalText,
  relationship: optionalText,
  mobile: optionalText,
});

export const applicationSchema = z
  .object({
    // Step 1 — Basic Information
    positionAppliedFor: requiredText("Position applied for"),
    fullName: requiredText("Full name"),
    mobileNumber: requiredText("Mobile number"),
    email: z.string().trim().email({ message: "A valid email address is required" }),
    dob: requiredText("Date of birth"),
    homeTown: requiredText("Home town"),
    nationality: requiredText("Nationality"),
    religion: requiredText("Religion"),
    religionManual: optionalText,
    gender: requiredText("Gender"),
    bloodGroup: requiredText("Blood group"),
    maritalStatus: requiredText("Marital status"),
    spouseName: optionalText,
    spouseOccupation: optionalText,
    spouseMobile: optionalText,
    maleChildrenCount: optionalNumber,
    femaleChildrenCount: optionalNumber,

    // Parental
    fatherName: requiredText("Father's name"),
    fatherOccupation: optionalText,
    fatherTelNo: optionalText,
    motherName: requiredText("Mother's name"),
    motherOccupation: optionalText,
    motherTelNo: optionalText,

    // Address
    presentVillage: requiredText("Present address (house/village/city)"),
    presentPO: requiredText("Present post office"),
    presentPS: requiredText("Present police station"),
    presentDistrict: requiredText("Present district"),
    sameAsPresent: z.boolean().default(false),
    permanentVillage: requiredText("Permanent address (house/village/city)"),
    permanentPO: requiredText("Permanent post office"),
    permanentPS: requiredText("Permanent police station"),
    permanentDistrict: requiredText("Permanent district"),

    // Housing
    accommodationType: z.array(z.string()).default([]),
    livingWith: z.array(z.string()).default([]),

    // Other information
    nidNumber: optionalText,
    drivingLicenseNumber: optionalText,
    passportNo: optionalText,
    passportIssuePlace: optionalText,
    passportIssueDate: optionalText,
    passportExpireDate: optionalText,
    hobby: optionalText,

    // Emergency contact
    emergencyContactName: requiredText("Emergency contact name"),
    emergencyContactTitle: requiredText("Emergency contact relationship"),
    emergencyContactTelNo: requiredText("Emergency contact telephone number"),

    dependents: z.array(dependentSchema).default([]),
    siblings: z.array(siblingSchema).default([]),

    // Step 2 — Education
    sscType: requiredText("SSC degree type"),
    sscTypeManual: optionalText,
    sscGroup: requiredText("SSC group/major"),
    sscGroupManual: optionalText,
    sscInstitution: requiredText("SSC institution"),
    sscBoard: requiredText("SSC board"),
    sscBoardManual: optionalText,
    sscResult: requiredText("SSC result"),
    sscYear: requiredText("SSC passing year"),

    hscType: optionalText,
    hscTypeManual: optionalText,
    hscGroup: optionalText,
    hscGroupManual: optionalText,
    hscInstitution: optionalText,
    hscBoard: optionalText,
    hscBoardManual: optionalText,
    hscResult: optionalText,
    hscYear: optionalText,

    higherEducations: z.array(higherEducationSchema).default([]),

    // Step 3 — Work Experience
    experienceStatus: z.enum(["Fresher", "Experienced"], {
      message: "Select whether you are a fresher or experienced",
    }),
    experiences: z.array(experienceSchema).default([]),

    // Step 4 — Compensation
    currentSalary: optionalNumber,
    expectedSalary: z
      .union([z.number(), z.string()])
      .transform((v) => (typeof v === "number" ? v : Number(v)))
      .refine((v) => Number.isFinite(v) && v > 0, {
        message: "Expected salary is required",
      }),
    benefits: z.array(z.string()).default([]),
    bonusCount: optionalText,
    otherBenefits: z.array(z.string()).default([]),
    noticePeriod: requiredText("Notice period"),

    // Step 5 — Disclosure
    medicalHistory: optionalText,
    hasDisability: z.boolean().default(false),
    disabilityDetails: optionalText,
    relationInSquare: optionalText,
    squareRelations: z.array(squareRelationSchema).default([]),
    source: requiredText("How you heard about us"),
    sourceManual: optionalText,
    photoData: z
      .string()
      .min(1, { message: "A passport-size photo is required" })
      .refine((v) => v.startsWith("data:image/"), {
        message: "The photo must be an image file",
      }),
    declaration: z.literal(true, {
      message: "You must accept the declaration before submitting",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.maritalStatus === "Married" && !data.spouseName) {
      ctx.addIssue({
        code: "custom",
        path: ["spouseName"],
        message: "Spouse's name is required for married candidates",
      });
    }
    if (data.religion === "Other" && !data.religionManual) {
      ctx.addIssue({
        code: "custom",
        path: ["religionManual"],
        message: "Please specify your religion",
      });
    }
    if (data.source === "Others" && !data.sourceManual) {
      ctx.addIssue({
        code: "custom",
        path: ["sourceManual"],
        message: "Please specify where you heard about us",
      });
    }
    if (data.experienceStatus === "Experienced") {
      const hasOne = data.experiences.some((e) => e.orgName && e.designation);
      if (!hasOne) {
        ctx.addIssue({
          code: "custom",
          path: ["experiences"],
          message: "Add at least one experience with an organization and designation",
        });
      }
    }
    if (data.relationInSquare === "Yes" && data.squareRelations.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["squareRelations"],
        message: "Add the details of your relative(s) working in SQUARE",
      });
    }
  });

export type ApplicationInput = z.input<typeof applicationSchema>;
export type ApplicationParsed = z.output<typeof applicationSchema>;
