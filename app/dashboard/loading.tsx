import React from "react";
import { Card } from "@/components/Card";

export default function LoadingDashboard() {
  return (
    <div className="space-y-7 animate-pulse">
      <div className="flex justify-between items-end gap-4">
        <div className="space-y-2">
          <div className="h-4 w-48 bg-surface-container rounded-md" />
          <div className="h-8 w-64 bg-surface-container rounded-md" />
        </div>
        <div className="h-9 w-32 bg-surface-container rounded-lg hidden md:block" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-surface-container rounded-xl shadow-sm" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 space-y-6">
          <div className="space-y-2">
            <div className="h-6 w-48 bg-surface-container rounded" />
            <div className="h-3 w-64 bg-surface-container rounded" />
          </div>
          <div className="space-y-4 mt-6">
            <div className="h-10 w-full bg-surface-container-low rounded-lg" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 w-full bg-surface-container rounded-lg" />
            ))}
          </div>
          <div className="h-10 w-full bg-surface-container rounded-lg" />
        </Card>

        <Card className="p-6 space-y-6">
          <div className="space-y-2">
            <div className="h-6 w-48 bg-surface-container rounded" />
            <div className="h-3 w-64 bg-surface-container rounded" />
          </div>
          <div className="space-y-3 mt-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 w-full bg-surface-container rounded-lg" />
            ))}
          </div>
          <div className="h-10 w-full bg-surface-container rounded-lg" />
        </Card>
      </div>
    </div>
  );
}
