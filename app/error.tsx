"use client";

import { useEffect } from "react";
import { Button } from "@/components/Button";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-error-container rounded-full flex items-center justify-center mb-8 animate-pulse">
        <AlertTriangle className="w-12 h-12 text-error" />
      </div>

      <h1 className="text-4xl font-black text-on-surface mb-2 tracking-tighter uppercase">Sistem Bermasalah</h1>
      <h2 className="text-lg font-bold text-on-surface-variant mb-6">Error 500 • Internal Server Error</h2>
      
      <div className="bg-surface-container p-6 rounded-2xl max-w-lg mb-8 border border-outline-variant shadow-sm text-left">
        <p className="text-sm font-bold text-error mb-2 uppercase tracking-widest">Detail Kesalahan:</p>
        <p className="text-xs text-on-surface-variant font-mono break-all leading-relaxed bg-black/5 p-3 rounded-lg">
          {error.message || "Terjadi kegagalan sistem yang tidak terduga."}
        </p>
      </div>

      <div className="flex gap-4">
        <Button variant="primary" onClick={() => reset()} className="gap-2 px-8">
          <RefreshCcw className="w-4 h-4" /> Coba Lagi
        </Button>
        <Link href="/dashboard">
          <Button variant="ghost" className="gap-2">
            <Home className="w-4 h-4" /> Dashboard
          </Button>
        </Link>
      </div>

      <div className="mt-16 space-y-2 opacity-30">
        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">
          Lentera Puan IT Support
        </p>
        <p className="text-[8px] font-medium text-on-surface-variant italic">
          ID Laporan: {error.digest || "N/A"}
        </p>
      </div>
    </div>
  );
}
