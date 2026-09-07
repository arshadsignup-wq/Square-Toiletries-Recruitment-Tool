import fs from "node:fs/promises";
import path from "node:path";
import { renderToBuffer } from "@react-pdf/renderer";
import { isAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProposalDocument } from "@/lib/proposal-pdf";

export const runtime = "nodejs";

async function loadLogo(): Promise<Buffer | undefined> {
  try {
    return await fs.readFile(path.join(process.cwd(), "public", "logo.png"));
  } catch {
    return undefined; // the letter falls back to a text letterhead
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAuthenticated())) {
    return new Response("Not signed in.", { status: 401 });
  }

  const { id } = await params;
  const proposal = await prisma.proposal.findUnique({ where: { id } });
  if (!proposal) return new Response("Proposal not found.", { status: 404 });

  const buffer = await renderToBuffer(
    <ProposalDocument
      data={{
        referenceNo: proposal.referenceNo,
        candidateName: proposal.candidateName,
        designation: proposal.designation,
        department: proposal.department,
        age: proposal.age,
        nidNumber: proposal.nidNumber,
        address: proposal.address,
        salary: proposal.salary,
        joiningDate: proposal.joiningDate,
        issuedAt: proposal.issuedAt,
      }}
      logo={await loadLogo()}
    />,
  );

  const safeName = proposal.candidateName.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  const fileName = `appointment-proposal-${safeName}.pdf`;

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "no-store",
    },
  });
}
