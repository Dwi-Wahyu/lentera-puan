import React from "react";
import { api } from "@/lib/api";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import {
  ArrowLeft,
  User,
  AlertTriangle,
  Calendar,
  FileText,
  Shield,
  CheckCircle2,
  Clock,
  ExternalLink,
  Folder,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CrisisActions } from "./CrisisActions";
import { formatEnum } from "@/lib/formatters";
import Image from "next/image";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CrisisDetailPage({ params }: PageProps) {
  const { id } = await params;
  let report;
  
  try {
    report = await api.getCrisisReport(id);
  } catch (error) {
    notFound();
  }

  if (!report) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/krisis">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-on-surface">
              Detail Kasus {report.id.slice(-8).toUpperCase()}
            </h1>
            <p className="text-on-surface-variant flex items-center gap-2 text-sm font-medium">
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  report.priority === "TINGGI" ||
                  report.priority === "SANGAT_TINGGI"
                    ? "bg-error-container text-on-error-container"
                    : "bg-surface-container-high text-on-surface"
                }`}
              >
                Prioritas: {formatEnum(report.priority)}
              </span>
              <span>•</span>
              <span>Dilaporkan oleh: {report.reporter.name}</span>
            </p>
          </div>
        </div>
        <CrisisActions reportId={report.id} status={report.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status & Category Info */}
        <Card className="lg:col-span-1 border-t-4 border-t-primary">
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                  Status Terkini
                </p>
                <h3 className="text-2xl font-bold text-primary mt-1">
                  {formatEnum(report.status)}
                </h3>
              </div>
              <div
                className={`p-2 rounded-lg ${
                  report.status === "SELESAI"
                    ? "bg-secondary-container text-on-secondary-container"
                    : "bg-primary-container/10 text-primary"
                }`}
              >
                {report.status === "SELESAI" ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <Clock className="w-6 h-6" />
                )}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-outline-variant">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-error" />
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase">
                    Tipe Krisis
                  </p>
                  <p className="text-sm font-bold">{formatEnum(report.type)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase">
                    Tanggal Kejadian
                  </p>
                  <p className="text-sm font-bold">
                    {new Date(report.date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-secondary" />
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase">
                    Inisial Korban
                  </p>
                  <p className="text-sm font-bold">{report.victimInitials}</p>
                </div>
              </div>
            </div>

            {report.safeHouse && (
              <div className="mt-6 p-4 bg-secondary-container/10 rounded-xl border border-secondary/20">
                <p className="text-[10px] font-bold text-secondary uppercase tracking-widest flex items-center gap-2">
                  <Shield className="w-3 h-3" /> Lokasi Evakuasi
                </p>
                <p className="text-sm font-bold text-on-surface mt-1">
                  {report.safeHouse.name}
                </p>
                <Link
                  href={`/dashboard/safehouse/${report.safeHouseId}`}
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:underline mt-2"
                >
                  Lihat Detail Rumah Aman <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            )}
          </div>
        </Card>

        {/* Narrative & Description */}
        <Card title="Deskripsi & Kronologi" className="lg:col-span-2">
          <div className="flex gap-4 items-start">
            <div className="flex-1">
              <p className="text-on-surface leading-relaxed whitespace-pre-wrap">
                {report.description ||
                  "Tidak ada deskripsi detail untuk laporan ini."}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <h4 className="text-sm font-bold text-on-surface mb-4 flex items-center gap-2">
              <Folder className="w-4 h-4" />
              Bukti & Dokumentasi
            </h4>
            {report.evidences.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {report.evidences.map((ev: any) => (
                  <div
                    key={ev.id}
                    className="group relative aspect-square bg-surface-container rounded-lg border border-outline-variant overflow-hidden"
                  >
                    {ev.url && (ev.url.match(/\.(jpg|jpeg|png|webp|gif)$/i) || ev.type === 'IMAGE' || ev.type.startsWith('image/')) ? (
                      <>
                        <Image
                          src={`${BACKEND_URL}${ev.url}`}
                          alt="Bukti Krisis"
                          fill
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <a 
                            href={`${BACKEND_URL}${ev.url}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 bg-surface rounded-full text-on-surface"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-on-surface-variant">
                        <FileText className="w-8 h-8 opacity-20" />
                        <span className="text-[10px] font-bold uppercase">{formatEnum(ev.type)}</span>
                        <a 
                          href={`${BACKEND_URL}${ev.url}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[10px] text-primary hover:underline"
                        >
                          Buka File
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 border border-dashed border-outline-variant rounded-xl text-center text-xs text-on-surface-variant italic">
                Belum ada bukti yang dilampirkan.
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Investigation Logs */}
      <Card
        title="Investigation Log (Audit Trail)"
        subtitle="Catatan progres penanganan kasus oleh petugas"
      >
        <div className="space-y-4 mt-6">
          {report.logs.length > 0 ? (
            report.logs.map((log: any) => (
              <div
                key={log.id}
                className="flex gap-4 pl-4 border-l-2 border-primary-container relative"
              >
                <div className="absolute -left-1.5 top-0 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-surface"></div>
                <div className="pb-6">
                  <p className="text-xs font-bold text-primary uppercase">
                    {formatEnum(log.action)}
                  </p>
                  <p className="text-sm text-on-surface mt-1">{log.notes}</p>
                  <p className="text-[10px] text-on-surface-variant mt-2">
                    Penanggung Jawab • {new Date(log.createdAt).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-on-surface-variant italic">
              Belum ada log aktivitas untuk kasus ini.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
