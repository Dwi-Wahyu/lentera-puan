"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function recordAuditLog(action: string, resource?: string, details?: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return;

  try {
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action,
        resource,
        details,
      }
    });
  } catch (error) {
    console.error("Failed to record audit log:", error);
  }
}

export async function updateSystemConfig(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Unauthorized" };

  const agencyName = formData.get("agencyName") as string;
  const region = formData.get("region") as string;
  const maintenanceMode = formData.get("maintenanceMode") === "on";

  if (!agencyName || !region) {
    return { error: "Nama Instansi dan Wilayah wajib diisi." };
  }

  try {
    await prisma.systemConfig.upsert({
      where: { id: "default-config" },
      update: {
        agencyName,
        region,
        maintenanceMode,
      },
      create: {
        id: "default-config",
        agencyName,
        region,
        maintenanceMode,
      },
    });

    await recordAuditLog(
      "UPDATE_CONFIG", 
      "SYSTEM_SETTINGS", 
      `Update instansi: ${agencyName}, Wilayah: ${region}`
    );

    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    console.error("Error updating system config:", error);
    return { error: "Gagal memperbarui konfigurasi sistem." };
  }
}

export async function toggleMaintenanceMode(currentState: boolean) {
  try {
    const newState = !currentState;
    await prisma.systemConfig.upsert({
      where: { id: "default-config" },
      update: {
        maintenanceMode: newState,
      },
      create: {
        id: "default-config",
        maintenanceMode: newState,
      },
    });

    await recordAuditLog(
      "TOGGLE_MAINTENANCE", 
      "SYSTEM_STATE", 
      `Mode Pemeliharaan diubah menjadi: ${newState ? 'AKTIF' : 'NON-AKTIF'}`
    );

    revalidatePath("/dashboard/settings");
    return { success: true, newState };
  } catch (error) {
    console.error("Error toggling maintenance mode:", error);
    return { error: "Gagal mengubah mode pemeliharaan." };
  }
}

export async function resetSecurityKeys() {
  try {
    // Logic to reset keys would go here
    // For now we just record the action
    await recordAuditLog(
      "RESET_SECURITY_KEYS", 
      "ENCRYPTION", 
      "Administrator melakukan reset kunci enkripsi E2E"
    );

    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    console.error("Error resetting security keys:", error);
    return { error: "Gagal melakukan reset kunci keamanan." };
  }
}
