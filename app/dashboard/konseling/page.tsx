import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Calendar, Clock, User, ClipboardList, CheckCircle2, Circle, ChevronRight, Package } from 'lucide-react';
import { prisma } from "@/lib/prisma";
import Link from 'next/link';
import { DownloadCounselingRecapButton } from '@/components/DownloadCounselingRecapButton';
import { formatEnum } from '@/lib/formatters';

export default async function KonselingPage() {
  const sessions = await prisma.interventionSession.findMany({
    orderBy: { date: 'asc' },
    include: { counselor: true }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Jadwal Konseling</h1>
          <p className="text-sm text-on-surface-variant mt-0.5">Manajemen pendampingan psikologis dan intervensi.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/logistik/new">
            <Button variant="outline" size="sm" className="gap-2 border-secondary/50 text-secondary hover:bg-secondary/5">
              <Package className="w-3.5 h-3.5" /> Update Stok PMT
            </Button>
          </Link>
          <Link href="/dashboard/konseling/new">
            <Button variant="primary" size="sm" className="gap-2">
              <Calendar className="w-3.5 h-3.5" /> Atur Sesi Baru
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sessions List */}
        <Card className="lg:col-span-3" title="Agenda Mendatang" subtitle={new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}>
          <div className="space-y-3">
            {sessions.length > 0 ? sessions.map((session, i) => (
              <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border border-outline-variant/50 hover:border-primary/40 hover:bg-primary/2 transition-all group">
                <div className="flex flex-col md:flex-row gap-3 md:items-center">
                  <div className="flex items-center gap-2 text-primary bg-primary/8 px-3 py-1.5 rounded-lg w-fit border border-primary/15">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold">{session.time}</span>
                  </div>
                  <div className="hidden md:block h-6 w-px bg-outline-variant/50" />
                  <div>
                    <p className="font-semibold text-on-surface flex items-center gap-2 text-sm">
                      <User className="w-3.5 h-3.5 text-on-surface-variant" /> Sesi Pasien
                    </p>
                    <p className="text-[10px] text-on-surface-variant flex items-center gap-1.5 mt-0.5">
                      <ClipboardList className="w-3 h-3" /> {formatEnum(session.type)} • {session.counselor.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 mt-3 md:mt-0 border-t md:border-t-0 pt-3 md:pt-0">
                  <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                    session.status === 'SELESAI' 
                      ? 'bg-secondary/8 text-secondary border-secondary/20' 
                      : 'bg-primary/8 text-primary border-primary/20'
                  }`}>
                    {session.status === 'SELESAI' 
                      ? <CheckCircle2 className="w-3 h-3" /> 
                      : <Circle className="w-3 h-3" />
                    }
                    {formatEnum(session.status)}
                  </span>
                  <Link href={`/dashboard/konseling/${session.id}`}>
                    <Button variant="ghost" size="sm" className="group-hover:bg-primary group-hover:text-on-primary transition-all">Detail Sesi</Button>
                  </Link>
                </div>
              </div>
            )) : (
              <div className="py-14 text-center border border-dashed border-outline-variant/60 rounded-xl">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-outline-variant" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-on-surface-variant">Belum ada jadwal konseling</p>
                    <p className="text-xs text-outline-variant mt-0.5">Buat sesi konseling pertama Anda</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <Link href="/dashboard/konseling/kalender" className="block mt-5">
            <Button variant="outline" size="sm" className="w-full gap-2">
              Lihat Kalender Bulanan <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </Card>

        {/* Stats Sidebar */}
        <Card title="Statistik Sesi">
          <div className="space-y-5 mt-1">
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Total Terdaftar</p>
              <p className="text-4xl font-bold text-primary mt-1 leading-none">{sessions.length}</p>
            </div>
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/40">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Rata-rata Durasi</p>
                <div className="flex items-center gap-2 text-on-surface font-bold">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span className="text-lg">52 Menit</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/40">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Tingkat Kehadiran</p>
                <div className="flex items-center gap-2 text-on-surface font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-secondary" />
                  <span className="text-lg">94%</span>
                </div>
              </div>
            </div>
            <div className="h-px bg-outline-variant/40" />
            <DownloadCounselingRecapButton sessions={sessions} />
          </div>
        </Card>
      </div>
    </div>
  );
}
