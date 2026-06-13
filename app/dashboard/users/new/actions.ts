"use server";

import { api } from "@/lib/api";
import { revalidatePath } from "next/cache";

export async function createUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;
  const nip = formData.get("nip") as string;
  const unit = formData.get("unit") as string;

  if (!name || !email || !password || !role) {
    return { error: "Nama, Email, Password, dan Peran wajib diisi." };
  }

  try {
    await api.createUser({
      name,
      email,
      password,
      role,
      nip: nip || null,
      unit: unit || null,
    });

    revalidatePath("/dashboard/users");
    return { success: true };
  } catch (error: any) {
    console.error("Error creating user:", error);
    return { error: error.message || "Gagal membuat pengguna baru." };
  }
}
