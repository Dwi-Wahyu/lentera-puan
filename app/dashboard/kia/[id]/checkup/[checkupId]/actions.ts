"use server";

import { api } from "@/lib/api";
import { revalidatePath } from "next/cache";

export async function updateCheckup(patientId: string, checkupId: string, formData: FormData) {
  const status = formData.get("status") as string;
  const notes = formData.get("notes") as string;
  const dateStr = formData.get("date") as string;

  if (!status || !dateStr) {
    return { error: "Tanggal dan Status wajib diisi." };
  }

  try {
    await api.updateCheckup(checkupId, {
      date: dateStr,
      status,
      notes: notes || null,
    });
  } catch (error: any) {
    return { error: error.message || "Gagal memperbarui data pemeriksaan." };
  }

  revalidatePath(`/dashboard/kia/${patientId}`);
  revalidatePath(`/dashboard/kia/${patientId}/checkup/${checkupId}`);
  return { success: true };
}

export async function deleteCheckup(patientId: string, checkupId: string) {
  try {
    await api.deleteCheckup(checkupId);
  } catch (error: any) {
    return { error: error.message || "Gagal menghapus data pemeriksaan." };
  }

  revalidatePath(`/dashboard/kia/${patientId}`);
  return { success: true };
}
