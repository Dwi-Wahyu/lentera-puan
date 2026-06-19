"use server";

import { api } from "@/lib/api";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function deleteCrisisReport(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || (session.user.role !== "ADMIN" && session.user.role !== "DP3A")) {
    return { error: "Unauthorized" };
  }

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
