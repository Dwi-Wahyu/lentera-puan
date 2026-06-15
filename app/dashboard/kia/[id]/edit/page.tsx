"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { ArrowLeft, Save, UserCircle, Baby, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from "next/navigation";
import { updatePatient } from './actions';
import { useToast } from '@/components/providers/toast-provider';

interface Patient {
  name: string;
  nik: string;
  category: string;
}

const SkeletonEdit = () => (
  <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
    <div className="flex items-center gap-4">
      <div className="w-9 h-9 bg-surface-container rounded-lg" />
      <div className="space-y-2">
        <div className="h-8 w-64 bg-surface-container rounded-md" />
        <div className="h-4 w-96 bg-surface-container rounded-md" />
      </div>
    </div>
    <Card className="p-8 space-y-8 shadow-lg border-t-4 border-t-outline-variant">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2 h-6 w-40 bg-surface-container rounded-md mb-2" />
        <div className="space-y-2">
          <div className="h-4 w-24 bg-surface-container rounded-md" />
          <div className="h-10 w-full bg-surface-container rounded-md" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-24 bg-surface-container rounded-md" />
          <div className="h-10 w-full bg-surface-container rounded-md" />
        </div>
        <div className="md:col-span-2 h-6 w-40 bg-surface-container rounded-md mt-4 mb-2" />
        <div className="md:col-span-2 space-y-2">
          <div className="h-4 w-24 bg-surface-container rounded-md" />
          <div className="h-10 w-full bg-surface-container rounded-md" />
        </div>
      </div>
      <div className="flex justify-end gap-4 pt-4 border-t border-outline-variant">
        <div className="h-10 w-24 bg-surface-container rounded-md" />
        <div className="h-10 w-40 bg-surface-container rounded-md" />
      </div>
    </Card>
  </div>
);

export default function EditPatientPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const toast = useToast();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    async function fetchPatient() {
      try {
        const res = await fetch(`/api/patients/${id}`);
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || "Gagal memuat data pasien.");
        }
        const data = await res.json();
        setPatient(data);
      } catch (err: any) {
        toast.error("Kesalahan", err.message || "Gagal memuat data pasien.");
        router.push(`/dashboard/kia/${id}`);
      }
    }
    fetchPatient();
  }, [id, router, toast]);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    const result = await updatePatient(id, formData);
    if (result?.error) {
      toast.error('Gagal Memperbarui', result.error);
      setIsPending(false);
    } else {
      toast.success('Berhasil', 'Identitas Pasien Berhasil Diperbarui.');
      router.push(`/dashboard/kia/${id}`);
    }
  }

  if (!patient) return <SkeletonEdit />;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/kia/${id}`}>
          <Button variant="ghost" size="sm" className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Edit Identitas Pasien</h1>
          <p className="text-on-surface-variant">Perbarui informasi dasar dan kategori pemantauan KIA.</p>
        </div>
      </div>

      <Card className="shadow-lg border-t-4 border-t-primary">
        <form action={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 flex items-center gap-2 text-primary border-b border-outline-variant pb-2">
              <UserCircle className="w-5 h-5" />
              <h2 className="font-bold uppercase tracking-wider text-sm">Informasi Identitas</h2>
            </div>
            
            <Input
              label="Nama Lengkap"
              name="name"
              defaultValue={patient.name}
              placeholder="Masukkan nama lengkap pasien"
              required
              disabled={isPending}
            />
            
            <Input
              label="NIK (Nomor Induk Kependudukan)"
              name="nik"
              defaultValue={patient.nik}
              placeholder="16 digit nomor NIK"
              required
              maxLength={16}
              disabled={isPending}
            />

            <div className="md:col-span-2 flex items-center gap-2 text-primary border-b border-outline-variant pb-2 mt-4">
              <Baby className="w-5 h-5" />
              <h2 className="font-bold uppercase tracking-wider text-sm">Kategori Pemantauan</h2>
            </div>

            <div className="md:col-span-2 flex flex-col gap-1">
              <label className="text-sm font-semibold text-on-surface">Kategori Pasien</label>
              <select 
                name="category" 
                defaultValue={patient.category}
                required 
                disabled={isPending}
                className="px-4 py-2 border rounded bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all border-outline-variant"
              >
                <option value="IBU_HAMIL">Ibu Hamil</option>
                <option value="IBU_MENYUSUI">Ibu Menyusui</option>
                <option value="BALITA">Bayi / Balita</option>
                <option value="ANAK">Anak-anak</option>
                <option value="UMUM">Umum</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-outline-variant">
            <Link href={`/dashboard/kia/${id}`}>
              <Button variant="ghost" type="button" disabled={isPending}>Batal</Button>
            </Link>
            <Button type="submit" className="gap-2 px-8" disabled={isPending}>
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
