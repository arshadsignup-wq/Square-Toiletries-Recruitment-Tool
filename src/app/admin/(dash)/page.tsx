import Link from "next/link";
import type { Prisma } from "@/generated/prisma";
import { Badge, Card, EmptyState, statusTone } from "@/components/ui";
import { APPLICATION_STATUSES } from "@/lib/options";
import { prisma } from "@/lib/prisma";
import { calculateAge, formatBDT, formatDateTime } from "@/lib/utils";
import Filters from "./Filters";

export const metadata = { title: "Applications — HR Dashboard" };

const PAGE_SIZE = 25;

type Search = {
  q?: string;
  position?: string;
  status?: string;
  from?: string;
  to?: string;
  page?: string;
};

function buildWhere(s: Search): Prisma.ApplicationWhereInput {
  const where: Prisma.ApplicationWhereInput = {};

  if (s.q?.trim()) {
    const q = s.q.trim();
    where.OR = [
      { fullName: { contains: q } },
      { email: { contains: q } },
      { mobileNumber: { contains: q } },
      { applicationNo: { contains: q } },
      { nidNumber: { contains: q } },
    ];
  }
  if (s.position?.trim()) where.positionAppliedFor = s.position.trim();
  if (s.status?.trim()) where.status = s.status.trim();

  const submittedAt: Prisma.DateTimeFilter = {};
  if (s.from) {
    const d = new Date(s.from);
    if (!Number.isNaN(d.getTime())) submittedAt.gte = d;
  }
  if (s.to) {
    const d = new Date(s.to);
    if (!Number.isNaN(d.getTime())) {
      d.setHours(23, 59, 59, 999);
      submittedAt.lte = d;
    }
  }
  if (submittedAt.gte || submittedAt.lte) where.submittedAt = submittedAt;

  return where;
}

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const s = await searchParams;
  const where = buildWhere(s);
  const page = Math.max(1, Number(s.page) || 1);

  const [total, applications, positionGroups, statusGroups] = await Promise.all([
    prisma.application.count({ where }),
    prisma.application.findMany({
      where,
      orderBy: { submittedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        applicationNo: true,
        fullName: true,
        positionAppliedFor: true,
        mobileNumber: true,
        email: true,
        dob: true,
        expectedSalary: true,
        experienceStatus: true,
        status: true,
        submittedAt: true,
        _count: { select: { proposals: true } },
      },
    }),
    prisma.application.groupBy({
      by: ["positionAppliedFor"],
      _count: { _all: true },
      orderBy: { positionAppliedFor: "asc" },
    }),
    prisma.application.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);

  const statusCounts = new Map(statusGroups.map((g) => [g.status, g._count._all]));
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const exportParams = new URLSearchParams();
  for (const [k, v] of Object.entries(s)) {
    if (v && k !== "page") exportParams.set(k, String(v));
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-ink-900">Applications</h1>
          <p className="mt-0.5 text-sm text-ink-500">
            {total} {total === 1 ? "application" : "applications"} matching the current
            filters.
          </p>
        </div>
        <a
          href={`/api/admin/export?${exportParams.toString()}`}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-ink-700 transition hover:border-brand-400 hover:text-brand-700"
        >
          Export CSV
        </a>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {APPLICATION_STATUSES.map((status) => (
          <Card key={status} className="px-4 py-3">
            <p className="text-xs font-medium text-ink-500 capitalize">
              {status.toLowerCase()}
            </p>
            <p className="mt-1 text-xl font-semibold text-ink-900">
              {statusCounts.get(status) ?? 0}
            </p>
          </Card>
        ))}
        <Card className="px-4 py-3">
          <p className="text-xs font-medium text-ink-500">Total</p>
          <p className="mt-1 text-xl font-semibold text-brand-700">
            {statusGroups.reduce((sum, g) => sum + g._count._all, 0)}
          </p>
        </Card>
      </div>

      <Filters
        positions={positionGroups.map((g) => ({
          title: g.positionAppliedFor,
          count: g._count._all,
        }))}
        current={s}
      />

      {applications.length === 0 ? (
        <EmptyState>
          No applications match these filters yet. Share an apply link from the
          Positions tab to start collecting candidate data.
        </EmptyState>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[56rem] text-sm">
              <thead className="bg-slate-50 text-left text-xs text-ink-500 uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium">Application</th>
                  <th className="px-4 py-3 font-medium">Candidate</th>
                  <th className="px-4 py-3 font-medium">Position</th>
                  <th className="px-4 py-3 font-medium">Contact</th>
                  <th className="px-4 py-3 font-medium">Expected</th>
                  <th className="px-4 py-3 font-medium">Submitted</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((a) => (
                  <tr key={a.id} className="transition hover:bg-slate-50/70">
                    <td className="px-4 py-3 align-top">
                      <Link
                        href={`/admin/applications/${a.id}`}
                        className="font-mono text-xs font-medium text-brand-700 hover:underline"
                      >
                        {a.applicationNo}
                      </Link>
                      {a._count.proposals > 0 ? (
                        <div className="mt-1">
                          <Badge tone="green">Proposal issued</Badge>
                        </div>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <Link
                        href={`/admin/applications/${a.id}`}
                        className="font-medium text-ink-900 hover:text-brand-700"
                      >
                        {a.fullName}
                      </Link>
                      <p className="text-xs text-ink-500">
                        {calculateAge(a.dob)} yrs · {a.experienceStatus}
                      </p>
                    </td>
                    <td className="px-4 py-3 align-top text-ink-700">
                      {a.positionAppliedFor}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <p className="text-ink-700">{a.mobileNumber}</p>
                      <p className="text-xs text-ink-500">{a.email}</p>
                    </td>
                    <td className="px-4 py-3 align-top text-ink-700">
                      {formatBDT(a.expectedSalary)}
                    </td>
                    <td className="px-4 py-3 align-top text-xs text-ink-500">
                      {formatDateTime(a.submittedAt)}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <Badge tone={statusTone(a.status)}>{a.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {pageCount > 1 ? (
        <div className="flex items-center justify-between text-sm">
          <PageLink search={s} page={page - 1} disabled={page <= 1}>
            Previous
          </PageLink>
          <span className="text-ink-500">
            Page {page} of {pageCount}
          </span>
          <PageLink search={s} page={page + 1} disabled={page >= pageCount}>
            Next
          </PageLink>
        </div>
      ) : null}
    </div>
  );
}

function PageLink({
  search,
  page,
  disabled,
  children,
}: {
  search: Search;
  page: number;
  disabled: boolean;
  children: React.ReactNode;
}) {
  if (disabled) {
    return (
      <span className="rounded-lg border border-slate-200 px-3 py-2 text-slate-300">
        {children}
      </span>
    );
  }
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(search)) {
    if (v && k !== "page") params.set(k, String(v));
  }
  params.set("page", String(page));
  return (
    <Link
      href={`/admin?${params.toString()}`}
      className="rounded-lg border border-slate-300 bg-white px-3 py-2 font-medium text-ink-700 transition hover:border-brand-400"
    >
      {children}
    </Link>
  );
}
