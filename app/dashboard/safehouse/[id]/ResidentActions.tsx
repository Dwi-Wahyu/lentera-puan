"use client";

import React, { useState } from "react";
import { Button } from "@/components/Button";
import { LogOut, Loader2 } from "lucide-react";
import { checkOutResident } from "./actions";
import { useToast } from "@/components/providers/toast-provider";
import { AlertDialog } from "@/components/AlertDialog";

interface ResidentActionsProps {
  safeHouseId: string;
  reportId: string;
}

export const ResidentActions: React.FC<ResidentActionsProps> = ({
  safeHouseId,
  reportId,
}) => {
  const toast = useToast();
  const [isPending, setIsPending] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleCheckOut = async () => {
    setIsPending(true);
    const res = await checkOutResident(safeHouseId, reportId);
    setIsPending(false);
    setIsAlertOpen(false);

    if (res?.error) {
      toast.error("Gagal Check-out", res.error);
    } else {
      toast.success("Berhasil", "Penghuni telah check-out.");
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="gap-2 text-error hover:bg-error/10"
        disabled={isPending}
        onClick={() => setIsAlertOpen(true)}
      >
        <LogOut className="w-4 h-4" />
        Check-out
      </Button>

      <AlertDialog
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={handleCheckOut}
        title="Check-out Penghuni"
        message="Apakah Anda yakin ingin melakukan check-out untuk penghuni ini? Status perlindungan akan ditandai sebagai selesai."
        variant="secondary"
        confirmLabel="Ya, Check-out"
        isLoading={isPending}
      />
    </>
  );
};
