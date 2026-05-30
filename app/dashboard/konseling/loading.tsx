import React from "react";
import { Card } from "@/components/Card";

export default function LoadingCounseling() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-surface-container rounded-md" />
          <div className="h-4 w-64 bg-surface-container rounded-md" />
        </div>
        <div className="h-9 w-32 bg-surface-container rounded-lg" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3 p-6 space-y-6">
          <div className="space-y-2">
            <div className="h-6 w-48 bg-surface-container rounded" />
            <div className="h-3 w-32 bg-surface-container rounded" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 w-full bg-surface-container rounded-xl" />
            ))}
          </div>
        </Card>

        <Card className="p-6 space-y-6">
          <div className="h-6 w-32 bg-surface-container rounded" />
          <div className="h-24 w-full bg-surface-container rounded-xl" />
          <div className="space-y-4">
            <div className="h-16 w-full bg-surface-container rounded-lg" />
            <div className="h-16 w-full bg-surface-container rounded-lg" />
          </div>
        </Card>
      </div>
    </div>
  );
}
