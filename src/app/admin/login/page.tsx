import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { Card, Logo } from "@/components/ui";
import LoginForm from "./LoginForm";

export const metadata = { title: "HR Login — Square Toiletries Limited" };

export default async function LoginPage() {
  if (await isAuthenticated()) redirect("/admin");

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-4">
      <Card className="w-full p-8">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <h1 className="text-center text-lg font-semibold text-ink-900">
          HR Recruitment Dashboard
        </h1>
        <p className="mt-1 mb-6 text-center text-sm text-ink-500">
          Enter the department password to continue.
        </p>
        <LoginForm />
      </Card>
    </main>
  );
}
