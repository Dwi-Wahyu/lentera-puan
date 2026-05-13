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

const demoUsers = [
  { role: "Super Admin", email: "admin@lp.go.id", label: "Admin" },
  { role: "Bidan / Nakes", email: "siti@lp.go.id", label: "Bidan" },
  { role: "Petugas DP3A", email: "wahil@lp.go.id", label: "DP3A" },
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
    setPassword("wahil123");
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

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24 bg-primary rounded-full flex items-center justify-center shadow-lg p-4">
              <Image
                src="/logo.png"
                alt="LenteraPuan Logo"
                width={64}
                height={64}
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-primary tracking-tight font-display">
            LenteraPuan
          </h1>
          <p className="text-on-surface-variant mt-2 font-medium">
            Integrated Healthcare & Crisis Intervention
          </p>
        </div>

        <Card className="shadow-xl border-t-4 border-t-primary">
          <form onSubmit={handleSubmit} className="space-y-6">
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
              <div className="bg-error-container text-on-error-container p-3 rounded-md text-sm font-medium">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary border-outline rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-on-surface"
                >
                  Ingat saya
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-semibold text-primary hover:text-primary-container"
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
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Masuk ke Sistem"
              )}
            </Button>
          </form>
        </Card>

        {/* Demo Credentials Helper */}
        <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-4 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <Key className="w-4 h-4" />
            <h2 className="text-sm font-bold uppercase tracking-wider">
              Demo Credentials
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {demoUsers.map((user) => (
              <button
                key={user.email}
                onClick={() => fillDemo(user.email)}
                className="text-left p-2.5 rounded-xl border border-outline-variant hover:border-primary hover:bg-primary-container/20 transition-all group"
                title={`Login sebagai ${user.role}`}
              >
                <p className="text-[10px] font-bold text-primary uppercase mb-0.5">
                  {user.label}
                </p>
                <p className="text-xs text-on-surface-variant group-hover:text-on-surface truncate">
                  {user.email}
                </p>
              </button>
            ))}
          </div>
          <div className="flex items-start gap-2 p-2 bg-primary/5 rounded-lg border border-primary/10">
            <Info className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
            <p className="text-[10px] text-on-surface-variant leading-relaxed">
              Klik pada salah satu akun di atas untuk mengisi form secara
              otomatis. Semua akun menggunakan password:{" "}
              <span className="font-bold text-primary">wahil123</span>
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-on-surface-variant">
          Butuh bantuan akses?{" "}
          <a href="#" className="font-semibold text-primary">
            Hubungi IT Support
          </a>
        </p>

        <div className="pt-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3 h-3" />
            Secured by E2E Encryption
          </div>
        </div>
      </div>
    </main>
  );
}
