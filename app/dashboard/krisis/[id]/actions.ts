"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function addInvestigationLog(reportId: string, action: string, notes: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    await prisma.investigationLog.create({
      data: {
        reportId,
        action,
        notes,
      },
    });
    revalidatePath(`/dashboard/krisis/${reportId}`);
    return { success: true };
  } catch {
    return { error: "Gagal menambahkan log." };
  }
}

export async function validateCrisisCase(reportId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    await prisma.$transaction([
      prisma.crisisReport.update({
        where: { id: reportId },
        data: { status: "TERVALIDASI" },
      }),
      prisma.investigationLog.create({
        data: {
          reportId,
          action: "VALIDASI_KASUS",
          notes: `Kasus divalidasi oleh ${session.user.name}.`,
        },
      }),
    ]);
    revalidatePath(`/dashboard/krisis/${reportId}`);
    return { success: true };
  } catch {
    return { error: "Gagal memvalidasi kasus." };
  }
}

export async function completeCrisisCase(reportId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    await prisma.$transaction([
      prisma.crisisReport.update({
        where: { id: reportId },
        data: { status: "SELESAI" },
      }),
      prisma.investigationLog.create({
        data: {
          reportId,
          action: "KASUS_SELESAI",
          notes: `Kasus ditutup/diselesaikan oleh ${session.user.name}.`,
        },
      }),
    ]);
    revalidatePath(`/dashboard/krisis/${reportId}`);
    return { success: true };
  } catch {
    return { error: "Gagal menyelesaikan kasus." };
  }
}
