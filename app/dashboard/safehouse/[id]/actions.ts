"use server";

import { api } from "@/lib/api";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

async function updateSafeHouseStatus(id: string) {
  const sh = await api.getSafehouse(id);
  let status = "TERSEDIA";
  if (sh.occupied >= sh.capacity) {
    status = "PENUH";
  } else if (sh.occupied >= sh.capacity * 0.8) {
    status = "HAMPIR_PENUH";
  }
  await api.updateSafehouse(id, { status });
}

export async function checkInResident(safeHouseId: string, patientId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { error: "Sesi tidak valid. Silakan login kembali." };
    }

    const sh = await api.getSafehouse(safeHouseId);
    if (sh.occupied >= sh.capacity) {
      return { error: "Rumah Aman sudah penuh." };
    }

    // Create a crisis report as a "Resident" record
    await api.createCrisisReport({
      patientId,
      safeHouseId,
      victimInitials: "PASIEN_RUJUKAN", // Placeholder
      type: "RUJUKAN_SAFEHOUSE",
      status: "TERPROTEKSI",
      priority: "TINGGI",
      description: `Rujukan pasien ke Rumah Aman ${sh.name}`,
      reporterId: session.user.id,
      date: new Date().toISOString(),
    });

    await updateSafeHouseStatus(safeHouseId);
    
    revalidatePath(`/dashboard/safehouse/${safeHouseId}`);
    revalidatePath("/dashboard/safehouse");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Gagal melakukan check-in." };
  }
}

export async function checkOutResident(safeHouseId: string, reportId: string) {
  try {
    // We "check out" by disconnecting the report from the safehouse
    // and marking the report as finished or moved.
    await api.updateCrisisReport(reportId, { 
      safeHouseId: null,
      status: "SELESAI_PERLINDUNGAN"
    });

    await updateSafeHouseStatus(safeHouseId);

    revalidatePath(`/dashboard/safehouse/${safeHouseId}`);
    revalidatePath("/dashboard/safehouse");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Gagal melakukan check-out." };
  }
}

export async function updateOccupancy(id: string, delta: number) {
  try {
    const safeHouse = await api.getSafehouse(id);

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

    await api.updateSafehouse(id, { 
      occupied: newOccupied,
      status: status
    });

    revalidatePath(`/dashboard/safehouse/${id}`);
    revalidatePath("/dashboard/safehouse");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Gagal memperbarui data penghuni." };
  }
}

export async function updateSafeHouse(id: string, formData: FormData) {
  try {
    const data = {
      name: formData.get("name") as string,
      capacity: parseInt(formData.get("capacity") as string),
      safetyLevel: formData.get("safetyLevel") as string,
      location: formData.get("location") as string,
    };

    await api.updateSafehouse(id, data);

    revalidatePath(`/dashboard/safehouse/${id}`);
    revalidatePath("/dashboard/safehouse");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating safe house:", error);
    return { error: error.message || "Gagal memperbarui data Rumah Aman." };
  }
}

export async function updateStatus(id: string, status: string) {
  try {
    await api.updateSafehouse(id, { status });
    revalidatePath(`/dashboard/safehouse/${id}`);
    revalidatePath("/dashboard/safehouse");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Gagal memperbarui status." };
  }
}

export async function deleteSafeHouse(id: string) {
  try {
    // Check for residents first
    const safeHouse = await api.getSafehouse(id);

    if (safeHouse && safeHouse.residents.length > 0) {
      return { error: "Tidak dapat menghapus Rumah Aman yang masih memiliki penghuni aktif." };
    }

    await api.deleteSafehouse(id);

    revalidatePath("/dashboard/safehouse");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting safe house:", error);
    return { error: error.message || "Gagal menghapus data Rumah Aman." };
  }
}
