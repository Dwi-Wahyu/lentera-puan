"use client";

import React, { useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { ArrowLeft, Save, Loader2, Baby, UserCircle, Activity } from 'lucide-react';
import Link from 'next/link';
import { createPatient } from './actions';
import { useToast } from '@/components/providers/toast-provider';
import { useRouter } from 'next/navigation';

export default function NewPatientPage() {
  const toast = useToast();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setError(null);
    const result = await createPatient(formData);
    
    if (result?.error) {
      setError(result.error);
      toast.error('Gagal Menyimpan', result.error);
      setIsPending(false);
    } else {
      toast.success('Berhasil', 'Data Pasien Berhasil Disimpan.');
      router.push('/dashboard/kia');
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/kia">
          <Button variant="ghost" size="sm" className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Tambah Pasien Baru</h1>
          <p className="text-on-surface-variant">Masukkan data lengkap untuk pemantauan KIA.</p>
        </div>
      </div>

      <Card className="shadow-lg border-t-4 border-t-primary">
        <form action={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Info Section */}
            <div className="md:col-span-2 flex items-center gap-2 text-primary border-b border-outline-variant pb-2">
              <UserCircle className="w-5 h-5" />
              <h2 className="font-bold uppercase tracking-wider text-sm">Informasi Identitas</h2>
            </div>
            
            <Input
              label="Nama Lengkap"
              name="name"
              placeholder="Masukkan nama lengkap pasien"
              required
              disabled={isPending}
            />
            
            <Input
              label="NIK (Nomor Induk Kependudukan)"
              name="nik"
              placeholder="16 digit nomor NIK"
              required
              maxLength={16}
              disabled={isPending}
            />

            {/* Health Category Section */}
            <div className="md:col-span-2 flex items-center gap-2 text-primary border-b border-outline-variant pb-2 mt-4">
              <Baby className="w-5 h-5" />
              <h2 className="font-bold uppercase tracking-wider text-sm">Kategori & Kondisi</h2>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-on-surface">Kategori Pasien</label>
              <select 
                name="category" 
                required 
                disabled={isPending}
                className="px-4 py-2 border rounded bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all border-outline-variant"
              >
                <option value="">Pilih Kategori</option>
                <option value="IBU_HAMIL">Ibu Hamil</option>
                <option value="ANAK">Anak / Balita</option>
                <option value="IBU_MENYUSUI">Ibu Menyusui</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-on-surface">Status Gizi Awal</label>
              <select 
                name="nutritionStatus" 
                disabled={isPending}
                className="px-4 py-2 border rounded bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all border-outline-variant"
              >
                <option value="NORMAL">Normal</option>
                <option value="PERLU_PERHATIAN">Perlu Perhatian</option>
                <option value="RISIKO_TINGGI">Risiko Tinggi</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="bg-error-container text-on-error-container p-4 rounded-lg text-sm font-medium flex items-center gap-3">
              <Activity className="w-5 h-5" />
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-outline-variant">
            <Link href="/dashboard/kia">
              <Button variant="ghost" type="button" disabled={isPending}>Batal</Button>
            </Link>
            <Button type="submit" className="gap-2 px-8" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Simpan Data Pasien
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>

      <div className="bg-surface-container-low p-6 rounded-xl border border-dashed border-outline-variant">
        <h3 className="text-sm font-bold text-primary mb-2 flex items-center gap-2">
          💡 Tips Pengisian
        </h3>
        <ul className="text-xs text-on-surface-variant space-y-2 list-disc pl-4">
          <li>Pastikan NIK sesuai dengan KTP atau Kartu Keluarga pasien.</li>
          <li>Kategori pasien akan menentukan jadwal pemeriksaan rutin otomatis.</li>
          <li>Data yang disimpan akan terenkripsi secara end-to-end sesuai standar keamanan LenteraPuan.</li>
        </ul>
      </div>
    </div>
  );
}
