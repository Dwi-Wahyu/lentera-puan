"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";
import { Shield, Loader2, Search } from "lucide-react";
import { Input } from "@/components/Input";

interface SafeHouse {
  id: string;
  name: string;
  capacity: number;
  occupied: number;
  safetyLevel: string;
  status: string;
}

export const AvailabilityModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [safehouses, setSafehouses] = useState<SafeHouse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      async function fetchSafehouses() {
        setIsLoading(true);
        const res = await fetch("/api/safehouses");
        const data = await res.json();
        setSafehouses(data);
        setIsLoading(false);
      }
      fetchSafehouses();
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cek Ketersediaan Rumah Aman">
      <div className="space-y-6">
        <div className="space-y-4">
          <p className="text-sm text-on-surface-variant">
            Daftar real-time kapasitas tempat tidur di seluruh jaringan Rumah Aman.
          </p>
          <Input 
            placeholder="Cari nama lokasi..." 
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        {isLoading ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {safehouses.map((house) => {
              const available = house.capacity - house.occupied;
              const percent = (house.occupied / house.capacity) * 100;
              
              return (
                <div key={house.id} className="p-4 rounded-xl border border-outline-variant bg-surface-container-low flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-on-surface">{house.name}</h4>
                      <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                        <Shield className="w-3 h-3 text-secondary" /> Keamanan: {house.safetyLevel}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      available > 0 ? 'bg-secondary-container text-on-secondary-container' : 'bg-error-container text-on-error-container'
                    }`}>
                      {available > 0 ? `${available} Bed Tersedia` : 'Penuh'}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold uppercase text-on-surface-variant">
                      <span>Okupansi</span>
                      <span>{Math.round(percent)}%</span>
                    </div>
                    <div className="w-full bg-surface-container-highest rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          percent > 85 ? 'bg-error' : 'bg-primary'
                        }`}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="pt-4 flex justify-end">
          <Button variant="primary" onClick={onClose}>Tutup</Button>
        </div>
      </div>
    </Modal>
  );
};
