"use server";

import { api } from "@/lib/api";
import { revalidatePath } from "next/cache";

export async function deleteCrisisReport(id: string) {
  try {
    await api.deleteCrisisReport(id);

    revalidatePath("/dashboard/krisis");
    revalidatePath("/dashboard/safehouse");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting report:", error);
    return { error: error.message || "Gagal menghapus laporan krisis." };
  }
}
