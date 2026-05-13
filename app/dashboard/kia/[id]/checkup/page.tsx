"use client";

import React from 'react';
import { Button } from '@/components/Button';
import { ArrowLeft, User } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CheckupForm } from '@/components/CheckupForm';
import { createCheckup } from './actions';

export default function NewCheckupPage() {
  const params = useParams();
  const patientId = params.id as string;

  async function handleCreate(formData: FormData) {
    return await createCheckup(patientId, formData);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/kia/${patientId}`}>
          <Button variant="ghost" size="sm" className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Input Pemeriksaan Baru</h1>
          <p className="text-on-surface-variant flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            Rekam Medis Pasien
          </p>
        </div>
      </div>

      <CheckupForm 
        onSubmit={handleCreate}
        cancelHref={`/dashboard/kia/${patientId}`}
      />
    </div>
  );
}
