"use client";

import React, { useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { 
  Bell, 
  Settings2, 
  ShieldCheck, 
  History, 
  Lock, 
  Save, 
  RefreshCw,
  Info,
  Loader2,
  Building2,
  MapPin
} from 'lucide-react';
import { useToast } from '@/components/providers/toast-provider';
import { Modal } from '@/components/Modal';
import { AlertDialog } from '@/components/AlertDialog';
import { updateSystemConfig, toggleMaintenanceMode, resetSecurityKeys } from './actions';
import Link from 'next/link';

interface SystemConfig {
  agencyName: string;
  region: string;
  maintenanceMode: boolean;
}

interface SettingsClientProps {
  initialConfig: SystemConfig | null;
}

export default function SettingsClient({ initialConfig }: SettingsClientProps) {
  const toast = useToast();
  const [isPending, setIsPending] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isAlertResetOpen, setIsAlertResetOpen] = useState(false);

  const handleSaveAll = async () => {
    setIsPending(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsPending(false);
    toast.success('Pengaturan Disimpan', 'Semua konfigurasi sistem telah berhasil diperbarui.');
  };

  const handleResetKunci = async () => {
    setIsPending(true);
    const result = await resetSecurityKeys();
    setIsPending(false);
    setIsAlertResetOpen(false);

    if (result.success) {
      toast.error('Keamanan Diperbarui', 'Kunci enkripsi E2E telah direset.');
    } else {
      toast.error('Gagal', result.error || 'Gagal mereset kunci.');
    }
  };

  const handleToggleMaintenance = async () => {
    setIsPending(true);
    const result = await toggleMaintenanceMode(!!initialConfig?.maintenanceMode);
    setIsPending(false);

    if (result.error) {
      toast.error('Gagal', result.error);
    } else {
      toast.info(
        'Mode Pemeliharaan', 
        `Sistem sekarang berada dalam mode ${result.newState ? 'PEMELIHARAAN' : 'NORMAL'}.`
      );
    }
  };

  const handleConfigSubmit = async (formData: FormData) => {
    setIsPending(true);
    const result = await updateSystemConfig(formData);
    setIsPending(false);

    if (result.error) {
      toast.error('Gagal Memperbarui', result.error);
    } else {
      toast.success('Berhasil', 'Konfigurasi unit kerja telah diperbarui.');
      setIsConfigModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Pengaturan Sistem</h1>
          <p className="text-on-surface-variant">Konfigurasi global dan preferensi aplikasi.</p>
        </div>
        <Button variant="primary" className="gap-2" onClick={handleSaveAll} disabled={isPending}>
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Simpan Semua
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card title="Preferensi Notifikasi">
          <div className="space-y-4 mt-2">
            {[
              { label: 'Notifikasi Email Laporan Baru', checked: true, icon: Bell },
              { label: 'Alert Krisis via SMS', checked: true, icon: Bell },
              { label: 'Reminder Sesi Konseling', checked: false, icon: Bell },
              { label: 'Update Stok Logistik', checked: true, icon: Bell },
            ].map((pref, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-surface-container rounded-lg text-primary group-hover:bg-primary group-hover:text-on-primary transition-all">
                    <pref.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">{pref.label}</span>
                </div>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked={pref.checked} />
                  <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-4" onClick={() => toast.info('Info', 'Preferensi notifikasi telah dikembalikan ke default.')}>Reset ke Default</Button>
          </div>
        </Card>

        <Card title="Konfigurasi Unit Kerja">
          <div className="space-y-6 mt-2">
            <div className="flex gap-4">
              <div className="p-3 bg-primary-container text-on-primary-container rounded-xl h-fit">
                <Settings2 className="w-6 h-6" />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Nama Instansi Utama</label>
                  <p className="font-bold text-primary">{initialConfig?.agencyName || "-"}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Wilayah Operasional</label>
                  <p className="font-medium text-on-surface">{initialConfig?.region || "-"}</p>
                </div>
              </div>
            </div>
            <hr className="border-outline-variant" />
            
            {/* Direct Maintenance Toggle */}
            <div 
              className={`flex justify-between items-center p-3 rounded-lg border transition-all cursor-pointer ${
                initialConfig?.maintenanceMode ? 'bg-error-container/10 border-error/20' : 'bg-secondary-container/10 border-secondary/20'
              }`}
              onClick={handleToggleMaintenance}
            >
              <div className="flex items-center gap-2">
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                ) : (
                  <Info className={`w-4 h-4 ${initialConfig?.maintenanceMode ? 'text-error' : 'text-secondary'}`} />
                )}
                <span className={`text-sm font-medium ${initialConfig?.maintenanceMode ? 'text-error' : 'text-secondary'}`}>Mode Pemeliharaan</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-bold uppercase tracking-widest ${initialConfig?.maintenanceMode ? 'text-error' : 'text-secondary'}`}>
                  {initialConfig?.maintenanceMode ? 'AKTIF' : 'NON-AKTIF'}
                </span>
                <div className="relative inline-flex items-center">
                  <div className={`w-11 h-6 rounded-full transition-colors ${initialConfig?.maintenanceMode ? 'bg-error' : 'bg-surface-container-highest'}`}>
                    <div className={`absolute top-[2px] left-[2px] bg-white w-5 h-5 rounded-full transition-transform duration-200 shadow-sm ${initialConfig?.maintenanceMode ? 'translate-x-5' : 'translate-x-0'}`}></div>
                  </div>
                </div>
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={() => setIsConfigModalOpen(true)}>Edit Konfigurasi</Button>
          </div>
        </Card>

        <Card title="Keamanan Lanjutan">
          <div className="space-y-4 mt-2">
            <Link href="/dashboard/settings/logs">
              <div className="flex justify-between items-center p-3 hover:bg-surface-container rounded-lg transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <History className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors" />
                  <div>
                    <p className="text-sm font-bold">Audit Trail</p>
                    <p className="text-xs text-on-surface-variant">Catat semua aktivitas sensitif</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Lihat Log</Button>
              </div>
            </Link>
            <div className="flex justify-between items-center p-3 bg-surface-container rounded-lg">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-secondary" />
                <div>
                  <p className="text-sm font-bold">Enkripsi E2E</p>
                  <p className="text-xs text-on-surface-variant">Status: Terproteksi</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-secondary-container text-on-secondary-container rounded-full text-[10px] font-bold uppercase">
                <ShieldCheck className="w-3 h-3" /> AKTIF
              </div>
            </div>
            <Button variant="error" className="w-full mt-2 gap-2" onClick={() => setIsAlertResetOpen(true)} disabled={isPending}>
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />} Reset Kunci Keamanan
            </Button>
          </div>
        </Card>
      </div>

      {/* Config Edit Modal */}
      <Modal 
        isOpen={isConfigModalOpen} 
        onClose={() => setIsConfigModalOpen(false)} 
        title="Edit Konfigurasi Unit Kerja"
      >
        <form action={handleConfigSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
                <Building2 className="w-4 h-4 text-on-surface-variant" /> Nama Instansi Utama
              </label>
              <Input
                name="agencyName"
                defaultValue={initialConfig?.agencyName}
                required
                disabled={isPending}
                placeholder="Masukkan nama instansi resmi"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
                <MapPin className="w-4 h-4 text-on-surface-variant" /> Wilayah Operasional
              </label>
              <Input
                name="region"
                defaultValue={initialConfig?.region}
                required
                disabled={isPending}
                placeholder="Contoh: Provinsi DKI Jakarta"
              />
            </div>

            <div className="p-4 bg-primary/5 rounded-xl border border-dashed border-primary/20">
              <p className="text-xs text-on-surface-variant italic leading-relaxed">
                Pengaturan **Mode Pemeliharaan** kini dapat diakses langsung melalui panel Konfigurasi Unit Kerja di halaman utama Pengaturan untuk respon yang lebih cepat.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
            <Button variant="ghost" type="button" onClick={() => setIsConfigModalOpen(false)} disabled={isPending}>
              Batal
            </Button>
            <Button type="submit" className="gap-2 px-8" disabled={isPending}>
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Simpan Konfigurasi
            </Button>
          </div>
        </form>
      </Modal>

      {/* Security Reset Alert */}
      <AlertDialog 
        isOpen={isAlertResetOpen}
        onClose={() => setIsAlertResetOpen(false)}
        onConfirm={handleResetKunci}
        title="Reset Kunci Keamanan"
        message="Apakah Anda yakin ingin mereset kunci enkripsi sistem? Ini akan memutuskan semua sesi aktif dan mewajibkan login ulang untuk semua personil."
        variant="error"
        confirmLabel="Ya, Reset Kunci"
        isLoading={isPending}
      />
    </div>
  );
}
