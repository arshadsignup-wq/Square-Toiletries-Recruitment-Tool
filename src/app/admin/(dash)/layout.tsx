import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { isAuthenticated } from "@/lib/auth";
import { Logo } from "@/components/ui";
import { logout } from "../actions";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  if (!(await isAuthenticated())) redirect("/admin/login");

  return (
    <>
      <header className="border-b border-slate-200 bg-white no-print">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-5">
            <Link href="/admin">
              <Logo size="sm" />
            </Link>
            <nav className="flex items-center gap-1 text-sm">
              <Link
                href="/admin"
                className="rounded-md px-3 py-1.5 font-medium text-ink-700 transition hover:bg-slate-100"
              >
                Applications
              </Link>
              <Link
                href="/admin/positions"
                className="rounded-md px-3 py-1.5 font-medium text-ink-700 transition hover:bg-slate-100"
              >
                Positions
              </Link>
            </nav>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-ink-700 transition hover:border-red-300 hover:text-red-700"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">{children}</main>
    </>
  );
}
