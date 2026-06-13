"use client";

import React from 'react';
import { useSession } from "next-auth/react";
import { LogoutButtonHeader } from "./LogoutButtonHeader";
import { Menu } from "lucide-react";
import { formatEnum } from "@/lib/formatters";
import { Breadcrumbs } from './Breadcrumbs';
import { useSidebar } from './providers/sidebar-provider';
import Image from 'next/image';
import Link from 'next/link';

export const Header = () => {
  const { data: session } = useSession();
  const { toggle } = useSidebar();

  return (
    <header className="h-14 bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant/50 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile Toggle & Logo */}
        <div className="flex lg:hidden items-center gap-3">
          <button 
            onClick={toggle}
            className="p-2 hover:bg-surface-container rounded-lg transition-colors text-primary"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image src="/logo.png" alt="LenteraPuan" width={24} height={24} />
            <span className="text-sm font-bold text-primary">LenteraPuan</span>
          </Link>
        </div>

        {/* Desktop Breadcrumbs */}
        <div className="hidden lg:block">
          <Breadcrumbs />
        </div>
      </div>

      <div className="flex items-center gap-1.5 lg:gap-3">
        {/* User Info */}
        <div className="flex items-center gap-2.5">
          <div className="text-right hidden md:block">
            <p className="text-xs font-bold text-on-surface leading-tight">
              {session?.user?.name}
            </p>
            <p className="text-[9px] text-on-surface-variant font-bold uppercase tracking-widest mt-0.5">
              {formatEnum(session?.user?.role || "")}
            </p>
          </div>
          <LogoutButtonHeader />
        </div>
      </div>
    </header>
  );
};
