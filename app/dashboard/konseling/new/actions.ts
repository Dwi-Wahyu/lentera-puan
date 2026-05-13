"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCounselingSession(formData: FormData) {
  const counselorId = formData.get("counselorId") as string;
  const dateStr = formData.get("date") as string;
  const time = formData.get("time") as string;
  const type = formData.get("type") as string;

  if (!counselorId || !dateStr || !time || !type) {
    return { error: "Semua field wajib diisi." };
  }

  // Basic time format validation (e.g. 09:00 - 10:00 or 09:00)
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](?:\s*-\s*([0-1]?[0-9]|2[0-3]):[0-5][0-9])?$/;
  if (!timeRegex.test(time)) {
    return { error: "Format waktu tidak valid (Contoh: 09:00 atau 09:00 - 10:00)." };
  }

  const date = new Date(dateStr);

  try {
    await prisma.interventionSession.create({
      data: {
        counselorId,
        date,
        time,
        type,
        status: "MENDATANG",
      },
    });
    
    revalidatePath("/dashboard/konseling");
    return { success: true };
  } catch (error) {
    console.error("Error creating counseling session:", error);
    return { error: "Terjadi kesalahan saat membuat jadwal konseling." };
  }
}
