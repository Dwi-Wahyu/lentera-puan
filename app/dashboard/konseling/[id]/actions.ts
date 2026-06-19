"use server";

import { api } from "@/lib/api";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function updateSessionStatus(id: string, status: string) {
  const sessionUser = await getServerSession(authOptions);
  if (!sessionUser?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const intervention = await api.getIntervention(id);
    if (!intervention) {
      return { error: "Sesi tidak ditemukan." };
    }
    if (sessionUser.user.role === "KONSELOR" && intervention.counselor?.id !== sessionUser.user.id) {
      return { error: "Unauthorized" };
    }

    await api.updateIntervention(id, { status });

    revalidatePath(`/dashboard/konseling/${id}`);
    revalidatePath("/dashboard/konseling");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating session status:", error);
    return { error: error.message || "Gagal memperbarui status sesi." };
  }
}

export async function deleteSession(id: string) {
  const sessionUser = await getServerSession(authOptions);
  if (!sessionUser?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const intervention = await api.getIntervention(id);
    if (!intervention) {
       return { error: "Sesi sudah dihapus atau tidak ditemukan." };
    }
    if (sessionUser.user.role === "KONSELOR" && intervention.counselor?.id !== sessionUser.user.id) {
      return { error: "Unauthorized" };
    }

    await api.deleteIntervention(id);

    revalidatePath("/dashboard/konseling");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting session:", error);
    return { error: error.message || "Gagal menghapus jadwal sesi." };
  }
}
