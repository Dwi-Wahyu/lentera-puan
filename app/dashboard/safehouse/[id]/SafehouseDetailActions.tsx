"use client";

import React, { useState } from "react";
import { Button } from "@/components/Button";
import {
  Lock,
  MoreVertical,
  ShieldCheck,
  ShieldAlert,
  Edit,
  Trash2,
} from "lucide-react";
import { Modal } from "@/components/Modal";
import { AlertDialog } from "@/components/AlertDialog";
import { deleteSafeHouse } from "./actions";
import { useToast } from "@/components/providers/toast-provider";
import { useRouter } from "next/navigation";
import { EditSafehouseModal } from "./EditSafehouseModal";
import { useSession } from "next-auth/react";

interface SafehouseDetailActionsProps {
  id: string;
  safeHouse: any;
}

export const SafehouseDetailActions: React.FC<SafehouseDetailActionsProps> = ({
  id,
  safeHouse,
}) => {
  const { data: session } = useSession();
  const toast = useToast();
  const router = useRouter();
  const [isProtocolOpen, setIsProtocolOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const isSuperAdmin = session?.user?.role === "SUPERADMIN";

  const handleDelete = async () => {
    setIsPending(true);
    const res = await deleteSafeHouse(id);
    setIsPending(false);
    setIsAlertOpen(false);

    if (res?.error) {
      toast.error("Gagal Menghapus", res.error);
    } else {
      toast.success("Berhasil", "Data Rumah Aman telah dihapus.");
      router.push("/dashboard/safehouse");
    }
  };

  return (
    <>
      <div className="flex gap-2 relative">
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => setIsProtocolOpen(true)}
        >
          <Lock className="w-4 h-4" /> Protokol Keamanan
        </Button>
        {isSuperAdmin && (
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <MoreVertical className="w-5 h-5" />
            </Button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl z-20 py-2 animate-in fade-in zoom-in-95">
                <button
                  className="w-full text-left px-4 py-2 text-sm hover:bg-surface-container-low transition-colors flex items-center gap-2"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsEditOpen(true);
                  }}
                >
                  <Edit className="w-4 h-4" /> Edit Lokasi
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm hover:bg-surface-container-low transition-colors text-error flex items-center gap-2"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsAlertOpen(true);
                  }}
                >
                  <Trash2 className="w-4 h-4" /> Hapus Lokasi
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Protocol Modal */}
      <Modal
        isOpen={isProtocolOpen}
        onClose={() => setIsProtocolOpen(false)}
        title="Protokol Keamanan Rumah Aman"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-3 p-4 bg-secondary-container/20 rounded-xl border border-secondary/20">
            <div>
              <p className="font-bold text-on-surface">Status Terverifikasi</p>
              <p className="text-xs text-on-surface-variant">
                Lokasi ini memenuhi standar keamanan nasional.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-sm text-primary uppercase tracking-wider">
              Langkah-langkah Keamanan:
            </h4>
            <ul className="space-y-3">
              {[
                "Kerahasiaan Lokasi: Jangan pernah membagikan koordinat kepada pihak luar non-petugas.",
                "Verifikasi Identitas: Selalu lakukan cek NIP/ID petugas sebelum memberikan akses masuk.",
                "Pencatatan Log: Setiap aktivitas check-in/out wajib dicatat dalam sistem secara real-time.",
                "Kontak Darurat: Pastikan nomor siaga Polsek terdekat tersimpan di perangkat operasional.",
              ].map((step, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-sm text-on-surface-variant"
                >
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0"></div>
                  {step}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-error-container/10 rounded-xl border border-dashed border-error/30 flex gap-3">
            <ShieldAlert className="w-5 h-5 text-error shrink-0" />
            <p className="text-xs text-error font-medium leading-relaxed">
              Pelanggaran protokol keamanan dapat membahayakan nyawa penyintas.
              Laporkan segera jika terdapat aktivitas mencurigakan di sekitar
              lokasi.
            </p>
          </div>

          <div className="pt-4 flex justify-end">
            <Button variant="primary" onClick={() => setIsProtocolOpen(false)}>
              Saya Mengerti
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <AlertDialog
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Rumah Aman"
        message="Apakah Anda yakin ingin menghapus lokasi perlindungan ini secara permanen? Data sejarah tetap tersimpan namun lokasi tidak lagi dapat digunakan."
        variant="error"
        confirmLabel="Ya, Hapus Lokasi"
        isLoading={isPending}
      />

      {/* Edit Modal */}
      <EditSafehouseModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        safeHouse={safeHouse}
      />
    </>
  );
};
