"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createSafeHouse(formData: FormData) {
  const name = formData.get("name") as string;
  const capacityStr = formData.get("capacity") as string;
  const safetyLevel = formData.get("safetyLevel") as string;
  const location = formData.get("location") as string;

  if (!name || !capacityStr || !safetyLevel) {
    return { error: "Nama, Kapasitas, dan Tingkat Keamanan wajib diisi." };
  }

  const capacity = parseInt(capacityStr);
  if (isNaN(capacity) || capacity <= 0) {
    return { error: "Kapasitas harus berupa angka positif." };
  }

  try {
    await prisma.safeHouse.create({
      data: {
        name,
        capacity,
        safetyLevel,
        location: location || null,
        status: "TERSEDIA",
        occupied: 0,
      },
    });
    
    revalidatePath("/dashboard/safehouse");
    return { success: true };
  } catch (error) {
    console.error("Error creating safe house:", error);
    return { error: "Terjadi kesalahan saat menyimpan data Rumah Aman." };
  }
}
