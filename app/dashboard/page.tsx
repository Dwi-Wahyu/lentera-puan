import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { api } from "@/lib/api";
import { SuperAdminDashboard } from "./components/SuperAdminDashboard";
import { DP3ADashboard } from "./components/DP3ADashboard";
import { PsikologDashboard } from "./components/PsikologDashboard";
import { RecentActivities } from "./components/RecentActivities";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  let stats;

  try {
    stats = await api.getDashboardStats();
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
  }

  const user = session?.user;
  const role = user?.role;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-on-surface">Selamat Datang, {user?.name || "Petugas"}!</h1>
        <p className="text-on-surface-variant mt-1">Berikut adalah ringkasan operasional LENTERA PUAN hari ini.</p>
      </div>

      {/* Role-Based Content */}
      {role === "SUPER_ADMIN" && <SuperAdminDashboard stats={stats} />}
      {role === "DP3A" && <DP3ADashboard stats={stats} />}
      {(role === "KONSELOR" || role === "PSIKOLOG") && <PsikologDashboard stats={stats} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {role === "SUPER_ADMIN" && <RecentActivities activities={stats?.recentActivities} role={role} />}
      </div>
    </div>
  );
}
