"use client";

import React, { useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { ArrowLeft, Save, Loader2, Package, Inbox, Layers } from 'lucide-react';
import Link from 'next/link';
import { createLogistic } from './actions';
import { useToast } from '@/components/providers/toast-provider';

export default function NewLogisticPage() {
  const toast = useToast();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setError(null);
    const result = await createLogistic(formData);
    if (result?.error) {
      setError(result.error);
      toast.error('Gagal', result.error);
      setIsPending(false);
    } else {
      toast.success('Berhasil', 'Stok logistik baru telah berhasil ditambahkan.');
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/logistik">
          <Button variant="ghost" size="sm" className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Input Stok Logistik</h1>
          <p className="text-on-surface-variant">Tambahkan item baru ke dalam inventori PMT.</p>
        </div>
      </div>

      <Card className="shadow-lg border-t-4 border-t-primary">
        <form action={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 flex items-center gap-2 text-primary border-b border-outline-variant pb-2">
              <Package className="w-5 h-5" />
              <h2 className="font-bold uppercase tracking-wider text-sm">Informasi Barang</h2>
            </div>
            
            <div className="md:col-span-2">
              <Input
                label="Nama Barang"
                name="name"
                placeholder="Contoh: Susu Formula SGM"
                required
                disabled={isPending}
              />
            </div>
            
            <Input
              label="Jumlah Stok Awal"
              name="stock"
              type="number"
              placeholder="0"
              required
              min={0}
              disabled={isPending}
            />

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-on-surface">Satuan</label>
              <select 
                name="unit" 
                required 
                disabled={isPending}
                className="px-4 py-2 border rounded bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all border-outline-variant"
              >
                <option value="">Pilih Satuan</option>
                <option value="BOX">Box</option>
                <option value="PAKET">Paket</option>
                <option value="CAP">Capsule / Tablet</option>
                <option value="PCS">Pcs</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="bg-error-container text-on-error-container p-4 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-outline-variant">
            <Link href="/dashboard/logistik">
              <Button variant="ghost" type="button" disabled={isPending}>Batal</Button>
            </Link>
            <Button type="submit" className="gap-2 px-8" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Simpan Item
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant flex gap-3">
          <Inbox className="w-5 h-5 text-primary shrink-0" />
          <div>
            <p className="text-sm font-bold text-on-surface">Manajemen PMT</p>
            <p className="text-xs text-on-surface-variant">Stok yang diinput akan diprioritaskan untuk distribusi gizi buruk.</p>
          </div>
        </div>
        <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant flex gap-3">
          <Layers className="w-5 h-5 text-secondary shrink-0" />
          <div>
            <p className="text-sm font-bold text-on-surface">Update Otomatis</p>
            <p className="text-xs text-on-surface-variant">Status stok (Kritis/Menipis) akan dihitung otomatis oleh sistem.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
