import { Card } from "@/components/Card";
import { Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatEnum } from "@/lib/formatters";

export function RecentActivities({ activities, role }: any) {
  return (
    <Card title="Aktivitas Terbaru Sistem" className="w-full col-span-3">
      <div className="space-y-6 mt-4">
        {activities && activities.length > 0 ? (
          activities.map((activity: any) => (
            <div key={activity.id} className="flex gap-4 items-start group">
              <div className="p-2 rounded-full bg-surface-container-high group-hover:bg-primary-container transition-colors mt-1">
                <Clock className="w-4 h-4 text-on-surface-variant group-hover:text-white" />
              </div>
              <div className="flex-1 border-b border-outline-variant pb-4 last:border-0">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-bold text-on-surface">
                    {activity.userName} melakukan{" "}
                    <span className="text-primary">
                      {formatEnum(activity.action)}
                    </span>
                  </p>
                  <span className="text-[10px] font-medium text-on-surface-variant uppercase bg-surface-container px-2 py-0.5 rounded">
                    {activity.resource}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant mt-2">
                  {new Date(activity.createdAt).toLocaleString("id-ID", {
                    day: "numeric",
                    month: "long",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-on-surface-variant italic">
            Belum ada rekaman aktivitas terbaru.
          </div>
        )}
        {(role === "SUPER_ADMIN" || role === "DP3A") && (
          <Link
            href="/dashboard/settings/logs"
            className="flex items-center justify-center gap-2 text-sm font-bold text-primary hover:underline pt-2"
          >
            Lihat Semua Audit Log <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </Card>
  );
}
