import React from "react";
import { StatsCard } from "./StatsCard";
import { QuickActionLink } from "./QuickActionLink";
import {
  Users,
  Activity,
  Shield,
  Settings,
  Database,
  Lock,
} from "lucide-react";

export function SuperAdminDashboard({ stats }: any) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total User Sistem"
          value={stats?.totalUsers || 0}
          icon={<Users className="w-6 h-6" />}
          color="bg-primary/10 text-primary"
          trend="Semua Role Petugas"
          label="SISTEM"
          variant="primary"
        />
        <StatsCard
          title="User Aktif Hari Ini"
          value={stats?.dailyUserActivities || 0}
          icon={<Activity className="w-6 h-6" />}
          color="bg-secondary/10 text-secondary"
          trend="Aktivitas Unik"
          label="AKTIVITAS"
          variant="secondary"
        />
        <StatsCard
          title="Okupansi Safehouse"
          value={`${stats?.safehouseOccupancy?.occupied || 0}/${stats?.safehouseOccupancy?.capacity || 0}`}
          icon={<Shield className="w-6 h-6" />}
          color="bg-tertiary/10 text-tertiary"
          trend={`${Math.round(stats?.safehouseOccupancy?.percentage || 0)}% Terpakai`}
          label="RUMAH AMAN"
          variant="tertiary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <QuickActionLink
              href="/dashboard/users"
              label="Manajemen Akun Petugas"
              icon={<Users className="w-4 h-4" />}
            />
            <QuickActionLink
              href="/dashboard/settings"
              label="Konfigurasi Sistem & Audit Log"
              icon={<Settings className="w-4 h-4" />}
            />
            <QuickActionLink
              href="/dashboard/safehouse"
              label="Manajemen Lokasi Safehouse"
              icon={<Database className="w-4 h-4" />}
            />
          </div>
        </div>

        <div className="p-6 h-fit bg-surface-container-low rounded-2xl border border-outline-variant/50">
          <div className="flex items-center gap-3 text-primary mb-4">
            <Lock className="w-5 h-5" />
            <h3 className="font-bold">Status Keamanan Sistem</h3>
          </div>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Seluruh endpoint API saat ini berjalan normal dengan autentikasi JWT
            aktif. Pastikan untuk rutin memeriksa Audit Log untuk mendeteksi
            anomali akses.
          </p>
        </div>
      </div>
    </div>
  );
}
