export function calculateAge(dob: Date | string, on: Date = new Date()): number {
  const birth = typeof dob === "string" ? new Date(dob) : dob;
  let age = on.getFullYear() - birth.getFullYear();
  const m = on.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && on.getDate() < birth.getDate())) age--;
  return age;
}

export function formatDate(d: Date | string | null | undefined): string {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(d: Date | string | null | undefined): string {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatBDT(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return "—";
  return "BDT " + amount.toLocaleString("en-IN");
}

const ONES = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
  "Seventeen", "Eighteen", "Nineteen",
];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function twoDigits(n: number): string {
  if (n < 20) return ONES[n];
  const t = TENS[Math.floor(n / 10)];
  const o = ONES[n % 10];
  return o ? `${t} ${o}` : t;
}

/** Amount in words using the South Asian lakh/crore system, as used on
 *  Bangladeshi appointment letters. */
export function amountInWords(amount: number): string {
  if (!Number.isFinite(amount) || amount <= 0) return "Zero";
  let n = Math.floor(amount);
  const parts: string[] = [];

  const crore = Math.floor(n / 10000000);
  n %= 10000000;
  const lakh = Math.floor(n / 100000);
  n %= 100000;
  const thousand = Math.floor(n / 1000);
  n %= 1000;
  const hundred = Math.floor(n / 100);
  const rest = n % 100;

  if (crore) parts.push(`${twoDigits(crore)} Crore`);
  if (lakh) parts.push(`${twoDigits(lakh)} Lakh`);
  if (thousand) parts.push(`${twoDigits(thousand)} Thousand`);
  if (hundred) parts.push(`${ONES[hundred]} Hundred`);
  if (rest) parts.push(twoDigits(rest));

  return parts.join(" ");
}

/** Safely read a JSON-encoded string array column. */
export function parseList(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : [];
  } catch {
    return [];
  }
}

/** "2021-03" -> "Mar 2021" */
export function formatMonth(value: string | null | undefined): string {
  if (!value) return "—";
  const [y, m] = value.split("-");
  if (!y || !m) return value;
  const date = new Date(Number(y), Number(m) - 1, 1);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

/** Total months between two YYYY-MM strings, rendered as "3 yr 2 mo". */
export function monthSpan(from?: string | null, to?: string | null): string {
  if (!from) return "—";
  const [fy, fm] = from.split("-").map(Number);
  const end = to ? to.split("-").map(Number) : [new Date().getFullYear(), new Date().getMonth() + 1];
  if (!fy || !fm || !end[0] || !end[1]) return "—";
  let months = (end[0] - fy) * 12 + (end[1] - fm);
  if (months < 0) return "—";
  months += 1;
  const yrs = Math.floor(months / 12);
  const mos = months % 12;
  const bits: string[] = [];
  if (yrs) bits.push(`${yrs} yr`);
  if (mos) bits.push(`${mos} mo`);
  return bits.length ? bits.join(" ") : "0 mo";
}

export function fullAddress(parts: {
  village: string;
  po: string;
  ps: string;
  district: string;
}): string {
  return [
    parts.village,
    parts.po ? `P.O. ${parts.po}` : "",
    parts.ps ? `P.S. ${parts.ps}` : "",
    parts.district,
  ]
    .filter(Boolean)
    .join(", ");
}
