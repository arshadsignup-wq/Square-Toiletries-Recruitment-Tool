/**
 * Replays a snapshot from export-data.ts into the current database.
 * Run AFTER pointing DATABASE_URL at Postgres and applying migrations.
 *
 *   npx tsx scripts/import-data.ts
 *
 * Safe to re-run: applications already present (matched on applicationNo) are
 * skipped rather than duplicated.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { PrismaClient } from "@/generated/prisma";

type Row = Record<string, unknown>;

/** Prisma returns dates as Date objects; JSON turns them into strings. */
const asDate = (v: unknown) => (v == null ? null : new Date(v as string));

function strip(row: Row, keys: string[]): Row {
  const out: Row = { ...row };
  for (const k of keys) delete out[k];
  return out;
}

async function main() {
  const prisma = new PrismaClient();
  const file = path.join(process.cwd(), "prisma", "data-export.json");
  const snapshot = JSON.parse(await fs.readFile(file, "utf8")) as {
    applications: Row[];
    positions: Row[];
  };

  let importedPositions = 0;
  for (const p of snapshot.positions) {
    await prisma.position.upsert({
      where: { title: p.title as string },
      update: {},
      create: {
        title: p.title as string,
        department: (p.department as string) ?? null,
        isOpen: p.isOpen as boolean,
        createdAt: asDate(p.createdAt)!,
      },
    });
    importedPositions++;
  }

  let imported = 0;
  let skipped = 0;

  for (const app of snapshot.applications) {
    const applicationNo = app.applicationNo as string;
    const existing = await prisma.application.findUnique({
      where: { applicationNo },
      select: { id: true },
    });
    if (existing) {
      skipped++;
      continue;
    }

    const dependents = app.dependents as Row[];
    const siblings = app.siblings as Row[];
    const higherEducations = app.higherEducations as Row[];
    const experiences = app.experiences as Row[];
    const squareRelations = app.squareRelations as Row[];
    const proposals = app.proposals as Row[];

    const scalar = strip(app, [
      "id", "dependents", "siblings", "higherEducations", "experiences",
      "squareRelations", "proposals",
    ]);

    await prisma.application.create({
      data: {
        ...(scalar as object),
        dob: asDate(app.dob)!,
        submittedAt: asDate(app.submittedAt)!,
        updatedAt: asDate(app.updatedAt)!,
        passportIssueDate: asDate(app.passportIssueDate),
        passportExpireDate: asDate(app.passportExpireDate),
        dependents: { create: dependents.map((d) => strip(d, ["id", "applicationId"])) },
        siblings: { create: siblings.map((s) => strip(s, ["id", "applicationId"])) },
        higherEducations: {
          create: higherEducations.map((h) => strip(h, ["id", "applicationId"])),
        },
        experiences: {
          create: experiences.map((e) => ({
            ...strip(e, ["id", "applicationId", "promotions"]),
            promotions: {
              create: (e.promotions as Row[]).map((p) => strip(p, ["id", "experienceId"])),
            },
          })),
        },
        squareRelations: {
          create: squareRelations.map((r) => strip(r, ["id", "applicationId"])),
        },
        proposals: {
          create: proposals.map((p) => ({
            ...strip(p, ["id", "applicationId"]),
            joiningDate: asDate(p.joiningDate)!,
            issuedAt: asDate(p.issuedAt)!,
          })),
        },
      } as never,
    });
    imported++;
  }

  console.log(`Positions: ${importedPositions}`);
  console.log(`Applications imported: ${imported}, already present: ${skipped}`);
  await prisma.$disconnect();
}

main();
