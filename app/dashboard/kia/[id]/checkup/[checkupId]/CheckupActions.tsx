"use client";

import React, { useState } from 'react';
import { Button } from '@/components/Button';
import { Trash2, Edit } from 'lucide-react';
import { deleteCheckup } from './actions';
import { useToast } from '@/components/providers/toast-provider';
import Link from 'next/link';
import { AlertDialog } from '@/components/AlertDialog';

interface CheckupActionsProps {
  patientId: string;
  checkupId: string;
}

export const CheckupActions: React.FC<CheckupActionsProps> = ({ patientId, checkupId }) => {
  const toast = useToast();
  const [isPending, setIsPending] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleDelete = async () => {
    setIsPending(true);
    const res = await deleteCheckup(patientId, checkupId);
    setIsPending(false);
    
    if (res?.error) {
      toast.error('Gagal', res.error);
      setIsAlertOpen(false);
    } else {
      toast.success('Berhasil', 'Data pemeriksaan telah berhasil dihapus.');
    }
  };

  return (
    <div className="flex gap-2">
      <Link href={`/dashboard/kia/${patientId}/checkup/${checkupId}/edit`}>
        <Button variant="outline" className="gap-2">
          <Edit className="w-4 h-4" /> Edit Record
        </Button>
      </Link>
      <Button 
        variant="error" 
        className="gap-2" 
        onClick={() => setIsAlertOpen(true)}
        disabled={isPending}
      >
        <Trash2 className="w-4 h-4" /> Hapus
      </Button>

      <AlertDialog 
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Pemeriksaan"
        message="Apakah Anda yakin ingin menghapus data pemeriksaan ini secara permanen? Statistik pasien akan diperbarui otomatis."
        variant="error"
        confirmLabel="Ya, Hapus"
        isLoading={isPending}
      />
    </div>
  );
};
