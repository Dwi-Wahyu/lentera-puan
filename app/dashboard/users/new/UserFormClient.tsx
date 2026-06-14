"use client";

import React, { useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Save, Loader2, UserPlus, Mail, Lock, Shield, BadgeCheck, Building2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/providers/toast-provider';
import { useRouter } from 'next/navigation';

interface UserFormClientProps {
  onSubmit: (formData: FormData) => Promise<{ error?: string, success?: boolean }>;
}

export const UserFormClient: React.FC<UserFormClientProps> = ({ onSubmit }) => {
  const toast = useToast();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    const result = await onSubmit(formData);
    
    if (result?.error) {
      toast.error('Gagal Membuat User', result.error);
      setIsPending(false);
    } else {
      toast.success('Berhasil', 'Pengguna baru telah berhasil ditambahkan ke sistem.');
      router.push('/dashboard/users');
    }
  }

  return (
    <Card className="shadow-lg border-t-4 border-t-primary">
      <form action={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 flex items-center gap-2 text-primary border-b border-outline-variant pb-2">
            <UserPlus className="w-5 h-5" />
            <h2 className="font-bold uppercase tracking-wider text-sm">Informasi Akun</h2>
          </div>
          
          <Input
            label="Nama Lengkap"
            name="name"
            placeholder="Masukkan nama lengkap personil"
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
              placeholder="email@lp.go.id"
              required
              disabled={isPending}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
              <Lock className="w-4 h-4 text-on-surface-variant" /> Kata Sandi Awal
            </label>
            <Input
              name="password"
              type="password"
              placeholder="••••••••"
              required
              disabled={isPending}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
              <Shield className="w-4 h-4 text-on-surface-variant" /> Peran / Role
            </label>
            <select 
              name="role" 
              required 
              disabled={isPending}
              className="px-4 py-2 border rounded bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary transition-all border-outline-variant"
            >
              <option value="">Pilih Peran</option>
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="DP3A">DP3A</option>
              <option value="KESRE">Kesre</option>
              <option value="KONSELOR">Konselor</option>
            </select>
          </div>

          <div className="md:col-span-2 flex items-center gap-2 text-primary border-b border-outline-variant pb-2 mt-4">
            <BadgeCheck className="w-5 h-5" />
            <h2 className="font-bold uppercase tracking-wider text-sm">Kredensial & Unit</h2>
          </div>

          <Input
            label="NIP (Opsional)"
            name="nip"
            placeholder="Nomor Induk Pegawai"
            disabled={isPending}
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
              <Building2 className="w-4 h-4 text-on-surface-variant" /> Unit Kerja
            </label>
            <Input
              name="unit"
              placeholder="Contoh: Puskesmas Mawar"
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
            Simpan Pengguna
          </Button>
        </div>
      </form>
    </Card>
  );
};
