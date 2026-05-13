import React from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Search, UserPlus, ShieldCheck, Mail, MapPin, Edit3 } from 'lucide-react';
import { prisma } from "@/lib/prisma";
import Link from 'next/link';
import { formatEnum } from '@/lib/formatters';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function UsersPage() {
  const session = await getServerSession(authOptions);

  // Role restriction: Only ADMIN can access User Management
  if (session?.user?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Manajemen User</h1>
          <p className="text-on-surface-variant">Pengaturan hak akses dan akun personil sistem.</p>
        </div>
        <Link href="/dashboard/users/new">
          <Button variant="primary" className="gap-2">
            <UserPlus className="w-4 h-4" /> Tambah Pengguna
          </Button>
        </Link>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input 
              placeholder="Cari Nama atau NIP..." 
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <select className="pl-4 pr-4 py-2 border border-outline-variant rounded bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary appearance-none min-w-[160px] text-sm font-medium">
                <option value="">Semua Peran</option>
                <option value="BIDAN">Bidan</option>
                <option value="DP3A">Petugas DP3A</option>
                <option value="PSIKOLOG">Psikolog</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant">
                <th className="text-left py-3 text-sm font-bold text-on-surface">Nama</th>
                <th className="text-left py-3 text-sm font-bold text-on-surface">Peran</th>
                <th className="text-left py-3 text-sm font-bold text-on-surface">Unit Kerja</th>
                <th className="text-left py-3 text-sm font-bold text-on-surface">Status</th>
                <th className="text-left py-3 text-sm font-bold text-on-surface">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {users.length > 0 ? users.map((user) => (
                <tr key={user.id} className="hover:bg-surface-container-low transition-colors text-sm group">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm border-2 border-surface shadow-sm">
                        {user.name?.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-on-surface">{user.name}</span>
                        <span className="text-xs text-on-surface-variant flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {user.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 font-medium">{formatEnum(user.role)}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-primary" />
                      {user.unit || '-'}
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      user.emailVerified ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-highest text-on-surface'
                    }`}>
                      {user.emailVerified ? 'TERVERIFIKASI' : 'AKTIF'}
                    </span>
                  </td>
                  <td className="py-4">
                    <Link href={`/dashboard/users/${user.id}/edit`}>
                      <Button variant="ghost" size="sm" className="gap-2 group-hover:bg-primary group-hover:text-on-primary transition-all">
                        <Edit3 className="w-3 h-3" /> Edit
                      </Button>
                    </Link>
                  </td>
                </tr>
              )) : (
                 <tr>
                  <td colSpan={5} className="py-8 text-center text-on-surface-variant italic">Belum ada user terdaftar.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      
      <div className="flex items-center justify-between text-sm text-on-surface-variant">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-secondary" />
          <span>Keamanan akses diaudit secara berkala</span>
        </div>
        <p>Total {users.length} pengguna terdaftar</p>
      </div>
    </div>
  );
}
