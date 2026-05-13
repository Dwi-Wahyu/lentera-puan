"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export const LogoutButton = () => {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: "/" })}
      className="p-2 hover:bg-primary-container rounded-full transition-colors group" 
      title="Keluar"
    >
      <LogOut className="w-5 h-5 text-on-primary/70 group-hover:text-on-primary" />
    </button>
  );
};
