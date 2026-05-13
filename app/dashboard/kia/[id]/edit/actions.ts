"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

export async function updatePatient(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const nik = formData.get("nik") as string;
  const category = formData.get("category") as string;

  if (!name || !nik || !category) {
    return { error: "Semua field wajib diisi." };
  }

  try {
    await prisma.patient.update({
      where: { id },
      data: {
        name,
        nik,
        category,
      },
    });
    
    revalidatePath(`/dashboard/kia/${id}`);
    revalidatePath("/dashboard/kia");
    return { success: true };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return { error: "NIK sudah terdaftar dalam sistem." };
      }
    }
    return { error: "Terjadi kesalahan saat menyimpan perubahan." };
  }
}
