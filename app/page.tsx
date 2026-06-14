"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Card } from "@/components/Card";
import Image from "next/image";
import { ShieldCheck, Loader2, Key, Info } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/providers/toast-provider";
import LoadingDashboard from "./dashboard/loading";

const demoUsers = [
  { role: "Super Admin", email: "admin@lp.go.id", label: "Admin" },
  { role: "Petugas DP3A", email: "petugas@lp.go.id", label: "DP3A" },
  { role: "Psikolog Klinis", email: "ahmad@lp.go.id", label: "Psikolog" },
];

export default function LoginPage() {
  const { status } = useSession();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const fillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("password123");
    toast.info("Form Terisi", `Menggunakan kredensial demo untuk ${demoEmail}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Email atau kata sandi salah.");
        toast.error(
          "Gagal Masuk",
          "Email atau kata sandi yang Anda masukkan salah.",
        );
      } else {
        toast.success(
          "Berhasil Masuk",
          "Selamat datang kembali di sistem LenteraPuan.",
        );
        router.push("/dashboard");
      }
    } catch {
      setError("Terjadi kesalahan saat masuk.");
      toast.error(
        "Kesalahan Sistem",
        "Terjadi kendala saat menghubungkan ke server.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen bg-surface">
        {/* Sidebar Mock for Skeleton */}
        <div className="hidden lg:block w-72 bg-primary shrink-0 opacity-5" />
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header Mock for Skeleton */}
          <div className="h-16 border-b border-outline-variant bg-surface-container-lowest" />
          <main className="flex-1 p-5 lg:p-8">
            <LoadingDashboard />
          </main>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-surface via-surface-container-low to-surface-container flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Logo & Branding */}
        <div className="text-center">
          <div className="flex justify-center mb-5">
            <div className="relative w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 ring-4 ring-primary/10">
              <Image
                src="/logo.png"
                alt="LenteraPuan Logo"
                width={52}
                height={52}
              />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-primary tracking-tight font-display">
            LenteraPuan
          </h1>
          <p className="text-on-surface-variant mt-1 text-sm font-medium">
            Integrated Healthcare & Crisis Intervention
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl shadow-primary/5 border-t-2 border-t-primary !rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <Input
                label="Email / ID Pengguna"
                type="text"
                placeholder="Masukkan email atau ID Anda"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
              <Input
                label="Kata Sandi"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="bg-error/5 text-error border border-error/20 p-3 rounded-lg text-sm font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-error shrink-0" />
                {error}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-3.5 w-3.5 text-primary border-outline-variant rounded accent-primary"
                />
                <label
                  htmlFor="remember-me"
                  className="text-xs text-on-surface-variant font-medium"
                >
                  Ingat saya
                </label>
              </div>

              <div className="text-xs">
                <a
                  href="#"
                  className="font-semibold text-primary hover:text-primary/70 transition-colors"
                >
                  Lupa kata sandi?
                </a>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Masuk ke Sistem"
              )}
            </Button>
          </form>
        </Card>

        {/* Demo Credentials Helper */}
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-primary">
            <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
              <Key className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-xs font-bold uppercase tracking-widest">
              Demo Credentials
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {demoUsers.map((user) => (
              <button
                key={user.email}
                onClick={() => fillDemo(user.email)}
                className="text-left p-2.5 rounded-lg border border-outline-variant/60 hover:border-primary hover:bg-primary/3 transition-all group"
                title={`Login sebagai ${user.role}`}
              >
                <p className="text-[9px] font-bold text-primary uppercase tracking-widest mb-1">
                  {user.label}
                </p>
                <p className="text-xs text-on-surface-variant group-hover:text-on-surface truncate font-medium">
                  {user.email}
                </p>
              </button>
            ))}
          </div>
          <div className="flex items-start gap-2 p-2.5 bg-primary/5 rounded-lg border border-primary/10">
            <Info className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
            <p className="text-[10px] text-on-surface-variant leading-relaxed">
              Klik salah satu akun untuk mengisi form otomatis. Password:{" "}
              <span className="font-bold text-primary">password123</span>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-on-surface-variant">
          Butuh bantuan akses?{" "}
          <a href="#" className="font-semibold text-primary hover:underline">
            Hubungi IT Support
          </a>
        </p>

        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/8 text-secondary border border-secondary/15 text-[10px] font-bold uppercase tracking-widest">
            <ShieldCheck className="w-3 h-3" />
            Secured by E2E Encryption
          </div>
        </div>
      </div>
    </main>
  );
}
