import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function QuickActionLink({ href, label, icon }: any) {
  return (
    <Link 
      href={href} 
      className="flex items-center justify-between p-3 rounded-xl border border-outline-variant hover:border-primary hover:bg-primary-container/10 transition-all group"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-surface-container-high group-hover:text-primary transition-colors">
          {icon}
        </div>
        <span className="text-sm font-bold text-on-surface">{label}</span>
      </div>
      <ArrowRight className="w-4 h-4 text-on-surface-variant group-hover:translate-x-1 transition-transform" />
    </Link>
  );
}
