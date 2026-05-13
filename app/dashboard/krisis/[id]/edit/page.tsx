"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { 
  ArrowLeft, 
  Save, 
  User, 
  FileText,
  Loader2,
  Activity,
  Paperclip
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { updateCrisisReport } from './actions';
import { useToast } from '@/components/providers/toast-provider';

interface CrisisReport {
  id: string;
  victimInitials: string;
  type: string;
  status: string;
  priority: string;
  description: string | null;
}

export default function EditCrisisReportPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const toast = useToast();
  
  const [report, setReport] = useState<CrisisReport | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fileError, setFileError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReport() {
      try {
        const res = await fetch(`/api/krisis/${id}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setReport(data);
      } catch {
        toast.error('Kesalahan', 'Gagal memuat data laporan.');
        router.push('/dashboard/krisis');
      } finally {
        setIsLoading(false);
      }
    }
    fetchReport();
  }, [id, router, toast]);

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
    const result = await updateCrisisReport(id, formData);
    
    if (result?.error) {
      toast.error('Gagal Memperbarui', result.error);
      setIsPending(false);
    } else {
      toast.success('Berhasil', 'Data laporan telah diperbarui.');
      router.push(`/dashboard/krisis/${id}`);
    }
  }

  if (isLoading) return (
    <div className="min-h-[400px] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  if (!report) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/krisis/${id}`}>
          <Button variant="ghost" size="sm" className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Edit Laporan {report.id.slice(-8).toUpperCase()}</h1>
          <p className="text-on-surface-variant">Perbarui detail insiden dan status penanganan.</p>
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
              defaultValue={report.victimInitials}
              required
              disabled={isPending}
            />
            
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-on-surface">Tipe Krisis</label>
              <select 
                name="type" 
                required 
                defaultValue={report.type}
                disabled={isPending}
                className="px-4 py-2 border rounded bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary transition-all border-outline-variant"
              >
                <option value="KDRT">Kekerasan Dalam Rumah Tangga</option>
                <option value="KEKERASAN_SEKSUAL">Kekerasan Seksual</option>
                <option value="ANCAMAN_KEAMANAN">Ancaman Keamanan</option>
                <option value="INTERVENSI_MEDIS_DARURAT">Intervensi Medis Darurat</option>
                <option value="LAINNYA">Lainnya</option>
              </select>
            </div>

            {/* Status Section */}
            <div className="md:col-span-2 flex items-center gap-2 text-primary border-b border-outline-variant pb-2 mt-4">
              <Activity className="w-5 h-5" />
              <h2 className="font-bold uppercase tracking-wider text-sm">Status & Prioritas</h2>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-on-surface">Status Laporan</label>
              <select 
                name="status" 
                required 
                defaultValue={report.status}
                disabled={isPending}
                className="px-4 py-2 border rounded bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary transition-all border-outline-variant"
              >
                <option value="BARU">Baru</option>
                <option value="INVESTIGASI">Dalam Investigasi</option>
                <option value="TERVALIDASI">Tervalidasi</option>
                <option value="SELESAI">Selesai</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-on-surface">Prioritas Penanganan</label>
              <select 
                name="priority" 
                required 
                defaultValue={report.priority}
                disabled={isPending}
                className="px-4 py-2 border rounded bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-error transition-all border-outline-variant font-bold text-error"
              >
                <option value="RENDAH">Rendah</option>
                <option value="MEDIUM">Medium</option>
                <option value="TINGGI">Tinggi</option>
                <option value="SANGAT_TINGGI">Sangat Tinggi / Darurat</option>
              </select>
            </div>

            {/* Evidence Section */}
            <div className="md:col-span-2 flex flex-col gap-1 mt-4">
              <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-on-surface-variant" /> Tambah Bukti Baru (PNG/JPG, Maks 5MB)
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
              <p className="text-[10px] text-on-surface-variant italic">Mengunggah file baru akan menambahkan ke daftar bukti kasus ini.</p>
            </div>

            <div className="md:col-span-2 flex flex-col gap-1">
              <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
                <FileText className="w-4 h-4 text-on-surface-variant" /> Kronologi & Deskripsi Kejadian
              </label>
              <textarea 
                name="description" 
                rows={6}
                defaultValue={report.description || ""}
                placeholder="Masukkan detail kejadian..."
                disabled={isPending}
                className="px-4 py-2 border rounded bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary transition-all border-outline-variant resize-none"
              ></textarea>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-outline-variant">
            <Link href={`/dashboard/krisis/${id}`}>
              <Button variant="ghost" type="button" disabled={isPending}>Batal</Button>
            </Link>
            <Button type="submit" variant="primary" className="gap-2 px-8" disabled={isPending}>
               {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Simpan Perubahan
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
