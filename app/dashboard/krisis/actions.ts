"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteCrisisReport(id: string) {
  try {
    const report = await prisma.crisisReport.findUnique({
      where: { id },
    });

    if (!report) {
      return { error: "Laporan tidak ditemukan." };
    }

    // If report was linked to a safe house, decrement occupancy
    if (report.safeHouseId) {
      const sh = await prisma.safeHouse.findUnique({ where: { id: report.safeHouseId } });
      if (sh && sh.occupied > 0) {
        await prisma.safeHouse.update({
          where: { id: report.safeHouseId },
          data: { 
            occupied: sh.occupied - 1,
            status: (sh.occupied - 1) >= sh.capacity ? "PENUH" : ((sh.occupied - 1) >= sh.capacity * 0.8 ? "HAMPIR_PENUH" : "TERSEDIA")
          }
        });
      }
    }

    await prisma.crisisReport.delete({
      where: { id },
    });

    revalidatePath("/dashboard/krisis");
    revalidatePath("/dashboard/safehouse");
    return { success: true };
  } catch (error) {
    console.error("Error deleting report:", error);
    return { error: "Gagal menghapus laporan krisis." };
  }
}
