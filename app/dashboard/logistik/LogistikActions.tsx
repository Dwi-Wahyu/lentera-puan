"use client";

import React, { useState } from "react";
import { Button } from "@/components/Button";
import { Plus, ClipboardList } from "lucide-react";
import Link from "next/link";
import { DistributionModal } from "./DistributionModal";

interface Logistic {
  id: string;
  name: string;
  stock: number;
  unit: string;
}

interface LogistikActionsProps {
  logistics: Logistic[];
}

export const LogistikActions: React.FC<LogistikActionsProps> = ({ logistics }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex gap-3">
        <Button 
          variant="outline" 
          className="gap-2 border-secondary text-secondary hover:bg-secondary-container"
          onClick={() => setIsModalOpen(true)}
        >
          <ClipboardList className="w-4 h-4" /> Catat Distribusi
        </Button>
        <Link href="/dashboard/logistik/new">
          <Button variant="primary" className="gap-2">
            <Plus className="w-4 h-4" /> Input Stok Baru
          </Button>
        </Link>
      </div>

      <DistributionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        logistics={logistics}
      />
    </>
  );
};
