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
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden animate-in fade-in duration-300"
          onClick={close}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-primary text-on-primary flex flex-col h-screen 
        transition-transform duration-300 lg:sticky lg:translate-x-0 border-r border-primary-container
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="p-6 border-b border-primary-container flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="LenteraPuan Logo"
              width={32}
              height={32}
            />
            <span className="text-xl font-bold tracking-tight">
              LenteraPuan
            </span>
          </div>
          <button
            onClick={close}
            className="lg:hidden p-2 hover:bg-primary-container rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div
          className="flex-1 overflow-y-auto"
          onClick={() => {
            if (window.innerWidth < 1024) close();
          }}
        >
          <SidebarNav />
        </div>

        <div className="mt-auto p-6 border-t border-primary-container">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 bg-secondary rounded-full flex-shrink-0 flex items-center justify-center font-bold overflow-hidden border-2 border-on-primary/20">
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt="Avatar"
                    width={40}
                    height={40}
                  />
                ) : (
                  <User className="w-6 h-6 text-on-secondary" />
                )}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-bold truncate">
                  {session?.user?.name || "User"}
                </span>
                <span className="text-[10px] text-on-primary-container uppercase font-bold tracking-wider">
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
