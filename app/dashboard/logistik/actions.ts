"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function createDistribution(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Sesi tidak valid." };

  const logisticId = formData.get("logisticId") as string;
  const quantityStr = formData.get("quantity") as string;
  const recipient = formData.get("recipient") as string;

  if (!logisticId || !quantityStr || !recipient) {
    return { error: "Semua field wajib diisi." };
  }

  const quantity = parseInt(quantityStr);
  if (isNaN(quantity) || quantity <= 0) {
    return { error: "Jumlah harus berupa angka positif." };
  }

  try {
    const item = await prisma.logistic.findUnique({
      where: { id: logisticId },
    });

    if (!item) return { error: "Barang tidak ditemukan." };
    if (item.stock < quantity) {
      return { error: `Stok tidak mencukupi. Tersedia: ${item.stock} ${item.unit}` };
    }

    const newStock = item.stock - quantity;
    let status = "CUKUP";
    if (newStock === 0) {
      status = "KRITIS";
    } else if (newStock < 50) {
      status = "MENIPIS";
    }

    await prisma.$transaction([
      prisma.logistic.update({
        where: { id: logisticId },
        data: { stock: newStock, status },
      }),
      prisma.distribution.create({
        data: {
          logisticId,
          quantity,
          recipient,
          staffId: session.user.id,
        },
      }),
    ]);

    revalidatePath("/dashboard/logistik");
    return { success: true };
  } catch (error) {
    console.error("Error creating distribution:", error);
    return { error: "Gagal mencatat distribusi." };
  }
}
