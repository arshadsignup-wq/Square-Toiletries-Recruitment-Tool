// Every option list is taken verbatim from the existing Square Toiletries
// candidate application form so submissions stay comparable with past data.

export const RELIGIONS = ["Islam", "Hinduism", "Christianity", "Buddhism", "Other"];

export const GENDERS = ["Male", "Female"];

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"];

export const MARITAL_STATUSES = ["Unmarried", "Married"];

export const ACCOMMODATION_TYPES = ["Own home", "Own Flat", "Rent Flat", "Dormitory"];

export const LIVING_WITH = ["Spouse", "Parents", "Friends/Relatives"];

export const SSC_TYPES = ["SSC", "Dakhil", "O Level", "Manual Entry"];

export const SSC_GROUPS = [
  { value: "Science", label: "Science" },
  { value: "Commerce", label: "Business Studies" },
  { value: "Humanities", label: "Humanities" },
  { value: "Dakhil", label: "Dakhil (Madrasah)" },
  { value: "Other", label: "Other (Entry Manually)" },
];

export const HSC_TYPES = ["HSC", "Alim", "A Level", "Diploma Equivalent", "Manual Entry"];

export const HSC_GROUPS = [
  { value: "Science", label: "Science" },
  { value: "Business Studies", label: "Business Studies" },
  { value: "Humanities", label: "Humanities" },
  { value: "Alim", label: "Alim (Madrasah)" },
  { value: "Other", label: "Other (Enter Manually)" },
];

export const BOARDS = [
  "Dhaka",
  "Rajshahi",
  "Chattogram",
  "Cumilla",
  "Jessore",
  "Barisal",
  "Sylhet",
  "Dinajpur",
  "Mymensingh",
  "Madrasah Board",
  "BTEB",
  "Other",
];

export const HIGHER_DEGREES = [
  "B.A. – Bachelor of Arts",
  "B.Com – Bachelor of Commerce",
  "B.S.S. – Bachelor of Social Science",
  "B.Sc. – Bachelor of Science",
  "BA (Hons.) – Bachelor of Arts (Honours)",
  "BBA – Bachelor of Business Administration",
  "BSc (Hons.) – Bachelor of Science (Honours)",
  "BSS (Hons.) – Bachelor of Social Science (Honours)",
  "Diploma",
  "LL.B. – Bachelor of Laws",
  "LL.M. – Master of Laws",
  "M.A. – Master of Arts",
  "M.Com – Master of Commerce",
  "M.Phil. – Master of Philosophy",
  "M.S.S. – Master of Social Science",
  "M.Sc. – Master of Science",
  "MBA – Master of Business Administration",
  "PGD – Post Graduate Diploma",
  "Ph.D. – Doctor of Philosophy",
  "Manual Entry",
];

export const BENEFITS = [
  "Provident Fund",
  "Gratuity",
  "Medical Facility",
  "Insurance",
  "Transport",
  "Lunch",
  "Profit Share",
  "Bonus/Incentive",
];

export const BONUS_COUNTS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "10+"];

export const NOTICE_PERIODS = ["Any time", "7 Days", "15 Days", "1 Month", "2 Months"];

export const SOURCES = [
  "LinkedIn",
  "Facebook",
  "Friends or Family",
  "Bdjobs",
  "Company Website",
  "Others",
];

export const APPLICATION_STATUSES = [
  "SUBMITTED",
  "SHORTLISTED",
  "INTERVIEWED",
  "SELECTED",
  "REJECTED",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export function passingYears(): string[] {
  const now = new Date().getFullYear();
  const years: string[] = [];
  for (let y = now + 1; y >= 1970; y--) years.push(String(y));
  return years;
}
