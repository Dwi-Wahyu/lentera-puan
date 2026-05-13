import React from 'react';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { Package, User, Search } from 'lucide-react';
import { prisma } from "@/lib/prisma";
import { formatEnum } from '@/lib/formatters';
import { LogistikActions } from './LogistikActions';

export default async function LogistikPage() {
  // Debug check for models
  if (!prisma.logistic || !prisma.distribution) {
    console.error("Prisma models 'logistic' or 'distribution' are undefined at runtime!");
    return (
      <div className="p-8 text-center bg-error-container text-on-error-container rounded-xl">
        <h2 className="text-xl font-bold">Database Client Out of Sync</h2>
        <p className="mt-2">Silakan restart development server (npm run dev) untuk memuat model database terbaru.</p>
      </div>
    );
  }

  const [logistics, distributions] = await Promise.all([
    prisma.logistic.findMany({
      orderBy: { name: 'asc' }
    }),
    prisma.distribution.findMany({
      orderBy: { date: 'desc' },
      include: {
        logistic: true,
        staff: true
      },
      take: 10
    })
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Logistik & Inventori PMT</h1>
          <p className="text-on-surface-variant">Manajemen stok Pemberian Makanan Tambahan dan bantuan logistik.</p>
        </div>
        <LogistikActions logistics={logistics} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {logistics.length > 0 ? logistics.map((item) => (
          <Card key={item.id} className="relative overflow-hidden group">
            <Package className="absolute -right-2 -bottom-2 w-16 h-16 text-primary/5 group-hover:text-primary/10 transition-colors" />
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{item.name}</p>
            <p className="text-2xl font-bold text-primary mt-1">{item.stock} {formatEnum(item.unit)}</p>
            <span className={`text-[10px] font-bold mt-2 px-2 py-0.5 rounded-full inline-block uppercase ${
              item.status === 'KRITIS' ? 'bg-error-container text-on-error-container' : 
              item.status === 'MENIPIS' ? 'bg-surface-container-highest text-on-surface' : 'bg-secondary-container text-on-secondary-container'
            }`}>
              {formatEnum(item.status)}
            </span>
          </Card>
        )) : (
          <div className="lg:col-span-4 py-12 text-center text-on-surface-variant italic border border-dashed border-outline-variant rounded-xl">
            Belum ada data logistik terdaftar.
          </div>
        )}
      </div>

      <Card title="Riwayat Distribusi" subtitle="Catatan pengeluaran logistik terakhir">
        <div className="mb-6">
           <Input 
             placeholder="Cari riwayat penerima atau barang..." 
             leftIcon={<Search className="w-4 h-4" />}
           />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant">
                <th className="text-left py-3 text-sm font-bold text-on-surface">Tanggal</th>
                <th className="text-left py-3 text-sm font-bold text-on-surface">Barang</th>
                <th className="text-left py-3 text-sm font-bold text-on-surface">Jumlah</th>
                <th className="text-left py-3 text-sm font-bold text-on-surface">Penerima</th>
                <th className="text-left py-3 text-sm font-bold text-on-surface">Petugas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {distributions.length > 0 ? distributions.map((row) => (
                <tr key={row.id} className="hover:bg-surface-container-low transition-colors text-sm group">
                  <td className="py-4 text-on-surface-variant whitespace-nowrap">
                    {row.date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="py-4 font-bold text-on-surface">{row.logistic.name}</td>
                  <td className="py-4 font-medium text-primary">-{row.quantity} {formatEnum(row.logistic.unit)}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-[10px] font-bold">
                        {row.recipient[0]}
                      </div>
                      {row.recipient}
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-[10px] font-bold">
                        <User className="w-3 h-3" />
                      </div>
                      <span className="font-medium text-primary">{row.staff.name}</span>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-on-surface-variant italic border border-dashed border-outline-variant rounded-lg">Belum ada riwayat distribusi.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
