export type DependentValue = { name: string; age: string; relationship: string };
export type SiblingValue = { name: string; age: string; occupation: string };

export type HigherEducationValue = {
  degreeType: string;
  degreeTypeManual: string;
  major: string;
  institution: string;
  isAffiliated: boolean;
  affiliatedUniversity: string;
  result: string;
  passingYear: string;
};

export type PromotionValue = { designation: string; fromDate: string; toDate: string };

export type ExperienceValue = {
  orgName: string;
  designation: string;
  fromDate: string;
  toDate: string;
  currentlyWorking: boolean;
  superiorName: string;
  superiorTitle: string;
  superiorTelNo: string;
  salaryStart: string;
  salaryEnd: string;
  reasonForLeaving: string;
  promotions: PromotionValue[];
};

export type SquareRelationValue = {
  name: string;
  designation: string;
  department: string;
  company: string;
  relationship: string;
  mobile: string;
};

export type FormValues = {
  positionAppliedFor: string;
  fullName: string;
  mobileNumber: string;
  email: string;
  dob: string;
  homeTown: string;
  nationality: string;
  religion: string;
  religionManual: string;
  gender: string;
  bloodGroup: string;
  maritalStatus: string;
  spouseName: string;
  spouseOccupation: string;
  spouseMobile: string;
  maleChildrenCount: string;
  femaleChildrenCount: string;

  fatherName: string;
  fatherOccupation: string;
  fatherTelNo: string;
  motherName: string;
  motherOccupation: string;
  motherTelNo: string;

  presentVillage: string;
  presentPO: string;
  presentPS: string;
  presentDistrict: string;
  sameAsPresent: boolean;
  permanentVillage: string;
  permanentPO: string;
  permanentPS: string;
  permanentDistrict: string;

  accommodationType: string[];
  livingWith: string[];

  nidNumber: string;
  drivingLicenseNumber: string;
  passportNo: string;
  passportIssuePlace: string;
  passportIssueDate: string;
  passportExpireDate: string;
  hobby: string;

  emergencyContactName: string;
  emergencyContactTitle: string;
  emergencyContactTelNo: string;

  dependents: DependentValue[];
  siblings: SiblingValue[];

  sscType: string;
  sscTypeManual: string;
  sscGroup: string;
  sscGroupManual: string;
  sscInstitution: string;
  sscBoard: string;
  sscBoardManual: string;
  sscResult: string;
  sscYear: string;

  hscType: string;
  hscTypeManual: string;
  hscGroup: string;
  hscGroupManual: string;
  hscInstitution: string;
  hscBoard: string;
  hscBoardManual: string;
  hscResult: string;
  hscYear: string;

  higherEducations: HigherEducationValue[];

  experienceStatus: string;
  experiences: ExperienceValue[];

  currentSalary: string;
  expectedSalary: string;
  benefits: string[];
  bonusCount: string;
  otherBenefits: string[];
  noticePeriod: string;

  medicalHistory: string;
  hasDisability: boolean;
  disabilityDetails: string;
  relationInSquare: string;
  squareRelations: SquareRelationValue[];
  source: string;
  sourceManual: string;
  photoData: string;
  declaration: boolean;
};

export const emptyDependent = (): DependentValue => ({
  name: "",
  age: "",
  relationship: "",
});

export const emptySibling = (): SiblingValue => ({
  name: "",
  age: "",
  occupation: "",
});

export const emptyHigherEducation = (): HigherEducationValue => ({
  degreeType: "",
  degreeTypeManual: "",
  major: "",
  institution: "",
  isAffiliated: false,
  affiliatedUniversity: "",
  result: "",
  passingYear: "",
});

export const emptyPromotion = (): PromotionValue => ({
  designation: "",
  fromDate: "",
  toDate: "",
});

export const emptyExperience = (): ExperienceValue => ({
  orgName: "",
  designation: "",
  fromDate: "",
  toDate: "",
  currentlyWorking: false,
  superiorName: "",
  superiorTitle: "",
  superiorTelNo: "",
  salaryStart: "",
  salaryEnd: "",
  reasonForLeaving: "",
  promotions: [],
});

export const emptySquareRelation = (): SquareRelationValue => ({
  name: "",
  designation: "",
  department: "",
  company: "",
  relationship: "",
  mobile: "",
});

export function initialValues(position: string): FormValues {
  return {
    positionAppliedFor: position,
    fullName: "",
    mobileNumber: "",
    email: "",
    dob: "",
    homeTown: "",
    nationality: "Bangladeshi",
    religion: "",
    religionManual: "",
    gender: "",
    bloodGroup: "",
    maritalStatus: "Unmarried",
    spouseName: "",
    spouseOccupation: "",
    spouseMobile: "",
    maleChildrenCount: "",
    femaleChildrenCount: "",

    fatherName: "",
    fatherOccupation: "",
    fatherTelNo: "",
    motherName: "",
    motherOccupation: "",
    motherTelNo: "",

    presentVillage: "",
    presentPO: "",
    presentPS: "",
    presentDistrict: "",
    sameAsPresent: false,
    permanentVillage: "",
    permanentPO: "",
    permanentPS: "",
    permanentDistrict: "",

    accommodationType: [],
    livingWith: [],

    nidNumber: "",
    drivingLicenseNumber: "",
    passportNo: "",
    passportIssuePlace: "",
    passportIssueDate: "",
    passportExpireDate: "",
    hobby: "",

    emergencyContactName: "",
    emergencyContactTitle: "",
    emergencyContactTelNo: "",

    dependents: [],
    siblings: [],

    sscType: "",
    sscTypeManual: "",
    sscGroup: "",
    sscGroupManual: "",
    sscInstitution: "",
    sscBoard: "",
    sscBoardManual: "",
    sscResult: "",
    sscYear: "",

    hscType: "",
    hscTypeManual: "",
    hscGroup: "",
    hscGroupManual: "",
    hscInstitution: "",
    hscBoard: "",
    hscBoardManual: "",
    hscResult: "",
    hscYear: "",

    higherEducations: [],

    experienceStatus: "",
    experiences: [emptyExperience()],

    currentSalary: "",
    expectedSalary: "",
    benefits: [],
    bonusCount: "",
    otherBenefits: [],
    noticePeriod: "",

    medicalHistory: "",
    hasDisability: false,
    disabilityDetails: "",
    relationInSquare: "No",
    squareRelations: [],
    source: "",
    sourceManual: "",
    photoData: "",
    declaration: false,
  };
}

/** Which wizard step a given validation error belongs to, so the form can jump
 *  the candidate back to the field that needs fixing. */
export const FIELD_STEP: Record<string, number> = {};
const stepFields: Record<number, string[]> = {
  0: [
    "positionAppliedFor", "fullName", "mobileNumber", "email", "dob", "homeTown",
    "nationality", "religion", "religionManual", "gender", "bloodGroup",
    "maritalStatus", "spouseName", "spouseOccupation", "spouseMobile",
    "fatherName", "motherName", "presentVillage", "presentPO", "presentPS",
    "presentDistrict", "permanentVillage", "permanentPO", "permanentPS",
    "permanentDistrict", "emergencyContactName", "emergencyContactTitle",
    "emergencyContactTelNo", "dependents", "siblings",
  ],
  1: [
    "sscType", "sscTypeManual", "sscGroup", "sscGroupManual", "sscInstitution",
    "sscBoard", "sscBoardManual", "sscResult", "sscYear", "hscType", "hscGroup",
    "hscInstitution", "hscBoard", "hscResult", "hscYear", "higherEducations",
  ],
  2: ["experienceStatus", "experiences"],
  3: ["currentSalary", "expectedSalary", "benefits", "bonusCount", "noticePeriod"],
  4: [
    "medicalHistory", "hasDisability", "disabilityDetails", "relationInSquare",
    "squareRelations", "source", "sourceManual", "photoData", "declaration",
  ],
};
for (const [step, fields] of Object.entries(stepFields)) {
  for (const f of fields) FIELD_STEP[f] = Number(step);
}

export const STEP_LABELS = [
  "Personal",
  "Education",
  "Work Experience",
  "Compensation",
  "Disclosure",
];
