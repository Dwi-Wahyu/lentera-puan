import React from "react";
import { Card } from "@/components/Card";

export default function LoadingSettings() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-8 w-48 bg-surface-container rounded-md" />
        <div className="h-4 w-64 bg-surface-container rounded-md" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 w-full bg-surface-container rounded-lg" />
          ))}
        </div>
        <Card className="md:col-span-3 p-6 space-y-8">
          <div className="h-6 w-48 bg-surface-container rounded" />
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-32 bg-surface-container rounded" />
                <div className="h-10 w-full bg-surface-container rounded" />
              </div>
            ))}
          </div>
          <div className="flex justify-end pt-4 border-t border-outline-variant">
            <div className="h-10 w-32 bg-surface-container rounded-lg" />
          </div>
        </Card>
      </div>
    </div>
  );
}
