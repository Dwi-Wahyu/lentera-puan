"use client";

import React, { useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Save, Loader2, UserCog, Mail, Lock, Shield, BadgeCheck, Building2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/providers/toast-provider';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  nip: string | null;
  unit: string | null;
}

interface EditUserFormClientProps {
  user: User;
  onSubmit: (formData: FormData) => Promise<{ error?: string, success?: boolean }>;
}

export const EditUserFormClient: React.FC<EditUserFormClientProps> = ({ user, onSubmit }) => {
  const toast = useToast();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    const result = await onSubmit(formData);
    
    if (result?.error) {
      toast.error('Gagal Memperbarui', result.error);
      setIsPending(false);
    } else {
      toast.success('Berhasil', 'Data pengguna telah berhasil diperbarui.');
      router.push('/dashboard/users');
    }
  }

  return (
    <Card className="shadow-lg border-t-4 border-t-primary">
      <form action={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 flex items-center gap-2 text-primary border-b border-outline-variant pb-2">
            <UserCog className="w-5 h-5" />
            <h2 className="font-bold uppercase tracking-wider text-sm">Informasi Profil</h2>
          </div>
          
          <Input
            label="Nama Lengkap"
            name="name"
            defaultValue={user.name || ""}
            placeholder="Masukkan nama lengkap"
            required
            disabled={isPending}
          />
          
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
              <Mail className="w-4 h-4 text-on-surface-variant" /> Email Resmi
            </label>
            <Input
              name="email"
              type="email"
              defaultValue={user.email || ""}
              placeholder="email@lp.go.id"
              required
              disabled={isPending}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
              <Lock className="w-4 h-4 text-on-surface-variant" /> Ubah Kata Sandi (Opsional)
            </label>
            <Input
              name="password"
              type="password"
              placeholder="Kosongkan jika tidak ingin diubah"
              disabled={isPending}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
              <Shield className="w-4 h-4 text-on-surface-variant" /> Peran / Role
            </label>
            <select 
              name="role" 
              defaultValue={user.role}
              required 
              disabled={isPending}
              className="px-4 py-2 border rounded bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary transition-all border-outline-variant"
            >
              <option value="PSIKOLOG">Psikolog</option>
              <option value="DP3A">Petugas DP3A</option>
              <option value="ADMIN">Administrator</option>
            </select>
          </div>

          <div className="md:col-span-2 flex items-center gap-2 text-primary border-b border-outline-variant pb-2 mt-4">
            <BadgeCheck className="w-5 h-5" />
            <h2 className="font-bold uppercase tracking-wider text-sm">Kredensial & Unit</h2>
          </div>

          <Input
            label="NIP"
            name="nip"
            defaultValue={user.nip || ""}
            placeholder="Nomor Induk Pegawai"
            disabled={isPending}
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
              <Building2 className="w-4 h-4 text-on-surface-variant" /> Unit Kerja
            </label>
            <Input
              name="unit"
              defaultValue={user.unit || ""}
              placeholder="Contoh: Kantor Pusat"
              disabled={isPending}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-outline-variant">
          <Link href="/dashboard/users">
            <Button variant="ghost" type="button" disabled={isPending}>Batal</Button>
          </Link>
          <Button type="submit" className="gap-2 px-8" disabled={isPending}>
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Simpan Perubahan
          </Button>
        </div>
      </form>
    </Card>
  );
};
