"use client";

import React, { useState } from "react";
import { Button } from "@/components/Button";
import { History, CheckCircle2, Loader2, Save, Stethoscope } from "lucide-react";
import {
  addInvestigationLog,
  validateCrisisCase,
  completeCrisisCase,
} from "./actions";
import { Modal } from "@/components/Modal";
import { AlertDialog } from "@/components/AlertDialog";
import { useToast } from "@/components/providers/toast-provider";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface CrisisActionsProps {
  reportId: string;
  patientId?: string | null;
  status: string;
}

export const CrisisActions: React.FC<CrisisActionsProps> = ({
  reportId,
  patientId,
  status,
}) => {
  const { data: session } = useSession();
  const toast = useToast();
  const [isModalLogOpen, setIsModalLogOpen] = useState(false);
  const [isAlertValidateOpen, setIsAlertValidateOpen] = useState(false);
  const [isAlertCompleteOpen, setIsAlertCompleteOpen] = useState(false);

  const [logNotes, setLogNotes] = useState("");
  const [isPending, setIsPending] = useState(false);

  const isDP3A = session?.user?.role === "DP3A";

  const handleUpdateLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logNotes) return;

    setIsPending(true);
    const res = await addInvestigationLog(
      reportId,
      "UPDATE_PROGRESS",
      logNotes,
    );
    setIsPending(false);

    if (res.success) {
      toast.success("Berhasil", "Log investigasi telah berhasil diperbarui.");
      setIsModalLogOpen(false);
      setLogNotes("");
    } else {
      toast.error(
        "Gagal",
        res.error || "Terjadi kesalahan saat menyimpan log.",
      );
    }
  };

  const handleConfirmValidate = async () => {
    setIsPending(true);
    const res = await validateCrisisCase(reportId);
    setIsPending(false);
    setIsAlertValidateOpen(false);

    if (res.success) {
      toast.success("Berhasil", "Kasus telah berhasil divalidasi.");
    } else {
      toast.error("Gagal", res.error || "Gagal memvalidasi kasus.");
    }
  };

  const handleConfirmComplete = async () => {
    setIsPending(true);
    const res = await completeCrisisCase(reportId);
    setIsPending(false);
    setIsAlertCompleteOpen(false);

    if (res.success) {
      toast.success(
        "Berhasil",
        "Kasus telah berhasil diselesaikan dan ditutup.",
      );
    } else {
      toast.error("Gagal", res.error || "Gagal menyelesaikan kasus.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {patientId && (
          <Link href={`/dashboard/konseling/new?patientId=${patientId}&reportId=${reportId}`}>
            <Button variant="outline" className="gap-2 text-primary border-primary/30 hover:bg-primary/5">
              <Stethoscope className="w-4 h-4" /> Buat Jadwal Konseling
            </Button>
          </Link>
        )}

        <Button
          variant="outline"
          className="gap-2"
          onClick={() => setIsModalLogOpen(true)}
        >
          <History className="w-4 h-4" /> Update Log
        </Button>

        {isDP3A && status === "BARU" && (
          <Button
            variant="primary"
            className="gap-2"
            onClick={() => setIsAlertValidateOpen(true)}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Validasi Kasus"
            )}
          </Button>
        )}

        {isDP3A && (status === "TERVALIDASI" ||
          status === "BARU" ||
          status === "INVESTIGASI") && (
          <Button
            variant="secondary"
            className="gap-2 bg-secondary text-on-secondary"
            onClick={() => setIsAlertCompleteOpen(true)}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            Selesaikan Kasus
          </Button>
        )}
      </div>

      {/* Modal Update Log */}
      <Modal
        isOpen={isModalLogOpen}
        onClose={() => setIsModalLogOpen(false)}
        title="Catat Progres Penanganan"
      >
        <form onSubmit={handleUpdateLog} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
              <History className="w-4 h-4 text-primary" /> Detail Tindakan /
              Koordinasi
            </label>
            <textarea
              className="w-full px-4 py-3 border rounded bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary border-outline-variant resize-none text-sm"
              rows={5}
              placeholder="Masukkan update tindakan, hasil koordinasi, atau kendala di lapangan..."
              value={logNotes}
              onChange={(e) => setLogNotes(e.target.value)}
              required
              disabled={isPending}
            ></textarea>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setIsModalLogOpen(false)}
              disabled={isPending}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="gap-2"
              disabled={isPending || !logNotes}
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Simpan Progres
            </Button>
          </div>
        </form>
      </Modal>

      {/* Alert Dialog Validate */}
      <AlertDialog
        isOpen={isAlertValidateOpen}
        onClose={() => setIsAlertValidateOpen(false)}
        onConfirm={handleConfirmValidate}
        title="Validasi Kasus"
        message="Apakah Anda yakin ingin memvalidasi kasus ini? Status kasus akan berubah menjadi TERVALIDASI and tercatat dalam log sistem."
        variant="primary"
        confirmLabel="Ya, Validasi"
        isLoading={isPending}
      />

      {/* Alert Dialog Complete */}
      <AlertDialog
        isOpen={isAlertCompleteOpen}
        onClose={() => setIsAlertCompleteOpen(false)}
        onConfirm={handleConfirmComplete}
        title="Selesaikan Kasus"
        message="Anda akan menutup kasus ini secara resmi. Pastikan semua tindakan intervensi telah selesai dilakukan."
        variant="secondary"
        confirmLabel="Selesaikan Sekarang"
        isLoading={isPending}
      />
    </div>
  );
};
