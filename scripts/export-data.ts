/**
 * Snapshots every application (with its nested rows) to JSON so the data can be
 * replayed into a different database. Run against SQLite BEFORE switching the
 * Prisma provider to Postgres.
 *
 *   npx tsx scripts/export-data.ts
 */
import fs from "node:fs/promises";
import path from "node:path";
import { PrismaClient } from "@/generated/prisma";

async function main() {
  const prisma = new PrismaClient();

  const applications = await prisma.application.findMany({
    orderBy: { submittedAt: "asc" },
    include: {
      dependents: { orderBy: { sortOrder: "asc" } },
      siblings: { orderBy: { sortOrder: "asc" } },
      higherEducations: { orderBy: { sortOrder: "asc" } },
      experiences: {
        orderBy: { sortOrder: "asc" },
        include: { promotions: { orderBy: { sortOrder: "asc" } } },
      },
      squareRelations: { orderBy: { sortOrder: "asc" } },
      proposals: { orderBy: { issuedAt: "asc" } },
    },
  });
  const positions = await prisma.position.findMany({ orderBy: { createdAt: "asc" } });

  const out = path.join(process.cwd(), "prisma", "data-export.json");
  await fs.writeFile(out, JSON.stringify({ applications, positions }, null, 2));

  const proposals = applications.reduce((n, a) => n + a.proposals.length, 0);
  console.log(`Exported ${applications.length} applications, ${proposals} proposals, ${positions.length} positions`);
  console.log(`-> ${out}`);

  await prisma.$disconnect();
}

main();
