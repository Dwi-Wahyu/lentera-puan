import React from "react";
import { Card } from "@/components/Card";
import { ArrowUpRight } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend: string;
  label?: string;
  labelColor?: string;
  trendColor?: string;
  variant?: "primary" | "error" | "secondary" | "tertiary" | "info";
}

export function StatsCard({
  title,
  value,
  icon,
  color,
  trend,
  label,
  labelColor = "bg-surface-container-high text-on-surface-variant",
  trendColor = "text-on-surface-variant",
  variant = "primary",
}: StatsCardProps) {
  // Map variant to background colors if needed, but we can also use passed props
  const bgStyles: Record<string, string> = {
    primary: "bg-gradient-to-br from-white to-primary/5",
    error: "bg-gradient-to-br from-white to-error/5",
    secondary: "bg-gradient-to-br from-white to-secondary/5",
    tertiary: "bg-gradient-to-br from-white to-tertiary/5",
    info: "bg-gradient-to-br from-white to-blue-500/5",
  };

  return (
    <Card
      className={`relative overflow-hidden group border-outline-variant/50 transition-all duration-300 hover:shadow-lg hover:border-primary/30 p-5 ${bgStyles[variant] || "bg-white"}`}
    >
      {/* Watermark Icon */}
      <div className="absolute -right-4 -bottom-4 text-on-surface/3 group-hover:text-primary/5 transition-colors duration-500">
        {React.cloneElement(icon as React.ReactElement)}
      </div>

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex justify-between items-start mb-4">
          <div
            className={`p-2.5 rounded-full ${color} shadow-sm group-hover:scale-110 transition-transform duration-300`}
          >
            {React.cloneElement(icon as React.ReactElement)}
          </div>
          {label && (
            <span
              className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${labelColor}`}
            >
              {label}
            </span>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-extrabold text-on-surface-variant/80 uppercase tracking-[0.15em]">
            {title}
          </p>
          <h3 className="text-4xl font-black text-on-surface tracking-tight">
            {value}
          </h3>
        </div>

        <div
          className={`mt-4 flex items-center gap-1.5 text-xs font-semibold ${trendColor}`}
        >
          {variant === "primary" && (
            <ArrowUpRight size={14} className="shrink-0" />
          )}
          <span>{trend}</span>
        </div>
      </div>
    </Card>
  );
}
