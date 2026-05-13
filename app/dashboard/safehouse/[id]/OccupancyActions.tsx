"use client";

import React, { useState } from 'react';
import { Button } from '@/components/Button';
import { UserPlus, UserMinus, Loader2 } from 'lucide-react';
import { updateOccupancy } from './actions';
import { useToast } from '@/components/providers/toast-provider';

interface OccupancyActionsProps {
  id: string;
  occupied: number;
  capacity: number;
}

export const OccupancyActions: React.FC<OccupancyActionsProps> = ({ id, occupied, capacity }) => {
  const toast = useToast();
  const [isPending, setIsPending] = useState(false);

  const handleUpdate = async (delta: number) => {
    setIsPending(true);
    const res = await updateOccupancy(id, delta);
    setIsPending(false);
    
    if (res.error) {
      toast.error('Gagal', res.error);
    } else {
      toast.success('Berhasil', delta > 0 ? 'Penghuni baru berhasil check-in.' : 'Penghuni telah berhasil check-out.');
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <Button 
        variant="primary" 
        className="w-full gap-2" 
        disabled={occupied >= capacity || isPending}
        onClick={() => handleUpdate(1)}
      >
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />} Check-in
      </Button>
      <Button 
        variant="outline" 
        className="w-full gap-2" 
        disabled={occupied <= 0 || isPending}
        onClick={() => handleUpdate(-1)}
      >
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserMinus className="w-4 h-4" />} Check-out
      </Button>
    </div>
  );
};
