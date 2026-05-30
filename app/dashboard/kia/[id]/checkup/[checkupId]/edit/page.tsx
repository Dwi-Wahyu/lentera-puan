"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ArrowLeft, User, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { CheckupForm } from '@/components/CheckupForm';
import { updateCheckup } from '../actions';
import { useToast } from '@/components/providers/toast-provider';

interface Checkup {
  date: string;
  status: string;
  notes: string | null;
}

const SkeletonCheckup = () => (
  <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
    <div className="flex items-center gap-4">
      <div className="w-9 h-9 bg-surface-container rounded-lg" />
      <div className="space-y-2">
        <div className="h-8 w-48 bg-surface-container rounded-md" />
        <div className="h-4 w-32 bg-surface-container rounded-md" />
      </div>
    </div>
    <Card className="p-8 space-y-8 shadow-lg border-t-2 border-t-outline-variant">
      <div className="h-6 w-40 bg-surface-container rounded-md mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-surface-container rounded-md" />
          <div className="h-10 w-full bg-surface-container rounded-md" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-32 bg-surface-container rounded-md" />
          <div className="h-10 w-full bg-surface-container rounded-md" />
        </div>
        <div className="md:col-span-2 space-y-2">
          <div className="h-4 w-32 bg-surface-container rounded-md" />
          <div className="h-32 w-full bg-surface-container rounded-md" />
        </div>
      </div>
      <div className="flex justify-end gap-4 pt-4 border-t border-outline-variant">
        <div className="h-9 w-20 bg-surface-container rounded-md" />
        <div className="h-9 w-40 bg-surface-container rounded-md" />
      </div>
    </Card>
  </div>
);

export default function EditCheckupPage() {
  const params = useParams();
  const patientId = params.id as string;
  const checkupId = params.checkupId as string;
  const router = useRouter();
  const toast = useToast();
  
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
    const result = await updateCheckup(patientId, checkupId, formData);
    if (!result?.error) {
      // Toast is handled in CheckupForm, we just need to redirect
      router.push(`/dashboard/kia/${patientId}/checkup/${checkupId}`);
    }
    return result;
  }

  if (!checkup) return <SkeletonCheckup />;

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
