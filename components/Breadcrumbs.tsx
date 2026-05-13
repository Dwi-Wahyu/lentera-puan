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
    logistik: 'Logistics',
    users: 'Users',
    settings: 'Settings',
    new: 'Tambah Baru',
    edit: 'Edit',
    checkup: 'Pemeriksaan',
    kalender: 'Kalender'
  };

  return (
    <nav className="flex items-center gap-2 text-sm font-medium">
      <Link 
        href="/dashboard" 
        className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors"
      >
        <Home className="w-4 h-4" />
      </Link>

      {pathSegments.map((segment, index) => {
        const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
        const isLast = index === pathSegments.length - 1;
        const label = segmentLabels[segment] || segment.toUpperCase().slice(0, 8);

        // Skip 'dashboard' if it's the first segment as we already have Home
        if (segment === 'dashboard' && index === 0) return null;

        return (
          <React.Fragment key={href}>
            <ChevronRight className="w-4 h-4 text-outline-variant" />
            <Link
              href={href}
              className={`transition-colors ${
                isLast 
                  ? 'text-primary font-bold cursor-default pointer-events-none' 
                  : 'text-on-surface-variant hover:text-primary'
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
