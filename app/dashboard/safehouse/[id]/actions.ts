"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateOccupancy(id: string, delta: number) {
  try {
    const safeHouse = await prisma.safeHouse.findUnique({
      where: { id },
    });

    if (!safeHouse) {
      return { error: "Rumah Aman tidak ditemukan." };
    }

    const newOccupied = safeHouse.occupied + delta;

    if (newOccupied < 0) {
      return { error: "Jumlah penghuni tidak bisa kurang dari 0." };
    }

    if (newOccupied > safeHouse.capacity) {
      return { error: "Melebihi kapasitas maksimal." };
    }

    let status = "TERSEDIA";
    if (newOccupied === safeHouse.capacity) {
      status = "PENUH";
    } else if (newOccupied >= safeHouse.capacity * 0.8) {
      status = "HAMPIR_PENUH";
    }

    await prisma.safeHouse.update({
      where: { id },
      data: { 
        occupied: newOccupied,
        status: status
      },
    });

    revalidatePath(`/dashboard/safehouse/${id}`);
    revalidatePath("/dashboard/safehouse");
    return { success: true };
  } catch {
    return { error: "Gagal memperbarui data penghuni." };
  }
}

export async function updateStatus(id: string, status: string) {
  try {
    await prisma.safeHouse.update({
      where: { id },
      data: { status },
    });
    revalidatePath(`/dashboard/safehouse/${id}`);
    revalidatePath("/dashboard/safehouse");
    return { success: true };
  } catch {
    return { error: "Gagal memperbarui status." };
  }
}

export async function deleteSafeHouse(id: string) {
  try {
    // Check for residents first
    const safeHouse = await prisma.safeHouse.findUnique({
      where: { id },
      include: { residents: true }
    });

    if (safeHouse && safeHouse.residents.length > 0) {
      return { error: "Tidak dapat menghapus Rumah Aman yang masih memiliki penghuni aktif." };
    }

    await prisma.safeHouse.delete({
      where: { id },
    });

    revalidatePath("/dashboard/safehouse");
    return { success: true };
  } catch (error) {
    console.error("Error deleting safe house:", error);
    return { error: "Gagal menghapus data Rumah Aman." };
  }
}
