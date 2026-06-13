import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { api } from "@/lib/api";
import { Card } from "@/components/Card";
import { 
  Users, 
  AlertTriangle, 
  Shield, 
  Activity,
  ArrowRight,
  TrendingUp,
  Clock
} from "lucide-react";
import Link from "next/link";
import { formatEnum } from "@/lib/formatters";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  let stats;

  try {
    stats = await api.getDashboardStats();
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
  }

  const user = session?.user;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-on-surface">Selamat Datang, {user?.name || "Petugas"}!</h1>
        <p className="text-on-surface-variant mt-1">Berikut adalah ringkasan operasional LENTERA PUAN hari ini.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Pasien" 
          value={stats?.totalPatients || 0} 
          icon={<Users className="w-6 h-6" />}
          color="bg-primary-container text-on-primary-container"
          trend="Penyintas Terdata"
        />
        <StatsCard 
          title="Krisis Aktif" 
          value={stats?.activeCrisis || 0} 
          icon={<AlertTriangle className="w-6 h-6" />}
          color="bg-error-container text-on-error-container"
          trend="Butuh Penanganan"
        />
        <StatsCard 
          title="Okupansi Safehouse" 
          value={`${stats?.safehouseOccupancy?.occupied || 0}/${stats?.safehouseOccupancy?.capacity || 0}`} 
          icon={<Shield className="w-6 h-6" />}
          color="bg-secondary-container text-on-secondary-container"
          trend={`${Math.round(stats?.safehouseOccupancy?.percentage || 0)}% Terpakai`}
        />
        <StatsCard 
          title="Aktivitas Sistem" 
          value={stats?.recentActivities?.length || 0} 
          icon={<Activity className="w-6 h-6" />}
          color="bg-surface-container-high text-on-surface"
          trend="Log Terakhir"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activities */}
        <Card title="Aktivitas Terbaru" className="lg:col-span-2">
          <div className="space-y-6 mt-4">
            {stats?.recentActivities && stats.recentActivities.length > 0 ? (
              stats.recentActivities.map((activity: any) => (
                <div key={activity.id} className="flex gap-4 items-start group">
                  <div className="p-2 rounded-full bg-surface-container-high group-hover:bg-primary-container transition-colors mt-1">
                    <Clock className="w-4 h-4 text-on-surface-variant group-hover:text-primary" />
                  </div>
                  <div className="flex-1 border-b border-outline-variant pb-4 last:border-0">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-bold text-on-surface">
                        {activity.userName} melakukan <span className="text-primary">{formatEnum(activity.action)}</span>
                      </p>
                      <span className="text-[10px] font-medium text-on-surface-variant uppercase bg-surface-container px-2 py-0.5 rounded">
                        {activity.resource}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-2">
                      {new Date(activity.createdAt).toLocaleString("id-ID", {
                        day: "numeric",
                        month: "long",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-on-surface-variant italic">
                Belum ada rekaman aktivitas terbaru.
              </div>
            )}
            <Link 
              href="/dashboard/settings" 
              className="flex items-center justify-center gap-2 text-sm font-bold text-primary hover:underline pt-2"
            >
              Lihat Semua Audit Log <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Card>

        {/* Quick Links / Actions */}
        <div className="space-y-6">
          <Card title="Aksi Cepat">
            <div className="space-y-3 mt-4">
              <QuickActionLink 
                href="/dashboard/krisis" 
                label="Input Laporan Krisis Baru" 
                icon={<AlertTriangle className="w-4 h-4" />} 
              />
              <QuickActionLink 
                href="/dashboard/safehouse" 
                label="Cek Ketersediaan Safehouse" 
                icon={<Shield className="w-4 h-4" />} 
              />
              <QuickActionLink 
                href="/dashboard/users" 
                label="Manajemen Petugas" 
                icon={<Users className="w-4 h-4" />} 
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon, color, trend }: any) {
  return (
    <Card className="overflow-hidden group hover:border-primary transition-all duration-300">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{title}</p>
          <h3 className="text-3xl font-bold text-on-surface group-hover:text-primary transition-colors">{value}</h3>
        </div>
        <div className={`p-3 rounded-2xl ${color}`}>
          {icon}
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-outline-variant flex items-center gap-2">
        <span className="text-xs font-medium text-on-surface-variant">{trend}</span>
      </div>
    </Card>
  );
}

function QuickActionLink({ href, label, icon }: any) {
  return (
    <Link 
      href={href} 
      className="flex items-center justify-between p-3 rounded-xl border border-outline-variant hover:border-primary hover:bg-primary-container/10 transition-all group"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-surface-container-high group-hover:text-primary transition-colors">
          {icon}
        </div>
        <span className="text-sm font-bold text-on-surface">{label}</span>
      </div>
      <ArrowRight className="w-4 h-4 text-on-surface-variant group-hover:translate-x-1 transition-transform" />
    </Link>
  );
}
