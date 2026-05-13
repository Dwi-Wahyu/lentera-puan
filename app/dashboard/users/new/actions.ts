"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";

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
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        nip: nip || null,
        unit: unit || null,
      },
    });

    revalidatePath("/dashboard/users");
    return { success: true };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return { error: "Email atau NIP sudah terdaftar dalam sistem." };
      }
    }
    console.error("Error creating user:", error);
    return { error: "Gagal membuat pengguna baru." };
  }
}
