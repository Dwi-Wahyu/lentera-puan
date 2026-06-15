import React from 'react';
import { api } from "@/lib/api";
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { 
  ArrowLeft, 
  History, 
  User, 
  Activity, 
  Clock,
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatEnum } from '@/lib/formatters';
import { LogFilters } from './components/LogFilters';

export const dynamic = "force-dynamic";

export default async function AuditLogPage({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<{ page?: string; search?: string; action?: string; limit?: string }>;
}) {
  const searchParams = await searchParamsPromise;
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  const currentPage = parseInt(searchParams.page || "1");
  const limit = parseInt(searchParams.limit || "20");
  const search = searchParams.search || "";
  const action = searchParams.action || "";
  const skip = (currentPage - 1) * limit;

  let logs = [];
  let total = 0;
  try {
    const response = await api.getAuditLogs({ skip, limit, search, action });
    logs = response.logs || [];
    total = response.total || 0;
  } catch (error) {
    console.error("Failed to fetch audit logs:", error);
  }

  const totalPages = Math.ceil(total / limit);

  const getPageLink = (page: number) => {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", page.toString());
    if (search) params.set("search", search);
    if (action) params.set("action", action);
    if (limit !== 20) params.set("limit", limit.toString());
    const query = params.toString();
    return `/dashboard/settings/logs${query ? `?${query}` : ""}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/settings">
          <Button variant="ghost" size="sm" className="p-2 h-10 w-10 rounded-full border border-outline-variant">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Audit Trail</h1>
          <p className="text-on-surface-variant flex items-center gap-2">
            <History className="w-4 h-4 text-primary" />
            Rekam jejak aktivitas sensitif dan administratif.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-primary-container/20 border-primary/20">
          <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Total Aktivitas</p>
          <p className="text-3xl font-black text-primary mt-1">{total}</p>
        </Card>
        <Card className="md:col-span-3 flex items-center gap-4">
          <div className="p-3 bg-secondary-container/20 rounded-xl">
             <ShieldCheck className="w-6 h-6 text-secondary" />
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Sistem mencatat setiap perubahan konfigurasi, reset keamanan, dan aktivitas administratif lainnya untuk menjamin akuntabilitas data krisis.
          </p>
        </Card>
      </div>

      <Card>
        <LogFilters />

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant">
                <th className="text-left py-3 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Waktu</th>
                <th className="text-left py-3 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Personil</th>
                <th className="text-left py-3 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Aktivitas</th>
                <th className="text-left py-3 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Detail Perubahan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {logs.length > 0 ? logs.map((log: any) => (
                <tr key={log.id} className="hover:bg-surface-container-low transition-colors group">
                  <td className="py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                       <span className="text-sm font-bold text-on-surface">
                         {new Date(log.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                       </span>
                       <span className="text-[10px] text-on-surface-variant flex items-center gap-1">
                         <Clock className="w-3 h-3" /> {new Date(log.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                       </span>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                       <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center">
                         <User className="w-4 h-4 text-on-surface-variant" />
                       </div>
                       <div className="flex flex-col">
                         <span className="text-sm font-bold">{log.user?.name || 'Sistem'}</span>
                         <span className="text-[10px] font-bold text-primary uppercase">{formatEnum(log.user?.role || 'SYSTEM')}</span>
                       </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                       <div className={`p-1.5 rounded-lg ${
                         log.action.includes('RESET') ? 'bg-error-container/20 text-error' : 
                         log.action.includes('TOGGLE') ? 'bg-secondary-container/20 text-secondary' : 'bg-primary-container/20 text-primary'
                       }`}>
                         <Activity className="w-3.5 h-3.5" />
                       </div>
                       <span className="text-xs font-bold uppercase tracking-wider">{formatEnum(log.action)}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <p className="text-xs text-on-surface-variant leading-relaxed max-w-md italic">
                      {log.details || "-"}
                    </p>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-on-surface-variant italic">
                    <div className="flex flex-col items-center gap-2">
                       <History className="w-8 h-8 opacity-20" />
                       <p>Belum ada rekaman audit trail tersedia.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between border-t border-outline-variant pt-6">
            <p className="text-xs text-on-surface-variant">
              Menampilkan <span className="font-bold text-on-surface">{skip + 1}</span> - <span className="font-bold text-on-surface">{Math.min(skip + limit, total)}</span> dari <span className="font-bold text-on-surface">{total}</span> aktivitas
            </p>
            <div className="flex items-center gap-2">
              <Link
                href={getPageLink(currentPage - 1)}
                className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
              >
                <Button variant="outline" size="sm" disabled={currentPage <= 1}>
                  <ChevronLeft className="w-4 h-4" /> Sebelumnya
                </Button>
              </Link>
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  ) {
                    return (
                      <Link
                        key={pageNum}
                        href={getPageLink(pageNum)}
                      >
                        <Button
                          variant={currentPage === pageNum ? 'primary' : 'ghost'}
                          size="sm"
                          className="w-8 h-8 p-0"
                        >
                          {pageNum}
                        </Button>
                      </Link>
                    );
                  } else if (
                    pageNum === currentPage - 2 ||
                    pageNum === currentPage + 2
                  ) {
                    return <span key={pageNum} className="text-on-surface-variant px-1">...</span>;
                  }
                  return null;
                })}
              </div>
              <Link
                href={getPageLink(currentPage + 1)}
                className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
              >
                <Button variant="outline" size="sm" disabled={currentPage >= totalPages}>
                  Berikutnya <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
