import React from "react";
import { Card } from "@/components/Card";

export default function LoadingSettings() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-surface-container rounded-md" />
          <div className="h-4 w-48 bg-surface-container rounded-md" />
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Unit Config Card Skeleton */}
        <Card title="Konfigurasi Unit Kerja">
          <div className="space-y-6 mt-2">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-surface-container rounded-xl" />
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <div className="h-3 w-24 bg-surface-container rounded" />
                  <div className="h-5 w-40 bg-surface-container rounded" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-24 bg-surface-container rounded" />
                  <div className="h-5 w-32 bg-surface-container rounded" />
                </div>
              </div>
            </div>
            <div className="h-10 w-full bg-surface-container rounded-lg" />
          </div>
        </Card>

        {/* Security Card Skeleton */}
        <Card title="Keamanan Lanjutan">
          <div className="space-y-4 mt-2">
            {[1, 2].map((i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-surface-container/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-surface-container rounded" />
                  <div className="space-y-1.5">
                    <div className="h-4 w-24 bg-surface-container rounded" />
                    <div className="h-3 w-32 bg-surface-container rounded" />
                  </div>
                </div>
                <div className="h-6 w-16 bg-surface-container rounded-md" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
