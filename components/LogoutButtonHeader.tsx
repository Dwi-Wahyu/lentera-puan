"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export const LogoutButtonHeader = () => {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: "/" })}
      className="flex items-center gap-2 text-error font-semibold hover:bg-error-container px-3 py-1.5 rounded-md transition-colors group"
    >
      <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
      <span className="text-sm">Keluar</span>
    </button>
  );
};
