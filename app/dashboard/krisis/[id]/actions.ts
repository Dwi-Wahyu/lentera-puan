"use server";

import { api } from "@/lib/api";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function addInvestigationLog(reportId: string, action: string, notes: string) {
  try {
    await api.addCrisisLog(reportId, { action, notes });
    revalidatePath(`/dashboard/krisis/${reportId}`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Gagal menambahkan log." };
  }
}

export async function validateCrisisCase(reportId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    await api.updateCrisisReport(reportId, { status: "TERVALIDASI" });
    await api.addCrisisLog(reportId, {
      action: "VALIDASI_KASUS",
      notes: `Kasus divalidasi oleh ${session.user.name}.`,
    });
    
    revalidatePath(`/dashboard/krisis/${reportId}`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Gagal memvalidasi kasus." };
  }
}

export async function completeCrisisCase(reportId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    await api.updateCrisisReport(reportId, { status: "SELESAI" });
    await api.addCrisisLog(reportId, {
      action: "KASUS_SELESAI",
      notes: `Kasus ditutup/diselesaikan oleh ${session.user.name}.`,
    });
    
    revalidatePath(`/dashboard/krisis/${reportId}`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Gagal menyelesaikan kasus." };
  }
}
