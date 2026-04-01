"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import clsx from "clsx";
import type { Schedule } from "@/types";

interface EventPreviewProps {
  schedules: Schedule[];
  delay?: number;
  className?: string;
}

export function EventPreview({ schedules, delay = 0, className }: EventPreviewProps) {
  const upcomingSchedules = schedules
    .filter((s) => new Date(s.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return (
    <motion.div
      className={clsx(
        "h-full flex flex-col",
        "border border-[var(--color-primary)]/10 bg-[var(--color-bg-dark)]",
        "p-3 rounded-sm panel-corners",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-[12px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
          Event Log
        </h3>
        <svg className="w-4 h-4 text-[var(--color-primary)]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      </div>

      {/* Events */}
      <div className="flex-1 space-y-2 min-h-0">
        {upcomingSchedules.length > 0 ? (
          upcomingSchedules.map((schedule, index) => {
            const date = new Date(schedule.date);
            const month = date.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
            const day = date.getDate();
            const daysUntil = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

            return (
              <motion.div
                key={schedule.id}
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: delay + 0.05 * index }}
              >
                {/* Date Block */}
                <div
                  className={clsx(
                    "w-8 h-8 rounded-sm border flex flex-col items-center justify-center shrink-0",
                    daysUntil <= 1
                      ? "border-[var(--color-primary)]/40 shadow-[0_0_8px_var(--color-accent-glow)]"
                      : "border-[var(--color-primary)]/20 bg-[var(--color-bg-black)]"
                  )}
                >
                  <span className="text-[9px] text-[var(--color-text-secondary)]">{month}</span>
                  <span className="text-[11px] font-bold font-mono">{day}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold uppercase truncate">
                    {schedule.title}
                  </p>
                  <p className="text-[10px] text-[var(--color-text-secondary)]">
                    {date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>

                {/* D-Day */}
                {daysUntil <= 3 && (
                  <span
                    className={clsx(
                      "text-[10px] font-mono px-1 py-0.5 shrink-0",
                      daysUntil === 0
                        ? "bg-[var(--color-error)]/20 text-[var(--color-error)]"
                        : daysUntil === 1
                        ? "bg-[var(--color-warning)]/20 text-[var(--color-warning)]"
                        : "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                    )}
                  >
                    {daysUntil === 0 ? "TODAY" : `D-${daysUntil}`}
                  </span>
                )}
              </motion.div>
            );
          })
        ) : (
          <div className="flex items-center justify-center h-full opacity-50">
            <span className="text-[11px]">NO EVENTS</span>
          </div>
        )}
      </div>

      {/* View All Link */}
      <Link
        href="/schedule"
        className={clsx(
          "mt-2 py-1.5 text-center",
          "text-[11px] uppercase tracking-widest",
          "border border-[var(--color-primary)]/20",
          "hover:bg-[var(--color-primary)] hover:text-[var(--color-bg-black)]",
          "transition-all duration-300"
        )}
      >
        Full Schedule →
      </Link>
    </motion.div>
  );
}
