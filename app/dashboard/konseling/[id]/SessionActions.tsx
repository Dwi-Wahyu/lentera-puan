"use client";

import React, { useState } from 'react';
import { Button } from '@/components/Button';
import { CheckCircle2, XCircle, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { updateSessionStatus, deleteSession } from './actions';
import { AlertDialog } from '@/components/AlertDialog';
import { useToast } from '@/components/providers/toast-provider';

interface SessionActionsProps {
  sessionId: string;
  status: string;
}

export const SessionActions: React.FC<{ sessionId: string }> = ({ sessionId }) => {
  const toast = useToast();
  const [isAlertDeleteOpen, setIsAlertDeleteOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleDelete = async () => {
    setIsPending(true);
    const res = await deleteSession(sessionId);
    setIsPending(false);
    
    if (res?.error) {
      toast.error('Gagal', res.error);
      setIsAlertDeleteOpen(false);
    } else {
      toast.success('Berhasil', 'Jadwal sesi telah dihapus dari sistem.');
    }
  };

  return (
    <>
      <Button 
        variant="ghost" 
        className="gap-2 text-error hover:bg-error-container h-10"
        onClick={() => setIsAlertDeleteOpen(true)}
        disabled={isPending}
      >
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        <span className="hidden sm:inline">Hapus Jadwal</span>
      </Button>

      <AlertDialog 
        isOpen={isAlertDeleteOpen}
        onClose={() => setIsAlertDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Jadwal Sesi"
        message="Apakah Anda yakin ingin menghapus jadwal sesi ini secara permanen? Data sejarah sesi akan hilang sepenuhnya."
        variant="error"
        confirmLabel="Ya, Hapus Permanen"
        isLoading={isPending}
      />
    </>
  );
};

export const SessionStatusButtons: React.FC<SessionActionsProps> = ({ sessionId, status }) => {
  const toast = useToast();
  const [isAlertCompleteOpen, setIsAlertCompleteOpen] = useState(false);
  const [isAlertCancelOpen, setIsAlertCancelOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleStatusUpdate = async (newStatus: string) => {
    setIsPending(true);
    const res = await updateSessionStatus(sessionId, newStatus);
    setIsPending(false);
    
    if (res.success) {
      toast.success('Berhasil', `Status sesi telah diperbarui menjadi ${newStatus}.`);
      setIsAlertCompleteOpen(false);
      setIsAlertCancelOpen(false);
    } else {
      toast.error('Gagal', res.error || 'Gagal memperbarui status sesi.');
    }
  };

  return (
    <div className="pt-6 border-t border-outline-variant space-y-4">
      {status === 'MENDATANG' && (
        <Button 
          className="w-full gap-2 h-12 text-sm font-bold shadow-lg shadow-primary/20"
          onClick={() => setIsAlertCompleteOpen(true)}
          disabled={isPending}
        >
          <CheckCircle2 className="w-5 h-5" /> Selesaikan Sesi
        </Button>
      )}
      
      {status !== 'BATAL' && (
        <Button 
          variant="outline" 
          className="w-full gap-2 h-12 text-sm font-bold border-error text-error hover:bg-error-container"
          onClick={() => setIsAlertCancelOpen(true)}
          disabled={isPending}
        >
          <XCircle className="w-5 h-5" /> Batalkan Sesi
        </Button>
      )}

      {status === 'BATAL' && (
        <div className="flex items-center gap-2 p-3 bg-error-container/10 rounded-xl border border-error/20 text-error">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <p className="text-[10px] font-bold uppercase leading-tight">Sesi ini telah dibatalkan</p>
        </div>
      )}

      <AlertDialog 
        isOpen={isAlertCompleteOpen}
        onClose={() => setIsAlertCompleteOpen(false)}
        onConfirm={() => handleStatusUpdate("SELESAI")}
        title="Selesaikan Sesi"
        message="Konfirmasi penyelesaian sesi pendampingan. Pastikan catatan observasi telah siap."
        variant="secondary"
        confirmLabel="Selesaikan Sesi"
        isLoading={isPending}
      />

      <AlertDialog 
        isOpen={isAlertCancelOpen}
        onClose={() => setIsAlertCancelOpen(false)}
        onConfirm={() => handleStatusUpdate("BATAL")}
        title="Batalkan Sesi"
        message="Tandai sesi ini sebagai batal? Alasan pembatalan sebaiknya dicatat dalam log internal."
        variant="error"
        confirmLabel="Ya, Batalkan Sesi"
        isLoading={isPending}
      />
    </div>
  );
}
