"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Search, Loader2, UserPlus, ShieldCheck, User } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/components/providers/toast-provider";
import { checkInResident } from "./actions";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/Skeleton";

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  safeHouseId: string;
}

const PatientSkeleton = () => (
  <div className="space-y-2">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="flex items-center justify-between p-3 rounded-xl border border-outline-variant"
      >
        <div className="flex items-center gap-3">
          <Skeleton className="w-8 h-8 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="h-8 w-16 rounded-lg" />
      </div>
    ))}
  </div>
);

export const CheckInModal: React.FC<CheckInModalProps> = ({
  isOpen,
  onClose,
  safeHouseId,
}) => {
  const toast = useToast();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const fetchPatients = async () => {
    setIsLoading(true);
    try {
      const data = await api.getPatients({ name: search });
      setPatients(data);
    } catch (error) {
      console.error("Gagal mengambil data pasien:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchPatients();
    }
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPatients();
  };

  const handleCheckIn = async (patientId: string) => {
    setIsPending(true);
    const res = await checkInResident(safeHouseId, patientId);
    setIsPending(false);
    
    if (res?.error) {
      toast.error("Gagal Check-in", res.error);
    } else {
      toast.success("Berhasil", "Pasien telah masuk ke Rumah Aman.");
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Check-in Penghuni Baru">
      <div className="space-y-6">
        <form onSubmit={handleSearch}>
          <Input
            placeholder="Cari Nama Pasien atau NIK..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </form>

        <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
          {isLoading ? (
            <PatientSkeleton />
          ) : patients.length > 0 ? (
            patients.map((patient) => (
              <div
                key={patient.id}
                className="flex items-center justify-between p-3 rounded-xl border border-outline-variant hover:bg-surface-container-low transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-surface-container-high">
                    <User className="w-4 h-4 text-on-surface-variant" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">{patient.name}</p>
                    <p className="text-[10px] text-on-surface-variant">NIK: {patient.nik}</p>
                  </div>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  disabled={isPending}
                  onClick={() => handleCheckIn(patient.id)}
                >
                  Pilih
                </Button>
              </div>
            ))
          ) : (
            <div className="py-8 text-center space-y-4">
              <p className="text-sm text-on-surface-variant italic">Pasien tidak ditemukan.</p>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => {
                  const backUrl = encodeURIComponent(`/dashboard/safehouse/${safeHouseId}`);
                  router.push(`/dashboard/kia/new?backUrl=${backUrl}`);
                }}
              >
                <UserPlus className="w-4 h-4" /> Daftarkan Pasien Baru
              </Button>
            </div>
          )}
        </div>

        <div className="p-4 bg-secondary-container/10 rounded-xl border border-dashed border-secondary/30 flex gap-3">
          <ShieldCheck className="w-5 h-5 text-secondary shrink-0" />
          <p className="text-[10px] text-on-surface-variant leading-relaxed">
            Hanya pasien yang sudah terdaftar di database sistem yang dapat melakukan check-in. Pastikan identitas pasien sudah sesuai.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
          <Button variant="ghost" onClick={onClose} disabled={isPending}>
            Batal
          </Button>
        </div>
      </div>
    </Modal>
  );
};
