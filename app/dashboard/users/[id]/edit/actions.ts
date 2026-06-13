"use server";

import { api } from "@/lib/api";
import { revalidatePath } from "next/cache";

export async function updateUser(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;
  const nip = formData.get("nip") as string;
  const unit = formData.get("unit") as string;

  if (!name || !email || !role) {
    return { error: "Nama, Email, dan Peran wajib diisi." };
  }

  try {
    const updateData: any = {
      name,
      email,
      role,
      nip: nip || null,
      unit: unit || null,
    };

    if (password) {
      updateData.password = password;
    }

    await api.updateUser(id, updateData);

    revalidatePath("/dashboard/users");
    revalidatePath("/dashboard/profile");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating user:", error);
    return { error: error.message || "Gagal memperbarui data pengguna." };
  }
}
