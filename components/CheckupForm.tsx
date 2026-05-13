"use client";

import React, { useState } from 'react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { 
  Save, 
  Loader2, 
  Stethoscope, 
  Calendar, 
  FileText,
  AlertCircle 
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/providers/toast-provider';

interface CheckupFormProps {
  initialData?: {
    date: Date;
    status: string;
    notes: string | null;
  };
  onSubmit: (formData: FormData) => Promise<{ error?: string } | void>;
  cancelHref: string;
}

export const CheckupForm: React.FC<CheckupFormProps> = ({ 
  initialData, 
  onSubmit, 
  cancelHref 
}) => {
  const toast = useToast();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const defaultDate = initialData 
    ? initialData.date.toISOString().split('T')[0] 
    : new Date().toISOString().split('T')[0];

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setError(null);
    const result = await onSubmit(formData);
    if (result?.error) {
      setError(result.error);
      toast.error('Gagal Menyimpan', result.error);
      setIsPending(false);
    } else {
      toast.success('Berhasil', `Data pemeriksaan berhasil ${initialData ? 'diperbarui' : 'disimpan'}.`);
    }
  }

  return (
    <Card className="shadow-lg border-t-4 border-t-primary">
      <form action={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 flex items-center gap-2 text-primary border-b border-outline-variant pb-2">
            <Stethoscope className="w-5 h-5" />
            <h2 className="font-bold uppercase tracking-wider text-sm">Data Klinis Pemeriksaan</h2>
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
              <Calendar className="w-4 h-4 text-on-surface-variant" /> Tanggal Pemeriksaan
            </label>
            <input 
              type="date" 
              name="date" 
              defaultValue={defaultDate}
              required 
              disabled={isPending}
              className="px-4 py-2 border rounded bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all border-outline-variant"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-on-surface-variant" /> Status Gizi / Hasil
            </label>
            <select 
              name="status" 
              defaultValue={initialData?.status || ""}
              required 
              disabled={isPending}
              className="px-4 py-2 border rounded bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all border-outline-variant"
            >
              <option value="">Pilih Status</option>
              <option value="NORMAL">Normal</option>
              <option value="PERLU_PERHATIAN">Perlu Perhatian</option>
              <option value="RISIKO_TINGGI">Risiko Tinggi / Stunting</option>
              <option value="PEMULIHAN">Dalam Pemulihan</option>
            </select>
          </div>

          <div className="md:col-span-2 flex flex-col gap-1">
            <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
              <FileText className="w-4 h-4 text-on-surface-variant" /> Catatan Medis & Tindak Lanjut
            </label>
            <textarea 
              name="notes" 
              rows={4}
              defaultValue={initialData?.notes || ""}
              placeholder="Masukkan detail hasil pemeriksaan..."
              disabled={isPending}
              className="px-4 py-2 border rounded bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all border-outline-variant resize-none"
            ></textarea>
          </div>
        </div>

        {error && (
          <div className="bg-error-container text-on-error-container p-4 rounded-lg text-sm font-medium flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-outline-variant">
          <Link href={cancelHref}>
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
                <Save className="w-4 h-4" /> {initialData ? 'Update Pemeriksaan' : 'Simpan Pemeriksaan'}
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};
