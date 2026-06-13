"use server";

import { api } from "@/lib/api";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function updateCrisisReport(id: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Unauthorized" };

  const victimInitials = formData.get("victimInitials") as string;
  const type = formData.get("type") as string;
  const priority = formData.get("priority") as string;
  const description = formData.get("description") as string;
  const status = formData.get("status") as string;
  const evidenceFile = formData.get("evidence") as File | null;

  if (!victimInitials || !type || !priority || !status) {
    return { error: "Semua field wajib diisi." };
  }

  try {
    await api.updateCrisisReport(id, {
      victimInitials,
      type,
      priority,
      description,
      status,
    });

    // Handle New Evidence Upload via API if provided
    if (evidenceFile && evidenceFile.size > 0) {
      const uploadFormData = new FormData();
      uploadFormData.append("file", evidenceFile);
      uploadFormData.append("type", "IMAGE");
      
      await api.uploadEvidence(id, uploadFormData);
    }

    await api.addCrisisLog(id, {
      action: "UPDATE_KASUS",
      notes: `Data kasus diperbarui oleh ${session.user.name}.`,
    });

    revalidatePath("/dashboard/krisis");
    revalidatePath(`/dashboard/krisis/${id}`);
    return { success: true };
  } catch (error: any) {
    console.error("Error updating report:", error);
    return { error: error.message || "Gagal memperbarui laporan." };
  }
}
