"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createLogistic(formData: FormData) {
  const name = formData.get("name") as string;
  const stockStr = formData.get("stock") as string;
  const unit = formData.get("unit") as string;

  if (!name || !stockStr || !unit) {
    return { error: "Semua field wajib diisi." };
  }

  const stock = parseInt(stockStr);
  if (isNaN(stock) || stock < 0) {
    return { error: "Stok harus berupa angka positif." };
  }

  let status = "CUKUP";
  if (stock === 0) {
    status = "KRITIS";
  } else if (stock < 50) {
    status = "MENIPIS";
  } else if (stock > 1000) {
    status = "MELIMPAH";
  }

  try {
    await prisma.logistic.create({
      data: {
        name,
        stock,
        unit,
        status,
      },
    });
  } catch (error) {
    console.error("Error creating logistic:", error);
    return { error: "Terjadi kesalahan saat menyimpan data logistik." };
  }

  revalidatePath("/dashboard/logistik");
  redirect("/dashboard/logistik");
}
