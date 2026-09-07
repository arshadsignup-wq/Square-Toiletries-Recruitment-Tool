"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkPassword, endSession, isAuthenticated, startSession } from "@/lib/auth";
import { APPLICATION_STATUSES } from "@/lib/options";
import { prisma } from "@/lib/prisma";

export type LoginState = { error?: string };

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  if (!password) return { error: "Enter the HR password." };
  if (!checkPassword(password)) return { error: "That password is not correct." };
  await startSession();
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

async function requireAuth() {
  if (!(await isAuthenticated())) redirect("/admin/login");
}

export async function updateStatus(applicationId: string, status: string) {
  await requireAuth();
  if (!APPLICATION_STATUSES.includes(status as never)) {
    throw new Error("Unknown status");
  }
  await prisma.application.update({
    where: { id: applicationId },
    data: { status },
  });
  revalidatePath("/admin");
  revalidatePath(`/admin/applications/${applicationId}`);
}

export async function saveNotes(applicationId: string, notes: string) {
  await requireAuth();
  await prisma.application.update({
    where: { id: applicationId },
    data: { hrNotes: notes.trim() || null },
  });
  revalidatePath(`/admin/applications/${applicationId}`);
}

/** Removes an application and everything hanging off it (documents, proposals).
 *  Used to clear test records; there is no undo. */
export async function deleteApplication(applicationId: string) {
  await requireAuth();
  await prisma.application.delete({ where: { id: applicationId } });
  revalidatePath("/admin");
  redirect("/admin");
}

export async function createPosition(formData: FormData) {
  await requireAuth();
  const title = String(formData.get("title") ?? "").trim();
  const department = String(formData.get("department") ?? "").trim();
  if (!title) return;
  await prisma.position.upsert({
    where: { title },
    update: { department: department || null, isOpen: true },
    create: { title, department: department || null },
  });
  revalidatePath("/admin/positions");
}

export async function togglePosition(id: string, isOpen: boolean) {
  await requireAuth();
  await prisma.position.update({ where: { id }, data: { isOpen } });
  revalidatePath("/admin/positions");
}

export async function deletePosition(id: string) {
  await requireAuth();
  await prisma.position.delete({ where: { id } });
  revalidatePath("/admin/positions");
}
