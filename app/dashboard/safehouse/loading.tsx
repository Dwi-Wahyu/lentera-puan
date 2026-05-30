import React from "react";
import { Card } from "@/components/Card";

export default function LoadingSafehouse() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-surface-container rounded-md" />
          <div className="h-4 w-96 bg-surface-container rounded-md" />
        </div>
        <div className="h-10 w-44 bg-surface-container rounded-lg" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6 space-y-4">
            <div className="h-6 w-32 bg-surface-container rounded" />
            <div className="flex justify-between">
              <div className="h-4 w-20 bg-surface-container rounded" />
              <div className="h-4 w-16 bg-surface-container rounded" />
            </div>
            <div className="h-2 w-full bg-surface-container-high rounded-full" />
            <div className="flex justify-between">
              <div className="h-5 w-20 bg-surface-container rounded-full" />
              <div className="h-4 w-24 bg-surface-container rounded" />
            </div>
            <div className="h-10 w-full bg-surface-container rounded-lg" />
          </Card>
        ))}
      </div>

      <Card className="p-6 space-y-6">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-surface-container rounded" />
          <div className="h-4 w-64 bg-surface-container rounded" />
        </div>
        <div className="py-12 border-t border-outline-variant flex justify-center">
          <div className="h-4 w-64 bg-surface-container rounded italic" />
        </div>
      </Card>
    </div>
  );
}
