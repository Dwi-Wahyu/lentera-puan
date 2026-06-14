"use client";

import React from "react";
import Image from "next/image";
import { User, X } from "lucide-react";
import { LogoutButton } from "./LogoutButton";
import { SidebarNav } from "./SidebarNav";
import { formatEnum } from "@/lib/formatters";
import { useSidebar } from "./providers/sidebar-provider";
import { useSession } from "next-auth/react";

export const Sidebar = () => {
  const { isOpen, close } = useSidebar();
  const { data: session } = useSession();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden animate-in fade-in duration-300"
          onClick={close}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 flex flex-col h-screen 
          bg-primary text-on-primary
          transition-transform duration-300 ease-in-out
          lg:sticky lg:translate-x-0
          border-r border-white/10
          ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
        `}
      >
        {/* Logo Area */}
        <div className="px-5 py-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0 ring-1 ring-white/20">
              <Image
                src="/logo.png"
                alt="LenteraPuan Logo"
                width={22}
                height={22}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight leading-none">LenteraPuan</span>
              <span className="text-[9px] text-on-primary/50 uppercase tracking-widest font-semibold mt-0.5">
                {session?.user?.role === 'SUPER_ADMIN' ? 'Admin Panel' : 'Panel Petugas'}
              </span>
            </div>
          </div>
          <button
            onClick={close}
            className="lg:hidden p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <div
          className="flex-1 overflow-y-auto py-2"
          onClick={() => {
            if (window.innerWidth < 1024) close();
          }}
        >
          <SidebarNav />
        </div>

        {/* User Profile Area */}
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-white/15 ring-2 ring-white/20 flex-shrink-0 flex items-center justify-center font-bold overflow-hidden">
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt="Avatar"
                    width={36}
                    height={36}
                    className="object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-on-primary/80" />
                )}
              </div>
              {/* Name + Role */}
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold truncate leading-tight">
                  {session?.user?.name || "User"}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-on-primary/50 mt-0.5">
                  {formatEnum(session?.user?.role || "")}
                </span>
              </div>
            </div>
            <LogoutButton />
          </div>
        </div>
      </aside>
    </>
  );
};
