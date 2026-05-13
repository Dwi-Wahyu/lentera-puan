"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function updateCrisisReport(id: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Unauthorized" };

  const victimInitials = formData.get("victimInitials") as string;
  const type = formData.get("type") as string;
  const priority = formData.get("priority") as string;
  const description = formData.get("description") as string;
  const status = formData.get("status") as string;
  const evidenceFile = formData.get("evidence") as File | null;

  if (!victimInitials || !type || !priority || !status) {
    return { error: "Semua field wajib diisi." };
  }

  try {
    await prisma.crisisReport.update({
      where: { id },
      data: {
        victimInitials,
        type,
        priority,
        description,
        status,
      },
    });

    // Handle New Evidence Upload if provided
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

      const filename = `${id}_${Date.now()}_${evidenceFile.name.replace(/\s+/g, "_")}`;
      const path = join(process.cwd(), "public/uploads", filename);
      
      await mkdir(join(process.cwd(), "public/uploads"), { recursive: true });
      await writeFile(path, buffer);

      await prisma.evidence.create({
        data: {
          reportId: id,
          url: `/uploads/${filename}`,
          type: "IMAGE",
        }
      });
    }

    await prisma.investigationLog.create({
      data: {
        reportId: id,
        action: "UPDATE_KASUS",
        notes: `Data kasus diperbarui oleh ${session.user.name}.`,
      }
    });

    revalidatePath("/dashboard/krisis");
    revalidatePath(`/dashboard/krisis/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating report:", error);
    return { error: "Gagal memperbarui laporan." };
  }
}
