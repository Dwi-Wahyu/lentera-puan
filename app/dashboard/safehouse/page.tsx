import React from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Shield, Bed, ChevronRight } from "lucide-react";
import { api } from "@/lib/api";
import Link from "next/link";
import { SafehouseActions } from "./SafehouseActions";
import { formatEnum } from "@/lib/formatters";

export default async function SafehousePage() {
  let safehouses = [];
  let error = null;

  try {
    safehouses = await api.getSafehouses();
  } catch (err: any) {
    console.error("Failed to fetch safehouses:", err);
    error = err.message || "Gagal memuat data rumah aman.";
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-on-surface">
            Manajemen Rumah Aman
          </h1>
          <p className="text-on-surface-variant">
            Pengelolaan lokasi perlindungan sementara bagi korban krisis.
          </p>
        </div>
        <SafehouseActions />
      </div>

      {error ? (
        <div className="p-8 text-center bg-error-container text-on-error-container rounded-xl border border-error/20 shadow-sm">
          <h2 className="text-lg font-bold">Terjadi Kendala Koneksi</h2>
          <p className="mt-2 text-sm opacity-90">{error}</p>
          <p className="mt-4 text-xs italic opacity-70">
            Pastikan server backend (Port 3001) sudah dijalankan.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {safehouses.length > 0 ? (
            safehouses.map((house: any) => (
              <Card
                key={house.id}
                title={house.name}
                className="group hover:border-primary transition-all"
              >
                <div className="space-y-4 mt-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                      <Bed className="w-4 h-4" /> Kapasitas
                    </div>
                    <span className="font-bold text-primary">
                      {house.occupied}/{house.capacity} Bed
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-high rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-1000"
                      style={{
                        width: `${(house.occupied / house.capacity) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                        house.status === "TERSEDIA"
                          ? "bg-secondary-container text-on-secondary-container"
                          : "bg-error-container text-on-error-container"
                      }`}
                    >
                      {formatEnum(house.status)}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-on-surface-variant font-medium">
                      <Shield className="w-3 h-3 text-primary" /> Keamanan:{" "}
                      <span className="text-primary font-bold">
                        {formatEnum(house.safetyLevel)}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/dashboard/safehouse/${house.id}`}
                    className="w-full"
                  >
                    <Button
                      variant="outline"
                      className="w-full mt-2 gap-2 group-hover:bg-primary group-hover:text-on-primary cursor-pointer hover:text-primary transition-all"
                    >
                      Detail & Penghuni <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))
          ) : (
            <div className="lg:col-span-3 py-12 text-center text-on-surface-variant italic border border-dashed border-outline-variant rounded-xl">
              Belum ada lokasi rumah aman yang terdaftar.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
