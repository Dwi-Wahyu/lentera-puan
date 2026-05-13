"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { ArrowLeft, User, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CheckupForm } from '@/components/CheckupForm';
import { updateCheckup } from '../actions';

interface Checkup {
  date: string;
  status: string;
  notes: string | null;
}

export default function EditCheckupPage() {
  const params = useParams();
  const patientId = params.id as string;
  const checkupId = params.checkupId as string;
  
  const [checkup, setCheckup] = useState<Checkup | null>(null);

  useEffect(() => {
    async function fetchCheckup() {
      const res = await fetch(`/api/checkups/${checkupId}`);
      const data = await res.json();
      setCheckup(data);
    }
    fetchCheckup();
  }, [checkupId]);

  async function handleUpdate(formData: FormData) {
    return await updateCheckup(patientId, checkupId, formData);
  }

  if (!checkup) return (
    <div className="min-h-[400px] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/kia/${patientId}/checkup/${checkupId}`}>
          <Button variant="ghost" size="sm" className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Edit Pemeriksaan</h1>
          <p className="text-on-surface-variant flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            Rekam Medis Pasien
          </p>
        </div>
      </div>

      <CheckupForm 
        initialData={{
          date: new Date(checkup.date),
          status: checkup.status,
          notes: checkup.notes
        }}
        onSubmit={handleUpdate}
        cancelHref={`/dashboard/kia/${patientId}/checkup/${checkupId}`}
      />
    </div>
  );
}
