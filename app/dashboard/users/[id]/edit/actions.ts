"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";

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
    const updateData: {
      name: string;
      email: string;
      role: string;
      nip: string | null;
      unit: string | null;
      password?: string;
    } = {
      name,
      email,
      role,
      nip: nip || null,
      unit: unit || null,
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    await prisma.user.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/dashboard/users");
    revalidatePath("/dashboard/profile");
    return { success: true };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return { error: "Email atau NIP sudah terdaftar dalam sistem." };
      }
    }
    console.error("Error updating user:", error);
    return { error: "Gagal memperbarui data pengguna." };
  }
}
