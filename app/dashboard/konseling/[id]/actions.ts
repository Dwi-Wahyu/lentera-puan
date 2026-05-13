"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateSessionStatus(id: string, status: string) {
  try {
    await prisma.interventionSession.update({
      where: { id },
      data: { status },
    });

    revalidatePath(`/dashboard/konseling/${id}`);
    revalidatePath("/dashboard/konseling");
    return { success: true };
  } catch (error) {
    console.error("Error updating session status:", error);
    return { error: "Gagal memperbarui status sesi." };
  }
}

export async function deleteSession(id: string) {
  try {
    // Check if session exists first to avoid double-delete error
    const session = await prisma.interventionSession.findUnique({
      where: { id },
    });

    if (!session) {
       return { error: "Sesi sudah dihapus atau tidak ditemukan." };
    }

    await prisma.interventionSession.delete({
      where: { id },
    });

  } catch (error) {
    console.error("Error deleting session:", error);
    return { error: "Gagal menghapus jadwal sesi." };
  }

  revalidatePath("/dashboard/konseling");
  redirect("/dashboard/konseling");
}
