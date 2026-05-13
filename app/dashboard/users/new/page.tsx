import React from 'react';
import { Button } from '@/components/Button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { createUser } from './actions';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { UserFormClient } from './UserFormClient';

export default async function NewUserPage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  async function handleCreate(formData: FormData) {
    "use server";
    return await createUser(formData);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/users">
          <Button variant="ghost" size="sm" className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Tambah Pengguna</h1>
          <p className="text-on-surface-variant">Daftarkan personil baru dengan hak akses spesifik.</p>
        </div>
      </div>

      <UserFormClient onSubmit={handleCreate} />

      <div className="bg-primary-container/10 p-6 rounded-xl border border-dashed border-primary/30">
        <h3 className="text-sm font-bold text-primary mb-2 flex items-center gap-2">
          👮 Standar Keamanan
        </h3>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Setiap akun personil memiliki tanggung jawab penuh atas data yang diakses. Pastikan memberikan peran yang sesuai dengan tugas fungsional di lapangan. Kata sandi awal wajib diubah oleh pengguna pada saat login pertama kali.
        </p>
      </div>
    </div>
  );
}
