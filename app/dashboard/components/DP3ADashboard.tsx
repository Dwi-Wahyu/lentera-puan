import React from "react";
import { StatsCard } from "./StatsCard";
import { QuickActionLink } from "./QuickActionLink";
import {
  Users,
  AlertTriangle,
  PlusCircle,
  ClipboardList,
  HeartPulse,
  UserCheck,
} from "lucide-react";

export function DP3ADashboard({ stats }: any) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Pasien"
          value={stats?.totalPatients || 0}
          icon={<Users className="w-6 h-6" />}
          color="bg-primary-container text-on-primary-container"
          trend="Penyintas Terdaftar"
        />
        <StatsCard
          title="Krisis Aktif"
          value={stats?.activeCrisis || 0}
          icon={<AlertTriangle className="w-6 h-6" />}
          color="bg-error-container text-on-error-container"
          trend="Butuh Penanganan"
        />
        <StatsCard
          title="Penempatan Baru"
          value={stats?.newPlacements || 0}
          icon={<UserCheck className="w-6 h-6" />}
          color="bg-secondary-container text-on-secondary-container"
          trend="Minggu Ini"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <QuickActionLink
              href="/dashboard/krisis"
              label="Input Laporan Krisis Baru"
              icon={<PlusCircle className="w-4 h-4" />}
            />
            <QuickActionLink
              href="/dashboard/kia"
              label="Manajemen Data Pasien (KIA)"
              icon={<HeartPulse className="w-4 h-4" />}
            />
            <QuickActionLink
              href="/dashboard/konseling/new"
              label="Jadwalkan Konseling"
              icon={<ClipboardList className="w-4 h-4" />}
            />
          </div>
        </div>

        <div className="bg-primary/5 rounded-2xl h-fit border border-primary/20 p-6">
          <h3 className="font-bold text-primary flex items-center gap-2 mb-3">
            <ClipboardList className="w-5 h-5" /> Rekomendasi Tindakan
          </h3>
          <ul className="space-y-3">
            <li className="text-sm text-on-surface-variant flex gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              Validasi 3 laporan krisis baru yang masuk hari ini.
            </li>
            <li className="text-sm text-on-surface-variant flex gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              Periksa ketersediaan safehouse untuk rujukan pasien.
            </li>
            <li className="text-sm text-on-surface-variant flex gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              Lakukan sinkronisasi data KIA dengan laporan investigasi.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
