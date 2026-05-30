import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import {
  Baby,
  AlertCircle,
  ShieldCheck,
  Calendar,
  Eye,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatEnum } from "@/lib/formatters";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  // Fetch dynamic data from database
  const [
    patientCount,
    reportCount,
    sessionCount,
    recentReports,
    recentActivities,
    safehouses,
  ] = await Promise.all([
    prisma.patient.count(),
    prisma.crisisReport.count({ where: { status: "BARU" } }),
    prisma.interventionSession.count({ where: { date: { gte: new Date() } } }),
    prisma.crisisReport.findMany({
      take: 4,
      orderBy: { date: "desc" },
    }),
    prisma.medicalCheckup.findMany({
      take: 3,
      orderBy: { date: "desc" },
      include: { patient: true },
    }),
    prisma.safeHouse.findMany(),
  ]);

  // Calculate safehouse stats
  const totalCapacity = safehouses.reduce((acc, sh) => acc + sh.capacity, 0);
  const totalOccupied = safehouses.reduce((acc, sh) => acc + sh.occupied, 0);
  const availableBeds = totalCapacity - totalOccupied;
  const occupancyRate =
    totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;

  return (
    <div className="space-y-7">
      {/* Page Header */}
      <div className="flex justify-between items-end gap-4">
        <div>
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <h1 className="text-2xl font-bold text-on-surface">
            Selamat datang,{" "}
            <span className="text-primary">{session.user?.name}</span>
          </h1>
        </div>
        <div className="hidden md:block shrink-0">
          <Link href="/dashboard/konseling">
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar className="w-3.5 h-3.5" /> Lihat Jadwal
            </Button>
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KIA */}
        <Link href="/dashboard/kia" className="block group">
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden group-hover:-translate-y-0.5">
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent pointer-events-none" />
            <Baby className="absolute -right-4 -bottom-4 w-20 h-20 text-primary/6 group-hover:text-primary/10 transition-colors" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Baby className="w-4.5 h-4.5 text-primary" />
                </div>
                <span className="text-[9px] font-bold text-primary uppercase tracking-widest bg-primary/8 px-2 py-0.5 rounded-full border border-primary/15">
                  KIA
                </span>
              </div>
              <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Total Pasien
              </p>
              <p className="text-3xl font-bold text-primary mt-1 leading-none">
                {patientCount}
              </p>
              <div className="flex items-center gap-1 text-secondary mt-2">
                <ArrowUpRight className="w-3 h-3" />
                <span className="text-[10px] font-semibold">
                  Aktif terpantau
                </span>
              </div>
            </div>
          </div>
        </Link>

        {/* Krisis */}
        <Link href="/dashboard/krisis" className="block group">
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden group-hover:-translate-y-0.5">
            <div className="absolute inset-0 bg-gradient-to-br from-error/5 to-transparent pointer-events-none" />
            <AlertCircle className="absolute -right-4 -bottom-4 w-20 h-20 text-error/6 group-hover:text-error/10 transition-colors" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-error/10 flex items-center justify-center">
                  <AlertCircle className="w-4.5 h-4.5 text-error" />
                </div>
                {reportCount > 0 && (
                  <span className="text-[9px] font-bold text-error uppercase tracking-widest bg-error/8 px-2 py-0.5 rounded-full border border-error/15">
                    Baru
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Laporan Krisis
              </p>
              <p className="text-3xl font-bold text-error mt-1 leading-none">
                {reportCount}
              </p>
              <span className="text-[10px] text-error/70 font-semibold mt-2 block">
                Butuh Intervensi Segera
              </span>
            </div>
          </div>
        </Link>

        {/* Safehouse */}
        <Link href="/dashboard/safehouse" className="block group">
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden group-hover:-translate-y-0.5">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent pointer-events-none" />
            <ShieldCheck className="absolute -right-4 -bottom-4 w-20 h-20 text-secondary/6 group-hover:text-secondary/10 transition-colors" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <ShieldCheck className="w-4.5 h-4.5 text-secondary" />
                </div>
                <span className="text-[9px] font-bold text-secondary uppercase tracking-widest bg-secondary/8 px-2 py-0.5 rounded-full border border-secondary/15">
                  Rumah Aman
                </span>
              </div>
              <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Kapasitas
              </p>
              <p className="text-3xl font-bold text-secondary mt-1 leading-none">
                {occupancyRate}%
              </p>
              <span className="text-[10px] text-on-surface-variant font-semibold mt-2 block">
                {availableBeds} Bed Tersedia
              </span>
            </div>
          </div>
        </Link>

        {/* Konseling */}
        <Link href="/dashboard/konseling" className="block group">
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden group-hover:-translate-y-0.5">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-container/20 to-transparent pointer-events-none" />
            <Calendar className="absolute -right-4 -bottom-4 w-20 h-20 text-primary-container/15 group-hover:text-primary-container/25 transition-colors" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-primary-container/15 flex items-center justify-center">
                  <Calendar className="w-4.5 h-4.5 text-primary-container" />
                </div>
                <span className="text-[9px] font-bold text-primary-container uppercase tracking-widest bg-primary-container/10 px-2 py-0.5 rounded-full border border-primary-container/20">
                  Konseling
                </span>
              </div>
              <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Sesi Aktif
              </p>
              <p className="text-3xl font-bold text-primary-container mt-1 leading-none">
                {sessionCount}
              </p>
              <span className="text-[10px] text-on-surface-variant font-semibold mt-2 block">
                Dijadwalkan
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Crisis Reports */}
        <Card
          title="Laporan Krisis Terbaru"
          subtitle="Kasus yang memerlukan perhatian segera"
        >
          <div className="overflow-x-auto -mx-1">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline-variant/50">
                  <th className="text-left py-2.5 px-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                    ID Kasus
                  </th>
                  <th className="text-left py-2.5 px-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                    Status
                  </th>
                  <th className="text-left py-2.5 px-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                    Prioritas
                  </th>
                  <th className="text-left py-2.5 px-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {recentReports.length > 0 ? (
                  recentReports.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-surface-container-low/60 transition-colors group"
                    >
                      <td className="py-3 px-2 text-xs font-bold text-primary font-mono">
                        {item.id.slice(-8).toUpperCase()}
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                            item.status === "BARU"
                              ? "bg-error/10 text-error border border-error/20"
                              : "bg-surface-container text-on-surface-variant border border-outline-variant/50"
                          }`}
                        >
                          {formatEnum(item.status)}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={`text-xs font-bold ${
                            item.priority === "TINGGI" ||
                            item.priority === "SANGAT_TINGGI"
                              ? "text-error"
                              : "text-on-surface-variant"
                          }`}
                        >
                          {formatEnum(item.priority)}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <Link href={`/dashboard/krisis/${item.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1.5 group-hover:bg-primary group-hover:text-on-primary transition-all h-7 px-2"
                          >
                            <Eye className="w-3 h-3" /> Detail
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-10 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <AlertCircle className="w-8 h-8 text-outline-variant" />
                        <p className="text-sm text-on-surface-variant">
                          Belum ada laporan krisis
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Link href="/dashboard/krisis">
            <Button variant="outline" className="w-full mt-4 gap-2" size="sm">
              Lihat Semua Laporan <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </Card>

        {/* Recent KIA Activities */}
        <Card
          title="Aktivitas KIA Terkini"
          subtitle="Pemantauan kesehatan ibu dan anak"
        >
          <div className="space-y-3">
            {recentActivities.length > 0 ? (
              recentActivities.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border border-outline-variant/50 hover:border-primary/40 hover:bg-primary/2 transition-all group"
                >
                  <div className="flex gap-3 items-center min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all shrink-0">
                      <Baby className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-on-surface text-sm truncate">
                        {item.patient.name}
                      </span>
                      <span className="text-[10px] text-on-surface-variant truncate">
                        {item.notes || "Pemeriksaan rutin"}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1.5 shrink-0 ml-2">
                    <div>
                      <span className="text-xs font-semibold text-primary block">
                        {item.date.toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span
                        className={`text-[9px] font-bold uppercase tracking-widest ${
                          item.status === "PERLU_PERHATIAN"
                            ? "text-error"
                            : "text-secondary"
                        }`}
                      >
                        {formatEnum(item.status)}
                      </span>
                    </div>
                    <Link
                      href={`/dashboard/kia/${item.patientId}/checkup/${item.id}`}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 px-2 h-6 text-[9px] gap-1"
                      >
                        <Eye className="w-3 h-3" /> Detail
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-10 text-center border border-dashed border-outline-variant/60 rounded-xl">
                <div className="flex flex-col items-center gap-2">
                  <Baby className="w-8 h-8 text-outline-variant" />
                  <p className="text-sm text-on-surface-variant">
                    Belum ada aktivitas KIA terbaru
                  </p>
                </div>
              </div>
            )}
          </div>
          <Link href="/dashboard/kia">
            <Button variant="outline" className="w-full mt-4 gap-2" size="sm">
              Manajemen Pasien KIA <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
