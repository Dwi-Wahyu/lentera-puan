import React from "react";
import { Card } from "@/components/Card";

export default function LoadingCrisisDetail() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 bg-surface-container rounded-lg" />
          <div className="space-y-2">
            <div className="h-8 w-64 bg-surface-container rounded-md" />
            <div className="h-4 w-96 bg-surface-container rounded-md" />
          </div>
        </div>
        <div className="h-10 w-44 bg-surface-container rounded-lg" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 border-t-4 border-t-outline-variant space-y-6 p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="h-3 w-20 bg-surface-container rounded" />
              <div className="h-8 w-32 bg-surface-container rounded" />
            </div>
            <div className="w-10 h-10 bg-surface-container rounded-lg" />
          </div>
          <div className="space-y-4 pt-4 border-t border-outline-variant">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-surface-container rounded" />
                <div className="space-y-1 flex-1">
                  <div className="h-3 w-16 bg-surface-container rounded" />
                  <div className="h-4 w-full bg-surface-container rounded" />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2 p-6 space-y-6">
          <div className="space-y-2">
            <div className="h-6 w-48 bg-surface-container rounded" />
            <div className="h-4 w-full bg-surface-container rounded" />
            <div className="h-4 w-full bg-surface-container rounded" />
            <div className="h-4 w-2/3 bg-surface-container rounded" />
          </div>
          <div className="mt-8 space-y-4">
            <div className="h-6 w-40 bg-surface-container rounded" />
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-surface-container rounded-lg" />
              ))}
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 space-y-6">
        <div className="h-6 w-64 bg-surface-container rounded" />
        <div className="space-y-8 mt-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 pl-4 border-l-2 border-surface-container relative">
              <div className="absolute -left-1.5 top-0 w-2.5 h-2.5 rounded-full bg-surface-container" />
              <div className="space-y-2 flex-1">
                <div className="h-3 w-32 bg-surface-container rounded" />
                <div className="h-4 w-full bg-surface-container rounded" />
                <div className="h-3 w-40 bg-surface-container rounded" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
