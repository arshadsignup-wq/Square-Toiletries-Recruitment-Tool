import Link from "next/link";
import { AppHeader, Card, Logo } from "@/components/ui";

export default function Home() {
  return (
    <>
      <AppHeader
        right={
          <Link
            href="/admin"
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-ink-700 transition hover:border-brand-400 hover:text-brand-700"
          >
            HR Login
          </Link>
        }
      />

      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Card className="p-8 text-center sm:p-12">
          <div className="mb-6 flex justify-center">
            <Logo />
          </div>
          <h1 className="text-2xl font-semibold text-ink-900 sm:text-3xl">
            Recruitment Portal
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-ink-500">
            Candidates called for interview can complete their application form here.
            Please use the link shared with you by the HR department.
          </p>
          <Link
            href="/apply"
            className="mt-8 inline-block rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Start Application
          </Link>
        </Card>
      </main>
    </>
  );
}
