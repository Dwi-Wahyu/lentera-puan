import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { 
  Baby, 
  AlertCircle, 
  ShieldCheck, 
  Calendar, 
  Eye, 
  ArrowUpRight,
  ChevronRight
} from 'lucide-react';
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
    safehouses
  ] = await Promise.all([
    prisma.patient.count(),
    prisma.crisisReport.count({ where: { status: 'BARU' } }),
    prisma.interventionSession.count({ where: { date: { gte: new Date() } } }),
    prisma.crisisReport.findMany({
      take: 4,
      orderBy: { date: 'desc' },
    }),
    prisma.medicalCheckup.findMany({
      take: 3,
      orderBy: { date: 'desc' },
      include: { patient: true },
    }),
    prisma.safeHouse.findMany()
  ]);

  // Calculate safehouse stats
  const totalCapacity = safehouses.reduce((acc, sh) => acc + sh.capacity, 0);
  const totalOccupied = safehouses.reduce((acc, sh) => acc + sh.occupied, 0);
  const availableBeds = totalCapacity - totalOccupied;
  const occupancyRate = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Selamat Datang, {session.user?.name?.split(' ')[0]}</h1>
          <p className="text-on-surface-variant">Berikut adalah ringkasan sistem hari ini, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}.</p>
        </div>
        <div className="hidden md:block">
          <Link href="/dashboard/konseling">
            <Button variant="outline" className="gap-2">
              <Calendar className="w-4 h-4" /> Lihat Jadwal Lengkap
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/dashboard/kia" className="block group">
          <Card className="border-l-4 border-l-primary relative overflow-hidden group-hover:border-primary transition-all">
            <Baby className="absolute -right-4 -bottom-4 w-24 h-24 text-primary/5 group-hover:text-primary/10 transition-colors" />
            <div className="flex flex-col relative z-10">
              <span className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Total Pasien KIA</span>
              <span className="text-3xl font-bold text-primary mt-1">{patientCount}</span>
              <div className="flex items-center gap-1 text-secondary mt-2">
                <ArrowUpRight className="w-3 h-3" />
                <span className="text-xs font-semibold">Aktif terpantau</span>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/dashboard/krisis" className="block group">
          <Card className="border-l-4 border-l-error relative overflow-hidden group-hover:border-error transition-all">
            <AlertCircle className="absolute -right-4 -bottom-4 w-24 h-24 text-error/5 group-hover:text-error/10 transition-colors" />
            <div className="flex flex-col relative z-10">
              <span className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Laporan Krisis Baru</span>
              <span className="text-3xl font-bold text-error mt-1">{reportCount}</span>
              <span className="text-xs text-error font-semibold mt-2">Butuh Intervensi Segera</span>
            </div>
          </Card>
        </Link>

        <Link href="/dashboard/safehouse" className="block group">
          <Card className="border-l-4 border-l-secondary relative overflow-hidden group-hover:border-secondary transition-all">
            <ShieldCheck className="absolute -right-4 -bottom-4 w-24 h-24 text-secondary/5 group-hover:text-secondary/10 transition-colors" />
            <div className="flex flex-col relative z-10">
              <span className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Kapasitas Rumah Aman</span>
              <span className="text-3xl font-bold text-secondary mt-1">{occupancyRate}%</span>
              <span className="text-xs text-on-surface-variant font-semibold mt-2">{availableBeds} Bed Tersedia</span>
            </div>
          </Card>
        </Link>

        <Link href="/dashboard/konseling" className="block group">
          <Card className="border-l-4 border-l-primary-container relative overflow-hidden group-hover:border-primary-container transition-all">
            <Calendar className="absolute -right-4 -bottom-4 w-24 h-24 text-primary-container/5 group-hover:text-primary-container/10 transition-colors" />
            <div className="flex flex-col relative z-10">
              <span className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Sesi Konseling Aktif</span>
              <span className="text-3xl font-bold text-primary-container mt-1">{sessionCount}</span>
              <span className="text-xs text-on-surface-variant font-semibold mt-2">Dijadwalkan</span>
            </div>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Laporan Krisis Terbaru" subtitle="Daftar kasus yang memerlukan perhatian Anda">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline-variant">
                  <th className="text-left py-3 text-sm font-bold text-on-surface">ID Kasus</th>
                  <th className="text-left py-3 text-sm font-bold text-on-surface">Status</th>
                  <th className="text-left py-3 text-sm font-bold text-on-surface">Prioritas</th>
                  <th className="text-left py-3 text-sm font-bold text-on-surface">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {recentReports.length > 0 ? recentReports.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-container-low transition-colors group">
                    <td className="py-4 text-sm font-medium">{item.id.slice(-8).toUpperCase()}</td>
                    <td className="py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        item.status === 'BARU' ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-high text-on-surface'
                      }`}>
                        {formatEnum(item.status)}
                      </span>
                    </td>
                    <td className="py-4 text-sm">
                      <span className={`font-bold ${
                        item.priority === 'TINGGI' || item.priority === 'SANGAT_TINGGI' ? 'text-error' : 'text-on-surface'
                      }`}>
                        {formatEnum(item.priority)}
                      </span>
                    </td>
                    <td className="py-4 text-sm">
                      <Link href={`/dashboard/krisis/${item.id}`}>
                        <Button variant="ghost" size="sm" className="gap-1 px-2 group-hover:bg-primary group-hover:text-on-primary transition-all">
                          <Eye className="w-3 h-3" /> Detail
                        </Button>
                      </Link>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-on-surface-variant italic">Belum ada laporan krisis.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Link href="/dashboard/krisis">
            <Button variant="outline" className="w-full mt-4 gap-2">
              Lihat Semua Laporan <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </Card>

        <Card title="Aktivitas KIA Terkini" subtitle="Pemantauan kesehatan ibu dan anak">
          <div className="space-y-4">
            {recentActivities.length > 0 ? recentActivities.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-outline-variant hover:border-primary transition-all group">
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all">
                    <Baby className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-on-surface">{item.patient.name}</span>
                    <span className="text-xs text-on-surface-variant">{item.notes || 'Pemeriksaan rutin'}</span>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <div>
                    <span className="text-sm font-semibold text-primary block">{item.date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${
                      item.status === 'PERLU_PERHATIAN' ? 'text-error' : 'text-secondary'
                    }`}>{formatEnum(item.status)}</span>
                  </div>
                  <Link href={`/dashboard/kia/${item.patientId}/checkup/${item.id}`}>
                    <Button variant="ghost" size="sm" className="p-1 px-2 h-7 text-[10px] gap-1">
                      <Eye className="w-3 h-3" /> Detail
                    </Button>
                  </Link>
                </div>
              </div>
            )) : (
              <div className="py-8 text-center text-on-surface-variant italic border border-dashed border-outline-variant rounded-lg">
                Belum ada aktivitas KIA terbaru.
              </div>
            )}
          </div>
          <Link href="/dashboard/kia">
            <Button variant="outline" className="w-full mt-4 gap-2">
              Manajemen Pasien KIA <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
