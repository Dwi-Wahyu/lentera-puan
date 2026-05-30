"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumbs: React.FC = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(segment => segment);

  // Map segments to readable labels
  const segmentLabels: Record<string, string> = {
    dashboard: 'Dashboard',
    kia: 'KIA',
    krisis: 'Crisis',
    safehouse: 'Safe House',
    konseling: 'Counseling',
    users: 'Users',
    settings: 'Settings',
    new: 'Tambah Baru',
    edit: 'Edit',
    checkup: 'Pemeriksaan',
    kalender: 'Kalender'
  };

  return (
    <nav className="flex items-center gap-1 text-sm font-medium">
      <Link 
        href="/dashboard" 
        className="flex items-center justify-center w-6 h-6 text-on-surface-variant hover:text-primary transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>

      {pathSegments.map((segment, index) => {
        const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
        const isLast = index === pathSegments.length - 1;
        const label = segmentLabels[segment] || segment.toUpperCase().slice(0, 8);

        // Skip 'dashboard' if it's the first segment as we already have Home
        if (segment === 'dashboard' && index === 0) return null;

        return (
          <React.Fragment key={href}>
            <ChevronRight className="w-3 h-3 text-outline-variant/60" />
            <Link
              href={href}
              className={`transition-colors text-xs ${
                isLast 
                  ? 'text-primary font-semibold cursor-default pointer-events-none bg-primary/8 px-2 py-0.5 rounded-md' 
                  : 'text-on-surface-variant hover:text-primary px-1'
              }`}
            >
              {label}
            </Link>
          </React.Fragment>
        );
      })}
    </nav>
  );
};
