import React from 'react';
import { api } from "@/lib/api";
import { Button } from '@/components/Button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound, redirect } from "next/navigation";
import { updateUser } from './actions';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { EditUserFormClient } from './EditUserFormClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  nip: string | null;
  unit: string | null;
}

export default async function EditUserPage({ params }: PageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  let user;
  try {
    user = await api.getUser(id);
  } catch (error) {
    notFound();
  }

  if (!user) {
    notFound();
  }

  async function handleUpdate(formData: FormData) {
    "use server";
    return await updateUser(id, formData);
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
          <h1 className="text-3xl font-bold text-on-surface">Edit Pengguna</h1>
          <p className="text-on-surface-variant">Perbarui informasi profil atau hak akses personil.</p>
        </div>
      </div>

      <EditUserFormClient user={user as User} onSubmit={handleUpdate} />
    </div>
  );
}
