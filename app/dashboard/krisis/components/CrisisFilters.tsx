"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Search, Filter, AlertTriangle, Shield } from "lucide-react";

export function CrisisFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [priority, setPriority] = useState(searchParams.get("priority") || "");
  const [type, setType] = useState(searchParams.get("type") || "");

  // Sync state with URL params when URL changes
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setStatus(searchParams.get("status") || "");
    setPriority(searchParams.get("priority") || "");
    setType(searchParams.get("type") || "");
  }, [searchParams]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    if (priority) params.set("priority", priority);
    if (type) params.set("type", type);

    router.push(`/dashboard/krisis?${params.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-3 mb-5">
      <div className="flex-1">
        <Input
          placeholder="Cari ID Kasus atau Inisial..."
          leftIcon={<Search className="w-4 h-4" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyPress}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex items-center">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="pl-9 pr-8 py-2.5 border border-outline-variant/70 rounded-lg bg-surface-container-lowest text-on-surface text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary appearance-none min-w-[150px] hover:border-outline transition-colors cursor-pointer"
          >
            <option value="">Semua Status</option>
            <option value="BARU">Baru</option>
            <option value="INVESTIGASI">Dalam Investigasi</option>
            <option value="TERVALIDASI">Tervalidasi</option>
            <option value="SELESAI">Selesai</option>
          </select>
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant pointer-events-none">
            <Filter className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="relative flex items-center">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="pl-9 pr-8 py-2.5 border border-outline-variant/70 rounded-lg bg-surface-container-lowest text-on-surface text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary appearance-none min-w-[140px] hover:border-outline transition-colors cursor-pointer"
          >
            <option value="">Semua Prioritas</option>
            <option value="RENDAH">Rendah</option>
            <option value="MEDIUM">Medium</option>
            <option value="TINGGI">Tinggi</option>
            <option value="SANGAT_TINGGI">Sangat Tinggi</option>
          </select>
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant pointer-events-none">
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="relative flex items-center">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="pl-9 pr-8 py-2.5 border border-outline-variant/70 rounded-lg bg-surface-container-lowest text-on-surface text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary appearance-none min-w-[150px] hover:border-outline transition-colors cursor-pointer"
          >
            <option value="">Semua Tipe</option>
            <option value="KDRT">KDRT</option>
            <option value="KEKERASAN_SEKSUAL">Kekerasan Seksual</option>
            <option value="ANCAMAN_KEAMANAN">Ancaman Keamanan</option>
            <option value="INTERVENSI_MEDIS_DARURAT">Medis Darurat</option>
            <option value="LAINNYA">Lainnya</option>
          </select>
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant pointer-events-none">
            <Shield className="w-3.5 h-3.5" />
          </div>
        </div>

        <Button onClick={handleSearch} className="gap-2 shrink-0">
          <Search className="w-4 h-4" /> Cari
        </Button>
      </div>
    </div>
  );
}
