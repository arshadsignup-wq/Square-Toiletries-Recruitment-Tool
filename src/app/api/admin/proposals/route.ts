import { NextResponse } from "next/server";
import { z } from "zod";
import { isAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateAge } from "@/lib/utils";

export const runtime = "nodejs";

const bodySchema = z.object({
  applicationId: z.string().min(1),
  designation: z.string().trim().min(1, "Designation is required"),
  department: z.string().trim().optional().default(""),
  salary: z
    .union([z.number(), z.string()])
    .transform((v) => (typeof v === "number" ? v : Number(v)))
    .refine((v) => Number.isFinite(v) && v > 0, { message: "Enter the agreed salary" }),
  joiningDate: z.string().min(1, "Joining date is required"),
  nidNumber: z.string().trim().optional().default(""),
  address: z.string().trim().min(1, "Address is required"),
});

async function nextReferenceNo(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `STL/HR/AP/${year}/`;
  const latest = await prisma.proposal.findFirst({
    where: { referenceNo: { startsWith: prefix } },
    orderBy: { referenceNo: "desc" },
    select: { referenceNo: true },
  });
  const lastSeq = latest ? Number(latest.referenceNo.slice(prefix.length)) : 0;
  const next = (Number.isFinite(lastSeq) ? lastSeq : 0) + 1;
  return `${prefix}${String(next).padStart(3, "0")}`;
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ message: "Not signed in." }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return NextResponse.json(
      { message: "Please check the proposal details.", fieldErrors },
      { status: 422 },
    );
  }

  const body = parsed.data;
  const application = await prisma.application.findUnique({
    where: { id: body.applicationId },
    select: { id: true, fullName: true, dob: true, nidNumber: true },
  });
  if (!application) {
    return NextResponse.json({ message: "Application not found." }, { status: 404 });
  }

  const joiningDate = new Date(body.joiningDate);
  if (Number.isNaN(joiningDate.getTime())) {
    return NextResponse.json(
      { message: "Please check the proposal details.", fieldErrors: { joiningDate: "Enter a valid joining date" } },
      { status: 422 },
    );
  }

  const proposal = await prisma.proposal.create({
    data: {
      applicationId: application.id,
      referenceNo: await nextReferenceNo(),
      candidateName: application.fullName,
      designation: body.designation,
      department: body.department || null,
      // Age is stated as of the joining date, which is what the letter asserts.
      age: calculateAge(application.dob, joiningDate),
      nidNumber: body.nidNumber || application.nidNumber || "",
      address: body.address,
      salary: Math.round(body.salary),
      joiningDate,
    },
    select: { id: true, referenceNo: true },
  });

  return NextResponse.json(proposal, { status: 201 });
}
