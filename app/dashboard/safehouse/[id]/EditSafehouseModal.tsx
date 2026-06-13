"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import {
  Save,
  Loader2,
  Shield,
  Home,
  MapPin,
  AlertCircle,
} from "lucide-react";
import { Modal } from "@/components/Modal";
import { updateSafeHouse } from "./actions";
import { useToast } from "@/components/providers/toast-provider";

interface EditSafehouseModalProps {
  isOpen: boolean;
  onClose: () => void;
  safeHouse: any;
}

export const EditSafehouseModal: React.FC<EditSafehouseModalProps> = ({
  isOpen,
  onClose,
  safeHouse,
}) => {
  const toast = useToast();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setError(null);
    const result = await updateSafeHouse(safeHouse.id, formData);
    if (result?.error) {
      setError(result.error);
      toast.error("Gagal Menyimpan", result.error);
      setIsPending(false);
    } else {
      toast.success("Berhasil", "Data Rumah Aman berhasil diperbarui.");
      setIsPending(false);
      onClose();
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Data Rumah Aman">
      <form action={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 flex items-center gap-2 text-primary border-b border-outline-variant pb-2">
            <Home className="w-4 h-4" />
            <h2 className="font-bold uppercase tracking-wider text-[10px]">
              Informasi Dasar
            </h2>
          </div>

          <Input
            label="Nama Lokasi"
            name="name"
            defaultValue={safeHouse.name}
            required
            disabled={isPending}
          />

          <Input
            label="Kapasitas Total (Bed)"
            name="capacity"
            type="number"
            defaultValue={safeHouse.capacity}
            required
            min={1}
            disabled={isPending}
          />

          <div className="md:col-span-2 flex items-center gap-2 text-primary border-b border-outline-variant pb-2 mt-2">
            <Shield className="w-4 h-4" />
            <h2 className="font-bold uppercase tracking-wider text-[10px]">
              Keamanan & Lokasi
            </h2>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-on-surface">
              Tingkat Keamanan
            </label>
            <select
              name="safetyLevel"
              required
              disabled={isPending}
              defaultValue={safeHouse.safetyLevel}
              className="px-4 py-2 border rounded bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all border-outline-variant"
            >
              <option value="RENDAH">Rendah</option>
              <option value="MEDIUM">Medium</option>
              <option value="TINGGI">Tinggi</option>
              <option value="SANGAT_TINGGI">Sangat Tinggi</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-on-surface">
              Alamat / Koordinat
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline-variant" />
              <input
                name="location"
                disabled={isPending}
                defaultValue={safeHouse.location}
                placeholder="Detail lokasi rahasia"
                className="w-full pl-10 px-4 py-2 border rounded bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all border-outline-variant"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-error-container text-on-error-container p-3 rounded-lg text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant">
          <Button
            variant="ghost"
            type="button"
            disabled={isPending}
            onClick={onClose}
          >
            Batal
          </Button>
          <Button type="submit" className="gap-2" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Simpan Perubahan
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
