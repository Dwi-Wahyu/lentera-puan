"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function syncPatientSummary(patientId: string) {
  const latestCheckup = await prisma.medicalCheckup.findFirst({
    where: { patientId },
    orderBy: { date: 'desc' }
  });

  if (latestCheckup) {
    await prisma.patient.update({
      where: { id: patientId },
      data: {
        lastCheckup: latestCheckup.date,
        nutritionStatus: latestCheckup.status
      }
    });
  } else {
    await prisma.patient.update({
      where: { id: patientId },
      data: {
        lastCheckup: null,
        nutritionStatus: "NORMAL"
      }
    });
  }
}

export async function updateCheckup(patientId: string, checkupId: string, formData: FormData) {
  const status = formData.get("status") as string;
  const notes = formData.get("notes") as string;
  const dateStr = formData.get("date") as string;

  if (!status || !dateStr) {
    return { error: "Tanggal dan Status wajib diisi." };
  }

  const date = new Date(dateStr);

  try {
    await prisma.medicalCheckup.update({
      where: { id: checkupId },
      data: {
        date,
        status,
        notes: notes || null,
      },
    });

    await syncPatientSummary(patientId);
  } catch {
    return { error: "Gagal memperbarui data pemeriksaan." };
  }

  revalidatePath(`/dashboard/kia/${patientId}`);
  revalidatePath(`/dashboard/kia/${patientId}/checkup/${checkupId}`);
  redirect(`/dashboard/kia/${patientId}/checkup/${checkupId}`);
}

export async function deleteCheckup(patientId: string, checkupId: string) {
  try {
    await prisma.medicalCheckup.delete({
      where: { id: checkupId },
    });

    await syncPatientSummary(patientId);
  } catch {
    return { error: "Gagal menghapus data pemeriksaan." };
  }

  revalidatePath(`/dashboard/kia/${patientId}`);
  redirect(`/dashboard/kia/${patientId}`);
}
