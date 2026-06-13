"use server";

import { api } from "@/lib/api";
import { revalidatePath } from "next/cache";

export async function updateSessionStatus(id: string, status: string) {
  try {
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
  try {
    // Check if session exists first
    const session = await api.getIntervention(id);

    if (!session) {
       return { error: "Sesi sudah dihapus atau tidak ditemukan." };
    }

    await api.deleteIntervention(id);

    revalidatePath("/dashboard/konseling");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting session:", error);
    return { error: error.message || "Gagal menghapus jadwal sesi." };
  }
}
