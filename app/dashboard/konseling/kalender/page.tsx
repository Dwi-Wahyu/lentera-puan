import React from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
} from "lucide-react";
import { api } from "@/lib/api";
import Link from "next/link";
import { formatEnum } from "@/lib/formatters";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function MonthlyCalendarPage() {
  const authSession = await getServerSession(authOptions);
  const isCounselor = authSession?.user?.role === "KONSELOR";

  let sessions = await api.getInterventions();
  if (isCounselor) {
    sessions = sessions.filter((s: any) => s.counselor?.id === authSession?.user?.id);
  }

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Helper to get days in month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const monthName = now.toLocaleString("id-ID", { month: "long" });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/konseling">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-on-surface">
              Kalender Konseling
            </h1>
            <p className="text-on-surface-variant">
              Jadwal pendampingan periode {monthName} {currentYear}.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <ChevronLeft className="w-4 h-4" /> Prev
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-1">
        {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
          <div
            key={day}
            className="text-center py-2 text-xs font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant"
          >
            {day}
          </div>
        ))}

        {/* Empty slots for start of month */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="min-h-[120px] bg-surface-container-low/30 border border-outline-variant/30"
          ></div>
        ))}

        {days.map((day: number) => {
          const dateStr = new Date(
            currentYear,
            currentMonth,
            day,
          ).toDateString();
          const daySessions = sessions.filter(
            (s: any) => new Date(s.date).toDateString() === dateStr,
          );

          return (
            <div
              key={day}
              className="min-h-[120px] bg-surface-container-lowest border border-outline-variant p-2 group hover:bg-surface-container transition-colors"
            >
              <div className="flex justify-between items-start">
                <span
                  className={`text-sm font-bold ${day === now.getDate() ? "w-7 h-7 bg-primary text-on-primary rounded-full flex items-center justify-center" : "text-on-surface"}`}
                >
                  {day}
                </span>
                {daySessions.length > 0 && (
                  <span className="text-[10px] font-bold text-primary px-1.5 py-0.5 bg-primary-container rounded">
                    {daySessions.length} Sesi
                  </span>
                )}
              </div>

              <div className="mt-2 space-y-1">
                {daySessions.slice(0, 3).map((session: any) => (
                  <Link
                    key={session.id}
                    href={`/dashboard/konseling/${session.id}`}
                  >
                    <div className="text-[10px] p-1 rounded bg-secondary-container/50 text-on-secondary-container truncate border border-secondary/10 hover:border-secondary transition-all cursor-pointer">
                      <span className="font-bold">
                        {session.time.split(" ")[0]}
                      </span>{" "}
                      {formatEnum(session.type)}
                    </div>
                  </Link>
                ))}
                {daySessions.length > 3 && (
                  <div className="text-[9px] text-center text-on-surface-variant font-bold italic pt-1">
                    +{daySessions.length - 3} lainnya
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Card
        title="Daftar Sesi Bulan Ini"
        subtitle="Klik pada sesi untuk melihat detail"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant">
                <th className="text-left py-3 text-sm font-bold text-on-surface">
                  Tanggal
                </th>
                <th className="text-left py-3 text-sm font-bold text-on-surface">
                  Waktu
                </th>
                <th className="text-left py-3 text-sm font-bold text-on-surface">
                  Pendamping
                </th>
                <th className="text-left py-3 text-sm font-bold text-on-surface">
                  Status
                </th>
                <th className="text-left py-3 text-sm font-bold text-on-surface">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {sessions.map((session: any) => (
                <tr
                  key={session.id}
                  className="hover:bg-surface-container-low transition-colors group text-sm"
                >
                  <td className="py-4 font-bold">
                    {new Date(session.date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                    })}
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-primary" />
                      {session.time}
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <User className="w-3 h-3 text-secondary" />
                      {session.counselor.name}
                    </div>
                  </td>
                  <td className="py-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        session.status === "SELESAI"
                          ? "bg-secondary-container text-on-secondary-container"
                          : "bg-primary-container text-on-primary-container"
                      }`}
                    >
                      {formatEnum(session.status)}
                    </span>
                  </td>
                  <td className="py-4">
                    <Link href={`/dashboard/konseling/${session.id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 px-2 h-7 text-xs"
                      >
                        Detail
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
