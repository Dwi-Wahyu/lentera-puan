"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { 
  ArrowLeft, 
  Save, 
  AlertTriangle, 
  User, 
  FileText,
  Loader2,
  Paperclip
} from 'lucide-react';
import Link from 'next/link';
import { createCrisisReport } from './actions';
import { useToast } from '@/components/providers/toast-provider';
import { useRouter } from 'next/navigation';

interface SafeHouse {
  id: string;
  name: string;
  capacity: number;
  occupied: number;
}

export default function NewCrisisReportPage() {
  const toast = useToast();
  const router = useRouter();
  const [safeHouses, setSafeHouses] = useState<SafeHouse[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSafeHouses() {
      try {
        const res = await fetch('/api/safehouses?available=true');
        if (!res.ok) throw new Error();
        const data = await res.json();
        setSafeHouses(data);
      } catch (error) {
        console.error("Failed to fetch safe houses:", error);
        setSafeHouses([]);
      }
    }
    fetchSafeHouses();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError(null);

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFileError("Ukuran file maksimal 5MB.");
        e.target.value = ""; // Reset input
        return;
      }

      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        setFileError("Hanya file PNG, JPG, atau JPEG yang diperbolehkan.");
        e.target.value = ""; // Reset input
        return;
      }
    }
  };

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    const result = await createCrisisReport(formData);
    if (result?.error) {
      toast.error('Gagal Melapor', result.error);
      setIsPending(false);
    } else {
      toast.success('Berhasil', 'Laporan krisis telah berhasil dibuat.');
      router.push('/dashboard/krisis');
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/krisis">
          <Button variant="ghost" size="sm" className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Pelaporan Krisis Baru</h1>
          <p className="text-on-surface-variant">Catat insiden krisis untuk penanganan segera.</p>
        </div>
      </div>

      <Card className="shadow-lg border-t-4 border-t-error">
        <form action={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Identity Section */}
            <div className="md:col-span-2 flex items-center gap-2 text-error border-b border-outline-variant pb-2">
              <User className="w-5 h-5" />
              <h2 className="font-bold uppercase tracking-wider text-sm">Informasi Korban</h2>
            </div>
            
            <Input
              label="Inisial Korban"
              name="victimInitials"
              placeholder="Contoh: NY (32th)"
              required
              disabled={isPending}
            />
            
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-on-surface">Tipe Krisis</label>
              <select 
                name="type" 
                required 
                disabled={isPending}
                className="px-4 py-2 border rounded bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary transition-all border-outline-variant"
              >
                <option value="">Pilih Tipe</option>
                <option value="KDRT">Kekerasan Dalam Rumah Tangga</option>
                <option value="KEKERASAN_SEKSUAL">Kekerasan Seksual</option>
                <option value="ANCAMAN_KEAMANAN">Ancaman Keamanan</option>
                <option value="INTERVENSI_MEDIS_DARURAT">Intervensi Medis Darurat</option>
                <option value="LAINNYA">Lainnya</option>
              </select>
            </div>

            {/* Assessment Section */}
            <div className="md:col-span-2 flex items-center gap-2 text-error border-b border-outline-variant pb-2 mt-4">
              <AlertTriangle className="w-5 h-5" />
              <h2 className="font-bold uppercase tracking-wider text-sm">Asesmen Awal</h2>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-on-surface">Prioritas Penanganan</label>
              <select 
                name="priority" 
                required 
                defaultValue="MEDIUM"
                disabled={isPending}
                className="px-4 py-2 border rounded bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-error transition-all border-outline-variant font-bold text-error"
              >
                <option value="RENDAH">Rendah</option>
                <option value="MEDIUM">Medium</option>
                <option value="TINGGI">Tinggi</option>
                <option value="SANGAT_TINGGI">Sangat Tinggi / Darurat</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-on-surface">Evakuasi ke Rumah Aman (Opsional)</label>
              <select 
                name="safeHouseId" 
                disabled={isPending}
                className="px-4 py-2 border rounded bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary transition-all border-outline-variant"
              >
                <option value="">Tidak Dievakuasi</option>
                {safeHouses.map((sh) => (
                  <option key={sh.id} value={sh.id}>{sh.name} (Tersedia {sh.capacity - sh.occupied} Bed)</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 flex flex-col gap-1">
              <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-on-surface-variant" /> Lampiran Bukti (PNG/JPG, Maks 5MB)
              </label>
              <input 
                type="file" 
                name="evidence"
                accept=".png,.jpg,.jpeg"
                onChange={handleFileChange}
                disabled={isPending}
                className="block w-full text-sm text-on-surface-variant
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-xs file:font-bold
                  file:bg-primary file:text-on-primary
                  hover:file:bg-primary-container transition-all
                  cursor-pointer bg-surface-container-low rounded-lg p-2 border border-dashed border-outline-variant"
              />
              {fileError && <p className="text-xs text-error font-bold mt-1">{fileError}</p>}
            </div>

            <div className="md:col-span-2 flex flex-col gap-1">
              <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
                <FileText className="w-4 h-4 text-on-surface-variant" /> Kronologi & Deskripsi Kejadian
              </label>
              <textarea 
                name="description" 
                rows={6}
                placeholder="Masukkan detail kejadian secara kronologis untuk memudahkan investigasi..."
                disabled={isPending}
                className="px-4 py-2 border rounded bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary transition-all border-outline-variant resize-none"
              ></textarea>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-outline-variant">
            <Link href="/dashboard/krisis">
              <Button variant="ghost" type="button" disabled={isPending}>Batal</Button>
            </Link>
            <Button type="submit" variant="primary" className="gap-2 px-8 bg-error hover:bg-error/90 border-none" disabled={isPending}>
               {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Simpan & Buat Laporan
            </Button>
          </div>
        </form>
      </Card>

      <div className="bg-error-container/10 p-6 rounded-xl border border-dashed border-error/30">
        <h3 className="text-sm font-bold text-error mb-2 flex items-center gap-2">
          🚨 Protokol Krisis
        </h3>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Setiap laporan krisis akan langsung memicu alert kepada tim operasional dan psikolog yang bertugas. Pastikan data yang dimasukkan akurat untuk efektivitas intervensi. Laporan ini dilindungi oleh standar keamanan data krisis LenteraPuan.
        </p>
      </div>
    </div>
  );
}
