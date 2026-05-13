import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { SidebarProvider } from '@/components/providers/sidebar-provider';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-surface">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="flex-1 p-5 lg:p-8 space-y-0">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
