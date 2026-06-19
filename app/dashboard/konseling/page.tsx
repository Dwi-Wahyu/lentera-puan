import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import {
  Calendar,
  Clock,
  User,
  ClipboardList,
  CheckCircle2,
  Circle,
  ChevronRight,
  Package,
} from "lucide-react";
import { api } from "@/lib/api";
import Link from "next/link";
import { DownloadCounselingRecapButton } from "@/components/DownloadCounselingRecapButton";
import { formatEnum } from "@/lib/formatters";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function KonselingPage() {
  const authSession = await getServerSession(authOptions);
  const isCounselor = authSession?.user?.role === "KONSELOR";

  let sessions = await api.getInterventions();
  if (isCounselor) {
    sessions = sessions.filter((session: any) => session.counselor?.id === authSession?.user?.id);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">
            Jadwal Konseling
          </h1>
          <p className="text-sm text-on-surface-variant mt-0.5">
            Manajemen pendampingan psikologis dan intervensi.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sessions List */}
        <Card
          className="lg:col-span-3"
          title="Agenda Mendatang"
          subtitle={new Date().toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        >
          <div className="space-y-3">
            {sessions.length > 0 ? (
              sessions.map((session: any, i: number) => (
                <div
                  key={i}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border border-outline-variant/50 hover:border-primary/40 hover:bg-primary/2 transition-all group"
                >
                  <div className="flex flex-col md:flex-row gap-3 md:items-center">
                    <div className="flex items-center gap-2 text-primary bg-primary/8 px-3 py-1.5 rounded-lg w-fit border border-primary/15">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold">{session.time}</span>
                    </div>
                    <div className="hidden md:block h-6 w-px bg-outline-variant/50" />
                    <div>
                      <p className="font-semibold text-on-surface flex items-center gap-2 text-sm">
                        <User className="w-3.5 h-3.5 text-on-surface-variant" />{" "}
                        Sesi Pasien
                      </p>
                      <p className="text-[10px] text-on-surface-variant flex items-center gap-1.5 mt-0.5">
                        <ClipboardList className="w-3 h-3" />{" "}
                        {formatEnum(session.type)} • {session.counselor.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 mt-3 md:mt-0 border-t md:border-t-0 pt-3 md:pt-0">
                    <span
                      className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                        session.status === "SELESAI"
                          ? "bg-secondary/8 text-secondary border-secondary/20"
                          : "bg-primary/8 text-primary border-primary/20"
                      }`}
                    >
                      {session.status === "SELESAI" ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <Circle className="w-3 h-3" />
                      )}
                      {formatEnum(session.status)}
                    </span>
                    <Link href={`/dashboard/konseling/${session.id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-primary cursor-pointer transition-all"
                      >
                        Detail Sesi
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-14 text-center border border-dashed border-outline-variant/60 rounded-xl">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-outline-variant" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-on-surface-variant">
                      Belum ada jadwal konseling
                    </p>
                    <p className="text-xs text-outline-variant mt-0.5">
                      Buat sesi konseling pertama Anda
                    </p>
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
        <Card title="Aksi Cepat">
          <div className="space-y-5 mt-1">
            <Link href="/dashboard/konseling/new" className="w-full">
              <Button variant="primary" className="w-full gap-2">
                <Calendar className="w-3.5 h-3.5" /> Atur Sesi Baru
              </Button>
            </Link>
            <div className="h-px bg-outline-variant/40" />
            <DownloadCounselingRecapButton sessions={sessions} />
          </div>
        </Card>
      </div>
    </div>
  );
}
