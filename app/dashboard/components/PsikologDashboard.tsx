import React from "react";
import { StatsCard } from "./StatsCard";
import { QuickActionLink } from "./QuickActionLink";
import {
  Calendar,
  Clock,
  CheckCircle2,
  ClipboardList,
  UserPlus,
  BookOpen,
} from "lucide-react";

export function PsikologDashboard({ stats }: any) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Jadwal Mendatang"
          value={stats?.unfinishedCounseling || 0}
          icon={<Calendar className="w-6 h-6" />}
          color="bg-primary-container text-on-primary-container"
          trend="Sesi Belum Selesai"
        />
        <StatsCard
          title="Rata-rata Durasi"
          value="52 Menit"
          icon={<Clock className="w-6 h-6" />}
          color="bg-secondary-container text-on-secondary-container"
          trend="Per Sesi Konseling"
        />
        <StatsCard
          title="Tingkat Kehadiran"
          value="94%"
          icon={<CheckCircle2 className="w-6 h-6" />}
          color="bg-tertiary-container text-on-tertiary-container"
          trend="Kumulatif Bulanan"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <QuickActionLink
              href="/dashboard/konseling"
              label="Lihat Agenda Konseling"
              icon={<ClipboardList className="w-4 h-4" />}
            />
            <QuickActionLink
              href="/dashboard/konseling/new"
              label="Atur Jadwal Baru"
              icon={<UserPlus className="w-4 h-4" />}
            />
            <QuickActionLink
              href="/dashboard/krisis"
              label="Eksplorasi Kasus Aktif"
              icon={<BookOpen className="w-4 h-4" />}
            />
          </div>
        </div>

        <div className="bg-secondary/5 rounded-2xl border border-secondary/20 p-6 h-fit flex flex-col justify-center">
          <h3 className="font-bold text-secondary flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-5 h-5" /> Catatan Profesional
          </h3>
          <p className="text-sm text-on-surface-variant leading-relaxed italic">
            "Pendampingan yang efektif dimulai dari empati dan kerahasiaan data
            yang terjaga. Pastikan setiap sesi dicatat dalam sistem untuk
            memantau progres pemulihan penyintas."
          </p>
        </div>
      </div>
    </div>
  );
}
