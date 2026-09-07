import ApplyForm from "@/components/apply/ApplyForm";
import { AppHeader } from "@/components/ui";

export const metadata = {
  title: "Candidate Application — Square Toiletries Limited",
};

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ pos?: string | string[] }>;
}) {
  const params = await searchParams;
  const raw = Array.isArray(params.pos) ? params.pos[0] : params.pos;
  const position = (raw ?? "").trim();

  return (
    <>
      <AppHeader subtitle="Candidate Application" />

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-5">
          <h1 className="text-xl font-semibold text-ink-900 sm:text-2xl">
            Personal Information Form
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            {position
              ? `You are applying for: ${position}`
              : "Please complete every step. Fields marked * are required."}
          </p>
        </div>

        <ApplyForm defaultPosition={position} />
      </main>

      <footer className="mx-auto max-w-5xl px-4 pt-4 pb-10 text-center text-xs text-ink-500 sm:px-6">
        © {new Date().getFullYear()} Square Toiletries Limited — Human Resources
      </footer>
    </>
  );
}
