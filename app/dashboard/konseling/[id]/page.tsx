import React from "react";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import {
  ArrowLeft,
  Calendar,
  Clock,
  ClipboardList,
  CheckCircle2,
  BadgeCheck,
  Stethoscope,
  Printer,
  Share2,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SessionActions, SessionStatusButtons } from "./SessionActions";
import { formatEnum } from "@/lib/formatters";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SessionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const session = await prisma.interventionSession.findUnique({
    where: { id },
    include: { counselor: true },
  });

  if (!session) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
            <h1 className="text-2xl lg:text-3xl font-bold text-on-surface">
              Detail Sesi Konseling
            </h1>
            <p className="text-on-surface-variant flex items-center gap-2 text-sm font-medium">
              <Calendar className="w-4 h-4 text-primary" />
              {session.date.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-end md:self-auto">
          <Button variant="outline" size="sm" className="gap-2">
            <Printer className="w-4 h-4" /> Cetak
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="w-4 h-4" /> Bagikan
          </Button>
          <div className="h-8 w-px bg-outline-variant mx-1 hidden md:block"></div>
          <SessionActions sessionId={id} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Status Card (Left Column) */}
        <div className="md:col-span-4 space-y-6">
          <Card className="border-t-4 border-t-primary shadow-md">
            <div className="space-y-6 text-center">
              <div
                className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center shadow-inner ${
                  session.status === "SELESAI"
                    ? "bg-secondary-container text-secondary"
                    : "bg-primary-container text-white"
                }`}
              >
                {session.status === "SELESAI" ? (
                  <CheckCircle2 className="w-10 h-10" />
                ) : (
                  <Clock className="w-10 h-10" />
                )}
              </div>

              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">
                  Status Saat Ini
                </p>
                <h3 className="text-2xl font-black text-on-surface mt-1">
                  {formatEnum(session.status)}
                </h3>
              </div>

              <SessionStatusButtons sessionId={id} status={session.status} />
            </div>
          </Card>

          <Card
            title="Peringatan Keamanan"
            className="bg-error-container/5 border-dashed"
          >
            <p className="text-xs text-on-surface-variant leading-relaxed italic">
              Sesi ini mengandung data sensitif. Hanya personil terverifikasi
              yang diperbolehkan melihat detail kronologi dan hasil intervensi.
            </p>
          </Card>
        </div>

        {/* Info Card (Right Column) */}
        <div className="md:col-span-8 space-y-6">
          <Card title="Informasi Lengkap Sesi" className="shadow-md h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-surface-container rounded-xl text-primary">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                      Waktu Pelaksanaan
                    </label>
                    <p className="text-lg font-bold text-on-surface">
                      {session.time} WIB
                    </p>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Durasi standar 60 menit
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-surface-container rounded-xl text-secondary">
                    <ClipboardList className="w-6 h-6" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                      Tipe Intervensi
                    </label>
                    <p className="text-lg font-bold text-on-surface">
                      {formatEnum(session.type)}
                    </p>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Metoditas: Klinis Tatap Muka
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-primary text-on-primary p-6 rounded-2xl shadow-lg relative overflow-hidden group">
                <Stethoscope className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform duration-500" />
                <div className="relative z-10 space-y-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">
                      Pendamping / Konselor
                    </p>
                    <p className="text-xl font-black mt-1 leading-tight">
                      {session.counselor.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/10 w-fit">
                    <BadgeCheck className="w-4 h-4 text-secondary-fixed" />
                    <span className="text-xs font-bold uppercase">
                      {formatEnum(session.counselor.role)}
                    </span>
                  </div>
                  <p className="text-[10px] opacity-60">
                    ID Petugas: {session.counselor.id.slice(-8).toUpperCase()}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-outline-variant">
              <h4 className="text-sm font-bold text-primary mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Catatan Hasil & Observasi
              </h4>
              <div className="p-6 bg-surface-container-low rounded-2xl border border-outline-variant/50 min-h-[160px]">
                <p className="text-sm text-on-surface-variant italic">
                  Belum ada catatan medis yang diinput untuk sesi ini. Silakan
                  gunakan tombol &quot;Selesaikan Sesi&quot; untuk memasukkan
                  laporan hasil pendampingan.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
