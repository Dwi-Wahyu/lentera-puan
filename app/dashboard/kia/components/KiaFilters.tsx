"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Search, Users, AlertCircle } from "lucide-react";

export function KiaFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [nutritionStatus, setNutritionStatus] = useState(searchParams.get("nutritionStatus") || "");

  // Sync state with URL params when URL changes
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setCategory(searchParams.get("category") || "");
    setNutritionStatus(searchParams.get("nutritionStatus") || "");
  }, [searchParams]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (nutritionStatus) params.set("nutritionStatus", nutritionStatus);

    router.push(`/dashboard/kia?${params.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-3">
      <div className="flex-1">
        <Input
          placeholder="Cari Nama Pasien atau NIK..."
          leftIcon={<Search className="w-4 h-4" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyPress}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex items-center">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="pl-9 pr-8 py-2.5 border border-outline-variant/70 rounded-lg bg-surface-container-lowest text-on-surface text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary appearance-none min-w-[150px] hover:border-outline transition-colors cursor-pointer"
          >
            <option value="">Semua Kategori</option>
            <option value="IBU_HAMIL">Ibu Hamil</option>
            <option value="ANAK">Anak / Balita</option>
            <option value="IBU_MENYUSUI">Ibu Menyusui</option>
          </select>
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant pointer-events-none">
            <Users className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="relative flex items-center">
          <select
            value={nutritionStatus}
            onChange={(e) => setNutritionStatus(e.target.value)}
            className="pl-9 pr-8 py-2.5 border border-outline-variant/70 rounded-lg bg-surface-container-lowest text-on-surface text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary appearance-none min-w-[150px] hover:border-outline transition-colors cursor-pointer"
          >
            <option value="">Semua Status</option>
            <option value="NORMAL">Normal</option>
            <option value="PERLU_PERHATIAN">Perlu Perhatian</option>
            <option value="RISIKO_TINGGI">Risiko Tinggi</option>
          </select>
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant pointer-events-none">
            <AlertCircle className="w-3.5 h-3.5" />
          </div>
        </div>
        <Button onClick={handleSearch} className="gap-2 shrink-0">
          <Search className="w-4 h-4" /> Cari
        </Button>
      </div>
    </div>
  );
}
