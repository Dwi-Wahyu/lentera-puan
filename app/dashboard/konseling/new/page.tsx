"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import {
  ArrowLeft,
  Save,
  Calendar,
  Clock,
  User,
  ClipboardList,
  Stethoscope,
  Loader2,
  AlertCircle,
  Search,
  CheckCircle2,
  X,
} from "lucide-react";
import Link from "next/link";
import { createCounselingSession } from "./actions";
import { useToast } from "@/components/providers/toast-provider";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

interface Counselor {
  id: string;
  name: string | null;
  role: string;
}

interface CrisisShort {
  id: string;
  type: string;
  victimInitials: string;
}

interface PatientShort {
  id: string;
  name: string;
  nik: string;
  crisisReports: CrisisShort[];
}

export default function NewCounselingPage() {
  const { data: session } = useSession();
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isCounselor = session?.user?.role === "KONSELOR";

  const initialPatientId = searchParams.get("patientId");
  const initialReportId = searchParams.get("reportId");

  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [patients, setPatients] = useState<PatientShort[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [timeError, setTimeError] = useState<string | null>(null);

  // Search/Autocomplete State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<PatientShort | null>(
    null,
  );
  const [selectedReportId, setSelectedReportId] = useState<string | null>(
    initialReportId,
  );
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoadingData(true);
      try {
        const [usersRes, patientsRes] = await Promise.all([
          fetch("/api/users?role=counselor"),
          fetch("/api/patients"),
        ]);

        const usersData = await usersRes.json();
        const patientsData = await patientsRes.json();

        if (Array.isArray(usersData)) setCounselors(usersData);
        if (Array.isArray(patientsData)) {
          // Filter only patients with crisis reports
          const withCrisis = patientsData.filter(
            (p) => p.crisisReports && p.crisisReports.length > 0,
          );
          setPatients(withCrisis);

          // Scenario 1: Pre-fill if patientId is in URL
          if (initialPatientId) {
            const found = withCrisis.find((p) => p.id === initialPatientId);
            if (found) {
              setSelectedPatient(found);
              setSearchTerm(found.name);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
        toast.error(
          "Gagal Memuat Data",
          "Terjadi kesalahan saat mengambil data pendukung.",
        );
      } finally {
        setIsLoadingData(false);
      }
    }
    fetchData();
  }, [initialPatientId]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return [];
    // If exact match and selected, don't show dropdown
    if (selectedPatient && selectedPatient.name === searchTerm) return [];

    return patients
      .filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.nik.includes(searchTerm),
      )
      .slice(0, 10); // Limit to 10 results
  }, [searchTerm, patients, selectedPatient]);

  const validateTime = (time: string) => {
    const timeRegex =
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](?:\s*-\s*([0-1]?[0-9]|2[0-3]):[0-5][0-9])?$/;
    if (!timeRegex.test(time)) {
      return "Format waktu tidak valid (Contoh: 09:00 atau 09:00 - 10:00).";
    }
    return null;
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (!selectedPatient) {
      toast.error(
        "Input Tidak Lengkap",
        "Silakan pilih pasien terlebih dahulu.",
      );
      return;
    }

    if (!selectedReportId) {
      toast.error("Input Tidak Lengkap", "Silakan pilih konteks kasus.");
      return;
    }

    formData.set("patientId", selectedPatient.id);
    formData.set("reportId", selectedReportId);

    const timeValue = formData.get("time") as string;
    const error = validateTime(timeValue);

    if (error) {
      setTimeError(error);
      toast.error("Format Waktu Salah", error);
      return;
    }

    setTimeError(null);
    setIsPending(true);
    const result = await createCounselingSession(formData);

    if (result?.error) {
      toast.error("Gagal Penjadwalan", result.error);
      setIsPending(false);
    } else {
      toast.success(
        "Berhasil",
        "Sesi konseling baru telah berhasil dijadwalkan.",
      );
      router.push("/dashboard/konseling");
    }
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/konseling">
          <Button
            variant="ghost"
            size="sm"
            className="p-2 h-10 w-10 rounded-full border border-outline-variant"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Atur Sesi Baru</h1>
          <p className="text-on-surface-variant">
            Jadwalkan pendampingan psikologis atau medis.
          </p>
        </div>
      </div>

      <Card className="shadow-lg border-t-4 border-t-primary overflow-visible">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Patient & Case Context Selection */}
            <div className="md:col-span-2 flex items-center gap-2 text-primary border-b border-outline-variant pb-2">
              <User className="w-5 h-5" />
              <h2 className="font-bold uppercase tracking-wider text-sm">
                Peserta & Konteks Kasus
              </h2>
            </div>

            <div className="md:col-span-2 relative" ref={dropdownRef}>
              <label className="text-sm font-semibold text-on-surface flex items-center gap-2 mb-1.5">
                <Search className="w-4 h-4 text-on-surface-variant" /> Cari
                Pasien
              </label>
              <div className="relative">
                <Input
                  placeholder={
                    isLoadingData
                      ? "Memuat data pasien..."
                      : "Ketik Nama Pasien atau NIK..."
                  }
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowDropdown(true);
                    if (
                      selectedPatient &&
                      e.target.value !== selectedPatient.name
                    ) {
                      setSelectedPatient(null);
                      setSelectedReportId(null);
                    }
                  }}
                  onFocus={() => setShowDropdown(true)}
                  disabled={isPending || !!initialPatientId || isLoadingData}
                  leftIcon={
                    isLoadingData ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )
                  }
                  className={initialPatientId ? "bg-surface-container" : ""}
                />
                {selectedPatient && !initialPatientId && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPatient(null);
                      setSelectedReportId(null);
                      setSearchTerm("");
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-surface-container rounded-full text-on-surface-variant"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                {selectedPatient && (
                  <CheckCircle2
                    className={`absolute ${initialPatientId ? "right-3" : "right-10"} top-1/2 -translate-y-1/2 w-5 h-5 text-secondary`}
                  />
                )}
              </div>

              {showDropdown && filteredOptions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-2xl max-h-60 overflow-y-auto py-2 animate-in fade-in slide-in-from-top-2">
                  {filteredOptions.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className="w-full text-left px-4 py-3 hover:bg-surface-container-low flex flex-col transition-colors border-b border-outline-variant last:border-0"
                      onClick={() => {
                        setSelectedPatient(p);
                        setSearchTerm(p.name);
                        setShowDropdown(false);
                        if (p.crisisReports.length === 1) {
                          setSelectedReportId(p.crisisReports[0].id);
                        } else {
                          setSelectedReportId(null);
                        }
                      }}
                    >
                      <span className="font-bold text-on-surface">
                        {p.name}
                      </span>
                      <span className="text-[10px] text-on-surface-variant uppercase tracking-tighter">
                        NIK: {p.nik} • {p.crisisReports.length} Kasus Terdaftar
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {showDropdown &&
                searchTerm &&
                filteredOptions.length === 0 &&
                !selectedPatient &&
                !isLoadingData && (
                  <div className="absolute z-50 w-full mt-1 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg p-4 text-center">
                    <p className="text-sm text-on-surface-variant italic">
                      Pasien dengan laporan kasus tidak ditemukan.
                    </p>
                  </div>
                )}
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-on-surface flex items-center gap-2 mb-1.5">
                <ClipboardList className="w-4 h-4 text-on-surface-variant" />{" "}
                Konteks Laporan Kasus
              </label>
              <select
                className={`w-full px-4 py-2 border rounded bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all border-outline-variant ${
                  initialReportId || !selectedPatient
                    ? "bg-surface-container"
                    : ""
                }`}
                value={selectedReportId || ""}
                onChange={(e) => setSelectedReportId(e.target.value)}
                disabled={isPending || !selectedPatient || !!initialReportId}
                required
              >
                {!selectedPatient ? (
                  <option value="">Pilih Pasien Terlebih Dahulu</option>
                ) : (
                  <>
                    <option value="">Pilih Laporan Kasus</option>
                    {selectedPatient.crisisReports.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.type} - [{r.victimInitials}] (ID:{" "}
                        {r.id.slice(-6).toUpperCase()})
                      </option>
                    ))}
                  </>
                )}
              </select>
              <p className="text-[10px] text-on-surface-variant mt-1.5 italic">
                Sesi konseling harus dikaitkan dengan satu laporan kasus aktif
                untuk sinkronisasi data intervensi.
              </p>
            </div>

            {/* Scheduling Section */}
            <div className="md:col-span-2 flex items-center gap-2 text-primary border-b border-outline-variant pb-2 mt-4">
              <Calendar className="w-5 h-5" />
              <h2 className="font-bold uppercase tracking-wider text-sm">
                Detail Penjadwalan
              </h2>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
                <Calendar className="w-4 h-4 text-on-surface-variant" /> Tanggal
                Sesi
              </label>
              <input
                type="date"
                name="date"
                defaultValue={today}
                required
                disabled={isPending}
                className="px-4 py-2 border rounded bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all border-outline-variant"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
                <Clock className="w-4 h-4 text-on-surface-variant" /> Waktu /
                Jam
              </label>
              <input
                type="text"
                name="time"
                placeholder="Contoh: 09:00 atau 09:00 - 10:00"
                required
                disabled={isPending}
                onChange={() => setTimeError(null)}
                className={`px-4 py-2 border rounded bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:border-transparent transition-all border-outline-variant ${
                  timeError
                    ? "border-error ring-2 ring-error/20"
                    : "focus:ring-primary"
                }`}
              />
              {timeError && (
                <p className="text-[10px] text-error font-bold mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {timeError}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-on-surface-variant" />{" "}
                Pendamping / Konselor
              </label>
              <select
                name="counselorId"
                required
                disabled={isPending || isCounselor}
                value={isCounselor ? (session?.user?.id || "") : undefined}
                className="px-4 py-2 border rounded bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all border-outline-variant disabled:opacity-75"
              >
                {isCounselor ? (
                  <option value={session?.user?.id || ""}>
                    {session?.user?.name}
                  </option>
                ) : (
                  <>
                    <option value="">Pilih Pendamping</option>
                    {counselors.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.role})
                      </option>
                    ))}
                  </>
                )}
              </select>
              {isCounselor && (
                <input type="hidden" name="counselorId" value={session?.user?.id || ""} />
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-on-surface-variant" />{" "}
                Tipe Intervensi
              </label>
              <select
                name="type"
                required
                disabled={isPending}
                className="px-4 py-2 border rounded bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all border-outline-variant"
              >
                <option value="">Pilih Tipe</option>
                <option value="PSIKOLOGIS">Psikologis Klinis</option>
                <option value="MEDIS">Medis & KIA</option>
                <option value="SOSIAL">Intervensi Sosial</option>
                <option value="HUKUM">Pendampingan Hukum</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-outline-variant">
            <Link href="/dashboard/konseling">
              <Button variant="ghost" type="button" disabled={isPending}>
                Batal
              </Button>
            </Link>
            <Button
              type="submit"
              className="gap-2 px-8 h-12 font-bold shadow-lg shadow-primary/10"
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Jadwalkan Sesi
            </Button>
          </div>
        </form>
      </Card>

      <div className="bg-primary-container/10 p-6 rounded-xl border border-dashed border-primary/30">
        <h3 className="text-sm font-bold text-primary mb-2 flex items-center gap-2">
          Tips Penjadwalan
        </h3>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Pastikan waktu yang dipilih tidak bentrok dengan jadwal pendamping
          lainnya. Sesi yang telah dijadwalkan akan muncul di agenda harian
          dashboard masing-masing petugas.
        </p>
      </div>
    </div>
  );
}
