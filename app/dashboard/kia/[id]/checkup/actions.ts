"use server";

import { api } from "@/lib/api";
import { revalidatePath } from "next/cache";

export async function createCheckup(patientId: string, formData: FormData) {
  const status = formData.get("status") as string;
  const notes = formData.get("notes") as string;
  const dateStr = formData.get("date") as string;

  if (!status || !dateStr) {
    return { error: "Tanggal dan Status wajib diisi." };
  }

  try {
    await api.createCheckup({
      patientId,
      date: dateStr,
      status,
      notes: notes || null,
    });
  } catch (error: any) {
    console.error("Error creating checkup:", error);
    return { error: error.message || "Terjadi kesalahan saat menyimpan data pemeriksaan." };
  }

  revalidatePath(`/dashboard/kia/${patientId}`);
  revalidatePath("/dashboard/kia");
  return { success: true };
}
