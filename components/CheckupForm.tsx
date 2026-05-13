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
    <Card className="shadow-sm border-t-2 border-t-primary !rounded-2xl">
      <form action={handleSubmit} className="space-y-8">
        {/* Section Header */}
        <div className="flex items-center gap-2.5 pb-4 border-b border-outline-variant/50">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Stethoscope className="w-4 h-4 text-primary" />
          </div>
          <h2 className="font-bold text-sm text-on-surface uppercase tracking-widest">Data Klinis Pemeriksaan</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Date Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-on-surface uppercase tracking-widest flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-on-surface-variant" /> Tanggal Pemeriksaan
            </label>
            <input 
              type="date" 
              name="date" 
              defaultValue={defaultDate}
              required 
              disabled={isPending}
              className="px-4 py-2.5 border border-outline-variant/70 rounded-lg bg-surface-container-lowest text-on-surface text-sm transition-all hover:border-outline focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:opacity-50"
            />
          </div>

          {/* Status Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-on-surface uppercase tracking-widest flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-on-surface-variant" /> Status Gizi / Hasil
            </label>
            <select 
              name="status" 
              defaultValue={initialData?.status || ""}
              required 
              disabled={isPending}
              className="px-4 py-2.5 border border-outline-variant/70 rounded-lg bg-surface-container-lowest text-on-surface text-sm transition-all hover:border-outline focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:opacity-50 appearance-none"
            >
              <option value="">Pilih Status</option>
              <option value="NORMAL">Normal</option>
              <option value="PERLU_PERHATIAN">Perlu Perhatian</option>
              <option value="RISIKO_TINGGI">Risiko Tinggi / Stunting</option>
              <option value="PEMULIHAN">Dalam Pemulihan</option>
            </select>
          </div>

          {/* Notes Field */}
          <div className="md:col-span-2 flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-on-surface uppercase tracking-widest flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-on-surface-variant" /> Catatan Medis & Tindak Lanjut
            </label>
            <textarea 
              name="notes" 
              rows={4}
              defaultValue={initialData?.notes || ""}
              placeholder="Masukkan detail hasil pemeriksaan..."
              disabled={isPending}
              className="px-4 py-2.5 border border-outline-variant/70 rounded-lg bg-surface-container-lowest text-on-surface text-sm transition-all hover:border-outline focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:opacity-50 resize-none placeholder:text-outline-variant/70"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-error/5 text-error border border-error/20 p-3.5 rounded-lg text-sm font-medium flex items-center gap-3">
            <AlertCircle className="w-4.5 h-4.5 shrink-0" />
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/50">
          <Link href={cancelHref}>
            <Button variant="ghost" type="button" size="sm" disabled={isPending}>Batal</Button>
          </Link>
          <Button type="submit" size="sm" className="gap-2 px-6" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" /> {initialData ? 'Update Pemeriksaan' : 'Simpan Pemeriksaan'}
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};
