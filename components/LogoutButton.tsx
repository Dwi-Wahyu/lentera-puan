"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export const LogoutButton = () => {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: "/" })}
      className="p-2 hover:bg-white/15 rounded-lg transition-colors group shrink-0" 
      title="Keluar dari sistem"
    >
      <LogOut className="w-4 h-4 text-on-primary/50 group-hover:text-on-primary transition-colors" />
    </button>
  );
};
