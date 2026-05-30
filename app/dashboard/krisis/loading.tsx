import React from "react";
import { Card } from "@/components/Card";

export default function LoadingCrisis() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-surface-container rounded-md" />
          <div className="h-4 w-64 bg-surface-container rounded-md" />
        </div>
        <div className="h-9 w-32 bg-surface-container rounded-lg" />
      </div>

      <Card className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 h-10 bg-surface-container rounded-lg" />
          <div className="h-10 w-40 bg-surface-container rounded-lg" />
        </div>
        <div className="space-y-4">
          <div className="h-10 w-full bg-surface-container-low rounded-lg" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 w-full bg-surface-container rounded-lg" />
          ))}
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <div className="h-4 w-32 bg-surface-container rounded-md" />
        <div className="flex gap-2">
          <div className="h-8 w-24 bg-surface-container rounded-md" />
          <div className="h-8 w-24 bg-surface-container rounded-md" />
        </div>
      </div>
    </div>
  );
}
