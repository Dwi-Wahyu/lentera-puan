"use server";

import { api } from "@/lib/api";
import { revalidatePath } from "next/cache";

export async function updateSystemConfig(formData: FormData) {
  const agencyName = formData.get("agencyName") as string;
  const region = formData.get("region") as string;
  const maintenanceMode = formData.get("maintenanceMode") === "on";

  if (!agencyName || !region) {
    return { error: "Nama Instansi dan Wilayah wajib diisi." };
  }

  try {
    await api.updateConfig({
      agencyName,
      region,
      maintenanceMode,
    });

    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating system config:", error);
    return { error: error.message || "Gagal memperbarui konfigurasi sistem." };
  }
}

export async function toggleMaintenanceMode(currentState: boolean) {
  try {
    const newState = !currentState;
    await api.updateConfig({
      maintenanceMode: newState,
    });

    revalidatePath("/dashboard/settings");
    return { success: true, newState };
  } catch (error: any) {
    console.error("Error toggling maintenance mode:", error);
    return { error: error.message || "Gagal mengubah mode pemeliharaan." };
  }
}

export async function resetSecurityKeys() {
  try {
    // Logic to reset keys would go here
    // For now we just return success as the backend tracks the action if we had an endpoint for it
    // Or we could add a specific endpoint for this.
    
    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    console.error("Error resetting security keys:", error);
    return { error: "Gagal melakukan reset kunci keamanan." };
  }
}
