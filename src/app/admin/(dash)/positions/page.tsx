import { Card, EmptyState, SectionHeading } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { createPosition } from "@/app/admin/actions";
import PositionRow from "./PositionRow";

export const metadata = { title: "Positions — HR Dashboard" };

export default async function PositionsPage() {
  const [positions, counts] = await Promise.all([
    prisma.position.findMany({ orderBy: [{ isOpen: "desc" }, { title: "asc" }] }),
    prisma.application.groupBy({
      by: ["positionAppliedFor"],
      _count: { _all: true },
    }),
  ]);

  const countByTitle = new Map(
    counts.map((c) => [c.positionAppliedFor, c._count._all]),
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-ink-900">Positions</h1>
        <p className="mt-0.5 text-sm text-ink-500">
          Create a position, then share its apply link with the candidates you have
          called in. The position is pre-filled on their form.
        </p>
      </div>

      <Card className="p-5">
        <SectionHeading title="Add a position" />
        <form
          action={createPosition}
          className="grid gap-3 sm:grid-cols-[2fr_1fr_auto]"
        >
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-700">
              Position title
            </label>
            <input
              name="title"
              required
              className="field-control"
              placeholder="e.g., Executive - HR"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-700">
              Department
            </label>
            <input
              name="department"
              className="field-control"
              placeholder="Optional"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Add position
            </button>
          </div>
        </form>
      </Card>

      {positions.length === 0 ? (
        <EmptyState>
          No positions yet. Add one above to generate a shareable apply link.
        </EmptyState>
      ) : (
        <div className="space-y-3">
          {positions.map((p) => (
            <PositionRow
              key={p.id}
              id={p.id}
              title={p.title}
              department={p.department}
              isOpen={p.isOpen}
              applicationCount={countByTitle.get(p.title) ?? 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
