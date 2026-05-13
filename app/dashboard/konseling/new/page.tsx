"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { 
  ArrowLeft, 
  Save, 
  Calendar, 
  Clock, 
  User, 
  ClipboardList,
  Stethoscope,
  Loader2,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { createCounselingSession } from './actions';
import { useToast } from '@/components/providers/toast-provider';
import { useRouter } from 'next/navigation';

interface Counselor {
  id: string;
  name: string | null;
  role: string;
}

export default function NewCounselingPage() {
  const toast = useToast();
  const router = useRouter();
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [timeError, setTimeError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCounselors() {
      const res = await fetch('/api/users?role=counselor');
      const data = await res.json();
      setCounselors(data);
    }
    fetchCounselors();
  }, []);

  const validateTime = (time: string) => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](?:\s*-\s*([0-1]?[0-9]|2[0-3]):[0-5][0-9])?$/;
    if (!timeRegex.test(time)) {
      return "Format waktu tidak valid (Contoh: 09:00 atau 09:00 - 10:00).";
    }
    return null;
  };

  async function handleSubmit(formData: FormData) {
    const timeValue = formData.get("time") as string;
    const error = validateTime(timeValue);
    
    if (error) {
      setTimeError(error);
      toast.error('Format Waktu Salah', error);
      return;
    }

    setTimeError(null);
    setIsPending(true);
    const result = await createCounselingSession(formData);
    
    if (result?.error) {
      toast.error('Gagal Penjadwalan', result.error);
      setIsPending(false);
    } else {
      toast.success('Berhasil', 'Sesi konseling baru telah berhasil dijadwalkan.');
      router.push('/dashboard/konseling');
    }
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/konseling">
          <Button variant="ghost" size="sm" className="p-2 h-10 w-10 rounded-full border border-outline-variant">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Atur Sesi Baru</h1>
          <p className="text-on-surface-variant">Jadwalkan pendampingan psikologis atau medis.</p>
        </div>
      </div>

      <Card className="shadow-lg border-t-4 border-t-primary">
        <form action={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Header Section */}
            <div className="md:col-span-2 flex items-center gap-2 text-primary border-b border-outline-variant pb-2">
              <Calendar className="w-5 h-5" />
              <h2 className="font-bold uppercase tracking-wider text-sm">Detail Penjadwalan</h2>
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
                <Calendar className="w-4 h-4 text-on-surface-variant" /> Tanggal Sesi
              </label>
              <input 
                type="date" 
                name="date" 
                defaultValue={today}
                required 
                disabled={isPending}
                className="px-4 py-2 border rounded bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all border-outline-variant"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
                <Clock className="w-4 h-4 text-on-surface-variant" /> Waktu / Jam
              </label>
              <input 
                type="text" 
                name="time" 
                placeholder="Contoh: 09:00 atau 09:00 - 10:00"
                required 
                disabled={isPending}
                onChange={() => setTimeError(null)}
                className={`px-4 py-2 border rounded bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:border-transparent transition-all border-outline-variant ${
                  timeError ? 'border-error ring-2 ring-error/20' : 'focus:ring-primary'
                }`}
              />
              {timeError && (
                <p className="text-[10px] text-error font-bold mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {timeError}
                </p>
              )}
            </div>

            {/* Counselor & Patient Section */}
            <div className="md:col-span-2 flex items-center gap-2 text-primary border-b border-outline-variant pb-2 mt-4">
              <User className="w-5 h-5" />
              <h2 className="font-bold uppercase tracking-wider text-sm">Peserta & Tipe</h2>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-on-surface-variant" /> Pendamping / Konselor
              </label>
              <select 
                name="counselorId" 
                required 
                disabled={isPending}
                className="px-4 py-2 border rounded bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all border-outline-variant"
              >
                <option value="">Pilih Pendamping</option>
                {counselors.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} ({c.role})</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-on-surface-variant" /> Tipe Intervensi
              </label>
              <select 
                name="type" 
                required 
                disabled={isPending}
                className="px-4 py-2 border rounded bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all border-outline-variant"
              >
                <option value="">Pilih Tipe</option>
                <option value="PSIKOLOGIS">Psikologis Klinis</option>
                <option value="MEDIS">Medis & KIA</option>
                <option value="SOSIAL">Intervensi Sosial</option>
                <option value="HUKUM">Pendampingan Hukum</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <Input
                label="Inisial Pasien / ID Kasus (Opsional)"
                name="patientInitials"
                placeholder="Contoh: NY atau KRS-2026-001"
                disabled={isPending}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-outline-variant">
            <Link href="/dashboard/konseling">
              <Button variant="ghost" type="button" disabled={isPending}>Batal</Button>
            </Link>
            <Button type="submit" className="gap-2 px-8 h-12 font-bold shadow-lg shadow-primary/10" disabled={isPending}>
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Jadwalkan Sesi
            </Button>
          </div>
        </form>
      </Card>

      <div className="bg-primary-container/10 p-6 rounded-xl border border-dashed border-primary/30">
        <h3 className="text-sm font-bold text-primary mb-2 flex items-center gap-2">
          💡 Tips Penjadwalan
        </h3>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Pastikan waktu yang dipilih tidak bentrok dengan jadwal pendamping lainnya. Sesi yang telah dijadwalkan akan muncul di agenda harian dashboard masing-masing petugas.
        </p>
      </div>
    </div>
  );
}
