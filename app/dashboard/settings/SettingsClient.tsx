"use client";

import React, { useState } from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import {
  Settings2,
  ShieldCheck,
  History,
  Lock,
  Save,
  Loader2,
  Building2,
  MapPin,
} from "lucide-react";
import { useToast } from "@/components/providers/toast-provider";
import { Modal } from "@/components/Modal";
import {
  updateSystemConfig,
  toggleMaintenanceMode,
} from "./actions";
import Link from "next/link";

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

  const handleToggleMaintenance = async () => {
    setIsPending(true);
    const result = await toggleMaintenanceMode(
      !!initialConfig?.maintenanceMode,
    );
    setIsPending(false);

    if (result.error) {
      toast.error("Gagal", result.error);
    } else {
      toast.info(
        "Mode Pemeliharaan",
        `Sistem sekarang berada dalam mode ${result.newState ? "PEMELIHARAAN" : "NORMAL"}.`,
      );
    }
  };

  const handleConfigSubmit = async (formData: FormData) => {
    setIsPending(true);
    const result = await updateSystemConfig(formData);
    setIsPending(false);

    if (result.error) {
      toast.error("Gagal Memperbarui", result.error);
    } else {
      toast.success("Berhasil", "Konfigurasi unit kerja telah diperbarui.");
      setIsConfigModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-on-surface">
            Pengaturan Sistem
          </h1>
          <p className="text-on-surface-variant">
            Konfigurasi global dan preferensi aplikasi.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card title="Konfigurasi Unit Kerja">
          <div className="space-y-6 mt-2">
            <div className="flex gap-4">
              <div className="p-3 bg-primary-container text-on-primary-container rounded-xl h-fit">
                <Settings2 className="w-6 h-6" />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    Nama Instansi Utama
                  </label>
                  <p className="font-bold text-primary">
                    {initialConfig?.agencyName || "-"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    Wilayah Operasional
                  </label>
                  <p className="font-medium text-on-surface">
                    {initialConfig?.region || "-"}
                  </p>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsConfigModalOpen(true)}
            >
              Edit Konfigurasi
            </Button>
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
                    <p className="text-xs text-on-surface-variant">
                      Catat semua aktivitas sensitif
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Lihat Log
                </Button>
              </div>
            </Link>
            <div className="flex justify-between items-center p-3 bg-surface-container rounded-lg">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-secondary" />
                <div>
                  <p className="text-sm font-bold">Autentikasi & Sesi</p>
                  <p className="text-xs text-on-surface-variant">
                    Status: Terproteksi JWT
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-secondary-container text-on-secondary-container rounded-full text-[10px] font-bold uppercase">
                <ShieldCheck className="w-3 h-3" /> AKTIF
              </div>
            </div>
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
                <Building2 className="w-4 h-4 text-on-surface-variant" /> Nama
                Instansi Utama
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
                <MapPin className="w-4 h-4 text-on-surface-variant" /> Wilayah
                Operasional
              </label>
              <Input
                name="region"
                defaultValue={initialConfig?.region}
                required
                disabled={isPending}
                placeholder="Contoh: Provinsi DKI Jakarta"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setIsConfigModalOpen(false)}
              disabled={isPending}
            >
              Batal
            </Button>
            <Button type="submit" className="gap-2 px-8" disabled={isPending}>
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}{" "}
              Simpan Konfigurasi
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
