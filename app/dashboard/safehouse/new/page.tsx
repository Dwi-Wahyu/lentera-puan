"use client";

import React, { useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { ArrowLeft, Save, Loader2, Shield, Home, MapPin, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { createSafeHouse } from './actions';
import { useToast } from '@/components/providers/toast-provider';
import { useRouter } from 'next/navigation';

export default function NewSafeHousePage() {
  const toast = useToast();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setError(null);
    const result = await createSafeHouse(formData);
    if (result?.error) {
      setError(result.error);
      toast.error('Gagal Menyimpan', result.error);
      setIsPending(false);
    } else {
      toast.success('Berhasil', 'Data Rumah Aman berhasil didaftarkan.');
      router.push('/dashboard/safehouse');
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/safehouse">
          <Button variant="ghost" size="sm" className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Tambah Rumah Aman</h1>
          <p className="text-on-surface-variant">Daftarkan lokasi perlindungan baru ke dalam sistem.</p>
        </div>
      </div>

      <Card className="shadow-lg border-t-4 border-t-primary">
        <form action={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* General Info Section */}
            <div className="md:col-span-2 flex items-center gap-2 text-primary border-b border-outline-variant pb-2">
              <Home className="w-5 h-5" />
              <h2 className="font-bold uppercase tracking-wider text-sm">Informasi Dasar</h2>
            </div>
            
            <Input
              label="Nama Lokasi"
              name="name"
              placeholder="Contoh: Rumah Aman Melati"
              required
              disabled={isPending}
            />
            
            <Input
              label="Kapasitas Total (Bed)"
              name="capacity"
              type="number"
              placeholder="Jumlah tempat tidur tersedia"
              required
              min={1}
              disabled={isPending}
            />

            {/* Security & Location Section */}
            <div className="md:col-span-2 flex items-center gap-2 text-primary border-b border-outline-variant pb-2 mt-4">
              <Shield className="w-5 h-5" />
              <h2 className="font-bold uppercase tracking-wider text-sm">Keamanan & Lokasi</h2>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-on-surface">Tingkat Keamanan</label>
              <select 
                name="safetyLevel" 
                required 
                disabled={isPending}
                className="px-4 py-2 border rounded bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all border-outline-variant"
              >
                <option value="">Pilih Tingkat Keamanan</option>
                <option value="RENDAH">Rendah</option>
                <option value="MEDIUM">Medium</option>
                <option value="TINGGI">Tinggi</option>
                <option value="SANGAT_TINGGI">Sangat Tinggi</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-on-surface">Alamat / Koordinat (Opsional)</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline-variant" />
                <input 
                  name="location" 
                  disabled={isPending}
                  placeholder="Detail lokasi rahasia"
                  className="w-full pl-10 px-4 py-2 border rounded bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all border-outline-variant"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-error-container text-on-error-container p-4 rounded-lg text-sm font-medium flex items-center gap-3">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-outline-variant">
            <Link href="/dashboard/safehouse">
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
                  <Save className="w-4 h-4" /> Simpan Lokasi
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>

      <div className="bg-secondary-container/10 p-6 rounded-xl border border-dashed border-secondary/30">
        <h3 className="text-sm font-bold text-secondary mb-2 flex items-center gap-2">
          🔒 Protokol Keamanan
        </h3>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Data lokasi Rumah Aman bersifat **Sangat Rahasia**. Pastikan Anda hanya memasukkan detail yang diperlukan untuk koordinasi internal. Informasi ini dilindungi oleh enkripsi tingkat tinggi untuk menjaga keselamatan penghuni.
        </p>
      </div>
    </div>
  );
}
