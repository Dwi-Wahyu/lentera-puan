"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Search, Filter, ListOrdered } from "lucide-react";

export function LogFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [action, setAction] = useState(searchParams.get("action") || "");
  const [limit, setLimit] = useState(searchParams.get("limit") || "20");

  // Sync state with URL params on mount or when URL changes
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setAction(searchParams.get("action") || "");
    setLimit(searchParams.get("limit") || "20");
  }, [searchParams]);

  const applyFilters = (newSearch?: string, newAction?: string, newLimit?: string) => {
    setIsLoading(true);
    const params = new URLSearchParams();
    
    const finalSearch = newSearch !== undefined ? newSearch : search;
    const finalAction = newAction !== undefined ? newAction : action;
    const finalLimit = newLimit !== undefined ? newLimit : limit;

    if (finalSearch) params.set("search", finalSearch);
    if (finalAction) params.set("action", finalAction);
    if (finalLimit && finalLimit !== "20") params.set("limit", finalLimit);
    
    params.set("page", "1");
    
    window.location.href = `/dashboard/settings/logs?${params.toString()}`;
  };

  const handleSearchClick = () => {
    applyFilters(search, action, limit);
  };

  const handleActionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setAction(val);
    applyFilters(search, val, limit);
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setLimit(val);
    applyFilters(search, action, val);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      applyFilters(search, action, limit);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1">
        <Input
          placeholder="Cari aktivitas, pesan, atau nama personil..."
          leftIcon={<Search className="w-4 h-4" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={isLoading}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <div className="relative flex items-center">
          <select
            value={action}
            onChange={handleActionChange}
            disabled={isLoading}
            className="pl-3 pr-8 py-2 border border-outline-variant rounded bg-surface-container-lowest text-on-surface text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary appearance-none min-w-[160px] disabled:opacity-50 transition-colors"
          >
            <option value="">Semua Kategori</option>
            <optgroup label="Manajemen User">
              <option value="CREATE_USER">Tambah User</option>
              <option value="UPDATE_USER">Update User</option>
              <option value="DELETE_USER">Hapus User</option>
            </optgroup>
            <optgroup label="Manajemen Pasien">
              <option value="CREATE_PATIENT">Tambah Pasien</option>
              <option value="UPDATE_PATIENT">Update Pasien</option>
              <option value="DELETE_PATIENT">Hapus Pasien</option>
            </optgroup>
            <optgroup label="Manajemen Rumah Aman">
              <option value="CREATE_SAFEHOUSE">Tambah Rumah Aman</option>
              <option value="UPDATE_SAFEHOUSE">Update Rumah Aman</option>
              <option value="DELETE_SAFEHOUSE">Hapus Rumah Aman</option>
            </optgroup>
            <optgroup label="Laporan Krisis">
              <option value="CREATE_CRISIS_REPORT">Laporan Baru</option>
              <option value="UPDATE_CRISIS_REPORT">Update Laporan</option>
              <option value="DELETE_CRISIS_REPORT">Hapus Laporan</option>
              <option value="ADD_INVESTIGATION_LOG">Catat Investigasi</option>
              <option value="UPLOAD_EVIDENCE">Upload Bukti</option>
            </optgroup>
            <optgroup label="Sistem">
              <option value="UPDATE_CONFIG">Update Konfigurasi</option>
              <option value="TOGGLE_MAINTENANCE">Status Sistem</option>
              <option value="RESET_SECURITY_KEYS">Keamanan</option>
            </optgroup>
          </select>
          <div className="absolute right-3 pointer-events-none text-on-surface-variant">
            <Filter className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="relative flex items-center">
          <select
            value={limit}
            onChange={handleLimitChange}
            disabled={isLoading}
            className="pl-3 pr-8 py-2 border border-outline-variant rounded bg-surface-container-lowest text-on-surface text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary appearance-none min-w-[100px] disabled:opacity-50 transition-colors"
          >
            <option value="10">10 Baris</option>
            <option value="20">20 Baris</option>
            <option value="50">50 Baris</option>
            <option value="100">100 Baris</option>
          </select>
          <div className="absolute right-3 pointer-events-none text-on-surface-variant">
            <ListOrdered className="w-3.5 h-3.5" />
          </div>
        </div>

        <Button onClick={handleSearchClick} className="gap-2 min-w-[100px]" disabled={isLoading}>
          {isLoading ? "Memuat..." : "Terapkan"}
        </Button>
      </div>
    </div>
  );
}
