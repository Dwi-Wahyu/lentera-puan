import React from 'react';
import { prisma } from "@/lib/prisma";
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { 
  ArrowLeft, 
  Calendar, 
  Activity, 
  FileText, 
  Clock,
  User
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from "next/navigation";
import { CheckupActions } from './CheckupActions';

interface PageProps {
  params: Promise<{ id: string; checkupId: string }>;
}

export default async function CheckupDetailPage({ params }: PageProps) {
  const { id: patientId, checkupId } = await params;

  const checkup = await prisma.medicalCheckup.findUnique({
    where: { id: checkupId },
    include: { patient: true }
  });

  if (!checkup) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/kia/${patientId}`}>
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-on-surface">Detail Pemeriksaan</h1>
            <p className="text-on-surface-variant flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Pasien: <span className="font-bold">{checkup.patient.name}</span>
            </p>
          </div>
        </div>
        <CheckupActions patientId={patientId} checkupId={checkupId} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 border-t-4 border-t-primary h-fit">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-surface-container rounded-lg">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase">Tanggal Periksa</p>
                <p className="text-sm font-bold">{checkup.date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-surface-container rounded-lg">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase">Waktu Input</p>
                <p className="text-sm font-bold">{checkup.date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</p>
              </div>
            </div>

            <div className={`flex items-center gap-3 p-3 rounded-lg ${
              checkup.status === 'NORMAL' ? 'bg-secondary-container text-on-secondary-container' : 'bg-error-container text-on-error-container'
            }`}>
              <Activity className="w-5 h-5" />
              <div>
                <p className="text-[10px] font-bold uppercase opacity-70">Status Hasil</p>
                <p className="text-sm font-bold">{checkup.status}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Catatan Medis & Observasi" className="md:col-span-2">
          <div className="flex gap-4 items-start">
            <div className="p-3 bg-surface-container rounded-xl">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-on-surface leading-relaxed whitespace-pre-wrap">
                {checkup.notes || 'Tidak ada catatan tambahan untuk pemeriksaan ini.'}
              </p>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-outline-variant flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-on-surface-variant">
              <div className="w-2 h-2 rounded-full bg-secondary"></div>
              Sesuai Protokol KIA Nasional
            </div>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">LenteraPuan Clinical System</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
