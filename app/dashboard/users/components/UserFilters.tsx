"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Search, Shield } from "lucide-react";

export function UserFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [role, setRole] = useState(searchParams.get("role") || "");

  // Sync state with URL params when URL changes
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setRole(searchParams.get("role") || "");
  }, [searchParams]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (role) params.set("role", role);

    router.push(`/dashboard/users?${params.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1">
        <Input
          placeholder="Cari Nama atau NIP..."
          leftIcon={<Search className="w-4 h-4" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyPress}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex items-center">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="pl-9 pr-8 py-2.5 border border-outline-variant/70 rounded-lg bg-surface-container-lowest text-on-surface text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary appearance-none min-w-[180px] hover:border-outline transition-colors cursor-pointer"
          >
            <option value="">Semua Peran</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="DP3A">Petugas DP3A</option>
            <option value="PSIKOLOG">Psikolog</option>
            <option value="KONSELOR">Konselor</option>
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
