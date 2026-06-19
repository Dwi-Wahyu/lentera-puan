"use server";

import { api } from "@/lib/api";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function createCounselingSession(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const counselorId = formData.get("counselorId") as string;
  if (session.user.role === "KONSELOR" && counselorId !== session.user.id) {
    return { error: "Unauthorized: Konselor hanya dapat menjadwalkan sesi untuk dirinya sendiri." };
  }

  const patientId = formData.get("patientId") as string;
  const reportId = formData.get("reportId") as string;
  const dateStr = formData.get("date") as string;
  const time = formData.get("time") as string;
  const type = formData.get("type") as string;

  if (!counselorId || !patientId || !dateStr || !time || !type) {
    return { error: "Semua field wajib diisi." };
  }

  // Basic time format validation (e.g. 09:00 - 10:00 or 09:00)
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](?:\s*-\s*([0-1]?[0-9]|2[0-3]):[0-5][0-9])?$/;
  if (!timeRegex.test(time)) {
    return { error: "Format waktu tidak valid (Contoh: 09:00 atau 09:00 - 10:00)." };
  }

  try {
    await api.createIntervention({
      counselorId,
      patientId,
      reportId: reportId || undefined,
      date: dateStr,
      time,
      type,
      status: "MENDATANG",
    });
    
    revalidatePath("/dashboard/konseling");
    return { success: true };
  } catch (error: any) {
    console.error("Error creating counseling session:", error);
    return { error: error.message || "Terjadi kesalahan saat membuat jadwal konseling." };
  }
}
