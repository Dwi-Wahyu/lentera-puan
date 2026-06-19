"use client";

import React, { useState } from "react";
import { Button } from "@/components/Button";
import { Eye, Edit, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { deleteCrisisReport } from "./actions";
import { useToast } from "@/components/providers/toast-provider";
import { AlertDialog } from "@/components/AlertDialog";
import { useSession } from "next-auth/react";

interface CrisisRowActionsProps {
  reportId: string;
}

export const CrisisRowActions: React.FC<CrisisRowActionsProps> = ({
  reportId,
}) => {
  const { data: session } = useSession();
  const toast = useToast();
  const [isPending, setIsPending] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const canEditOrDelete = session?.user?.role === "ADMIN" || session?.user?.role === "DP3A";

  const handleDelete = async () => {
    setIsPending(true);
    const res = await deleteCrisisReport(reportId);
    setIsPending(false);
    setIsAlertOpen(false);

    if (res.error) {
      toast.error("Gagal", res.error);
    } else {
      toast.success("Berhasil", "Laporan krisis telah dihapus dari sistem.");
    }
  };

  return (
    <div className="flex gap-2">
      <Link href={`/dashboard/krisis/${reportId}`}>
        <Button
          variant="ghost"
          size="sm"
          className="px-2 gap-1 group-hover:bg-primary hover:text-primary cursor-pointer group-hover:text-on-primary transition-all"
        >
          <Eye className="w-3 h-3" /> Detail
        </Button>
      </Link>
      {canEditOrDelete && (
        <>
          <Link href={`/dashboard/krisis/${reportId}/edit`}>
            <Button
              variant="ghost"
              size="sm"
              className="px-2 gap-1 text-secondary group-hover:bg-secondary-container transition-all"
            >
              <Edit className="w-3 h-3" /> Edit
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="px-2 gap-1 text-error hover:bg-error-container transition-all"
            onClick={() => setIsAlertOpen(true)}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Trash2 className="w-3 h-3" />
            )}{" "}
            Hapus
          </Button>
        </>
      )}

      <AlertDialog
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Laporan"
        message="Apakah Anda yakin ingin menghapus laporan krisis ini? Data akan dihapus secara permanen dan statistik sistem akan diperbarui."
        variant="error"
        confirmLabel="Ya, Hapus Laporan"
        isLoading={isPending}
      />
    </div>
  );
};
