"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export const LogoutButtonHeader = () => {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: "/" })}
      className="flex items-center gap-1.5 text-on-surface-variant hover:text-error hover:bg-error/5 px-2.5 py-1.5 rounded-lg transition-all text-xs font-semibold group border border-transparent hover:border-error/20"
      title="Keluar dari sistem"
    >
      <LogOut className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
      <span className="hidden sm:inline">Keluar</span>
    </button>
  );
};
