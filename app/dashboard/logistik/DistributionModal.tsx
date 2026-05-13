"use client";

import React, { useState } from "react";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Package, User, Hash, Loader2, Save } from "lucide-react";
import { createDistribution } from "./actions";
import { useToast } from "@/components/providers/toast-provider";

interface Logistic {
  id: string;
  name: string;
  stock: number;
  unit: string;
}

interface DistributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  logistics: Logistic[];
}

export const DistributionModal: React.FC<DistributionModalProps> = ({
  isOpen,
  onClose,
  logistics,
}) => {
  const toast = useToast();
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true);
    const result = await createDistribution(formData);
    setIsPending(false);

    if (result.error) {
      toast.error("Gagal", result.error);
    } else {
      toast.success("Berhasil", "Distribusi logistik telah berhasil dicatat.");
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Catat Distribusi Logistik">
      <form action={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
              <Package className="w-4 h-4 text-on-surface-variant" /> Barang Logistik
            </label>
            <select
              name="logisticId"
              required
              disabled={isPending}
              className="px-4 py-2 border rounded bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary transition-all border-outline-variant"
            >
              <option value="">Pilih Barang</option>
              {logistics.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} (Tersedia: {item.stock} {item.unit})
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
              <Hash className="w-4 h-4 text-on-surface-variant" /> Jumlah Keluar
            </label>
            <Input
              name="quantity"
              type="number"
              min={1}
              required
              placeholder="Jumlah barang yang dibagikan"
              disabled={isPending}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
              <User className="w-4 h-4 text-on-surface-variant" /> Penerima
            </label>
            <Input
              name="recipient"
              required
              placeholder="Contoh: Puskesmas Mawar atau Nama Korban"
              disabled={isPending}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
          <Button variant="ghost" type="button" onClick={onClose} disabled={isPending}>
            Batal
          </Button>
          <Button type="submit" className="gap-2 px-8" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Simpan Distribusi
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
