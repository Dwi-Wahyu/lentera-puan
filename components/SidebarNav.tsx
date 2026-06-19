"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Baby,
  AlertTriangle,
  ShieldCheck,
  Calendar,
  Package,
  Users,
  Settings,
} from "lucide-react";

interface MenuItem {
  icon: React.ElementType;
  label: string;
  href: string;
  roles?: string[];
}

export const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  {
    icon: Baby,
    label: "Manajemen KIA",
    href: "/dashboard/kia",
    roles: ["SUPER_ADMIN", "DP3A"],
  },
  {
    icon: AlertTriangle,
    label: "Pelaporan Krisis",
    href: "/dashboard/krisis",
    roles: ["SUPER_ADMIN", "DP3A", "KONSELOR"],
  },
  {
    icon: ShieldCheck,
    label: "Rumah Aman",
    href: "/dashboard/safehouse",
    roles: ["SUPER_ADMIN", "DP3A"],
  },
  {
    icon: Calendar,
    label: "Jadwal Konseling",
    href: "/dashboard/konseling",
    roles: ["SUPER_ADMIN", "DP3A", "KONSELOR"],
  },
  {
    icon: Users,
    label: "Manajemen User",
    href: "/dashboard/users",
    roles: ["SUPER_ADMIN"],
  },
  {
    icon: Settings,
    label: "Pengaturan",
    href: "/dashboard/settings",
    roles: ["SUPER_ADMIN"],
  },
];

export const SidebarNav: React.FC = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="px-3 py-2 space-y-0.5">
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
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group relative ${
              active
                ? "bg-white/15 text-on-primary font-semibold shadow-sm"
                : "text-on-primary/65 hover:text-on-primary hover:bg-white/8 font-medium"
            }`}
          >
            {/* Active indicator */}
            {active && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-on-primary-container rounded-r-full" />
            )}
            <div
              className={`shrink-0 transition-all duration-150 ${
                active
                  ? "text-on-primary"
                  : "text-on-primary/50 group-hover:text-on-primary/80"
              }`}
            >
              <item.icon className="w-4 h-4" />
            </div>
            <span className="text-sm">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
