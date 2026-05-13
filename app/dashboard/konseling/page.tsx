import React from 'react';
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Jadwal Konseling</h1>
          <p className="text-on-surface-variant">Manajemen pendampingan psikologis dan intervensi.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/logistik/new">
            <Button variant="outline" className="gap-2 border-secondary text-secondary hover:bg-secondary-container text-xs lg:text-sm">
              <Package className="w-4 h-4" /> Update Stok PMT
            </Button>
          </Link>
          <Link href="/dashboard/konseling/new">
            <Button variant="primary" className="gap-2 text-xs lg:text-sm">
              <Calendar className="w-4 h-4" /> Atur Sesi Baru
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3" title="Agenda Mendatang" subtitle={new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}>
          <div className="space-y-4">
            {sessions.length > 0 ? sessions.map((session, i) => (
              <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border border-outline-variant hover:border-primary transition-all group bg-surface-container-lowest">
                <div className="flex flex-col md:flex-row gap-4 md:items-center">
                  <div className="flex items-center gap-2 text-primary bg-primary/5 px-3 py-1.5 rounded-lg w-fit">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-bold">{session.time}</span>
                  </div>
                  <div className="h-8 w-px bg-outline-variant hidden md:block"></div>
                  <div>
                    <p className="font-bold text-on-surface flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-on-surface-variant" /> Sesi Pasien
                    </p>
                    <p className="text-[10px] text-on-surface-variant flex items-center gap-1.5 mt-1">
                      <ClipboardList className="w-3.5 h-3.5" /> {formatEnum(session.type)} • {session.counselor.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-4 md:mt-0 border-t md:border-t-0 pt-3 md:pt-0">
                  <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase px-3 py-1 rounded-full ${
                    session.status === 'SELESAI' ? 'bg-secondary-container text-on-secondary-container' : 'bg-primary-container text-on-primary-container'
                  }`}>
                    {session.status === 'SELESAI' ? <CheckCircle2 className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
                    {formatEnum(session.status)}
                  </span>
                  <Link href={`/dashboard/konseling/${session.id}`}>
                    <Button variant="ghost" size="sm" className="group-hover:bg-primary group-hover:text-on-primary transition-all text-xs">Detail Sesi</Button>
                  </Link>
                </div>
              </div>
            )) : (
              <div className="py-12 text-center text-on-surface-variant italic border border-dashed border-outline-variant rounded-xl">
                Belum ada jadwal konseling terdaftar.
              </div>
            )}
          </div>
          <Link href="/dashboard/konseling/kalender" className="block mt-6">
            <Button variant="outline" className="w-full gap-2">
              Lihat Kalender Bulanan <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </Card>

        <Card title="Statistik Sesi">
          <div className="space-y-6 mt-2">
            <div className="p-4 bg-primary-container/10 rounded-xl border border-primary-container/20">
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total Terdaftar</p>
              <p className="text-4xl font-bold text-primary mt-1">{sessions.length}</p>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Rata-rata Durasi</p>
                <div className="flex items-center gap-2 mt-1 text-on-surface font-bold">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-xl">52 Menit</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Tingkat Kehadiran</p>
                <div className="flex items-center gap-2 mt-1 text-on-surface font-bold">
                  <CheckCircle2 className="w-4 h-4 text-secondary" />
                  <span className="text-xl">94%</span>
                </div>
              </div>
            </div>
            <hr className="border-outline-variant" />
            <DownloadCounselingRecapButton sessions={sessions} />
          </div>
        </Card>
      </div>
    </div>
  );
}
