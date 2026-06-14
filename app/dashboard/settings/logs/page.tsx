import React from 'react';
import { api } from "@/lib/api";
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { 
  ArrowLeft, 
  History, 
  Search, 
  User, 
  Activity, 
  Clock,
  ShieldCheck,
  Filter
} from 'lucide-react';
import Link from 'next/link';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatEnum } from '@/lib/formatters';

export default async function AuditLogPage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  let logs = [];
  try {
    logs = await api.getAuditLogs();
  } catch (error) {
    console.error("Failed to fetch audit logs:", error);
  }

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
          <p className="text-3xl font-black text-primary mt-1">{logs.length}</p>
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
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input 
              placeholder="Cari aktivitas atau personil..." 
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="flex gap-2">
            <select className="px-4 py-2 border border-outline-variant rounded bg-surface-container-lowest text-on-surface text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Semua Kategori</option>
              <option value="UPDATE_CONFIG">Update Konfigurasi</option>
              <option value="TOGGLE_MAINTENANCE">Status Sistem</option>
              <option value="RESET_SECURITY_KEYS">Keamanan</option>
            </select>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" /> Filter
            </Button>
          </div>
        </div>

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
      </Card>
    </div>
  );
}
