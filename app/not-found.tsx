import Link from "next/link";
import { Button } from "@/components/Button";
import { FileQuestion, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-primary-container rounded-3xl flex items-center justify-center mb-8 rotate-12">
        <FileQuestion className="w-12 h-12 text-white -rotate-12" />
      </div>

      <h1 className="text-6xl font-black text-on-surface mb-2 tracking-tighter">
        404
      </h1>
      <h2 className="text-2xl font-bold text-on-surface mb-4">
        Halaman Tidak Ditemukan
      </h2>
      <p className="text-on-surface-variant max-w-md mb-8 leading-relaxed">
        Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan. Pastikan
        URL sudah benar atau kembali ke dashboard.
      </p>

      <div className="flex gap-4">
        <Link href="/dashboard">
          <Button variant="primary" className="gap-2 px-8">
            <Home className="w-4 h-4" /> Dashboard
          </Button>
        </Link>
      </div>

      <div className="mt-16 text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] opacity-30">
        Lentera Puan • Sistem Perlindungan Terpadu
      </div>
    </div>
  );
}
