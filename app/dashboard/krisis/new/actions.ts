"use server";

import { api } from "@/lib/api";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function createCrisisReport(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { error: "Sesi tidak valid. Silakan login kembali." };
  }

  const victimInitials = formData.get("victimInitials") as string;
  const type = formData.get("type") as string;
  const priority = formData.get("priority") as string;
  const description = formData.get("description") as string;
  const safeHouseId = formData.get("safeHouseId") as string;
  const evidenceFile = formData.get("evidence") as File | null;

  if (!victimInitials || !type || !priority) {
    return { error: "Inisial, Tipe Krisis, dan Prioritas wajib diisi." };
  }

  try {
    const report = await api.createCrisisReport({
      victimInitials,
      type,
      priority,
      description: description || null,
      reporterId: session.user.id,
      safeHouseId: safeHouseId || null,
      status: "BARU",
    });

    // Handle Evidence Upload via API
    if (evidenceFile && evidenceFile.size > 0) {
      const uploadFormData = new FormData();
      uploadFormData.append("file", evidenceFile);
      uploadFormData.append("type", "IMAGE");
      
      await api.uploadEvidence(report.id, uploadFormData);
    }

    revalidatePath("/dashboard/krisis");
    revalidatePath("/dashboard/safehouse");
    return { success: true };
  } catch (error: any) {
    console.error("Error creating report:", error);
    return { error: error.message || "Gagal menyimpan laporan. Terjadi kesalahan pada sistem." };
  }
}
