"use server";

import { api } from "@/lib/api";
import { revalidatePath } from "next/cache";

export async function updatePatient(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const nik = formData.get("nik") as string;
  const category = formData.get("category") as string;

  if (!name || !nik || !category) {
    return { error: "Semua field wajib diisi." };
  }

  try {
    await api.updatePatient(id, {
      name,
      nik,
      category,
    });
    
    revalidatePath(`/dashboard/kia/${id}`);
    revalidatePath("/dashboard/kia");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Terjadi kesalahan saat menyimpan perubahan." };
  }
}
