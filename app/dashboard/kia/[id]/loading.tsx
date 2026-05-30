import React from "react";
import { Card } from "@/components/Card";

export default function LoadingKIADetail() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 bg-surface-container rounded-lg" />
          <div className="space-y-2">
            <div className="h-8 w-48 bg-surface-container rounded-md" />
            <div className="h-4 w-32 bg-surface-container rounded-md" />
          </div>
        </div>
        <div className="h-10 w-44 bg-surface-container rounded-lg" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 border-t-4 border-t-outline-variant space-y-6 p-6">
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-surface-container" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-surface-container rounded" />
                <div className="space-y-1 flex-1">
                  <div className="h-3 w-12 bg-surface-container rounded" />
                  <div className="h-4 w-full bg-surface-container rounded" />
                </div>
              </div>
            ))}
          </div>
          <div className="h-10 w-full bg-surface-container rounded-lg" />
        </Card>

        <Card className="lg:col-span-2 p-6 space-y-6">
          <div className="space-y-2">
            <div className="h-6 w-48 bg-surface-container rounded" />
            <div className="h-4 w-64 bg-surface-container rounded" />
          </div>
          <div className="space-y-4 mt-6">
            <div className="h-8 w-full bg-surface-container-low rounded" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 w-full bg-surface-container rounded" />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
