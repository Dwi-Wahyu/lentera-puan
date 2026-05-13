"use client";

import React, { useState } from 'react';
import { Button } from '@/components/Button';
import { Search, Plus } from 'lucide-react';
import Link from 'next/link';
import { AvailabilityModal } from './AvailabilityModal';

export const SafehouseActions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex gap-3">
        <Button variant="outline" className="gap-2" onClick={() => setIsModalOpen(true)}>
          <Search className="w-4 h-4" /> Cek Ketersediaan
        </Button>
        <Link href="/dashboard/safehouse/new">
          <Button variant="primary" className="gap-2">
            <Plus className="w-4 h-4" /> Tambah Lokasi
          </Button>
        </Link>
      </div>

      <AvailabilityModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};
