import React from "react";
import { Card } from "@/components/Card";

export function StatsCard({ title, value, icon, color, trend }: any) {
  return (
    <Card className="overflow-hidden group hover:border-primary transition-all duration-300">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{title}</p>
          <h3 className="text-3xl font-bold text-on-surface group-hover:text-primary transition-colors">{value}</h3>
        </div>
        <div className={`p-3 rounded-2xl ${color}`}>
          {icon}
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-outline-variant flex items-center gap-2">
        <span className="text-xs font-medium text-on-surface-variant">{trend}</span>
      </div>
    </Card>
  );
}
