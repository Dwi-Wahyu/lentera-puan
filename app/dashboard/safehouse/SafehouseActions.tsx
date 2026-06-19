"use client";

import React, { useState } from "react";
import { Button } from "@/components/Button";
import { Search, Plus } from "lucide-react";
import Link from "next/link";
import { AvailabilityModal } from "./AvailabilityModal";
import { useSession } from "next-auth/react";

export const SafehouseActions = () => {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isSuperAdmin = session?.user?.role === "SUPER_ADMIN";

  return (
    <>
      <div className="flex gap-3">
        {/* <Button
          variant="outline"
          className="gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <Search className="w-4 h-4" /> Cek Ketersediaan
        </Button> */}
        {isSuperAdmin && (
          <Link href="/dashboard/safehouse/new">
            <Button variant="primary" className="gap-2">
              <Plus className="w-4 h-4" /> Tambah Lokasi
            </Button>
          </Link>
        )}
      </div>

      {/* <AvailabilityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      /> */}
    </>
  );
};
