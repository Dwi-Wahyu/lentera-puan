"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function createCrisisReport(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { error: "Sesi tidak valid. Silakan login kembali." };
  }

  const victimInitials = formData.get("victimInitials") as string;
  const type = formData.get("type") as string;
  const priority = formData.get("priority") as string;
  const description = formData.get("description") as string;
  const safeHouseId = formData.get("safeHouseId") as string;
  const evidenceFile = formData.get("evidence") as File | null;

  if (!victimInitials || !type || !priority) {
    return { error: "Inisial, Tipe Krisis, dan Prioritas wajib diisi." };
  }

  try {
    // Verify user exists to avoid foreign key failure
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user) {
      return { error: "User tidak ditemukan. Sesi mungkin kedaluwarsa." };
    }

    const report = await prisma.crisisReport.create({
      data: {
        victimInitials,
        type,
        priority,
        description: description || null,
        reporterId: user.id,
        safeHouseId: safeHouseId || null,
        status: "BARU",
      },
    });

    // Handle Evidence Upload
    if (evidenceFile && evidenceFile.size > 0) {
      if (evidenceFile.size > 5 * 1024 * 1024) {
        return { error: "Ukuran file bukti maksimal 5MB." };
      }

      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!allowedTypes.includes(evidenceFile.type)) {
        return { error: "Jenis file tidak didukung. Gunakan PNG atau JPG." };
      }

      const bytes = await evidenceFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const filename = `${report.id}_${Date.now()}_${evidenceFile.name.replace(/\s+/g, "_")}`;
      const path = join(process.cwd(), "public/uploads", filename);
      
      await mkdir(join(process.cwd(), "public/uploads"), { recursive: true });
      await writeFile(path, buffer);

      await prisma.evidence.create({
        data: {
          reportId: report.id,
          url: `/uploads/${filename}`,
          type: "IMAGE",
        }
      });
    }

    // Create initial log
    await prisma.investigationLog.create({
      data: {
        reportId: report.id,
        action: "LAPORAN_DIBUAT",
        notes: `Laporan baru dibuat oleh ${user.name}.`,
      }
    });

    // If linked to a safe house, update occupancy
    if (safeHouseId) {
       const sh = await prisma.safeHouse.findUnique({ where: { id: safeHouseId } });
       if (sh) {
          await prisma.safeHouse.update({
            where: { id: safeHouseId },
            data: { 
              occupied: sh.occupied + 1,
              status: (sh.occupied + 1) >= sh.capacity ? "PENUH" : ((sh.occupied + 1) >= sh.capacity * 0.8 ? "HAMPIR_PENUH" : "TERSEDIA")
            }
          });
       }
    }

    revalidatePath("/dashboard/krisis");
    revalidatePath("/dashboard/safehouse");
    return { success: true };
  } catch (error) {
    console.error("Error creating report:", error);
    return { error: "Gagal menyimpan laporan. Terjadi kesalahan pada sistem." };
  }
}
