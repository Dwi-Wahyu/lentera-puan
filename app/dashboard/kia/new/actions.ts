"use server";

import { api } from "@/lib/api";
import { revalidatePath } from "next/cache";

export async function createPatient(formData: FormData) {
  const name = formData.get("name") as string;
  const nik = formData.get("nik") as string;
  const category = formData.get("category") as string;
  const nutritionStatus = formData.get("nutritionStatus") as string;

  if (!name || !nik || !category) {
    return { error: "Semua field wajib diisi." };
  }

  try {
    await api.createPatient({
      name,
      nik,
      category,
      nutritionStatus: nutritionStatus || "NORMAL",
    });
    
    revalidatePath("/dashboard/kia");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Terjadi kesalahan saat menyimpan data." };
  }
}
