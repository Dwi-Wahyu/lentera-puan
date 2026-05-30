"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCheckup(patientId: string, formData: FormData) {
  const status = formData.get("status") as string;
  const notes = formData.get("notes") as string;
  const dateStr = formData.get("date") as string;

  if (!status || !dateStr) {
    return { error: "Tanggal dan Status wajib diisi." };
  }

  const date = new Date(dateStr);

  try {
    // 1. Create the checkup record
    await prisma.medicalCheckup.create({
      data: {
        patientId,
        date,
        status,
        notes: notes || null,
      },
    });

    // 2. Update patient's summary data
    await prisma.patient.update({
      where: { id: patientId },
      data: {
        lastCheckup: date,
        nutritionStatus: status // In this system, we update status based on latest checkup
      }
    });
  } catch (error) {
    console.error("Error creating checkup:", error);
    return { error: "Terjadi kesalahan saat menyimpan data pemeriksaan." };
  }

  revalidatePath(`/dashboard/kia/${patientId}`);
  revalidatePath("/dashboard/kia");
  return { success: true };
}
