import React from 'react';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import SettingsClient from './SettingsClient';
import { api } from "@/lib/api";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  let config;
  try {
    config = await api.getConfig();
  } catch (error) {
    console.error("Failed to fetch system config:", error);
    config = null;
  }

  return <SettingsClient initialConfig={config} />;
}
