import React from 'react';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import SettingsClient from './SettingsClient';
import { prisma } from '@/lib/prisma';

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // Defensive check for model existence
  if (!prisma.systemConfig) {
    console.error("Prisma model 'systemConfig' is undefined at runtime!");
    return (
      <div className="p-8 text-center bg-error-container text-on-error-container rounded-xl">
        <h2 className="text-xl font-bold">Database Client Out of Sync</h2>
        <p className="mt-2">Silakan restart development server (npm run dev) untuk memuat model database terbaru.</p>
      </div>
    );
  }

  const config = await prisma.systemConfig.findUnique({
    where: { id: "default-config" },
  });

  return <SettingsClient initialConfig={config} />;
}
