"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  LayoutDashboard, 
  Baby, 
  AlertTriangle, 
  ShieldCheck, 
  Calendar, 
  Package, 
  Users, 
  Settings
} from 'lucide-react';

interface MenuItem {
  icon: React.ElementType;
  label: string;
  href: string;
  roles?: string[];
}

export const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: 'Ringkasan', href: '/dashboard' },
  { icon: Baby, label: 'Manajemen KIA', href: '/dashboard/kia' },
  { icon: AlertTriangle, label: 'Pelaporan Krisis', href: '/dashboard/krisis' },
  { icon: ShieldCheck, label: 'Rumah Aman', href: '/dashboard/safehouse' },
  { icon: Calendar, label: 'Jadwal Konseling', href: '/dashboard/konseling' },
  { icon: Package, label: 'Logistik PMT', href: '/dashboard/logistik' },
  { icon: Users, label: 'Manajemen User', href: '/dashboard/users', roles: ['ADMIN'] },
  { icon: Settings, label: 'Pengaturan', href: '/dashboard/settings', roles: ['ADMIN'] },
];

export const SidebarNav: React.FC = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="p-6 space-y-1">
      {menuItems.map((item) => {
        // Role check
        if (item.roles && (!userRole || !item.roles.includes(userRole))) {
          return null;
        }

        const active = isActive(item.href);
        
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all font-medium group ${
              active 
                ? 'bg-primary-container text-on-primary shadow-sm' 
                : 'text-on-primary hover:bg-primary-container/50'
            }`}
          >
            <item.icon className={`w-5 h-5 transition-colors ${
              active ? 'text-on-primary' : 'text-on-primary/70 group-hover:text-on-primary'
            }`} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};
