"use client";

import { Panel } from "@/components/ui";
import { motion } from "framer-motion";
import clsx from "clsx";
import type { Schedule as ScheduleType, ScheduleType as ScheduleTypeEnum } from "@/types";

interface ScheduleProps {
  schedules: ScheduleType[];
  delay?: number;
}

export function Schedule({ schedules, delay = 0 }: ScheduleProps) {
  // Sort by date and filter upcoming
  const upcomingSchedules = schedules
    .filter((s) => new Date(s.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <Panel
      title="UPCOMING SCHEDULE"
      subtitle="CALENDAR"
      delay={delay}
      className="h-full"
    >
      <div className="space-y-3">
        {upcomingSchedules.length > 0 ? (
          upcomingSchedules.map((schedule, index) => (
            <ScheduleItem
              key={schedule.id}
              schedule={schedule}
              delay={delay + 0.1 * index}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 opacity-50">
            <div className="text-2xl mb-2">📅</div>
            <div className="text-xs text-center">NO UPCOMING EVENTS</div>
          </div>
        )}
      </div>
    </Panel>
  );
}

interface ScheduleItemProps {
  schedule: ScheduleType;
  delay: number;
}

function ScheduleItem({ schedule, delay }: ScheduleItemProps) {
  const date = new Date(schedule.date);
  const daysUntil = Math.ceil(
    (date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  const typeConfig: Record<
    ScheduleTypeEnum,
    { color: string; label: string; icon: string }
  > = {
    event: {
      color: "var(--color-error)",
      label: "EVENT",
      icon: "🎉",
    },
    seminar: {
      color: "var(--color-warning)",
      label: "SEMINAR",
      icon: "📢",
    },
    study: {
      color: "var(--color-success)",
      label: "STUDY",
      icon: "📚",
    },
    meeting: {
      color: "var(--color-info)",
      label: "MEETING",
      icon: "🤝",
    },
  };

  const config = typeConfig[schedule.type];

  return (
    <motion.div
      className="flex gap-2 sm:gap-3 p-2 border border-[var(--color-accent-dim)] hover:border-[var(--color-accent-glow)] transition-colors active:bg-[var(--color-accent-dim)] active:bg-opacity-20"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      {/* Date Block */}
      <div className="flex flex-col items-center justify-center w-10 sm:w-12 py-1 border-r border-[var(--color-accent-dim)] flex-shrink-0">
        <span className="text-base sm:text-lg font-bold leading-none">
          {date.getDate()}
        </span>
        <span className="text-[8px] sm:text-[9px] uppercase tracking-wider opacity-50">
          {date.toLocaleDateString("en-US", { month: "short" })}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Type Badge & D-day for mobile */}
        <div className="flex items-center gap-1.5 sm:gap-2 mb-1 flex-wrap">
          <span
            className="text-[8px] sm:text-[9px] uppercase tracking-wider px-1 sm:px-1.5 py-0.5 border"
            style={{
              borderColor: config.color,
              color: config.color,
            }}
          >
            {config.label}
          </span>
          {daysUntil <= 3 && daysUntil >= 0 && (
            <motion.span
              className="text-[8px] sm:text-[9px] uppercase tracking-wider px-1 sm:px-1.5 py-0.5 bg-[var(--color-error)] bg-opacity-20 text-[var(--color-error)]"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              D-{daysUntil}
            </motion.span>
          )}
          {/* D-day on mobile (inline with badges) */}
          <span
            className={clsx(
              "sm:hidden text-[9px] font-mono ml-auto",
              daysUntil === 0 && "text-[var(--color-error)]",
              daysUntil === 1 && "text-[var(--color-warning)]",
              daysUntil > 1 && "opacity-50"
            )}
          >
            {daysUntil === 0 ? "TODAY" : `D-${daysUntil}`}
          </span>
        </div>

        {/* Title */}
        <div className="text-xs sm:text-sm truncate mb-1">{schedule.title}</div>

        {/* Details */}
        <div className="flex items-center gap-2 sm:gap-3 text-[9px] sm:text-[10px] opacity-50">
          <span>
            {date.toLocaleTimeString("ko-KR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {schedule.location && (
            <>
              <span>•</span>
              <span className="truncate">{schedule.location}</span>
            </>
          )}
        </div>
      </div>

      {/* D-Day Counter (for larger screens) */}
      <div className="hidden sm:flex flex-col items-center justify-center px-2">
        <span
          className={clsx(
            "text-lg font-mono",
            daysUntil === 0 && "text-[var(--color-error)] glow",
            daysUntil === 1 && "text-[var(--color-warning)]",
            daysUntil > 1 && "opacity-70"
          )}
        >
          {daysUntil === 0 ? "TODAY" : `D-${daysUntil}`}
        </span>
      </div>
    </motion.div>
  );
}
