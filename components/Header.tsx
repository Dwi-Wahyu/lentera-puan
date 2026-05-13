"use client";

import React from 'react';
import { useSession } from "next-auth/react";
import { LogoutButtonHeader } from "./LogoutButtonHeader";
import { Bell, Menu } from "lucide-react";
import { formatEnum } from "@/lib/formatters";
import { Breadcrumbs } from './Breadcrumbs';
import { useSidebar } from './providers/sidebar-provider';
import Image from 'next/image';
import Link from 'next/link';

export const Header = () => {
  const { data: session } = useSession();
  const { toggle } = useSidebar();

  return (
    <header className="h-16 bg-surface-container-lowest border-b border-outline-variant flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile Toggle & Logo */}
        <div className="flex lg:hidden items-center gap-3">
          <button 
            onClick={toggle}
            className="p-2 hover:bg-surface-container rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6 text-primary" />
          </button>
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image src="/logo.png" alt="LenteraPuan" width={28} height={28} />
          </Link>
        </div>

        {/* Dynamic Breadcrumbs */}
        <div className="hidden lg:block">
          <Breadcrumbs />
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors relative group">
          <Bell className="w-5 h-5 group-hover:text-primary transition-colors" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full border-2 border-surface-container-lowest"></span>
        </button>
        <div className="h-8 w-px bg-outline-variant mx-1 lg:mx-2"></div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-on-surface">
              {session?.user?.name}
            </p>
            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
              {formatEnum(session?.user?.role || "")}
            </p>
          </div>
          <LogoutButtonHeader />
        </div>
      </div>
    </header>
  );
};
