import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { 
  User, 
  Edit, 
  Stethoscope, 
  BadgeCheck, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  TrendingUp,
  LifeBuoy
} from 'lucide-react';
import { redirect } from "next/navigation";
import { formatEnum } from "@/lib/formatters";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    redirect("/");
  }

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <Card className="relative overflow-hidden border-none shadow-md bg-surface-container-lowest">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32"></div>
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 p-2 relative z-10">
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-surface-container-high border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
               <User className="w-16 h-16 text-primary" />
            </div>
            <button className="absolute -bottom-2 -right-2 bg-primary text-on-primary p-2 rounded-full shadow-md hover:bg-primary-container transition-colors">
              <Edit className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-primary">{user.name}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2 text-on-surface-variant">
              <span className="flex items-center gap-1.5 bg-surface-container-high px-3 py-1 rounded-full text-sm font-semibold">
                <Stethoscope className="w-4 h-4 text-primary" /> {formatEnum(user.role)}
              </span>
              <span className="flex items-center gap-1.5 bg-surface-container-high px-3 py-1 rounded-full text-sm font-semibold">
                <BadgeCheck className="w-4 h-4 text-primary" /> NIP: {user.nip || '-'}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="primary" className="gap-2">
              <Edit className="w-4 h-4" /> Edit Profil
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-8">
          <Card title="Informasi Pribadi" subtitle="Data kontak dan domisili Anda">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 mt-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Alamat Email Resmi</label>
                <div className="flex items-center gap-2 text-on-surface font-medium">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>{user.email}</span>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Nomor Telepon Aktif</label>
                <div className="flex items-center gap-2 text-on-surface font-medium">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>0812-3456-7890</span>
                </div>
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Alamat Domisili</label>
                <div className="flex items-center gap-2 text-on-surface font-medium">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>Jl. Melati No. 12, Jakarta Selatan, DKI Jakarta 12345</span>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Kredensial & Tugas" subtitle="Status sertifikasi dan unit kerja">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 mt-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Nomor STR (Surat Tanda Registrasi)</label>
                <p className="font-bold text-on-surface">STR-2010-0120-01293</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Masa Berlaku STR</label>
                <div className="flex items-center gap-2">
                  <span className="font-medium">12 Juni 2025</span>
                  <span className="bg-secondary-container text-on-secondary-container text-[10px] font-bold px-2 py-0.5 rounded border border-secondary/20">AKTIF</span>
                </div>
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Unit Kerja Penugasan</label>
                <div className="flex items-center gap-4 mt-2 p-4 bg-surface-container rounded-lg border border-outline-variant">
                  <div className="w-12 h-12 rounded bg-primary-container flex items-center justify-center text-on-primary-container">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">{user.unit || 'Unit Kerja'}</p>
                    <p className="text-sm text-on-surface-variant">Layanan Kesehatan Primer - Wilayah I</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-8">
          <Card title="Keamanan">
            <div className="space-y-6 mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm">Kata Sandi</p>
                  <p className="text-xs text-on-surface-variant">Terakhir diubah 3 bulan lalu</p>
                </div>
                <Button variant="outline" size="sm">Ubah</Button>
              </div>
              <div className="border-t border-outline-variant pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm">Autentikasi 2 Faktor</p>
                    <p className="text-xs text-on-surface-variant">Keamanan ekstra via SMS/Email</p>
                  </div>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-primary text-on-primary">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" /> Statistik Penugasan
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <p className="text-xs opacity-80 uppercase font-bold tracking-tighter">Total Kasus</p>
                <p className="text-3xl font-bold">124</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <p className="text-xs opacity-80 uppercase font-bold tracking-tighter">Selesai</p>
                <p className="text-3xl font-bold">118</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-sm">
              <span>Performa Bulan Ini</span>
              <span className="text-secondary-fixed font-bold">+12%</span>
            </div>
          </Card>

          <div className="bg-surface-container border border-outline-variant p-6 rounded-xl space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-primary">
              <LifeBuoy className="w-5 h-5" />
              <p className="font-bold">Butuh Bantuan Teknis?</p>
            </div>
            <p className="text-sm text-on-surface-variant">Hubungi tim IT operasional jika Anda mengalami kendala akses atau data tidak sesuai.</p>
            <Button variant="outline" className="w-full">Hubungi Support</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
